import 'dart:async';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geocoding/geocoding.dart';
import 'package:geolocator/geolocator.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../constants/app_constants.dart';
import '../utils/supabase_client.dart';

/// Riverpod provider for LocationService
final locationServiceProvider = Provider<LocationService>((ref) {
  return LocationService(supabase);
});

/// Service managing device GPS location, geocoding, and background tracking for workers.
class LocationService {
  final SupabaseClient _client;
  StreamSubscription<Position>? _positionSubscription;
  DateTime? _lastUploadTime;

  LocationService([SupabaseClient? client]) : _client = client ?? supabase;

  /// Check whether location permissions are granted.
  Future<bool> checkPermission() async {
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return false;
    }

    final permission = await Geolocator.checkPermission();
    return permission == LocationPermission.always ||
        permission == LocationPermission.whileInUse;
  }

  /// Request location permissions from the user.
  Future<bool> requestPermission() async {
    final serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      return false;
    }

    var permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        return false;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      return false;
    }

    return permission == LocationPermission.always ||
        permission == LocationPermission.whileInUse;
  }

  /// Fetches the current location coordinates.
  Future<LatLng?> getCurrentLocation() async {
    final hasPermission = await checkPermission();
    if (!hasPermission) {
      final granted = await requestPermission();
      if (!granted) return null;
    }

    try {
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(
          accuracy: LocationAccuracy.high,
          timeLimit: Duration(seconds: 15),
        ),
      );
      return LatLng(position.latitude, position.longitude);
    } catch (e) {
      debugPrint('Error getting current location: $e');
      return null;
    }
  }

  /// Starts real-time location tracking for a worker and streams updates to Supabase.
  Future<void> startLocationTracking(String workerId) async {
    final hasPermission = await checkPermission();
    if (!hasPermission) {
      final granted = await requestPermission();
      if (!granted) return;
    }

    await stopLocationTracking();

    const locationSettings = LocationSettings(
      accuracy: LocationAccuracy.high,
      distanceFilter: 20, // Minimum distance change in meters before triggering
    );

    _positionSubscription = Geolocator.getPositionStream(
      locationSettings: locationSettings,
    ).listen((Position position) async {
      // Throttle upload interval to at least every 10 seconds
      final now = DateTime.now();
      if (_lastUploadTime != null &&
          now.difference(_lastUploadTime!).inSeconds < 10) {
        return;
      }
      _lastUploadTime = now;

      try {
        // Record worker location trail
        await _client.from(SupabaseTables.workerLocations).insert({
          'worker_id': workerId,
          'latitude': position.latitude,
          'longitude': position.longitude,
          'heading': position.heading,
          'speed': position.speed,
          'created_at': now.toIso8601String(),
        });

        // Update worker profile with most recent live coordinates
        await _client.from(SupabaseTables.workerProfiles).update({
          'current_location_latitude': position.latitude,
          'current_location_longitude': position.longitude,
          'updated_at': now.toIso8601String(),
        }).eq('user_id', workerId);
      } catch (e) {
        debugPrint('Error uploading worker location: $e');
      }
    });
  }

  /// Stops ongoing location tracking stream.
  Future<void> stopLocationTracking() async {
    await _positionSubscription?.cancel();
    _positionSubscription = null;
  }

  /// Reverse geocodes latitude and longitude into a readable Pakistani street address.
  Future<String> getAddressFromLatLng(double lat, double lng) async {
    try {
      final placemarks = await placemarkFromCoordinates(lat, lng);
      if (placemarks.isNotEmpty) {
        final place = placemarks.first;
        final parts = <String>[];

        if (place.street != null && place.street!.trim().isNotEmpty) {
          parts.add(place.street!.trim());
        }
        if (place.subLocality != null && place.subLocality!.trim().isNotEmpty) {
          parts.add(place.subLocality!.trim());
        }
        if (place.locality != null && place.locality!.trim().isNotEmpty) {
          parts.add(place.locality!.trim());
        }
        if (place.administrativeArea != null &&
            place.administrativeArea!.trim().isNotEmpty) {
          parts.add(place.administrativeArea!.trim());
        }

        if (parts.isNotEmpty) {
          return parts.join(', ');
        }
      }
      return 'Location: ${lat.toStringAsFixed(4)}, ${lng.toStringAsFixed(4)}';
    } catch (e) {
      debugPrint('Geocoding error: $e');
      return 'Lat: ${lat.toStringAsFixed(4)}, Lng: ${lng.toStringAsFixed(4)}';
    }
  }
}

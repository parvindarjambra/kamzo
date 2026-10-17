import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:geolocator/geolocator.dart';
import '../../../core/theme/app_colors.dart';
import '../models/service_item.dart';
import 'booking_confirmation_screen.dart';

/// Screen 7: Location Selection Screen
/// Allows the customer to select precise location via Google Maps, search address,
/// geolocate to current GPS position, select Pakistani city, and input detailed address.
class LocationSelectionScreen extends ConsumerStatefulWidget {
  final ServiceItem? service;
  final String? problemDescription;
  final String? requestType;

  const LocationSelectionScreen({
    super.key,
    this.service,
    this.problemDescription,
    this.requestType,
  });

  @override
  ConsumerState<LocationSelectionScreen> createState() => _LocationSelectionScreenState();
}

class _LocationSelectionScreenState extends ConsumerState<LocationSelectionScreen> {
  GoogleMapController? _mapController;
  final TextEditingController _searchController = TextEditingController();
  final TextEditingController _addressController =
      TextEditingController(text: 'House 42, Street 8, Block G');
  final TextEditingController _landmarkController =
      TextEditingController(text: 'Near Jamia Masjid & Commercial Market');

  // Default coordinate: Lahore, Pakistan
  static const LatLng _defaultLocation = LatLng(31.5204, 74.3587);
  LatLng _currentSelectedLatLng = _defaultLocation;
  bool _isLocating = false;

  final List<String> _pakistaniCities = const [
    'Lahore',
    'Karachi',
    'Islamabad',
    'Rawalpindi',
    'Faisalabad',
    'Multan',
    'Peshawar',
    'Gujranwala',
    'Sialkot',
    'Quetta',
  ];
  late String _selectedCity;

  @override
  void initState() {
    super.initState();
    _selectedCity = _pakistaniCities.first;
  }

  @override
  void dispose() {
    _searchController.dispose();
    _addressController.dispose();
    _landmarkController.dispose();
    _mapController?.dispose();
    super.dispose();
  }

  Future<void> _useCurrentLocation() async {
    setState(() => _isLocating = true);
    try {
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }

      if (permission == LocationPermission.whileInUse ||
          permission == LocationPermission.always) {
        final position = await Geolocator.getCurrentPosition(
          desiredAccuracy: LocationAccuracy.high,
          timeLimit: const Duration(seconds: 10),
        );

        final newLatLng = LatLng(position.latitude, position.longitude);
        setState(() {
          _currentSelectedLatLng = newLatLng;
        });

        _mapController?.animateCamera(
          CameraUpdate.newCameraPosition(
            CameraPosition(target: newLatLng, zoom: 16),
          ),
        );

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Current location pinned successfully!',
              style: TextStyle(fontFamily: 'Poppins'),
            ),
            backgroundColor: AppColors.primary,
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Location permission denied. Please pick location manually.',
              style: TextStyle(fontFamily: 'Poppins'),
            ),
          ),
        );
      }
    } catch (e) {
      debugPrint('Location detection exception: $e');
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Could not determine GPS. Pinned to default city center.',
            style: TextStyle(fontFamily: 'Poppins'),
          ),
        ),
      );
    } finally {
      if (mounted) {
        setState(() => _isLocating = false);
      }
    }
  }

  void _onConfirmLocation() {
    final address = _addressController.text.trim();
    if (address.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Please enter your house and street address.'),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    final fullAddress =
        '$address, ${_landmarkController.text.trim()}, $_selectedCity';

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => BookingConfirmationScreen(
          service: widget.service ?? ServiceItem.defaultServices.first,
          problemDescription: widget.problemDescription ?? 'General inspection',
          address: fullAddress,
          city: _selectedCity,
          latitude: _currentSelectedLatLng.latitude,
          longitude: _currentSelectedLatLng.longitude,
          requestType: widget.requestType ?? 'Urgent Dispatch',
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0.5,
        title: const Text(
          'Select Service Location',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 18,
            fontWeight: FontWeight.w700,
            color: AppColors.charcoal,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.charcoal),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Map Area with Overlaid Search and Center Pin
            Expanded(
              flex: 4,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  // Google Map View
                  GoogleMap(
                    initialCameraPosition: CameraPosition(
                      target: _defaultLocation,
                      zoom: 14.5,
                    ),
                    onMapCreated: (controller) {
                      _mapController = controller;
                    },
                    onCameraMove: (position) {
                      _currentSelectedLatLng = position.target;
                    },
                    myLocationEnabled: true,
                    myLocationButtonEnabled: false,
                    zoomControlsEnabled: false,
                    compassEnabled: true,
                  ),

                  // Center Pin Indicator
                  IgnorePointer(
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 36.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 10,
                              vertical: 4,
                            ),
                            decoration: BoxDecoration(
                              color: AppColors.charcoal,
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: const Text(
                              'Service Location',
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: AppColors.white,
                              ),
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Icon(
                            Icons.location_pin,
                            size: 46,
                            color: AppColors.primary,
                          ),
                        ],
                      ),
                    ),
                  ),

                  // Top Search Input Box Overlaid on Map
                  Positioned(
                    top: 14,
                    left: 16,
                    right: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: const [
                          BoxShadow(
                            color: Color(0x22000000),
                            blurRadius: 10,
                            offset: Offset(0, 3),
                          ),
                        ],
                      ),
                      child: TextField(
                        controller: _searchController,
                        decoration: const InputDecoration(
                          hintText: 'Search area, sector or landmark...',
                          hintStyle: TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 13,
                            color: AppColors.grayLight,
                          ),
                          prefixIcon: Icon(Icons.search, color: AppColors.primary),
                          border: InputBorder.none,
                        ),
                      ),
                    ),
                  ),

                  // Floating "Use My Current Location" button
                  Positioned(
                    bottom: 16,
                    right: 16,
                    child: FloatingActionButton.extended(
                      heroTag: 'gps_btn',
                      backgroundColor: AppColors.white,
                      foregroundColor: AppColors.primary,
                      elevation: 4,
                      onPressed: _isLocating ? null : _useCurrentLocation,
                      icon: _isLocating
                          ? const SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.my_location_rounded, size: 20),
                      label: const Text(
                        'My Location',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 12.5,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Bottom Address Details Form Area
            Expanded(
              flex: 5,
              child: Container(
                decoration: const BoxDecoration(
                  color: AppColors.white,
                  borderRadius: BorderRadius.only(
                    topLeft: Radius.circular(24),
                    topRight: Radius.circular(24),
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Color(0x15000000),
                      blurRadius: 14,
                      offset: Offset(0, -3),
                    ),
                  ],
                ),
                child: SingleChildScrollView(
                  padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 18.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      // City Selection Dropdown
                      Row(
                        children: [
                          const Text(
                            'City (شہر):',
                            style: TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 13.5,
                              fontWeight: FontWeight.w700,
                              color: AppColors.charcoal,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14),
                              decoration: BoxDecoration(
                                color: AppColors.background,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppColors.border),
                              ),
                              child: DropdownButtonHideUnderline(
                                child: DropdownButton<String>(
                                  value: _selectedCity,
                                  isExpanded: true,
                                  icon: const Icon(
                                    Icons.keyboard_arrow_down_rounded,
                                    color: AppColors.primary,
                                  ),
                                  style: const TextStyle(
                                    fontFamily: 'Poppins',
                                    fontSize: 14,
                                    fontWeight: FontWeight.w600,
                                    color: AppColors.charcoal,
                                  ),
                                  onChanged: (newCity) {
                                    if (newCity != null) {
                                      setState(() => _selectedCity = newCity);
                                    }
                                  },
                                  items: _pakistaniCities.map((city) {
                                    return DropdownMenuItem<String>(
                                      value: city,
                                      child: Text(city),
                                    );
                                  }).toList(),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),

                      // House / Street Address Input
                      const Text(
                        'Street & House Address',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.charcoal,
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _addressController,
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 14,
                          color: AppColors.charcoal,
                        ),
                        decoration: InputDecoration(
                          hintText: 'e.g. House # 12, Street 4, Phase 5',
                          hintStyle: const TextStyle(
                            fontFamily: 'Poppins',
                            color: AppColors.grayLight,
                          ),
                          prefixIcon: const Icon(Icons.home_outlined, color: AppColors.accent),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 14,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: AppColors.border),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: AppColors.border),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: AppColors.primary, width: 1.8),
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),

                      // Nearby Landmark
                      const Text(
                        'Nearby Landmark (قریبی مشہور جگہ)',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: AppColors.charcoal,
                        ),
                      ),
                      const SizedBox(height: 6),
                      TextField(
                        controller: _landmarkController,
                        style: const TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 14,
                          color: AppColors.charcoal,
                        ),
                        decoration: InputDecoration(
                          hintText: 'e.g. Near Shell Pump / Gourmet Bakery',
                          hintStyle: const TextStyle(
                            fontFamily: 'Poppins',
                            color: AppColors.grayLight,
                          ),
                          prefixIcon: const Icon(Icons.flag_outlined, color: AppColors.accent),
                          contentPadding: const EdgeInsets.symmetric(
                            horizontal: 14,
                            vertical: 14,
                          ),
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: AppColors.border),
                          ),
                          enabledBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: AppColors.border),
                          ),
                          focusedBorder: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                            borderSide: const BorderSide(color: AppColors.primary, width: 1.8),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // Confirm Location Button
                      SizedBox(
                        height: AppColors.buttonHeight,
                        child: ElevatedButton(
                          onPressed: _onConfirmLocation,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppColors.primary,
                            foregroundColor: AppColors.white,
                            elevation: 2,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(
                                AppColors.cardBorderRadius,
                              ),
                            ),
                          ),
                          child: const Text(
                            'Confirm Location',
                            style: TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 16.5,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.5,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

import 'dart:io';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:path/path.dart' as p;
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:uuid/uuid.dart';
import '../constants/app_constants.dart';
import '../utils/supabase_client.dart';

/// Storage service provider
final storageServiceProvider = Provider<StorageService>((ref) {
  return StorageService(supabase);
});

/// Supabase Storage service handling file and image uploads.
class StorageService {
  final SupabaseClient _client;
  static const _uuid = Uuid();

  StorageService([SupabaseClient? client]) : _client = client ?? supabase;

  /// Uploads any image to the specified bucket and path, returning the public URL.
  Future<String> uploadImage({
    required String bucket,
    required File file,
    required String path,
  }) async {
    try {
      final fileExt = p.extension(file.path);
      final finalPath = path.endsWith(fileExt) ? path : '$path$fileExt';

      await _client.storage.from(bucket).upload(
            finalPath,
            file,
            fileOptions: const FileOptions(
              upsert: true,
              cacheControl: '3600',
            ),
          );

      final publicUrl = _client.storage.from(bucket).getPublicUrl(finalPath);
      return publicUrl;
    } catch (e) {
      throw Exception('Failed to upload image to bucket $bucket: $e');
    }
  }

  /// Uploads customer payment proof screenshot (JazzCash, Easypaisa, Bank transfer).
  Future<String> uploadPaymentProof(File file) async {
    final fileName = 'payment_${_uuid.v4()}';
    final path = 'payments/$fileName';
    return uploadImage(
      bucket: AppConstants.bookingAttachmentsBucket,
      file: file,
      path: path,
    );
  }

  /// Uploads worker commission payment transfer screenshot.
  Future<String> uploadCommissionScreenshot(File file) async {
    final fileName = 'commission_${_uuid.v4()}';
    final path = 'commissions/$fileName';
    return uploadImage(
      bucket: AppConstants.bookingAttachmentsBucket,
      file: file,
      path: path,
    );
  }

  /// Uploads user profile avatar photo.
  Future<String> uploadProfilePhoto(File file, String userId) async {
    final fileExt = p.extension(file.path).replaceAll('.', '');
    final extension = fileExt.isNotEmpty ? fileExt : 'jpg';
    final path = '$userId/avatar_${DateTime.now().millisecondsSinceEpoch}.$extension';
    return uploadImage(
      bucket: AppConstants.avatarsBucket,
      file: file,
      path: path,
    );
  }

  /// Uploads worker documents (CNIC front/back, police verification, certifications).
  Future<String> uploadWorkerDocument(
    File file,
    String userId,
    String docType,
  ) async {
    final fileExt = p.extension(file.path).replaceAll('.', '');
    final extension = fileExt.isNotEmpty ? fileExt : 'jpg';
    final bucket = docType.toLowerCase().contains('cnic')
        ? AppConstants.cnicBucket
        : AppConstants.workerCertificatesBucket;
    final path = '$userId/${docType}_${DateTime.now().millisecondsSinceEpoch}.$extension';

    return uploadImage(
      bucket: bucket,
      file: file,
      path: path,
    );
  }
}

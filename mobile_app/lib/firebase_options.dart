// File generated for KAMZO Flutter Firebase configuration.
// Replace with `flutterfire configure` output when connecting live Firebase project.
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        return macos;
      case TargetPlatform.windows:
        return windows;
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyPlaceholderWebApiKeyKAMZO12345',
    appId: '1:1234567890:web:abcdef123456',
    messagingSenderId: '1234567890',
    projectId: 'kamzo-pk',
    authDomain: 'kamzo-pk.firebaseapp.com',
    storageBucket: 'kamzo-pk.appspot.com',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyPlaceholderAndroidApiKeyKAMZO12',
    appId: '1:1234567890:android:abcdef123456',
    messagingSenderId: '1234567890',
    projectId: 'kamzo-pk',
    storageBucket: 'kamzo-pk.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyPlaceholderIosApiKeyKAMZO123456',
    appId: '1:1234567890:ios:abcdef123456',
    messagingSenderId: '1234567890',
    projectId: 'kamzo-pk',
    storageBucket: 'kamzo-pk.appspot.com',
    iosBundleId: 'com.kamzo.app',
  );

  static const FirebaseOptions macos = FirebaseOptions(
    apiKey: 'AIzaSyPlaceholderIosApiKeyKAMZO123456',
    appId: '1:1234567890:ios:abcdef123456',
    messagingSenderId: '1234567890',
    projectId: 'kamzo-pk',
    storageBucket: 'kamzo-pk.appspot.com',
    iosBundleId: 'com.kamzo.app',
  );

  static const FirebaseOptions windows = FirebaseOptions(
    apiKey: 'AIzaSyPlaceholderWindowsApiKeyKAMZO12',
    appId: '1:1234567890:web:abcdef123456windows',
    messagingSenderId: '1234567890',
    projectId: 'kamzo-pk',
    storageBucket: 'kamzo-pk.appspot.com',
  );
}

/// Form input validators tailored for the KAMZO Pakistan marketplace application.
class Validators {
  Validators._();

  /// Validates Pakistani phone numbers.
  /// Accepts formats:
  /// - `03001234567` (11 digits starting with 03)
  /// - `+923001234567` (+92 followed by 10 digits starting with 3)
  /// - `923001234567`
  /// - With optional spaces or dashes: `0300-1234567`, `+92 300 1234567`
  static String? validatePhone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Phone number is required';
    }

    final cleaned = value.replaceAll(RegExp(r'[\s\-]'), '');
    final pkPhoneRegex = RegExp(r'^((\+92)|(92)|(0))?3[0-9]{9}$');

    if (!pkPhoneRegex.hasMatch(cleaned)) {
      return 'Enter a valid Pakistani phone number (e.g. 03001234567)';
    }

    return null;
  }

  /// Validates user password (minimum 8 characters).
  static String? validatePassword(String? value) {
    if (value == null || value.isEmpty) {
      return 'Password is required';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    return null;
  }

  /// Validates generic required field with customizable field label.
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }
    return null;
  }

  /// Validates Pakistani National Identity Card (CNIC) format:
  /// Standard: `XXXXX-XXXXXXX-X` (13 digits total)
  /// Also permits raw 13 digits: `1234512345671`
  static String? validateCNIC(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'CNIC number is required';
    }

    final cleaned = value.trim();
    final cnicWithDashesRegex = RegExp(r'^[0-9]{5}-[0-9]{7}-[0-9]{1}$');
    final cnicRawRegex = RegExp(r'^[0-9]{13}$');

    if (!cnicWithDashesRegex.hasMatch(cleaned) && !cnicRawRegex.hasMatch(cleaned)) {
      return 'Enter valid CNIC (e.g. 42101-1234567-1)';
    }

    return null;
  }

  /// Validates that amount is a positive number greater than 0.
  static String? validateAmount(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Amount is required';
    }

    final parsed = double.tryParse(value.replaceAll(',', '').trim());
    if (parsed == null) {
      return 'Please enter a valid numeric amount';
    }
    if (parsed <= 0) {
      return 'Amount must be greater than zero';
    }

    return null;
  }

  /// Validates email address format.
  static String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return 'Email address is required';
    }

    final emailRegex = RegExp(
      r'^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$',
    );

    if (!emailRegex.hasMatch(value.trim())) {
      return 'Please enter a valid email address';
    }

    return null;
  }
}

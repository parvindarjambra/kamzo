import 'package:flutter/material.dart';

/// Design system colors for the KAMZO Pakistan marketplace application.
class AppColors {
  AppColors._();

  // Primary brand palette (MedicoEngineer Theme)
  static const Color primary = Color(0xFF0062FF); // Royal Electric Blue
  static const Color primaryDark = Color(0xFF004AD6);
  static const Color accent = Color(0xFF0A1128); // Deep Tech Navy
  static const Color lightGreen = Color(0xFFEFF6FF); // Soft Ice Blue
  static const Color greenTint = Color(0xFFDBEAFE);
  static const Color lightBlue = Color(0xFFEFF6FF);
  static const Color blueTint = Color(0xFFDBEAFE);

  // Neutrals
  static const Color white = Colors.white;
  static const Color background = Color(0xFFF8FAFC);
  static const Color charcoal = Color(0xFF212121);
  static const Color gray = Color(0xFF757575);
  static const Color grayLight = Color(0xFFBDBDBD);
  static const Color border = Color(0xFFE0E0E0);
  static const Color surface = Color(0xFFFFFFFF);

  // Status & Feedback
  static const Color error = Color(0xFFD32F2F);
  static const Color warning = Color(0xFFF57C00);
  static const Color info = Color(0xFF0288D1);
  static const Color success = Color(0xFF2E7D32);
  static const Color starGold = Color(0xFFFFB300);

  // Pakistani Wallets
  static const Color jazzCashRed = Color(0xFFD32F2F);
  static const Color easypaisaGreen = Color(0xFF00C853);

  // Standard metrics
  static const double cardBorderRadius = 16.0;
  static const double buttonHeight = 56.0;
}

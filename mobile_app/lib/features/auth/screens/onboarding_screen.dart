import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/constants/app_routes.dart';

/// Screen 2: Onboarding Screen
/// 3-page onboarding highlighting service workers, fast booking, and NADRA verification.
class OnboardingScreen extends ConsumerStatefulWidget {
  const OnboardingScreen({super.key});

  @override
  ConsumerState<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends ConsumerState<OnboardingScreen> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  final List<_OnboardingItem> _pages = const [
    _OnboardingItem(
      title: 'Find Trusted Service Workers',
      urduSubtitle: 'قابل بھروسہ کاریگر، ایک کلک پر',
      description:
          'Connect with pre-screened, verified professionals for vehicle repair, AC servicing, plumbing, and electrical works right across your city.',
      badgeText: 'Skilled Pakistani Workers',
      pageType: _IllustrationType.workers,
    ),
    _OnboardingItem(
      title: 'Book in Minutes',
      urduSubtitle: 'منٹوں میں آسان بکنگ',
      description:
          'Simple 3-step booking with a flat Rs. 200 visit charge. Describe your problem, set your location, and an expert will arrive at your doorstep.',
      badgeText: 'Flat Rs. 200 Visit Fee',
      pageType: _IllustrationType.booking,
    ),
    _OnboardingItem(
      title: 'Safe & Verified',
      urduSubtitle: 'محفوظ اور تصدیق شدہ سروس',
      description:
          'NADRA CNIC verification, background screening, transparent pricing, and direct cash payment upon your complete satisfaction.',
      badgeText: '100% Verified Profiles',
      pageType: _IllustrationType.security,
    ),
  ];

  void _onNextPressed() {
    if (_currentPage < _pages.length - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOut,
      );
    } else {
      _finishOnboarding();
    }
  }

  void _finishOnboarding() {
    context.go(AppRoutes.login);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isLastPage = _currentPage == _pages.length - 1;

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        actions: [
          if (!isLastPage)
            TextButton(
              onPressed: _finishOnboarding,
              child: const Text(
                'Skip',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: AppColors.gray,
                ),
              ),
            ),
          const SizedBox(width: 12),
        ],
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Page view area
            Expanded(
              child: PageView.builder(
                controller: _pageController,
                itemCount: _pages.length,
                onPageChanged: (index) {
                  setState(() => _currentPage = index);
                },
                itemBuilder: (context, index) {
                  return _buildPageContent(_pages[index]);
                },
              ),
            ),

            // Bottom indicators and action button
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
              child: Column(
                children: [
                  // Smooth page indicator dots
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: List.generate(
                      _pages.length,
                      (index) => _buildIndicator(index == _currentPage),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Next / Get Started button
                  SizedBox(
                    width: double.infinity,
                    height: AppColors.buttonHeight,
                    child: ElevatedButton(
                      onPressed: _onNextPressed,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: AppColors.white,
                        elevation: 2,
                        shadowColor: AppColors.primary.withOpacity(0.3),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(
                            AppColors.cardBorderRadius,
                          ),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            isLastPage ? 'Get Started' : 'Next',
                            style: const TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 16.5,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(width: 8),
                          Icon(
                            isLastPage
                                ? Icons.arrow_forward_rounded
                                : Icons.arrow_forward_ios_rounded,
                            size: 18,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildIndicator(bool isActive) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      margin: const EdgeInsets.symmetric(horizontal: 4),
      height: 8,
      width: isActive ? 28 : 8,
      decoration: BoxDecoration(
        color: isActive ? AppColors.primary : AppColors.border,
        borderRadius: BorderRadius.circular(4),
      ),
    );
  }

  Widget _buildPageContent(_OnboardingItem item) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24.0),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          // Illustration Box
          _buildIllustration(item.pageType),
          const SizedBox(height: 32),

          // Cultural badge
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.lightGreen,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.verified_rounded,
                  color: AppColors.accent,
                  size: 16,
                ),
                const SizedBox(width: 6),
                Text(
                  item.badgeText,
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Title
          Text(
            item.title,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 24,
              fontWeight: FontWeight.w700,
              color: AppColors.charcoal,
              height: 1.25,
            ),
          ),
          const SizedBox(height: 6),

          // Urdu Subtitle
          Text(
            item.urduSubtitle,
            textAlign: TextAlign.center,
            style: TextStyle(
              fontFamily: 'Poppins',
              fontSize: 13.5,
              fontWeight: FontWeight.w500,
              color: AppColors.primary.withOpacity(0.85),
            ),
          ),
          const SizedBox(height: 14),

          // Description
          Text(
            item.description,
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 14,
              fontWeight: FontWeight.w400,
              color: AppColors.gray,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildIllustration(_IllustrationType type) {
    switch (type) {
      case _IllustrationType.workers:
        return Container(
          width: 250,
          height: 250,
          decoration: BoxDecoration(
            color: AppColors.lightGreen.withOpacity(0.4),
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.greenTint, width: 2),
          ),
          child: Stack(
            alignment: Alignment.center,
            children: [
              // Central worker emblem
              Container(
                width: 140,
                height: 140,
                decoration: const BoxDecoration(
                  color: AppColors.white,
                  shape: BoxShape.circle,
                  boxShadow: [
                    BoxShadow(
                      color: Color(0x10000000),
                      blurRadius: 18,
                      offset: Offset(0, 6),
                    ),
                  ],
                ),
                child: const Icon(
                  Icons.engineering_rounded,
                  size: 76,
                  color: AppColors.primary,
                ),
              ),
              // Floating service badges around center
              Positioned(
                top: 20,
                right: 32,
                child: _buildBadgeIcon(Icons.ac_unit_rounded, '❄️'),
              ),
              Positioned(
                bottom: 24,
                right: 28,
                child: _buildBadgeIcon(Icons.bolt_rounded, '⚡'),
              ),
              Positioned(
                bottom: 24,
                left: 28,
                child: _buildBadgeIcon(Icons.water_drop_rounded, '🚰'),
              ),
              Positioned(
                top: 20,
                left: 32,
                child: _buildBadgeIcon(Icons.build_rounded, '🔧'),
              ),
            ],
          ),
        );

      case _IllustrationType.booking:
        return Container(
          width: 250,
          height: 250,
          decoration: BoxDecoration(
            color: AppColors.lightGreen.withOpacity(0.4),
            borderRadius: BorderRadius.circular(32),
            border: Border.all(color: AppColors.greenTint, width: 2),
          ),
          child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _buildBookingStep(1, 'Select Service', Icons.handyman_rounded),
                Container(
                  width: 2,
                  height: 14,
                  color: AppColors.accent.withOpacity(0.3),
                ),
                _buildBookingStep(
                  2,
                  'Confirm Rs. 200 Visit Fee',
                  Icons.verified_user_rounded,
                ),
                Container(
                  width: 2,
                  height: 14,
                  color: AppColors.accent.withOpacity(0.3),
                ),
                _buildBookingStep(
                  3,
                  'Expert Arrives at Door',
                  Icons.directions_bike_rounded,
                ),
              ],
            ),
          ),
        );

      case _IllustrationType.security:
        return Container(
          width: 250,
          height: 250,
          decoration: BoxDecoration(
            color: AppColors.lightGreen.withOpacity(0.4),
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.greenTint, width: 2),
          ),
          child: Center(
            child: Container(
              width: 150,
              height: 150,
              decoration: const BoxDecoration(
                color: AppColors.white,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: Color(0x10000000),
                    blurRadius: 20,
                    offset: Offset(0, 8),
                  ),
                ],
              ),
              child: const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    Icons.shield_rounded,
                    size: 64,
                    color: AppColors.primary,
                  ),
                  SizedBox(height: 4),
                  Text(
                    'NADRA CNIC\nVERIFIED',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      color: AppColors.accent,
                      letterSpacing: 0.8,
                    ),
                  ),
                ],
              ),
            ),
          ),
        );
    }
  }

  Widget _buildBadgeIcon(IconData icon, String emoji) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: AppColors.white,
        shape: BoxShape.circle,
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.12),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Text(
        emoji,
        style: const TextStyle(fontSize: 18),
      ),
    );
  }

  Widget _buildBookingStep(int number, String text, IconData icon) {
    return Row(
      children: [
        Container(
          width: 32,
          height: 32,
          decoration: const BoxDecoration(
            color: AppColors.primary,
            shape: BoxShape.circle,
          ),
          child: Center(
            child: Text(
              '$number',
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: AppColors.white,
              ),
            ),
          ),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: AppColors.charcoal,
            ),
          ),
        ),
        Icon(icon, size: 20, color: AppColors.accent),
      ],
    );
  }
}

enum _IllustrationType { workers, booking, security }

class _OnboardingItem {
  final String title;
  final String urduSubtitle;
  final String description;
  final String badgeText;
  final _IllustrationType pageType;

  const _OnboardingItem({
    required this.title,
    required this.urduSubtitle,
    required this.description,
    required this.badgeText,
    required this.pageType,
  });
}

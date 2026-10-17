import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/constants/app_routes.dart';
import '../models/booking_request_model.dart';
import '../models/service_item.dart';

/// Screen 12: Review Screen
/// Post-job review and star rating interface with interactive stars, compliment tags,
/// feedback remarks, and smooth navigation back to home.
class ReviewScreen extends ConsumerStatefulWidget {
  final CustomerBooking? booking;

  const ReviewScreen({
    super.key,
    this.booking,
  });

  @override
  ConsumerState<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends ConsumerState<ReviewScreen> {
  int _selectedStars = 5;
  final TextEditingController _commentController = TextEditingController();
  final Set<String> _selectedCompliments = {'Punctual', 'Expert Knowledge'};
  bool _isSubmitting = false;

  final List<String> _complimentTags = const [
    'Punctual',
    'Professional',
    'Clean Work',
    'Fair Pricing',
    'Expert Knowledge',
    'Polite Behavior',
  ];

  final Map<int, String> _ratingLabels = const {
    1: 'Very Disappointed',
    2: 'Needs Improvement',
    3: 'Average Service',
    4: 'Good Experience',
    5: 'Excellent Work!',
  };

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  void _onSkip() {
    context.go(AppRoutes.customerHome);
  }

  Future<void> _onSubmitReview() async {
    setState(() => _isSubmitting = true);

    // Simulate review submission
    await Future.delayed(const Duration(milliseconds: 700));

    if (!mounted) return;
    setState(() => _isSubmitting = false);

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text(
          'Shukriya! Thank you for rating your KAMZO expert.',
          style: TextStyle(fontFamily: 'Poppins'),
        ),
        backgroundColor: AppColors.primary,
      ),
    );

    context.go(AppRoutes.customerHome);
  }

  @override
  Widget build(BuildContext context) {
    final workerName = widget.booking?.workerName ?? 'Muhammad Tariq';
    final serviceName = widget.booking?.service.name ?? 'Electrician';

    return Scaffold(
      backgroundColor: AppColors.white,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        actions: [
          TextButton(
            onPressed: _onSkip,
            child: const Text(
              'Skip',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 14.5,
                fontWeight: FontWeight.w600,
                color: AppColors.gray,
              ),
            ),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Celebration Icon
              Center(
                child: Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    color: AppColors.lightGreen,
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.greenTint, width: 2),
                  ),
                  child: const Center(
                    child: Icon(
                      Icons.celebration_rounded,
                      color: AppColors.primary,
                      size: 38,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // Thank You Header
              const Text(
                'Job Completed!',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 24,
                  fontWeight: FontWeight.w800,
                  color: AppColors.charcoal,
                ),
              ),
              const SizedBox(height: 4),
              const Text(
                'Shukriya! How was your experience with KAMZO?',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 13.5,
                  fontWeight: FontWeight.w400,
                  color: AppColors.gray,
                ),
              ),
              const SizedBox(height: 24),

              // Worker Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.background,
                  borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 26,
                      backgroundColor: AppColors.lightGreen,
                      child: const Icon(Icons.person, color: AppColors.primary, size: 30),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            workerName,
                            style: const TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 15,
                              fontWeight: FontWeight.w700,
                              color: AppColors.charcoal,
                            ),
                          ),
                          Text(
                            '$serviceName Specialist',
                            style: const TextStyle(
                              fontFamily: 'Poppins',
                              fontSize: 12,
                              color: AppColors.gray,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.white,
                        borderRadius: BorderRadius.circular(6),
                        border: Border.all(color: AppColors.border),
                      ),
                      child: const Text(
                        'Verified',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppColors.accent,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 28),

              // Large Interactive Stars
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(5, (index) {
                  final starVal = index + 1;
                  final isFilled = starVal <= _selectedStars;
                  return GestureDetector(
                    onTap: () {
                      setState(() => _selectedStars = starVal);
                    },
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: Icon(
                        isFilled ? Icons.star_rounded : Icons.star_border_rounded,
                        size: 44,
                        color: isFilled ? AppColors.starGold : AppColors.grayLight,
                      ),
                    ),
                  );
                }),
              ),
              const SizedBox(height: 10),

              // Rating label text
              Text(
                _ratingLabels[_selectedStars] ?? 'Select Rating',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 24),

              // Compliment Tag Chips
              const Text(
                'What went well?',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 13.5,
                  fontWeight: FontWeight.w600,
                  color: AppColors.charcoal,
                ),
              ),
              const SizedBox(height: 10),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: _complimentTags.map((tag) {
                  final isSelected = _selectedCompliments.contains(tag);
                  return FilterChip(
                    label: Text(tag),
                    selected: isSelected,
                    selectedColor: AppColors.lightGreen,
                    backgroundColor: AppColors.white,
                    checkmarkColor: AppColors.primary,
                    labelStyle: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                      color: isSelected ? AppColors.primary : AppColors.charcoal,
                    ),
                    side: BorderSide(
                      color: isSelected ? AppColors.primary : AppColors.border,
                    ),
                    onSelected: (selected) {
                      setState(() {
                        if (selected) {
                          _selectedCompliments.add(tag);
                        } else {
                          _selectedCompliments.remove(tag);
                        }
                      });
                    },
                  );
                }).toList(),
              ),
              const SizedBox(height: 20),

              // Comment text area
              const Text(
                'Additional Feedback (optional)',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 13.5,
                  fontWeight: FontWeight.w600,
                  color: AppColors.charcoal,
                ),
              ),
              const SizedBox(height: 8),
              TextField(
                controller: _commentController,
                maxLines: 3,
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 13.5,
                  color: AppColors.charcoal,
                ),
                decoration: InputDecoration(
                  hintText: 'Share any details about the quality of repair or behavior...',
                  hintStyle: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 12.5,
                    color: AppColors.grayLight,
                  ),
                  filled: true,
                  fillColor: AppColors.background,
                  contentPadding: const EdgeInsets.all(14),
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
              const SizedBox(height: 28),

              // Submit Review Button
              SizedBox(
                height: AppColors.buttonHeight,
                child: ElevatedButton(
                  onPressed: _isSubmitting ? null : _onSubmitReview,
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
                  child: _isSubmitting
                      ? const CircularProgressIndicator(color: AppColors.white)
                      : const Text(
                          'Submit Review',
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.5,
                          ),
                        ),
                ),
              ),
              const SizedBox(height: 12),

              // Skip text button
              Center(
                child: TextButton(
                  onPressed: _onSkip,
                  child: const Text(
                    'Maybe Later',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppColors.gray,
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../models/service_item.dart';
import 'location_selection_screen.dart';

/// Screen 6: Service Selection Screen
/// Displays the selected service hero banner, tappable common issue suggestion chips,
/// problem description input with live character counter, nearby verified worker preview,
/// and continue CTA.
class ServiceSelectionScreen extends ConsumerStatefulWidget {
  final ServiceItem? service;

  const ServiceSelectionScreen({
    super.key,
    this.service,
  });

  @override
  ConsumerState<ServiceSelectionScreen> createState() => _ServiceSelectionScreenState();
}

class _ServiceSelectionScreenState extends ConsumerState<ServiceSelectionScreen> {
  late ServiceItem _currentService;
  final TextEditingController _descController = TextEditingController();
  final int _maxChars = 400;
  String? _selectedIssueChip;
  String _dispatchPreference = 'Immediate'; // 'Immediate' or 'Scheduled'

  @override
  void initState() {
    super.initState();
    _currentService = widget.service ?? ServiceItem.defaultServices.first;
  }

  @override
  void dispose() {
    _descController.dispose();
    super.dispose();
  }

  void _onChipTapped(String issue) {
    setState(() {
      _selectedIssueChip = issue;
      if (_descController.text.trim().isEmpty) {
        _descController.text = issue;
      } else if (!_descController.text.contains(issue)) {
        _descController.text = '${_descController.text}, $issue';
      }
      _descController.selection = TextSelection.fromPosition(
        TextPosition(offset: _descController.text.length),
      );
    });
  }

  void _onContinue() {
    final text = _descController.text.trim();
    if (text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Please describe the issue or tap a common problem chip.',
            style: TextStyle(fontFamily: 'Poppins'),
          ),
          backgroundColor: AppColors.error,
        ),
      );
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute(
        builder: (ctx) => LocationSelectionScreen(
          service: _currentService,
          problemDescription: text,
          requestType: _dispatchPreference,
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final currentLength = _descController.text.length;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0.5,
        title: Text(
          _currentService.name,
          style: const TextStyle(
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
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Service Hero Card
              _buildHeroCard(),
              const SizedBox(height: 24),

              // Available Workers Nearby Section
              _buildNearbyWorkersBanner(),
              const SizedBox(height: 24),

              // Common Issues Chips
              _buildCommonIssuesSection(),
              const SizedBox(height: 24),

              // Problem Description Text Area
              _buildDescriptionInput(currentLength),
              const SizedBox(height: 24),

              // Dispatch Preference (Immediate vs Later)
              _buildDispatchSelector(),
              const SizedBox(height: 32),

              // Continue Button
              SizedBox(
                height: AppColors.buttonHeight,
                child: ElevatedButton(
                  onPressed: _onContinue,
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
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        'Continue to Location',
                        style: TextStyle(
                          fontFamily: 'Poppins',
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      SizedBox(width: 8),
                      Icon(Icons.arrow_forward_rounded, size: 20),
                    ],
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

  Widget _buildHeroCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x0A000000),
            blurRadius: 10,
            offset: Offset(0, 3),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 58,
                height: 58,
                decoration: BoxDecoration(
                  color: AppColors.lightGreen,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Center(
                  child: Text(
                    _currentService.emoji,
                    style: const TextStyle(fontSize: 30),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          _currentService.name,
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 19,
                            fontWeight: FontWeight.w700,
                            color: AppColors.charcoal,
                          ),
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _currentService.urduName,
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                            color: AppColors.accent,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: const [
                        Icon(Icons.star_rounded, size: 18, color: AppColors.starGold),
                        SizedBox(width: 4),
                        Text(
                          '4.8 (850+ reviews)',
                          style: TextStyle(
                            fontFamily: 'Poppins',
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: AppColors.charcoal,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          Text(
            _currentService.fullDesc,
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 13,
              fontWeight: FontWeight.w400,
              color: AppColors.gray,
              height: 1.45,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.lightGreen.withOpacity(0.5),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: const [
                Icon(
                  Icons.info_outline_rounded,
                  size: 16,
                  color: AppColors.primary,
                ),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Standard Visit & Inspection Fee: Rs. 200 (advance)',
                    style: TextStyle(
                      fontFamily: 'Poppins',
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNearbyWorkersBanner() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          // Stacked worker avatars preview
          SizedBox(
            width: 76,
            height: 38,
            child: Stack(
              children: [
                _buildWorkerMiniAvatar(0, Colors.teal),
                _buildWorkerMiniAvatar(20, AppColors.primary),
                _buildWorkerMiniAvatar(40, Colors.blueGrey),
              ],
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  '14+ Verified Experts Nearby',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 13.5,
                    fontWeight: FontWeight.w700,
                    color: AppColors.charcoal,
                  ),
                ),
                Text(
                  'Average arrival time: 20-35 mins',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 11.5,
                    color: AppColors.accent,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.lightGreen,
              borderRadius: BorderRadius.circular(6),
            ),
            child: const Text(
              'NADRA OK',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 10.5,
                fontWeight: FontWeight.w700,
                color: AppColors.primary,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildWorkerMiniAvatar(double left, Color bg) {
    return Positioned(
      left: left,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: bg,
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.white, width: 2),
        ),
        child: const Icon(Icons.person, color: AppColors.white, size: 20),
      ),
    );
  }

  Widget _buildCommonIssuesSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Common Issues (Tap to add)',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: AppColors.charcoal,
          ),
        ),
        const SizedBox(height: 10),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: _currentService.commonIssues.map((issue) {
            final isSelected = _selectedIssueChip == issue;
            return ChoiceChip(
              label: Text(issue),
              selected: isSelected,
              onSelected: (val) => _onChipTapped(issue),
              selectedColor: AppColors.primary,
              backgroundColor: AppColors.white,
              labelStyle: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12.5,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                color: isSelected ? AppColors.white : AppColors.charcoal,
              ),
              side: BorderSide(
                color: isSelected ? AppColors.primary : AppColors.border,
              ),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(20),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildDescriptionInput(int currentLength) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text(
              'Describe your problem',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: AppColors.charcoal,
              ),
            ),
            Text(
              '$currentLength / $_maxChars',
              style: TextStyle(
                fontFamily: 'Poppins',
                fontSize: 12,
                fontWeight: FontWeight.w500,
                color: currentLength > _maxChars ? AppColors.error : AppColors.gray,
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Container(
          decoration: BoxDecoration(
            color: AppColors.white,
            borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
            boxShadow: const [
              BoxShadow(
                color: Color(0x06000000),
                blurRadius: 8,
                offset: Offset(0, 2),
              ),
            ],
          ),
          child: TextField(
            controller: _descController,
            maxLines: 4,
            maxLength: _maxChars,
            onChanged: (val) => setState(() {}),
            decoration: InputDecoration(
              counterText: '',
              hintText: 'Describe what needs fixing, noises, leaks, model number...',
              hintStyle: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 13.5,
                color: AppColors.grayLight,
              ),
              contentPadding: const EdgeInsets.all(16),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
                borderSide: const BorderSide(color: AppColors.border),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
                borderSide: const BorderSide(color: AppColors.border),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
                borderSide: const BorderSide(color: AppColors.primary, width: 1.8),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildDispatchSelector() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Booking Preference',
          style: TextStyle(
            fontFamily: 'Poppins',
            fontSize: 15,
            fontWeight: FontWeight.w700,
            color: AppColors.charcoal,
          ),
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              child: _buildRadioOption(
                title: 'Immediate',
                subtitle: 'Next available (20-40 min)',
                isSelected: _dispatchPreference == 'Immediate',
                onTap: () => setState(() => _dispatchPreference = 'Immediate'),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: _buildRadioOption(
                title: 'Schedule Later',
                subtitle: 'Set convenient time',
                isSelected: _dispatchPreference == 'Scheduled',
                onTap: () => setState(() => _dispatchPreference = 'Scheduled'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildRadioOption({
    required String title,
    required String subtitle,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.lightGreen.withOpacity(0.5) : AppColors.white,
          borderRadius: BorderRadius.circular(AppColors.cardBorderRadius),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 1.8 : 1,
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(
                  isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                  color: isSelected ? AppColors.primary : AppColors.gray,
                  size: 18,
                ),
                const SizedBox(width: 6),
                Text(
                  title,
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: isSelected ? AppColors.primary : AppColors.charcoal,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Text(
              subtitle,
              style: const TextStyle(
                fontFamily: 'Poppins',
                fontSize: 10.5,
                color: AppColors.gray,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../core/theme/app_colors.dart';

enum JobStatus {
  accepted,
  onTheWay,
  arrived,
  inProgress,
  billSubmitted,
  completed,
}

class JobDetailScreen extends ConsumerStatefulWidget {
  final String? jobId;

  const JobDetailScreen({super.key, this.jobId});

  @override
  ConsumerState<JobDetailScreen> createState() => _JobDetailScreenState();
}

class _JobDetailScreenState extends ConsumerState<JobDetailScreen> {
  late JobStatus _status;
  bool _isUpdatingStatus = false;

  // Mock Job Data
  late final Map<String, dynamic> _job;

  final LatLng _customerLocation = const LatLng(24.9180, 67.0971); // Karachi Gulshan area

  @override
  void initState() {
    super.initState();
    _status = JobStatus.accepted;
    _job = {
      'id': widget.jobId ?? 'KZ-8821',
      'service': 'AC Repair & Servicing',
      'category': 'AC Repair',
      'customer_name': 'Tariq Mehmood',
      'customer_phone': '03009234567',
      'address': 'House 42-B, Block 13-D, Near Disco Bakery, Gulshan-e-Iqbal, Karachi',
      'distance': '2.4 km away',
      'problem_description':
          'Master bedroom 1.5 ton inverter AC is not cooling properly and blowing warm air. Also loud vibrating noise from the outdoor compressor unit after 10 minutes of running.',
      'visit_fee': 500,
      'is_fee_paid': true,
      'created_at': 'Today, 2:15 PM',
      'scheduled_for': 'Immediate / Today',
    };
  }

  Future<void> _openGoogleMapsNavigation() async {
    final lat = _customerLocation.latitude;
    final lng = _customerLocation.longitude;
    final url = Uri.parse('https://www.google.com/maps/dir/?api=1&destination=$lat,$lng');
    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url, mode: LaunchMode.externalApplication);
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Could not open Google Maps')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error launching navigation: $e')),
        );
      }
    }
  }

  Future<void> _callCustomer() async {
    final phone = _job['customer_phone'];
    final url = Uri.parse('tel:$phone');
    try {
      if (await canLaunchUrl(url)) {
        await launchUrl(url);
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Could not dial $phone')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Dial error: $e')),
        );
      }
    }
  }

  void _progressStatus() {
    setState(() => _isUpdatingStatus = true);

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() {
        _isUpdatingStatus = false;
        switch (_status) {
          case JobStatus.accepted:
            _status = JobStatus.onTheWay;
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                backgroundColor: AppColors.primaryGreen,
                content: Text('Status updated: You are on the way to the customer!'),
              ),
            );
            break;
          case JobStatus.onTheWay:
            _status = JobStatus.arrived;
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                backgroundColor: AppColors.primaryGreen,
                content: Text('Status updated: You have arrived at the customer location!'),
              ),
            );
            break;
          case JobStatus.arrived:
            _status = JobStatus.inProgress;
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                backgroundColor: AppColors.primaryGreen,
                content: Text('Status updated: Diagnostic and repair work in progress!'),
              ),
            );
            break;
          case JobStatus.inProgress:
            // Navigate to Submit Final Bill
            context.push('/worker/submit-bill', extra: _job['id']);
            break;
          case JobStatus.billSubmitted:
          case JobStatus.completed:
            break;
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.charcoal, size: 20),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Booking #${_job['id']}',
          style: const TextStyle(
            fontFamily: 'Poppins',
            fontWeight: FontWeight.bold,
            color: AppColors.charcoal,
            fontSize: 17,
          ),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.phone, color: AppColors.primaryGreen),
            tooltip: 'Call Customer',
            onPressed: _callCustomer,
          ),
          IconButton(
            icon: const Icon(Icons.chat_bubble_outline, color: AppColors.primaryGreen),
            tooltip: 'Chat with Customer',
            onPressed: () => context.push('/chat', extra: {
              'booking_id': _job['id'],
              'other_name': _job['customer_name'],
              'is_paid': true,
            }),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(bottom: 120),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Status Banner & Visit Fee Paid Badge
            _buildTopStatusCard(),

            const SizedBox(height: 16),

            // Customer & Service Info Card
            _buildCustomerInfoCard(),

            const SizedBox(height: 16),

            // Map & Navigation Card
            _buildMapLocationCard(),

            const SizedBox(height: 16),

            // Problem Description Card
            _buildProblemDescriptionCard(),

            const SizedBox(height: 16),

            // Status Timeline
            _buildTimelineCard(),

            const SizedBox(height: 16),
          ],
        ),
      ),
      bottomSheet: _buildBottomActionBar(),
    );
  }

  Widget _buildTopStatusCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: AppColors.border, width: 0.5)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                _job['service'],
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: AppColors.charcoal,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(
                  color: AppColors.lightGreenBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.primaryGreen.withOpacity(0.4)),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.verified, color: AppColors.primaryGreen, size: 14),
                    const SizedBox(width: 4),
                    Text(
                      'Visit Fee Rs. ${_job['visit_fee']} PAID',
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                        color: AppColors.primaryGreen,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Icon(Icons.schedule, color: AppColors.gray, size: 14),
              const SizedBox(width: 4),
              Text(
                'Requested: ${_job['created_at']} • ${_job['scheduled_for']}',
                style: const TextStyle(
                  fontFamily: 'Poppins',
                  fontSize: 12,
                  color: AppColors.gray,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildCustomerInfoCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Customer Details',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontWeight: FontWeight.bold,
              fontSize: 15,
              color: AppColors.charcoal,
            ),
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              CircleAvatar(
                radius: 22,
                backgroundColor: AppColors.lightGreenBg,
                child: Text(
                  _job['customer_name'].toString().substring(0, 1),
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                    color: AppColors.primaryGreen,
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _job['customer_name'],
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                        color: AppColors.charcoal,
                      ),
                    ),
                    Text(
                      _job['customer_phone'],
                      style: const TextStyle(
                        fontFamily: 'Poppins',
                        fontSize: 13,
                        color: AppColors.gray,
                      ),
                    ),
                  ],
                ),
              ),
              IconButton(
                onPressed: _callCustomer,
                icon: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: AppColors.lightGreenBg,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.phone, color: AppColors.primaryGreen, size: 20),
                ),
              ),
              IconButton(
                onPressed: () => context.push('/chat', extra: {
                  'booking_id': _job['id'],
                  'other_name': _job['customer_name'],
                  'is_paid': true,
                }),
                icon: Container(
                  padding: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: AppColors.lightGreenBg,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.chat_bubble_outline, color: AppColors.primaryGreen, size: 20),
                ),
              ),
            ],
          ),
          const Divider(height: 24, color: AppColors.divider),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Icon(Icons.pin_drop_outlined, color: AppColors.primaryGreen, size: 20),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  _job['address'],
                  style: const TextStyle(
                    fontFamily: 'Poppins',
                    fontSize: 13,
                    color: AppColors.charcoal,
                    height: 1.4,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMapLocationCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          SizedBox(
            height: 160,
            width: double.infinity,
            child: Stack(
              children: [
                GoogleMap(
                  initialCameraPosition: CameraPosition(
                    target: _customerLocation,
                    zoom: 15,
                  ),
                  markers: {
                    Marker(
                      markerId: const MarkerId('customer_loc'),
                      position: _customerLocation,
                      infoWindow: InfoWindow(title: _job['customer_name']),
                    ),
                  },
                  zoomControlsEnabled: false,
                  myLocationButtonEnabled: false,
                ),
                Positioned(
                  top: 10,
                  right: 10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(8),
                      boxShadow: [
                        BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 4),
                      ],
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.navigation, color: AppColors.primaryGreen, size: 14),
                        const SizedBox(width: 4),
                        Text(
                          _job['distance'],
                          style: const TextStyle(
                            fontFamily: 'Poppins',
                            fontWeight: FontWeight.bold,
                            fontSize: 11,
                            color: AppColors.charcoal,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: SizedBox(
              width: double.infinity,
              height: 46,
              child: ElevatedButton.icon(
                onPressed: _openGoogleMapsNavigation,
                icon: const Icon(Icons.directions, color: Colors.white, size: 20),
                label: const Text(
                  'Navigate via Google Maps',
                  style: TextStyle(
                    fontFamily: 'Poppins',
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentGreen,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProblemDescriptionCard() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Icon(Icons.report_problem_outlined, color: AppColors.warning, size: 20),
              SizedBox(width: 8),
              Text(
                'Customer Problem Statement',
                style: TextStyle(
                  fontFamily: 'Poppins',
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: AppColors.charcoal,
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Text(
            _job['problem_description'],
            style: const TextStyle(
              fontFamily: 'Poppins',
              fontSize: 13,
              color: AppColors.charcoal,
              height: 1.45,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineCard() {
    final stages = [
      {'title': 'Job Accepted', 'subtitle': 'You accepted the request', 'done': true},
      {
        'title': 'On The Way',
        'subtitle': 'Worker traveling to address',
        'done': _status.index >= JobStatus.onTheWay.index,
      },
      {
        'title': 'Arrived at Location',
        'subtitle': 'Worker reached customer door',
        'done': _status.index >= JobStatus.arrived.index,
      },
      {
        'title': 'In Progress / Diagnostic',
        'subtitle': 'Inspection and repair underway',
        'done': _status.index >= JobStatus.inProgress.index,
      },
      {
        'title': 'Final Bill Submission',
        'subtitle': 'Worker enters total service charge',
        'done': _status.index >= JobStatus.billSubmitted.index,
      },
      {
        'title': 'Job Completed & Payment',
        'subtitle': 'Customer confirmed and paid',
        'done': _status == JobStatus.completed,
      },
    ];

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Booking Timeline',
            style: TextStyle(
              fontFamily: 'Poppins',
              fontWeight: FontWeight.bold,
              fontSize: 15,
              color: AppColors.charcoal,
            ),
          ),
          const SizedBox(height: 16),
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: stages.length,
            itemBuilder: (ctx, i) {
              final stage = stages[i];
              final isDone = stage['done'] as bool;
              final isLast = i == stages.length - 1;

              return IntrinsicHeight(
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Column(
                      children: [
                        Container(
                          width: 22,
                          height: 22,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: isDone ? AppColors.primaryGreen : Colors.white,
                            border: Border.all(
                              color: isDone ? AppColors.primaryGreen : AppColors.border,
                              width: 2,
                            ),
                          ),
                          child: isDone
                              ? const Icon(Icons.check, size: 14, color: Colors.white)
                              : null,
                        ),
                        if (!isLast)
                          Expanded(
                            child: Container(
                              width: 2,
                              color: isDone ? AppColors.primaryGreen : AppColors.border,
                            ),
                          ),
                      ],
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.only(bottom: 16),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              stage['title'] as String,
                              style: TextStyle(
                                fontFamily: 'Poppins',
                                fontWeight: isDone ? FontWeight.bold : FontWeight.w500,
                                fontSize: 13,
                                color: isDone ? AppColors.charcoal : AppColors.gray,
                              ),
                            ),
                            Text(
                              stage['subtitle'] as String,
                              style: const TextStyle(
                                fontFamily: 'Poppins',
                                fontSize: 11,
                                color: AppColors.gray,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildBottomActionBar() {
    String actionLabel = '';
    IconData actionIcon = Icons.arrow_forward;
    Color buttonColor = AppColors.primaryGreen;

    switch (_status) {
      case JobStatus.accepted:
        actionLabel = 'Mark On The Way';
        actionIcon = Icons.motorcycle;
        break;
      case JobStatus.onTheWay:
        actionLabel = 'Mark Arrived';
        actionIcon = Icons.location_on;
        break;
      case JobStatus.arrived:
        actionLabel = 'Mark In Progress';
        actionIcon = Icons.build;
        break;
      case JobStatus.inProgress:
        actionLabel = 'Submit Final Bill';
        actionIcon = Icons.receipt_long;
        buttonColor = AppColors.accentGreen;
        break;
      case JobStatus.billSubmitted:
        actionLabel = 'Awaiting Customer Payment';
        actionIcon = Icons.hourglass_top;
        break;
      case JobStatus.completed:
        actionLabel = 'Job Finished';
        actionIcon = Icons.check_circle;
        break;
    }

    final isActionDisabled = _status == JobStatus.billSubmitted || _status == JobStatus.completed;

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, -3),
          ),
        ],
      ),
      child: SafeArea(
        child: SizedBox(
          width: double.infinity,
          height: 56,
          child: ElevatedButton.icon(
            onPressed: isActionDisabled || _isUpdatingStatus ? null : _progressStatus,
            icon: _isUpdatingStatus
                ? const SizedBox.shrink()
                : Icon(actionIcon, size: 22),
            label: _isUpdatingStatus
                ? const SizedBox(
                    width: 22,
                    height: 22,
                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                  )
                : Text(
                    actionLabel,
                    style: const TextStyle(
                      fontFamily: 'Poppins',
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                    ),
                  ),
            style: ElevatedButton.styleFrom(
              backgroundColor: buttonColor,
              foregroundColor: Colors.white,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
          ),
        ),
      ),
    );
  }
}

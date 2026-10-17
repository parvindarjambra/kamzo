import 'package:flutter/material.dart';

/// Representation of a service category in KAMZO
class ServiceItem {
  final String id;
  final String name;
  final String urduName;
  final String shortDesc;
  final String fullDesc;
  final String emoji;
  final IconData iconData;
  final double baseVisitFee;
  final List<String> commonIssues;

  const ServiceItem({
    required this.id,
    required this.name,
    required this.urduName,
    required this.shortDesc,
    required this.fullDesc,
    required this.emoji,
    required this.iconData,
    this.baseVisitFee = 200.0,
    required this.commonIssues,
  });

  static const List<ServiceItem> defaultServices = [
    ServiceItem(
      id: 'mechanic',
      name: 'Mechanic',
      urduName: 'مکینک',
      shortDesc: 'Car & bike repair, tuning, breakdown help',
      fullDesc: 'Expert automobile mechanics for on-site engine diagnostics, tuning, brake repairs, tyre emergencies, and routine vehicle maintenance.',
      emoji: '🔧',
      iconData: Icons.build_rounded,
      baseVisitFee: 200.0,
      commonIssues: [
        'Engine Won\'t Start',
        'Brake Noise / Failure',
        'Battery Jumpstart / Dead',
        'Car / Bike Tuning',
        'Oil & Filter Replacement',
        'Suspension Knocking',
        'Clutch Cable Broken',
      ],
    ),
    ServiceItem(
      id: 'ac_repair',
      name: 'AC Repair',
      urduName: 'اے سی سروس',
      shortDesc: 'Installation, gas refilling, master servicing',
      fullDesc: 'Certified HVAC technicians for inverter & conventional split ACs. Full chemical master servicing, R410/R32 gas refills, PCB board repairs, and installation.',
      emoji: '❄️',
      iconData: Icons.ac_unit_rounded,
      baseVisitFee: 200.0,
      commonIssues: [
        'Not Cooling Properly',
        'Gas Leakage / Refill',
        'Water Dripping Indoors',
        'Master Chemical Service',
        'Strange Noise / Vibration',
        'Compressor Tripping',
        'New AC Installation',
      ],
    ),
    ServiceItem(
      id: 'plumber',
      name: 'Plumber',
      urduName: 'پلمبر',
      shortDesc: 'Pipe leakage, motor repair, sanitary fittings',
      fullDesc: 'Skilled plumbers for pipeline leakages, water motor & donkey pump installations, geyser servicing, sanitary fitting, and drainage unblocking.',
      emoji: '🚰',
      iconData: Icons.water_drop_rounded,
      baseVisitFee: 200.0,
      commonIssues: [
        'Concealed Pipe Leakage',
        'Water Motor / Pump Fault',
        'Geyser Heating Issue',
        'Blocked Drain / Commode',
        'Tap / Mixer Tap Dripping',
        'Water Tank Overflows',
        'Sanitary Ware Fitting',
      ],
    ),
    ServiceItem(
      id: 'electrician',
      name: 'Electrician',
      urduName: 'الیکٹریشن',
      shortDesc: 'Wiring, UPS/Solar installation, short circuit',
      fullDesc: 'Licensed electricians for domestic short circuits, breaker tripping, UPS & solar inverter setup, ceiling fan & chandelier installation, and DB box rewiring.',
      emoji: '⚡',
      iconData: Icons.bolt_rounded,
      baseVisitFee: 200.0,
      commonIssues: [
        'Main Breaker Tripping',
        'UPS / Solar Inverter Fault',
        'Short Circuit Sparking',
        'Ceiling Fan Repair / Fitting',
        'Switchboard Replacement',
        'LED Lights / Chandelier Install',
        'Whole House Rewiring',
      ],
    ),
  ];
}

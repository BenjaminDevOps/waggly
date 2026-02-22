import 'package:flutter/material.dart';

class AiDiagnosisScreen extends StatelessWidget {
  const AiDiagnosisScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Diagnosis'),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.medical_services, size: 100, color: Colors.blue),
            SizedBox(height: 20),
            Text(
              'AI Diagnosis with Gemini 2.5',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ],
        ),
      ),
    );
  }
}

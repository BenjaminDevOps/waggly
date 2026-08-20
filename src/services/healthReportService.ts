import { jsPDF } from 'jspdf';
import type { Pet, HealthRecord, Diagnosis } from '../models/types';
import { isNativePlatform } from './platform';

export async function generateHealthReport(
  pet: Pet,
  records: HealthRecord[],
  diagnoses: Diagnosis[],
  locale: string,
): Promise<void> {
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  const labels = getLabels(locale);

  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Waggly', margin, y);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(labels.healthReport, margin + 50, y);
  y += 5;
  doc.setDrawColor(100, 100, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, 190, y);
  y += 12;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(pet.name, margin, y);
  y += 8;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const petInfo = [
    `${labels.type}: ${pet.type}`,
    pet.breed ? `${labels.breed}: ${pet.breed}` : '',
    `${labels.gender}: ${pet.gender}`,
    pet.weight ? `${labels.weight}: ${pet.weight} kg` : '',
    pet.microchipId ? `${labels.microchip}: ${pet.microchipId}` : '',
  ].filter(Boolean);
  petInfo.forEach(line => {
    doc.text(line, margin, y);
    y += 6;
  });
  y += 6;

  if (records.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(labels.healthRecords, margin, y);
    y += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    for (const record of records) {
      if (y > 270) { doc.addPage(); y = margin; }
      doc.setFont('helvetica', 'bold');
      doc.text(`${record.date} — ${record.title}`, margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(`${labels.recordType}: ${record.type}`, margin + 5, y);
      y += 5;
      if (record.description) {
        const lines = doc.splitTextToSize(record.description, 160);
        doc.text(lines, margin + 5, y);
        y += lines.length * 5;
      }
      if (record.vetName) {
        doc.text(`${labels.vet}: ${record.vetName}`, margin + 5, y);
        y += 5;
      }
      y += 4;
    }
    y += 4;
  }

  if (diagnoses.length > 0) {
    if (y > 240) { doc.addPage(); y = margin; }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(labels.aiDiagnoses, margin, y);
    y += 8;

    doc.setFontSize(10);
    for (const diag of diagnoses) {
      if (y > 250) { doc.addPage(); y = margin; }
      doc.setFont('helvetica', 'bold');
      doc.text(`${diag.createdAt.split('T')[0]} — ${labels.severity}: ${diag.severity.toUpperCase()}`, margin, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.text(`${labels.symptoms}: ${diag.symptoms}`, margin + 5, y);
      y += 5;
      if (diag.possibleConditions.length > 0) {
        doc.text(`${labels.conditions}: ${diag.possibleConditions.join(', ')}`, margin + 5, y);
        y += 5;
      }
      if (diag.recommendations.length > 0) {
        for (const rec of diag.recommendations) {
          if (y > 270) { doc.addPage(); y = margin; }
          const lines = doc.splitTextToSize(`• ${rec}`, 155);
          doc.text(lines, margin + 5, y);
          y += lines.length * 5;
        }
      }
      y += 6;
    }
  }

  if (y > 270) { doc.addPage(); y = margin; }
  y += 8;
  doc.setDrawColor(100, 100, 240);
  doc.line(margin, y, 190, y);
  y += 6;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(labels.disclaimer, margin, y);
  y += 4;
  doc.text(`${labels.generatedOn} ${new Date().toLocaleDateString(locale)} — Waggly App`, margin, y);

  const fileName = `waggly_${pet.name.toLowerCase()}_health_report.pdf`;

  if (isNativePlatform()) {
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const base64 = doc.output('datauristring').split(',')[1];
      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
      });
      const uri = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Documents,
      });
      try {
        const { Share } = await import('@capacitor/share');
        await Share.share({
          title: fileName,
          url: uri?.uri,
        });
      } catch {
        alert('PDF saved to Documents folder.');
      }
    } catch {
      doc.save(fileName);
    }
  } else {
    doc.save(fileName);
  }
}

function getLabels(locale: string) {
  if (locale === 'fr') return {
    healthReport: 'Rapport de santé',
    type: 'Type',
    breed: 'Race',
    gender: 'Genre',
    weight: 'Poids',
    microchip: 'Puce',
    healthRecords: 'Dossiers de santé',
    recordType: 'Type',
    vet: 'Vétérinaire',
    aiDiagnoses: 'Diagnostics IA',
    severity: 'Gravité',
    symptoms: 'Symptômes',
    conditions: 'Conditions',
    disclaimer: 'Ce rapport est généré automatiquement. Il ne remplace pas un avis vétérinaire.',
    generatedOn: 'Généré le',
  };
  if (locale === 'es') return {
    healthReport: 'Informe de salud',
    type: 'Tipo',
    breed: 'Raza',
    gender: 'Género',
    weight: 'Peso',
    microchip: 'Microchip',
    healthRecords: 'Registros de salud',
    recordType: 'Tipo',
    vet: 'Veterinario',
    aiDiagnoses: 'Diagnósticos IA',
    severity: 'Gravedad',
    symptoms: 'Síntomas',
    conditions: 'Condiciones',
    disclaimer: 'Este informe se genera automáticamente. No sustituye el consejo veterinario.',
    generatedOn: 'Generado el',
  };
  return {
    healthReport: 'Health Report',
    type: 'Type',
    breed: 'Breed',
    gender: 'Gender',
    weight: 'Weight',
    microchip: 'Microchip',
    healthRecords: 'Health Records',
    recordType: 'Type',
    vet: 'Veterinarian',
    aiDiagnoses: 'AI Diagnoses',
    severity: 'Severity',
    symptoms: 'Symptoms',
    conditions: 'Conditions',
    disclaimer: 'This report is automatically generated. It does not replace veterinary advice.',
    generatedOn: 'Generated on',
  };
}

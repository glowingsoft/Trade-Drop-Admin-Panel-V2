import { pdf } from '@react-pdf/renderer';

// ----------------------------------------------------------------------

export async function exportToPdf({ filename, pdfDocument }) {
  const blob = await pdf(pdfDocument).toBlob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

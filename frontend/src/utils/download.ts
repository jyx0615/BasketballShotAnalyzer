import { jsPDF } from 'jspdf';

export async function downloadImage(url: string, filename: string) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Error downloading image:', error);
  }
}

export function generatePDF(result: any) {
  const doc = new jsPDF();
  const lineHeight = 10;
  let yPosition = 20;

  doc.addFont('SourceHanSans-Normal.ttf', 'SourceHanSans-Normal', 'normal');
  doc.setFont('SourceHanSans-Normal');

  // Add title
  doc.setFontSize(20);
  doc.text('Shot Analysis Feedback', 20, yPosition);
  yPosition += lineHeight * 2;

  // Add feedback sections
  doc.setFontSize(12);
  result.feedback.forEach((f: any) => {
    // Add section title
    doc.text(f.title, 20, yPosition);
    yPosition += lineHeight;

    // Add section content
    const contentLines = doc.splitTextToSize(f.content, 170); // Split long text to fit page width
    doc.text(contentLines, 20, yPosition);
    yPosition += lineHeight * (contentLines.length + 1);

    // Add some spacing between sections
    yPosition += lineHeight / 2;
  });

  // Save the PDF
  doc.save('shot-analysis-feedback.pdf');
}
import jsPDF from 'jspdf';

export interface PDFGenerationOptions {
  sanctionLetter: string;
  customerName: string;
  loanAmount: number;
  customerId: string;
}

export class PDFGenerator {
  generate(options: PDFGenerationOptions): Blob {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set up fonts and styling
    doc.setFont('helvetica');
    
    // Add official letterhead
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('FINSYNC AI FINANCIAL SERVICES LIMITED', 105, 20, { align: 'center' });
    
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(60, 60, 60);
    doc.text('Registered Office: 123 Finance Street, Mumbai - 400001, India', 105, 26, { align: 'center' });
    doc.text('CIN: U65999MH2024PLC123456 | NBFC Registration: N-14.03299', 105, 30, { align: 'center' });
    doc.text('Tel: 1800-FINSYNC | Email: loans@finsyncai.com | www.finsyncai.com', 105, 34, { align: 'center' });
    
    // Add horizontal line
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(0.8);
    doc.line(20, 38, 190, 38);
    doc.setLineWidth(0.3);
    doc.line(20, 39.5, 190, 39.5);

    // Parse and format the sanction letter
    const lines = this.formatSanctionLetter(options.sanctionLetter);
    
    let yPosition = 45;
    const lineHeight = 5;
    const pageHeight = 280;
    const marginBottom = 20;

    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    lines.forEach((line) => {
      // Check if we need a new page
      if (yPosition > pageHeight - marginBottom) {
        doc.addPage();
        yPosition = 20;
      }

      // Handle different line types
      if (line.startsWith('━')) {
        // Separator line
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.2);
        doc.line(20, yPosition, 190, yPosition);
        yPosition += 3;
      } else if (line.trim() === '') {
        // Empty line
        yPosition += 3;
      } else if (line.includes('LOAN DETAILS') || line.includes('FINANCIAL BREAKDOWN') || line.includes('EMI AMORTIZATION')) {
        // Section headers
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(168, 85, 247);
        doc.text(line.trim(), 20, yPosition);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        yPosition += lineHeight + 2;
      } else if (line.includes(':')) {
        // Key-value pairs
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':');
        
        doc.setFont('helvetica', 'bold');
        doc.text(key.trim() + ':', 25, yPosition);
        
        doc.setFont('helvetica', 'normal');
        const keyWidth = doc.getTextWidth(key.trim() + ': ');
        
        // Wrap long values
        const maxWidth = 165 - keyWidth;
        const wrappedValue = doc.splitTextToSize(value.trim(), maxWidth);
        doc.text(wrappedValue, 25 + keyWidth, yPosition);
        
        yPosition += lineHeight * wrappedValue.length;
      } else {
        // Regular text
        const wrappedText = doc.splitTextToSize(line.trim(), 170);
        doc.text(wrappedText, 25, yPosition);
        yPosition += lineHeight * wrappedText.length;
      }
    });

    // Add legal footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Footer separator line
      doc.setDrawColor(0, 0, 0);
      doc.setLineWidth(0.3);
      doc.line(20, doc.internal.pageSize.height - 20, 190, doc.internal.pageSize.height - 20);
      
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(
        'This is a system-generated document and does not require physical signature.',
        105,
        doc.internal.pageSize.height - 16,
        { align: 'center' }
      );
      doc.text(
        'Subject to RBI NBFC Guidelines | Governed by Indian Contract Act, 1872',
        105,
        doc.internal.pageSize.height - 12,
        { align: 'center' }
      );
      doc.text(
        `Page ${i} of ${totalPages} | Document ID: FSL-${options.customerId}-${Date.now()}`,
        105,
        doc.internal.pageSize.height - 8,
        { align: 'center' }
      );
    }

    return doc.output('blob');
  }

  private formatSanctionLetter(letter: string): string[] {
    return letter.split('\n').map(line => line.trimEnd());
  }

  downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async generateAndDownload(options: PDFGenerationOptions): Promise<string> {
    try {
      const blob = this.generate(options);
      const filename = `FinSync_Sanction_Letter_${options.customerId}_${Date.now()}.pdf`;
      this.downloadPDF(blob, filename);
      return filename;
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw new Error('Failed to generate PDF. Please try again.');
    }
  }

  getBase64(options: PDFGenerationOptions): string {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Same content generation as generate() method
    doc.setFont('helvetica');
    doc.setFontSize(24);
    doc.setTextColor(168, 85, 247);
    doc.text('FinSync AI', 20, 25);
    
    const lines = this.formatSanctionLetter(options.sanctionLetter);
    let yPosition = 45;
    
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    lines.forEach((line) => {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(line, 20, yPosition);
      yPosition += 5;
    });

    return doc.output('datauristring');
  }
}

export const pdfGenerator = new PDFGenerator();

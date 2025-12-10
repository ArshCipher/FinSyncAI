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
    
    // Add FinSync AI logo/header
    doc.setFontSize(24);
    doc.setTextColor(168, 85, 247); // Purple color
    doc.text('FinSync AI', 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Instant Loan Approval Platform', 20, 32);
    
    // Add horizontal line
    doc.setDrawColor(168, 85, 247);
    doc.setLineWidth(0.5);
    doc.line(20, 36, 190, 36);

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

    // Add footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Page ${i} of ${totalPages}`,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10,
        { align: 'center' }
      );
      doc.text(
        'FinSync AI - Powered by Advanced AI | support@finsync.ai | 1800-FINSYNC',
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 5,
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

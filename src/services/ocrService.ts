// OCR Service for document analysis
import { createWorker } from 'tesseract.js';

export interface SalarySlipData {
  employerName?: string;
  employeeName?: string;
  monthlyGrossSalary?: number;
  netSalary?: number;
  deductions?: number;
  month?: string;
  year?: string;
  verified: boolean;
  rawText: string;
}

export const OCRService = {
  async analyzeSalarySlip(file: File): Promise<SalarySlipData> {
    try {
      // Create Tesseract worker
      const worker = await createWorker('eng');
      
      // Convert file to image data URL
      const imageData = await fileToDataURL(file);
      
      // Perform OCR
      const { data: { text } } = await worker.recognize(imageData);
      
      await worker.terminate();
      
      // Extract salary information from text
      const analysis = extractSalaryInfo(text);
      
      return {
        ...analysis,
        rawText: text,
        verified: true
      };
    } catch (error) {
      console.error('OCR Error:', error);
      return {
        verified: false,
        rawText: ''
      };
    }
  }
};

// Helper function to convert file to data URL
function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Extract salary information from OCR text
function extractSalaryInfo(text: string): Partial<SalarySlipData> {
  const result: Partial<SalarySlipData> = {};
  
  // Extract employer name (usually near top, might have "Company" or "Employer")
  const employerMatch = text.match(/(?:company|employer|organization)[\s:]*([A-Za-z\s&.]+)/i);
  if (employerMatch) {
    result.employerName = employerMatch[1].trim();
  }
  
  // Extract employee name
  const nameMatch = text.match(/(?:employee name|name)[\s:]*([A-Za-z\s.]+)/i);
  if (nameMatch) {
    result.employeeName = nameMatch[1].trim();
  }
  
  // Extract gross salary (look for common patterns)
  const grossMatch = text.match(/(?:gross salary|gross pay|total earnings|gross)[\s:]*(?:Rs\.?|INR|₹)?[\s]*([0-9,]+(?:\.[0-9]{2})?)/i);
  if (grossMatch) {
    result.monthlyGrossSalary = parseAmount(grossMatch[1]);
  }
  
  // Extract net salary
  const netMatch = text.match(/(?:net salary|net pay|take home|net amount)[\s:]*(?:Rs\.?|INR|₹)?[\s]*([0-9,]+(?:\.[0-9]{2})?)/i);
  if (netMatch) {
    result.netSalary = parseAmount(netMatch[1]);
  }
  
  // Extract deductions
  const deductionsMatch = text.match(/(?:total deductions|deductions)[\s:]*(?:Rs\.?|INR|₹)?[\s]*([0-9,]+(?:\.[0-9]{2})?)/i);
  if (deductionsMatch) {
    result.deductions = parseAmount(deductionsMatch[1]);
  }
  
  // Extract month and year
  const monthMatch = text.match(/(January|February|March|April|May|June|July|August|September|October|November|December)[\s-]*([0-9]{4})/i);
  if (monthMatch) {
    result.month = monthMatch[1];
    result.year = monthMatch[2];
  }
  
  return result;
}

// Parse amount string to number
function parseAmount(amountStr: string): number {
  return parseInt(amountStr.replace(/,/g, ''), 10);
}

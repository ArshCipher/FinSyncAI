// Email delivery simulation service
export interface EmailDeliveryOptions {
  to: string;
  customerName: string;
  subject: string;
  body: string;
  pdfAttachment?: {
    filename: string;
    data: string; // base64 encoded PDF
  };
}

export interface EmailDeliveryResult {
  success: boolean;
  messageId: string;
  timestamp: Date;
  deliveryStatus: 'sent' | 'queued' | 'failed';
  recipientEmail: string;
}

export class EmailDeliveryService {
  private simulatedDelay = 2000; // 2 seconds to simulate email sending

  async sendSanctionLetter(options: EmailDeliveryOptions): Promise<EmailDeliveryResult> {
    // Simulate API call delay
    await this.delay(this.simulatedDelay);

    // In a real application, this would call an email API like SendGrid, AWS SES, etc.
    // For now, we'll simulate a successful email delivery
    
    console.log('📧 EMAIL DELIVERY SIMULATION');
    console.log('═══════════════════════════════════════════════');
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Customer: ${options.customerName}`);
    console.log(`Has Attachment: ${options.pdfAttachment ? 'Yes' : 'No'}`);
    if (options.pdfAttachment) {
      console.log(`Attachment: ${options.pdfAttachment.filename}`);
    }
    console.log('═══════════════════════════════════════════════');
    console.log('Body:');
    console.log(options.body);
    console.log('═══════════════════════════════════════════════');

    // Simulate successful delivery
    const messageId = `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      success: true,
      messageId,
      timestamp: new Date(),
      deliveryStatus: 'sent',
      recipientEmail: options.to
    };
  }

  generateEmailBody(
    customerName: string,
    loanAmount: number,
    emi: number,
    tenure: number
  ): string {
    return `Dear ${customerName},

Congratulations! 🎉

Your personal loan application has been APPROVED by FinSync AI's automated underwriting system.

LOAN SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Loan Amount: ₹${loanAmount.toLocaleString('en-IN')}
• Monthly EMI: ₹${emi.toLocaleString('en-IN')}
• Loan Tenure: ${tenure} months (${Math.round(tenure/12)} years)

Your complete sanction letter is attached to this email as a PDF document.

NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Review the attached sanction letter carefully
2. Accept the loan offer through our platform
3. Complete digital KYC verification (if not done)
4. Sign the loan agreement electronically
5. Receive funds directly in your bank account within 24 hours

WHAT MAKES FINSYNC AI SPECIAL:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Instant AI-powered approval
✓ Competitive interest rates
✓ No hidden charges
✓ 100% digital process
✓ Quick disbursement
✓ Transparent terms

If you have any questions or need assistance, our support team is available 24/7.

Email: support@finsync.ai
Phone: 1800-FINSYNC (346-7962)
Website: https://finsync.ai

Thank you for choosing FinSync AI for your financial needs!

Warm regards,
The FinSync AI Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This is an automated email. Please do not reply directly to this message.
For support, contact us at support@finsync.ai

FinSync AI | Powered by Advanced AI Technology
Regulated by RBI | All loans subject to terms & conditions
`;
  }

  async sendWithAttachment(
    recipientEmail: string,
    customerName: string,
    loanAmount: number,
    emi: number,
    tenure: number,
    pdfBase64: string,
    pdfFilename: string
  ): Promise<EmailDeliveryResult> {
    const emailOptions: EmailDeliveryOptions = {
      to: recipientEmail,
      customerName,
      subject: `🎉 Loan Approved - Sanction Letter | FinSync AI`,
      body: this.generateEmailBody(customerName, loanAmount, emi, tenure),
      pdfAttachment: {
        filename: pdfFilename,
        data: pdfBase64
      }
    };

    return this.sendSanctionLetter(emailOptions);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Simulate different delivery scenarios
  async testDelivery(email: string): Promise<{valid: boolean; message: string}> {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      return {
        valid: false,
        message: 'Invalid email format. Please provide a valid email address.'
      };
    }

    // Simulate checking if email exists (in real app, would use an email verification API)
    await this.delay(500);

    return {
      valid: true,
      message: 'Email address is valid and ready to receive messages.'
    };
  }

  formatDeliveryConfirmation(result: EmailDeliveryResult): string {
    return `
📧 EMAIL DELIVERY CONFIRMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ${result.success ? '✅ SENT' : '❌ FAILED'}
Message ID: ${result.messageId}
Recipient: ${result.recipientEmail}
Timestamp: ${result.timestamp.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'long'
    })}
Delivery Status: ${result.deliveryStatus.toUpperCase()}

Your sanction letter has been successfully sent to your email address.
Please check your inbox (and spam folder) for the email.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
  }
}

export const emailService = new EmailDeliveryService();

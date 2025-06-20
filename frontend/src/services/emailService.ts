// src/services/emailService.ts
import emailjs from "@emailjs/browser";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
}

export class EmailService {
  // 🎯 Professional Kurzora Email Service
  private static readonly SERVICE_ID = "service_0d7fb6k"; // Your Kurzora Server
  private static readonly NOTIFICATION_TEMPLATE_ID = "template_mo3e2nj"; // Working perfectly!
  private static readonly PUBLIC_KEY = "ikJ4tcMd7GP9ZQ8Na";

  static async sendContactEmail(
    formData: ContactFormData
  ): Promise<EmailResponse> {
    try {
      // Initialize EmailJS
      emailjs.init(this.PUBLIC_KEY);
      console.log("🚀 EmailJS initialized with Kurzora Server");

      const timestamp = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Berlin",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // Send professional notification email to you
      const notificationParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        to_email: "support@kurzora.com",
        reply_to: formData.email,
        timestamp: timestamp,
        platform: "Kurzora Trading Platform",
        browser: navigator.userAgent,
        page_url: window.location.href,
      };

      console.log("📤 Sending notification to support@kurzora.com...");
      const response = await emailjs.send(
        this.SERVICE_ID,
        this.NOTIFICATION_TEMPLATE_ID,
        notificationParams
      );

      console.log("✅ Notification sent successfully!", response.status);

      return {
        success: true,
        message:
          "Thank you for your message! We'll get back to you within 24 hours.",
      };
    } catch (error) {
      console.error("❌ Failed to send notification:", error);
      return {
        success: false,
        message:
          "Sorry, there was an error sending your message. Please try again or email us directly at support@kurzora.com",
      };
    }
  }

  // 🧪 Test function for verification
  static async testEmailService(): Promise<EmailResponse> {
    const testData: ContactFormData = {
      name: "Test User",
      email: "test@example.com",
      subject: "Contact Form Test",
      message:
        "This is a test message to verify the Kurzora contact form is working correctly.",
    };

    console.log("🧪 Testing Kurzora email service...");
    const result = await this.sendContactEmail(testData);
    console.log("🧪 Test result:", result);
    return result;
  }
}

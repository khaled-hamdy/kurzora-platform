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
  // 🎯 Using your Kurzora Server (support@kurzora.com)
  private static readonly SERVICE_ID = "service_0d7fb6k";
  private static readonly NOTIFICATION_TEMPLATE_ID = "template_mo3e2nj"; // Works!
  private static readonly AUTO_REPLY_TEMPLATE_ID = "template_p0gxqmq"; // Let's test this
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

      // 1️⃣ Send notification email to you (this works!)
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

      console.log("📤 Sending notification via Kurzora Server...");
      const notificationResponse = await emailjs.send(
        this.SERVICE_ID,
        this.NOTIFICATION_TEMPLATE_ID,
        notificationParams
      );

      console.log(
        "✅ Notification sent successfully!",
        notificationResponse.status
      );

      // 2️⃣ Try auto-reply again (with better error handling)
      try {
        const autoReplyParams = {
          from_name: formData.name,
          email: formData.email, // Customer's email (for "To" field)
          from_email: formData.email, // Customer's email (for content)
          subject: formData.subject,
          message: formData.message,
          timestamp: timestamp,
        };

        console.log("📤 Sending auto-reply via Kurzora Server...");
        console.log("📧 Auto-reply will be sent to:", formData.email);
        console.log("📋 Auto-reply params:", autoReplyParams);

        const autoReplyResponse = await emailjs.send(
          this.SERVICE_ID,
          this.AUTO_REPLY_TEMPLATE_ID,
          autoReplyParams
        );

        console.log(
          "✅ Auto-reply sent successfully!",
          autoReplyResponse.status
        );

        return {
          success: true,
          message:
            "Thank you for your message! We've sent you a confirmation email and will get back to you within 24 hours.",
        };
      } catch (autoReplyError) {
        console.error(
          "❌ Auto-reply failed, but notification was sent:",
          autoReplyError
        );

        // Still consider it success since notification worked
        return {
          success: true,
          message:
            "Thank you for your message! We'll get back to you within 24 hours.",
        };
      }
    } catch (error) {
      console.error("❌ EmailJS Error:", error);
      return {
        success: false,
        message:
          "Sorry, there was an error sending your message. Please try again or email us directly at support@kurzora.com",
      };
    }
  }

  // 🧪 Test auto-reply only
  static async testAutoReplyOnly(
    customerEmail: string
  ): Promise<EmailResponse> {
    try {
      emailjs.init(this.PUBLIC_KEY);

      const testParams = {
        from_name: "Test User",
        email: customerEmail,
        from_email: customerEmail,
        subject: "Test Auto-Reply",
        message: "This is a test of the auto-reply system.",
        timestamp: new Date().toLocaleString(),
      };

      console.log("🧪 Testing auto-reply to:", customerEmail);
      const response = await emailjs.send(
        this.SERVICE_ID,
        this.AUTO_REPLY_TEMPLATE_ID,
        testParams
      );

      return {
        success: response.status === 200,
        message:
          response.status === 200
            ? "Auto-reply test successful!"
            : "Auto-reply test failed",
      };
    } catch (error) {
      console.error("❌ Auto-reply test failed:", error);
      return {
        success: false,
        message: "Auto-reply test failed",
      };
    }
  }
}

import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
import {
  Mail,
  MessageCircle,
  MapPin,
  Send,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { EmailService } from "../services/emailService";

// 🔧 SESSION #208: LAYOUT FIX - Changed from Dashboard Layout to public layout pattern
// 🎯 PURPOSE: Make Contact page accessible to both logged-in and non-logged-in users
// 🛡️ PRESERVATION: All existing contact form functionality, EmailService integration, and state management maintained exactly
// 📝 HANDOVER: Now uses same public layout pattern as HowItWorks.tsx and legal pages

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // 🛡️ PRESERVED: All existing state management and functionality maintained exactly
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🛡️ PRESERVED: Enhanced handleSubmit function that actually sends emails - maintained exactly
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Start loading state
    setIsSubmitting(true);

    try {
      // Send email using our EmailService
      const result = await EmailService.sendContactEmail(formData);

      if (result.success) {
        // Show success message in user's language
        toast.success(
          language === "ar"
            ? "تم إرسال رسالتك بنجاح! سنرد عليك قريباً."
            : language === "de"
            ? "Ihre Nachricht wurde erfolgreich gesendet! Wir werden uns bald bei Ihnen melden."
            : "Your message has been sent successfully! We'll get back to you soon."
        );

        // Clear the form
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        // Show error message
        toast.error(
          language === "ar"
            ? "عذراً، حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى."
            : language === "de"
            ? "Entschuldigung, beim Senden der Nachricht ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
            : "Sorry, there was an error sending your message. Please try again."
        );
      }
    } catch (error) {
      // Handle any unexpected errors
      toast.error(
        language === "ar"
          ? "عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
          : language === "de"
          ? "Entschuldigung, ein unerwarteter Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
          : "Sorry, an unexpected error occurred. Please try again."
      );
    } finally {
      // Stop loading state
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* 🔧 SESSION #208: Public navigation (copied from HowItWorks.tsx pattern) */}
      <nav className="bg-slate-900/50 backdrop-blur-sm border-b border-blue-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Link to="/" className="flex items-center space-x-2">
              <div className="logo-container">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 chart-element" />
                  <span className="logo-text text-xl sm:text-2xl font-bold">
                    Kurzora
                  </span>
                </div>
              </div>
            </Link>

            <Link
              to="/"
              className="text-slate-300 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* 🛡️ PRESERVED: All existing contact page content maintained exactly */}
      <div
        className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
          language === "ar" ? "rtl" : "ltr"
        }`}
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {language === "ar"
              ? "تواصل معنا"
              : language === "de"
              ? "Kontaktieren Sie uns"
              : "Contact Us"}
          </h1>
          <p className="text-slate-400 text-lg">
            {language === "ar"
              ? "نحن هنا لمساعدتك. تواصل معنا لأي أسئلة أو استفسارات."
              : language === "de"
              ? "Wir sind hier, um zu helfen. Kontaktieren Sie uns bei Fragen oder Anfragen."
              : "We're here to help. Reach out to us for any questions or inquiries."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {language === "ar"
                ? "ابقى على تواصل"
                : language === "de"
                ? "In Kontakt bleiben"
                : "Get in Touch"}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {language === "ar"
                      ? "البريد الإلكتروني"
                      : language === "de"
                      ? "E-Mail"
                      : "Email"}
                  </h3>
                  <p className="text-slate-400">support@kurzora.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-emerald-600/20 rounded-lg">
                  <MessageCircle className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Discord</h3>
                  <p className="text-slate-400">
                    <a
                      href="https://discord.gg/dsnNThc6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      Join our community
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <Send className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Telegram</h3>
                  <p className="text-slate-400">
                    <a
                      href="https://t.me/kurzora_alert_bot"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      @kurzora_alert_bot
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-600/20 rounded-lg">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {language === "ar"
                      ? "العنوان"
                      : language === "de"
                      ? "Adresse"
                      : "Address"}
                  </h3>
                  <p className="text-slate-400">
                    {language === "ar"
                      ? "كورفورستنداام 11، 10719 برلين، ألمانيا"
                      : language === "de"
                      ? "Kurfürstendamm 11, 10719 Berlin, Deutschland"
                      : "Kurfürstendamm 11, 10719 Berlin, Germany"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              {language === "ar"
                ? "أرسل رسالة"
                : language === "de"
                ? "Nachricht senden"
                : "Send a Message"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {language === "ar"
                    ? "الاسم"
                    : language === "de"
                    ? "Name"
                    : "Name"}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-slate-800 border border-blue-800/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {language === "ar"
                    ? "البريد الإلكتروني"
                    : language === "de"
                    ? "E-Mail"
                    : "Email"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-slate-800 border border-blue-800/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {language === "ar"
                    ? "الموضوع"
                    : language === "de"
                    ? "Betreff"
                    : "Subject"}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-slate-800 border border-blue-800/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  {language === "ar"
                    ? "الرسالة"
                    : language === "de"
                    ? "Nachricht"
                    : "Message"}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                  rows={5}
                  className="w-full px-4 py-2 bg-slate-800 border border-blue-800/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              {/* 🛡️ PRESERVED: Enhanced submit button with loading state maintained exactly */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  // Show loading spinner when submitting
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>
                      {language === "ar"
                        ? "جاري الإرسال..."
                        : language === "de"
                        ? "Wird gesendet..."
                        : "Sending..."}
                    </span>
                  </div>
                ) : // Show normal text when not submitting
                language === "ar" ? (
                  "إرسال الرسالة"
                ) : language === "de" ? (
                  "Nachricht senden"
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* 🔧 SESSION #208: Public footer (copied from HowItWorks.tsx pattern) */}
      <footer className="bg-slate-950/50 border-t border-blue-800/30 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="logo-container">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 chart-element" />
                    <span className="logo-text text-base sm:text-lg font-bold">
                      Kurzora
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-4">
                Professional AI-powered trading intelligence with
                institutional-grade analysis.
              </p>
              <div className="flex items-center mt-4">
                <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center">
                  <Shield className="h-3 w-3 mr-1" />
                  Shariah Compliant
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
                Platform
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link to="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/how-it-works"
                    className="hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    to="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
                Support
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <a
                    href="https://discord.gg/kurzora"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/KurzoraPlatform"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    to="/privacy-policy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-of-service"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/risk-disclosure"
                    className="hover:text-white transition-colors"
                  >
                    Risk Disclosure
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shariah-compliance"
                    className="hover:text-white transition-colors"
                  >
                    Shariah Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-blue-800/30 pt-6 sm:pt-8 mt-6 sm:mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-center text-slate-400 text-xs sm:text-sm">
                © 2024 Kurzora. All rights reserved. Trading involves risk and
                may not be suitable for all investors.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;

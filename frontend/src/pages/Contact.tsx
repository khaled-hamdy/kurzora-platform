import React, { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import Layout from "../components/Layout";
import { Mail, MessageCircle, Phone, MapPin, Send } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { EmailService } from "../services/emailService"; // 👈 NEW: Import our email service

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // 👈 NEW: Add loading state for better user experience
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👈 UPDATED: Enhanced handleSubmit function that actually sends emails
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
    <Layout>
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
                <div className="p-3 bg-amber-600/20 rounded-lg">
                  <Phone className="h-6 w-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    {language === "ar"
                      ? "الهاتف"
                      : language === "de"
                      ? "Telefon"
                      : "Phone"}
                  </h3>
                  <p className="text-slate-400">+49 176 32578461</p>
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
                  disabled={isSubmitting} // 👈 NEW: Disable when submitting
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
                  disabled={isSubmitting} // 👈 NEW: Disable when submitting
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
                  disabled={isSubmitting} // 👈 NEW: Disable when submitting
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
                  disabled={isSubmitting} // 👈 NEW: Disable when submitting
                  rows={5}
                  className="w-full px-4 py-2 bg-slate-800 border border-blue-800/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              {/* 👈 UPDATED: Enhanced submit button with loading state */}
              <Button
                type="submit"
                disabled={isSubmitting} // 👈 NEW: Disable when submitting
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
    </Layout>
  );
};

export default Contact;

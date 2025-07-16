// 🎯 PURPOSE: Privacy Policy page for data protection and user transparency
// 🔧 SESSION #188: FOOTER CONSISTENCY FIX - Changed hardcoded "Telegram" to "Twitter" to match other pages
// 🔧 SESSION #190: PRICING LINK CONSISTENCY FIX - Added missing "Pricing" link to Platform section to match HowItWorks.tsx pattern
// 🛡️ PRESERVATION: All existing privacy policy functionality maintained exactly as before
// 📝 HANDOVER: Footer now shows complete Platform navigation (Home + How It Works + Pricing) consistently across all pages

import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Shield, TrendingUp } from "lucide-react";

const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();

  return (
    // 🔧 SESSION #178: Public layout wrapper (replaces dashboard Layout component)
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* 🔧 SESSION #178: Simple public navigation (copied from HowItWorks.tsx pattern) */}
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

      {/* 🛡️ PRESERVED: All existing privacy policy content maintained exactly */}
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
          language === "ar" ? "rtl" : "ltr"
        }`}
      >
        {/* Header Section with Shield Icon */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === "ar"
              ? "سياسة الخصوصية"
              : language === "de"
              ? "Datenschutzrichtlinie"
              : "Privacy Policy"}
          </h1>
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-emerald-500" />
          </div>
        </div>

        {/* Professional Introduction - Matches "Audi Approach" Positioning */}
        <div className="bg-emerald-900/20 border border-emerald-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === "ar"
              ? "التزامنا بحماية خصوصيتك"
              : language === "de"
              ? "Unser Engagement für Ihren Datenschutz"
              : "Our Commitment to Your Privacy"}
          </h2>
          <p className="text-slate-300">
            {language === "ar"
              ? "في كورزورا، نحمي خصوصيتك بنفس المعايير المؤسسية التي نطبقها على منصة الذكاء التجاري المتقدمة لدينا. سياسة الخصوصية هذه تشرح كيف نجمع ونستخدم ونحمي معلوماتك الشخصية."
              : language === "de"
              ? "Bei Kurzora schützen wir Ihre Privatsphäre mit denselben institutionellen Standards, die wir auf unsere fortschrittliche Handelsintelligenz-Plattform anwenden. Diese Datenschutzrichtlinie erklärt, wie wir Ihre persönlichen Daten sammeln, verwenden und schützen."
              : "At Kurzora, we protect your privacy with the same institutional standards we apply to our advanced trading intelligence platform. This privacy policy explains how we collect, use, and protect your personal information."}
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-6 text-slate-300">
          {/* Information Collection */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "جمع المعلومات"
                : language === "de"
                ? "Informationssammlung"
                : "Information Collection"}
            </h2>
            <p className="mb-4">
              {language === "ar"
                ? "نجمع المعلومات التي تقدمها لنا مباشرة عند استخدام منصة كورزورا، مثل عند إنشاء حساب أو الاشتراك في خدمات الذكاء التجاري أو الاتصال بفريق الدعم المتخصص لدينا. قد نجمع أيضاً معلومات حول كيفية تفاعلك مع منصتنا المتقدمة."
                : language === "de"
                ? "Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, wenn Sie die Kurzora-Plattform nutzen, wie z.B. beim Erstellen eines Kontos, beim Abonnieren von Handelsintelligenz-Diensten oder beim Kontakt mit unserem spezialisierten Support-Team. Wir können auch Informationen über Ihre Interaktion mit unserer fortschrittlichen Plattform sammeln."
                : "We collect information you provide directly to us when using the Kurzora platform, such as when you create an account, subscribe to trading intelligence services, or contact our specialized support team. We may also collect information about how you interact with our advanced platform."}
            </p>
          </section>

          {/* Use of Information */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "استخدام المعلومات"
                : language === "de"
                ? "Verwendung von Informationen"
                : "Use of Information"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm mb-3">
                {language === "ar"
                  ? "نستخدم معلوماتك لتقديم وتحسين خدمات منصة كورزورا المؤسسية:"
                  : language === "de"
                  ? "Wir verwenden Ihre Informationen zur Bereitstellung und Verbesserung der institutionellen Kurzora-Plattformdienste:"
                  : "We use your information to provide and improve institutional Kurzora platform services:"}
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  {language === "ar"
                    ? "تقديم وصيانة وتحسين خدمات الذكاء التجاري المتقدمة لدينا"
                    : language === "de"
                    ? "Bereitstellung, Wartung und Verbesserung unserer fortschrittlichen Handelsintelligenz-Dienste"
                    : "Provide, maintain, and improve our advanced trading intelligence services"}
                </li>
                <li>
                  {language === "ar"
                    ? "التواصل معك حول حسابك وإشارات التداول المؤسسية والتحديثات الهامة"
                    : language === "de"
                    ? "Kommunikation mit Ihnen über Ihr Konto, institutionelle Handelssignale und wichtige Updates"
                    : "Communicate with you about your account, institutional trading signals, and important updates"}
                </li>
                <li>
                  {language === "ar"
                    ? "إرسال التحديثات التقنية والأمنية المتعلقة بالمنصة"
                    : language === "de"
                    ? "Technische und Sicherheitsupdates zur Plattform senden"
                    : "Send technical and security updates related to the platform"}
                </li>
                <li>
                  {language === "ar"
                    ? "تحليل الأداء وتحسين تجربة المستخدم بالمعايير المؤسسية"
                    : language === "de"
                    ? "Leistungsanalyse und Verbesserung der Benutzererfahrung nach institutionellen Standards"
                    : "Analyze performance and improve user experience with institutional standards"}
                </li>
                <li>
                  {language === "ar"
                    ? "ضمان الامتثال للمتطلبات التنظيمية والأمنية"
                    : language === "de"
                    ? "Einhaltung regulatorischer und Sicherheitsanforderungen gewährleisten"
                    : "Ensure compliance with regulatory and security requirements"}
                </li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "أمان البيانات"
                : language === "de"
                ? "Datensicherheit"
                : "Data Security"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="mb-3">
                {language === "ar"
                  ? "نستخدم تدابير أمنية على مستوى المؤسسات لحماية معلوماتك الشخصية على منصة كورزورا:"
                  : language === "de"
                  ? "Wir verwenden Sicherheitsmaßnahmen auf institutionellem Niveau zum Schutz Ihrer persönlichen Daten auf der Kurzora-Plattform:"
                  : "We use institutional-level security measures to protect your personal information on the Kurzora platform:"}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  {language === "ar"
                    ? "تشفير متقدم للبيانات أثناء النقل والتخزين"
                    : language === "de"
                    ? "Erweiterte Datenverschlüsselung bei Übertragung und Speicherung"
                    : "Advanced data encryption in transit and at rest"}
                </li>
                <li>
                  {language === "ar"
                    ? "مراقبة أمنية على مدار الساعة طوال أيام الأسبوع"
                    : language === "de"
                    ? "24/7 Sicherheitsüberwachung"
                    : "24/7 security monitoring"}
                </li>
                <li>
                  {language === "ar"
                    ? "تحديثات أمنية منتظمة وتقييمات للثغرات"
                    : language === "de"
                    ? "Regelmäßige Sicherheitsupdates und Vulnerability-Assessments"
                    : "Regular security updates and vulnerability assessments"}
                </li>
                <li>
                  {language === "ar"
                    ? "ضوابط الوصول الصارمة والمصادقة متعددة العوامل"
                    : language === "de"
                    ? "Strenge Zugangskontrollen und Multi-Faktor-Authentifizierung"
                    : "Strict access controls and multi-factor authentication"}
                </li>
              </ul>
            </div>
          </section>

          {/* Cookies and Tracking */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "ملفات تعريف الارتباط والتتبع"
                : language === "de"
                ? "Cookies und Tracking"
                : "Cookies and Tracking"}
            </h2>
            <p>
              {language === "ar"
                ? "نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتحسين تجربتك على منصة كورزورا وتحليل استخدام المنصة وتقديم المحتوى المخصص. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك. لمزيد من التفاصيل، راجع إشعار ملفات تعريف الارتباط الخاص بنا."
                : language === "de"
                ? "Wir verwenden Cookies und ähnliche Tracking-Technologien, um Ihre Erfahrung auf der Kurzora-Plattform zu verbessern, die Plattformnutzung zu analysieren und personalisierten Inhalt bereitzustellen. Sie können Cookie-Einstellungen über Ihren Browser steuern. Weitere Details finden Sie in unserem Cookie-Hinweis."
                : "We use cookies and similar tracking technologies to improve your experience on the Kurzora platform, analyze platform usage, and provide personalized content. You can control cookie settings through your browser. For more details, see our Cookie Notice."}
            </p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "مشاركة البيانات"
                : language === "de"
                ? "Datenweitergabe"
                : "Data Sharing"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm mb-3">
                {language === "ar"
                  ? "نحن لا نبيع أو نؤجر أو نتداول معلوماتك الشخصية. قد نشارك البيانات فقط في الحالات التالية:"
                  : language === "de"
                  ? "Wir verkaufen, vermieten oder handeln nicht mit Ihren persönlichen Daten. Wir können Daten nur in folgenden Fällen weitergeben:"
                  : "We do not sell, rent, or trade your personal information. We may share data only in the following cases:"}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  {language === "ar"
                    ? "بموافقتك الصريحة"
                    : language === "de"
                    ? "Mit Ihrer ausdrücklichen Zustimmung"
                    : "With your explicit consent"}
                </li>
                <li>
                  {language === "ar"
                    ? "مع مقدمي الخدمات الموثوقين الذين يساعدون في تشغيل منصة كورزورا"
                    : language === "de"
                    ? "Mit vertrauenswürdigen Dienstleistern, die beim Betrieb der Kurzora-Plattform helfen"
                    : "With trusted service providers who help operate the Kurzora platform"}
                </li>
                <li>
                  {language === "ar"
                    ? "عند الطلب من قبل السلطات القانونية المختصة"
                    : language === "de"
                    ? "Auf Anfrage zuständiger Rechtsbehörden"
                    : "When required by competent legal authorities"}
                </li>
                <li>
                  {language === "ar"
                    ? "لحماية حقوق وأمان المستخدمين والمنصة"
                    : language === "de"
                    ? "Zum Schutz der Rechte und Sicherheit von Benutzern und Plattform"
                    : "To protect the rights and safety of users and the platform"}
                </li>
              </ul>
            </div>
          </section>

          {/* Your Rights and Choices */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "حقوقك وخياراتك"
                : language === "de"
                ? "Ihre Rechte und Wahlmöglichkeiten"
                : "Your Rights and Choices"}
            </h2>
            <p>
              {language === "ar"
                ? "لديك الحق في الوصول إلى معلوماتك الشخصية وتحديثها وحذفها من منصة كورزورا. يمكنك أيضاً إدارة تفضيلات الاتصال الخاصة بك وإلغاء الاشتراك في الاتصالات التسويقية. لممارسة هذه الحقوق أو لأي استفسارات حول الخصوصية، يرجى الاتصال بنا على support@kurzora.com."
                : language === "de"
                ? "Sie haben das Recht, auf Ihre persönlichen Daten auf der Kurzora-Plattform zuzugreifen, sie zu aktualisieren und zu löschen. Sie können auch Ihre Kommunikationspräferenzen verwalten und sich von Marketing-Kommunikation abmelden. Um diese Rechte auszuüben oder bei Datenschutzfragen kontaktieren Sie uns bitte unter support@kurzora.com."
                : "You have the right to access, update, and delete your personal information on the Kurzora platform. You can also manage your communication preferences and opt out of marketing communications. To exercise these rights or for any privacy inquiries, please contact us at support@kurzora.com."}
            </p>
          </section>

          {/* International Data Transfers */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "نقل البيانات الدولي"
                : language === "de"
                ? "Internationale Datenübertragungen"
                : "International Data Transfers"}
            </h2>
            <p>
              {language === "ar"
                ? "قد تتم معالجة بياناتك في بلدان خارج بلد إقامتك. نحن نضمن أن جميع عمليات نقل البيانات تتم وفقاً للقوانين المعمول بها وبضمانات مناسبة لحماية خصوصيتك وأمان بياناتك بالمعايير المؤسسية."
                : language === "de"
                ? "Ihre Daten können in Ländern außerhalb Ihres Wohnsitzlandes verarbeitet werden. Wir stellen sicher, dass alle Datenübertragungen im Einklang mit geltendem Recht und mit angemessenen Schutzmaßnahmen für Ihre Privatsphäre und Datensicherheit nach institutionellen Standards erfolgen."
                : "Your data may be processed in countries outside your country of residence. We ensure that all data transfers are conducted in accordance with applicable laws and with appropriate safeguards to protect your privacy and data security with institutional standards."}
            </p>
          </section>

          {/* Updates to Privacy Policy */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "تحديثات سياسة الخصوصية"
                : language === "de"
                ? "Updates der Datenschutzrichtlinie"
                : "Updates to Privacy Policy"}
            </h2>
            <p>
              {language === "ar"
                ? "قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر لتعكس التغييرات في ممارساتنا أو لأسباب تشغيلية أو قانونية أو تنظيمية. سنخطرك بأي تغييرات مهمة عن طريق نشر السياسة المحدثة على منصة كورزورا وإرسال إشعار عبر البريد الإلكتروني عند الاقتضاء."
                : language === "de"
                ? "Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren, um Änderungen in unseren Praktiken oder aus betrieblichen, rechtlichen oder regulatorischen Gründen widerzuspiegeln. Wir werden Sie über wesentliche Änderungen informieren, indem wir die aktualisierte Richtlinie auf der Kurzora-Plattform veröffentlichen und gegebenenfalls eine E-Mail-Benachrichtigung senden."
                : "We may update this privacy policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on the Kurzora platform and sending an email notification when appropriate."}
            </p>
          </section>
        </div>

        {/* Contact Footer - UPDATED: Kurzora email address */}
        <div className="mt-10 p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-lg">
          <p className="text-emerald-400 text-sm text-center">
            {language === "ar"
              ? "آخر تحديث: يوليو 2025 | للأسئلة حول سياسة الخصوصية، اتصل بنا على support@kurzora.com"
              : language === "de"
              ? "Zuletzt aktualisiert: Juli 2025 | Bei Fragen zur Datenschutzrichtlinie kontaktieren Sie uns unter support@kurzora.com"
              : "Last updated: July 2025 | For questions about our privacy policy, contact us at support@kurzora.com"}
          </p>
        </div>
      </div>

      {/* 🔧 SESSION #188: FOOTER CONSISTENCY FIX - Changed Telegram to Twitter for consistency */}
      {/* 🔧 SESSION #190: PRICING LINK CONSISTENCY FIX - Added missing "Pricing" link to Platform section */}
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
                  {/* 🔧 SESSION #190: PRICING LINK CONSISTENCY FIX - Added missing "Pricing" link to match HowItWorks.tsx pattern */}
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
                  {/* 🔧 SESSION #188: FIXED - Changed from Telegram to Twitter for footer consistency */}
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

export default PrivacyPolicy;

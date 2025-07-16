import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Shield, Check, TrendingUp } from "lucide-react";

// 🎯 PURPOSE: GDPR Compliance page for European data protection requirements
// 🔧 SESSION #178: LAYOUT FIX - Replaced dashboard Layout with public layout pattern
// 🔧 SESSION #188: FOOTER FIX - Changed Telegram link to Twitter link for consistency with Session #187 pattern
// 🔧 SESSION #189: DISCORD CONSISTENCY FIX - Added Discord link to Support section to match Home Page footer pattern
// 🔧 SESSION #190: PRICING LINK CONSISTENCY FIX - Added missing "Pricing" link to Platform section to match HowItWorks.tsx pattern
// 🛡️ PRESERVATION: Maintains all existing multilingual functionality and GDPR rights exactly
// 📝 HANDOVER: Complete GDPR compliance following "Audi Approach" - professional but accessible
// 🚨 LAYOUT CHANGE: Copied navigation pattern from HowItWorks.tsx to fix dashboard navigation showing on legal pages

const GDPRCompliance: React.FC = () => {
  const { language } = useLanguage();

  return (
    // 🔧 SESSION #188: Public layout wrapper (replaces dashboard Layout component)
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* 🔧 SESSION #188: Simple public navigation (copied from HowItWorks.tsx pattern) */}
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

      {/* 🛡️ PRESERVED: All existing GDPR compliance content maintained exactly */}
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
          language === "ar" ? "rtl" : "ltr"
        }`}
      >
        {/* Header Section with Shield Icon */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === "ar"
              ? "الامتثال للائحة GDPR"
              : language === "de"
              ? "DSGVO-Konformität"
              : "GDPR Compliance"}
          </h1>
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        {/* Professional Introduction - Matches "Audi Approach" Positioning */}
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === "ar"
              ? "التزامنا بخصوصية البيانات"
              : language === "de"
              ? "Unser Engagement für Datenschutz"
              : "Our Commitment to Data Privacy"}
          </h2>
          <p className="text-slate-300">
            {language === "ar"
              ? "نحن ملتزمون بحماية بياناتك الشخصية والامتثال للائحة العامة لحماية البيانات (GDPR) وقوانين حماية البيانات الأخرى المعمول بها في منصة كورزورا للذكاء التجاري المؤسسي."
              : language === "de"
              ? "Wir sind bestrebt, Ihre persönlichen Daten zu schützen und die Datenschutz-Grundverordnung (DSGVO) und andere geltende Datenschutzgesetze auf der Kurzora-Plattform für institutionelle Handelsintelligenz einzuhalten."
              : "We are committed to protecting your personal data and complying with the General Data Protection Regulation (GDPR) and other applicable data protection laws on the Kurzora institutional-grade trading intelligence platform."}
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-6 text-slate-300">
          {/* Your Rights Under GDPR */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "حقوقك بموجب GDPR"
                : language === "de"
                ? "Ihre Rechte unter der DSGVO"
                : "Your Rights Under GDPR"}
            </h2>
            <div className="space-y-3">
              {/* Right to Access */}
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "الحق في الوصول"
                      : language === "de"
                      ? "Recht auf Zugang"
                      : "Right to Access"}
                  </h3>
                  <p className="text-sm">
                    {language === "ar"
                      ? "يمكنك طلب معلومات حول البيانات الشخصية التي نحتفظ بها عنك في منصة كورزورا"
                      : language === "de"
                      ? "Sie können Informationen über die persönlichen Daten anfordern, die wir über Sie auf der Kurzora-Plattform speichern"
                      : "You can request information about the personal data we hold about you on the Kurzora platform"}
                  </p>
                </div>
              </div>

              {/* Right to Rectification */}
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "الحق في التصحيح"
                      : language === "de"
                      ? "Recht auf Berichtigung"
                      : "Right to Rectification"}
                  </h3>
                  <p className="text-sm">
                    {language === "ar"
                      ? "يمكنك طلب تصحيح أي بيانات غير دقيقة أو غير مكتملة في حسابك"
                      : language === "de"
                      ? "Sie können die Korrektur ungenauer oder unvollständiger Daten in Ihrem Konto verlangen"
                      : "You can request correction of any inaccurate or incomplete data in your account"}
                  </p>
                </div>
              </div>

              {/* Right to Erasure */}
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "الحق في المحو"
                      : language === "de"
                      ? "Recht auf Löschung"
                      : "Right to Erasure"}
                  </h3>
                  <p className="text-sm">
                    {language === "ar"
                      ? "يمكنك طلب حذف بياناتك الشخصية من منصة كورزورا في ظروف معينة"
                      : language === "de"
                      ? "Sie können unter bestimmten Umständen die Löschung Ihrer persönlichen Daten von der Kurzora-Plattform verlangen"
                      : "You can request deletion of your personal data from the Kurzora platform under certain circumstances"}
                  </p>
                </div>
              </div>

              {/* Right to Data Portability */}
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "الحق في قابلية النقل"
                      : language === "de"
                      ? "Recht auf Datenübertragbarkeit"
                      : "Right to Data Portability"}
                  </h3>
                  <p className="text-sm">
                    {language === "ar"
                      ? "يمكنك طلب استلام بياناتك من كورزورا بتنسيق منظم وقابل للقراءة آلياً"
                      : language === "de"
                      ? "Sie können verlangen, Ihre Daten von Kurzora in einem strukturierten, maschinenlesbaren Format zu erhalten"
                      : "You can request to receive your data from Kurzora in a structured, machine-readable format"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Basis for Processing */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "الأساس القانوني للمعالجة"
                : language === "de"
                ? "Rechtsgrundlage für die Verarbeitung"
                : "Legal Basis for Processing"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <ul className="space-y-2">
                <li>
                  <strong className="text-white">
                    {language === "ar"
                      ? "الموافقة:"
                      : language === "de"
                      ? "Einwilligung:"
                      : "Consent:"}
                  </strong>{" "}
                  {language === "ar"
                    ? "لإرسال التحديثات حول منصة كورزورا للذكاء التجاري وإشارات التداول المتقدمة"
                    : language === "de"
                    ? "Für den Versand von Updates über die Kurzora-Plattform für Handelsintelligenz und erweiterte Handelssignale"
                    : "For sending updates about the Kurzora trading intelligence platform and advanced trading signals"}
                </li>
                <li>
                  <strong className="text-white">
                    {language === "ar"
                      ? "تنفيذ العقد:"
                      : language === "de"
                      ? "Vertragserfüllung:"
                      : "Contract Performance:"}
                  </strong>{" "}
                  {language === "ar"
                    ? "لتقديم خدمات الذكاء التجاري المؤسسي والدعم الفني المتخصص"
                    : language === "de"
                    ? "Zur Bereitstellung von institutioneller Handelsintelligenz und spezialisiertem technischen Support"
                    : "To provide institutional-grade trading intelligence services and specialized technical support"}
                </li>
                <li>
                  <strong className="text-white">
                    {language === "ar"
                      ? "المصلحة المشروعة:"
                      : language === "de"
                      ? "Berechtigtes Interesse:"
                      : "Legitimate Interest:"}
                  </strong>{" "}
                  {language === "ar"
                    ? "لتحسين خدمات منصة كورزورا وضمان أمان البيانات والامتثال للمعايير المؤسسية"
                    : language === "de"
                    ? "Zur Verbesserung der Kurzora-Plattformdienste und Gewährleistung der Datensicherheit und Einhaltung institutioneller Standards"
                    : "To improve Kurzora platform services and ensure data security and compliance with institutional standards"}
                </li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "الاحتفاظ بالبيانات"
                : language === "de"
                ? "Datenspeicherung"
                : "Data Retention"}
            </h2>
            <p>
              {language === "ar"
                ? "نحتفظ ببياناتك الشخصية في منصة كورزورا فقط لطالما كان ذلك ضرورياً لتقديم خدمات الذكاء التجاري المؤسسي أو كما هو مطلوب بموجب القانون واللوائح المالية."
                : language === "de"
                ? "Wir speichern Ihre persönlichen Daten auf der Kurzora-Plattform nur so lange, wie es für die Bereitstellung institutioneller Handelsintelligenz-Dienste erforderlich ist oder gesetzlich und durch Finanzvorschriften vorgeschrieben."
                : "We retain your personal data on the Kurzora platform only for as long as necessary to provide institutional-grade trading intelligence services or as required by law and financial regulations."}
            </p>
          </section>

          {/* Exercising Your Rights */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "ممارسة حقوقك"
                : language === "de"
                ? "Ausübung Ihrer Rechte"
                : "Exercising Your Rights"}
            </h2>
            <p>
              {language === "ar"
                ? "لممارسة أي من حقوقك بموجب GDPR على منصة كورزورا، يرجى الاتصال بنا على support@kurzora.com. سنرد على طلبك خلال 30 يوماً وفقاً للمعايير المؤسسية للخدمة."
                : language === "de"
                ? "Um eines Ihrer Rechte unter der DSGVO auf der Kurzora-Plattform auszuüben, kontaktieren Sie uns bitte unter support@kurzora.com. Wir werden innerhalb von 30 Tagen gemäß institutionellen Servicestandards auf Ihre Anfrage antworten."
                : "To exercise any of your rights under GDPR on the Kurzora platform, please contact us at support@kurzora.com. We will respond to your request within 30 days in accordance with institutional service standards."}
            </p>
          </section>

          {/* Data Processing Transparency */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "الشفافية في معالجة البيانات"
                : language === "de"
                ? "Transparenz bei der Datenverarbeitung"
                : "Data Processing Transparency"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm mb-3">
                {language === "ar"
                  ? "نحن ملتزمون بالشفافية الكاملة في كيفية معالجة كورزورا لبياناتك:"
                  : language === "de"
                  ? "Wir sind vollständiger Transparenz verpflichtet, wie Kurzora Ihre Daten verarbeitet:"
                  : "We are committed to full transparency in how Kurzora processes your data:"}
              </p>
              <ul className="space-y-1 text-sm">
                <li>
                  •{" "}
                  {language === "ar"
                    ? "معالجة البيانات الآمنة للإشارات التجارية"
                    : language === "de"
                    ? "Sichere Datenverarbeitung für Handelssignale"
                    : "Secure data processing for trading signals"}
                </li>
                <li>
                  •{" "}
                  {language === "ar"
                    ? "تحليل الأداء والمخاطر وفقاً للمعايير المؤسسية"
                    : language === "de"
                    ? "Leistungs- und Risikoanalyse nach institutionellen Standards"
                    : "Performance and risk analysis according to institutional standards"}
                </li>
                <li>
                  •{" "}
                  {language === "ar"
                    ? "تخزين البيانات المشفرة في بنية تحتية آمنة"
                    : language === "de"
                    ? "Verschlüsselte Datenspeicherung in sicherer Infrastruktur"
                    : "Encrypted data storage in secure infrastructure"}
                </li>
                <li>
                  •{" "}
                  {language === "ar"
                    ? "عدم مشاركة البيانات مع أطراف ثالثة دون موافقة صريحة"
                    : language === "de"
                    ? "Keine Datenweitergabe an Dritte ohne ausdrückliche Zustimmung"
                    : "No data sharing with third parties without explicit consent"}
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Contact Footer - UPDATED: Kurzora email address */}
        <div className="mt-10 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
          <p className="text-blue-400 text-sm text-center">
            {language === "ar"
              ? "إذا لم تكن راضياً عن كيفية تعاملنا مع بياناتك على منصة كورزورا، فلديك الحق في تقديم شكوى إلى سلطة حماية البيانات المختصة في بلدك."
              : language === "de"
              ? "Wenn Sie mit unserem Umgang mit Ihren Daten auf der Kurzora-Plattform nicht zufrieden sind, haben Sie das Recht, eine Beschwerde bei der zuständigen Datenschutzbehörde in Ihrem Land einzureichen."
              : "If you are not satisfied with how we handle your data on the Kurzora platform, you have the right to lodge a complaint with the competent data protection authority in your country."}
          </p>
        </div>
      </div>

      {/* 🔧 SESSION #188: Public footer (copied from HowItWorks.tsx pattern) */}
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
                  {/* 🔧 SESSION #189: DISCORD CONSISTENCY FIX - Added Discord link to match Home Page footer pattern */}
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
                  {/* 🔧 SESSION #188: FOOTER FIX - Changed Telegram to Twitter with correct URL */}
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

export default GDPRCompliance;

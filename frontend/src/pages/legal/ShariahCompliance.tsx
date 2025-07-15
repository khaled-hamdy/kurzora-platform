import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import Layout from "../../components/Layout";
import { Shield, Check } from "lucide-react";

// 🎯 PURPOSE: Shariah Compliance page for Islamic finance requirements and transparency
// 🔧 SESSION #187: Updated for Kurzora branding and institutional-grade Islamic finance positioning
// 🛡️ PRESERVATION: Maintains all existing multilingual functionality and Islamic compliance features
// 📝 HANDOVER: Complete Shariah compliance following "Audi Approach" - professional Islamic finance standards

const ShariahCompliance: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
          language === "ar" ? "rtl" : "ltr"
        }`}
      >
        {/* Header Section with Shield Icon */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === "ar"
              ? "الامتثال للشريعة الإسلامية"
              : language === "de"
              ? "Scharia-Konformität"
              : "Shariah Compliance"}
          </h1>
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-green-500" />
          </div>
        </div>

        {/* Professional Introduction - Matches "Audi Approach" Positioning */}
        <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === "ar"
              ? "التزامنا بالامتثال للشريعة"
              : language === "de"
              ? "Unser Engagement für Scharia-Konformität"
              : "Our Commitment to Shariah Compliance"}
          </h2>
          <p className="text-slate-300">
            {language === "ar"
              ? "منصة كورزورا ملتزمة بتوفير حلول الذكاء التجاري المؤسسي المتوافقة مع أحكام الشريعة الإسلامية للمستثمرين المسلمين، مع ضمان أن جميع الإشارات والتحليلات تتبع المبادئ الإسلامية بمعايير مؤسسية متقدمة."
              : language === "de"
              ? "Die Kurzora-Plattform ist bestrebt, Scharia-konforme institutionelle Handelsintelligenz-Lösungen für muslimische Investoren bereitzustellen und sicherzustellen, dass alle Signale und Analysen den islamischen Prinzipien mit fortschrittlichen institutionellen Standards folgen."
              : "The Kurzora platform is committed to providing Shariah-compliant institutional-grade trading intelligence solutions for Muslim investors, ensuring that all signals and analysis follow Islamic principles with advanced institutional standards."}
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-6 text-slate-300">
          {/* Screening Criteria */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "معايير الفحص المؤسسي"
                : language === "de"
                ? "Institutionelle Screening-Kriterien"
                : "Institutional Screening Criteria"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Business Activity Screening */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "النشاط التجاري"
                      : language === "de"
                      ? "Geschäftstätigkeit"
                      : "Business Activity"}
                  </h3>
                </div>
                <p className="text-sm">
                  {language === "ar"
                    ? "نستبعد الشركات المشاركة في الكحول والقمار والتبغ والخنازير والأسلحة والخدمات المالية التقليدية القائمة على الفوائد"
                    : language === "de"
                    ? "Wir schließen Unternehmen aus, die mit Alkohol, Glücksspiel, Tabak, Schweinefleisch, Waffen und herkömmlichen zinsbasierten Finanzdienstleistungen befasst sind"
                    : "We exclude companies involved in alcohol, gambling, tobacco, pork, weapons, and conventional interest-based financial services"}
                </p>
              </div>

              {/* Financial Ratios */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "النسب المالية المؤسسية"
                      : language === "de"
                      ? "Institutionelle Finanzielle Kennzahlen"
                      : "Institutional Financial Ratios"}
                  </h3>
                </div>
                <p className="text-sm">
                  {language === "ar"
                    ? "الديون/القيمة السوقية < 33%, الاستثمارات غير المتوافقة < 33%, النقد/القيمة السوقية < 33%"
                    : language === "de"
                    ? "Schulden/Marktkapitalisierung < 33%, Nicht-konforme Investitionen < 33%, Bargeld/Marktkapitalisierung < 33%"
                    : "Debt/Market Cap < 33%, Non-compliant investments < 33%, Cash/Market Cap < 33%"}
                </p>
              </div>

              {/* Interest Income */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "الدخل من الفوائد"
                      : language === "de"
                      ? "Zinseinkommen"
                      : "Interest Income"}
                  </h3>
                </div>
                <p className="text-sm">
                  {language === "ar"
                    ? "نستبعد الشركات التي يشكل دخل الفوائد أكثر من 5% من إجمالي إيراداتها وفقاً للمعايير الشرعية المؤسسية"
                    : language === "de"
                    ? "Wir schließen Unternehmen aus, bei denen Zinseinkommen mehr als 5% des Gesamtumsatzes nach institutionellen Scharia-Standards ausmachen"
                    : "We exclude companies where interest income exceeds 5% of total revenue according to institutional Shariah standards"}
                </p>
              </div>

              {/* Purification Process */}
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "عملية التطهير المؤسسية"
                      : language === "de"
                      ? "Institutioneller Reinigungsprozess"
                      : "Institutional Purification Process"}
                  </h3>
                </div>
                <p className="text-sm">
                  {language === "ar"
                    ? "يتم حساب مبلغ التطهير للأرباح من المصادر غير المتوافقة باستخدام منهجيات مؤسسية متقدمة"
                    : language === "de"
                    ? "Reinigungsbetrag wird für Gewinne aus nicht-konformen Quellen mit fortschrittlichen institutionellen Methoden berechnet"
                    : "Purification amount calculated for profits from non-compliant sources using advanced institutional methodologies"}
                </p>
              </div>
            </div>
          </section>

          {/* Advanced Filtering Methodology */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "منهجية التصفية المتقدمة"
                : language === "de"
                ? "Erweiterte Filtermethodik"
                : "Advanced Filtering Methodology"}
            </h2>
            <div className="space-y-4">
              {/* Step 1: Business Activity Screening */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "فحص الأنشطة التجارية المؤسسي"
                      : language === "de"
                      ? "Institutionelles Geschäftstätigkeits-Screening"
                      : "Institutional Business Activity Screening"}
                  </h3>
                  <p className="text-sm mt-1">
                    {language === "ar"
                      ? "نحلل الأنشطة التجارية الأساسية للشركة باستخدام أدوات التحليل المؤسسي لضمان الامتثال الكامل للشريعة"
                      : language === "de"
                      ? "Wir analysieren die Kerngeschäftstätigkeiten des Unternehmens mit institutionellen Analysetools, um vollständige Scharia-Konformität sicherzustellen"
                      : "We analyze the company's core business activities using institutional analysis tools to ensure complete Shariah compliance"}
                  </p>
                </div>
              </div>

              {/* Step 2: Financial Analysis */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "التحليل المالي المتقدم"
                      : language === "de"
                      ? "Erweiterte Finanzanalyse"
                      : "Advanced Financial Analysis"}
                  </h3>
                  <p className="text-sm mt-1">
                    {language === "ar"
                      ? "نقوم بمراجعة النسب المالية للشركة مقابل العتبات المحددة باستخدام نماذج التحليل الكمي المؤسسية"
                      : language === "de"
                      ? "Wir überprüfen die Finanzkennzahlen des Unternehmens gegen definierte Schwellenwerte mit institutionellen quantitativen Analysemodellen"
                      : "We review the company's financial ratios against defined thresholds using institutional quantitative analysis models"}
                  </p>
                </div>
              </div>

              {/* Step 3: Continuous Monitoring */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "المراقبة المستمرة بالذكاء الاصطناعي"
                      : language === "de"
                      ? "Kontinuierliche KI-Überwachung"
                      : "Continuous AI Monitoring"}
                  </h3>
                  <p className="text-sm mt-1">
                    {language === "ar"
                      ? "نعيد تقييم الامتثال بشكل مستمر باستخدام الذكاء الاصطناعي المتقدم بناءً على أحدث البيانات المالية والتطورات التجارية"
                      : language === "de"
                      ? "Wir bewerten die Konformität kontinuierlich mit fortschrittlicher KI basierend auf den neuesten Finanzdaten und Geschäftsentwicklungen neu"
                      : "We continuously reassess compliance using advanced AI based on the latest financial data and business developments"}
                  </p>
                </div>
              </div>

              {/* Step 4: Expert Validation */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  4
                </div>
                <div>
                  <h3 className="text-white font-medium">
                    {language === "ar"
                      ? "التحقق من قبل الخبراء"
                      : language === "de"
                      ? "Expertenvalidierung"
                      : "Expert Validation"}
                  </h3>
                  <p className="text-sm mt-1">
                    {language === "ar"
                      ? "يتم مراجعة النتائج من قبل خبراء الشريعة والمالية الإسلامية لضمان الدقة والامتثال الكامل"
                      : language === "de"
                      ? "Ergebnisse werden von Scharia- und islamischen Finanzexperten überprüft, um Genauigkeit und vollständige Konformität zu gewährleisten"
                      : "Results are reviewed by Shariah and Islamic finance experts to ensure accuracy and complete compliance"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Institutional Shariah Supervision */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "الإشراف الشرعي المؤسسي"
                : language === "de"
                ? "Institutionelle Scharia-Aufsicht"
                : "Institutional Shariah Supervision"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="mb-4">
                {language === "ar"
                  ? "يتم مراجعة منهجية الفحص المتقدمة في منصة كورزورا من قبل علماء الشريعة المؤهلين والخبراء في المالية الإسلامية لضمان التوافق مع أحكام الشريعة الإسلامية وأفضل الممارسات المؤسسية."
                  : language === "de"
                  ? "Die erweiterte Screening-Methodik der Kurzora-Plattform wird von qualifizierten Scharia-Gelehrten und islamischen Finanzexperten überprüft, um die Übereinstimmung mit islamischen Prinzipien und besten institutionellen Praktiken zu gewährleisten."
                  : "The Kurzora platform's advanced screening methodology is reviewed by qualified Shariah scholars and Islamic finance experts to ensure alignment with Islamic principles and institutional best practices."}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-white font-medium mb-2">
                    {language === "ar"
                      ? "المعايير المتبعة:"
                      : language === "de"
                      ? "Befolgte Standards:"
                      : "Standards Followed:"}
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "معايير AAOIFI (منظمة المحاسبة والمراجعة للمؤسسات المالية الإسلامية)"
                        : language === "de"
                        ? "AAOIFI-Standards (Rechnungslegungs- und Prüfungsorganisation für islamische Finanzinstitute)"
                        : "AAOIFI Standards (Accounting and Auditing Organization for Islamic Financial Institutions)"}
                    </li>
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "مجلس الخدمات المالية الإسلامية (IFSB)"
                        : language === "de"
                        ? "Islamischer Finanzdienstleistungsrat (IFSB)"
                        : "Islamic Financial Services Board (IFSB)"}
                    </li>
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "معايير الاستثمار الإسلامي المؤسسية"
                        : language === "de"
                        ? "Institutionelle islamische Investmentstandards"
                        : "Institutional Islamic investment standards"}
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">
                    {language === "ar"
                      ? "التحديث والمراجعة:"
                      : language === "de"
                      ? "Aktualisierung und Überprüfung:"
                      : "Updates and Review:"}
                  </h4>
                  <ul className="text-sm space-y-1">
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "مراجعة ربع سنوية للمنهجية"
                        : language === "de"
                        ? "Vierteljährliche Methodenüberprüfung"
                        : "Quarterly methodology review"}
                    </li>
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "تحديث مستمر للبيانات"
                        : language === "de"
                        ? "Kontinuierliche Datenaktualisierung"
                        : "Continuous data updates"}
                    </li>
                    <li>
                      •{" "}
                      {language === "ar"
                        ? "تقييم مستقل من الخبراء"
                        : language === "de"
                        ? "Unabhängige Expertenbewertung"
                        : "Independent expert assessment"}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Technology and Innovation */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "التكنولوجيا والابتكار في الامتثال الشرعي"
                : language === "de"
                ? "Technologie und Innovation in der Scharia-Konformität"
                : "Technology and Innovation in Shariah Compliance"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm mb-3">
                {language === "ar"
                  ? "تستخدم منصة كورزورا تقنيات الذكاء الاصطناعي المتقدمة لتعزيز دقة وكفاءة الامتثال الشرعي:"
                  : language === "de"
                  ? "Die Kurzora-Plattform nutzt fortschrittliche KI-Technologien zur Verbesserung der Genauigkeit und Effizienz der Scharia-Konformität:"
                  : "The Kurzora platform utilizes advanced AI technologies to enhance the accuracy and efficiency of Shariah compliance:"}
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  •{" "}
                  {language === "ar"
                    ? "معالجة البيانات في الوقت الفعلي للشركات والأسواق"
                    : language === "de"
                    ? "Echtzeit-Datenverarbeitung für Unternehmen und Märkte"
                    : "Real-time data processing for companies and markets"}
                </li>
                <li>
                  •{" "}
                  {language === "ar"
                    ? "التحليل التنبؤي لتغييرات الامتثال المحتملة"
                    : language === "de"
                    ? "Prädiktive Analyse für potenzielle Compliance-Änderungen"
                    : "Predictive analysis for potential compliance changes"}
                </li>
                <li>
                  •{" "}
                  {language === "ar"
                    ? "التحقق الآلي من المعايير الشرعية المعقدة"
                    : language === "de"
                    ? "Automatisierte Verifizierung komplexer Scharia-Standards"
                    : "Automated verification of complex Shariah standards"}
                </li>
                <li>
                  •{" "}
                  {language === "ar"
                    ? "تقارير شفافة ومفصلة حول الامتثال"
                    : language === "de"
                    ? "Transparente und detaillierte Compliance-Berichte"
                    : "Transparent and detailed compliance reporting"}
                </li>
              </ul>
            </div>
          </section>
        </div>

        {/* Contact Footer - UPDATED: Kurzora support email */}
        <div className="mt-10 p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
          <p className="text-green-400 text-sm text-center">
            {language === "ar"
              ? "للحصول على مزيد من المعلومات حول امتثال منصة كورزورا للشريعة الإسلامية أو لمناقشة متطلبات الاستثمار الإسلامي المؤسسي، يرجى الاتصال بفريق الدعم المتخصص لدينا على support@kurzora.com"
              : language === "de"
              ? "Für weitere Informationen zur Scharia-Konformität der Kurzora-Plattform oder zur Diskussion institutioneller islamischer Investmentanforderungen wenden Sie sich bitte an unser spezialisiertes Support-Team unter support@kurzora.com"
              : "For more information about Kurzora platform's Shariah compliance or to discuss institutional Islamic investment requirements, please contact our specialized support team at support@kurzora.com"}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ShariahCompliance;

import React from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { FileText, TrendingUp, Shield } from "lucide-react";

// 🎯 PURPOSE: Terms of Service page for legal compliance and user agreements
// 🔧 SESSION #178: LAYOUT FIX - Replaced dashboard Layout with public layout pattern
// 🔧 SESSION #188: FOOTER FIX - Changed Telegram link to Twitter link for consistency with Session #187 pattern
// 🔧 SESSION #189: DISCORD CONSISTENCY FIX - Added Discord link to Support section to match Home Page footer pattern
// 🛡️ PRESERVATION: Maintains all existing multilingual functionality and legal protections exactly
// 📝 HANDOVER: Complete terms following "Audi Approach" - professional but accessible legal framework
// 🚨 LAYOUT CHANGE: Copied navigation pattern from HowItWorks.tsx to fix dashboard navigation showing on legal pages

const TermsOfService: React.FC = () => {
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

      {/* 🛡️ PRESERVED: All existing terms of service content maintained exactly */}
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${
          language === "ar" ? "rtl" : "ltr"
        }`}
      >
        {/* Header Section with Document Icon */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === "ar"
              ? "شروط الخدمة"
              : language === "de"
              ? "Nutzungsbedingungen"
              : "Terms of Service"}
          </h1>
          <div className="flex justify-center">
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
        </div>

        {/* Professional Introduction - Matches "Audi Approach" Positioning */}
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === "ar"
              ? "مرحباً بك في منصة كورزورا"
              : language === "de"
              ? "Willkommen auf der Kurzora-Plattform"
              : "Welcome to the Kurzora Platform"}
          </h2>
          <p className="text-slate-300">
            {language === "ar"
              ? "هذه الشروط والأحكام تحكم استخدامك لمنصة كورزورا للذكاء التجاري المؤسسي. من خلال الوصول إلى خدماتنا المتقدمة، فإنك توافق على الالتزام بهذه الشروط المصممة لحماية جميع مستخدمي المنصة."
              : language === "de"
              ? "Diese Allgemeinen Geschäftsbedingungen regeln Ihre Nutzung der Kurzora-Plattform für institutionelle Handelsintelligenz. Durch den Zugriff auf unsere fortschrittlichen Dienste stimmen Sie zu, sich an diese Bedingungen zu halten, die zum Schutz aller Plattformnutzer entwickelt wurden."
              : "These terms and conditions govern your use of the Kurzora institutional-grade trading intelligence platform. By accessing our advanced services, you agree to be bound by these terms designed to protect all platform users."}
          </p>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-6 text-slate-300">
          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "قبول الشروط"
                : language === "de"
                ? "Annahme der Bedingungen"
                : "Acceptance of Terms"}
            </h2>
            <p>
              {language === "ar"
                ? "باستخدام منصة كورزورا للذكاء التجاري المؤسسي، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام خدماتنا المتقدمة. تشكل هذه الاتفاقية عقداً ملزماً قانونياً بينك وبين كورزورا."
                : language === "de"
                ? "Durch die Nutzung der Kurzora-Plattform für institutionelle Handelsintelligenz stimmen Sie zu, an diese Geschäftsbedingungen gebunden zu sein. Wenn Sie diesen Bedingungen nicht zustimmen, verwenden Sie bitte unsere fortschrittlichen Dienste nicht. Diese Vereinbarung stellt einen rechtlich bindenden Vertrag zwischen Ihnen und Kurzora dar."
                : "By using the Kurzora institutional-grade trading intelligence platform, you agree to be bound by these terms and conditions. If you do not agree to these terms, please do not use our advanced services. This agreement constitutes a legally binding contract between you and Kurzora."}
            </p>
          </section>

          {/* Platform Usage */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "استخدام المنصة"
                : language === "de"
                ? "Plattformnutzung"
                : "Platform Usage"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm mb-3">
                {language === "ar"
                  ? "لاستخدام منصة كورزورا للذكاء التجاري المؤسسي، يجب عليك:"
                  : language === "de"
                  ? "Um die Kurzora-Plattform für institutionelle Handelsintelligenz zu nutzen, müssen Sie:"
                  : "To use the Kurzora institutional-grade trading intelligence platform, you must:"}
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  {language === "ar"
                    ? "أن تكون 18 عاماً أو أكثر أو بلغت سن الرشد القانوني في ولايتك القضائية"
                    : language === "de"
                    ? "18 Jahre oder älter sein oder das gesetzliche Erwachsenenalter in Ihrer Gerichtsbarkeit erreicht haben"
                    : "Be 18 years of age or older, or have reached the legal age of majority in your jurisdiction"}
                </li>
                <li>
                  {language === "ar"
                    ? "تحمل المسؤولية الكاملة عن الحفاظ على سرية حسابك ومعلومات تسجيل الدخول"
                    : language === "de"
                    ? "Die volle Verantwortung für die Vertraulichkeit Ihres Kontos und Ihrer Anmeldedaten tragen"
                    : "Take full responsibility for maintaining the confidentiality of your account and login information"}
                </li>
                <li>
                  {language === "ar"
                    ? "استخدام الخدمات للأغراض القانونية المشروعة فقط وبما يتوافق مع القوانين المعمول بها"
                    : language === "de"
                    ? "Die Dienste nur für rechtmäßige Zwecke und in Übereinstimmung mit geltendem Recht nutzen"
                    : "Use the services only for lawful purposes and in compliance with applicable laws"}
                </li>
                <li>
                  {language === "ar"
                    ? "عدم مشاركة حسابك مع آخرين أو السماح بالوصول غير المصرح به"
                    : language === "de"
                    ? "Ihr Konto nicht mit anderen teilen oder unbefugten Zugriff gestatten"
                    : "Not share your account with others or allow unauthorized access"}
                </li>
                <li>
                  {language === "ar"
                    ? "احترام حقوق الملكية الفكرية لمنصة كورزورا وخدماتها المتقدمة"
                    : language === "de"
                    ? "Die geistigen Eigentumsrechte der Kurzora-Plattform und ihrer fortschrittlichen Dienste respektieren"
                    : "Respect the intellectual property rights of the Kurzora platform and its advanced services"}
                </li>
              </ul>
            </div>
          </section>

          {/* Service Description */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "وصف الخدمة"
                : language === "de"
                ? "Servicebeschreibung"
                : "Service Description"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm mb-3">
                {language === "ar"
                  ? "تقدم منصة كورزورا خدمات الذكاء التجاري المؤسسية التالية:"
                  : language === "de"
                  ? "Die Kurzora-Plattform bietet die folgenden institutionellen Handelsintelligenz-Dienste:"
                  : "The Kurzora platform provides the following institutional trading intelligence services:"}
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  {language === "ar"
                    ? "تحليل متقدم للإشارات التجارية باستخدام الذكاء الاصطناعي"
                    : language === "de"
                    ? "Erweiterte Handelssignalanalyse mit künstlicher Intelligenz"
                    : "Advanced trading signal analysis using artificial intelligence"}
                </li>
                <li>
                  {language === "ar"
                    ? "تقييم المخاطر وإدارة المحافظ بمعايير مؤسسية"
                    : language === "de"
                    ? "Risikobewertung und Portfoliomanagement nach institutionellen Standards"
                    : "Risk assessment and portfolio management with institutional standards"}
                </li>
                <li>
                  {language === "ar"
                    ? "تتبع الأداء وتحليل البيانات التاريخية"
                    : language === "de"
                    ? "Leistungsverfolgung und historische Datenanalyse"
                    : "Performance tracking and historical data analysis"}
                </li>
                <li>
                  {language === "ar"
                    ? "تنبيهات فورية عبر البريد الإلكتروني وتيليجرام"
                    : language === "de"
                    ? "Sofortige Benachrichtigungen per E-Mail und Telegram"
                    : "Instant alerts via email and Telegram"}
                </li>
                <li>
                  {language === "ar"
                    ? "أدوات تحليل متعددة الإطار الزمني للمتداولين المحترفين"
                    : language === "de"
                    ? "Multi-Timeframe-Analysetools für professionelle Trader"
                    : "Multi-timeframe analysis tools for professional traders"}
                </li>
                <li>
                  {language === "ar"
                    ? "فلترة الامتثال للشريعة الإسلامية بمعايير متقدمة"
                    : language === "de"
                    ? "Scharia-konforme Filterung mit fortschrittlichen Standards"
                    : "Shariah-compliant filtering with advanced standards"}
                </li>
              </ul>
            </div>
          </section>

          {/* Subscriptions and Payment */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "الاشتراكات والدفع"
                : language === "de"
                ? "Abonnements und Zahlung"
                : "Subscriptions and Payment"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm mb-3">
                {language === "ar"
                  ? "تتطلب الخدمات المتقدمة لمنصة كورزورا اشتراكاً مدفوعاً:"
                  : language === "de"
                  ? "Die erweiterten Dienste der Kurzora-Plattform erfordern ein kostenpflichtiges Abonnement:"
                  : "The advanced services of the Kurzora platform require a paid subscription:"}
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  {language === "ar"
                    ? "ستتم محاسبتك مقدماً على أساس شهري أو سنوي حسب الخطة المختارة"
                    : language === "de"
                    ? "Ihnen wird im Voraus monatlich oder jährlich je nach gewähltem Plan in Rechnung gestellt"
                    : "You will be billed in advance on a monthly or annual basis depending on your chosen plan"}
                </li>
                <li>
                  {language === "ar"
                    ? "يمكنك إلغاء اشتراكك في أي وقت من خلال إعدادات الحساب أو بالاتصال بالدعم"
                    : language === "de"
                    ? "Sie können Ihr Abonnement jederzeit über die Kontoeinstellungen oder durch Kontakt mit dem Support kündigen"
                    : "You can cancel your subscription at any time through account settings or by contacting support"}
                </li>
                <li>
                  {language === "ar"
                    ? "لا توجد استردادات للفترات المدفوعة مسبقاً، ولكن ستحتفظ بالوصول حتى نهاية فترة الفوترة"
                    : language === "de"
                    ? "Keine Rückerstattungen für vorab bezahlte Zeiträume, aber Sie behalten den Zugang bis zum Ende des Abrechnungszeitraums"
                    : "No refunds for pre-paid periods, but you will retain access until the end of your billing period"}
                </li>
                <li>
                  {language === "ar"
                    ? "قد تتغير الأسعار مع إشعار مسبق وفقاً لسياسة التسعير الخاصة بنا"
                    : language === "de"
                    ? "Preise können sich mit vorheriger Ankündigung gemäß unserer Preisrichtlinie ändern"
                    : "Prices may change with advance notice according to our pricing policy"}
                </li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "الملكية الفكرية"
                : language === "de"
                ? "Geistiges Eigentum"
                : "Intellectual Property"}
            </h2>
            <p>
              {language === "ar"
                ? "منصة كورزورا وجميع محتوياتها، بما في ذلك على سبيل المثال لا الحصر، الخوارزميات المتقدمة والذكاء الاصطناعي والتحليلات والإشارات والنصوص والرسومات محمية بموجب قوانين حقوق الطبع والنشر والعلامات التجارية وقوانين الملكية الفكرية الأخرى. يُمنح لك ترخيص محدود وغير حصري لاستخدام المنصة للأغراض الشخصية فقط."
                : language === "de"
                ? "Die Kurzora-Plattform und alle ihre Inhalte, einschließlich aber nicht beschränkt auf erweiterte Algorithmen, künstliche Intelligenz, Analysen, Signale, Texte und Grafiken, sind durch Urheberrechts-, Marken- und andere Gesetze zum Schutz des geistigen Eigentums geschützt. Ihnen wird eine begrenzte, nicht-exklusive Lizenz zur Nutzung der Plattform nur für persönliche Zwecke gewährt."
                : "The Kurzora platform and all of its contents, including but not limited to advanced algorithms, artificial intelligence, analytics, signals, text, and graphics, are protected by copyright, trademark, and other intellectual property laws. You are granted a limited, non-exclusive license to use the platform for personal use only."}
            </p>
          </section>

          {/* Educational Purpose and Disclaimers */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "الغرض التعليمي وإخلاء المسؤولية"
                : language === "de"
                ? "Bildungszweck und Haftungsausschluss"
                : "Educational Purpose and Disclaimers"}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-sm mb-3">
                {language === "ar"
                  ? "منصة كورزورا مصممة للأغراض التعليمية والتحليلية:"
                  : language === "de"
                  ? "Die Kurzora-Plattform ist für Bildungs- und Analysezwecke konzipiert:"
                  : "The Kurzora platform is designed for educational and analytical purposes:"}
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  {language === "ar"
                    ? "إشاراتنا وتحليلاتنا للأغراض التعليمية والمعلوماتية فقط وليست نصائح استثمارية شخصية"
                    : language === "de"
                    ? "Unsere Signale und Analysen dienen nur zu Bildungs- und Informationszwecken und stellen keine persönliche Anlageberatung dar"
                    : "Our signals and analytics are for educational and informational purposes only and do not constitute personalized investment advice"}
                </li>
                <li>
                  {language === "ar"
                    ? "التداول ينطوي على مخاطر جوهرية، والمتداولون المحترفون يفهمون هذه المخاطر"
                    : language === "de"
                    ? "Der Handel ist mit erheblichen Risiken verbunden, und professionelle Trader verstehen diese Risiken"
                    : "Trading involves substantial risks, and professional traders understand these risks"}
                </li>
                <li>
                  {language === "ar"
                    ? "يُنصح بشدة باستشارة مستشار مالي مؤهل قبل اتخاذ قرارات الاستثمار"
                    : language === "de"
                    ? "Es wird dringend empfohlen, einen qualifizierten Finanzberater zu konsultieren, bevor Sie Investitionsentscheidungen treffen"
                    : "It is strongly recommended to consult with a qualified financial advisor before making investment decisions"}
                </li>
                <li>
                  {language === "ar"
                    ? "الأداء السابق لا يضمن النتائج المستقبلية في أي ظرف من الظروف"
                    : language === "de"
                    ? "Die Wertentwicklung in der Vergangenheit garantiert unter keinen Umständen zukünftige Ergebnisse"
                    : "Past performance does not guarantee future results under any circumstances"}
                </li>
              </ul>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "تحديد المسؤولية"
                : language === "de"
                ? "Haftungsbeschränkung"
                : "Limitation of Liability"}
            </h2>
            <p>
              {language === "ar"
                ? "بأقصى حد يسمح به القانون، لن تكون كورزورا مسؤولة عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية تنشأ عن استخدام أو عدم القدرة على استخدام منصتنا، حتى لو تم إبلاغ كورزورا بإمكانية حدوث مثل هذه الأضرار. أنت تقر وتوافق على أن استخدامك للمنصة يكون على مسؤوليتك الخاصة."
                : language === "de"
                ? "Im größtmöglichen gesetzlich zulässigen Umfang haftet Kurzora nicht für direkte, indirekte, zufällige, besondere oder Folgeschäden, die aus der Nutzung oder Unfähigkeit zur Nutzung unserer Plattform entstehen, selbst wenn Kurzora über die Möglichkeit solcher Schäden informiert wurde. Sie erkennen an und stimmen zu, dass Sie unsere Plattform auf eigenes Risiko nutzen."
                : "To the maximum extent permitted by law, Kurzora shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from the use of or inability to use our platform, even if Kurzora has been advised of the possibility of such damages. You acknowledge and agree that your use of the platform is at your own risk."}
            </p>
          </section>

          {/* Service Termination */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "إنهاء الخدمة"
                : language === "de"
                ? "Beendigung des Dienstes"
                : "Service Termination"}
            </h2>
            <p>
              {language === "ar"
                ? "يمكن لكورزورا إنهاء أو تعليق وصولك إلى المنصة فوراً، دون إشعار مسبق، لأي سبب، بما في ذلك على سبيل المثال لا الحصر، انتهاك هذه الشروط أو السلوك الذي قد يضر بكورزورا أو مستخدمين آخرين أو أطراف ثالثة. عند الإنهاء، ستتوقف جميع الحقوق الممنوحة لك بموجب هذه الشروط فوراً."
                : language === "de"
                ? "Kurzora kann Ihren Zugang zur Plattform sofort ohne vorherige Ankündigung aus beliebigem Grund beenden oder aussetzen, einschließlich aber nicht beschränkt auf Verstöße gegen diese Bedingungen oder Verhalten, das Kurzora oder andere Nutzer oder Dritte schädigen könnte. Bei Beendigung erlöschen alle Ihnen unter diesen Bedingungen gewährten Rechte sofort."
                : "Kurzora may terminate or suspend your access to the platform immediately, without prior notice, for any reason, including but not limited to breach of these terms or conduct that may harm Kurzora or other users or third parties. Upon termination, all rights granted to you under these terms will cease immediately."}
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "القانون الحاكم"
                : language === "de"
                ? "Anwendbares Recht"
                : "Governing Law"}
            </h2>
            <p>
              {language === "ar"
                ? "تخضع هذه الشروط وتُفسر وفقاً لقوانين الولاية القضائية التي تعمل فيها كورزورا، دون اعتبار لمبادئ تنازع القوانين. أي نزاعات تنشأ بموجب هذه الشروط ستكون خاضعة للولاية القضائية الحصرية للمحاكم في تلك الولاية القضائية."
                : language === "de"
                ? "Diese Bedingungen unterliegen den Gesetzen der Gerichtsbarkeit, in der Kurzora tätig ist, und werden entsprechend ausgelegt, ohne Berücksichtigung von Kollisionsnormen. Alle Streitigkeiten, die unter diesen Bedingungen entstehen, unterliegen der ausschließlichen Gerichtsbarkeit der Gerichte in dieser Gerichtsbarkeit."
                : "These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Kurzora operates, without regard to conflict of law principles. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts in that jurisdiction."}
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === "ar"
                ? "التغييرات على الشروط"
                : language === "de"
                ? "Änderungen der Bedingungen"
                : "Changes to Terms"}
            </h2>
            <p>
              {language === "ar"
                ? "تحتفظ كورزورا بالحق في تعديل هذه الشروط والأحكام في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار بارز على المنصة. استمرارك في استخدام المنصة بعد هذه التغييرات يشكل قبولاً للشروط المحدثة."
                : language === "de"
                ? "Kurzora behält sich das Recht vor, diese Geschäftsbedingungen jederzeit zu ändern. Sie werden über wesentliche Änderungen per E-Mail oder durch einen prominenten Hinweis auf der Plattform benachrichtigt. Ihre fortgesetzte Nutzung der Plattform nach solchen Änderungen stellt eine Annahme der aktualisierten Bedingungen dar."
                : "Kurzora reserves the right to modify these terms and conditions at any time. You will be notified of any material changes via email or through a prominent notice on the platform. Your continued use of the platform after such changes constitutes acceptance of the updated terms."}
            </p>
          </section>
        </div>

        {/* Contact Footer - UPDATED: Kurzora support email */}
        <div className="mt-10 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
          <p className="text-blue-400 text-sm text-center">
            {language === "ar"
              ? "آخر تحديث: يوليو 2025 | للأسئلة حول شروط الخدمة، اتصل بنا على support@kurzora.com"
              : language === "de"
              ? "Zuletzt aktualisiert: Juli 2025 | Bei Fragen zu den Nutzungsbedingungen kontaktieren Sie uns unter support@kurzora.com"
              : "Last updated: July 2025 | For questions about our terms of service, contact us at support@kurzora.com"}
          </p>
        </div>
      </div>

      {/* 🔧 SESSION #178: Public footer (copied from HowItWorks.tsx pattern) */}
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

export default TermsOfService;

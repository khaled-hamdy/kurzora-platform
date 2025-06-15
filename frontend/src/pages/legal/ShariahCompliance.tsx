
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../../components/Layout';
import { Shield, Check } from 'lucide-react';

const ShariahCompliance: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === 'ar' ? 'الامتثال للشريعة الإسلامية' : language === 'de' ? 'Scharia-Konformität' : 'Shariah Compliance'}
          </h1>
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-green-500" />
          </div>
        </div>
        
        <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === 'ar' ? 'التزامنا بالامتثال للشريعة' : language === 'de' ? 'Unser Engagement für Scharia-Konformität' : 'Our Commitment to Shariah Compliance'}
          </h2>
          <p className="text-slate-300">
            {language === 'ar' ? 
              'نحن ملتزمون بتوفير حلول تداول متوافقة مع أحكام الشريعة الإسلامية للمستثمرين المسلمين، مع ضمان أن جميع الإشارات والاستثمارات تتبع المبادئ الإسلامية.' :
              language === 'de' ? 
              'Wir sind bestrebt, Scharia-konforme Handelslösungen für muslimische Investoren bereitzustellen und sicherzustellen, dass alle Signale und Investitionen den islamischen Prinzipien folgen.' :
              'We are committed to providing Shariah-compliant trading solutions for Muslim investors, ensuring that all signals and investments follow Islamic principles.'
            }
          </p>
        </div>

        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'معايير الفحص' : language === 'de' ? 'Screening-Kriterien' : 'Screening Criteria'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'النشاط التجاري' : language === 'de' ? 'Geschäftstätigkeit' : 'Business Activity'}
                  </h3>
                </div>
                <p className="text-sm">
                  {language === 'ar' ? 
                    'نستبعد الشركات المشاركة في الكحول والقمار والتبغ والخنازير والأسلحة' :
                    language === 'de' ? 
                    'Wir schließen Unternehmen aus, die mit Alkohol, Glücksspiel, Tabak, Schweinefleisch und Waffen befasst sind' :
                    'We exclude companies involved in alcohol, gambling, tobacco, pork, and weapons'
                  }
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'النسب المالية' : language === 'de' ? 'Finanzielle Kennzahlen' : 'Financial Ratios'}
                  </h3>
                </div>
                <p className="text-sm">
                  {language === 'ar' ? 
                    'الديون/القيمة السوقية < 33%, الاستثمارات غير المتوافقة < 33%' :
                    language === 'de' ? 
                    'Schulden/Marktkapitalisierung < 33%, Nicht-konforme Investitionen < 33%' :
                    'Debt/Market Cap < 33%, Non-compliant investments < 33%'
                  }
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'الدخل من الفوائد' : language === 'de' ? 'Zinseinkommen' : 'Interest Income'}
                  </h3>
                </div>
                <p className="text-sm">
                  {language === 'ar' ? 
                    'نستبعد الشركات التي يشكل دخل الفوائد أكثر من 5% من إجمالي إيراداتها' :
                    language === 'de' ? 
                    'Wir schließen Unternehmen aus, bei denen Zinseinkommen mehr als 5% des Gesamtumsatzes ausmachen' :
                    'We exclude companies where interest income exceeds 5% of total revenue'
                  }
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Check className="h-5 w-5 text-green-400 mr-2" />
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'التطهير' : language === 'de' ? 'Reinigung' : 'Purification'}
                  </h3>
                </div>
                <p className="text-sm">
                  {language === 'ar' ? 
                    'يتم حساب مبلغ التطهير للأرباح من المصادر غير المتوافقة' :
                    language === 'de' ? 
                    'Reinigungsbetrag wird für Gewinne aus nicht-konformen Quellen berechnet' :
                    'Purification amount calculated for profits from non-compliant sources'
                  }
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'منهجية التصفية' : language === 'de' ? 'Filtermethodik' : 'Filtering Methodology'}
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">1</div>
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'فحص الأنشطة التجارية' : language === 'de' ? 'Geschäftstätigkeits-Screening' : 'Business Activity Screening'}
                  </h3>
                  <p className="text-sm mt-1">
                    {language === 'ar' ? 
                      'نحلل الأنشطة التجارية الأساسية للشركة لضمان الامتثال' :
                      language === 'de' ? 
                      'Wir analysieren die Kerngeschäftstätigkeiten des Unternehmens, um die Konformität sicherzustellen' :
                      'We analyze the company\'s core business activities to ensure compliance'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">2</div>
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'التحليل المالي' : language === 'de' ? 'Finanzanalyse' : 'Financial Analysis'}
                  </h3>
                  <p className="text-sm mt-1">
                    {language === 'ar' ? 
                      'نقوم بمراجعة النسب المالية للشركة مقابل العتبات المحددة' :
                      language === 'de' ? 
                      'Wir überprüfen die Finanzkennzahlen des Unternehmens gegen definierte Schwellenwerte' :
                      'We review the company\'s financial ratios against defined thresholds'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">3</div>
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'المراجعة المستمرة' : language === 'de' ? 'Kontinuierliche Überprüfung' : 'Continuous Review'}
                  </h3>
                  <p className="text-sm mt-1">
                    {language === 'ar' ? 
                      'نعيد تقييم الامتثال بشكل منتظم بناءً على أحدث البيانات المالية' :
                      language === 'de' ? 
                      'Wir bewerten die Konformität regelmäßig basierend auf den neuesten Finanzdaten neu' :
                      'We regularly reassess compliance based on the latest financial data'
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'الإشراف الشرعي' : language === 'de' ? 'Scharia-Aufsicht' : 'Shariah Supervision'}
            </h2>
            <p className="mb-4">
              {language === 'ar' ? 
                'يتم مراجعة منهجية الفحص الخاصة بنا من قبل علماء الشريعة المؤهلين لضمان التوافق مع أحكام الشريعة الإسلامية.' :
                language === 'de' ? 
                'Unsere Screening-Methodik wird von qualifizierten Scharia-Gelehrten überprüft, um die Übereinstimmung mit islamischen Prinzipien zu gewährleisten.' :
                'Our screening methodology is reviewed by qualified Shariah scholars to ensure alignment with Islamic principles.'
              }
            </p>
          </section>
        </div>
        
        <div className="mt-10 p-4 bg-green-900/20 border border-green-800/50 rounded-lg">
          <p className="text-green-400 text-sm text-center">
            {language === 'ar' ? 
              'للحصول على مزيد من المعلومات حول امتثالنا للشريعة، يرجى الاتصال بفريق الدعم لدينا.' :
              language === 'de' ? 
              'Für weitere Informationen zu unserer Scharia-Konformität wenden Sie sich bitte an unser Support-Team.' :
              'For more information about our Shariah compliance, please contact our support team.'
            }
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ShariahCompliance;

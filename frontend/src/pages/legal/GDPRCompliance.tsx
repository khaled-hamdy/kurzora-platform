
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../../components/Layout';
import { Shield, Check } from 'lucide-react';

const GDPRCompliance: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === 'ar' ? 'الامتثال للائحة GDPR' : language === 'de' ? 'DSGVO-Konformität' : 'GDPR Compliance'}
          </h1>
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === 'ar' ? 'التزامنا بخصوصية البيانات' : language === 'de' ? 'Unser Engagement für Datenschutz' : 'Our Commitment to Data Privacy'}
          </h2>
          <p className="text-slate-300">
            {language === 'ar' ? 
              'نحن ملتزمون بحماية بياناتك الشخصية والامتثال للائحة العامة لحماية البيانات (GDPR) وقوانين حماية البيانات الأخرى المعمول بها.' :
              language === 'de' ? 
              'Wir sind bestrebt, Ihre persönlichen Daten zu schützen und die Datenschutz-Grundverordnung (DSGVO) und andere geltende Datenschutzgesetze einzuhalten.' :
              'We are committed to protecting your personal data and complying with the General Data Protection Regulation (GDPR) and other applicable data protection laws.'
            }
          </p>
        </div>

        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'حقوقك بموجب GDPR' : language === 'de' ? 'Ihre Rechte unter der DSGVO' : 'Your Rights Under GDPR'}
            </h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'الحق في الوصول' : language === 'de' ? 'Recht auf Zugang' : 'Right to Access'}
                  </h3>
                  <p className="text-sm">
                    {language === 'ar' ? 
                      'يمكنك طلب معلومات حول البيانات الشخصية التي نحتفظ بها عنك' :
                      language === 'de' ? 
                      'Sie können Informationen über die persönlichen Daten anfordern, die wir über Sie speichern' :
                      'You can request information about the personal data we hold about you'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'الحق في التصحيح' : language === 'de' ? 'Recht auf Berichtigung' : 'Right to Rectification'}
                  </h3>
                  <p className="text-sm">
                    {language === 'ar' ? 
                      'يمكنك طلب تصحيح أي بيانات غير دقيقة أو غير مكتملة' :
                      language === 'de' ? 
                      'Sie können die Korrektur ungenauer oder unvollständiger Daten verlangen' :
                      'You can request correction of any inaccurate or incomplete data'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'الحق في المحو' : language === 'de' ? 'Recht auf Löschung' : 'Right to Erasure'}
                  </h3>
                  <p className="text-sm">
                    {language === 'ar' ? 
                      'يمكنك طلب حذف بياناتك الشخصية في ظروف معينة' :
                      language === 'de' ? 
                      'Sie können unter bestimmten Umständen die Löschung Ihrer persönlichen Daten verlangen' :
                      'You can request deletion of your personal data under certain circumstances'
                    }
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-white font-medium">
                    {language === 'ar' ? 'الحق في قابلية النقل' : language === 'de' ? 'Recht auf Datenübertragbarkeit' : 'Right to Data Portability'}
                  </h3>
                  <p className="text-sm">
                    {language === 'ar' ? 
                      'يمكنك طلب استلام بياناتك بتنسيق منظم وقابل للقراءة آلياً' :
                      language === 'de' ? 
                      'Sie können verlangen, Ihre Daten in einem strukturierten, maschinenlesbaren Format zu erhalten' :
                      'You can request to receive your data in a structured, machine-readable format'
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'الأساس القانوني للمعالجة' : language === 'de' ? 'Rechtsgrundlage für die Verarbeitung' : 'Legal Basis for Processing'}
            </h2>
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <ul className="space-y-2">
                <li>
                  <strong className="text-white">
                    {language === 'ar' ? 'الموافقة:' : language === 'de' ? 'Einwilligung:' : 'Consent:'}
                  </strong>
                  {' '}
                  {language === 'ar' ? 
                    'لإرسال النشرات الإخبارية والتحديثات التسويقية' :
                    language === 'de' ? 
                    'Für den Versand von Newslettern und Marketing-Updates' :
                    'For sending newsletters and marketing updates'
                  }
                </li>
                <li>
                  <strong className="text-white">
                    {language === 'ar' ? 'تنفيذ العقد:' : language === 'de' ? 'Vertragserfüllung:' : 'Contract Performance:'}
                  </strong>
                  {' '}
                  {language === 'ar' ? 
                    'لتقديم خدمات التداول والدعم' :
                    language === 'de' ? 
                    'Zur Bereitstellung von Handelsdienstleistungen und Support' :
                    'To provide trading services and support'
                  }
                </li>
                <li>
                  <strong className="text-white">
                    {language === 'ar' ? 'المصلحة المشروعة:' : language === 'de' ? 'Berechtigtes Interesse:' : 'Legitimate Interest:'}
                  </strong>
                  {' '}
                  {language === 'ar' ? 
                    'لتحسين خدماتنا وضمان الأمان' :
                    language === 'de' ? 
                    'Zur Verbesserung unserer Dienstleistungen und Gewährleistung der Sicherheit' :
                    'To improve our services and ensure security'
                  }
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'الاحتفاظ بالبيانات' : language === 'de' ? 'Datenspeicherung' : 'Data Retention'}
            </h2>
            <p>
              {language === 'ar' ? 
                'نحتفظ ببياناتك الشخصية فقط لطالما كان ذلك ضرورياً للأغراض التي تم جمعها من أجلها أو كما هو مطلوب بموجب القانون.' :
                language === 'de' ? 
                'Wir speichern Ihre persönlichen Daten nur so lange, wie es für die Zwecke, für die sie erhoben wurden, erforderlich ist oder gesetzlich vorgeschrieben.' :
                'We retain your personal data only for as long as necessary for the purposes it was collected or as required by law.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'ممارسة حقوقك' : language === 'de' ? 'Ausübung Ihrer Rechte' : 'Exercising Your Rights'}
            </h2>
            <p>
              {language === 'ar' ? 
                'لممارسة أي من حقوقك بموجب GDPR، يرجى الاتصال بنا على privacy@swingtrader.com. سنرد على طلبك خلال 30 يوماً.' :
                language === 'de' ? 
                'Um eines Ihrer Rechte unter der DSGVO auszuüben, kontaktieren Sie uns bitte unter privacy@swingtrader.com. Wir werden innerhalb von 30 Tagen auf Ihre Anfrage antworten.' :
                'To exercise any of your rights under GDPR, please contact us at privacy@swingtrader.com. We will respond to your request within 30 days.'
              }
            </p>
          </section>
        </div>
        
        <div className="mt-10 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
          <p className="text-blue-400 text-sm text-center">
            {language === 'ar' ? 
              'إذا لم تكن راضياً عن كيفية تعاملنا مع بياناتك، فلديك الحق في تقديم شكوى إلى سلطة حماية البيانات.' :
              language === 'de' ? 
              'Wenn Sie mit unserem Umgang mit Ihren Daten nicht zufrieden sind, haben Sie das Recht, eine Beschwerde bei einer Datenschutzbehörde einzureichen.' :
              'If you are not satisfied with how we handle your data, you have the right to lodge a complaint with a data protection authority.'
            }
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default GDPRCompliance;

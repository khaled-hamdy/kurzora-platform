
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../../components/Layout';
import { FileText } from 'lucide-react';

const TermsOfService: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === 'ar' ? 'شروط الخدمة' : language === 'de' ? 'Nutzungsbedingungen' : 'Terms of Service'}
          </h1>
          <div className="flex justify-center">
            <FileText className="h-12 w-12 text-blue-500" />
          </div>
        </div>
        
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'قبول الشروط' : language === 'de' ? 'Annahme der Bedingungen' : 'Acceptance of Terms'}
            </h2>
            <p>
              {language === 'ar' ? 
                'باستخدام منصة SwingTrader، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام خدماتنا.' :
                language === 'de' ? 
                'Durch die Nutzung der SwingTrader-Plattform stimmen Sie zu, an diese Geschäftsbedingungen gebunden zu sein. Wenn Sie diesen Bedingungen nicht zustimmen, verwenden Sie bitte unsere Dienste nicht.' :
                'By using the SwingTrader platform, you agree to be bound by these terms and conditions. If you do not agree to these terms, please do not use our services.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'استخدام الخدمة' : language === 'de' ? 'Nutzung des Dienstes' : 'Use of Service'}
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'ar' ? 
                  'يجب أن تكون 18 عاماً أو أكثر لاستخدام خدماتنا' :
                  language === 'de' ? 
                  'Sie müssen 18 Jahre oder älter sein, um unsere Dienste zu nutzen' :
                  'You must be 18 years or older to use our services'
                }
              </li>
              <li>
                {language === 'ar' ? 
                  'أنت مسؤول عن الحفاظ على سرية حسابك' :
                  language === 'de' ? 
                  'Sie sind für die Vertraulichkeit Ihres Kontos verantwortlich' :
                  'You are responsible for maintaining the confidentiality of your account'
                }
              </li>
              <li>
                {language === 'ar' ? 
                  'لا يجوز استخدام خدماتنا لأنشطة غير قانونية' :
                  language === 'de' ? 
                  'Sie dürfen unsere Dienste nicht für illegale Aktivitäten nutzen' :
                  'You may not use our services for illegal activities'
                }
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'الاشتراكات والدفع' : language === 'de' ? 'Abonnements und Zahlung' : 'Subscriptions and Payment'}
            </h2>
            <p>
              {language === 'ar' ? 
                'تتطلب بعض ميزات منصتنا اشتراكاً مدفوعاً. ستتم محاسبتك مقدماً على أساس متكرر حتى تقوم بإلغاء اشتراكك.' :
                language === 'de' ? 
                'Einige Funktionen unserer Plattform erfordern ein kostenpflichtiges Abonnement. Ihnen wird im Voraus auf wiederkehrender Basis in Rechnung gestellt, bis Sie Ihr Abonnement kündigen.' :
                'Some features of our platform require a paid subscription. You will be billed in advance on a recurring basis until you cancel your subscription.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'إخلاء المسؤولية' : language === 'de' ? 'Haftungsausschluss' : 'Disclaimer'}
            </h2>
            <p>
              {language === 'ar' ? 
                'إشاراتنا للأغراض التعليمية فقط وليست نصائح مالية. التداول ينطوي على مخاطر، ويجب عليك استشارة مستشار مالي مؤهل.' :
                language === 'de' ? 
                'Unsere Signale dienen nur zu Bildungszwecken und stellen keine Finanzberatung dar. Der Handel ist mit Risiken verbunden, und Sie sollten einen qualifizierten Finanzberater konsultieren.' :
                'Our signals are for educational purposes only and do not constitute financial advice. Trading involves risk, and you should consult with a qualified financial advisor.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'إنهاء الخدمة' : language === 'de' ? 'Beendigung' : 'Termination'}
            </h2>
            <p>
              {language === 'ar' ? 
                'يمكننا إنهاء أو تعليق وصولك إلى خدماتنا فوراً، دون إشعار مسبق، لأي سبب، بما في ذلك انتهاك هذه الشروط.' :
                language === 'de' ? 
                'Wir können Ihren Zugang zu unseren Diensten sofort ohne vorherige Ankündigung aus beliebigem Grund beenden oder aussetzen, einschließlich Verstößen gegen diese Bedingungen.' :
                'We may terminate or suspend your access to our services immediately, without prior notice, for any reason, including breach of these terms.'
              }
            </p>
          </section>
        </div>
        
        <div className="mt-10 p-4 bg-blue-900/20 border border-blue-800/50 rounded-lg">
          <p className="text-blue-400 text-sm text-center">
            {language === 'ar' ? 
              'آخر تحديث: يناير 2024' :
              language === 'de' ? 
              'Zuletzt aktualisiert: Januar 2024' :
              'Last updated: January 2024'
            }
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;

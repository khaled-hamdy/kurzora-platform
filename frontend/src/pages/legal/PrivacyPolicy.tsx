
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../../components/Layout';
import { Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === 'ar' ? 'سياسة الخصوصية' : language === 'de' ? 'Datenschutzrichtlinie' : 'Privacy Policy'}
          </h1>
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-emerald-500" />
          </div>
        </div>
        
        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'جمع المعلومات' : language === 'de' ? 'Informationssammlung' : 'Information Collection'}
            </h2>
            <p className="mb-4">
              {language === 'ar' ? 
                'نجمع المعلومات التي تقدمها لنا مباشرة، مثل عند إنشاء حساب أو الاتصال بنا. قد نجمع أيضاً معلومات حول استخدامك لخدماتنا.' :
                language === 'de' ? 
                'Wir sammeln Informationen, die Sie uns direkt zur Verfügung stellen, wie z.B. beim Erstellen eines Kontos oder beim Kontakt mit uns. Wir können auch Informationen über Ihre Nutzung unserer Dienste sammeln.' :
                'We collect information you provide directly to us, such as when you create an account or contact us. We may also collect information about your use of our services.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'استخدام المعلومات' : language === 'de' ? 'Verwendung von Informationen' : 'Use of Information'}
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                {language === 'ar' ? 
                  'تقديم وصيانة وتحسين خدماتنا' :
                  language === 'de' ? 
                  'Bereitstellung, Wartung und Verbesserung unserer Dienste' :
                  'Provide, maintain, and improve our services'
                }
              </li>
              <li>
                {language === 'ar' ? 
                  'التواصل معك حول حسابك وخدماتنا' :
                  language === 'de' ? 
                  'Kommunikation mit Ihnen über Ihr Konto und unsere Dienste' :
                  'Communicate with you about your account and our services'
                }
              </li>
              <li>
                {language === 'ar' ? 
                  'إرسال التحديثات التقنية والأمنية' :
                  language === 'de' ? 
                  'Technische und Sicherheitsupdates senden' :
                  'Send technical and security updates'
                }
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'أمان البيانات' : language === 'de' ? 'Datensicherheit' : 'Data Security'}
            </h2>
            <p>
              {language === 'ar' ? 
                'نستخدم تدابير أمنية مناسبة لحماية معلوماتك الشخصية ضد الوصول غير المصرح به أو التغيير أو الكشف أو التدمير.' :
                language === 'de' ? 
                'Wir verwenden angemessene Sicherheitsmaßnahmen zum Schutz Ihrer persönlichen Daten vor unbefugtem Zugriff, Änderung, Offenlegung oder Zerstörung.' :
                'We use appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'ملفات تعريف الارتباط' : language === 'de' ? 'Cookies' : 'Cookies'}
            </h2>
            <p>
              {language === 'ar' ? 
                'نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتحليل استخدام موقعنا. يمكنك التحكم في إعدادات ملفات تعريف الارتباط من خلال متصفحك.' :
                language === 'de' ? 
                'Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und die Nutzung unserer Website zu analysieren. Sie können Cookie-Einstellungen über Ihren Browser steuern.' :
                'We use cookies to improve your experience and analyze usage of our site. You can control cookie settings through your browser.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'حقوقك' : language === 'de' ? 'Ihre Rechte' : 'Your Rights'}
            </h2>
            <p>
              {language === 'ar' ? 
                'لديك الحق في الوصول إلى معلوماتك الشخصية وتحديثها وحذفها. للممارسة هذه الحقوق، يرجى الاتصال بنا على support@swingtrader.com.' :
                language === 'de' ? 
                'Sie haben das Recht, auf Ihre persönlichen Daten zuzugreifen, sie zu aktualisieren und zu löschen. Um diese Rechte auszuüben, kontaktieren Sie uns bitte unter support@swingtrader.com.' :
                'You have the right to access, update, and delete your personal information. To exercise these rights, please contact us at support@swingtrader.com.'
              }
            </p>
          </section>
        </div>
        
        <div className="mt-10 p-4 bg-emerald-900/20 border border-emerald-800/50 rounded-lg">
          <p className="text-emerald-400 text-sm text-center">
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

export default PrivacyPolicy;


import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import Layout from '../../components/Layout';
import { Cookie } from 'lucide-react';

const CookieNotice: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            {language === 'ar' ? 'إشعار ملفات تعريف الارتباط' : language === 'de' ? 'Cookie-Hinweis' : 'Cookie Notice'}
          </h1>
          <div className="flex justify-center">
            <Cookie className="h-12 w-12 text-orange-500" />
          </div>
        </div>
        
        <div className="bg-orange-900/20 border border-orange-800/50 rounded-lg p-6 mb-8">
          <p className="text-slate-300">
            {language === 'ar' ? 
              'نستخدم ملفات تعريف الارتباط وتقنيات التتبع المماثلة لتحسين تجربتك على موقعنا وتحليل الاستخدام وتقديم المحتوى والإعلانات المخصصة.' :
              language === 'de' ? 
              'Wir verwenden Cookies und ähnliche Tracking-Technologien, um Ihre Erfahrung auf unserer Website zu verbessern, die Nutzung zu analysieren und personalisierte Inhalte und Werbung bereitzustellen.' :
              'We use cookies and similar tracking technologies to improve your experience on our website, analyze usage, and provide personalized content and advertisements.'
            }
          </p>
        </div>

        <div className="space-y-6 text-slate-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'ما هي ملفات تعريف الارتباط؟' : language === 'de' ? 'Was sind Cookies?' : 'What are Cookies?'}
            </h2>
            <p>
              {language === 'ar' ? 
                'ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم وضعها على جهازك عند زيارة موقع ويب. تساعد مواقع الويب على تذكر معلومات حول زيارتك.' :
                language === 'de' ? 
                'Cookies sind kleine Textdateien, die auf Ihrem Gerät platziert werden, wenn Sie eine Website besuchen. Sie helfen Websites dabei, sich an Informationen über Ihren Besuch zu erinnern.' :
                'Cookies are small text files that are placed on your device when you visit a website. They help websites remember information about your visit.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'أنواع ملفات تعريف الارتباط المستخدمة' : language === 'de' ? 'Arten von verwendeten Cookies' : 'Types of Cookies We Use'}
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">
                  {language === 'ar' ? 'ملفات تعريف الارتباط الأساسية' : language === 'de' ? 'Wesentliche Cookies' : 'Essential Cookies'}
                </h3>
                <p className="text-sm">
                  {language === 'ar' ? 
                    'ضرورية لتشغيل موقعنا الإلكتروني وتوفير الخدمات المطلوبة' :
                    language === 'de' ? 
                    'Notwendig für den Betrieb unserer Website und die Bereitstellung angefordeter Dienste' :
                    'Necessary for our website to function and provide requested services'
                  }
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">
                  {language === 'ar' ? 'ملفات تعريف الارتباط التحليلية' : language === 'de' ? 'Analytische Cookies' : 'Analytics Cookies'}
                </h3>
                <p className="text-sm">
                  {language === 'ar' ? 
                    'تساعدنا على فهم كيفية تفاعل الزوار مع موقعنا لتحسين الأداء' :
                    language === 'de' ? 
                    'Helfen uns zu verstehen, wie Besucher mit unserer Website interagieren, um die Leistung zu verbessern' :
                    'Help us understand how visitors interact with our website to improve performance'
                  }
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">
                  {language === 'ar' ? 'ملفات تعريف الارتباط الوظيفية' : language === 'de' ? 'Funktionale Cookies' : 'Functional Cookies'}
                </h3>
                <p className="text-sm">
                  {language === 'ar' ? 
                    'تتذكر تفضيلاتك وتوفر ميزات محسنة ومحتوى مخصص' :
                    language === 'de' ? 
                    'Merken sich Ihre Präferenzen und bieten erweiterte Funktionen und personalisierten Inhalt' :
                    'Remember your preferences and provide enhanced features and personalized content'
                  }
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h3 className="text-white font-medium mb-2">
                  {language === 'ar' ? 'ملفات تعريف الارتباط الإعلانية' : language === 'de' ? 'Werbe-Cookies' : 'Advertising Cookies'}
                </h3>
                <p className="text-sm">
                  {language === 'ar' ? 
                    'تستخدم لعرض إعلانات ذات صلة بناءً على اهتماماتك' :
                    language === 'de' ? 
                    'Werden verwendet, um relevante Werbung basierend auf Ihren Interessen anzuzeigen' :
                    'Used to display relevant advertisements based on your interests'
                  }
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'إدارة ملفات تعريف الارتباط' : language === 'de' ? 'Cookie-Verwaltung' : 'Managing Cookies'}
            </h2>
            <p className="mb-4">
              {language === 'ar' ? 
                'يمكنك التحكم في ملفات تعريف الارتباط وحذفها من خلال إعدادات متصفحك. ومع ذلك، فإن تعطيل ملفات تعريف الارتباط قد يؤثر على وظائف موقعنا.' :
                language === 'de' ? 
                'Sie können Cookies über Ihre Browser-Einstellungen steuern und löschen. Das Deaktivieren von Cookies kann jedoch die Funktionalität unserer Website beeinträchtigen.' :
                'You can control and delete cookies through your browser settings. However, disabling cookies may affect the functionality of our website.'
              }
            </p>
            
            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">
                {language === 'ar' ? 'كيفية إدارة ملفات تعريف الارتباط:' : language === 'de' ? 'So verwalten Sie Cookies:' : 'How to manage cookies:'}
              </h3>
              <ul className="text-sm space-y-1">
                <li>• Chrome: Settings → Privacy and security → Cookies</li>
                <li>• Firefox: Options → Privacy & Security → Cookies</li>
                <li>• Safari: Preferences → Privacy → Cookies</li>
                <li>• Edge: Settings → Cookies and site permissions</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'خدمات الطرف الثالث' : language === 'de' ? 'Dienste von Drittanbietern' : 'Third-Party Services'}
            </h2>
            <p>
              {language === 'ar' ? 
                'قد نستخدم خدمات طرف ثالث مثل Google Analytics التي تضع ملفات تعريف الارتباط الخاصة بها. هذه الخدمات لها سياسات الخصوصية وملفات تعريف الارتباط الخاصة بها.' :
                language === 'de' ? 
                'Wir können Drittanbieterdienste wie Google Analytics verwenden, die ihre eigenen Cookies setzen. Diese Dienste haben ihre eigenen Datenschutz- und Cookie-Richtlinien.' :
                'We may use third-party services like Google Analytics that place their own cookies. These services have their own privacy and cookie policies.'
              }
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-4">
              {language === 'ar' ? 'التحديثات على هذا الإشعار' : language === 'de' ? 'Updates zu diesem Hinweis' : 'Updates to This Notice'}
            </h2>
            <p>
              {language === 'ar' ? 
                'قد نقوم بتحديث هذا الإشعار من وقت لآخر. سنخطرك بأي تغييرات مهمة عن طريق نشر الإشعار المحدث على موقعنا.' :
                language === 'de' ? 
                'Wir können diesen Hinweis von Zeit zu Zeit aktualisieren. Wir werden Sie über wesentliche Änderungen informieren, indem wir den aktualisierten Hinweis auf unserer Website veröffentlichen.' :
                'We may update this notice from time to time. We will notify you of any material changes by posting the updated notice on our website.'
              }
            </p>
          </section>
        </div>
        
        <div className="mt-10 p-4 bg-orange-900/20 border border-orange-800/50 rounded-lg">
          <p className="text-orange-400 text-sm text-center">
            {language === 'ar' ? 
              'لأسئلة حول استخدامنا لملفات تعريف الارتباط، اتصل بنا على privacy@swingtrader.com' :
              language === 'de' ? 
              'Bei Fragen zu unserer Verwendung von Cookies kontaktieren Sie uns unter privacy@swingtrader.com' :
              'For questions about our use of cookies, contact us at privacy@swingtrader.com'
            }
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default CookieNotice;

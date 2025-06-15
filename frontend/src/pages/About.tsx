
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Layout from '../components/Layout';
import { Target, Users, Shield, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
  const { language } = useLanguage();

  return (
    <Layout>
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            {language === 'ar' ? 'حول Kurzora' : language === 'de' ? 'Über Kurzora' : 'About Kurzora'}
          </h1>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            {language === 'ar' ? 
              'نحن منصة ذكاء تداول مدعومة بالذكاء الاصطناعي تقدم إشارات متعددة الاستراتيجيات في الوقت الفعلي للمتداولين الذين يريدون الوضوح والثقة والتفوق في كل حالة سوق.' :
              language === 'de' ? 
              'Wir sind eine KI-gestützte Trading-Intelligence-Plattform, die Echtzeit-Multi-Strategie-Signale für Trader liefert, die Klarheit, Vertrauen und Vorsprung in jeder Marktlage wollen.' :
              'Kurzora is an AI-powered trading intelligence platform delivering real-time, multi-strategy signals for retail traders who want clarity, confidence, and edge in every market condition.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="p-4 bg-blue-600/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">
              {language === 'ar' ? 'مهمتنا' : language === 'de' ? 'Unsere Mission' : 'Our Mission'}
            </h3>
            <p className="text-slate-400 text-sm">
              {language === 'ar' ? 
                'توفير إشارات تداول دقيقة ومدعومة بالذكاء الاصطناعي للمتداولين في جميع أنحاء العالم' :
                language === 'de' ? 
                'Präzise, KI-gestützte Handelssignale für Trader weltweit bereitzustellen' :
                'Provide precise, AI-powered trading signals for traders worldwide'
              }
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 bg-emerald-600/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">
              {language === 'ar' ? 'فريقنا' : language === 'de' ? 'Unser Team' : 'Our Team'}
            </h3>
            <p className="text-slate-400 text-sm">
              {language === 'ar' ? 
                'متداولون محترفون ومطورو ذكاء اصطناعي بخبرة مجمعة تزيد عن 50 عاماً' :
                language === 'de' ? 
                'Professionelle Trader und KI-Entwickler mit über 50 Jahren Gesamterfahrung' :
                'Professional traders and AI developers with 50+ years combined experience'
              }
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 bg-amber-600/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Shield className="h-8 w-8 text-amber-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">
              {language === 'ar' ? 'الشفافية' : language === 'de' ? 'Transparenz' : 'Transparency'}
            </h3>
            <p className="text-slate-400 text-sm">
              {language === 'ar' ? 
                'نوضح بالضبط كيف يتم توليد كل إشارة ونتائج الأداء في الوقت الفعلي' :
                language === 'de' ? 
                'Wir zeigen genau, wie jedes Signal generiert wird und Echtzeit-Leistungsergebnisse' :
                'We show exactly how each signal is generated and real-time performance results'
              }
            </p>
          </div>

          <div className="text-center">
            <div className="p-4 bg-emerald-600/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">
              {language === 'ar' ? 'النتائج' : language === 'de' ? 'Ergebnisse' : 'Results'}
            </h3>
            <p className="text-slate-400 text-sm">
              {language === 'ar' ? 
                'معدل دقة 68% مع عائد استثمار متوسط 6% لكل صفقة' :
                language === 'de' ? 
                '68% Genauigkeitsrate mit durchschnittlich 6% ROI pro Trade' :
                '68% accuracy rate with average 6% ROI per trade'
              }
            </p>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm border border-blue-800/30 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {language === 'ar' ? 'قصتنا' : language === 'de' ? 'Unsere Geschichte' : 'Our Story'}
          </h2>
          <div className="prose prose-invert max-w-none text-slate-300">
            <p className="mb-4">
              {language === 'ar' ? 
                'تأسست Kurzora في عام 2023 من قبل فريق من المتداولين المحترفين ومهندسي الذكاء الاصطناعي الذين أرادوا سد الفجوة بين التداول المؤسسي والتداول الفردي.' :
                language === 'de' ? 
                'Kurzora wurde 2023 von einem Team professioneller Trader und KI-Ingenieure gegründet, die die Lücke zwischen institutionellem und privatem Trading schließen wollten.' :
                'Kurzora was founded in 2023 by a team of professional traders and AI engineers who wanted to bridge the gap between institutional and retail trading.'
              }
            </p>
            <p className="mb-4">
              {language === 'ar' ? 
                'بعد سنوات من العمل في بنوك الاستثمار وصناديق التحوط، أدرك فريقنا أن الأدوات القوية المستخدمة من قبل المؤسسات يمكن أن تكون متاحة لجميع المتداولين.' :
                language === 'de' ? 
                'Nach Jahren der Arbeit in Investmentbanken und Hedgefonds erkannte unser Team, dass die mächtigen Tools, die von Institutionen verwendet werden, allen Tradern zur Verfügung stehen könnten.' :
                'After years of working in investment banks and hedge funds, our team realized that the powerful tools used by institutions could be made available to all traders.'
              }
            </p>
            <p>
              {language === 'ar' ? 
                'اليوم، نفخر بخدمة آلاف المتداولين حول العالم، مع التزامنا بالشفافية والدقة والامتثال للشريعة الإسلامية.' :
                language === 'de' ? 
                'Heute sind wir stolz darauf, Tausende von Tradern weltweit zu bedienen, mit unserem Engagement für Transparenz, Genauigkeit und Scharia-Konformität.' :
                'Today, we\'re proud to serve thousands of traders worldwide, with our commitment to transparency, accuracy, and Shariah compliance.'
              }
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;


import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import Layout from '../components/Layout';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const FAQ: React.FC = () => {
  const { t, language } = useLanguage();
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: language === 'ar' ? 'ما مدى دقة الإشارات؟' : language === 'de' ? 'Wie genau sind die Signale?' : 'How accurate are the signals?',
      answer: language === 'ar' ? 'تستهدف خوارزمياتنا معدل دقة 68% بناءً على البيانات التاريخية. ومع ذلك، قد يختلف الأداء الفعلي مع ظروف السوق.' : language === 'de' ? 'Unsere Algorithmen zielen auf eine Genauigkeit von 68% basierend auf historischen Daten ab. Die tatsächliche Leistung kann jedoch je nach Marktbedingungen variieren.' : 'Our algorithms target a 68% accuracy rate based on historical data. However, actual performance may vary with market conditions.'
    },
    {
      question: language === 'ar' ? 'هل أحتاج إلى خبرة في التداول؟' : language === 'de' ? 'Brauche ich Handelserfahrung?' : 'Do I need trading experience?',
      answer: language === 'ar' ? 'بينما تساعد الخبرة، فإن إشاراتنا مصممة لتكون سهلة الفهم للمتداولين على جميع المستويات. نوفر أيضاً موارد تعليمية.' : language === 'de' ? 'Während Erfahrung hilft, sind unsere Signale darauf ausgelegt, für Trader aller Erfahrungsstufen verständlich zu sein. Wir bieten auch Bildungsressourcen.' : 'While experience helps, our signals are designed to be understandable for traders of all levels. We also provide educational resources.'
    },
    {
      question: language === 'ar' ? 'هل هذا متوافق مع الشريعة؟' : language === 'de' ? 'Ist dies Scharia-konform?' : 'Is this Shariah-compliant?',
      answer: language === 'ar' ? 'نعم، نقدم خيارات تصفية متوافقة مع الشريعة لاستبعاد الأسهم غير المتوافقة مع المبادئ الإسلامية.' : language === 'de' ? 'Ja, wir bieten Scharia-konforme Filteroptionen, um Aktien auszuschließen, die nicht mit islamischen Prinzipien übereinstimmen.' : 'Yes, we offer Shariah-compliant filtering options to exclude stocks that don\'t align with Islamic principles.'
    },
    {
      question: language === 'ar' ? 'هل يمكنني الإلغاء في أي وقت؟' : language === 'de' ? 'Kann ich jederzeit kündigen?' : 'Can I cancel anytime?',
      answer: language === 'ar' ? 'نعم، يمكنك إلغاء اشتراكك في أي وقت دون رسوم إلغاء. ستستمر في تلقي الإشارات حتى نهاية فترة الفوترة الحالية.' : language === 'de' ? 'Ja, Sie können Ihr Abonnement jederzeit ohne Stornierungsgebühren kündigen. Sie erhalten weiterhin Signale bis zum Ende Ihres aktuellen Abrechnungszeitraums.' : 'Yes, you can cancel your subscription anytime without cancellation fees. You\'ll continue to receive signals until the end of your current billing period.'
    }
  ];

  return (
    <Layout>
      <div className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            {language === 'ar' ? 'الأسئلة الشائعة' : language === 'de' ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-slate-400 text-lg">
            {language === 'ar' ? 'العثور على إجابات للأسئلة الشائعة حول منصة SwingTrader' : language === 'de' ? 'Finden Sie Antworten auf häufige Fragen zur SwingTrader-Plattform' : 'Find answers to common questions about the SwingTrader platform'}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg">
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-700/30 transition-colors"
              >
                <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </button>
              {openItems.includes(index) && (
                <div className="px-6 pb-4">
                  <p className="text-slate-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;

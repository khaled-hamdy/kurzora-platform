
import React from 'react';
import { ChevronDown } from 'lucide-react';

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "How fast are signals delivered?",
      answer: "Our signals are delivered within 30 seconds of detection. Telegram alerts are instant, while email notifications may take 1-2 minutes depending on your email provider."
    },
    {
      question: "Is Kurzora suitable for beginners?",
      answer: "Yes! Each signal comes with a detailed explanation and suggested entry/exit points. We also provide educational resources and paper trading to help you learn risk-free."
    },
    {
      question: "What returns can I expect?",
      answer: "Our members average +47% annual returns with a 2:1 profit ratio. This means you can be profitable with just a 45% win rate. Individual results vary based on position sizing and risk management."
    },
    {
      question: "How do you calculate the 2:1 profit ratio?",
      answer: "Our signals target 4-6% gains while limiting losses to 2% maximum. Historical data shows our average winning trade gains +4.7% while average losses are -2.1%, delivering better than 2:1 returns."
    },
    {
      question: "When will I be charged?",
      answer: "Your card won't be charged during the 7-day free trial. The first charge will occur after the trial ends, and then monthly or yearly based on your selected plan. You can cancel anytime during the trial to avoid any charges."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. No contracts, no hidden fees. Cancel your subscription anytime from your dashboard and you'll retain access until the end of your billing period."
    },
    {
      question: "Do you support crypto or forex?",
      answer: "Currently, we focus on US stocks (NYSE, NASDAQ). Crypto and forex signals are on our roadmap for Q2 2025."
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-8 sm:mb-12">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4 sm:space-y-6">
          {faqs.map((faq, index) => (
            <details 
              key={index}
              className="group bg-slate-800/30 backdrop-blur-sm border border-blue-800/20 rounded-lg p-4 sm:p-6 cursor-pointer hover:bg-slate-800/40 transition-all duration-300"
            >
              <summary className="flex justify-between items-center font-medium text-base sm:text-lg text-white list-none">
                <span className="pr-4">{faq.question}</span>
                <span className="transition-transform duration-300 group-open:rotate-180 flex-shrink-0">
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                </span>
              </summary>
              <div className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

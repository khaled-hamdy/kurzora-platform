import React from "react";
import { ChevronDown } from "lucide-react";

// 🔧 PRESERVATION: Keeping exact same component structure, TypeScript interfaces, and functionality
// 🎯 CHANGE: Only updating text content in faqs array - zero functional changes
const FAQSection: React.FC = () => {
  // 🎯 WHITE PAPER APPROVED CONTENT: Updated content only, same array structure
  const faqs = [
    {
      question: "How accurate are your signals?",
      answer:
        "Our institutional-grade analysis system uses advanced AI and quantitative models to identify high-probability setups. While past performance doesn't guarantee future results, our rigorous quality control ensures only premium opportunities reach you.",
    },
    {
      question: "What makes this different from other signal services?",
      answer:
        "Most services provide basic buy/sell alerts. We deliver complete trading intelligence with professional risk management, multi-timeframe analysis, and institutional-grade quality control built-in.",
    },
    {
      question: "What returns can I expect?",
      answer:
        "We focus on providing high-quality analysis rather than promising specific returns. Our institutional-grade signals are designed for consistent, risk-managed opportunities. Success depends on market conditions, your trading discipline, and risk management. We prioritize capital protection and quality setups over unrealistic promises. All trading involves risk, and individual results vary.",
    },
    {
      question: "How quickly do I receive signals?",
      answer:
        "Premium signals are delivered within minutes of market opportunities through email and Telegram alerts. Our AI processes market data continuously to identify optimal timing.",
    },
    {
      question: "Do you provide risk management guidance?",
      answer:
        "Yes, every signal includes professional risk parameters, position sizing recommendations, and stop-loss calculations based on institutional standards.",
    },
    {
      question: "Is this suitable for beginners?",
      answer:
        "Our platform provides institutional-grade analysis in an intuitive interface. While designed for serious traders, the complete risk management guidance makes it accessible for committed beginners.",
    },
    {
      question: "Can I cancel anytime?",
      answer:
        "Yes, absolutely. All plans include our money-back guarantee and can be canceled anytime with no fees or commitments.",
    },
  ];

  // 🔧 PRESERVATION: Keeping EXACT same JSX structure, CSS classes, and animations
  // No changes to HTML structure, responsive classes, or group animations
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

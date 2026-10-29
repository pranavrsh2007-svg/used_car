import React, { useState } from 'react';
import { 
  ChevronDown, 
  ArrowRight
} from 'lucide-react';

interface FaqPageProps {
  onNavigate: (route: string) => void;
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does the valuation estimate work?',
    answer:
      'We calculate your car’s indicative resale value by analyzing its age, total kilometres driven, fuel and transmission configuration, ownership count, condition, and registration city taxes. This creates a realistic price corridor based on real Indian used-car market trends.',
  },
  {
    question: 'Is this price guaranteed by dealerships or buyers?',
    answer:
      'This is an indicative estimate designed as a realistic benchmark for negotiations. The final cash offer from a dealership or buyer will depend on physical vehicle inspection, tyre wear, paint condition, and mechanical test drives.',
  },
  {
    question: 'Why is there a difference between dealer buy-in and private sale prices?',
    answer:
      'Dealerships and exchange platforms buy cars for instant cash and incur inventory holding, reconditioning, and warranty expenses, so they offer a wholesale price (typically 8% to 12% lower). Selling directly to an individual buyer yields the highest return, but requires managing test drives, buyer calls, and paperwork yourself.',
  },
  {
    question: 'What if my exact variant or special edition is not listed?',
    answer:
      'If your exact sub-variant (e.g. Adventure Edition, Dark Edition) is not shown, select the closest mechanical equivalent with the same engine displacement, fuel type, and transmission. Engine and powertrain characteristics drive the majority of base market pricing.',
  },
  {
    question: 'Do I need to enter a phone number or create an account?',
    answer:
      'No. AutoWorth does not require your phone number, email address, or OTP. Your estimate is computed immediately in your browser without marketing calls or dealer spam.',
  },
  {
    question: 'How does my state RTO registration affect my car’s value?',
    answer:
      'State vehicle registration taxes vary significantly across India. States like Karnataka and Maharashtra have higher road taxes (up to 18%+), giving KA and MH registered vehicles higher retained value. In contrast, Delhi-NCR enforces a strict 10-year limit on diesel vehicles, which accelerates diesel depreciation in that region.',
  },
  {
    question: 'Can I use this valuation to negotiate with dealers?',
    answer:
      'Yes! Many car owners use our price range to understand their car’s true baseline. Knowing your car’s fair market value prevents dealers from misleading you with unjustified lowball offers.',
  },
];

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [openIndices, setOpenIndices] = useState<number[]>([0, 1]);

  const toggleFaq = (index: number) => {
    setOpenIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="flex flex-col w-full py-10 sm:py-16">
      <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-10">
        
        {/* Header */}
        <div className="flex flex-col gap-2 text-center sm:text-left pb-4 border-b border-[#D8DDD4] dark:border-[#28322C]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4B6100] dark:text-[#D7F36A]">
            Help & Answers
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-[#151B18] dark:text-[#F5F5F0] tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-[#525E57] dark:text-[#B4B9AA]">
            Clear, honest answers about how our used car valuation estimates work.
          </p>
        </div>

        {/* Accordions */}
        <div className="flex flex-col gap-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndices.includes(idx);
            return (
              <div
                key={idx}
                className="rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-xs overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6100] dark:focus-visible:ring-[#D7F36A]"
                >
                  <span className="font-headline text-sm sm:text-base font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#525E57] dark:text-[#B4B9AA] transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-[#4B6100] dark:text-[#D7F36A]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed border-t border-[#D8DDD4]/70 dark:border-[#28322C]/70 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#EAECE4] dark:bg-[#1B211E] border border-[#CCD3C8] dark:border-[#28322C] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col gap-1">
            <h3 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Have a specific car in mind?
            </h3>
            <p className="text-xs sm:text-sm text-[#525E57] dark:text-[#B4B9AA]">
              Get your free instant estimate now. Takes under 60 seconds.
            </p>
          </div>

          <button
            onClick={() => onNavigate('valuation-form')}
            className="px-6 py-2.5 rounded-xl bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-xs sm:text-sm font-bold tracking-wide hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
          >
            <span>Estimate My Car</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ArrowRight, 
  Car, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ChevronDown,
  Gauge
} from 'lucide-react';
import { FuelType } from '../types/valuation';

interface HomePageProps {
  onNavigate: (route: string) => void;
  onQuickSelect?: (make: string, model: string, year: number, fuel: FuelType) => void;
  onLoadSample: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onNavigate, 
  onLoadSample 
}) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const homeFaqs = [
    {
      q: 'How is the valuation estimated?',
      a: 'We calculate your car’s fair market range by analyzing its age, total kilometres driven, fuel and transmission combination, ownership history, and local city registration taxes.'
    },
    {
      q: 'Is this price guaranteed by dealerships?',
      a: 'This is an indicative estimate designed to help you negotiate confidently with private buyers or dealerships. Physical inspection, cosmetic condition, and service records can influence the final offer.'
    },
    {
      q: 'Do I need to provide a phone number?',
      a: 'No. AutoWorth does not require your phone number, email address, or OTP verification. You get your estimate immediately without marketing calls.'
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-16 flex flex-col gap-16 sm:gap-20">
        
        {/* ================= 1. HERO SECTION ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headline, text, CTAs, trust points */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            
            <div className="flex flex-col gap-3">
              <h1 className="font-headline text-3xl sm:text-5xl font-bold tracking-tight text-[#151B18] dark:text-[#F5F5F0] leading-[1.15]">
                Find Out What Your Car Is Worth.
              </h1>
              <p className="text-base sm:text-lg text-[#525E57] dark:text-[#B4B9AA] leading-relaxed max-w-xl">
                Get an estimated resale value using your car’s details, mileage, condition, and location.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-1 w-full sm:w-auto">
              <button
                onClick={() => onNavigate('valuation-form')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-sm font-bold tracking-wide hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6100] dark:focus-visible:ring-[#D7F36A]"
              >
                <span>Estimate My Car</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onNavigate('how-it-works')}
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white dark:bg-[#1B211E] text-[#151B18] dark:text-[#F5F5F0] font-headline text-sm font-semibold hover:bg-[#F0F2EB] dark:hover:bg-[#202622] transition-colors border border-[#D8DDD4] dark:border-[#28322C] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6100] dark:focus-visible:ring-[#D7F36A]"
              >
                <span>How It Works</span>
              </button>
            </div>

            {/* At most 3 concise trust points */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs sm:text-sm text-[#525E57] dark:text-[#B4B9AA]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
                <span>100% Free & Instant</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
                <span>No Phone Number Needed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
                <span>Indian Market Factors</span>
              </div>
            </div>

          </div>

          {/* Right Column: High-quality automotive card with subtle valuation preview */}
          <div className="lg:col-span-5 relative flex flex-col">
            <div className="w-full rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] p-6 shadow-xl relative flex flex-col gap-4">
              
              {/* Header inside preview */}
              <div className="flex items-center justify-between pb-3 border-b border-[#D8DDD4] dark:border-[#28322C]">
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
                  <span className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                    Sample Valuation Preview
                  </span>
                </div>
                <span className="text-[11px] font-mono-val text-[#525E57] dark:text-[#B4B9AA]">
                  Pune (MH-12)
                </span>
              </div>

              {/* Vehicle Title */}
              <div className="flex flex-col">
                <h2 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
                  2021 Hyundai Creta SX (O)
                </h2>
                <span className="text-xs text-[#525E57] dark:text-[#B4B9AA]">
                  1.5 Diesel Automatic • 38,200 km • 1st Owner
                </span>
              </div>

              {/* Price card */}
              <div className="p-4 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#D8DDD4] dark:border-[#28322C] flex flex-col gap-1.5">
                <span className="text-[11px] uppercase tracking-wider text-[#525E57] dark:text-[#B4B9AA] font-semibold">
                  Estimated Resale Value
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-headline text-2xl sm:text-3xl font-bold text-[#4B6100] dark:text-[#D7F36A]">
                    ₹10,17,000
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#525E57] dark:text-[#B4B9AA] pt-1">
                  <span>Range: ₹9,66,000 – ₹10,68,000</span>
                  <span className="text-[#007060] dark:text-[#43C8B0] font-semibold">High Demand</span>
                </div>
              </div>

              {/* Action row */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={onLoadSample}
                  className="text-xs text-[#4B6100] dark:text-[#D7F36A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>See Sample Breakdown</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] text-[#727F78] dark:text-[#7F8576]">
                  Indicative illustration
                </span>
              </div>

            </div>
          </div>

        </section>

        {/* ================= 2. CONCISE 3-STEP "HOW IT WORKS" ================= */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-2xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
              How It Works
            </h2>
            <p className="text-sm text-[#525E57] dark:text-[#B4B9AA]">
              Three simple steps to discover your vehicle's fair resale value.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#F0F2EB] dark:bg-[#202622] flex items-center justify-center font-headline text-sm font-bold text-[#4B6100] dark:text-[#D7F36A]">
                1
              </span>
              <h3 className="font-headline text-base font-bold text-[#151B18] dark:text-[#F5F5F0]">
                Enter Your Car Details
              </h3>
              <p className="text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                Choose your car’s manufacturer, model, registration year, and trim level.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#F0F2EB] dark:bg-[#202622] flex items-center justify-center font-headline text-sm font-bold text-[#4B6100] dark:text-[#D7F36A]">
                2
              </span>
              <h3 className="font-headline text-base font-bold text-[#151B18] dark:text-[#F5F5F0]">
                Add Mileage & Condition
              </h3>
              <p className="text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                Enter your total kilometres driven, fuel type, ownership count, and overall condition.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#F0F2EB] dark:bg-[#202622] flex items-center justify-center font-headline text-sm font-bold text-[#4B6100] dark:text-[#D7F36A]">
                3
              </span>
              <h3 className="font-headline text-base font-bold text-[#151B18] dark:text-[#F5F5F0]">
                View Your Resale Value
              </h3>
              <p className="text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                See an instant estimated price and range, with key factors that influence your valuation.
              </p>
            </div>

          </div>
        </section>

        {/* ================= 3. COMPACT FEATURES SECTION ================= */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-2xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Why Use AutoWorth
            </h2>
            <p className="text-sm text-[#525E57] dark:text-[#B4B9AA]">
              Clear, honest pricing built for transparent vehicle selling.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="p-5 rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-2">
              <Clock className="w-5 h-5 text-[#4B6100] dark:text-[#D7F36A]" />
              <h3 className="font-headline text-sm font-bold text-[#151B18] dark:text-[#F5F5F0]">
                Instant Calculation
              </h3>
              <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                Get an estimated market value in seconds without waiting for agent callbacks.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-2">
              <Gauge className="w-5 h-5 text-[#4B6100] dark:text-[#D7F36A]" />
              <h3 className="font-headline text-sm font-bold text-[#151B18] dark:text-[#F5F5F0]">
                Mileage & Age Factors
              </h3>
              <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                Realistic depreciation curves tailored for normal Indian usage patterns.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-2">
              <MapPin className="w-5 h-5 text-[#4B6100] dark:text-[#D7F36A]" />
              <h3 className="font-headline text-sm font-bold text-[#151B18] dark:text-[#F5F5F0]">
                City & Tax Awareness
              </h3>
              <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                Adjusts for state road taxes and localized metro resale demand.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4B6100] dark:text-[#D7F36A]" />
              <h3 className="font-headline text-sm font-bold text-[#151B18] dark:text-[#F5F5F0]">
                Private by Default
              </h3>
              <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                No phone number required and zero sales spam from third-party dealers.
              </p>
            </div>

          </div>
        </section>

        {/* ================= 4. VALUATION FACTORS HIGHLIGHT ================= */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex flex-col gap-1 max-w-xl">
            <h2 className="font-headline text-xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Understand What Shapes Your Car’s Price
            </h2>
            <p className="text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
              We look at six primary drivers: vehicle age, mileage, city taxes, powertrain, ownership history, and overall condition.
            </p>
          </div>

          <button
            onClick={() => onNavigate('valuation-factors')}
            className="px-5 py-2.5 rounded-lg bg-[#F0F2EB] dark:bg-[#202622] hover:bg-[#EAECE4] dark:hover:bg-[#28322C] text-[#151B18] dark:text-[#F5F5F0] border border-[#D8DDD4] dark:border-[#28322C] text-sm font-semibold transition-colors flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Learn About Factors</span>
            <ArrowRight className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
          </button>
        </section>

        {/* ================= 5. SHORT FAQ ================= */}
        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-2xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#525E57] dark:text-[#B4B9AA]">
              Quick answers about our valuation estimates.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {homeFaqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-xs overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="font-headline text-sm sm:text-base font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#525E57] dark:text-[#B4B9AA] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-[#4B6100] dark:text-[#D7F36A]' : ''}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed border-t border-[#D8DDD4]/70 dark:border-[#28322C]/70 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ================= 6. FINAL CTA BANNER ================= */}
        <section className="p-8 sm:p-10 rounded-2xl bg-[#EAECE4] dark:bg-[#1B211E] border border-[#CCD3C8] dark:border-[#28322C] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col gap-1.5 max-w-lg">
            <h2 className="font-headline text-xl sm:text-2xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Ready to find out what your car is worth?
            </h2>
            <p className="text-sm text-[#525E57] dark:text-[#B4B9AA]">
              Takes less than a minute. No phone number or registration required.
            </p>
          </div>

          <button
            onClick={() => onNavigate('valuation-form')}
            className="px-6 py-3 rounded-xl bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-sm font-bold tracking-wide hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
          >
            <span>Estimate My Car</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

      </div>
    </div>
  );
};

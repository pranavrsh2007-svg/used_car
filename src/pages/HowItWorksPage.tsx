import React from 'react';
import { 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Fuel, 
  ShieldCheck 
} from 'lucide-react';

interface HowItWorksPageProps {
  onNavigate: (route: string) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full py-10 sm:py-16">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-16">
        
        {/* Page Header */}
        <div className="flex flex-col gap-3 text-center sm:text-left">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4B6100] dark:text-[#D7F36A]">
            Pricing Methodology
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-[#151B18] dark:text-[#F5F5F0] tracking-tight">
            How AutoWorth Calculates Resale Values
          </h1>
          <p className="text-base text-[#525E57] dark:text-[#B4B9AA] max-w-2xl leading-relaxed">
            We combine historical used car transactions, city-level road taxes, and realistic depreciation curves to provide fair market estimates for Indian car owners.
          </p>
        </div>

        {/* 3-Step Simple Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-4">
            <span className="w-9 h-9 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] flex items-center justify-center font-headline text-base font-bold text-[#4B6100] dark:text-[#D7F36A]">
              1
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
                Vehicle Specifications
              </h2>
              <p className="text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                You select your car’s make, model, registration year, variant, fuel type, and current odometer reading.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-4">
            <span className="w-9 h-9 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] flex items-center justify-center font-headline text-base font-bold text-[#4B6100] dark:text-[#D7F36A]">
              2
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
                Market Data Matching
              </h2>
              <p className="text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                We analyze depreciation curves, number of previous owners, service history, and city-level demand to determine the fair value.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-4">
            <span className="w-9 h-9 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] flex items-center justify-center font-headline text-base font-bold text-[#4B6100] dark:text-[#D7F36A]">
              3
            </span>
            <div className="flex flex-col gap-1.5">
              <h2 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
                Pricing Corridors
              </h2>
              <p className="text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                You receive a clear fair value estimate alongside expected ranges for dealership exchange and direct private buyer sales.
              </p>
            </div>
          </div>

        </div>

        {/* Detailed Insights Section */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Why Regional Differences Matter in India
            </h2>
            <p className="text-sm text-[#525E57] dark:text-[#B4B9AA]">
              A car in Bengaluru or Pune does not depreciate the same way as one in Delhi or Mumbai.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#525E57] dark:text-[#B4B9AA]">
            <div className="p-4 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#D8DDD4] dark:border-[#28322C] flex flex-col gap-2">
              <span className="font-semibold text-[#151B18] dark:text-[#F5F5F0] flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
                State Road Taxes (RTO)
              </span>
              <p className="text-xs leading-relaxed">
                States like Karnataka and Maharashtra levy higher lifetime road taxes (14%–19%) compared to other states. This gives KA and MH registered cars a higher resale value retention.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#D8DDD4] dark:border-[#28322C] flex flex-col gap-2">
              <span className="font-semibold text-[#151B18] dark:text-[#F5F5F0] flex items-center gap-1.5">
                <Fuel className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
                Fuel Regulations & NCR Cap
              </span>
              <p className="text-xs leading-relaxed">
                In Delhi-NCR, NGT regulations mandate a 10-year age limit on diesel cars and 15 years on petrol cars, accelerating diesel depreciation in the capital while keeping Southern markets resilient.
              </p>
            </div>
          </div>
        </div>

        {/* Tips for Sellers */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Tips to Maximize Your Resale Value
            </h2>
            <p className="text-sm text-[#525E57] dark:text-[#B4B9AA]">
              Small steps can add ₹20,000 to ₹50,000 to your selling price.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-[#4B6100] dark:text-[#D7F36A]">
                1. Service History Records
              </span>
              <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                Keeping authorized service center invoices proves authentic mileage and engine maintenance.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-[#4B6100] dark:text-[#D7F36A]">
                2. Fix Minor Cosmetic Scuffs
              </span>
              <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                A simple exterior polish and detailing costs little but significantly improves buyer first impressions.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-[#4B6100] dark:text-[#D7F36A]">
                3. Know Your Bottom Line
              </span>
              <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                Use our Fair Market Price as your benchmark so dealers cannot talk you into lowball offers.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-2xl bg-[#EAECE4] dark:bg-[#1B211E] border border-[#CCD3C8] dark:border-[#28322C] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Ready to value your car?
            </h2>
            <p className="text-sm text-[#525E57] dark:text-[#B4B9AA]">
              Get your indicative estimate in under a minute. 100% free with no phone number needed.
            </p>
          </div>

          <button
            onClick={() => onNavigate('valuation-form')}
            className="px-6 py-3 rounded-xl bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-sm font-bold tracking-wide hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
          >
            <span>Estimate My Car</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

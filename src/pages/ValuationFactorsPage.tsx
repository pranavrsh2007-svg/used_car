import React from 'react';
import { 
  Calendar, 
  Gauge, 
  ShieldCheck, 
  Fuel, 
  UserCheck, 
  MapPin, 
  ArrowRight
} from 'lucide-react';

interface ValuationFactorsPageProps {
  onNavigate: (route: string) => void;
}

export const ValuationFactorsPage: React.FC<ValuationFactorsPageProps> = ({ onNavigate }) => {
  const factors = [
    {
      id: 'age',
      icon: Calendar,
      title: '1. Vehicle Age & Model Year',
      impact: 'High Impact (15%–40% depreciation in first 3 years)',
      summary: 'Cars depreciate steepest in the first year (up to 15%–20%), then stabilize around 8%–10% annually.',
      detail: 'Recent facelifts and modern safety features (e.g. 6 airbags, ESC) retain higher value compared to pre-facelift generations.',
    },
    {
      id: 'mileage',
      icon: Gauge,
      title: '2. Kilometres Driven (Odometer)',
      impact: 'High Impact (Benchmark: 10,000–12,000 km / year)',
      summary: 'Average annual usage in India ranges between 8,000 to 12,000 km for petrol, and 15,000 to 20,000 km for diesel.',
      detail: 'Low-mileage vehicles (under 40,000 km) command strong buyer interest and premium pricing. High mileage incurs reconditioning allowances for suspension and clutch components.',
    },
    {
      id: 'condition',
      icon: ShieldCheck,
      title: '3. Physical & Mechanical Condition',
      impact: 'Medium to High Impact',
      summary: 'Clean exterior paint, accident-free history, intact tyres, and smooth engine performance prevent dealer deductions.',
      detail: 'Having documented periodic service stamps from authorized brand dealerships adds instant buyer trust and verifiable authenticity.',
    },
    {
      id: 'fuel',
      icon: Fuel,
      title: '4. Fuel Type & Powertrain',
      impact: 'Regional High Impact',
      summary: 'Diesel cars remain popular in long-distance markets like Punjab, Maharashtra, and Kerala, but face legal limits in NCR.',
      detail: 'Petrol and CNG models have strong metro demand. Automatic transmissions (DCT, IVT, Torque Converter) consistently fetch a premium over manual gearboxes in high-traffic cities.',
    },
    {
      id: 'ownership',
      icon: UserCheck,
      title: '5. Number of Previous Owners',
      impact: 'Moderate Impact (~5%–8% drop per subsequent owner)',
      summary: '1st-owner cars are universally preferred in India and sell faster with fewer negotiation questions.',
      detail: 'Cars with 2nd or 3rd ownership status face larger discounts because subsequent buyers discount for unknown maintenance history.',
    },
    {
      id: 'location',
      icon: MapPin,
      title: '6. Registration City & State RTO Taxes',
      impact: 'Moderate to High Impact',
      summary: 'State road tax varies widely across India, creating noticeable resale price differences between cities.',
      detail: 'For instance, Karnataka road taxes are among the highest in the country (up to 18%+), which keeps KA-registered cars priced higher than DL or CH registered equivalents.',
    },
  ];

  return (
    <div className="flex flex-col w-full py-10 sm:py-16">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-[#D8DDD4] dark:border-[#28322C]">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#4B6100] dark:text-[#D7F36A]">
              Market Value Drivers
            </span>
            <h1 className="font-headline text-3xl sm:text-4xl font-bold text-[#151B18] dark:text-[#F5F5F0] tracking-tight">
              The 6 Key Valuation Factors
            </h1>
            <p className="text-base text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
              Understand how car age, mileage, condition, fuel, ownership, and local taxes interact to determine market price.
            </p>
          </div>

          <button
            onClick={() => onNavigate('valuation-form')}
            className="px-5 py-2.5 rounded-xl bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-xs font-bold tracking-wide hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-auto shadow-sm"
          >
            <span>Estimate My Car</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Factor Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {factors.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] flex items-center justify-center text-[#4B6100] dark:text-[#D7F36A] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h2 className="font-headline text-base font-bold text-[#151B18] dark:text-[#F5F5F0]">
                    {f.title}
                  </h2>
                </div>

                <span className="text-xs font-bold text-[#007060] dark:text-[#43C8B0]">
                  {f.impact}
                </span>

                <p className="text-xs sm:text-sm text-[#151B18] dark:text-[#E0E3DE] leading-relaxed">
                  {f.summary}
                </p>

                <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed pt-2 border-t border-[#D8DDD4] dark:border-[#28322C]">
                  {f.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom summary card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#EAECE4] dark:bg-[#1B211E] border border-[#CCD3C8] dark:border-[#28322C] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col gap-1 max-w-lg">
            <h3 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Ready to see how your vehicle ranks?
            </h3>
            <p className="text-xs sm:text-sm text-[#525E57] dark:text-[#B4B9AA]">
              Input your exact car details and get your free indicative price range in seconds.
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

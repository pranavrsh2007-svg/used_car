import React from 'react';
import { 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight
} from 'lucide-react';

interface FeaturesPageProps {
  onNavigate: (route: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col w-full py-10 sm:py-16">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-12">
        
        {/* Header */}
        <div className="flex flex-col gap-2 text-center sm:text-left pb-4 border-b border-[#D8DDD4] dark:border-[#28322C]">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#4B6100] dark:text-[#D7F36A]">
            Why AutoWorth
          </span>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-[#151B18] dark:text-[#F5F5F0] tracking-tight">
            Built for Transparent Car Pricing
          </h1>
          <p className="text-base text-[#525E57] dark:text-[#B4B9AA] max-w-2xl leading-relaxed">
            Eliminating guesswork and unfair dealer lowball offers with unbiased, real-world valuation data.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] flex items-center justify-center text-[#4B6100] dark:text-[#D7F36A]">
              <Clock className="w-5 h-5" />
            </div>
            <h2 className="font-headline text-base font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Instant & Automated
            </h2>
            <p className="text-xs sm:text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
              No endless forms or waiting for agent callbacks. Get your estimated price range in under a minute.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] flex items-center justify-center text-[#4B6100] dark:text-[#D7F36A]">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="font-headline text-base font-bold text-[#151B18] dark:text-[#F5F5F0]">
              City & RTO Awareness
            </h2>
            <p className="text-xs sm:text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
              Accounts for state road taxes, regional demand differences, and local urban fuel regulations across Indian metros.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] flex items-center justify-center text-[#4B6100] dark:text-[#D7F36A]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="font-headline text-base font-bold text-[#151B18] dark:text-[#F5F5F0]">
              100% Private & Free
            </h2>
            <p className="text-xs sm:text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
              We never ask for your phone number or sell your details to aggressive dealer call centers.
            </p>
          </div>

        </div>

        {/* Comparison Table */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
              How AutoWorth Compares
            </h2>
            <p className="text-xs sm:text-sm text-[#525E57] dark:text-[#B4B9AA]">
              Traditional classifieds vs dealer portals vs AutoWorth AI.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#D8DDD4] dark:border-[#28322C] text-[#525E57] dark:text-[#B4B9AA]">
                  <th className="py-3 font-semibold">Feature</th>
                  <th className="py-3 font-bold text-[#4B6100] dark:text-[#D7F36A]">AutoWorth AI</th>
                  <th className="py-3 font-medium">Online Classifieds</th>
                  <th className="py-3 font-medium">Franchise Dealers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D8DDD4]/60 dark:divide-[#28322C]/60">
                <tr>
                  <td className="py-3.5 font-semibold text-[#151B18] dark:text-[#F5F5F0]">No Phone Number Needed</td>
                  <td className="py-3.5 text-[#4B6100] dark:text-[#D7F36A] font-bold">✓ Free & Private</td>
                  <td className="py-3.5 text-[#BA1A1A] dark:text-[#FF8F85]">✗ Requires OTP</td>
                  <td className="py-3.5 text-[#BA1A1A] dark:text-[#FF8F85]">✗ Requires Contact</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-semibold text-[#151B18] dark:text-[#F5F5F0]">Unbiased Fair Market Price</td>
                  <td className="py-3.5 text-[#4B6100] dark:text-[#D7F36A] font-bold">✓ Realistic Corridor</td>
                  <td className="py-3.5 text-[#525E57] dark:text-[#B4B9AA]">Seller wishlist prices</td>
                  <td className="py-3.5 text-[#BA1A1A] dark:text-[#FF8F85]">✗ Lowball wholesale</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-semibold text-[#151B18] dark:text-[#F5F5F0]">Dealer vs Direct Buyer Split</td>
                  <td className="py-3.5 text-[#4B6100] dark:text-[#D7F36A] font-bold">✓ Both Shown</td>
                  <td className="py-3.5 text-[#BA1A1A] dark:text-[#FF8F85]">✗ Not available</td>
                  <td className="py-3.5 text-[#BA1A1A] dark:text-[#FF8F85]">✗ Hidden margin</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-semibold text-[#151B18] dark:text-[#F5F5F0]">Printable / Shareable Summary</td>
                  <td className="py-3.5 text-[#4B6100] dark:text-[#D7F36A] font-bold">✓ 1-Click PDF & Copy</td>
                  <td className="py-3.5 text-[#BA1A1A] dark:text-[#FF8F85]">✗ No report</td>
                  <td className="py-3.5 text-[#525E57] dark:text-[#B4B9AA]">Physical printout</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#EAECE4] dark:bg-[#1B211E] border border-[#CCD3C8] dark:border-[#28322C] flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="flex flex-col gap-1">
            <h3 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Ready to value your car?
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

import React from 'react';
import { Car } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-[#EAECE4] dark:bg-[#0D100F] border-t border-[#D8DDD4] dark:border-[#28322C] py-12 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-8">
        
        {/* Top row: Brand + Links */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
          
          {/* Logo & one-sentence description */}
          <div className="flex flex-col items-start gap-2.5 max-w-sm">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-white dark:bg-[#1B211E] border border-[#CCD3C8] dark:border-[#28322C] flex items-center justify-center text-[#4B6100] dark:text-[#D7F36A]">
                <Car className="w-4 h-4" />
              </div>
              <span className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
                AutoWorth<span className="text-[#4B6100] dark:text-[#D7F36A]">.ai</span>
              </span>
            </div>
            <p className="text-sm text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
              Transparent, data-backed used-car price discovery engineered specifically for Indian vehicle owners.
            </p>
          </div>

          {/* Useful navigation links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-[#525E57] dark:text-[#B4B9AA]">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-[#4B6100] dark:hover:text-[#D7F36A] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className="hover:text-[#4B6100] dark:hover:text-[#D7F36A] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigate('valuation-factors')}
              className="hover:text-[#4B6100] dark:hover:text-[#D7F36A] transition-colors cursor-pointer"
            >
              Valuation Factors
            </button>
            <button
              onClick={() => onNavigate('features')}
              className="hover:text-[#4B6100] dark:hover:text-[#D7F36A] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => onNavigate('valuation-form')}
              className="hover:text-[#4B6100] dark:hover:text-[#D7F36A] transition-colors cursor-pointer"
            >
              Valuation Form
            </button>
            <button
              onClick={() => onNavigate('valuation-results')}
              className="hover:text-[#4B6100] dark:hover:text-[#D7F36A] transition-colors cursor-pointer"
            >
              Results
            </button>
            <button
              onClick={() => onNavigate('faq')}
              className="hover:text-[#4B6100] dark:hover:text-[#D7F36A] transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button
              onClick={() => onNavigate('valuation-form')}
              className="text-[#4B6100] dark:text-[#D7F36A] font-bold hover:underline cursor-pointer"
            >
              Estimate My Car
            </button>
          </div>

        </div>

        {/* Concise Disclaimer & Copyright */}
        <div className="pt-6 border-t border-[#D8DDD4] dark:border-[#28322C] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-[#727F78] dark:text-[#7F8576]">
          <p className="max-w-2xl leading-relaxed">
            Disclaimer: Estimates are indicative guidance benchmarks based on user inputs and market depreciation models. Final transaction prices depend on physical vehicle inspection, paperwork verification, and dealer margins.
          </p>
          <span className="whitespace-nowrap shrink-0">
            © {new Date().getFullYear()} AutoWorth.ai. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Car, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  ArrowRight,
  Calculator,
  Layers,
  Sparkles,
  HelpCircle,
  FileText,
  BarChart2
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Exact 7 navigation items requested:
  // Home, How It Works, Valuation Factors, Features, Valuation Form, Results, FAQ
  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'valuation-factors', label: 'Valuation Factors' },
    { id: 'features', label: 'Features' },
    { id: 'valuation-form', label: 'Valuation Form' },
    { id: 'valuation-results', label: 'Results' },
    { id: 'faq', label: 'FAQ' },
  ];

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setMobileMenuOpen(false);
  };

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 left-0 right-0 w-full z-40 bg-white/95 dark:bg-[#101412]/95 backdrop-blur-md border-b border-[#D8DDD4] dark:border-[#28322C] transition-colors duration-150">
        <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 lg:gap-6">
          
          {/* Left zone: Hamburger (mobile/tablet) + Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
              className="xl:hidden p-2 rounded-lg text-[#151B18] dark:text-[#E0E3DE] hover:bg-[#F0F2EB] dark:hover:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6100] dark:focus-visible:ring-[#D7F36A]"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => handleLinkClick('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6100] dark:focus-visible:ring-[#D7F36A] rounded-md shrink-0"
            >
              <div className="w-8 h-8 rounded-lg bg-[#F0F2EB] dark:bg-[#1B211E] border border-[#CCD3C8] dark:border-[#28322C] flex items-center justify-center text-[#4B6100] dark:text-[#D7F36A] group-hover:scale-105 transition-transform">
                <Car className="w-4 h-4" />
              </div>
              <span className="font-headline text-lg font-bold tracking-tight text-[#151B18] dark:text-[#F5F5F0] leading-none">
                AutoWorth<span className="text-[#4B6100] dark:text-[#D7F36A]">.ai</span>
              </span>
            </button>
          </div>

          {/* Center zone: Complete Desktop Navigation Links (Visible on desktop & laptop screens) */}
          <nav 
            aria-label="Main Navigation"
            className="hidden xl:flex items-center gap-1 2xl:gap-1.5"
          >
            {navLinks.map((link) => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6100] dark:focus-visible:ring-[#D7F36A] ${
                    isActive
                      ? 'bg-[#F0F2EB] dark:bg-[#1B211E] text-[#4B6100] dark:text-[#D7F36A] border border-[#CCD3C8] dark:border-[#28322C]'
                      : 'text-[#525E57] dark:text-[#B4B9AA] hover:text-[#151B18] dark:hover:text-[#F5F5F0] hover:bg-[#F0F2EB]/70 dark:hover:bg-[#1B211E]/70'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right zone: Working Theme Toggle + Estimate CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Real Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="w-9 h-9 rounded-lg bg-[#F0F2EB] dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] text-[#525E57] dark:text-[#B4B9AA] hover:text-[#4B6100] dark:hover:text-[#D7F36A] flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6100] dark:focus-visible:ring-[#D7F36A]"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#D7F36A]" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-[#4B6100]" aria-hidden="true" />
              )}
            </button>

            {/* Primary "Estimate My Car" CTA */}
            <button
              onClick={() => handleLinkClick('valuation-form')}
              className="px-3.5 sm:px-4 py-2 rounded-lg bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-xs sm:text-sm font-bold tracking-wide hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4B6100] dark:focus-visible:ring-[#D7F36A]"
            >
              <span>Estimate My Car</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      </header>

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Menu"
          className="fixed inset-0 z-50 flex"
        >
          {/* Backdrop scrim */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer sheet */}
          <div className="relative w-[85vw] max-w-sm h-full bg-[#FFFFFF] dark:bg-[#1B211E] text-[#151B18] dark:text-[#F5F5F0] p-5 flex flex-col justify-between shadow-2xl z-10 border-r border-[#D8DDD4] dark:border-[#28322C] overflow-y-auto">
            
            <div className="flex flex-col gap-5">
              
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3.5 border-b border-[#D8DDD4] dark:border-[#28322C]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#F0F2EB] dark:bg-[#202622] border border-[#CCD3C8] dark:border-[#28322C] flex items-center justify-center text-[#4B6100] dark:text-[#D7F36A]">
                    <Car className="w-4 h-4" />
                  </div>
                  <span className="font-headline font-bold text-base text-[#151B18] dark:text-[#F5F5F0]">
                    AutoWorth<span className="text-[#4B6100] dark:text-[#D7F36A]">.ai</span>
                  </span>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-1.5 rounded-lg text-[#525E57] dark:text-[#B4B9AA] hover:bg-[#F0F2EB] dark:hover:bg-[#202622] hover:text-[#151B18] dark:hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* All 7 Navigation Links in Drawer */}
              <nav aria-label="Mobile Navigation" className="flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const isActive = currentRoute === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleLinkClick(link.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-left text-sm font-semibold transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#F0F2EB] dark:bg-[#202622] text-[#4B6100] dark:text-[#D7F36A] border border-[#CCD3C8] dark:border-[#28322C]'
                          : 'text-[#525E57] dark:text-[#B4B9AA] hover:bg-[#F0F2EB] dark:hover:bg-[#202622] hover:text-[#151B18] dark:hover:text-[#F5F5F0]'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#4B6100] dark:text-[#D7F36A]' : 'opacity-40'}`} />
                    </button>
                  );
                })}
              </nav>

            </div>

            {/* Bottom Actions inside Drawer */}
            <div className="pt-4 border-t border-[#D8DDD4] dark:border-[#28322C] flex flex-col gap-3">
              
              {/* Theme toggle row inside drawer */}
              <div className="flex items-center justify-between px-2 py-1 text-xs text-[#525E57] dark:text-[#B4B9AA]">
                <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                <button
                  onClick={toggleTheme}
                  className="px-2.5 py-1 rounded-md bg-[#F0F2EB] dark:bg-[#202622] border border-[#CCD3C8] dark:border-[#28322C] text-[#151B18] dark:text-[#F5F5F0] flex items-center gap-1.5 font-medium cursor-pointer"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-[#D7F36A]" />
                      <span>Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-[#4B6100]" />
                      <span>Dark</span>
                    </>
                  )}
                </button>
              </div>

              {/* Estimate CTA in Drawer */}
              <button
                onClick={() => handleLinkClick('valuation-form')}
                className="w-full py-2.5 px-4 rounded-lg bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Estimate My Car</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

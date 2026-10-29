import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { ValuationFormPage } from './pages/ValuationFormPage';
import { ValuationResultsPage } from './pages/ValuationResultsPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { ValuationFactorsPage } from './pages/ValuationFactorsPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { FaqPage } from './pages/FaqPage';
import { 
  DEFAULT_SAMPLE_SPEC, 
  calculateValuation 
} from './lib/valuationEngine';
import { predictWithMlApi } from './lib/mlPredictionService';
import { FuelType, ValuationResult, VehicleSpec } from './types/valuation';

export default function App() {
  // Routing state based on hash
  const getRouteFromHash = (): string => {
    const hash = window.location.hash.replace('#', '').trim();
    const validRoutes = [
      'home', 
      'how-it-works', 
      'valuation-factors', 
      'features', 
      'valuation-form', 
      'valuation-results', 
      'faq'
    ];
    if (hash && validRoutes.includes(hash)) {
      return hash;
    }
    return 'home';
  };

  const [currentRoute, setCurrentRoute] = useState<string>(getRouteFromHash());
  
  // Valuation Data State
  const [currentSpec, setCurrentSpec] = useState<Partial<VehicleSpec>>(DEFAULT_SAMPLE_SPEC);
  const [valuationResult, setValuationResult] = useState<ValuationResult | null>(() => {
    // Initialize with sample result so results page has demonstrator data available
    return calculateValuation(DEFAULT_SAMPLE_SPEC);
  });

  // Attempt to synchronize demonstrator sample with live ML model on startup
  useEffect(() => {
    let isMounted = true;
    predictWithMlApi(DEFAULT_SAMPLE_SPEC)
      .then((realMl) => {
        if (isMounted) {
          setValuationResult((prev) => (!prev || !prev.mlModelInfo ? realMl : prev));
        }
      })
      .catch(() => {
        // ML backend offline; keep indicative heuristic baseline
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to hash changes (browser back/forward & direct links)
  useEffect(() => {
    const handleHashChange = () => {
      const newRoute = getRouteFromHash();
      setCurrentRoute(newRoute);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = `#${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickSelect = (make: string, model: string, year: number, fuel: FuelType) => {
    setCurrentSpec((prev) => ({
      ...prev,
      make,
      model,
      year,
      fuelType: fuel,
    }));
  };

  const handleLoadSample = async () => {
    setCurrentSpec(DEFAULT_SAMPLE_SPEC);
    navigateTo('valuation-results');
    try {
      const mlResult = await predictWithMlApi(DEFAULT_SAMPLE_SPEC);
      setValuationResult(mlResult);
    } catch {
      const sampleResult = calculateValuation(DEFAULT_SAMPLE_SPEC);
      setValuationResult(sampleResult);
    }
  };

  const handleValuationComplete = (result: ValuationResult) => {
    setCurrentSpec(result.spec);
    setValuationResult(result);
  };

  const handleRecalculate = async () => {
    if (valuationResult) {
      // Re-query the authentic ML prediction service
      const refreshed = await predictWithMlApi(valuationResult.spec);
      setValuationResult(refreshed);
    }
  };

  const handleEditDetails = () => {
    if (valuationResult) {
      setCurrentSpec(valuationResult.spec);
    }
    navigateTo('valuation-form');
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen bg-[#F7F7F2] dark:bg-[#101412] text-[#242D28] dark:text-[#E0E3DE] transition-colors duration-150">
        
        {/* Navigation Bar */}
        <Navbar 
          currentRoute={currentRoute} 
          onNavigate={navigateTo} 
        />

        {/* Page Content Viewport */}
        <main className="flex-grow w-full">
          {currentRoute === 'home' && (
            <HomePage 
              onNavigate={navigateTo} 
              onQuickSelect={handleQuickSelect}
              onLoadSample={handleLoadSample}
            />
          )}

          {currentRoute === 'valuation-form' && (
            <ValuationFormPage 
              initialSpec={currentSpec}
              onValuationComplete={handleValuationComplete}
              onNavigate={navigateTo}
            />
          )}

          {currentRoute === 'valuation-results' && (
            <ValuationResultsPage 
              result={valuationResult}
              onEditDetails={handleEditDetails}
              onRecalculate={handleRecalculate}
              onNavigate={navigateTo}
              onLoadSample={handleLoadSample}
            />
          )}

          {currentRoute === 'how-it-works' && (
            <HowItWorksPage 
              onNavigate={navigateTo} 
            />
          )}

          {currentRoute === 'valuation-factors' && (
            <ValuationFactorsPage 
              onNavigate={navigateTo} 
            />
          )}

          {currentRoute === 'features' && (
            <FeaturesPage 
              onNavigate={navigateTo} 
            />
          )}

          {currentRoute === 'faq' && (
            <FaqPage 
              onNavigate={navigateTo} 
            />
          )}
        </main>

        {/* Global Footer */}
        <Footer onNavigate={navigateTo} />

        {/* Mobile Ergonomic Bottom Nav */}
        <MobileBottomNav 
          currentRoute={currentRoute} 
          onNavigate={navigateTo} 
        />

      </div>
    </ThemeProvider>
  );
}

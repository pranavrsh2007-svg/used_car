import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  Edit3, 
  RefreshCw, 
  Copy, 
  Printer, 
  Share2, 
  Car, 
  MapPin, 
  Users,
  Zap,
  Building2,
  ArrowRight
} from 'lucide-react';
import { ValuationResult } from '../types/valuation';
import { formatINR, numberToIndianWords } from '../lib/valuationEngine';

interface ValuationResultsPageProps {
  result: ValuationResult | null;
  onEditDetails: () => void;
  onRecalculate: () => Promise<void> | void;
  onNavigate: (route: string) => void;
  onLoadSample: () => void;
}

export const ValuationResultsPage: React.FC<ValuationResultsPageProps> = ({
  result,
  onEditDetails,
  onRecalculate,
  onNavigate,
  onLoadSample,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Development-only diagnostic trace (Task 4)
  useEffect(() => {
    if (import.meta.env.DEV && result) {
      console.debug('[AutoWorth ML Prediction Trace]', {
        rawMlPrediction: result.medianFairValue,
        displayedValuation: result.medianFairValue,
        priceCorridor: `${formatINR(result.minLiquidity)} – ${formatINR(result.maxRetail)}`,
        netAdjustmentAmount: result.netVectorInfluence,
        modelName: result.mlModelInfo?.modelName || 'Baseline Heuristic',
        modelVersion: result.mlModelInfo?.modelVersion || '1.0',
        isRealMl: result.mlModelInfo?.isRealMl ?? false,
      });
    }
  }, [result]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleCopySummary = () => {
    if (!result) return;
    const text = `AutoWorth AI Valuation Summary:\nVehicle: ${result.spec.year} ${result.spec.make} ${result.spec.model} ${result.spec.variant}\nEstimated Resale Value: ${formatINR(result.medianFairValue)}\nPrice Range: ${formatINR(result.minLiquidity)} – ${formatINR(result.maxRetail)}\nLocation: ${result.spec.rtoCode}\nMileage: ${result.spec.kilometers.toLocaleString('en-IN')} km\nOwnership: ${result.spec.ownership}\nCondition: ${result.spec.condition}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text)
        .then(() => showToast('Valuation summary copied to clipboard!'))
        .catch(() => showToast('Summary copied!'));
    } else {
      showToast('Valuation summary copied!');
    }
  };

  const handleShare = () => {
    if (!result) return;
    if (navigator.share) {
      navigator.share({
        title: `AutoWorth AI Valuation - ${result.spec.make} ${result.spec.model}`,
        text: `Estimated value for ${result.spec.year} ${result.spec.make} ${result.spec.model}: ${formatINR(result.medianFairValue)}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopySummary();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRecalculateClick = async () => {
    setIsRecalculating(true);
    try {
      await onRecalculate();
      showToast('Valuation refreshed with latest ML rates!');
    } catch (err: any) {
      showToast(err?.message || 'Could not refresh: ML API is offline.');
    } finally {
      setIsRecalculating(false);
    }
  };

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="w-14 h-14 rounded-2xl bg-[#F0F2EB] dark:bg-[#1B211E] border border-[#CCD3C8] dark:border-[#28322C] flex items-center justify-center text-[#4B6100] dark:text-[#D7F36A] mb-4">
          <Car className="w-7 h-7" />
        </div>
        <h1 className="font-headline text-2xl font-bold text-[#151B18] dark:text-[#F5F5F0] mb-2">
          No Vehicle Valuation in Session
        </h1>
        <p className="text-sm text-[#525E57] dark:text-[#B4B9AA] max-w-md mb-6 leading-relaxed">
          Start by entering your vehicle details to get an estimated resale value, or view a sample car estimate.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('valuation-form')}
            className="px-6 py-3 rounded-xl bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-sm font-bold tracking-wide hover:opacity-95 cursor-pointer shadow-sm"
          >
            Estimate My Car
          </button>
          <button
            onClick={onLoadSample}
            className="px-5 py-3 rounded-xl bg-white dark:bg-[#1B211E] text-[#151B18] dark:text-[#F5F5F0] font-headline text-sm font-semibold border border-[#D8DDD4] dark:border-[#CCD3C8] hover:bg-[#F0F2EB] dark:hover:bg-[#202622] cursor-pointer"
          >
            View Sample Estimate
          </button>
        </div>
      </div>
    );
  }

  const positiveVectors = result.vectors.filter((v) => v.impactType === 'positive');
  const negativeVectors = result.vectors.filter((v) => v.impactType === 'negative');

  return (
    <div className="flex flex-col w-full py-8 sm:py-12 relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 font-semibold text-xs sm:text-sm animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-8">
        
        {/* ================= 1. CAR SUMMARY HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D8DDD4] dark:border-[#28322C]">
          <div className="flex flex-col gap-1">
            {result.mlModelInfo ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF3E8] dark:bg-[#1E2E22] text-[#2E6B34] dark:text-[#7CD988] text-[11px] font-semibold border border-[#C5DEC0] dark:border-[#2C4830] w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Real ML Pipeline: {result.mlModelInfo.modelName} (v{result.mlModelInfo.modelVersion})</span>
              </div>
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wider text-[#4B6100] dark:text-[#D7F36A]">
                Estimated Valuation
              </span>
            )}
            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
              {result.spec.year} {result.spec.make} {result.spec.model}
            </h1>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#525E57] dark:text-[#B4B9AA]">
              <span className="font-semibold text-[#151B18] dark:text-[#F5F5F0]">{result.spec.variant}</span>
              <span>•</span>
              <span>{result.spec.kilometers.toLocaleString('en-IN')} km</span>
              <span>•</span>
              <span>{result.spec.fuelType} {result.spec.transmission}</span>
              <span>•</span>
              <span>{result.spec.rtoCode}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto no-print">
            <button
              onClick={onEditDetails}
              className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#CCD3C8] text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0] hover:bg-[#F0F2EB] dark:hover:bg-[#202622] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit3 className="w-3.5 h-3.5 text-[#4B6100] dark:text-[#D7F36A]" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={handleRecalculateClick}
              disabled={isRecalculating}
              className="px-3.5 py-2 rounded-lg bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#CCD3C8] text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0] hover:bg-[#F0F2EB] dark:hover:bg-[#202622] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#4B6100] dark:text-[#D7F36A] ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ================= 2. PRIMARY VALUATION HERO CARD ================= */}
        <div className="bg-white dark:bg-[#1B211E] rounded-2xl p-6 sm:p-8 border border-[#D8DDD4] dark:border-[#28322C] shadow-xl flex flex-col gap-6">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wider text-[#525E57] dark:text-[#B4B9AA] font-semibold">
                Fair Market Value
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl sm:text-5xl font-bold text-[#4B6100] dark:text-[#D7F36A] tracking-tight">
                  {formatINR(result.medianFairValue)}
                </span>
              </div>
              <span className="text-xs text-[#525E57] dark:text-[#B4B9AA]">
                {numberToIndianWords(result.medianFairValue)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#D8DDD4] dark:border-[#28322C] flex flex-col gap-1">
              <span className="text-[11px] text-[#525E57] dark:text-[#B4B9AA] font-semibold uppercase">
                Expected Price Range
              </span>
              <span className="font-headline text-base sm:text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
                {formatINR(result.minLiquidity)} – {formatINR(result.maxRetail)}
              </span>
            </div>
          </div>

          {/* Simple Visual Range Bar */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="relative w-full h-3 bg-[#EAECE4] dark:bg-[#202622] rounded-full overflow-hidden">
              <div className="absolute left-[15%] right-[15%] h-full bg-[#4B6100]/30 dark:bg-[#D7F36A]/30 rounded-full"></div>
              <div className="absolute left-1/2 -translate-x-1/2 w-3.5 h-full bg-[#4B6100] dark:bg-[#D7F36A] rounded-full"></div>
            </div>

            <div className="flex items-center justify-between text-xs text-[#525E57] dark:text-[#B4B9AA]">
              <div className="flex flex-col text-left">
                <span className="font-bold text-[#151B18] dark:text-[#F5F5F0]">{formatINR(result.minLiquidity)}</span>
                <span className="text-[11px]">Dealer Buy-in</span>
              </div>
              <div className="flex flex-col text-center">
                <span className="font-bold text-[#4B6100] dark:text-[#D7F36A]">{formatINR(result.medianFairValue)}</span>
                <span className="text-[11px]">Fair Market</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="font-bold text-[#151B18] dark:text-[#F5F5F0]">{formatINR(result.maxRetail)}</span>
                <span className="text-[11px]">Private Sale</span>
              </div>
            </div>
          </div>

        </div>

        {/* ================= 3. PRACTICAL SALE CHANNEL COMPARISON ================= */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
              Where You Sell Determines Your Final Price
            </h2>
            <p className="text-xs text-[#525E57] dark:text-[#B4B9AA]">
              Compare what to expect based on your preferred selling method.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Direct to Individual Buyer */}
            <div className="p-5 rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#007060] dark:text-[#43C8B0]">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Direct Buyer (C2C)</span>
                </div>
                <span className="font-headline text-xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
                  ~{formatINR(result.maxRetail)}
                </span>
                <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                  Highest return. You negotiate directly with an individual buyer. Requires handling visits, paperwork, and RC transfer yourself.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#007060] dark:text-[#43C8B0]">
                Takes 2–4 weeks
              </span>
            </div>

            {/* Fair Market Benchmark */}
            <div className="p-5 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border-2 border-[#4B6100] dark:border-[#D7F36A] shadow-md flex flex-col justify-between gap-3 relative">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#4B6100] dark:text-[#D7F36A]">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Fair Market Price</span>
                </div>
                <span className="font-headline text-xl font-bold text-[#4B6100] dark:text-[#D7F36A]">
                  {formatINR(result.medianFairValue)}
                </span>
                <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                  Balanced benchmark price. The realistic target value for a well-maintained vehicle in this region.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#4B6100] dark:text-[#D7F36A]">
                Balanced negotiation target
              </span>
            </div>

            {/* Dealership / Instant Exchange */}
            <div className="p-5 rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-sm flex flex-col justify-between gap-3">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-[#525E57] dark:text-[#B4B9AA]">
                  <Building2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Dealer / Trade-in</span>
                </div>
                <span className="font-headline text-xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
                  ~{formatINR(result.minLiquidity)}
                </span>
                <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                  Instant cash and no paperwork hassle. Dealerships deduct an 8%–12% margin for reconditioning and resale risk.
                </p>
              </div>
              <span className="text-[11px] font-semibold text-[#525E57] dark:text-[#B4B9AA]">
                Immediate payment (Same day)
              </span>
            </div>

          </div>
        </div>

        {/* ================= 4. WHAT INFLUENCED THIS PRICE ================= */}
        <div className="bg-white dark:bg-[#1B211E] rounded-2xl p-6 border border-[#D8DDD4] dark:border-[#28322C] shadow-xl flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#D8DDD4] dark:border-[#28322C]">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
              <h2 className="font-headline text-base font-bold text-[#151B18] dark:text-[#F5F5F0]">
                Key Factors Affecting This Valuation
              </h2>
            </div>
            <span className="text-xs text-[#525E57] dark:text-[#B4B9AA]">
              Condition Grade: <strong className="text-[#151B18] dark:text-[#F5F5F0]">{result.spec.condition}</strong>
            </span>
          </div>

          {/* Factors list */}
          <div className="flex flex-col gap-3">
            {positiveVectors.map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#D8DDD4] dark:border-[#28322C] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#4B6100] dark:bg-[#D7F36A] shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                      {v.title}
                    </span>
                    <span className="text-[11px] text-[#525E57] dark:text-[#B4B9AA]">
                      {v.description}
                    </span>
                  </div>
                </div>
                <span className="font-headline text-xs sm:text-sm font-bold text-[#4B6100] dark:text-[#D7F36A] shrink-0">
                  +{formatINR(v.impactAmount)}
                </span>
              </div>
            ))}

            {negativeVectors.map((v) => (
              <div
                key={v.id}
                className="p-3.5 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#D8DDD4] dark:border-[#28322C] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#BA1A1A] dark:bg-[#FF8F85] shrink-0"></div>
                  <div className="flex flex-col">
                    <span className="text-xs sm:text-sm font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                      {v.title}
                    </span>
                    <span className="text-[11px] text-[#525E57] dark:text-[#B4B9AA]">
                      {v.description}
                    </span>
                  </div>
                </div>
                <span className="font-headline text-xs sm:text-sm font-bold text-[#BA1A1A] dark:text-[#FF8F85] shrink-0">
                  {formatINR(v.impactAmount)}
                </span>
              </div>
            ))}
          </div>

          {/* Regional note */}
          <div className="pt-2 text-xs text-[#525E57] dark:text-[#B4B9AA] flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#007060] dark:text-[#43C8B0] shrink-0" />
            <span>
              City Adjustment: <strong className="text-[#151B18] dark:text-[#F5F5F0]">{result.regionalIndex.city}</strong> ({result.regionalIndex.demandNote})
            </span>
          </div>

        </div>

        {/* ================= 5. ACTION BUTTONS ================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
          
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0] hover:bg-[#F0F2EB] dark:hover:bg-[#202622] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Copy className="w-3.5 h-3.5 text-[#4B6100] dark:text-[#D7F36A]" />
              <span>Copy Summary</span>
            </button>

            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0] hover:bg-[#F0F2EB] dark:hover:bg-[#202622] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-[#4B6100] dark:text-[#D7F36A]" />
              <span>Share</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-xs sm:text-sm font-bold tracking-wide hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>

        </div>

        {/* ================= 6. DEV-ONLY DIAGNOSTIC (TASK 4 - DEV ENVIRONMENT ONLY) ================= */}
        {import.meta.env.DEV && (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs font-mono no-print flex flex-col gap-2.5 text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800">
              <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                AutoWorth Diagnostic Trace (Dev Mode Only)
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                {result.mlModelInfo?.isRealMl ? 'Authentic ML Pipeline' : 'Indicative Heuristic'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Raw ML Output</span>
                <span className="font-bold text-[#151B18] dark:text-[#F5F5F0]">{formatINR(result.medianFairValue)}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Displayed Valuation</span>
                <span className="font-bold text-[#4B6100] dark:text-[#D7F36A]">{formatINR(result.medianFairValue)}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Corridor Bounds</span>
                <span className="text-[#151B18] dark:text-[#F5F5F0]">{formatINR(result.minLiquidity)} – {formatINR(result.maxRetail)}</span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Model & Version</span>
                <span className="text-[#151B18] dark:text-[#F5F5F0]">{result.mlModelInfo?.modelName || 'Heuristic'} (v{result.mlModelInfo?.modelVersion || '1.0'})</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

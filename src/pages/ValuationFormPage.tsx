import React, { useState } from 'react';
import { 
  Car, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  Info,
  Calendar,
  Check,
  Fuel,
  SlidersHorizontal,
  AlertCircle
} from 'lucide-react';
import { 
  ConditionGrade, 
  FuelType, 
  OwnershipType, 
  TransmissionType, 
  VehicleSpec, 
  ValuationResult 
} from '../types/valuation';
import { 
  INDIAN_VEHICLE_CATALOG, 
  METRO_CLUSTERS 
} from '../lib/valuationEngine';
import { predictWithMlApi } from '../lib/mlPredictionService';

interface ValuationFormPageProps {
  initialSpec?: Partial<VehicleSpec>;
  onValuationComplete: (result: ValuationResult) => void;
  onNavigate: (route: string) => void;
}

export const ValuationFormPage: React.FC<ValuationFormPageProps> = ({
  initialSpec,
  onValuationComplete,
  onNavigate,
}) => {
  // Step indicator: 1 = Vehicle Details, 2 = Usage & Location, 3 = Vehicle Condition
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [make, setMake] = useState(initialSpec?.make || 'Hyundai');
  const [model, setModel] = useState(initialSpec?.model || 'Creta');
  const [variant, setVariant] = useState(initialSpec?.variant || 'SX (O) 1.5 CRDi AT');
  const [year, setYear] = useState(initialSpec?.year || 2021);
  const [rtoCode, setRtoCode] = useState(initialSpec?.rtoCode || 'MH-12 Pune');
  const [rtoCity, setRtoCity] = useState(initialSpec?.rtoCity || 'pune');
  const [kilometers, setKilometers] = useState(initialSpec?.kilometers || 38000);
  const [fuelType, setFuelType] = useState<FuelType>(initialSpec?.fuelType || 'Diesel');
  const [transmission, setTransmission] = useState<TransmissionType>(initialSpec?.transmission || 'Automatic');
  const [ownership, setOwnership] = useState<OwnershipType>(initialSpec?.ownership || '1st Owner');
  const [condition, setCondition] = useState<ConditionGrade>(initialSpec?.condition || 'Excellent');
  
  // Clean condition flags
  const [hasCleanServiceHistory, setHasCleanServiceHistory] = useState(initialSpec?.hasCleanServiceHistory ?? true);
  const [hasFactoryWarranty, setHasFactoryWarranty] = useState(initialSpec?.hasFactoryWarranty ?? false);
  const [hasScuffsOrDents, setHasScuffsOrDents] = useState(initialSpec?.hasScuffsOrDents ?? false);
  const [hasHighNCB, setHasHighNCB] = useState(initialSpec?.hasHighNCB ?? true);

  // UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Vehicle catalog dynamic mapping
  const currentMakeObj = INDIAN_VEHICLE_CATALOG.find((m) => m.make === make) || INDIAN_VEHICLE_CATALOG[0];
  const availableModels = currentMakeObj.models;
  const currentModelObj = availableModels.find((m) => m.name === model) || availableModels[0];
  const availableVariants = currentModelObj.variants;

  const handleMakeSelect = (newMake: string) => {
    setMake(newMake);
    const mObj = INDIAN_VEHICLE_CATALOG.find((m) => m.make === newMake);
    if (mObj && mObj.models.length > 0) {
      const firstMod = mObj.models[0];
      setModel(firstMod.name);
      if (firstMod.variants.length > 0) {
        setVariant(firstMod.variants[0].name);
        setFuelType(firstMod.variants[0].defaultFuel);
        setTransmission(firstMod.variants[0].defaultTransmission);
      }
    }
  };

  const handleModelSelect = (newModel: string) => {
    setModel(newModel);
    const modObj = availableModels.find((m) => m.name === newModel);
    if (modObj && modObj.variants.length > 0) {
      setVariant(modObj.variants[0].name);
      setFuelType(modObj.variants[0].defaultFuel);
      setTransmission(modObj.variants[0].defaultTransmission);
    }
  };

  const handleVariantSelect = (newVariant: string) => {
    setVariant(newVariant);
    const vObj = availableVariants.find((v) => v.name === newVariant);
    if (vObj) {
      setFuelType(vObj.defaultFuel);
      setTransmission(vObj.defaultTransmission);
    }
  };

  const handleCitySelect = (cityId: string) => {
    setRtoCity(cityId);
    const cluster = METRO_CLUSTERS.find((c) => c.id === cityId);
    if (cluster) {
      const prefix = cluster.rtoPrefixes[0] || 'MH-12';
      setRtoCode(`${prefix} ${cluster.name.split(' ')[0]}`);
    }
  };

  // Step Validations
  const validateStep1 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!make) errs.make = 'Please select a car brand.';
    if (!model) errs.model = 'Please select a model.';
    if (!variant) errs.variant = 'Please select a variant.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errs: Record<string, string> = {};
    if (kilometers < 1000 || kilometers > 300000) {
      errs.kilometers = 'Please enter a realistic mileage between 1,000 and 3,00,000 km.';
    }
    if (!rtoCity) {
      errs.rtoCity = 'Please select your registration city.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (validateStep1()) setCurrentStep(2);
    } else if (currentStep === 2) {
      if (validateStep2()) setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    setErrors({});
    if (currentStep === 3) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep1() || !validateStep2()) {
      return;
    }

    setIsCalculating(true);
    setApiError(null);

    const vehicleSpec: VehicleSpec = {
      make,
      model,
      variant,
      year,
      rtoCode,
      rtoCity,
      kilometers,
      fuelType,
      transmission,
      ownership,
      condition,
      hasFactoryWarranty,
      hasCleanServiceHistory,
      hasScuffsOrDents,
      hasHighNCB,
    };

    try {
      const result = await predictWithMlApi(vehicleSpec);
      setIsCalculating(false);
      onValuationComplete(result);
      onNavigate('valuation-results');
    } catch (err: any) {
      setIsCalculating(false);
      setApiError(err?.message || 'The ML prediction service is currently unreachable.');
    }
  };

  const oemBrands = ['Hyundai', 'Tata', 'Maruti Suzuki', 'Mahindra', 'Honda', 'Kia', 'Toyota'];
  const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013];
  const fuels: FuelType[] = ['Petrol', 'Diesel', 'CNG', 'EV', 'Hybrid'];
  const transmissions: TransmissionType[] = ['Manual', 'Automatic'];
  const ownerships: OwnershipType[] = ['1st Owner', '2nd Owner', '3rd+ Owner'];

  return (
    <div className="flex flex-col w-full py-8 sm:py-12">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 flex flex-col gap-8">
        
        {/* Simple Page Header */}
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-[#151B18] dark:text-[#F5F5F0]">
            Estimate Your Car's Resale Value
          </h1>
          <p className="text-sm text-[#525E57] dark:text-[#B4B9AA]">
            Fill in your vehicle details to get a free, realistic price range based on current Indian market trends.
          </p>
        </div>

        {/* Clean 3-Step Indicator */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 p-2 rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] shadow-xs">
          
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`flex items-center justify-center sm:justify-start gap-2.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentStep === 1
                ? 'bg-[#F0F2EB] dark:bg-[#202622] text-[#4B6100] dark:text-[#D7F36A]'
                : currentStep > 1
                ? 'text-[#007060] dark:text-[#43C8B0]'
                : 'text-[#727F78] dark:text-[#79867F]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 1
                ? 'bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00]'
                : currentStep > 1
                ? 'bg-[#007060] dark:bg-[#43C8B0] text-white dark:text-[#161D00]'
                : 'bg-[#D8DDD4] dark:bg-[#28322C] text-[#525E57] dark:text-[#B4B9AA]'
            }`}>
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">1. Car Details</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (validateStep1()) setCurrentStep(2);
            }}
            className={`flex items-center justify-center sm:justify-start gap-2.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentStep === 2
                ? 'bg-[#F0F2EB] dark:bg-[#202622] text-[#4B6100] dark:text-[#D7F36A]'
                : currentStep > 2
                ? 'text-[#007060] dark:text-[#43C8B0]'
                : 'text-[#727F78] dark:text-[#79867F]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 2
                ? 'bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00]'
                : currentStep > 2
                ? 'bg-[#007060] dark:bg-[#43C8B0] text-white dark:text-[#161D00]'
                : 'bg-[#D8DDD4] dark:bg-[#28322C] text-[#525E57] dark:text-[#B4B9AA]'
            }`}>
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="hidden sm:inline">2. Usage & Location</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (validateStep1() && validateStep2()) setCurrentStep(3);
            }}
            className={`flex items-center justify-center sm:justify-start gap-2.5 py-2.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              currentStep === 3
                ? 'bg-[#F0F2EB] dark:bg-[#202622] text-[#4B6100] dark:text-[#D7F36A]'
                : 'text-[#727F78] dark:text-[#79867F]'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
              currentStep === 3
                ? 'bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00]'
                : 'bg-[#D8DDD4] dark:bg-[#28322C] text-[#525E57] dark:text-[#B4B9AA]'
            }`}>
              3
            </span>
            <span className="hidden sm:inline">3. Condition</span>
          </button>

        </div>

        {/* Guided Form Card */}
        <div className="bg-white dark:bg-[#1B211E] rounded-2xl p-6 sm:p-8 border border-[#D8DDD4] dark:border-[#28322C] shadow-xl flex flex-col gap-6">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* ================= STEP 1: VEHICLE DETAILS ================= */}
            {currentStep === 1 && (
              <div className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-1 pb-3 border-b border-[#D8DDD4] dark:border-[#28322C]">
                  <h2 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
                    Step 1: Vehicle Details
                  </h2>
                  <p className="text-xs text-[#525E57] dark:text-[#B4B9AA]">
                    Select the exact model, manufacture year, and fuel specifications.
                  </p>
                </div>

                {/* Make & Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                      Car Brand (Make) <span className="text-[#BA1A1A] dark:text-[#FF8F85]">*</span>
                    </label>
                    <select
                      value={make}
                      onChange={(e) => handleMakeSelect(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#CCD3C8] dark:border-[#28322C] text-[#151B18] dark:text-[#F5F5F0] text-sm focus:outline-none focus:border-[#4B6100] dark:focus:border-[#D7F36A]"
                    >
                      {oemBrands.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                      Model <span className="text-[#BA1A1A] dark:text-[#FF8F85]">*</span>
                    </label>
                    <select
                      value={model}
                      onChange={(e) => handleModelSelect(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#CCD3C8] dark:border-[#28322C] text-[#151B18] dark:text-[#F5F5F0] text-sm focus:outline-none focus:border-[#4B6100] dark:focus:border-[#D7F36A]"
                    >
                      {availableModels.map((m) => (
                        <option key={m.name} value={m.name}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Year & Variant */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                      Registration Year <span className="text-[#BA1A1A] dark:text-[#FF8F85]">*</span>
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(parseInt(e.target.value, 10))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#CCD3C8] dark:border-[#28322C] text-[#151B18] dark:text-[#F5F5F0] text-sm focus:outline-none focus:border-[#4B6100] dark:focus:border-[#D7F36A]"
                    >
                      {years.map((y) => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                      Variant / Trim <span className="text-[#BA1A1A] dark:text-[#FF8F85]">*</span>
                    </label>
                    <select
                      value={variant}
                      onChange={(e) => handleVariantSelect(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#CCD3C8] dark:border-[#28322C] text-[#151B18] dark:text-[#F5F5F0] text-sm focus:outline-none focus:border-[#4B6100] dark:focus:border-[#D7F36A]"
                    >
                      {availableVariants.map((v) => (
                        <option key={v.name} value={v.name}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Fuel & Transmission */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                      Fuel Type
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
                      {fuels.slice(0, 3).map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setFuelType(f)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                            fuelType === f
                              ? 'bg-[#F0F2EB] dark:bg-[#202622] border-[#4B6100] dark:border-[#D7F36A] text-[#4B6100] dark:text-[#D7F36A]'
                              : 'bg-white dark:bg-[#202622]/40 border-[#D8DDD4] dark:border-[#28322C] text-[#525E57] dark:text-[#B4B9AA]'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                      Transmission
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {transmissions.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTransmission(t)}
                          className={`py-2 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                            transmission === t
                              ? 'bg-[#F0F2EB] dark:bg-[#202622] border-[#4B6100] dark:border-[#D7F36A] text-[#4B6100] dark:text-[#D7F36A]'
                              : 'bg-white dark:bg-[#202622]/40 border-[#D8DDD4] dark:border-[#28322C] text-[#525E57] dark:text-[#B4B9AA]'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ================= STEP 2: USAGE & LOCATION ================= */}
            {currentStep === 2 && (
              <div className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-1 pb-3 border-b border-[#D8DDD4] dark:border-[#28322C]">
                  <h2 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
                    Step 2: Usage, Ownership & City
                  </h2>
                  <p className="text-xs text-[#525E57] dark:text-[#B4B9AA]">
                    Car mileage and city registration strongly affect regional resale pricing.
                  </p>
                </div>

                {/* Kilometers Driven */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                      Kilometers Driven <span className="text-[#BA1A1A] dark:text-[#FF8F85]">*</span>
                    </label>
                    <span className="font-headline text-base font-bold text-[#4B6100] dark:text-[#D7F36A]">
                      {kilometers.toLocaleString('en-IN')} km
                    </span>
                  </div>

                  <input
                    type="range"
                    min={2000}
                    max={180000}
                    step={1000}
                    value={kilometers}
                    onChange={(e) => setKilometers(parseInt(e.target.value, 10))}
                    className="w-full accent-[#4B6100] dark:accent-[#D7F36A] cursor-pointer"
                  />

                  {/* Quick kilometer preset buttons */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[15000, 30000, 45000, 60000, 85000].map((km) => (
                      <button
                        key={km}
                        type="button"
                        onClick={() => setKilometers(km)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer ${
                          kilometers === km
                            ? 'bg-[#F0F2EB] dark:bg-[#202622] border-[#4B6100] dark:border-[#D7F36A] text-[#4B6100] dark:text-[#D7F36A] font-bold'
                            : 'border-[#D8DDD4] dark:border-[#28322C] text-[#525E57] dark:text-[#B4B9AA]'
                        }`}
                      >
                        {(km / 1000)}k km
                      </button>
                    ))}
                  </div>

                  {errors.kilometers && (
                    <span className="text-xs text-[#BA1A1A] dark:text-[#FF8F85]">{errors.kilometers}</span>
                  )}
                </div>

                {/* Number of Owners */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                    Number of Owners
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ownerships.map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setOwnership(o)}
                        className={`py-2.5 px-3 rounded-lg text-xs font-semibold border text-center transition-all cursor-pointer ${
                          ownership === o
                            ? 'bg-[#F0F2EB] dark:bg-[#202622] border-[#4B6100] dark:border-[#D7F36A] text-[#4B6100] dark:text-[#D7F36A]'
                            : 'bg-white dark:bg-[#202622]/40 border-[#D8DDD4] dark:border-[#28322C] text-[#525E57] dark:text-[#B4B9AA]'
                        }`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </div>

                {/* City & RTO Location */}
                <div className="flex flex-col gap-1.5 pt-2">
                  <label className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                    Registration City / Region <span className="text-[#BA1A1A] dark:text-[#FF8F85]">*</span>
                  </label>
                  <select
                    value={rtoCity}
                    onChange={(e) => handleCitySelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] border border-[#CCD3C8] dark:border-[#28322C] text-[#151B18] dark:text-[#F5F5F0] text-sm focus:outline-none focus:border-[#4B6100] dark:focus:border-[#D7F36A]"
                  >
                    {METRO_CLUSTERS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <span className="text-[11px] text-[#525E57] dark:text-[#B4B9AA]">
                    Selected RTO: {rtoCode}
                  </span>
                </div>

              </div>
            )}

            {/* ================= STEP 3: VEHICLE CONDITION ================= */}
            {currentStep === 3 && (
              <div className="flex flex-col gap-5">
                
                <div className="flex flex-col gap-1 pb-3 border-b border-[#D8DDD4] dark:border-[#28322C]">
                  <h2 className="font-headline text-lg font-bold text-[#151B18] dark:text-[#F5F5F0]">
                    Step 3: Vehicle Condition & Service History
                  </h2>
                  <p className="text-xs text-[#525E57] dark:text-[#B4B9AA]">
                    Accurate condition assessment ensures realistic valuation figures without surprises.
                  </p>
                </div>

                {/* Overall Condition Grade */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                    Overall Physical & Mechanical Condition
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Excellent */}
                    <div
                      onClick={() => setCondition('Excellent')}
                      className={`p-4 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition-all ${
                        condition === 'Excellent'
                          ? 'bg-[#F0F2EB] dark:bg-[#202622] border-[#4B6100] dark:border-[#D7F36A]'
                          : 'bg-white dark:bg-[#202622]/40 border-[#D8DDD4] dark:border-[#28322C]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-headline text-sm font-bold text-[#151B18] dark:text-[#F5F5F0]">
                          Excellent
                        </span>
                        {condition === 'Excellent' && (
                          <CheckCircle2 className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
                        )}
                      </div>
                      <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                        Like new. No major scratches, fresh tyres, engine runs cleanly with zero issues.
                      </p>
                    </div>

                    {/* Good */}
                    <div
                      onClick={() => setCondition('Good')}
                      className={`p-4 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition-all ${
                        condition === 'Good'
                          ? 'bg-[#F0F2EB] dark:bg-[#202622] border-[#4B6100] dark:border-[#D7F36A]'
                          : 'bg-white dark:bg-[#202622]/40 border-[#D8DDD4] dark:border-[#28322C]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-headline text-sm font-bold text-[#151B18] dark:text-[#F5F5F0]">
                          Good
                        </span>
                        {condition === 'Good' && (
                          <CheckCircle2 className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
                        )}
                      </div>
                      <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                        Normal wear and tear. Minor cosmetic blemishes, mechanically sound and fully roadworthy.
                      </p>
                    </div>

                    {/* Fair */}
                    <div
                      onClick={() => setCondition('Fair')}
                      className={`p-4 rounded-xl border flex flex-col gap-1.5 cursor-pointer transition-all ${
                        condition === 'Fair'
                          ? 'bg-[#F0F2EB] dark:bg-[#202622] border-[#4B6100] dark:border-[#D7F36A]'
                          : 'bg-white dark:bg-[#202622]/40 border-[#D8DDD4] dark:border-[#28322C]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-headline text-sm font-bold text-[#151B18] dark:text-[#F5F5F0]">
                          Fair
                        </span>
                        {condition === 'Fair' && (
                          <CheckCircle2 className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
                        )}
                      </div>
                      <p className="text-xs text-[#525E57] dark:text-[#B4B9AA] leading-relaxed">
                        Visible body scratches or dents. Needs upcoming service, brake pad replacement, or tyre change.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Additional practical checkboxes */}
                <div className="flex flex-col gap-3 pt-2">
                  <span className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                    Documentation & Service History
                  </span>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F0F2EB] dark:bg-[#202622]/40 border border-[#D8DDD4] dark:border-[#28322C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasCleanServiceHistory}
                      onChange={(e) => setHasCleanServiceHistory(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#4B6100] dark:accent-[#D7F36A]"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                        Authorized Service Center Records
                      </span>
                      <span className="text-[11px] text-[#525E57] dark:text-[#B4B9AA]">
                        Full periodic maintenance recorded at official brand service centers (+value bonus)
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F0F2EB] dark:bg-[#202622]/40 border border-[#D8DDD4] dark:border-[#28322C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasFactoryWarranty}
                      onChange={(e) => setHasFactoryWarranty(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#4B6100] dark:accent-[#D7F36A]"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                        Active Factory or Extended Warranty
                      </span>
                      <span className="text-[11px] text-[#525E57] dark:text-[#B4B9AA]">
                        Vehicle remains covered under manufacturer warranty
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 rounded-xl bg-[#F0F2EB] dark:bg-[#202622]/40 border border-[#D8DDD4] dark:border-[#28322C] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasHighNCB}
                      onChange={(e) => setHasHighNCB(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#4B6100] dark:accent-[#D7F36A]"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-[#151B18] dark:text-[#F5F5F0]">
                        Zero Claim History (No Insurance Claims)
                      </span>
                      <span className="text-[11px] text-[#525E57] dark:text-[#B4B9AA]">
                        High No-Claim Bonus (NCB), verifies accident-free ownership
                      </span>
                    </div>
                  </label>
                </div>

              </div>
            )}

            {/* Error Banner when API or validation fails */}
            {apiError && (
              <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs sm:text-sm flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1">
                  <span className="font-semibold">Prediction Service Error</span>
                  <span className="leading-relaxed">{apiError}</span>
                  <span className="text-[11px] text-red-600/80 dark:text-red-400/80 pt-1">
                    Please ensure the Python backend is running locally on port 8000.
                  </span>
                </div>
              </div>
            )}

            {/* Navigation & Submit Action Row */}
            <div className="flex items-center justify-between pt-4 border-t border-[#D8DDD4] dark:border-[#28322C]">
              
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-4 py-2.5 rounded-xl bg-[#F0F2EB] dark:bg-[#202622] text-[#151B18] dark:text-[#F5F5F0] border border-[#CCD3C8] dark:border-[#28322C] text-xs sm:text-sm font-semibold hover:bg-[#EAECE4] dark:hover:bg-[#28322C] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm text-[#525E57] dark:text-[#B4B9AA] hover:text-[#151B18] dark:hover:text-[#F5F5F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2.5 rounded-xl bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-xs sm:text-sm font-bold tracking-wide hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ml-auto"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isCalculating}
                  className="px-6 py-3 rounded-xl bg-[#4B6100] dark:bg-[#D7F36A] text-white dark:text-[#161D00] font-headline text-sm font-bold tracking-wide hover:opacity-95 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-md ml-auto disabled:opacity-60"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Calculating Value...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Estimated Value</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

            </div>

          </form>

        </div>

        {/* Clean Car Summary Badge */}
        <div className="p-4 rounded-xl bg-white dark:bg-[#1B211E] border border-[#D8DDD4] dark:border-[#28322C] flex flex-wrap items-center justify-between gap-3 text-xs text-[#525E57] dark:text-[#B4B9AA] shadow-xs">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-[#4B6100] dark:text-[#D7F36A]" />
            <span className="font-semibold text-[#151B18] dark:text-[#F5F5F0]">
              {year} {make} {model} {variant}
            </span>
            <span>•</span>
            <span>{kilometers.toLocaleString('en-IN')} km</span>
            <span>•</span>
            <span>{rtoCode}</span>
          </div>
          <span className="text-[11px] text-[#007060] dark:text-[#43C8B0] font-semibold">
            Live estimate preview
          </span>
        </div>

      </div>
    </div>
  );
};

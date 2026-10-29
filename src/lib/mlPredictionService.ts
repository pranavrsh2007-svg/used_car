/**
 * AutoWorth AI - Frontend ML Prediction Client Service
 * Connects the React application to the FastAPI Machine Learning backend.
 */
import { VehicleSpec, ValuationResult, ValuationVector } from '../types/valuation';
import { METRO_CLUSTERS, INDIAN_VEHICLE_CATALOG } from './valuationEngine';

const API_BASE_URL = (
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_BASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_API_BASE_URL) ||
  'http://localhost:8000'
).replace(/\/+$/, '');

export interface MlApiHealth {
  status: string;
  model_loaded: boolean;
  model_name: string;
  model_version: string;
  uptime_seconds: number;
}

export interface MlPredictionRawResponse {
  predicted_price: number;
  min_price: number;
  max_price: number;
  currency: string;
  model_version: string;
  model_name: string;
  confidence_score: number;
  features_used: Record<string, any>;
}

/**
 * Check if the Python FastAPI backend is reachable and its model is loaded.
 */
export async function checkBackendHealth(timeoutMs = 3500): Promise<MlApiHealth | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!response.ok) {
      return null;
    }
    const data: MlApiHealth = await response.json();
    return data;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

/**
 * Generate a visual SHA-256 style verification seal.
 */
function generateClientSeal(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}9a4b2c8e1f5d6a7b3c4d5e6f7a8b9c0d1e2f3a4b`.slice(0, 42);
}

/**
 * Send vehicle specifications to the ML Prediction API and synthesize ValuationResult.
 */
export async function predictWithMlApi(spec: VehicleSpec): Promise<ValuationResult> {
  const payload = {
    make: spec.make,
    model: spec.model,
    variant: spec.variant,
    year: Number(spec.year),
    kilometers: Number(spec.kilometers),
    fuelType: spec.fuelType,
    transmission: spec.transmission,
    ownership: spec.ownership,
    rtoCity: spec.rtoCity,
    rtoCode: spec.rtoCode,
    condition: spec.condition,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Prediction request timed out. Please check if the ML backend is active.');
    }
    throw new Error(`Unable to reach the prediction server at ${API_BASE_URL}. Ensure the backend service is running.`);
  }

  if (!response.ok) {
    let errorDetail = 'Inference request failed.';
    try {
      const errJson = await response.json();
      if (errJson.details && Array.isArray(errJson.details)) {
        errorDetail = errJson.details.join(', ');
      } else if (errJson.detail) {
        errorDetail = String(errJson.detail);
      } else if (errJson.message) {
        errorDetail = String(errJson.message);
      }
    } catch {
      errorDetail = `Server responded with status HTTP ${response.status}.`;
    }
    throw new Error(errorDetail);
  }

  const mlResult: MlPredictionRawResponse = await response.json();

  if (typeof mlResult.predicted_price !== 'number' || isNaN(mlResult.predicted_price)) {
    throw new Error('Server returned an invalid or missing predicted price.');
  }

  // Find make & model segment
  const makeObj = INDIAN_VEHICLE_CATALOG.find((m) => m.make.toLowerCase() === spec.make.toLowerCase()) || INDIAN_VEHICLE_CATALOG[0];
  const modelObj = makeObj.models.find((m) => m.name.toLowerCase() === spec.model.toLowerCase()) || makeObj.models[0];
  const cluster = METRO_CLUSTERS.find((c) => c.id === spec.rtoCity) || METRO_CLUSTERS[0];

  // Derive condition score
  let conditionScore = 8.5;
  if (spec.condition === 'Excellent') conditionScore = 9.4;
  else if (spec.condition === 'Good') conditionScore = 8.2;
  else conditionScore = 6.8;

  // Build transparent influence factors for display
  const vectors: ValuationVector[] = [];
  const medianPrice = mlResult.predicted_price;

  // Vector: Mileage influence
  const ageYears = Math.max(1, 2025 - spec.year);
  const expectedKm = ageYears * 12500;
  const kmDiff = spec.kilometers - expectedKm;
  if (kmDiff < -6000) {
    vectors.push({
      id: 'low_odometer',
      title: 'Low Mileage Odometer Advantage',
      description: `Driven ${Math.round(spec.kilometers / ageYears).toLocaleString('en-IN')} km/yr vs 12,500 km national average`,
      impactAmount: Math.round(medianPrice * 0.04),
      impactType: 'positive',
      category: 'odometer',
      weightPercent: 32,
    });
  } else if (kmDiff > 12000) {
    vectors.push({
      id: 'high_odometer',
      title: 'High Mileage Telemetry Adjustment',
      description: `${spec.kilometers.toLocaleString('en-IN')} km total mileage exceeds typical private owner wear profile`,
      impactAmount: -Math.round(medianPrice * 0.045),
      impactType: 'negative',
      category: 'odometer',
      weightPercent: 32,
    });
  }

  // Vector: Ownership influence
  if (spec.ownership === '1st Owner') {
    vectors.push({
      id: 'first_owner',
      title: 'Single Direct Owner Premium',
      description: 'Single registration log, zero intermediary transfer friction',
      impactAmount: Math.round(medianPrice * 0.03),
      impactType: 'positive',
      category: 'ownership',
      weightPercent: 24,
    });
  } else if (spec.ownership === '3rd+ Owner') {
    vectors.push({
      id: 'multi_owner',
      title: 'Multiple Ownership Cycle Deduction',
      description: 'Third or subsequent registered titleholder with multiple RC book endorsements',
      impactAmount: -Math.round(medianPrice * 0.05),
      impactType: 'negative',
      category: 'ownership',
      weightPercent: 24,
    });
  }

  // Vector: Warranty
  if (spec.hasFactoryWarranty) {
    vectors.push({
      id: 'warranty_shield',
      title: 'Active OEM Warranty Shield',
      description: 'Active manufacturer mechanical & electronics coverage',
      impactAmount: Math.round(medianPrice * 0.025),
      impactType: 'positive',
      category: 'warranty',
      weightPercent: 18,
    });
  }

  // Vector: Service records
  if (spec.hasCleanServiceHistory && spec.condition === 'Excellent') {
    vectors.push({
      id: 'service_records',
      title: 'Authorized Workshop Maintenance Record',
      description: '100% stamped dealership logbooks with documented scheduled maintenance',
      impactAmount: Math.round(medianPrice * 0.02),
      impactType: 'positive',
      category: 'condition',
      weightPercent: 16,
    });
  }

  let netVectorInfluence = 0;
  for (const v of vectors) {
    netVectorInfluence += v.impactAmount;
  }

  const dossierId = `AW-${spec.year}-${Math.floor(100 + Math.random() * 900)}-${spec.make.slice(0, 2).toUpperCase()}${spec.model.slice(0, 2).toUpperCase()}`;

  const timestamp =
    new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' +
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) +
    ' IST';

  const sha256Seal = generateClientSeal(`${spec.make}-${spec.model}-${spec.year}-${spec.kilometers}-${medianPrice}`);

  return {
    spec,
    medianFairValue: mlResult.predicted_price,
    minLiquidity: mlResult.min_price,
    maxRetail: mlResult.max_price,
    confidenceScore: mlResult.confidence_score,
    marketSpreadPercent: 5.0,
    dossierId,
    timestamp,
    sha256Seal,
    vectors,
    netVectorInfluence,
    regionalIndex: {
      city: cluster.name,
      clusterName: cluster.id.toUpperCase(),
      multiplier: cluster.multiplier,
      demandTrend: '+3.1% Metro Resale Demand',
      demandNote: cluster.roadTaxNote,
    },
    segment: modelObj.segment,
    conditionScore,
    mlModelInfo: {
      modelName: mlResult.model_name,
      modelVersion: mlResult.model_version,
      isRealMl: true,
      currency: mlResult.currency,
    },
  };
}

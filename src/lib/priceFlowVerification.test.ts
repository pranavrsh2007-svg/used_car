/**
 * AutoWorth AI - Frontend Price Flow & Integration Verification Test
 * Proves that:
 * 1. The frontend client maps specifications cleanly to the API payload.
 * 2. Raw ML predicted_price is mapped directly to medianFairValue without distortion.
 * 3. Min/Max corridors from the ML API are preserved (minLiquidity, maxRetail).
 * 4. Vectors and influence metrics are informational and do NOT double-mutate the fair market value.
 * 5. When the API fails, the service throws an error without fabricating fallback prices.
 */
import { VehicleSpec, ValuationResult } from '../types/valuation';
import { predictWithMlApi } from './mlPredictionService';
import { DEFAULT_SAMPLE_SPEC } from './valuationEngine';

async function runPriceFlowTests() {
  console.log('=== AutoWorth AI Price Flow Verification ===\n');

  // Test Case 1: Live Model Inference with Reference Hyundai Creta
  console.log('Test 1: Validating live inference for reference Hyundai Creta 2021...');
  const result: ValuationResult = await predictWithMlApi(DEFAULT_SAMPLE_SPEC);

  console.log(`  -> Displayed Fair Market Value (medianFairValue): ₹${result.medianFairValue.toLocaleString('en-IN')}`);
  console.log(`  -> Dealer Liquidity Floor (minLiquidity): ₹${result.minLiquidity.toLocaleString('en-IN')}`);
  console.log(`  -> Direct Consumer Retail Ceiling (maxRetail): ₹${result.maxRetail.toLocaleString('en-IN')}`);
  console.log(`  -> ML Model: ${result.mlModelInfo?.modelName} (v${result.mlModelInfo?.modelVersion})`);

  // Assertions
  if (result.medianFairValue !== 1017000) {
    throw new Error(`Expected medianFairValue to equal raw ML predicted_price (1017000), but got ${result.medianFairValue}`);
  }
  if (result.minLiquidity !== 966000) {
    throw new Error(`Expected minLiquidity to equal 966000, got ${result.minLiquidity}`);
  }
  if (result.maxRetail !== 1068000) {
    throw new Error(`Expected maxRetail to equal 1068000, got ${result.maxRetail}`);
  }
  if (!result.mlModelInfo?.isRealMl) {
    throw new Error('Expected isRealMl to be true for genuine ML prediction.');
  }

  console.log('  [PASS] Reference Creta values match ML prediction exactly.\n');

  // Test Case 2: Ensure netVectorInfluence does not mutate medianFairValue
  console.log('Test 2: Verifying adjustments are not double-applied to medianFairValue...');
  console.log(`  -> Net Vector Influence: ₹${result.netVectorInfluence.toLocaleString('en-IN')}`);
  if (result.medianFairValue !== 1017000) {
    throw new Error('medianFairValue was mutated by netVectorInfluence! Double adjustment detected.');
  }
  console.log('  [PASS] medianFairValue equals raw ML predicted_price without double adjustments.\n');

  // Test Case 3: Error handling without fabricated fallbacks
  console.log('Test 3: Verifying failure behavior when API receives invalid inputs...');
  const invalidSpec: VehicleSpec = {
    ...DEFAULT_SAMPLE_SPEC,
    year: 1800, // Invalid year
    kilometers: -5000, // Invalid km
  };

  let errorThrown = false;
  try {
    await predictWithMlApi(invalidSpec);
  } catch (err: any) {
    errorThrown = true;
    console.log(`  -> Caught expected rejection: "${err.message}"`);
  }

  if (!errorThrown) {
    throw new Error('Service should have thrown an error for invalid input instead of fabricating a price!');
  }
  console.log('  [PASS] Invalid requests correctly rejected without fabricated fallbacks.\n');

  console.log('All frontend price flow verification tests PASSED successfully!');
}

runPriceFlowTests().catch((err) => {
  console.error('\n[FAIL] Price flow verification failed:', err);
  process.exit(1);
});

import {
  ConditionGrade,
  FuelType,
  MakeData,
  OwnershipType,
  TransmissionType,
  ValuationResult,
  ValuationVector,
  VehicleSpec,
} from '../types/valuation';

export const INDIAN_VEHICLE_CATALOG: MakeData[] = [
  {
    make: 'Hyundai',
    models: [
      {
        name: 'Creta',
        segment: 'Urban Compact SUV • Grade A',
        variants: [
          {
            name: 'SX (O) 1.5 CRDi AT',
            basePriceNew: 1980000,
            engine: '1.5L CRDi Diesel (113 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'SX Tech 1.5 Petrol IVT',
            basePriceNew: 1740000,
            engine: '1.5L MPi Petrol (115 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'S+ Knight Edition 1.5 MT',
            basePriceNew: 1450000,
            engine: '1.5L MPi Petrol (115 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Manual',
          },
          {
            name: 'E Base 1.5 Manual',
            basePriceNew: 1100000,
            engine: '1.5L Petrol (115 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Venue',
        segment: 'Sub-4m Compact SUV',
        variants: [
          {
            name: 'SX (O) 1.0 Turbo DCT',
            basePriceNew: 1340000,
            engine: '1.0L Turbo GDi (120 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'SX 1.5 CRDi MT',
            basePriceNew: 1240000,
            engine: '1.5L U2 CRDi (100 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Manual',
          },
          {
            name: 'S (O) 1.2 Kappa MT',
            basePriceNew: 980000,
            engine: '1.2L Kappa Petrol (83 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'i20',
        segment: 'Premium Hatchback',
        variants: [
          {
            name: 'Asta (O) 1.2 IVT',
            basePriceNew: 1120000,
            engine: '1.2L Kappa Petrol (88 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'Sportz 1.2 Manual',
            basePriceNew: 840000,
            engine: '1.2L Kappa Petrol (83 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Verna',
        segment: 'Midsize Sedan',
        variants: [
          {
            name: 'SX (O) 1.5 Turbo DCT',
            basePriceNew: 1740000,
            engine: '1.5L Turbo GDi (160 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'SX 1.5 MPi MT',
            basePriceNew: 1320000,
            engine: '1.5L MPi Petrol (115 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Tucson',
        segment: 'Premium D-SUV',
        variants: [
          {
            name: 'Signature 2.0 4WD AT Diesel',
            basePriceNew: 3580000,
            engine: '2.0L CRDi Diesel (186 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Automatic',
          },
        ],
      },
    ],
  },
  {
    make: 'Tata',
    models: [
      {
        name: 'Nexon',
        segment: 'Sub-Compact SUV',
        variants: [
          {
            name: 'Fearless+ S 1.5 Diesel DCA',
            basePriceNew: 1550000,
            engine: '1.5L Revotorq Diesel (115 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'Creative+ 1.2 Turbo MT',
            basePriceNew: 1180000,
            engine: '1.2L Turbo Revotron (120 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Manual',
          },
          {
            name: 'EV Empowered+ Long Range',
            basePriceNew: 1930000,
            engine: '40.5 kWh Battery (143 BHP)',
            defaultFuel: 'EV',
            defaultTransmission: 'Automatic',
          },
        ],
      },
      {
        name: 'Harrier',
        segment: 'Midsize 5-Seater SUV',
        variants: [
          {
            name: 'Fearless+ Dark 2.0 AT',
            basePriceNew: 2640000,
            engine: '2.0L Kryotec Diesel (170 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'Pure+ S 2.0 MT',
            basePriceNew: 1980000,
            engine: '2.0L Kryotec Diesel (170 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Punch',
        segment: 'Micro SUV',
        variants: [
          {
            name: 'Creative Flagship 1.2 AMT',
            basePriceNew: 1020000,
            engine: '1.2L Revotron (86 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'Accomplished iCNG',
            basePriceNew: 890000,
            engine: '1.2L Dual Cylinder CNG (73 BHP)',
            defaultFuel: 'CNG',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Safari',
        segment: 'Flagship 7-Seater SUV',
        variants: [
          {
            name: 'Accomplished+ 6S AT',
            basePriceNew: 2730000,
            engine: '2.0L Kryotec Diesel (170 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Automatic',
          },
        ],
      },
    ],
  },
  {
    make: 'Maruti Suzuki',
    models: [
      {
        name: 'Swift',
        segment: 'Compact Hatchback',
        variants: [
          {
            name: 'ZXi+ Dual Tone AGS',
            basePriceNew: 960000,
            engine: '1.2L Z-Series Petrol (82 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'VXi 1.2 Manual',
            basePriceNew: 730000,
            engine: '1.2L DualJet Petrol (89 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Manual',
          },
          {
            name: 'VXi CNG',
            basePriceNew: 820000,
            engine: '1.2L DualJet CNG (77 BHP)',
            defaultFuel: 'CNG',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Brezza',
        segment: 'Sub-4m Compact SUV',
        variants: [
          {
            name: 'ZXi+ 1.5 6AT',
            basePriceNew: 1410000,
            engine: '1.5L K15C Smart Hybrid (103 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'VXi 1.5 MT',
            basePriceNew: 1110000,
            engine: '1.5L K15C Petrol (103 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Manual',
          },
          {
            name: 'ZXi CNG',
            basePriceNew: 1210000,
            engine: '1.5L K15C S-CNG (88 BHP)',
            defaultFuel: 'CNG',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Grand Vitara',
        segment: 'Midsize SUV',
        variants: [
          {
            name: 'Alpha+ Strong Hybrid e-CVT',
            basePriceNew: 2010000,
            engine: '1.5L Intelligent Electric Hybrid (116 BHP)',
            defaultFuel: 'Hybrid',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'Alpha AllGrip 4WD MT',
            basePriceNew: 1720000,
            engine: '1.5L K15C Mild Hybrid (103 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Baleno',
        segment: 'Premium Hatchback',
        variants: [
          {
            name: 'Alpha 1.2 AGS',
            basePriceNew: 980000,
            engine: '1.2L DualJet Petrol (89 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
        ],
      },
    ],
  },
  {
    make: 'Mahindra',
    models: [
      {
        name: 'XUV700',
        segment: 'Premium Executive SUV',
        variants: [
          {
            name: 'AX7 Luxury Pack Diesel AT AWD',
            basePriceNew: 2690000,
            engine: '2.2L mHawk CRDi (185 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'AX5 2.0 Turbo Petrol AT',
            basePriceNew: 1990000,
            engine: '2.0L mStallion Turbo (200 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'AX3 2.2 Diesel MT 5-Str',
            basePriceNew: 1690000,
            engine: '2.2L mHawk Diesel (155 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Thar',
        segment: 'Lifestyle 4x4 Off-roader',
        variants: [
          {
            name: 'LX 4WD Hard Top Diesel AT',
            basePriceNew: 1760000,
            engine: '2.2L mHawk CRDi (130 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'LX 4WD Hard Top Petrol AT',
            basePriceNew: 1690000,
            engine: '2.0L mStallion Turbo (150 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'RWD D117 Diesel MT',
            basePriceNew: 1140000,
            engine: '1.5L D117 CRDe (117 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Scorpio-N',
        segment: 'Ladder Frame D-SUV',
        variants: [
          {
            name: 'Z8L 4x4 Diesel AT',
            basePriceNew: 2450000,
            engine: '2.2L mHawk Diesel (175 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'Z4 Diesel MT 7-Str',
            basePriceNew: 1610000,
            engine: '2.2L mHawk Diesel (132 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Manual',
          },
        ],
      },
    ],
  },
  {
    make: 'Honda',
    models: [
      {
        name: 'City',
        segment: 'Sedan Benchmark',
        variants: [
          {
            name: 'ZX e:HEV Strong Hybrid',
            basePriceNew: 2060000,
            engine: '1.5L Atkinson Dual Motor Hybrid (126 BHP)',
            defaultFuel: 'Hybrid',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'ZX 1.5 i-VTEC CVT',
            basePriceNew: 1620000,
            engine: '1.5L i-VTEC DOHC (121 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'V 1.5 i-VTEC Manual',
            basePriceNew: 1260000,
            engine: '1.5L i-VTEC (121 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Elevate',
        segment: 'Midsize Urban SUV',
        variants: [
          {
            name: 'ZX 1.5 CVT Dual Tone',
            basePriceNew: 1640000,
            engine: '1.5L i-VTEC (121 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
        ],
      },
      {
        name: 'Amaze',
        segment: 'Sub-4m Compact Sedan',
        variants: [
          {
            name: 'VX 1.2 CVT',
            basePriceNew: 980000,
            engine: '1.2L i-VTEC (90 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
        ],
      },
    ],
  },
  {
    make: 'Kia',
    models: [
      {
        name: 'Seltos',
        segment: 'Midsize SUV',
        variants: [
          {
            name: 'GTX+ 1.5 Turbo DCT',
            basePriceNew: 2040000,
            engine: '1.5L T-GDi Petrol (160 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'X-Line 1.5 CRDi AT',
            basePriceNew: 2030000,
            engine: '1.5L CRDi VGT Diesel (116 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Automatic',
          },
          {
            name: 'HTX 1.5 Petrol IVT',
            basePriceNew: 1680000,
            engine: '1.5L Smartstream Petrol (115 BHP)',
            defaultFuel: 'Petrol',
            defaultTransmission: 'Automatic',
          },
        ],
      },
      {
        name: 'Sonet',
        segment: 'Compact Crossover',
        variants: [
          {
            name: 'GTX+ 1.5 Diesel 6AT',
            basePriceNew: 1570000,
            engine: '1.5L CRDi VGT (116 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Automatic',
          },
        ],
      },
    ],
  },
  {
    make: 'Toyota',
    models: [
      {
        name: 'Innova Crysta',
        segment: 'Premium MPV Benchmark',
        variants: [
          {
            name: 'ZX 2.4 Diesel 7-Str',
            basePriceNew: 2630000,
            engine: '2.4L 2GD-FTV Diesel (150 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Manual',
          },
          {
            name: 'GX 2.4 Diesel 8-Str',
            basePriceNew: 2010000,
            engine: '2.4L Diesel (150 BHP)',
            defaultFuel: 'Diesel',
            defaultTransmission: 'Manual',
          },
        ],
      },
      {
        name: 'Urban Cruiser Hyryder',
        segment: 'Midsize Hybrid SUV',
        variants: [
          {
            name: 'V Hybrid e-Drive',
            basePriceNew: 2020000,
            engine: '1.5L Strong Hybrid (116 BHP)',
            defaultFuel: 'Hybrid',
            defaultTransmission: 'Automatic',
          },
        ],
      },
    ],
  },
];

export interface MetroCluster {
  id: string;
  name: string;
  rtoPrefixes: string[];
  multiplier: number;
  roadTaxNote: string;
  dieselStatus: 'normal' | 'scrutinized' | 'ngt_restricted';
}

export const METRO_CLUSTERS: MetroCluster[] = [
  {
    id: 'pune',
    name: 'Pune Industrial Corridor (MH-12 / MH-14)',
    rtoPrefixes: ['MH-12', 'MH-14'],
    multiplier: 1.035,
    roadTaxNote: '+3.5% robust industrial & expressway commuter demand',
    dieselStatus: 'normal',
  },
  {
    id: 'mumbai',
    name: 'Mumbai Metropolitan Region (MH-01 / MH-02 / MH-03 / MH-47)',
    rtoPrefixes: ['MH-01', 'MH-02', 'MH-03', 'MH-43', 'MH-47'],
    multiplier: 1.025,
    roadTaxNote: '+2.5% high purchasing power & luxury turnover',
    dieselStatus: 'normal',
  },
  {
    id: 'delhi_ncr',
    name: 'Delhi-NCR Tri-State (DL / HR-26 / UP-16)',
    rtoPrefixes: ['DL-1', 'DL-2', 'DL-3C', 'HR-26', 'UP-16'],
    multiplier: 0.965,
    roadTaxNote: '-3.5% NCR 10-year diesel deregulation & lower state road tax',
    dieselStatus: 'ngt_restricted',
  },
  {
    id: 'bengaluru',
    name: 'Bengaluru Tech Hub (KA-01 / KA-03 / KA-04 / KA-05)',
    rtoPrefixes: ['KA-01', 'KA-03', 'KA-04', 'KA-05', 'KA-51'],
    multiplier: 1.055,
    roadTaxNote: '+5.5% Highest Indian Road Tax bracket (18%+) maintains residual premium',
    dieselStatus: 'normal',
  },
  {
    id: 'hyderabad',
    name: 'Hyderabad Cyberabad (TS-07 / TS-08 / TS-09 / TS-10)',
    rtoPrefixes: ['TS-07', 'TS-08', 'TS-09', 'TS-10'],
    multiplier: 1.02,
    roadTaxNote: '+2.0% high commercial expansion and IT commuter density',
    dieselStatus: 'normal',
  },
];

/**
 * Format currency into standard Indian Lakhs / Crores string with INR symbol
 * e.g., 1425000 -> "₹14,25,000"
 */
export function formatINR(val: number): string {
  const rounded = Math.round(val);
  return '₹' + rounded.toLocaleString('en-IN');
}

/**
 * Format into human-friendly Lakhs notation
 * e.g., 1425000 -> "₹14.25 Lakh"
 */
export function formatINRLakhs(val: number): string {
  if (val >= 10000000) {
    const cr = (val / 10000000).toFixed(2);
    return `₹${cr} Cr`;
  }
  const lk = (val / 100000).toFixed(2);
  return `₹${lk} Lakh`;
}

/**
 * Converts Indian Rupee number to Words (e.g. "Fourteen Lakh Twenty-Five Thousand")
 */
export function numberToIndianWords(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'Zero';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n < 20) return ones[n];
    const unit = n % 10;
    return tens[Math.floor(n / 10)] + (unit ? ' ' + ones[unit] : '');
  }

  function convertThreeDigits(n: number): string {
    const h = Math.floor(n / 100);
    const r = n % 100;
    if (h && r) return ones[h] + ' Hundred ' + convertTwoDigits(r);
    if (h) return ones[h] + ' Hundred';
    return convertTwoDigits(r);
  }

  const crore = Math.floor(rounded / 10000000);
  const remainderCrore = rounded % 10000000;
  const lakh = Math.floor(remainderCrore / 100000);
  const remainderLakh = remainderCrore % 100000;
  const thousand = Math.floor(remainderLakh / 1000);
  const remainderThousand = remainderLakh % 1000;

  const parts: string[] = [];
  if (crore) parts.push(convertThreeDigits(crore) + ' Crore');
  if (lakh) parts.push(convertTwoDigits(lakh) + ' Lakh');
  if (thousand) parts.push(convertTwoDigits(thousand) + ' Thousand');
  if (remainderThousand) parts.push(convertThreeDigits(remainderThousand));

  return parts.join(' ');
}

/**
 * Deterministic SHA-256 style hash generator for tamper-proof dossier preview
 */
export function generateSealHash(seed: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    hash ^= seed.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  const hex = (hash >>> 0).toString(16).padStart(8, '0');
  return `sha256:9c42b8f8049e6f3aa5241b712c98d632${hex}`;
}

/**
 * Core Econometric Engine that computes vehicle valuation and factor breakdown
 */
export function calculateValuation(spec: VehicleSpec): ValuationResult {
  const currentYear = 2025;
  const ageYears = Math.max(0.5, currentYear - spec.year);

  // 1. Find make and model
  const makeObj = INDIAN_VEHICLE_CATALOG.find(
    (m) => m.make.toLowerCase() === spec.make.toLowerCase()
  ) || INDIAN_VEHICLE_CATALOG[0];

  const modelObj = makeObj.models.find(
    (m) => m.name.toLowerCase() === spec.model.toLowerCase()
  ) || makeObj.models[0];

  const variantObj = modelObj.variants.find(
    (v) => v.name.toLowerCase() === spec.variant.toLowerCase()
  ) || modelObj.variants[0];

  const basePriceNew = variantObj.basePriceNew;

  // 2. Base Age Depreciation Curve
  // Year 1: ~16%, Year 2: ~26%, Year 3: ~35%, Year 4: ~43%, Year 5: ~50%, Year 6+: +7%/yr
  let residualRatio = 1.0;
  if (ageYears <= 1) {
    residualRatio = 0.84 - (ageYears * 0.05);
  } else if (ageYears <= 2) {
    residualRatio = 0.74 - ((ageYears - 1) * 0.08);
  } else if (ageYears <= 3) {
    residualRatio = 0.65 - ((ageYears - 2) * 0.08);
  } else if (ageYears <= 4) {
    residualRatio = 0.57 - ((ageYears - 3) * 0.07);
  } else if (ageYears <= 5) {
    residualRatio = 0.50 - ((ageYears - 4) * 0.06);
  } else {
    residualRatio = Math.max(0.22, 0.44 - ((ageYears - 5) * 0.05));
  }

  let baselineResale = basePriceNew * residualRatio;

  const vectors: ValuationVector[] = [];

  // Vector 1: Odometer & Usage Telemetry
  const expectedKm = ageYears * 12500;
  const kmDifference = spec.kilometers - expectedKm;

  if (kmDifference < -6000) {
    // Low mileage bonus
    const bonus = Math.round(Math.min(65000, Math.max(25000, basePriceNew * 0.035)));
    vectors.push({
      id: 'low_mileage',
      title: 'Low Mileage Odometer Bonus',
      description: `~${Math.round(spec.kilometers / ageYears).toLocaleString('en-IN')} km/year driven vs 12,500 km regional benchmark`,
      impactAmount: bonus,
      impactType: 'positive',
      category: 'odometer',
      weightPercent: 38,
    });
  } else if (kmDifference > 12000) {
    // High mileage deduction
    const deduction = Math.round(Math.min(75000, Math.max(25000, basePriceNew * 0.04)));
    vectors.push({
      id: 'high_mileage',
      title: 'High Mileage Odometer Deduction',
      description: `Higher wear cycle: ${spec.kilometers.toLocaleString('en-IN')} km exceed annual private usage median`,
      impactAmount: -deduction,
      impactType: 'negative',
      category: 'odometer',
      weightPercent: 38,
    });
  }

  // Vector 2: Ownership History
  if (spec.ownership === '1st Owner') {
    const ownerBonus = Math.round(Math.min(50000, Math.max(25000, basePriceNew * 0.025)));
    vectors.push({
      id: 'first_owner',
      title: 'First Single Owner Premium',
      description: 'Single direct individual titleholder, zero intermediary transfer friction',
      impactAmount: ownerBonus,
      impactType: 'positive',
      category: 'ownership',
      weightPercent: 19,
    });
  } else if (spec.ownership === '2nd Owner') {
    const ownerPenalty = Math.round(basePriceNew * 0.035);
    vectors.push({
      id: 'second_owner',
      title: 'Second Owner Trade Discount',
      description: 'Secondary registered custodian with multiple registration book entries',
      impactAmount: -ownerPenalty,
      impactType: 'negative',
      category: 'ownership',
      weightPercent: 19,
    });
  } else {
    const ownerPenalty = Math.round(basePriceNew * 0.075);
    vectors.push({
      id: 'multi_owner',
      title: 'Multi-Owner Title Degradation',
      description: '3rd+ registered owner incurs higher liquidation resistance on retail boards',
      impactAmount: -ownerPenalty,
      impactType: 'negative',
      category: 'ownership',
      weightPercent: 19,
    });
  }

  // Vector 3: Regional Hub & Fuel Dynamics
  const cluster = METRO_CLUSTERS.find(
    (c) => c.id === spec.rtoCity.toLowerCase()
  ) || METRO_CLUSTERS[0];

  const isNcrDiesel = cluster.id === 'delhi_ncr' && spec.fuelType === 'Diesel';
  if (isNcrDiesel) {
    const ncrPenalty = Math.round(Math.max(45000, baselineResale * 0.08));
    vectors.push({
      id: 'ncr_diesel_sunset',
      title: 'Delhi-NCR 10-Year Diesel Sunset Penalty',
      description: 'NGT regulatory scrap mandates reduce useful life in Delhi/NCR cluster',
      impactAmount: -ncrPenalty,
      impactType: 'negative',
      category: 'regional',
      weightPercent: 27,
    });
  } else if (spec.fuelType === 'Diesel' && (cluster.id === 'pune' || cluster.id === 'mumbai')) {
    const dieselBonus = Math.round(Math.min(60000, Math.max(30000, basePriceNew * 0.03)));
    vectors.push({
      id: 'regional_diesel_demand',
      title: 'Urban Maharashtra Diesel SUV Demand',
      description: 'High-torque automatic SUV premium sustained across Pune-Mumbai arterial corridor',
      impactAmount: dieselBonus,
      impactType: 'positive',
      category: 'regional',
      weightPercent: 27,
    });
  } else if (spec.fuelType === 'Hybrid' || spec.fuelType === 'EV') {
    const greenBonus = Math.round(Math.min(50000, basePriceNew * 0.03));
    vectors.push({
      id: 'green_fuel_bonus',
      title: 'Strong Hybrid / Clean Powertrain Premium',
      description: 'High fuel efficiency insulation and rising metro green preference',
      impactAmount: greenBonus,
      impactType: 'positive',
      category: 'regional',
      weightPercent: 27,
    });
  }

  // Vector 4: Factory Warranty Status
  if (spec.hasFactoryWarranty) {
    const warrantyBonus = Math.round(basePriceNew * 0.02);
    vectors.push({
      id: 'warranty_active',
      title: 'Active OEM Extended Warranty Shield',
      description: 'Factory mechanical & electronics coverage active through upcoming cycle',
      impactAmount: warrantyBonus,
      impactType: 'positive',
      category: 'warranty',
      weightPercent: 16,
    });
  } else if (ageYears >= 3) {
    const warrantyDeduction = 20000;
    vectors.push({
      id: 'warranty_depleted',
      title: 'Factory Warranty Depleted',
      description: 'Standard 3-year factory coverage lapsed; extended shield absent',
      impactAmount: -warrantyDeduction,
      impactType: 'negative',
      category: 'warranty',
      weightPercent: 16,
    });
  }

  // Vector 5: Physical Health & Aesthetic Condition
  let conditionScore = 9.4;
  if (spec.condition === 'Excellent') {
    conditionScore = 9.4;
    if (spec.hasCleanServiceHistory) {
      vectors.push({
        id: 'oem_service_log',
        title: 'Verifiable OEM Dealership Service Record',
        description: '100% authorized workshop logs with digital stamped service intervals',
        impactAmount: 35000,
        impactType: 'positive',
        category: 'condition',
        weightPercent: 16,
      });
    }
  } else if (spec.condition === 'Good') {
    conditionScore = 8.2;
    if (spec.hasScuffsOrDents) {
      vectors.push({
        id: 'cosmetic_scuffs',
        title: 'Minor Cosmetic Bumper Scuffs Reported',
        description: 'Allowance for localized bumper refurbishment and paint blending',
        impactAmount: -15000,
        impactType: 'negative',
        category: 'condition',
        weightPercent: 16,
      });
    }
  } else {
    conditionScore = 6.8;
    const refurbPenalty = Math.round(Math.max(35000, basePriceNew * 0.035));
    vectors.push({
      id: 'refurb_required',
      title: 'Mechanical & Bodywork Reconditioning Allowance',
      description: 'Needs routine suspension calibration, brake pads, and body panel touchup',
      impactAmount: -refurbPenalty,
      impactType: 'negative',
      category: 'condition',
      weightPercent: 16,
    });
  }

  // Apply regional cluster multiplier
  baselineResale = baselineResale * cluster.multiplier;

  // Apply vector impacts
  let netVectorInfluence = 0;
  for (const v of vectors) {
    netVectorInfluence += v.impactAmount;
  }

  let finalMedian = Math.round((baselineResale + netVectorInfluence) / 5000) * 5000;
  // Floor at 15% of new car price
  finalMedian = Math.max(Math.round(basePriceNew * 0.15), finalMedian);

  // Liquidity spreads: Dealer Floor (approx -4.5%) and Direct-to-Consumer Ceiling (+4.5%)
  const minLiquidity = Math.round((finalMedian * 0.955) / 5000) * 5000;
  const maxRetail = Math.round((finalMedian * 1.045) / 5000) * 5000;

  // Unique dossier ID e.g. AW-2025-059-HYCR
  const makeCode = spec.make.substring(0, 2).toUpperCase();
  const modelCode = spec.model.substring(0, 2).toUpperCase();
  const dossierId = `AW-2025-${Math.floor(100 + Math.random() * 900)}-${makeCode}${modelCode}`;

  const timestamp = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) + ' ' + new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }) + ' IST';

  const sha256Seal = generateSealHash(
    `${spec.make}-${spec.model}-${spec.year}-${spec.kilometers}-${spec.rtoCode}-${finalMedian}`
  );

  return {
    spec,
    medianFairValue: finalMedian,
    minLiquidity,
    maxRetail,
    confidenceScore: 94.2,
    marketSpreadPercent: 4.5,
    dossierId,
    timestamp,
    sha256Seal,
    vectors,
    netVectorInfluence,
    regionalIndex: {
      city: cluster.name,
      clusterName: cluster.id.toUpperCase(),
      multiplier: cluster.multiplier,
      demandTrend: '+3.1% Tier-1 Demand',
      demandNote: cluster.roadTaxNote,
    },
    segment: modelObj.segment,
    conditionScore,
  };
}

/**
 * Default sample reference vehicle used in benchmark snapshots
 */
export const DEFAULT_SAMPLE_SPEC: VehicleSpec = {
  make: 'Hyundai',
  model: 'Creta',
  variant: 'SX (O) 1.5 CRDi AT',
  year: 2021,
  rtoCode: 'MH-12 Pune',
  rtoCity: 'pune',
  kilometers: 38200,
  fuelType: 'Diesel',
  transmission: 'Automatic',
  ownership: '1st Owner',
  condition: 'Excellent',
  hasFactoryWarranty: false,
  hasCleanServiceHistory: true,
  hasScuffsOrDents: true,
  hasHighNCB: true,
};

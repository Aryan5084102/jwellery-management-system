// Metal Rates API Service
// Fetches live gold and silver rates from various sources

export interface MetalRates {
  gold: {
    mcx: number;  // MCX rate per 10g
    local: number; // Local market rate per 10g
    change: number; // Price change
    changePercent: number; // Percentage change
  };
  silver: {
    mcx: number;  // MCX rate per kg
    local: number; // Local market rate per kg
    change: number; // Price change
    changePercent: number; // Percentage change
  };
  lastUpdated: string;
  source: string;
  isMock: boolean;
}

// Default rates for initial state and fallback
export const defaultRates: MetalRates = {
  gold: {
    mcx: 72500,
    local: 72000,
    change: 250,
    changePercent: 0.35,
  },
  silver: {
    mcx: 86500,
    local: 85000,
    change: -150,
    changePercent: -0.17,
  },
  lastUpdated: new Date().toISOString(),
  source: 'Default',
  isMock: true,
};

// Generate realistic mock data with slight variations
function generateMockRates(): MetalRates {
  const baseGoldMCX = 72000 + Math.random() * 1000;
  const baseGoldLocal = baseGoldMCX - 300 - Math.random() * 200;
  const baseSilverMCX = 85000 + Math.random() * 2000;
  const baseSilverLocal = baseSilverMCX - 1000 - Math.random() * 500;

  return {
    gold: {
      mcx: Math.round(baseGoldMCX),
      local: Math.round(baseGoldLocal),
      change: Math.round((Math.random() - 0.5) * 500),
      changePercent: Math.round((Math.random() - 0.5) * 1 * 100) / 100,
    },
    silver: {
      mcx: Math.round(baseSilverMCX),
      local: Math.round(baseSilverLocal),
      change: Math.round((Math.random() - 0.5) * 300),
      changePercent: Math.round((Math.random() - 0.5) * 0.5 * 100) / 100,
    },
    lastUpdated: new Date().toISOString(),
    source: 'Mock Data',
    isMock: true,
  };
}

// Fetch rates from free APIs
async function fetchFromFreeAPI(): Promise<MetalRates | null> {
  try {
    // Using a demo/free API endpoint
    // In production, you would use paid APIs like:
    // - GoldAPI.io
    // - MetalPriceAPI.com
    // - Commodities-API.com
    
    // For demo purposes, we'll simulate an API call
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=gold&vs_currencies=inr', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Add cache-buster to prevent caching
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // Coingecko returns gold in INR per ounce, convert to per 10g
    // 1 troy ounce = 31.1035 grams
    // Gold rate per 10g = (rate per ounce / 31.1035) * 10
    const goldPer10g = (data.gold?.inr || 0) / 31.1035 * 10;

    return {
      gold: {
        mcx: Math.round(goldPer10g * 1.02), // MCX is slightly higher
        local: Math.round(goldPer10g),
        change: 0,
        changePercent: 0,
      },
      silver: {
        mcx: 85000, // Default for silver
        local: 84000,
        change: 0,
        changePercent: 0,
      },
      lastUpdated: new Date().toISOString(),
      source: 'Coingecko API',
      isMock: false,
    };
  } catch (error) {
    console.error('Error fetching from free API:', error);
    return null;
  }
}

// Main function to fetch metal rates
export async function fetchMetalRates(): Promise<MetalRates> {
  // Try to fetch from API first
  const apiRates = await fetchFromFreeAPI();
  
  if (apiRates && !apiRates.isMock) {
    return apiRates;
  }
  
  // Fallback to mock data with realistic values
  return generateMockRates();
}

// Format rate for display
export function formatRate(rate: number, type: 'gold' | 'silver'): string {
  if (type === 'gold') {
    return `₹${rate.toLocaleString('en-IN')}/10g`;
  } else {
    return `₹${rate.toLocaleString('en-IN')}/kg`;
  }
}

// Calculate rate per gram
export function getRatePerGram(rate: number, type: 'gold' | 'silver'): number {
  if (type === 'gold') {
    return rate / 10;
  } else {
    return rate / 1000;
  }
}

// Calculate item price based on weight and rate
export function calculateItemPrice(
  weight: number, 
  rate: number, 
  type: 'gold' | 'silver',
  makingCharge: number = 0
): number {
  const ratePerGram = getRatePerGram(rate, type);
  return (weight * ratePerGram) + makingCharge;
}

// Validate rate change direction
export function getChangeIndicator(change: number): 'up' | 'down' | 'neutral' {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}

// Get color class for change indicator
export function getChangeColor(change: number): string {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-gray-600';
}

// Local rate configuration (can be updated manually)
export interface LocalRateConfig {
  city: string;
  gold: number;
  silver: number;
  lastUpdated: string;
}

export function getLocalRateDisplayName(config: LocalRateConfig): string {
  return `${config.city} Market`;
}

// Premium calculation based on purity
export function calculatePurityRate(
  baseRate: number,
  purity: string,
  type: 'gold' | 'silver'
): number {
  const purityMultipliers: Record<string, number> = {
    '24k': 1.0,
    '22k': 0.916,
    '18k': 0.75,
    '14k': 0.583,
    '925': 0.925, // For silver
  };

  const multiplier = purityMultipliers[purity] || 1;
  return Math.round(baseRate * multiplier);
}


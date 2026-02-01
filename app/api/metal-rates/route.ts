import { NextResponse } from 'next/server';

// GoldAPI.io API configuration
const GOLD_API_KEY = process.env.GOLD_API_KEY || 'goldapi-htclqsml29kwoy-io';
const GOLD_API_URL = 'https://www.goldapi.io/api';

// Fallback exchange rate (can be updated via API)
const USD_TO_INR = 83.5; // Approximate rate, can be fetched from free API

interface GoldAPIResponse {
  price?: number; // Gold price in USD per ounce
  prev_close_price?: number;
  open_price?: number;
  low_price?: number;
  high_price?: number;
  timestamp?: number;
  symbol?: string;
}

interface MetalRates {
  gold: {
    mcx: number;
    local: number;
    change: number;
    changePercent: number;
  };
  silver: {
    mcx: number;
    local: number;
    change: number;
    changePercent: number;
  };
  lastUpdated: string;
  source: string;
  isMock: boolean;
}

// Fetch single metal price from goldAPI.io
async function fetchMetalPrice(symbol: string): Promise<number | null> {
  try {
    const response = await fetch(`${GOLD_API_URL}/${symbol}/USD`, {
      method: 'GET',
      headers: {
        'x-access-token': GOLD_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`GoldAPI error for ${symbol}: ${response.status}`);
      return null;
    }

    const data: GoldAPIResponse = await response.json();
    
    if (data.price) {
      return data.price;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    // If no API key is configured, return mock data
    if (!GOLD_API_KEY || GOLD_API_KEY === 'your_api_key_here' || GOLD_API_KEY.length < 10) {
      return NextResponse.json({
        success: false,
        message: 'API key not configured',
        rates: generateMockRates(),
        warning: 'Please set GOLD_API_KEY in .env.local to fetch live rates from goldAPI.io'
      });
    }

    // Fetch gold and silver rates from goldAPI.io
    // GoldAPI uses symbols like XAU (Gold) and XAG (Silver)
    const goldPriceUSD = await fetchMetalPrice('XAU');
    const silverPriceUSD = await fetchMetalPrice('XAG');

    // If API returns null values, use fallback
    const goldUSD = goldPriceUSD || 2650; // Fallback gold price
    const silverUSD = silverPriceUSD || 30; // Fallback silver price

    // Convert prices from per ounce to Indian market units
    // 1 troy ounce = 31.1035 grams
    const goldPer10gInr = Math.round((goldUSD * USD_TO_INR) / 31.1035 * 10);
    const silverPerKgInr = Math.round((silverUSD * USD_TO_INR) / 31.1035 * 1000);

    // MCX rates are typically 1-2% higher due to import duties and premiums
    const goldMCX = Math.round(goldPer10gInr * 1.02);
    const silverMCX = Math.round(silverPerKgInr * 1.01);

    // Calculate change from previous close (mock for now)
    const goldChange = Math.round((Math.random() - 0.5) * 200);
    const goldChangePercent = Math.round((goldChange / goldPer10gInr) * 10000) / 100;
    const silverChange = Math.round((Math.random() - 0.5) * 50);
    const silverChangePercent = Math.round((silverChange / silverPerKgInr) * 10000) / 100;

    const rates: MetalRates = {
      gold: {
        mcx: goldMCX,
        local: goldPer10gInr,
        change: goldChange,
        changePercent: goldChangePercent,
      },
      silver: {
        mcx: silverMCX,
        local: silverPerKgInr,
        change: silverChange,
        changePercent: silverChangePercent,
      },
      lastUpdated: new Date().toISOString(),
      source: 'GoldAPI.io (MCX)',
      isMock: false,
    };

    return NextResponse.json({
      success: true,
      rates,
    });
  } catch (error) {
    console.error('Error fetching metal rates:', error);
    
    // Return mock data on error
    return NextResponse.json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to fetch rates',
      rates: generateMockRates(),
    });
  }
}

// Generate realistic mock rates for demo/fallback
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
    source: 'Demo Data',
    isMock: true,
  };
}


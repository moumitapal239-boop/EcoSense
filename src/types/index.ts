/**
 * Types & Interfaces for EcoSense Environmental Analytics Platform
 * College CSE Project - Well-commented for student presentation
 */

export interface CityConfig {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface AirQualityReading {
  time: string[];
  pm2_5: (number | null)[];
  carbon_monoxide: (number | null)[];
  nitrogen_dioxide: (number | null)[];
  carbon_dioxide: (number | null)[];
}

export interface AirQualityResponse {
  city: CityConfig;
  readings: AirQualityReading;
  currentPM25: number | null;
  currentCO: number | null;
  currentNO2: number | null;
  currentCO2: number | null;
  lastUpdated: string;
  isCached?: boolean;
}

export interface CountryConfig {
  code: string; // ISO 3-letter (e.g. IND, BRA)
  name: string;
  continent: string;
  flag: string;
}

export interface WorldBankDataPoint {
  year: number;
  value: number; // Forest area (% of land area or sq km)
}

export interface RegressionResult {
  slope: number;          // m: annual change in forest %
  intercept: number;      // c: starting baseline
  rSquared: number;       // goodness of fit (0 to 1)
  direction: 'increasing' | 'decreasing' | 'stable';
  annualChangePct: number;// yearly rate
  forecast: { year: number; predictedValue: number }[];
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  riskDescription: string;
}

export interface CountryDeforestationData {
  country: CountryConfig;
  percentageHistory: WorldBankDataPoint[];
  sqKmHistory: WorldBankDataPoint[];
  regression: RegressionResult;
  latestYear: number;
  latestValue: number;
  baseline1990Value: number;
  netChangeSince1990: number;
  lastUpdated: string;
}

export interface SocialPost {
  id: string;
  title: string;
  url: string;
  source: 'Reddit (r/climatechange)' | 'Reddit (r/environment)' | 'Hacker News (Algolia API)';
  created_utc: number;
  author: string;
  score: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // -1 to +1
}

export interface TrendingWord {
  word: string;
  count: number;
}

export interface SentimentAnalysisResult {
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  totalPosts: number;
  averageScore: number;
  posts: SocialPost[];
  trendingWords: TrendingWord[];
  sourceUsed: string;
  lastUpdated: string;
}

export interface WikiPageviewItem {
  date: string; // formatted YYYY-MM-DD
  views: number;
}

export interface WikiPageviewsData {
  article: string;
  items: WikiPageviewItem[];
  totalViews: number;
  averageDailyViews: number;
  lastUpdated: string;
}

export interface CarbonCalculatorInput {
  electricityKWh: number; // monthly kWh
  fuelType: 'petrol' | 'diesel' | 'none';
  fuelLitres: number;     // monthly litres
  travelKm: number;       // monthly personal vehicle travel
  lpgCylinders: number;   // 14.2kg cylinders per month
}

export interface CarbonCalculatorResult {
  electricityCO2: number;
  fuelCO2: number;
  lpgCO2: number;
  totalMonthlyCO2: number;
  totalAnnualCO2: number;
  matureTreesNeeded: number; // 1 mature tree absorbs ~21 kg CO2/year
  reductionTips: string[];
}

export interface WhatIfSimulation {
  treePlantationPct: number;    // 0 to 50%
  electricityReductionPct: number; // 0 to 50%
  vehicleReductionPct: number;   // 0 to 50%
}

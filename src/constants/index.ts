/**
 * Constants & Assumptions for EcoSense Platform
 * College 2nd-Year CSE Project
 */

import { CityConfig, CountryConfig } from '../types';

// Supported cities with exact geographic coordinates for Open-Meteo
export const CITIES: CityConfig[] = [
  {
    id: 'kolkata',
    name: 'Kolkata',
    country: 'India',
    latitude: 22.5726,
    longitude: 88.3639,
    timezone: 'Asia/Kolkata',
  },
  {
    id: 'delhi',
    name: 'Delhi',
    country: 'India',
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 'Asia/Kolkata',
  },
  {
    id: 'mumbai',
    name: 'Mumbai',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
    timezone: 'Asia/Kolkata',
  },
  {
    id: 'london',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  },
  {
    id: 'beijing',
    name: 'Beijing',
    country: 'China',
    latitude: 39.9042,
    longitude: 116.4074,
    timezone: 'Asia/Shanghai',
  },
  {
    id: 'new_york',
    name: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.0060,
    timezone: 'America/New_York',
  },
];

// Target Countries for Deforestation Analysis (World Bank API)
export const COUNTRIES: CountryConfig[] = [
  { code: 'IND', name: 'India', continent: 'Asia', flag: '🇮🇳' },
  { code: 'BRA', name: 'Brazil (Amazon Basin)', continent: 'South America', flag: '🇧🇷' },
  { code: 'IDN', name: 'Indonesia', continent: 'Southeast Asia', flag: '🇮🇩' },
  { code: 'COD', name: 'Congo (DRC - Congo Basin)', continent: 'Africa', flag: '🇨🇩' },
  { code: 'CHN', name: 'China', continent: 'Asia', flag: '🇨🇳' },
  { code: 'USA', name: 'United States', continent: 'North America', flag: '🇺🇸' },
];

/**
 * World Health Organization (WHO) Global Air Quality Guidelines (2021)
 * Used to trigger automated health alerts
 */
export const WHO_LIMITS = {
  // PM2.5 24-hour mean limit: 15 µg/m³
  PM25_24H_LIMIT: 15,
  PM25_MODERATE_LIMIT: 35,
  PM25_UNHEALTHY_LIMIT: 75,
  // Carbon Monoxide 24-hour mean: 4000 µg/m³ (4 mg/m³)
  CO_24H_LIMIT: 4000,
  // Nitrogen Dioxide 24-hour mean: 25 µg/m³
  NO2_24H_LIMIT: 25,
};

/**
 * Carbon Emission Factors & Model Assumptions
 * Documented clearly for academic project transparency
 */
export const EMISSION_FACTORS = {
  // Central Electricity Authority (CEA) India average grid emission factor
  ELECTRICITY_KG_PER_KWH: 0.71,
  // IPCC standard emissions per litre of fuel combusted
  PETROL_KG_PER_LITRE: 2.31,
  // IPCC standard emissions per litre of diesel combusted
  DIESEL_KG_PER_LITRE: 2.68,
  // Standard 14.2 kg domestic LPG cylinder in India (~42.5 kg CO2 per cylinder)
  LPG_KG_PER_CYLINDER: 42.5,
  // Tree CO2 sequestration rate: A mature tree absorbs ~21.77 kg of CO2 per year
  TREE_ANNUAL_SEQUESTRATION_KG: 21.77,
};

/**
 * Common English Stopwords for Topic Extraction
 * Filtered out so that meaningful climate topics emerge
 */
export const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren\'t',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does', 'doesn\'t', 'doing',
  'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadn\'t', 'has', 'hasn\'t',
  'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll', 'he\'s', 'her', 'here', 'here\'s', 'hers',
  'herself', 'him', 'himself', 'his', 'how', 'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if',
  'in', 'into', 'is', 'isn\'t', 'it', 'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t',
  'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their', 'theirs',
  'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d', 'they\'ll', 'they\'re',
  'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn\'t',
  'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve', 'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s',
  'where', 'where\'s', 'which', 'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t',
  'would', 'wouldn\'t', 'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself',
  'yourselves', 'new', 'post', 'reddit', 'hn', 'http', 'https', 'com', 'org', 'amp', 'say', 'says',
  'people', 'one', 'two', 'also', 'just', 'like', 'get', 'make', 'even', 'now', 'will', 'year', 'years'
]);

/**
 * Domain-specific Lexicon for Environmental Sentiment Analysis
 * Scores range from -1 (very negative) to +1 (very positive)
 */
export const SENTIMENT_LEXICON: Record<string, number> = {
  // Positive words
  green: 0.8,
  sustainable: 0.9,
  sustainability: 0.9,
  renewable: 0.9,
  clean: 0.8,
  solar: 0.7,
  wind: 0.6,
  success: 0.9,
  progress: 0.8,
  solution: 0.8,
  innovation: 0.8,
  restoration: 0.8,
  afforestation: 0.9,
  conservation: 0.9,
  protect: 0.7,
  protection: 0.7,
  protecting: 0.7,
  reforestation: 0.9,
  recovery: 0.8,
  breakthrough: 0.9,
  hope: 0.8,
  optimism: 0.8,
  positive: 0.8,
  improved: 0.7,
  improvement: 0.7,
  saving: 0.7,
  saved: 0.7,
  help: 0.6,
  benefit: 0.7,
  eco: 0.7,
  efficient: 0.7,
  efficiency: 0.8,
  agreement: 0.6,
  pact: 0.6,
  accord: 0.6,
  thriving: 0.8,
  flourishing: 0.9,
  victory: 0.9,
  cheaper: 0.6,
  electric: 0.6,
  ev: 0.6,
  recycle: 0.7,
  biodiversity: 0.7,

  // Negative words
  crisis: -0.9,
  disaster: -1.0,
  catastrophe: -1.0,
  emergency: -0.9,
  threat: -0.8,
  threatening: -0.8,
  damage: -0.8,
  damaging: -0.8,
  destroy: -0.9,
  destruction: -0.9,
  destroyed: -0.9,
  deforestation: -0.9,
  pollution: -0.8,
  polluted: -0.8,
  toxic: -0.9,
  hazard: -0.8,
  hazardous: -0.9,
  wildfire: -0.9,
  wildfires: -0.9,
  fire: -0.6,
  smog: -0.8,
  extinction: -1.0,
  extinct: -1.0,
  warming: -0.6,
  drought: -0.8,
  flood: -0.8,
  flooding: -0.8,
  collapse: -1.0,
  failing: -0.8,
  failure: -0.8,
  danger: -0.8,
  dangerous: -0.8,
  alarm: -0.7,
  alarming: -0.8,
  bleak: -0.8,
  devastating: -1.0,
  devastation: -1.0,
  dead: -0.9,
  death: -0.9,
  severe: -0.7,
  worst: -0.9,
  bad: -0.6,
  loss: -0.7,
  melting: -0.7,
  record: -0.3,
  denial: -0.8,
  inaction: -0.8,
  delay: -0.5,
  emission: -0.5,
  emissions: -0.5,
  coal: -0.5,
  fossil: -0.5,
  oil: -0.4,
  gas: -0.3,
  heatwave: -0.8,
  suffering: -0.9,
};

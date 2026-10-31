/**
 * Global Application State for EcoSense
 * Manages City, Country, Data Caching, Dark Mode, and Carbon Calculator State
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  CityConfig,
  CountryConfig,
  AirQualityResponse,
  CountryDeforestationData,
  SentimentAnalysisResult,
  WikiPageviewsData,
  CarbonCalculatorInput,
  CarbonCalculatorResult,
  WhatIfSimulation,
} from '../types';
import { CITIES, COUNTRIES, EMISSION_FACTORS } from '../constants';
import {
  fetchAirQuality,
  fetchDeforestation,
  fetchSocialClimatePosts,
  fetchWikiPageviews,
} from '../services/api';

export type PageTab = 'overview' | 'air-quality' | 'deforestation' | 'climate-awareness' | 'what-if' | 'about';

interface AppContextType {
  // Theme & Navigation
  isDark: boolean;
  toggleTheme: () => void;
  activeTab: PageTab;
  setActiveTab: (tab: PageTab) => void;
  showVivaModal: boolean;
  setShowVivaModal: (show: boolean) => void;

  // Selected Entities
  selectedCity: CityConfig;
  setSelectedCity: (city: CityConfig) => void;
  selectedCountry: CountryConfig;
  setSelectedCountry: (country: CountryConfig) => void;

  // Air Quality State
  airQuality: AirQualityResponse | null;
  airQualityLoading: boolean;
  airQualityError: string | null;
  refreshAirQuality: () => Promise<void>;

  // Deforestation State
  deforestation: CountryDeforestationData | null;
  deforestationLoading: boolean;
  deforestationError: string | null;
  refreshDeforestation: () => Promise<void>;

  // Climate Awareness State
  socialSentiment: SentimentAnalysisResult | null;
  socialLoading: boolean;
  socialError: string | null;
  refreshSocial: () => Promise<void>;

  // Wikipedia Pageviews State
  wikiViews: WikiPageviewsData | null;
  wikiLoading: boolean;
  wikiError: string | null;
  refreshWiki: () => Promise<void>;

  // Carbon Calculator
  carbonInput: CarbonCalculatorInput;
  setCarbonInput: React.Dispatch<React.SetStateAction<CarbonCalculatorInput>>;
  carbonResult: CarbonCalculatorResult;

  // What-If Simulator
  whatIf: WhatIfSimulation;
  setWhatIf: React.Dispatch<React.SetStateAction<WhatIfSimulation>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // 1. Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('ecosense_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('ecosense_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('ecosense_theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // 2. Navigation State
  const [activeTab, setActiveTab] = useState<PageTab>('overview');
  const [showVivaModal, setShowVivaModal] = useState<boolean>(false);

  // 3. Entity Selectors
  const [selectedCity, setSelectedCity] = useState<CityConfig>(CITIES[0]); // Kolkata default
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(COUNTRIES[0]); // India default

  // 4. Air Quality Fetching
  const [airQuality, setAirQuality] = useState<AirQualityResponse | null>(null);
  const [airQualityLoading, setAirQualityLoading] = useState<boolean>(true);
  const [airQualityError, setAirQualityError] = useState<string | null>(null);

  const loadAirQuality = useCallback(async (city: CityConfig) => {
    setAirQualityLoading(true);
    setAirQualityError(null);
    try {
      const data = await fetchAirQuality(city);
      setAirQuality(data);
    } catch (err: unknown) {
      setAirQualityError(err instanceof Error ? err.message : 'Error fetching air quality');
    } finally {
      setAirQualityLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAirQuality(selectedCity);
  }, [selectedCity, loadAirQuality]);

  // Auto-refresh air quality every 5 minutes (300,000 ms)
  useEffect(() => {
    const interval = setInterval(() => {
      loadAirQuality(selectedCity);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedCity, loadAirQuality]);

  const refreshAirQuality = async () => {
    await loadAirQuality(selectedCity);
  };

  // 5. Deforestation Fetching
  const [deforestation, setDeforestation] = useState<CountryDeforestationData | null>(null);
  const [deforestationLoading, setDeforestationLoading] = useState<boolean>(true);
  const [deforestationError, setDeforestationError] = useState<string | null>(null);

  const loadDeforestation = useCallback(async (country: CountryConfig) => {
    setDeforestationLoading(true);
    setDeforestationError(null);
    try {
      const data = await fetchDeforestation(country);
      setDeforestation(data);
    } catch (err: unknown) {
      setDeforestationError(err instanceof Error ? err.message : 'Error fetching deforestation data');
    } finally {
      setDeforestationLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeforestation(selectedCountry);
  }, [selectedCountry, loadDeforestation]);

  const refreshDeforestation = async () => {
    await loadDeforestation(selectedCountry);
  };

  // 6. Social Sentiment Fetching
  const [socialSentiment, setSocialSentiment] = useState<SentimentAnalysisResult | null>(null);
  const [socialLoading, setSocialLoading] = useState<boolean>(true);
  const [socialError, setSocialError] = useState<string | null>(null);

  const loadSocial = useCallback(async () => {
    setSocialLoading(true);
    setSocialError(null);
    try {
      const data = await fetchSocialClimatePosts();
      setSocialSentiment(data);
    } catch (err: unknown) {
      setSocialError(err instanceof Error ? err.message : 'Error fetching social discussions');
    } finally {
      setSocialLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSocial();
  }, [loadSocial]);

  const refreshSocial = async () => {
    await loadSocial();
  };

  // 7. Wikipedia Pageviews Fetching
  const [wikiViews, setWikiViews] = useState<WikiPageviewsData | null>(null);
  const [wikiLoading, setWikiLoading] = useState<boolean>(true);
  const [wikiError, setWikiError] = useState<string | null>(null);

  const loadWiki = useCallback(async () => {
    setWikiLoading(true);
    setWikiError(null);
    try {
      const data = await fetchWikiPageviews();
      setWikiViews(data);
    } catch (err: unknown) {
      setWikiError(err instanceof Error ? err.message : 'Error fetching Wikipedia interest');
    } finally {
      setWikiLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWiki();
  }, [loadWiki]);

  const refreshWiki = async () => {
    await loadWiki();
  };

  // 8. Carbon Footprint Calculator State & Pure Math Formula
  const [carbonInput, setCarbonInput] = useState<CarbonCalculatorInput>({
    electricityKWh: 160,
    fuelType: 'petrol',
    fuelLitres: 25,
    travelKm: 300,
    lpgCylinders: 1,
  });

  const calculateCarbonFootprint = (input: CarbonCalculatorInput): CarbonCalculatorResult => {
    // Electricity: kWh * India grid factor (0.71 kg/kWh)
    const electricityCO2 = Number((input.electricityKWh * EMISSION_FACTORS.ELECTRICITY_KG_PER_KWH).toFixed(1));

    // Vehicle fuel: Litres * emission factor
    let fuelCO2 = 0;
    if (input.fuelType === 'petrol') {
      fuelCO2 = input.fuelLitres * EMISSION_FACTORS.PETROL_KG_PER_LITRE;
    } else if (input.fuelType === 'diesel') {
      fuelCO2 = input.fuelLitres * EMISSION_FACTORS.DIESEL_KG_PER_LITRE;
    }
    fuelCO2 = Number(fuelCO2.toFixed(1));

    // LPG Cooking gas: cylinders * 42.5 kg CO2
    const lpgCO2 = Number((input.lpgCylinders * EMISSION_FACTORS.LPG_KG_PER_CYLINDER).toFixed(1));

    const totalMonthlyCO2 = Number((electricityCO2 + fuelCO2 + lpgCO2).toFixed(1));
    const totalAnnualCO2 = Number((totalMonthlyCO2 * 12).toFixed(1));

    // 1 mature tree absorbs ~21.77 kg CO2 / year
    const matureTreesNeeded = Math.ceil(totalAnnualCO2 / EMISSION_FACTORS.TREE_ANNUAL_SEQUESTRATION_KG);

    // Contextual reduction tips
    const tips: string[] = [];
    if (input.electricityKWh > 150) {
      tips.push('Switch to 5-star BEE rated inverter appliances and LED lighting to cut electricity by up to 25%.');
    } else {
      tips.push('Maintain optimal AC temperature at 24°C–26°C to save ~6% energy per degree rise.');
    }

    if (input.fuelLitres > 15) {
      tips.push('Carpool or adopt public metro transit 2 days a week to lower transport emissions by ~30%.');
    } else {
      tips.push('Keep tire pressures optimized to improve vehicle fuel efficiency by 3-5%.');
    }

    tips.push(`Plant ${Math.min(5, matureTreesNeeded)} native trees or support urban afforestation drives to offset remaining emissions.`);

    return {
      electricityCO2,
      fuelCO2,
      lpgCO2,
      totalMonthlyCO2,
      totalAnnualCO2,
      matureTreesNeeded,
      reductionTips: tips,
    };
  };

  const carbonResult = calculateCarbonFootprint(carbonInput);

  // 9. What-If Simulation State
  const [whatIf, setWhatIf] = useState<WhatIfSimulation>({
    treePlantationPct: 15,
    electricityReductionPct: 20,
    vehicleReductionPct: 25,
  });

  return (
    <AppContext.Provider
      value={{
        isDark,
        toggleTheme,
        activeTab,
        setActiveTab,
        showVivaModal,
        setShowVivaModal,
        selectedCity,
        setSelectedCity,
        selectedCountry,
        setSelectedCountry,
        airQuality,
        airQualityLoading,
        airQualityError,
        refreshAirQuality,
        deforestation,
        deforestationLoading,
        deforestationError,
        refreshDeforestation,
        socialSentiment,
        socialLoading,
        socialError,
        refreshSocial,
        wikiViews,
        wikiLoading,
        wikiError,
        refreshWiki,
        carbonInput,
        setCarbonInput,
        carbonResult,
        whatIf,
        setWhatIf,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

/**
 * Page 1: OVERVIEW
 * 4 summary cards:
 *   - Live air quality of selected city
 *   - Latest forest area %
 *   - Public sentiment score
 *   - Active alerts
 * Short "How EcoSense works" explanation in simple words.
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Wind,
  Trees,
  MessageSquareText,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  CheckCircle,
} from 'lucide-react';
import { CardSkeleton } from '../common/SkeletonLoader';
import { DataSourceFooter } from '../common/DataSourceFooter';
import { WHO_LIMITS } from '../../constants';

export const OverviewPage: React.FC = () => {
  const {
    selectedCity,
    selectedCountry,
    airQuality,
    airQualityLoading,
    airQualityError,
    deforestation,
    deforestationLoading,
    deforestationError,
    socialSentiment,
    socialLoading,
    setActiveTab,
  } = useApp();

  // Evaluate active alerts
  const isPM25Exceeded = airQuality?.currentPM25 !== null && (airQuality?.currentPM25 ?? 0) > WHO_LIMITS.PM25_24H_LIMIT;
  const isCOExceeded = airQuality?.currentCO !== null && (airQuality?.currentCO ?? 0) > WHO_LIMITS.CO_24H_LIMIT;
  const isDeforestationHighRisk = deforestation?.regression?.riskLevel === 'HIGH';

  const activeAlertsCount = (isPM25Exceeded ? 1 : 0) + (isCOExceeded ? 1 : 0) + (isDeforestationHighRisk ? 1 : 0);

  // Air Quality Status label
  const getAirQualityStatus = (pm25: number | null) => {
    if (pm25 === null) return { text: 'Loading...', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800' };
    if (pm25 <= WHO_LIMITS.PM25_24H_LIMIT) return { text: 'Good (Within WHO)', color: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-100 dark:bg-emerald-950/60' };
    if (pm25 <= WHO_LIMITS.PM25_UNHEALTHY_LIMIT) return { text: 'Moderate Concern', color: 'text-amber-700 dark:text-amber-300', bg: 'bg-amber-100 dark:bg-amber-950/60' };
    return { text: 'Unhealthy (Exceeds WHO)', color: 'text-rose-700 dark:text-rose-300', bg: 'bg-rose-100 dark:bg-rose-950/60' };
  };

  const aqiStatus = getAirQualityStatus(airQuality?.currentPM25 ?? null);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <span>🌿 Unified Environmental Analytics</span>
            <span>•</span>
            <span>2nd-Year CSE Project</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            EcoSense Live Dashboard
          </h2>
          <p className="text-sm text-emerald-50/90 leading-relaxed">
            Streaming real-time air pollution, long-term deforestation forecasting with linear regression, and public social climate awareness—directly from free, open public APIs.
          </p>
        </div>
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Live Air Quality */}
        {airQualityLoading ? (
          <CardSkeleton />
        ) : (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Live Air Quality
                </span>
                <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                  <Wind className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {airQuality?.currentPM25 !== null ? airQuality?.currentPM25 : '--'}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">µg/m³ PM2.5</span>
              </div>

              <div className="mt-2 flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${aqiStatus.bg} ${aqiStatus.color}`}>
                  {aqiStatus.text}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {selectedCity.name}, {selectedCity.country}
              </span>
              <button
                onClick={() => setActiveTab('air-quality')}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Track <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Card 2: Forest Area % */}
        {deforestationLoading ? (
          <CardSkeleton />
        ) : (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Forest Area Cover
                </span>
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Trees className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {deforestation ? `${deforestation.latestValue}%` : '--'}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  of land area
                </span>
              </div>

              <div className="mt-2 flex items-center gap-1.5 text-xs">
                {deforestation?.regression?.direction === 'increasing' ? (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" /> +{deforestation.regression.slope}%/yr
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5" /> {deforestation?.regression?.slope}%/yr
                  </span>
                )}
                <span className="text-slate-400 text-[11px] font-normal">
                  (since {deforestation?.percentageHistory[0]?.year || 1990})
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">
                {selectedCountry.flag} {selectedCountry.name}
              </span>
              <button
                onClick={() => setActiveTab('deforestation')}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Forecast <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Card 3: Public Sentiment Score */}
        {socialLoading ? (
          <CardSkeleton />
        ) : (
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Public Climate Vibe
                </span>
                <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                  <MessageSquareText className="w-4 h-4" />
                </div>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">
                  {socialSentiment ? `${Math.round(((socialSentiment.positiveCount) / (socialSentiment.totalPosts || 1)) * 100)}%` : '--'}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  positive tone
                </span>
              </div>

              <div className="mt-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                <span>{socialSentiment?.totalPosts ?? 0} discussions analyzed</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium truncate max-w-[120px]">
                Reddit & HN
              </span>
              <button
                onClick={() => setActiveTab('climate-awareness')}
                className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                Analyze <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Card 4: Active Alerts */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Active Threshold Alerts
              </span>
              <div className={`p-2 rounded-xl ${activeAlertsCount > 0 ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'}`}>
                {activeAlertsCount > 0 ? <AlertTriangle className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              </div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className={`text-3xl font-black ${activeAlertsCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                {activeAlertsCount}
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                environmental flags
              </span>
            </div>

            <div className="mt-2 text-xs">
              {activeAlertsCount > 0 ? (
                <span className="text-rose-600 dark:text-rose-400 font-medium">
                  {isPM25Exceeded && 'WHO PM2.5 threshold exceeded.'}
                  {isDeforestationHighRisk && ' Rapid forest depletion.'}
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  All monitored metrics normal
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              WHO 2021 Norms
            </span>
            <button
              onClick={() => setActiveTab('air-quality')}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              Details <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* "How EcoSense Works" Explanation Section for College Project */}
      <div className="p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Architecture & Concept
          </span>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-1">
            How EcoSense Works in Simple Words
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            As computer science students, our goal was to build a single transparent platform that pulls environmental facts together so common citizens and policy-makers do not have to struggle with complex raw tables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">1. Live Data Ingestion</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
              Instead of static files, EcoSense queries verified open APIs (Open-Meteo, World Bank, Reddit/HN, Wikimedia) on demand without any private keys.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">2. In-Browser Analytics</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
              Linear regression calculates deforestation slope $m$ and predicts the next 10 years right inside JavaScript. Lexicon NLP scores public sentiment on the client side.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">3. Actionable What-Ifs</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal">
              Users can calculate their personal carbon footprint and move interactive simulation sliders to instantly visualize how tree plantation or green habits alter future outcomes.
            </p>
          </div>
        </div>

        <DataSourceFooter
          sourceName="Open-Meteo & World Bank API Services"
          sourceUrl="https://open-meteo.com/en/docs/air-quality-api"
          lastUpdated={airQuality?.lastUpdated || new Date().toLocaleTimeString()}
          notes="All metrics stream directly from public endpoints"
        />
      </div>
    </div>
  );
};

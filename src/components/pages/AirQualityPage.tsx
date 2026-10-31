/**
 * Page 2: CARBON & AIR TRACKER (Real-Time)
 * - City selector (Kolkata, Delhi, Mumbai, London, Beijing, New York)
 * - Open-Meteo Air Quality API: PM2.5, CO, NO2, CO2 (3 past days + 2 forecast days)
 * - WHO Guidelines alert banner with plain English explanations
 * - Carbon Footprint Calculator with pie chart breakdown, trees offset, and reduction tips
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Wind,
  AlertTriangle,
  ShieldCheck,
  Calculator,
  RefreshCw,
  Info,
  Car,
  Zap,
  Flame,
  CheckCircle2,
  TreeDeciduous,
  Clock,
  Sparkles,
} from 'lucide-react';
import { CITIES, WHO_LIMITS, EMISSION_FACTORS } from '../../constants';
import { DataSourceFooter } from '../common/DataSourceFooter';
import { ErrorMessage } from '../common/ErrorMessage';
import { ChartSkeleton } from '../common/SkeletonLoader';
import { getLineChartOptions } from '../../utils/chartConfig';

export const AirQualityPage: React.FC = () => {
  const {
    isDark,
    selectedCity,
    setSelectedCity,
    airQuality,
    airQualityLoading,
    airQualityError,
    refreshAirQuality,
    carbonInput,
    setCarbonInput,
    carbonResult,
  } = useApp();

  // Active pollutant metric tab: 'pm2_5' | 'carbon_monoxide' | 'nitrogen_dioxide' | 'carbon_dioxide'
  const [selectedMetric, setSelectedMetric] = useState<'pm2_5' | 'carbon_monoxide' | 'nitrogen_dioxide' | 'carbon_dioxide'>('pm2_5');

  // Chart configuration for hourly air quality
  const chartOptions = useMemo(() => {
    return getLineChartOptions(isDark);
  }, [isDark]);

  // Format time labels for x-axis
  const formattedLabels = useMemo(() => {
    if (!airQuality?.readings?.time) return [];
    return airQuality.readings.time.map((isoString) => {
      const d = new Date(isoString);
      const day = d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      return `${day} ${time}`;
    });
  }, [airQuality]);

  // Build the main Line chart dataset
  const airChartData = useMemo(() => {
    if (!airQuality?.readings) {
      return { labels: [], datasets: [] };
    }

    const metricConfig = {
      pm2_5: {
        label: 'PM2.5 (Fine Particulate Matter)',
        data: airQuality.readings.pm2_5,
        borderColor: '#059669', // emerald-600
        backgroundColor: 'rgba(5, 150, 105, 0.1)',
        unit: 'µg/m³',
      },
      carbon_monoxide: {
        label: 'Carbon Monoxide (CO)',
        data: airQuality.readings.carbon_monoxide,
        borderColor: '#0284c7', // sky-600
        backgroundColor: 'rgba(2, 132, 199, 0.1)',
        unit: 'µg/m³',
      },
      nitrogen_dioxide: {
        label: 'Nitrogen Dioxide (NO₂)',
        data: airQuality.readings.nitrogen_dioxide,
        borderColor: '#d97706', // amber-600
        backgroundColor: 'rgba(217, 119, 6, 0.1)',
        unit: 'µg/m³',
      },
      carbon_dioxide: {
        label: 'Carbon Dioxide (CO₂)',
        data: airQuality.readings.carbon_dioxide,
        borderColor: '#7c3aed', // violet-600
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        unit: 'ppm',
      },
    };

    const currentConfig = metricConfig[selectedMetric];

    return {
      labels: formattedLabels,
      datasets: [
        {
          label: `${currentConfig.label} (${currentConfig.unit})`,
          data: currentConfig.data,
          borderColor: currentConfig.borderColor,
          backgroundColor: currentConfig.backgroundColor,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 5,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  }, [airQuality, selectedMetric, formattedLabels]);

  // Carbon breakdown Doughnut chart
  const carbonChartData = useMemo(() => {
    return {
      labels: ['Electricity (kWh)', 'Vehicle Fuel', 'LPG Gas'],
      datasets: [
        {
          data: [
            carbonResult.electricityCO2,
            carbonResult.fuelCO2,
            carbonResult.lpgCO2,
          ],
          backgroundColor: [
            '#0284c7', // sky-600
            '#059669', // emerald-600
            '#f59e0b', // amber-500
          ],
          borderColor: isDark ? '#0f172a' : '#ffffff',
          borderWidth: 2,
        },
      ],
    };
  }, [carbonResult, isDark]);

  // Evaluate WHO Alerts
  const pm25Value = airQuality?.currentPM25 ?? null;
  const coValue = airQuality?.currentCO ?? null;

  const isPM25High = pm25Value !== null && pm25Value > WHO_LIMITS.PM25_24H_LIMIT;
  const isCOHigh = coValue !== null && coValue > WHO_LIMITS.CO_24H_LIMIT;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & City Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Atmospheric Monitoring
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold">
              Auto-refreshes every 5m
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Real-Time Air Quality & Carbon Tracker
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Hourly measurements (past 3 days + next 2 days forecast) streamed directly from Open-Meteo.
          </p>
        </div>

        {/* City Switcher */}
        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Select City
            </label>
            <select
              value={selectedCity.id}
              onChange={(e) => {
                const found = CITIES.find((c) => c.id === e.target.value);
                if (found) setSelectedCity(found);
              }}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              {CITIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}, {c.country}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => refreshAirQuality()}
            disabled={airQualityLoading}
            className="mt-4 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
            title="Refresh Air Quality"
          >
            <RefreshCw className={`w-4 h-4 ${airQualityLoading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* WHO Air Quality Alerts */}
      {(isPM25High || isCOHigh) ? (
        <div className="rounded-2xl border border-rose-300 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-300 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm sm:text-base text-rose-950 dark:text-rose-100">
                  WHO Health Alert Triggered for {selectedCity.name}
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-200">
                  Threshold Exceeded
                </span>
              </div>
              <p className="text-xs sm:text-sm text-rose-900/90 dark:text-rose-200/90 leading-relaxed">
                {isPM25High && (
                  <span>
                    <strong>PM2.5 is at {pm25Value} µg/m³</strong>, crossing the World Health Organization (WHO) recommended 24-hour safety limit of <strong>15 µg/m³</strong>. Fine particulate matter can penetrate deep into lungs and enter the bloodstream. Children, elderly, and sensitive groups should avoid prolonged outdoor exertion.
                  </span>
                )}
                {isCOHigh && (
                  <span className="block mt-1">
                    <strong>Carbon Monoxide (CO) is at {coValue} µg/m³</strong>, exceeding the WHO guideline of 4,000 µg/m³ (4 mg/m³). Elevated CO reduces oxygen delivery to vital organs.
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 shadow-xs flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs text-emerald-950 dark:text-emerald-200">
            <span className="font-bold text-emerald-900 dark:text-emerald-100">Air Quality Normal: </span>
            Current readings in {selectedCity.name} are within or near WHO safety guidelines (PM2.5 threshold: 15 µg/m³).
          </div>
        </div>
      )}

      {/* Main Air Quality Chart Panel */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Hourly Concentration Trend (5-Day Window)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Covers 72 hours of observed historical records + 48 hours of predictive atmospheric modeling.
            </p>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setSelectedMetric('pm2_5')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMetric === 'pm2_5'
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              PM2.5 ({airQuality?.currentPM25 ?? '--'} µg/m³)
            </button>
            <button
              onClick={() => setSelectedMetric('carbon_monoxide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMetric === 'carbon_monoxide'
                  ? 'bg-sky-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              CO ({airQuality?.currentCO ?? '--'} µg/m³)
            </button>
            <button
              onClick={() => setSelectedMetric('nitrogen_dioxide')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedMetric === 'nitrogen_dioxide'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              NO₂ ({airQuality?.currentNO2 ?? '--'} µg/m³)
            </button>
            {airQuality?.readings?.carbon_dioxide && airQuality.readings.carbon_dioxide.length > 0 && (
              <button
                onClick={() => setSelectedMetric('carbon_dioxide')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedMetric === 'carbon_dioxide'
                    ? 'bg-purple-500 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                CO₂ ({airQuality?.currentCO2 ?? '--'} ppm)
              </button>
            )}
          </div>
        </div>

        {/* Chart View or Loading/Error */}
        <div className="mt-6">
          {airQualityLoading ? (
            <ChartSkeleton />
          ) : airQualityError ? (
            <ErrorMessage
              message={airQualityError}
              onRetry={refreshAirQuality}
              isRetrying={airQualityLoading}
            />
          ) : (
            <div className="h-[340px] w-full">
              <Line data={airChartData} options={chartOptions} />
            </div>
          )}
        </div>

        <DataSourceFooter
          sourceName="Open-Meteo Air Quality API (Copernicus CAMS & GFS Reanalysis)"
          sourceUrl={`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${selectedCity.latitude}&longitude=${selectedCity.longitude}&hourly=pm2_5,carbon_monoxide,nitrogen_dioxide,carbon_dioxide&past_days=3&forecast_days=2`}
          lastUpdated={airQuality?.lastUpdated}
          notes="Polled on demand; missing variables skipped gracefully without synthetic data"
        />
      </div>

      {/* Carbon Footprint Calculator Section */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                Personal Carbon Footprint Calculator
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Input your monthly utility consumption to compute your kg CO₂ footprint using standard emission factors.
            </p>
          </div>
          <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 font-medium">
            Assumptions: CEA India 0.71 kg/kWh • Petrol 2.31 kg/L • Diesel 2.68 kg/L
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* User Inputs Form */}
          <div className="lg:col-span-5 space-y-4">
            {/* Electricity Input */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sky-500" />
                  Monthly Electricity
                </label>
                <span className="font-black text-sky-600 dark:text-sky-400">
                  {carbonInput.electricityKWh} kWh
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="800"
                step="10"
                value={carbonInput.electricityKWh}
                onChange={(e) =>
                  setCarbonInput((prev) => ({ ...prev, electricityKWh: Number(e.target.value) }))
                }
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0 kWh (Zero)</span>
                <span>Average Indian household ~150-200 kWh</span>
                <span>800 kWh</span>
              </div>
            </div>

            {/* Fuel Type & Litres Input */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-emerald-500" />
                  Vehicle Fuel Usage
                </label>
                <div className="flex gap-2">
                  <label className="inline-flex items-center gap-1 text-[11px] cursor-pointer">
                    <input
                      type="radio"
                      name="fuelType"
                      checked={carbonInput.fuelType === 'petrol'}
                      onChange={() => setCarbonInput((prev) => ({ ...prev, fuelType: 'petrol' }))}
                      className="accent-emerald-600"
                    />
                    Petrol
                  </label>
                  <label className="inline-flex items-center gap-1 text-[11px] cursor-pointer">
                    <input
                      type="radio"
                      name="fuelType"
                      checked={carbonInput.fuelType === 'diesel'}
                      onChange={() => setCarbonInput((prev) => ({ ...prev, fuelType: 'diesel' }))}
                      className="accent-emerald-600"
                    />
                    Diesel
                  </label>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 text-[11px]">Monthly fuel volume</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">
                  {carbonInput.fuelLitres} Litres
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={carbonInput.fuelLitres}
                onChange={(e) =>
                  setCarbonInput((prev) => ({ ...prev, fuelLitres: Number(e.target.value) }))
                }
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* LPG Cylinders */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Cooking LPG Cylinders (14.2kg)
                </label>
                <span className="font-black text-amber-600 dark:text-amber-400">
                  {carbonInput.lpgCylinders} cylinder / month
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={carbonInput.lpgCylinders}
                onChange={(e) =>
                  setCarbonInput((prev) => ({ ...prev, lpgCylinders: Number(e.target.value) }))
                }
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Cards & Breakdown Pie */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Summary KPI Card */}
            <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                  Estimated Carbon Impact
                </span>
                <div className="mt-3">
                  <div className="text-3xl sm:text-4xl font-black">
                    {carbonResult.totalMonthlyCO2}
                    <span className="text-sm font-semibold ml-1.5 text-emerald-100">kg CO₂/mo</span>
                  </div>
                  <div className="text-xs text-emerald-100/90 mt-1">
                    ≈ {(carbonResult.totalAnnualCO2 / 1000).toFixed(2)} metric tons CO₂ annually
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-emerald-500/50 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white/20 backdrop-blur-xs">
                  <TreeDeciduous className="w-5 h-5 text-white" />
                </div>
                <div className="text-xs">
                  <span className="font-bold block">
                    {carbonResult.matureTreesNeeded} Mature Trees
                  </span>
                  <span className="text-emerald-100/80 text-[11px]">
                    required for 1 year of carbon offsetting
                  </span>
                </div>
              </div>
            </div>

            {/* Doughnut Chart of Sources */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Emissions Breakdown by Source
              </span>
              <div className="h-44 w-44">
                <Doughnut
                  data={carbonChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-3 flex gap-3 text-[10px] text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-sky-600"></span> Electric ({carbonResult.electricityCO2}kg)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Fuel ({carbonResult.fuelCO2}kg)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> LPG ({carbonResult.lpgCO2}kg)
                </span>
              </div>
            </div>

            {/* 3 Actionable Reduction Tips */}
            <div className="sm:col-span-2 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                3 Data-Driven Reduction Tips for Your Profile
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {carbonResult.reductionTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <DataSourceFooter
          sourceName="IPCC Guidelines for National Greenhouse Gas Inventories & Central Electricity Authority (CEA) India"
          sourceUrl="https://cea.nic.in"
          notes="Calculations explicitly stated as empirical scientific assumptions"
        />
      </div>
    </div>
  );
};

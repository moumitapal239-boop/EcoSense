/**
 * Page 3: DEFORESTATION FORECAST
 * - Real World Bank data (AG.LND.FRST.ZS % and AG.LND.FRST.K2 sq km) from 1990
 * - In-browser JavaScript Linear Regression (Ordinary Least Squares)
 * - 10-year forward projection shown as a distinct dotted line
 * - Risk Badge (Green/Yellow/Red) based on slope (m)
 * - Year-wise predicted values table
 * - World-bar comparison across countries
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Line, Bar } from 'react-chartjs-2';
import {
  Trees,
  TrendingDown,
  TrendingUp,
  Table as TableIcon,
  BarChart3,
  Calendar,
  Compass,
  ArrowRight,
  Info,
  RefreshCw,
} from 'lucide-react';
import { COUNTRIES } from '../../constants';
import { fetchMultiCountryComparison } from '../../services/api';
import { DataSourceFooter } from '../common/DataSourceFooter';
import { ErrorMessage } from '../common/ErrorMessage';
import { ChartSkeleton } from '../common/SkeletonLoader';
import { RiskBadge } from '../common/RiskBadge';
import { getLineChartOptions, getBarChartOptions } from '../../utils/chartConfig';

export const DeforestationPage: React.FC = () => {
  const {
    isDark,
    selectedCountry,
    setSelectedCountry,
    deforestation,
    deforestationLoading,
    deforestationError,
    refreshDeforestation,
  } = useApp();

  // Multi-country comparison state
  const [comparisonData, setComparisonData] = useState<
    { code: string; name: string; latestYear: number; latestValue: number; baseline1990: number }[]
  >([]);
  const [comparisonLoading, setComparisonLoading] = useState<boolean>(true);

  // Fetch world comparison on mount
  useEffect(() => {
    let isMounted = true;
    async function loadComparison() {
      setComparisonLoading(true);
      try {
        const data = await fetchMultiCountryComparison(['IND', 'BRA', 'IDN', 'COD', 'CHN', 'USA']);
        if (isMounted) setComparisonData(data);
      } catch {
        // fallback gracefully
      } finally {
        if (isMounted) setComparisonLoading(false);
      }
    }
    loadComparison();
    return () => {
      isMounted = false;
    };
  }, []);

  // Prepare combined Historical + Forecast Dataset for Line Chart
  const lineChartData = useMemo(() => {
    if (!deforestation || !deforestation.percentageHistory) {
      return { labels: [], datasets: [] };
    }

    const history = deforestation.percentageHistory;
    const forecast = deforestation.regression.forecast;

    const allYears = [
      ...history.map((h) => String(h.year)),
      ...forecast.map((f) => String(f.year)),
    ];

    // Historical line: values for history, null for forecast
    const historicalValues: (number | null)[] = [
      ...history.map((h) => h.value),
      ...forecast.map(() => null),
    ];

    // Forecast line: null for all except the last historical point and all forecast points
    const forecastValues: (number | null)[] = [
      ...history.slice(0, -1).map(() => null),
      history[history.length - 1].value, // bridge connection
      ...forecast.map((f) => f.predictedValue),
    ];

    return {
      labels: allYears,
      datasets: [
        {
          label: 'Historical Forest Cover (% of Land Area)',
          data: historicalValues,
          borderColor: '#059669', // emerald-600
          backgroundColor: 'rgba(5, 150, 105, 0.1)',
          borderWidth: 2.5,
          pointRadius: 2,
          pointHoverRadius: 6,
          tension: 0.2,
          fill: true,
        },
        {
          label: 'JavaScript Linear Regression 10-Yr Prediction',
          data: forecastValues,
          borderColor: '#0284c7', // sky-600
          borderWidth: 2.5,
          borderDash: [6, 6], // Dotted line requirement
          pointRadius: 3,
          pointBackgroundColor: '#0284c7',
          pointHoverRadius: 6,
          tension: 0.1,
          fill: false,
        },
      ],
    };
  }, [deforestation]);

  const lineChartOptions = useMemo(() => {
    return getLineChartOptions(isDark);
  }, [isDark]);

  // World Bar Comparison Chart
  const barChartData = useMemo(() => {
    if (comparisonData.length === 0) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: comparisonData.map((c) => c.name),
      datasets: [
        {
          label: 'Baseline 1990 Forest Cover (%)',
          data: comparisonData.map((c) => c.baseline1990),
          backgroundColor: isDark ? 'rgba(100, 116, 139, 0.5)' : 'rgba(203, 213, 225, 0.8)',
          borderRadius: 6,
        },
        {
          label: 'Latest World Bank Record (%)',
          data: comparisonData.map((c) => c.latestValue),
          backgroundColor: '#059669', // emerald-600
          borderRadius: 6,
        },
      ],
    };
  }, [comparisonData, isDark]);

  const barChartOptions = useMemo(() => {
    return getBarChartOptions(isDark);
  }, [isDark]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Country Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Terrestrial Biome Analytics
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Deforestation Trends & 10-Year OLS Forecast
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Streams verified World Bank Indicators (AG.LND.FRST.ZS) and calculates Ordinary Least Squares (y = mx + c) directly in your browser.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              Select Country
            </label>
            <select
              value={selectedCountry.code}
              onChange={(e) => {
                const found = COUNTRIES.find((c) => c.code === e.target.value);
                if (found) setSelectedCountry(found);
              }}
              className="text-xs font-bold px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-xs"
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => refreshDeforestation()}
            disabled={deforestationLoading}
            className="mt-4 p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer transition-colors"
            title="Refresh Deforestation Data"
          >
            <RefreshCw className={`w-4 h-4 ${deforestationLoading ? 'animate-spin text-emerald-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Regression KPI Summary & Risk Badge */}
      {deforestation && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Latest Recorded Value */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Latest Forest Cover
            </span>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {deforestation.latestValue}%
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Recorded in year {deforestation.latestYear} (World Bank)
            </p>
          </div>

          {/* Net Change Since 1990 */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Net Change (1990 - Present)
            </span>
            <div className="mt-2 flex items-baseline gap-1.5 text-2xl font-black">
              {deforestation.netChangeSince1990 >= 0 ? (
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-5 h-5" /> +{deforestation.netChangeSince1990}%
                </span>
              ) : (
                <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <TrendingDown className="w-5 h-5" /> {deforestation.netChangeSince1990}%
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Baseline 1990: {deforestation.baseline1990Value}% of land area
            </p>
          </div>

          {/* Linear Regression Slope (m) */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Regression Slope (m)
            </span>
            <div className="mt-2 text-2xl font-black text-sky-600 dark:text-sky-400">
              {deforestation.regression.slope > 0 ? `+${deforestation.regression.slope}` : deforestation.regression.slope}
              <span className="text-xs font-semibold ml-1 text-slate-500">%/yr</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Goodness of Fit R² = {deforestation.regression.rSquared}
            </p>
          </div>

          {/* Risk Level Badge */}
          <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs flex flex-col justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
              Deforestation Urgency
            </span>
            <div className="mt-2">
              <RiskBadge
                level={deforestation.regression.riskLevel}
                slope={deforestation.regression.slope}
                showExplanation={false}
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {deforestation.regression.riskDescription}
            </p>
          </div>
        </div>
      )}

      {/* Main Historical + Forecast Line Chart */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.name}: Historical Record vs 10-Year Forward Regression</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              The continuous green line indicates authentic historical records; the dotted blue line represents JS-computed OLS linear forecast.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
              <span className="w-3 h-0.5 bg-emerald-600"></span> Historical
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-sky-700 dark:text-sky-400">
              <span className="w-3 h-0.5 border-t-2 border-dashed border-sky-600"></span> 10-Yr Prediction
            </span>
          </div>
        </div>

        <div className="mt-6">
          {deforestationLoading ? (
            <ChartSkeleton />
          ) : deforestationError ? (
            <ErrorMessage
              message={deforestationError}
              onRetry={refreshDeforestation}
              isRetrying={deforestationLoading}
            />
          ) : (
            <div className="h-[360px] w-full">
              <Line data={lineChartData} options={lineChartOptions} />
            </div>
          )}
        </div>

        <DataSourceFooter
          sourceName="World Bank Open Data API (Indicator AG.LND.FRST.ZS)"
          sourceUrl={`https://api.worldbank.org/v2/country/${selectedCountry.code}/indicator/AG.LND.FRST.ZS?format=json&per_page=100`}
          lastUpdated={deforestation?.lastUpdated}
          notes="Linear Regression calculated directly in JavaScript using Ordinary Least Squares"
        />
      </div>

      {/* Two Columns: Forecast Table + Global Bar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Forecast Table */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-sky-500" />
              10-Year Predicted Values Table
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Formula: y = {deforestation?.regression.slope}x + {deforestation?.regression.intercept}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-left">
                  <th className="py-2 px-3 font-semibold">Future Year</th>
                  <th className="py-2 px-3 font-semibold">Predicted Forest %</th>
                  <th className="py-2 px-3 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {deforestation?.regression.forecast.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2 px-3 font-bold text-slate-800 dark:text-slate-200">
                      {row.year}
                    </td>
                    <td className="py-2 px-3 font-semibold text-sky-600 dark:text-sky-400">
                      {row.predictedValue}%
                    </td>
                    <td className="py-2 px-3 text-slate-500 dark:text-slate-400 font-sans">
                      {deforestation.regression.direction === 'increasing' ? (
                        <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
                          Expansion (+{deforestation.regression.slope}%)
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 text-[11px] font-medium">
                          Depletion ({deforestation.regression.slope}%)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Bar Comparison */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              World Comparison (1990 Baseline vs Latest)
            </h4>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              India, Brazil, Indonesia, DRC, China, USA
            </span>
          </div>

          <div className="h-[280px] w-full">
            {comparisonLoading ? (
              <ChartSkeleton />
            ) : (
              <Bar data={barChartData} options={barChartOptions} />
            )}
          </div>

          <DataSourceFooter
            sourceName="World Bank API Multi-Country Indicator Batch"
            sourceUrl="https://data.worldbank.org/indicator/AG.LND.FRST.ZS"
            notes="Real-time multi-country comparison"
          />
        </div>
      </div>
    </div>
  );
};

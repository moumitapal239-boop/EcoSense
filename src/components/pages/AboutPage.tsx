/**
 * Page 6: ABOUT / HOW IT WORKS
 * - Architecture diagram (Data Sources -> REST APIs -> Client Data Engine -> Reactive Dashboard)
 * - Comprehensive Data Source Reference Table with direct links
 * - Transparent Limitations & Future Scope (IoT ESP32 + MQ-135, Sentinel-2 / Google Earth Engine)
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Info,
  Database,
  Cpu,
  Layers,
  ExternalLink,
  GraduationCap,
  Sparkles,
  AlertTriangle,
  Radio,
  Satellite,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { DataSourceFooter } from '../common/DataSourceFooter';

export const AboutPage: React.FC = () => {
  const { setShowVivaModal } = useApp();

  const dataSources = [
    {
      name: 'Open-Meteo Air Quality API',
      indicator: 'PM2.5, CO, NO₂, CO₂ (Hourly 3 past days + 2 forecast days)',
      url: 'https://open-meteo.com/en/docs/air-quality-api',
      license: 'Free / CC BY 4.0 (No API Key Required)',
      latency: '5-minute polling',
    },
    {
      name: 'World Bank Open Data API',
      indicator: 'Forest Area % of Land (AG.LND.FRST.ZS) & Sq. Km (AG.LND.FRST.K2)',
      url: 'https://data.worldbank.org/indicator/AG.LND.FRST.ZS',
      license: 'Open Access / CC BY 4.0',
      latency: 'Annual historical time series',
    },
    {
      name: 'Reddit Public API (r/climatechange)',
      indicator: 'Live user posts and community discourse',
      url: 'https://www.reddit.com/r/climatechange/new.json',
      license: 'Public JSON Endpoint',
      latency: 'Real-time (CORS Fallback to HN Algolia)',
    },
    {
      name: 'Hacker News Algolia Search API',
      indicator: 'Climate discussions, technological news, and public questions',
      url: 'https://hn.algolia.com/api',
      license: 'Free Public API',
      latency: 'Real-time verified fallback',
    },
    {
      name: 'Wikimedia Pageviews REST API',
      indicator: 'Daily readership of English Wikipedia "Climate change" article',
      url: 'https://wikimedia.org/api/rest_v1',
      license: 'Wikimedia Foundation Open API',
      latency: 'Daily aggregated records (past 90 days)',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            System Architecture & Documentation
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            About EcoSense & Technical Blueprint
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Built by a 2nd-year CSE student to demonstrate unified real-world environmental ingestion without commercial API keys.
          </p>
        </div>

        <button
          onClick={() => setShowVivaModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer shrink-0"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Open Viva & Demo Guide</span>
        </button>
      </div>

      {/* Visual Pipeline Architecture Diagram */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-500" />
            End-to-End System Architecture Diagram
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Flow from external public telemetry to reactive in-browser computation
          </p>
        </div>

        {/* Pipeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
          {/* Stage 1: Data Sources */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Layer 1: Telemetry</span>
              <Database className="w-4 h-4 text-sky-500" />
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
              <li>• Open-Meteo Air Quality</li>
              <li>• World Bank Forest Indicators</li>
              <li>• Reddit / HN Public Threads</li>
              <li>• Wikimedia Pageviews</li>
            </ul>
          </div>

          {/* Stage 2: Ingestion & CORS Layer */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Layer 2: Ingestion</span>
              <ArrowRight className="w-4 h-4 text-teal-500" />
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
              <li>• Native Fetch with AbortController</li>
              <li>• Automatic CORS Fallback Cascade</li>
              <li>• Auto-refresh interval (5 mins)</li>
              <li>• Zero Synthetic Data Validation</li>
            </ul>
          </div>

          {/* Stage 3: Client Math & NLP Engine */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Layer 3: Processing</span>
              <Cpu className="w-4 h-4 text-emerald-500" />
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
              <li>• OLS Linear Regression (y = mx + c)</li>
              <li>• 10-Yr Deforestation Forecast</li>
              <li>• Lexicon Polarity & Negation NLP</li>
              <li>• Carbon Emission Modeling (CEA/IPCC)</li>
            </ul>
          </div>

          {/* Stage 4: Reactive Dashboard */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white">Layer 4: Presentation</span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px]">
              <li>• Chart.js Multi-axis Canvas</li>
              <li>• WHO Guideline Alert Triggers</li>
              <li>• Interactive What-If Simulator</li>
              <li>• Light & Dark Theme Adaptation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Sources Reference Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-sky-500" />
            Free Public API Registry & Endpoints
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            All endpoints used in EcoSense are 100% keyless, free, and verifiable.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Service Name</th>
                <th className="py-2.5 px-3 font-semibold">Indicators Returned</th>
                <th className="py-2.5 px-3 font-semibold">Refresh / Resolution</th>
                <th className="py-2.5 px-3 font-semibold">Endpoint & Docs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {dataSources.map((ds, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">
                    {ds.name}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {ds.indicator}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                    {ds.latency}
                  </td>
                  <td className="py-2.5 px-3">
                    <a
                      href={ds.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      Visit Documentation <ExternalLink className="w-3 h-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Limitations & Future Scope Section (Required by prompt) */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Limitations & Future Scope (Academic Self-Appraisal)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Honest appraisal of model assumptions, edge cases, and hardware expansion plans
            </p>
          </div>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
            Engineering Rigor
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
          {/* Current Limitations */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="w-4 h-4" />
              Current System Limitations
            </h4>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>
                <strong className="text-slate-800 dark:text-slate-200">1. Atmospheric Modelled Estimates:</strong> Open-Meteo air quality is derived from Copernicus Atmospheric Monitoring Service (CAMS) 10-km meteorological reanalysis, which may vary from hyperlocal ground-level micro-street canyons.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">2. Lexicon-Based NLP:</strong> Sentiment is scored with a curated dictionary and negation window. It does not parse complex irony, sarcasm, or linguistic idioms as deeply as multi-billion parameter transformer models.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">3. Aggregated Forest Data:</strong> World Bank forest data is country-level annual reporting from national FAO submissions, which smoothes out seasonal localized illegal logging.
              </li>
              <li>
                <strong className="text-slate-800 dark:text-slate-200">4. Assumption-Based Carbon Factors:</strong> The footprint calculator applies national average grid factors (0.71 kg/kWh for India) rather than hourly time-of-day marginal emissions.
              </li>
            </ul>
          </div>

          {/* Future Scope */}
          <div className="p-4 rounded-xl border border-emerald-200/80 dark:border-emerald-800/60 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-3">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <Satellite className="w-4 h-4 text-emerald-600" />
              Future Engineering Roadmap
            </h4>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300">
              <li>
                <strong className="text-slate-900 dark:text-white">1. Physical IoT Hardware Integration:</strong> Deploying edge sensor nodes using low-cost ESP32 microcontrollers paired with MQ-135 air quality gas sensors, MQ-7 for carbon monoxide, and PMS5003 laser particulate sensors streaming via MQTT to the dashboard.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">2. High-Resolution Satellite Remote Sensing:</strong> Integrating Google Earth Engine (GEE) and Copernicus Sentinel-2 MSI multispectral imagery to calculate 10m NDVI (Normalized Difference Vegetation Index) for real-time forest canopy loss detection.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">3. On-Device WebAssembly Transformers:</strong> Running a quantized DistilBERT or RoBERTa model compiled to WASM directly inside the browser for contextual sentiment classification without server costs.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">4. Non-Linear Polynomial & ARIMA Time Series:</strong> Incorporating seasonal ARIMA forecasting to capture climate oscillation cycles (like El Niño and monsoon dynamics).
              </li>
            </ul>
          </div>
        </div>
      </div>

      <DataSourceFooter
        sourceName="EcoSense Technical Specifications & Academic Documentation"
        notes="Designed for College CSE Project Evaluation"
      />
    </div>
  );
};

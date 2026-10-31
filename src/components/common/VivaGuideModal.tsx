/**
 * Student Presentation, Viva Questions & 2-Minute Demo Script Modal
 * College Project Academic Companion
 */

import React, { useState } from 'react';
import { X, GraduationCap, PlayCircle, HelpCircle, AlertOctagon, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';

interface VivaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaGuideModal: React.FC<VivaGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'demo' | 'viva' | 'improvements'>('demo');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const vivaQuestions = [
    {
      q: 'Q1: Why did you choose Linear Regression instead of deep learning (LSTM/RNN) for deforestation prediction?',
      a: 'Answer: We selected Ordinary Least Squares (OLS) Linear Regression because World Bank forest data is annual (only ~33 data points from 1990 to present). Deep learning models like LSTMs suffer from severe overfitting on datasets under 100 rows. Linear Regression provides closed-form mathematical determinism (y = mx + c), high interpretability, and runs instantly in the browser without server latency or GPU costs.',
    },
    {
      q: 'Q2: How does the air quality data refresh and how are WHO alerts calculated?',
      a: 'Answer: We poll the Open-Meteo Air Quality API every 5 minutes using latitude and longitude coordinates. Open-Meteo integrates real atmospheric assimilation from the Copernicus Atmosphere Monitoring Service (CAMS). We evaluate PM2.5 against the WHO 2021 24-hour limit of 15 µg/m³ and CO against 4,000 µg/m³. If readings exceed these guidelines, an automated alert banner is triggered with health guidance.',
    },
    {
      q: 'Q3: How did you overcome CORS restrictions when fetching live social media sentiment?',
      a: 'Answer: Reddit\'s raw JSON endpoint occasionally enforces strict CORS policies when requested from web browsers. To ensure zero application downtime, we engineered an automatic fallback cascade: the app first attempts Reddit r/climatechange; if blocked by CORS or network timeout, it immediately falls back to the Hacker News Algolia Search API, extracting real discussions and executing client-side lexicon sentiment scoring.',
    },
    {
      q: 'Q4: How does the client-side sentiment analysis and keyword extraction algorithm function?',
      a: 'Answer: We tokenize headline texts in JavaScript, remove standard English stop-words, and match tokens against a calibrated environmental lexicon. We also implement a 1-word lookback negation window (e.g., if preceded by "not" or "never", the word polarity is inverted). Word frequencies are tallied in a hash map to compute real-time trending climate topics.',
    },
    {
      q: 'Q5: What are the mathematical emission factors powering the Carbon Footprint Calculator?',
      a: 'Answer: We use peer-reviewed empirical emission factors: Electricity is calculated using the Central Electricity Authority (CEA) India grid average (~0.71 kg CO₂ per kWh). Vehicle fuels use IPCC combustion factors (2.31 kg CO₂/litre for petrol, 2.68 kg CO₂/litre for diesel). Offsetting calculates tree requirements using the US Forest Service benchmark of ~21.77 kg CO₂ sequestered annually by a mature tree.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                College Project Defense & Viva Companion
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prepared for 2nd-Year CSE Presentation & External Examiner Questions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 gap-4 text-sm font-medium">
          <button
            onClick={() => setActiveTab('demo')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'demo'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <PlayCircle className="w-4 h-4" />
            2-Minute Demo Script
          </button>
          <button
            onClick={() => setActiveTab('viva')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'viva'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            5 Likely Viva Questions & Answers
          </button>
          <button
            onClick={() => setActiveTab('improvements')}
            className={`py-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'improvements'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            Limitations & Future Improvements
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                <span className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                  <PlayCircle className="w-4 h-4" /> Recommended Demo Flow (120 Seconds)
                </span>
                <p className="mt-1 text-xs text-emerald-800 dark:text-emerald-300">
                  Follow these 4 steps chronologically while sharing your screen with the project evaluators.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">1</span>
                    0:00 - 0:30 | Introduction & Problem Statement
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                    "Good morning/afternoon respected examiners. Today, environmental metrics are scattered across siloed reports and technical datasets. EcoSense is our unified Environmental Data Analytics Platform built with React and TypeScript. Notice on the Overview dashboard: 100% of the figures you see are fetched live from keyless REST APIs without any mock data."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">2</span>
                    0:30 - 0:60 | Real-Time Air Quality & Carbon Footprint
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                    "Next, navigating to the Air & Carbon Tracker. When I switch cities—say from Kolkata to Delhi or London—we invoke Open-Meteo's API. Notice the 5-day hourly trendline and automated WHO guideline alerts when PM2.5 crosses 15 µg/m³. Below it, the personal carbon footprint calculator models monthly emissions and translates them into mature tree offsets."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                    1:00 - 1:30 | Deforestation Forecasting with Linear Regression
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                    "On the Deforestation page, we stream 30+ years of World Bank indicators. Rather than calling a black-box model, we implement Ordinary Least Squares Linear Regression in JavaScript. The solid line depicts real historical data, while the dotted line projects the next 10 years, classifying risk automatically into Green, Yellow, or Red."
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs flex items-center justify-center font-bold">4</span>
                    1:30 - 2:00 | Public Sentiment & What-If Simulation
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                    "Finally, in Climate Awareness, we track public sentiment from live Reddit and Hacker News posts with browser-based NLP, corroborated with Wikimedia's 90-day search interest. The What-If simulator allows users to model actionable interventions. Thank you, and I look forward to your questions."
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'viva' && (
            <div className="space-y-3.5">
              {vivaQuestions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 relative group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                      {item.q}
                    </h5>
                    <button
                      onClick={() => copyToClipboard(`${item.q}\n${item.a}`, idx)}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer shrink-0"
                      title="Copy Q&A"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-3 border-l-2 border-emerald-500">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'improvements' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs">
                <span className="font-semibold block mb-1">Academic Self-Critique & Honesty</span>
                Examiners love when students frankly acknowledge existing limitations and present structured future scope.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <h6 className="font-bold text-rose-600 dark:text-rose-400 mb-1">1. Atmospheric Modelling vs Local Sensors</h6>
                  <p className="text-slate-600 dark:text-slate-400">
                    Open-Meteo relies on atmospheric chemistry reanalysis models (CAMS/GFS) at a 10km grid resolution. Micro-climates and street canyons require physical IoT nodes (e.g. ESP32 + PMS5003 + MQ-135 sensors).
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <h6 className="font-bold text-rose-600 dark:text-rose-400 mb-1">2. Lexicon NLP vs Transformers</h6>
                  <p className="text-slate-600 dark:text-slate-400">
                    Word-list lexicon sentiment ignores deep sarcasm and complex syntactic context. Future iteration can integrate quantized ONNX transformer models (DistilBERT) via WebAssembly.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <h6 className="font-bold text-rose-600 dark:text-rose-400 mb-1">3. Linear Regression vs Non-Linear Dynamics</h6>
                  <p className="text-slate-600 dark:text-slate-400">
                    Forest depletion often exhibits non-linear tipping points due to policy changes or droughts. Polynomial regression or ARIMA time-series models could improve multi-year forecast confidence.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                  <h6 className="font-bold text-rose-600 dark:text-rose-400 mb-1">4. High-Res Satellite Imagery</h6>
                  <p className="text-slate-600 dark:text-slate-400">
                    World Bank indicators are national annual aggregates. Future enhancement can stream European Space Agency Sentinel-2 MSI multispectral imagery to calculate pixel-level NDVI indices.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer transition-colors shadow-xs"
          >
            Got It, Back to EcoSense
          </button>
        </div>
      </div>
    </div>
  );
};

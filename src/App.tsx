/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * EcoSense: Environmental Data Analytics Platform
 * College CSE 2nd-Year Project
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { OverviewPage } from './components/pages/OverviewPage';
import { AirQualityPage } from './components/pages/AirQualityPage';
import { DeforestationPage } from './components/pages/DeforestationPage';
import { ClimateAwarenessPage } from './components/pages/ClimateAwarenessPage';
import { WhatIfPage } from './components/pages/WhatIfPage';
import { AboutPage } from './components/pages/AboutPage';
import { VivaGuideModal } from './components/common/VivaGuideModal';
import { Leaf, GraduationCap, Github, Heart } from 'lucide-react';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { activeTab, showVivaModal, setShowVivaModal } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />

      {/* Main Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Page Content Container */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'overview' && <OverviewPage />}
          {activeTab === 'air-quality' && <AirQualityPage />}
          {activeTab === 'deforestation' && <DeforestationPage />}
          {activeTab === 'climate-awareness' && <ClimateAwarenessPage />}
          {activeTab === 'what-if' && <WhatIfPage />}
          {activeTab === 'about' && <AboutPage />}
        </main>
      </div>

      {/* Global Viva & Demo Guide Modal */}
      <VivaGuideModal isOpen={showVivaModal} onClose={() => setShowVivaModal(false)} />

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/60 py-4 px-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-emerald-500" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              EcoSense: Environmental Data Analytics Platform
            </span>
            <span>•</span>
            <span>2nd-Year CSE Academic Project</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowVivaModal(true)}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Viva Q&A & Demo Script
            </button>
            <span>•</span>
            <span className="text-[11px]">
              100% Real Keyless APIs: Open-Meteo • World Bank • Reddit/HN • Wikimedia
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

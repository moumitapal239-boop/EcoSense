/**
 * Sidebar Navigation for EcoSense
 * Smooth responsive drawer with college academic badges
 */

import React from 'react';
import { useApp, PageTab } from '../../context/AppContext';
import {
  LayoutDashboard,
  Wind,
  Trees,
  MessageSquareText,
  SlidersHorizontal,
  Info,
  X,
  MapPin,
  Globe,
  Sparkles,
} from 'lucide-react';
import { CITIES, COUNTRIES } from '../../constants';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    activeTab,
    setActiveTab,
    selectedCity,
    setSelectedCity,
    selectedCountry,
    setSelectedCountry,
  } = useApp();

  const navItems: { id: PageTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'air-quality', label: 'Carbon & Air Tracker', icon: Wind, badge: 'Real-time' },
    { id: 'deforestation', label: 'Deforestation Forecast', icon: Trees, badge: 'ML Linear Reg' },
    { id: 'climate-awareness', label: 'Climate Awareness', icon: MessageSquareText, badge: 'NLP Lexicon' },
    { id: 'what-if', label: 'Insights & What-If', icon: SlidersHorizontal },
    { id: 'about', label: 'About / How It Works', icon: Info },
  ];

  const handleSelectTab = (tab: PageTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 h-full md:h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-5 overflow-y-auto">
          {/* Mobile Header with close */}
          <div className="flex md:hidden items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <span className="font-bold text-slate-900 dark:text-white text-base">Navigation</span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Selectors widget inside Sidebar */}
          <div className="space-y-3 p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                Air Quality City
              </label>
              <select
                value={selectedCity.id}
                onChange={(e) => {
                  const found = CITIES.find((c) => c.id === e.target.value);
                  if (found) setSelectedCity(found);
                }}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 shadow-2xs"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}, {c.country}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-teal-500" />
                Forest Analysis Country
              </label>
              <select
                value={selectedCountry.code}
                onChange={(e) => {
                  const found = COUNTRIES.find((c) => c.code === e.target.value);
                  if (found) setSelectedCountry(found);
                }}
                className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 shadow-2xs"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Platform Modules
            </span>
            <div className="pt-1.5 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/25 dark:shadow-emerald-900/30'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          isActive
                            ? 'bg-emerald-600/70 text-emerald-100'
                            : 'bg-slate-200/80 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Bottom Student Academic Card */}
        <div className="p-4 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-sky-500/10 border border-emerald-500/20 dark:border-emerald-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-300">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>College Project Profile</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
              2nd-Year CSE Environmental Analytics. 100% Free Public APIs (Open-Meteo, World Bank, Reddit/HN, Wikimedia).
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

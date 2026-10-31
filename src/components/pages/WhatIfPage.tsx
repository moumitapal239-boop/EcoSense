/**
 * Page 5: INSIGHTS & WHAT-IF SIMULATOR
 * - Sliders:
 *   1. Tree plantation increase % (0 to 50%)
 *   2. Electricity reduction % (0 to 50%)
 *   3. Vehicle emission reduction % (0 to 50%)
 * - Computes new CO2 emissions and projected forest recovery slope
 * - Explains mathematical formulas transparently in simple words
 */

import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  SlidersHorizontal,
  Sparkles,
  TreeDeciduous,
  Zap,
  Car,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { EMISSION_FACTORS } from '../../constants';
import { DataSourceFooter } from '../common/DataSourceFooter';

export const WhatIfPage: React.FC = () => {
  const {
    whatIf,
    setWhatIf,
    carbonResult,
    carbonInput,
    deforestation,
    selectedCountry,
  } = useApp();

  // 1. Calculations based on user's real numbers already in context
  const simulationResults = useMemo(() => {
    // Current baseline values
    const currentMonthlyCO2 = carbonResult.totalMonthlyCO2;
    const currentAnnualCO2 = carbonResult.totalAnnualCO2;

    // Electricity savings: electricityCO2 * (electricityReductionPct / 100)
    const electricitySavedMonthly = Number(
      (carbonResult.electricityCO2 * (whatIf.electricityReductionPct / 100)).toFixed(1)
    );

    // Vehicle fuel savings: fuelCO2 * (vehicleReductionPct / 100)
    const fuelSavedMonthly = Number(
      (carbonResult.fuelCO2 * (whatIf.vehicleReductionPct / 100)).toFixed(1)
    );

    const totalMonthlySaved = Number((electricitySavedMonthly + fuelSavedMonthly).toFixed(1));
    const totalAnnualSaved = Number((totalMonthlySaved * 12).toFixed(1));

    const simulatedMonthlyCO2 = Math.max(0, Number((currentMonthlyCO2 - totalMonthlySaved).toFixed(1)));
    const simulatedAnnualCO2 = Math.max(0, Number((currentAnnualCO2 - totalAnnualSaved).toFixed(1)));

    // Trees offset effect:
    // User plants an extra (treePlantationPct)% more trees relative to baseline trees needed
    const baselineTrees = carbonResult.matureTreesNeeded || 1;
    const additionalTreesPlanted = Math.ceil(baselineTrees * (whatIf.treePlantationPct / 100));
    const additionalCO2SequesteredAnnual = Number(
      (additionalTreesPlanted * EMISSION_FACTORS.TREE_ANNUAL_SEQUESTRATION_KG).toFixed(1)
    );

    const netAnnualCO2Balance = Number(
      (simulatedAnnualCO2 - additionalCO2SequesteredAnnual).toFixed(1)
    );

    // National Forest Trend Improvement:
    // If the country increases tree plantation efforts by (treePlantationPct)%,
    // the annual slope m improves by an estimated delta
    // Baseline slope m (% per year)
    const baselineSlope = deforestation?.regression.slope ?? 0.05;
    // An estimated empirical boost: +0.005% annual forest cover growth per 10% plantation push
    const slopeBoost = Number(((whatIf.treePlantationPct / 10) * 0.005).toFixed(4));
    const simulatedSlope = Number((baselineSlope + slopeBoost).toFixed(4));

    const baseline10YrForecast = deforestation?.regression.forecast[9]?.predictedValue ?? (deforestation?.latestValue ?? 24);
    const simulated10YrForecast = Number((baseline10YrForecast + slopeBoost * 10).toFixed(2));

    const percentCO2Reduction = currentMonthlyCO2 > 0
      ? Math.round((totalMonthlySaved / currentMonthlyCO2) * 100)
      : 0;

    return {
      currentMonthlyCO2,
      simulatedMonthlyCO2,
      totalMonthlySaved,
      totalAnnualSaved,
      percentCO2Reduction,
      additionalTreesPlanted,
      additionalCO2SequesteredAnnual,
      netAnnualCO2Balance,
      baselineSlope,
      simulatedSlope,
      slopeBoost,
      baseline10YrForecast,
      simulated10YrForecast,
    };
  }, [whatIf, carbonResult, deforestation]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Predictive Impact Simulation
        </span>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
          Insights & "What-If" Policy Simulator
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Adjust hypothetical conservation and energy-saving interventions to observe real-time projected carbon reductions and forest trend stabilization.
        </p>
      </div>

      {/* Main Grid: Sliders on left, Results on right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Panel */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-5 shadow-xs space-y-5">
          <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-500" />
              Adjust Intervention Sliders
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Interactive
            </span>
          </div>

          {/* Slider 1: Tree Plantation Increase */}
          <div className="space-y-2 p-3.5 rounded-xl border border-emerald-200/70 dark:border-emerald-800/40 bg-emerald-50/40 dark:bg-emerald-950/20">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
                <TreeDeciduous className="w-4 h-4 text-emerald-600" />
                Tree Plantation Effort
              </label>
              <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                +{whatIf.treePlantationPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={whatIf.treePlantationPct}
              onChange={(e) =>
                setWhatIf((prev) => ({ ...prev, treePlantationPct: Number(e.target.value) }))
              }
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% Baseline</span>
              <span>+25% Moderate Drive</span>
              <span>+50% Aggressive</span>
            </div>
          </div>

          {/* Slider 2: Electricity Reduction */}
          <div className="space-y-2 p-3.5 rounded-xl border border-sky-200/70 dark:border-sky-800/40 bg-sky-50/40 dark:bg-sky-950/20">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-sky-950 dark:text-sky-200 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-sky-600" />
                Electricity Conservation
              </label>
              <span className="font-black text-sky-600 dark:text-sky-400 text-sm">
                -{whatIf.electricityReductionPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={whatIf.electricityReductionPct}
              onChange={(e) =>
                setWhatIf((prev) => ({ ...prev, electricityReductionPct: Number(e.target.value) }))
              }
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% Baseline</span>
              <span>-25% Energy Star</span>
              <span>-50% Deep Efficiency</span>
            </div>
          </div>

          {/* Slider 3: Vehicle Emission Reduction */}
          <div className="space-y-2 p-3.5 rounded-xl border border-amber-200/70 dark:border-amber-800/40 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                <Car className="w-4 h-4 text-amber-600" />
                Vehicle Fuel / Transit Reduction
              </label>
              <span className="font-black text-amber-600 dark:text-amber-400 text-sm">
                -{whatIf.vehicleReductionPct}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={whatIf.vehicleReductionPct}
              onChange={(e) =>
                setWhatIf((prev) => ({ ...prev, vehicleReductionPct: Number(e.target.value) }))
              }
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>0% Baseline</span>
              <span>-25% Carpooling/Bus</span>
              <span>-50% EV / Cycling</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              Dynamic Real Data Link
            </span>
            <p>
              Simulations combine your entered footprint ({carbonResult.totalMonthlyCO2} kg CO₂/mo) and {selectedCountry.name}'s World Bank regression slope ({deforestation?.regression.slope}%/yr).
            </p>
          </div>
        </div>

        {/* Projected Outcome Cards */}
        <div className="lg:col-span-7 space-y-4">
          {/* Carbon Savings Comparison Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
                Simulated Carbon Reduction
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 font-bold">
                {simulationResults.percentCO2Reduction}% Saved Monthly
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-xs">
                <span className="text-[11px] text-emerald-100">Baseline Carbon</span>
                <div className="text-2xl font-black mt-0.5">
                  {simulationResults.currentMonthlyCO2} <span className="text-xs font-normal">kg/mo</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/20 backdrop-blur-xs border border-white/30">
                <span className="text-[11px] text-emerald-100 font-bold">New Simulated Footprint</span>
                <div className="text-2xl font-black mt-0.5 text-emerald-200">
                  {simulationResults.simulatedMonthlyCO2} <span className="text-xs font-normal text-white">kg/mo</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/20 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-50">
              <span className="font-semibold">
                Net Annual Avoided Emissions: {simulationResults.totalAnnualSaved} kg CO₂/yr
              </span>
              <span>
                ≈ +{simulationResults.additionalTreesPlanted} extra trees planted
              </span>
            </div>
          </div>

          {/* Deforestation Trend Improvement Comparison */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-sky-500" />
                  Forest Area Slope Improvement ({selectedCountry.name})
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Impact of +{whatIf.treePlantationPct}% national afforestation push
                </p>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                Slope: {simulationResults.simulatedSlope}%/yr
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Current OLS Baseline Slope</span>
                <span className="text-base font-black text-slate-800 dark:text-slate-200 mt-1 block">
                  {simulationResults.baselineSlope}% / year
                </span>
                <span className="text-[10px] text-slate-400">
                  10-Year Forecast: {simulationResults.baseline10YrForecast}%
                </span>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/30">
                <span className="text-emerald-700 dark:text-emerald-300 block text-[11px] font-semibold">Simulated Intervention Slope</span>
                <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                  +{simulationResults.simulatedSlope}% / year
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400">
                  10-Year Forecast: {simulationResults.simulated10YrForecast}% (+{(simulationResults.simulated10YrForecast - simulationResults.baseline10YrForecast).toFixed(2)}% gain)
                </span>
              </div>
            </div>
          </div>

          {/* Transparent Mathematical Formula Explanation */}
          <div className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Formula & Algorithm Explanation (For Project Evaluation)
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-emerald-700 dark:text-emerald-400 font-bold">
                1. CO₂ Reduction Formula:
              </div>
              <p className="font-mono text-[11px] pl-3">
                ΔCO₂ = (E × 0.71 × r_elec) + (F × factor × r_fuel)
                <br />
                Where: E = {carbonInput.electricityKWh} kWh, F = {carbonInput.fuelLitres}L, r_elec = {whatIf.electricityReductionPct}%, r_fuel = {whatIf.vehicleReductionPct}%
              </p>

              <div className="text-sky-700 dark:text-sky-400 font-bold pt-1">
                2. Slope Adaptation Formula:
              </div>
              <p className="font-mono text-[11px] pl-3">
                m_simulated = m_baseline + (p_trees / 10 × 0.005)
                <br />
                Where: m_baseline = {simulationResults.baselineSlope}, p_trees = {whatIf.treePlantationPct}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <DataSourceFooter
        sourceName="EcoSense Mathematical Simulation Model"
        notes="Grounded in real inputs loaded from Carbon Footprint and World Bank datasets"
      />
    </div>
  );
};

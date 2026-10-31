/**
 * Deforestation Risk Badge Component
 * Categorizes environmental urgency based on Linear Regression Slope (m)
 */

import React from 'react';
import { AlertCircle, ShieldAlert, ShieldCheck } from 'lucide-react';

interface RiskBadgeProps {
  level: 'LOW' | 'MODERATE' | 'HIGH';
  slope: number;
  showExplanation?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  slope,
  showExplanation = false,
}) => {
  const configs = {
    LOW: {
      bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
      icon: ShieldCheck,
      label: 'Low Deforestation Risk',
      subtext: `Stable or expanding forest cover (+${slope.toFixed(3)}%/year)`,
    },
    MODERATE: {
      bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-300 dark:border-amber-800',
      icon: AlertCircle,
      label: 'Moderate Deforestation Risk',
      subtext: `Gradual forest decline (${slope.toFixed(3)}%/year)`,
    },
    HIGH: {
      bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border-rose-300 dark:border-rose-800',
      icon: ShieldAlert,
      label: 'Critical Deforestation Risk',
      subtext: `Severe annual forest depletion (${slope.toFixed(3)}%/year)`,
    },
  };

  const current = configs[level];
  const Icon = current.icon;

  return (
    <div className="inline-flex flex-col">
      <div
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.bg}`}
      >
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span>{current.label}</span>
      </div>
      {showExplanation && (
        <span className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
          {current.subtext}
        </span>
      )}
    </div>
  );
};

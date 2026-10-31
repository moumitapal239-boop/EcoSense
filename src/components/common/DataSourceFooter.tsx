/**
 * Data Source & Timestamp attribution banner
 * Required under every chart for academic rigor and project transparency
 */

import React from 'react';
import { Database, Clock, ExternalLink } from 'lucide-react';

interface DataSourceFooterProps {
  sourceName: string;
  sourceUrl?: string;
  lastUpdated?: string;
  notes?: string;
}

export const DataSourceFooter: React.FC<DataSourceFooterProps> = ({
  sourceName,
  sourceUrl,
  lastUpdated,
  notes,
}) => {
  return (
    <div className="mt-3 pt-2.5 border-t border-slate-200/70 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
      <div className="flex items-center gap-1.5 font-medium">
        <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Data source:</span>
        {sourceUrl ? (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
          >
            {sourceName}
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        ) : (
          <span className="text-slate-700 dark:text-slate-300">{sourceName}</span>
        )}
        {notes && <span className="text-slate-400 dark:text-slate-500">({notes})</span>}
      </div>

      {lastUpdated && (
        <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <Clock className="w-3 h-3 shrink-0" />
          <span>Last updated: {lastUpdated}</span>
        </div>
      )}
    </div>
  );
};

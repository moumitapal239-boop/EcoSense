/**
 * Error Handling Component
 * Displays a clear "Data unavailable" banner with a retry trigger
 * Follows project rule: "Do NOT generate fake or random data"
 */

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Data Unavailable',
  message,
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/70 dark:bg-rose-950/20 p-5 text-rose-800 dark:text-rose-200 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-rose-900 dark:text-rose-100">{title}</h4>
          <p className="mt-1 text-xs text-rose-700/90 dark:text-rose-300/80 leading-relaxed">
            {message}
          </p>
          <p className="mt-2 text-[11px] font-medium text-rose-600 dark:text-rose-400">
            Note: EcoSense strictly adheres to authentic public data and will never inject synthetic or mock numbers.
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying fetch...' : 'Retry Connection'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

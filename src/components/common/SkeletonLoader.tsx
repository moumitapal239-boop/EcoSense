/**
 * Skeleton Loader Component
 * Smooth pulse placeholder during real network requests
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-800/80 ${className}`}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-36" />
      <Skeleton className="h-3 w-48" />
      <div className="pt-2">
        <Skeleton className="h-2 w-full" />
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 shadow-xs space-y-4 min-h-[340px] flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-64" />
        </div>
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="flex items-end gap-2 h-44 pt-6">
        <Skeleton className="h-[40%] flex-1 rounded-t" />
        <Skeleton className="h-[65%] flex-1 rounded-t" />
        <Skeleton className="h-[50%] flex-1 rounded-t" />
        <Skeleton className="h-[80%] flex-1 rounded-t" />
        <Skeleton className="h-[60%] flex-1 rounded-t" />
        <Skeleton className="h-[95%] flex-1 rounded-t" />
        <Skeleton className="h-[75%] flex-1 rounded-t" />
        <Skeleton className="h-[55%] flex-1 rounded-t" />
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  );
};

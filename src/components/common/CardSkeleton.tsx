import React from 'react';

interface CardSkeletonProps {
  compact?: boolean;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({ compact = false }) => {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 animate-pulse flex flex-col ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      {/* Image Skeleton */}
      <div
        className={`w-full rounded-xl bg-slate-200 dark:bg-slate-800 mb-3.5 ${
          compact ? 'aspect-[16/9]' : 'aspect-[16/10]'
        }`}
      />

      {/* Meta skeleton */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>

      {/* Title skeleton */}
      <div className="space-y-1.5 mb-3">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>

      {/* Description skeleton */}
      <div className="space-y-1.5 mb-4 flex-grow">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800/60 rounded" />
        <div className="h-3 w-5/6 bg-slate-100 dark:bg-slate-800/60 rounded" />
      </div>

      {/* Footer skeleton */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
      </div>
    </div>
  );
};

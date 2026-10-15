import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface SourceAlertProps {
  sourceName: string;
  errorMessage?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export const SourceAlert: React.FC<SourceAlertProps> = ({
  sourceName,
  errorMessage = 'Failed to load source content.',
  onRetry,
  isRetrying = false,
}) => {
  return (
    <div
      role="alert"
      className="flex items-center justify-between p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 my-3"
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-3">
        <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <span className="truncate">
          <strong>{sourceName} Feed:</strong> {errorMessage}
        </span>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700 hover:bg-amber-50 dark:hover:bg-slate-700 transition-colors flex-shrink-0 disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Retrying...' : 'Retry'}</span>
        </button>
      )}
    </div>
  );
};

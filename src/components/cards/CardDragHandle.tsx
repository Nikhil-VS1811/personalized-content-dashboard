'use client';

import React from 'react';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';

interface CardDragHandleProps {
  cardId: string;
  cardTitle: string;
  currentIndex: number;
  totalCount: number;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isDragging?: boolean;
  dragListeners?: any;
}

export const CardDragHandle: React.FC<CardDragHandleProps> = ({
  cardId,
  cardTitle,
  currentIndex,
  totalCount,
  onMoveUp,
  onMoveDown,
  isDragging = false,
  dragListeners,
}) => {
  const canMoveUp = currentIndex > 0;
  const canMoveDown = currentIndex < totalCount - 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (canMoveUp) onMoveUp();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      if (canMoveDown) onMoveDown();
    }
  };

  return (
    <div className="flex items-center gap-1">
      {/* Explicit Drag Handle (Only this handle has touch-action: none so page scrolling is never blocked) */}
      <div
        role="button"
        tabIndex={0}
        {...dragListeners}
        onKeyDown={handleKeyDown}
        aria-label={`Reorder card: ${cardTitle}. Position ${currentIndex + 1} of ${totalCount}. Press Arrow Up or Down to reorder.`}
        title="Drag or press Arrow Up/Down to reorder card"
        className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-grab active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600 select-none ${
          isDragging ? 'cursor-grabbing text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60' : ''
        }`}
        style={{ touchAction: 'none' }}
      >
        <GripVertical className="w-4 h-4 pointer-events-none" aria-hidden="true" />
      </div>

      {/* Accessible Quick Step Reorder Buttons */}
      <div className="flex items-center gap-0.5 opacity-70 hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={!canMoveUp}
          aria-label={`Move ${cardTitle} up to position ${currentIndex}`}
          title="Move card up"
          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={!canMoveDown}
          aria-label={`Move ${cardTitle} down to position ${currentIndex + 2}`}
          title="Move card down"
          className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowDown className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

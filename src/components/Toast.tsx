'use client';

import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useMarbleStore } from '@/lib/store';

export default function Toast() {
  const { state, dispatch } = useMarbleStore();

  if (!state.toastMessage) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm bg-emerald-500 text-stone-950 px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-2 text-sm font-bold border border-emerald-300"
    >
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>{state.toastMessage}</span>
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => dispatch({ type: 'SHOW_TOAST', message: null })}
        className="p-1 rounded-lg hover:bg-emerald-600/30 transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

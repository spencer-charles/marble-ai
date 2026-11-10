'use client';

import React from 'react';
import {
  HardHat,
  CheckSquare,
  Square,
  Image as ImageIcon,
  Camera,
  CheckCircle2
} from 'lucide-react';
import { useMarbleStore } from '@/lib/store';

export default function CrewChecklist() {
  const { currentJob, dispatch } = useMarbleStore();

  return (
    <div className="space-y-4">
      <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-4">
        <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <HardHat className="w-4 h-4" />
          On-Site Craftsman SOP Checklist &amp; Photo Proof
        </div>
        <p className="text-sm text-stone-300 mt-1">
          Check off completed diamond passes and log Before/After reflection checks for{' '}
          <strong className="text-stone-100">{currentJob.client}</strong>.
        </p>
      </div>

      {/* Diamond Grit & Chemical Execution Checklist */}
      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
            Assigned Job Execution Checklist
          </span>
          <span className="text-xs font-bold text-emerald-400">
            {currentJob.checklist.filter((i) => i.done).length} / {currentJob.checklist.length}{' '}
            Done
          </span>
        </div>

        <div className="space-y-2">
          {currentJob.checklist.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => dispatch({ type: 'TOGGLE_CHECKLIST', itemId: item.id })}
              className={`min-h-12 w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                item.done
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-stone-400'
                  : 'bg-stone-950 border-stone-800 text-stone-100 hover:border-stone-700'
              }`}
            >
              {item.done ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <span className={`text-sm ${item.done ? 'line-through' : 'font-semibold'}`}>
                {item.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Before / After Photo Log Verification */}
      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            Before / After Gloss Verification Log
          </span>
        </div>

        {currentJob.beforeAfterPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-stone-950 rounded-xl p-3.5 border border-stone-800 space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-stone-100">{photo.area}</span>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                  photo.afterLogged
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {photo.afterLogged ? 'Before + After Logged' : 'Awaiting After Photo'}
              </span>
            </div>
            <p className="text-xs text-stone-400">{photo.notes}</p>
            {!photo.afterLogged ? (
              <button
                type="button"
                onClick={() => dispatch({ type: 'LOG_AFTER_PHOTO', photoId: photo.id })}
                className="min-h-11 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                Log &ldquo;After&rdquo; Reflection Photo Check
              </button>
            ) : (
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Logged to Customer Job Record
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

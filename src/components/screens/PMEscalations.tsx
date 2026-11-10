'use client';

import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Check
} from 'lucide-react';
import { formatRelativeTime } from '@/lib/helpers';
import { useMarbleStore } from '@/lib/store';
import { EscalationItem } from '@/types/marble';

export default function PMEscalations() {
  const { state, dispatch } = useMarbleStore();
  const { escalations, jobs } = state;

  const [notesByEscId, setNotesByEscId] = useState<Record<string, string>>({});

  const handleResolve = (
    esc: EscalationItem,
    resolution: 'Approved' | 'Rejected' | 'Question Sent to Crew'
  ) => {
    const note = notesByEscId[esc.id] || '';
    dispatch({
      type: 'RESOLVE_ESCALATION',
      escalationId: esc.id,
      resolution,
      note
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-4">
        <div className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4" />
          PM Dispatch &amp; Field Escalation Queue
        </div>
        <p className="text-sm text-stone-300 mt-1">
          Review field escalations that impact job scope or schedule. Approve, reject, or send a
          clarifying question back to the crew on the job timeline.
        </p>
      </div>

      <div className="space-y-3.5">
        {escalations.map((esc) => {
          const isPending = esc.status === 'Pending PM Approval';
          const escJob = jobs.find((j) => j.id === esc.jobId);
          const assignedPmName = escJob?.pm || 'Elena Rostova';

          return (
            <div
              key={esc.id}
              className={`rounded-2xl p-4 border space-y-3 ${
                !isPending
                  ? 'bg-stone-900/70 border-stone-800'
                  : 'bg-stone-900 border-amber-500/60 shadow-lg'
              }`}
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-lg ${
                    esc.status === 'Approved'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : esc.status === 'Rejected'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : esc.status === 'Question Sent to Crew'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      : 'bg-amber-500 text-stone-950'
                  }`}
                >
                  {esc.status}
                </span>
                <span className="text-xs text-stone-400">
                  {formatRelativeTime(esc.createdAt)} • PM: {assignedPmName}
                </span>
              </div>

              <div>
                <div className="text-xs font-bold text-stone-400">{esc.jobTitle}</div>
                <div className="text-base font-extrabold text-stone-100 mt-0.5">
                  {esc.issueTitle}
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-sm space-y-1.5">
                <div className="flex justify-between gap-2">
                  <span className="text-stone-400">Logged By:</span>
                  <span className="font-semibold text-stone-200">{esc.craftsman}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-stone-400">Proposed SOP Fix:</span>
                  <span className="font-semibold text-amber-300 text-right">
                    {esc.recommendedFix}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-stone-400">Schedule Impact:</span>
                  <span className="font-semibold text-red-300">{esc.impact}</span>
                </div>
              </div>

              {isPending ? (
                <div className="space-y-2.5 pt-1">
                  <input
                    type="text"
                    value={notesByEscId[esc.id] || ''}
                    onChange={(e) =>
                      setNotesByEscId((prev) => ({ ...prev, [esc.id]: e.target.value }))
                    }
                    placeholder="Optional PM instruction or question for crew..."
                    className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm rounded-xl px-3.5 py-2 border border-stone-700"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleResolve(esc, 'Approved')}
                      className="min-h-11 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Approve Fix
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResolve(esc, 'Question Sent to Crew')}
                      className="min-h-11 py-2.5 px-3 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-4 h-4 shrink-0" />
                      Ask Crew Question
                    </button>

                    <button
                      type="button"
                      onClick={() => handleResolve(esc, 'Rejected')}
                      className="min-h-11 py-2.5 px-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 shrink-0" />
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 pt-1">
                  {esc.pmResponseNote && (
                    <p className="text-xs text-stone-300 bg-stone-950 p-2.5 rounded-lg border border-stone-800">
                      <strong>PM Note ({assignedPmName}):</strong> {esc.pmResponseNote}
                    </p>
                  )}
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    Logged to {esc.jobTitle.split(' — ')[0]} Timeline by {assignedPmName}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import {
  FileText,
  Camera,
  ClipboardCheck,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { useMarbleStore } from '@/lib/store';
import { MobileTabType } from '@/types/marble';

interface BottomNavProps {
  inPhoneFrame?: boolean;
}

export default function BottomNav({ inPhoneFrame = false }: BottomNavProps) {
  const { state, dispatch } = useMarbleStore();
  const { activeTab, activeRole, escalations, knowledgeEntries, corrections, unansweredQuestions } =
    state;

  const pendingEscalations = escalations.filter(
    (e) => e.status === 'Pending PM Approval'
  ).length;

  const pendingOwnerItems =
    knowledgeEntries.filter((e) => e.status === 'draft').length +
    corrections.filter((c) => c.status === 'pending').length +
    unansweredQuestions.filter((q) => q.status === 'open').length;

  const setTab = (tab: MobileTabType) => {
    dispatch({ type: 'SET_TAB', tab });
  };

  const roleActionLabel =
    activeRole === 'sales'
      ? 'Intake & Bid'
      : activeRole === 'craftsman'
      ? 'Checklist'
      : activeRole === 'pm'
      ? 'Escalations'
      : 'Owner KB';

  const RoleIcon = activeRole === 'owner' ? BookOpen : ClipboardCheck;

  return (
    <nav
      aria-label="Primary app navigation"
      className={
        inPhoneFrame
          ? 'bg-stone-950 rounded-b-[32px] border-t border-stone-800 px-2.5 py-2 grid grid-cols-4 gap-1.5'
          : 'fixed bottom-0 inset-x-0 z-30 bg-stone-950/95 backdrop-blur-md border-t border-stone-800 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] grid grid-cols-4 gap-1.5 lg:static lg:rounded-2xl lg:border lg:mt-4'
      }
    >
      <button
        type="button"
        onClick={() => setTab('record')}
        className={`min-h-12 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'record'
            ? 'bg-stone-800 text-amber-400 font-bold'
            : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <FileText className="w-4 h-4 mb-1 shrink-0" />
        <span className="text-xs leading-tight">Job</span>
      </button>

      <button
        type="button"
        onClick={() => setTab('troubleshoot')}
        className={`min-h-12 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'troubleshoot'
            ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
            : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <Camera className="w-4 h-4 mb-1 shrink-0" />
        <span className="text-xs leading-tight">Diagnose</span>
      </button>

      <button
        type="button"
        onClick={() => setTab('role-action')}
        className={`min-h-12 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer relative ${
          activeTab === 'role-action'
            ? 'bg-stone-800 text-emerald-400 font-bold'
            : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <RoleIcon className="w-4 h-4 mb-1 shrink-0" />
        <span className="text-xs leading-tight truncate max-w-full">{roleActionLabel}</span>
        {activeRole === 'pm' && pendingEscalations > 0 && (
          <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-3" />
        )}
        {activeRole === 'owner' && pendingOwnerItems > 0 && (
          <span className="w-2 h-2 rounded-full bg-purple-400 absolute top-1.5 right-3" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setTab('ask')}
        className={`min-h-12 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all cursor-pointer ${
          activeTab === 'ask'
            ? 'bg-stone-800 text-sky-400 font-bold'
            : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <HelpCircle className="w-4 h-4 mb-1 shrink-0" />
        <span className="text-xs leading-tight">Ask</span>
      </button>
    </nav>
  );
}

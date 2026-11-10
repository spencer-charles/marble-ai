'use client';

import React from 'react';
import {
  Briefcase,
  HardHat,
  UserCheck,
  BookOpen,
  Layers,
  Smartphone,
  Monitor,
  RotateCcw,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { useMarbleStore } from '@/lib/store';
import { RoleType } from '@/types/marble';

export default function RoleSwitcher() {
  const { state, dispatch, resetDemo } = useMarbleStore();
  const {
    theme,
    activeRole,
    desktopFrameMode,
    escalations,
    knowledgeEntries,
    corrections,
    unansweredQuestions
  } = state;

  const toggleTheme = () => {
    dispatch({
      type: 'SET_THEME',
      theme: theme === 'light' ? 'dark' : 'light'
    });
  };

  const pendingEscalationCount = escalations.filter(
    (e) => e.status === 'Pending PM Approval'
  ).length;

  const ownerQueueCount =
    knowledgeEntries.filter((e) => e.status === 'draft').length +
    corrections.filter((c) => c.status === 'pending').length +
    unansweredQuestions.filter((q) => q.status === 'open').length;

  const handleRoleChange = (role: RoleType) => {
    dispatch({ type: 'SET_ROLE', role });
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 px-4 py-2.5 shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black shadow-md shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-stone-100 truncate">
              Marble AI
            </h1>
            <p className="text-xs text-stone-400 hidden sm:block truncate">
              Stone Restoration Job Record &amp; Knowledge Base
            </p>
          </div>
        </div>

        {/* Mobile Compact Role Picker (< 1024px) */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="relative">
            <label htmlFor="compact-role-picker" className="sr-only">
              Active Role
            </label>
            <select
              id="compact-role-picker"
              value={activeRole}
              onChange={(e) => handleRoleChange(e.target.value as RoleType)}
              className="min-h-11 appearance-none bg-stone-950 text-stone-100 text-sm font-bold rounded-xl pl-3 pr-8 py-2 border border-stone-700 focus:outline-none focus:border-amber-500"
            >
              <option value="sales">Role: Sales / Estimator</option>
              <option value="craftsman">Role: Field Craftsman</option>
              <option value="pm">
                Role: Project Manager {pendingEscalationCount > 0 ? `(${pendingEscalationCount})` : ''}
              </option>
              <option value="owner">
                Role: Owner / GM {ownerQueueCount > 0 ? `(${ownerQueueCount} review)` : ''}
              </option>
            </select>
            <ChevronDown className="w-4 h-4 text-amber-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            aria-label={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
            className="min-h-11 min-w-11 flex items-center justify-center rounded-xl bg-stone-950 text-stone-200 hover:text-stone-100 border border-stone-800 cursor-pointer"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-stone-300" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          <button
            type="button"
            onClick={resetDemo}
            title="Reset demo data"
            aria-label="Reset demo data"
            className="min-h-11 min-w-11 flex items-center justify-center rounded-xl bg-stone-950 text-stone-300 hover:text-stone-100 border border-stone-800 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Desktop Full Role Switcher Bar (>= 1024px) */}
        <div className="hidden lg:flex items-center gap-2">
          <div
            role="group"
            aria-label="Switch active role"
            className="flex items-center gap-1.5 bg-stone-950 p-1.5 rounded-xl border border-stone-800"
          >
            <button
              type="button"
              onClick={() => handleRoleChange('sales')}
              className={`min-h-11 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'sales'
                  ? 'bg-sky-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div>1. Sales / Estimator</div>
                <div className={`text-[11px] ${activeRole === 'sales' ? 'text-stone-900' : 'text-stone-400'}`}>
                  Intake &amp; Bid
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('craftsman')}
              className={`min-h-11 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'craftsman'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <HardHat className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div>2. Field Craftsman</div>
                <div
                  className={`text-[11px] ${
                    activeRole === 'craftsman' ? 'text-stone-900' : 'text-stone-400'
                  }`}
                >
                  Diagnose &amp; Checklist
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('pm')}
              className={`min-h-11 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'pm'
                  ? 'bg-emerald-500 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span>3. Project Manager</span>
                  {pendingEscalationCount > 0 && (
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                        activeRole === 'pm'
                          ? 'bg-stone-950 text-emerald-400'
                          : 'bg-amber-500 text-stone-950'
                      }`}
                    >
                      {pendingEscalationCount}
                    </span>
                  )}
                </div>
                <div className={`text-[11px] ${activeRole === 'pm' ? 'text-stone-900' : 'text-stone-400'}`}>
                  Escalations &amp; Record
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange('owner')}
              className={`min-h-11 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'owner'
                  ? 'bg-purple-400 text-stone-950 shadow-sm'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span>4. Owner / GM</span>
                  {ownerQueueCount > 0 && (
                    <span
                      className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold leading-none ${
                        activeRole === 'owner'
                          ? 'bg-stone-950 text-purple-300'
                          : 'bg-purple-500/30 text-purple-200 border border-purple-400/40'
                      }`}
                    >
                      {ownerQueueCount}
                    </span>
                  )}
                </div>
                <div
                  className={`text-[11px] ${
                    activeRole === 'owner' ? 'text-stone-900' : 'text-stone-400'
                  }`}
                >
                  Capture &amp; Approve KB
                </div>
              </div>
            </button>
          </div>

          {/* Theme, Desktop Frame Mode & Reset */}
          <div className="flex items-center gap-1.5 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
            <button
              type="button"
              onClick={toggleTheme}
              title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Warm Parchment Light Theme'}
              aria-label={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Warm Parchment Light Theme'}
              className="min-h-11 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:bg-stone-900 hover:text-stone-100 transition-colors cursor-pointer"
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span>Dark</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: 'SET_DESKTOP_FRAME_MODE',
                  mode: desktopFrameMode === 'framed' ? 'full' : 'framed'
                })
              }
              title="Toggle desktop phone preview frame"
              className="min-h-11 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-300 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
            >
              {desktopFrameMode === 'framed' ? (
                <>
                  <Monitor className="w-4 h-4 text-sky-400" />
                  <span>Full View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-4 h-4 text-amber-400" />
                  <span>Phone Demo</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetDemo}
              title="Reset demo state"
              className="min-h-11 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-400 hover:bg-stone-900 hover:text-stone-100 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

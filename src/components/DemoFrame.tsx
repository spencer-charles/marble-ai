'use client';

import React from 'react';
import {
  Briefcase,
  HardHat,
  UserCheck,
  BookOpen,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useMarbleStore } from '@/lib/store';
import { getActorNameForJob, getStatusBadgeClasses } from '@/lib/helpers';
import BottomNav from '@/components/BottomNav';
import { RoleType } from '@/types/marble';

interface DemoFrameProps {
  children: React.ReactNode;
}

const ROLE_STAGES: {
  role: RoleType;
  title: string;
  tag: string;
  colorClass: string;
  activeBorderClass: string;
  summary: string;
}[] = [
  {
    role: 'sales',
    title: '1. Sales / Estimator',
    tag: 'Pre-Job',
    colorClass: 'text-sky-400',
    activeBorderClass: 'bg-sky-500/10 border-sky-500/50',
    summary:
      'Logs HCl acid drop test, Tramex moisture %, and lippage, then calculates hours, chemicals, and a draft proposal.'
  },
  {
    role: 'craftsman',
    title: '2. Field Craftsman',
    tag: 'On-Site',
    colorClass: 'text-amber-400',
    activeBorderClass: 'bg-amber-500/10 border-amber-500/50',
    summary:
      'Attaches site photos, answers clarifying checks to pull up SOP steps, logs checklist progress, or flags corrections.'
  },
  {
    role: 'pm',
    title: '3. Project Manager',
    tag: 'Dispatch',
    colorClass: 'text-emerald-400',
    activeBorderClass: 'bg-emerald-500/10 border-emerald-500/50',
    summary:
      'Reviews field escalations (approve, reject, or ask crew a question) and monitors the shared job record.'
  },
  {
    role: 'owner',
    title: '4. Owner / GM',
    tag: 'Knowledge Base',
    colorClass: 'text-purple-300',
    activeBorderClass: 'bg-purple-500/10 border-purple-500/50',
    summary:
      'Answers daily capture prompts by voice or text, reviews crew corrections, and approves Draft SOPs.'
  }
];

export default function DemoFrame({ children }: DemoFrameProps) {
  const { state, currentJob, dispatch } = useMarbleStore();
  const { activeRole, jobs, selectedJobId, desktopFrameMode } = state;

  const activePersonName = getActorNameForJob(activeRole, currentJob);

  const JobHeaderBar = () => (
    <div className="bg-stone-950 px-4 pt-3 pb-3 border-b border-stone-800">
      {/* Role Context Pill */}
      <div className="flex items-center justify-between mb-2.5 gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
              activeRole === 'sales'
                ? 'bg-sky-400'
                : activeRole === 'craftsman'
                ? 'bg-amber-400'
                : activeRole === 'pm'
                ? 'bg-emerald-400'
                : 'bg-purple-400'
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
            {activeRole === 'sales' && 'Sales / Estimator Mode'}
            {activeRole === 'craftsman' && 'Field Craftsman Mode'}
            {activeRole === 'pm' && 'Project Manager Mode'}
            {activeRole === 'owner' && 'Owner / GM Knowledge Mode'}
          </span>
        </div>
        <span className="text-xs text-stone-300 bg-stone-900 px-2.5 py-0.5 rounded-lg border border-stone-800 truncate">
          {activePersonName}
        </span>
      </div>

      {/* Active Job Selector Dropdown */}
      <div className="relative">
        <label
          htmlFor="active-job-selector"
          className="block text-xs font-semibold text-stone-400 mb-1"
        >
          Customer Job Record
        </label>
        <div className="relative">
          <select
            id="active-job-selector"
            value={selectedJobId}
            onChange={(e) => dispatch({ type: 'SET_JOB', jobId: e.target.value })}
            className="min-h-11 w-full appearance-none bg-stone-900 hover:bg-stone-800/90 text-stone-100 text-sm font-bold rounded-xl pl-3.5 pr-9 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.client} — {j.title}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Quick Address & Status Strip */}
      <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-stone-900 text-xs">
        <span className="text-stone-400 flex items-center gap-1.5 truncate">
          <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span className="truncate">{currentJob.address}</span>
        </span>
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-bold shrink-0 ${getStatusBadgeClasses(
            currentJob.statusColor
          )}`}
        >
          {currentJob.status}
        </span>
      </div>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto lg:px-4 lg:pt-6">
      {/* MOBILE / TABLET NATIVE FULL-SCREEN LAYOUT (< 1024px) */}
      <div className="lg:hidden min-h-[calc(100vh-3.75rem)] flex flex-col bg-stone-950 pb-24">
        <JobHeaderBar />
        <div className="flex-1 px-4 py-4">{children}</div>
        <BottomNav inPhoneFrame={false} />
      </div>

      {/* DESKTOP LAYOUT (>= 1024px) */}
      <div className="hidden lg:block pb-12">
        {desktopFrameMode === 'framed' ? (
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left Column: Concise Role Guide & Job Switcher */}
            <aside className="col-span-5 space-y-5">
              <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <h2 className="text-base font-bold text-stone-100 mb-1">
                  Role Handoffs &amp; Knowledge Loop
                </h2>
                <p className="text-sm text-stone-400 leading-relaxed mb-4">
                  Select any role below to inspect how job data, estimates, field escalations, and
                  Owner-approved SOPs flow across the team.
                </p>

                <div className="space-y-2.5">
                  {ROLE_STAGES.map((stage) => {
                    const isActive = activeRole === stage.role;
                    const Icon =
                      stage.role === 'sales'
                        ? Briefcase
                        : stage.role === 'craftsman'
                        ? HardHat
                        : stage.role === 'pm'
                        ? UserCheck
                        : BookOpen;
                    return (
                      <button
                        key={stage.role}
                        type="button"
                        onClick={() => dispatch({ type: 'SET_ROLE', role: stage.role })}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer block ${
                          isActive
                            ? stage.activeBorderClass
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-bold flex items-center gap-2 ${stage.colorClass}`}>
                            <Icon className="w-4 h-4 shrink-0" />
                            {stage.title}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                            {stage.tag}
                          </span>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">{stage.summary}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active Customer Job Switcher */}
              <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                  Customer Job Records ({jobs.length})
                </h3>
                <div className="space-y-2">
                  {jobs.map((job) => (
                    <button
                      key={job.id}
                      type="button"
                      onClick={() => dispatch({ type: 'SET_JOB', jobId: job.id })}
                      className={`min-h-12 w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selectedJobId === job.id
                          ? 'bg-stone-800 border-amber-500/60 shadow-md'
                          : 'bg-stone-950/50 border-stone-800/80 hover:bg-stone-900'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-stone-100 truncate">
                          {job.client}
                        </div>
                        <div className="text-xs text-stone-400 truncate">{job.title}</div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${getStatusBadgeClasses(
                          job.statusColor
                        )}`}
                      >
                        {job.timeline.length} logs
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Right Column: Clean Desktop Demo Phone Viewport (No fake clock/5G) */}
            <div className="col-span-7 flex justify-center">
              <div className="w-full max-w-[440px] bg-stone-900 rounded-[40px] p-3 border-[5px] border-stone-800 shadow-2xl">
                <div className="rounded-t-[32px] overflow-hidden">
                  <JobHeaderBar />
                </div>
                <div className="bg-stone-950 h-[620px] overflow-y-auto px-4 py-4">
                  {children}
                </div>
                <BottomNav inPhoneFrame={true} />
              </div>
            </div>
          </div>
        ) : (
          /* Desktop Full-Width View Mode */
          <div className="max-w-3xl mx-auto bg-stone-900/60 border border-stone-800 rounded-2xl overflow-hidden shadow-xl">
            <JobHeaderBar />
            <div className="p-6">{children}</div>
            <div className="px-6 pb-6">
              <BottomNav inPhoneFrame={false} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

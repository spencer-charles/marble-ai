'use client';

import React, { useState, useEffect } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Wrench,
  Sparkles,
  Send,
  ShieldAlert,
  Clock,
  MapPin,
  Layers,
  Droplets,
  CheckSquare,
  Square,
  BookOpen,
  UserCheck,
  Briefcase,
  HardHat,
  Check,
  ChevronDown,
  Image as ImageIcon,
  ClipboardCheck,
  MessageSquare,
  Smartphone,
  Monitor,
  RotateCcw,
  FlaskConical,
  Lock
} from 'lucide-react';
import {
  DiagnosticScenario,
  EscalationItem,
  JobRecord,
  MobileTabType,
  RingGraphicType,
  RoleType,
  TimelineEntry
} from '@/types/marble';
import {
  DIAGNOSTIC_SCENARIOS,
  INITIAL_ESCALATIONS,
  INITIAL_JOBS,
  SYMPTOM_TAGS
} from '@/data/mockData';

const STORAGE_KEY_JOBS = 'marble_ai_jobs_v1';
const STORAGE_KEY_ESCALATIONS = 'marble_ai_escalations_v1';

export default function MarbleAIApp() {
  // Top-level Role & Job State
  const [activeRole, setActiveRole] = useState<RoleType>('craftsman');
  const [jobs, setJobs] = useState<JobRecord[]>(INITIAL_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>('job-1');
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTabType>('troubleshoot');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'framed' | 'native'>('framed');
  const [timelineFilter, setTimelineFilter] = useState<'ALL' | 'Sales' | 'Craftsman' | 'PM'>('ALL');
  const [isHydrated, setIsHydrated] = useState(false);

  // Troubleshooter State
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('diag-1');
  const [selectedTags, setSelectedTags] = useState<string[]>(['White haze', 'Water rings']);
  const [customSymptomText, setCustomSymptomText] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosticScenario>(
    DIAGNOSTIC_SCENARIOS[0]
  );
  const [checkedSopSteps, setCheckedSopSteps] = useState<Record<number, boolean>>({ 0: true });

  // Quick Note / Grit Log State (Job Record View)
  const [quickNoteText, setQuickNoteText] = useState<string>('');
  const [quickStepBadge, setQuickStepBadge] = useState<string>('400-Grit Resin Pass');

  // Sales Intake Form State
  const [salesForm, setSalesForm] = useState({
    acidTest: 'Positive - Calcite Fizz (Marble/Travertine)',
    moisturePct: '4.2',
    lippageLevel: 'Moderate (1.0 - 2.0mm - Needs Metal Cut)',
    expectationNote:
      'Advised client that deep iron veins are geological features, while surface etch and lippage will be 95%+ eliminated.',
    containmentRequired: true
  });

  // Escalation Queue State for PM
  const [escalations, setEscalations] = useState<EscalationItem[]>(INITIAL_ESCALATIONS);

  // Hydrate persisted state safely on client mount (prevents SSR hydration mismatch)
  useEffect(() => {
    try {
      const savedJobs = localStorage.getItem(STORAGE_KEY_JOBS);
      const savedEsc = localStorage.getItem(STORAGE_KEY_ESCALATIONS);
      if (savedJobs) {
        const parsedJobs = JSON.parse(savedJobs);
        if (Array.isArray(parsedJobs) && parsedJobs.length > 0) {
          setJobs(parsedJobs);
        }
      }
      if (savedEsc) {
        const parsedEsc = JSON.parse(savedEsc);
        if (Array.isArray(parsedEsc) && parsedEsc.length > 0) {
          setEscalations(parsedEsc);
        }
      }
    } catch {
      // Ignore storage errors in restricted environments
    }
    setIsHydrated(true);
  }, []);

  // Save state changes to localStorage after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
      localStorage.setItem(STORAGE_KEY_ESCALATIONS, JSON.stringify(escalations));
    } catch {
      // Ignore storage quota errors
    }
  }, [jobs, escalations, isHydrated]);

  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // Helper to show a sleek floating toast inside the mobile viewport
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3400);
  };

  // Reset demo data back to initial state
  const handleResetDemo = () => {
    setJobs(INITIAL_JOBS);
    setEscalations(INITIAL_ESCALATIONS);
    setSelectedJobId('job-1');
    setSelectedScenarioId('diag-1');
    setDiagnosisResult(DIAGNOSTIC_SCENARIOS[0]);
    setSelectedTags(DIAGNOSTIC_SCENARIOS[0].defaultTags);
    setCheckedSopSteps({ 0: true });
    try {
      localStorage.removeItem(STORAGE_KEY_JOBS);
      localStorage.removeItem(STORAGE_KEY_ESCALATIONS);
    } catch {
      // Ignore
    }
    triggerToast('Marble AI demo data reset to initial state');
  };

  // Switch role and smartly set a relevant default tab if desired, while allowing free navigation
  const handleRoleSwitch = (newRole: RoleType) => {
    setActiveRole(newRole);
    if (newRole === 'craftsman') {
      setActiveMobileTab('troubleshoot');
    } else if (newRole === 'sales') {
      setActiveMobileTab('role-action');
    } else if (newRole === 'pm') {
      setActiveMobileTab('role-action');
    }
  };

  // Handle selecting a preset scenario in AI Troubleshooter
  const handleSelectScenario = (scenario: DiagnosticScenario) => {
    setSelectedScenarioId(scenario.id);
    setSelectedTags(scenario.defaultTags);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setDiagnosisResult(scenario);
      setCheckedSopSteps({ 0: true });
    }, 380);
  };

  // Toggle symptom tags
  const toggleSymptomTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Run Knowledge Base Diagnosis button
  const handleRunDiagnosis = () => {
    setIsAnalyzing(true);
    const matched =
      DIAGNOSTIC_SCENARIOS.find((d) => d.id === selectedScenarioId) || DIAGNOSTIC_SCENARIOS[0];
    setTimeout(() => {
      setIsAnalyzing(false);
      setDiagnosisResult(matched);
      setCheckedSopSteps({ 0: true });
      triggerToast(`Marble AI Diagnosis: ${matched.confidence}`);
    }, 480);
  };

  // Log diagnosis to Shared Job Timeline
  const handleLogDiagnosisToRecord = () => {
    if (!diagnosisResult) return;
    const completedStepCount = Object.values(checkedSopSteps).filter(Boolean).length;
    const totalStepCount = diagnosisResult.crewSteps.length;
    const symptomSummary =
      selectedTags.length > 0 ? `Symptoms: ${selectedTags.join(', ')}. ` : '';
    const customNote = customSymptomText.trim() ? `Field Note: "${customSymptomText.trim()}". ` : '';

    const newEntry: TimelineEntry = {
      id: `t-${Date.now()}`,
      time: 'Just now',
      role: activeRole === 'sales' ? 'Sales' : activeRole === 'pm' ? 'PM' : 'Craftsman',
      author:
        activeRole === 'sales'
          ? currentJob.salesRep
          : activeRole === 'pm'
          ? currentJob.pm
          : currentJob.leadCraftsman.split(' (')[0] || 'Field Tech',
      type: 'ai-diag',
      title: `AI Troubleshooter Logged: ${diagnosisResult.shortTitle}`,
      text: `${symptomSummary}${customNote}Executing SOP: ${diagnosisResult.recommendedGrit} (${completedStepCount}/${totalStepCount} steps checked). Root cause: ${diagnosisResult.rootCause.slice(0, 110)}...`,
      badge: diagnosisResult.recommendedGrit
    };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === currentJob.id ? { ...j, timeline: [newEntry, ...j.timeline] } : j
      )
    );
    setCustomSymptomText('');
    triggerToast('Logged SOP & grit progression to Shared Job Timeline');
    setActiveMobileTab('record');
  };

  // Escalate Diagnosis to PM Queue & Timeline
  const handleEscalateToPM = () => {
    if (!diagnosisResult) return;
    const newEsc: EscalationItem = {
      id: `esc-${Date.now()}`,
      jobId: currentJob.id,
      jobTitle: `${currentJob.client} — ${currentJob.title.split(' ').slice(-2).join(' ')}`,
      craftsman: currentJob.leadCraftsman,
      time: 'Just now',
      issueTitle: diagnosisResult.fullTitle,
      impact: diagnosisResult.estTimeImpact,
      recommendedFix: diagnosisResult.recommendedGrit,
      status: 'Pending PM Approval',
      customerNotified: false
    };

    const newTimelineEntry: TimelineEntry = {
      id: `t-esc-${Date.now()}`,
      time: 'Just now',
      role: 'Craftsman',
      author: currentJob.leadCraftsman.split(' (')[0] || 'Field Tech',
      type: 'escalation',
      title: `Escalated to PM: ${diagnosisResult.shortTitle}`,
      text: `Flagged ${diagnosisResult.estTimeImpact} schedule impact (${selectedTags.join(', ')}). Waiting on PM approval for ${diagnosisResult.recommendedGrit}.`,
      badge: 'Escalated to PM'
    };

    setEscalations((prev) => [newEsc, ...prev]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === currentJob.id
          ? {
              ...j,
              status: 'Escalation Review',
              statusColor: 'amber',
              timeline: [newTimelineEntry, ...j.timeline]
            }
          : j
      )
    );
    triggerToast('Escalation sent to PM Queue & logged on Customer Record!');
  };

  // Add Quick Handoff Note / Chemical-Grit step to Timeline
  const handleAddQuickTimelineNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteText.trim()) return;

    const roleLabel: 'Sales' | 'PM' | 'Craftsman' =
      activeRole === 'sales' ? 'Sales' : activeRole === 'pm' ? 'PM' : 'Craftsman';
    const authorName =
      activeRole === 'sales'
        ? currentJob.salesRep
        : activeRole === 'pm'
        ? currentJob.pm
        : currentJob.leadCraftsman.split(' (')[0];

    const newEntry: TimelineEntry = {
      id: `t-note-${Date.now()}`,
      time: 'Just now',
      role: roleLabel,
      author: authorName,
      type: 'field-log',
      title: `${roleLabel} Update Logged (${quickStepBadge})`,
      text: quickNoteText.trim(),
      badge: quickStepBadge
    };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === currentJob.id ? { ...j, timeline: [newEntry, ...j.timeline] } : j
      )
    );
    setQuickNoteText('');
    triggerToast('Handoff update added to live Job Timeline');
  };

  // Sales Handoff Action
  const handleCompleteSalesHandoff = () => {
    const newEntry: TimelineEntry = {
      id: `t-sales-${Date.now()}`,
      time: 'Just now',
      role: 'Sales',
      author: currentJob.salesRep,
      type: 'intake',
      title: 'Sales Site Assessment & Handoff Locked',
      text: `Acid Test: ${salesForm.acidTest}. Tramex Slab Moisture: ${salesForm.moisturePct}%. Lippage: ${salesForm.lippageLevel}. Containment: ${salesForm.containmentRequired ? 'Full ZipWall Required' : 'Standard Masking'}. Client Note: ${salesForm.expectationNote}`,
      badge: `Moisture: ${salesForm.moisturePct}% | Handoff Ready`
    };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === currentJob.id
          ? {
              ...j,
              status: 'Ready for PM Dispatch',
              statusColor: 'emerald',
              stoneProfile: {
                ...j.stoneProfile,
                moistureReading: `${salesForm.moisturePct}% (Tramex Intake)`,
                acidSensitivity: salesForm.acidTest,
                lippage: salesForm.lippageLevel
              },
              timeline: [newEntry, ...j.timeline]
            }
          : j
      )
    );
    triggerToast('Sales Assessment pushed to PM & Shared Job Record!');
    setActiveMobileTab('record');
  };

  // Toggle Craftsman Checklist Item and log completion
  const handleToggleChecklist = (itemId: string) => {
    const targetItem = currentJob.checklist.find((i) => i.id === itemId);
    const willBeDone = targetItem ? !targetItem.done : false;

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== currentJob.id) return j;
        const updatedChecklist = j.checklist.map((item) =>
          item.id === itemId ? { ...item, done: !item.done } : item
        );

        if (willBeDone && targetItem) {
          const checkLog: TimelineEntry = {
            id: `t-chk-${Date.now()}`,
            time: 'Just now',
            role: 'Craftsman',
            author: currentJob.leadCraftsman.split(' (')[0] || 'Field Crew',
            type: 'field-log',
            title: `SOP Step Completed`,
            text: `Completed checklist step: "${targetItem.text}"`,
            badge: 'Checklist Verified'
          };
          return {
            ...j,
            checklist: updatedChecklist,
            timeline: [checkLog, ...j.timeline]
          };
        }

        return {
          ...j,
          checklist: updatedChecklist
        };
      })
    );

    if (willBeDone) {
      triggerToast('Checklist step completed & synced to Job Record');
    }
  };

  // Toggle Craftsman Before/After Photo verification
  const handleLogAfterPhoto = (photoId: string) => {
    const targetPhoto = currentJob.beforeAfterPhotos.find((p) => p.id === photoId);
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== currentJob.id) return j;
        const updatedPhotos = j.beforeAfterPhotos.map((p) =>
          p.id === photoId ? { ...p, afterLogged: true } : p
        );
        const newLog: TimelineEntry = {
          id: `t-photo-${Date.now()}`,
          time: 'Just now',
          role: 'Craftsman',
          author: currentJob.leadCraftsman.split(' (')[0] || 'Devon Brooks',
          type: 'field-log',
          title: `Verified After-Photo: ${targetPhoto ? targetPhoto.area : 'Work Zone'}`,
          text: 'Captured high-angle gloss reflection photo confirming uniform clarity and zero lippage shadow.',
          badge: 'Photo Proof Verified'
        };
        return {
          ...j,
          beforeAfterPhotos: updatedPhotos,
          timeline: [newLog, ...j.timeline]
        };
      })
    );
    triggerToast('After-photo verification logged to Customer Record');
  };

  // PM Approve Escalation & Notify Customer
  const handleApproveEscalation = (esc: EscalationItem) => {
    setEscalations((prev) =>
      prev.map((item) =>
        item.id === esc.id
          ? { ...item, status: 'Approved & Sent to Client', customerNotified: true }
          : item
      )
    );

    const newEntry: TimelineEntry = {
      id: `t-pm-${Date.now()}`,
      time: 'Just now',
      role: 'PM',
      author: currentJob.pm,
      type: 'dispatch',
      title: `PM Approved Fix & Updated Customer: ${esc.issueTitle.split('(')[0].trim()}`,
      text: `Authorized crew to run ${esc.recommendedFix} (${esc.impact}). Sent SMS & photo update to homeowner explaining why the extra step protects the stone long-term.`,
      badge: 'PM Approved + Client SMS Sent'
    };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === esc.jobId
          ? {
              ...j,
              status: 'In Progress - PM Approved SOP',
              statusColor: 'emerald',
              timeline: [newEntry, ...j.timeline]
            }
          : j
      )
    );
    triggerToast('Approved SOP & logged client notification on Job Timeline!');
  };

  // Render simulated stone texture thumbnail for the AI Troubleshooter cards
  const renderStoneVisualGraphic = (type: RingGraphicType) => {
    if (type === 'cloudy-ring') {
      return (
        <div className="relative w-full h-16 rounded-lg overflow-hidden bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 border border-stone-400/50 flex items-center justify-center">
          {/* Marble veins */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 60">
            <path d="M0 15 Q 30 25, 55 10 T 100 35" stroke="#57534e" strokeWidth="1.5" fill="none" />
            <path d="M15 60 Q 45 35, 85 45" stroke="#78716c" strokeWidth="1" fill="none" />
          </svg>
          {/* Acid etch cloudy ring */}
          <div className="w-10 h-10 rounded-full border-4 border-white/90 bg-white/50 blur-[0.5px] shadow-inner flex items-center justify-center">
            <span className="text-[9px] font-bold text-stone-700 bg-white/80 px-1 rounded">ETCH</span>
          </div>
        </div>
      );
    }
    if (type === 'orange-frame') {
      return (
        <div className="relative w-full h-16 rounded-lg overflow-hidden bg-stone-200 border border-amber-500/50 flex items-center justify-center">
          {/* Grout cross */}
          <div className="absolute inset-y-0 left-1/2 w-1.5 bg-stone-500 -translate-x-1/2" />
          <div className="absolute inset-x-0 top-1/2 h-1.5 bg-stone-500 -translate-y-1/2" />
          {/* Orange oxidation halo */}
          <div className="absolute inset-y-0 left-1/2 w-6 bg-amber-500/35 blur-[2px] -translate-x-1/2" />
          <div className="absolute inset-x-0 top-1/2 h-6 bg-amber-600/30 blur-[2px] -translate-y-1/2" />
          <span className="relative z-10 text-[9px] font-bold text-amber-950 bg-amber-200/90 px-1.5 py-0.5 rounded border border-amber-500/50">
            FE2O3 RUST
          </span>
        </div>
      );
    }
    if (type === 'lippage-chip') {
      return (
        <div className="relative w-full h-16 rounded-lg overflow-hidden bg-gradient-to-r from-stone-300 via-stone-400 to-stone-200 border border-stone-400/50 flex items-center justify-center">
          <div className="absolute inset-y-0 left-1/2 w-2 bg-stone-800 -translate-x-1/2 shadow-lg" />
          <div className="w-3 h-3 rounded-full bg-stone-700 absolute top-3 left-1/2 -translate-x-2" />
          <div className="w-2.5 h-2.5 rounded-full bg-stone-700 absolute bottom-4 left-1/2 translate-x-0.5" />
          <span className="relative z-10 text-[9px] font-bold text-stone-100 bg-stone-900/80 px-1.5 py-0.5 rounded">
            1.5mm STEP
          </span>
        </div>
      );
    }
    return (
      <div className="relative w-full h-16 rounded-lg overflow-hidden bg-stone-800 border border-stone-600 flex items-center justify-center">
        <div className="w-12 h-11 rounded-full bg-black/75 blur-[1px] border border-amber-900/40 flex items-center justify-center">
          <span className="text-[9px] font-bold text-amber-300">OIL DARK</span>
        </div>
      </div>
    );
  };

  const filteredTimeline =
    timelineFilter === 'ALL'
      ? currentJob.timeline
      : currentJob.timeline.filter((item) => item.role === timelineFilter);

  const pendingEscalationCount = escalations.filter((e) => !e.customerNotified).length;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950 pb-12">
      {/* --- TOP OUTSIDE BAR: ROLE SWITCHER & SYSTEM ARCHITECTURE OVERVIEW --- */}
      <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 px-4 py-3 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Brand & Context */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/20 shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-lg font-bold tracking-tight text-stone-100">
                    Marble AI
                  </h1>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Field RAG + Handoff
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 hidden sm:inline-block">
                    Web • iOS • Android Ready
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Marble, Travertine &amp; Terrazzo Restoration • Shared Job Record &amp; Vision Troubleshooter
                </p>
              </div>
            </div>

            {/* View Mode & Demo Reset Controls */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <button
                type="button"
                onClick={handleResetDemo}
                title="Reset Demo Data"
                className="p-2 rounded-lg bg-stone-950 text-stone-400 hover:text-stone-100 border border-stone-800 text-xs cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Role Switcher Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <div
              role="group"
              aria-label="Role Switcher"
              className="flex flex-1 sm:flex-initial flex-col sm:flex-row items-stretch sm:items-center gap-1.5 bg-stone-950 p-1.5 rounded-xl border border-stone-800"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 px-2.5 py-1 hidden xl:inline-block">
                Switch Role:
              </span>
              <button
                type="button"
                onClick={() => handleRoleSwitch('sales')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeRole === 'sales'
                    ? 'bg-sky-500 text-stone-950 shadow-md shadow-sky-500/20'
                    : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div>1. Sales / Estimator</div>
                  <div
                    className={`text-[10px] ${
                      activeRole === 'sales' ? 'text-stone-900' : 'text-stone-500'
                    }`}
                  >
                    Site Intake &amp; Scoping
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch('craftsman')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeRole === 'craftsman'
                    ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                    : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                }`}
              >
                <HardHat className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div>2. Field Craftsman</div>
                  <div
                    className={`text-[10px] ${
                      activeRole === 'craftsman' ? 'text-stone-900' : 'text-stone-500'
                    }`}
                  >
                    On-Site Work &amp; AI Troubleshooter
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSwitch('pm')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                  activeRole === 'pm'
                    ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
                    : 'text-stone-300 hover:bg-stone-900 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4 shrink-0" />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span>3. Project Manager</span>
                    {pendingEscalationCount > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                          activeRole === 'pm'
                            ? 'bg-stone-950 text-emerald-400'
                            : 'bg-amber-500 text-stone-950'
                        }`}
                      >
                        {pendingEscalationCount}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-[10px] ${
                      activeRole === 'pm' ? 'text-stone-900' : 'text-stone-500'
                    }`}
                  >
                    Dispatch, Escalations &amp; Record
                  </div>
                </div>
              </button>
            </div>

            {/* Desktop Viewport Switcher (Framed vs Full Mobile View) & Reset */}
            <div className="hidden lg:flex items-center gap-1.5 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === 'framed' ? 'native' : 'framed')}
                title="Toggle between Framed Prototype and Full-Bleed Mobile App View"
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-semibold text-stone-300 hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
              >
                {viewMode === 'framed' ? (
                  <>
                    <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                    <span>App View</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-sky-400" />
                    <span>Split View</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleResetDemo}
                title="Reset all demo jobs and timeline logs"
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold text-stone-400 hover:bg-stone-900 hover:text-stone-100 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN WORKSPACE: DESKTOP CONTEXT RAIL + CENTERED IPHONE PROTOTYPE --- */}
      <main
        className={`max-w-6xl mx-auto px-4 pt-6 ${
          viewMode === 'framed'
            ? 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'
            : 'flex justify-center'
        }`}
      >
        {/* LEFT COLUMN: WORKFLOW GUIDE & LIVE DATA FLOW ARCHITECTURE (5 COLS ON DESKTOP) */}
        {viewMode === 'framed' && (
          <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
            <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                Marble AI Architecture Blueprint
              </div>
              <h2 className="text-lg font-bold text-stone-100 mb-2">
                How Information Flows Across Teams
              </h2>
              <p className="text-xs text-stone-400 leading-relaxed mb-4">
                In stone restoration, costly mistakes happen when what Sales promised doesn’t reach
                the Craftsman on the grinder, or when an unexpected marble reaction isn’t escalated
                to the PM. Click through the roles to watch updates sync to the single customer
                record in real time.
              </p>

              {/* 3-Stage Handoff Pipeline Cards */}
              <div className="space-y-3">
                <div
                  onClick={() => handleRoleSwitch('sales')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeRole === 'sales'
                      ? 'bg-sky-500/10 border-sky-500/50'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Stage 1: Sales / Estimator Intake
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                      Pre-Job
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Logs acid drop test (Marble vs. Quartzite), Tramex slab moisture %, and tile
                    lippage. Sets realistic homeowner expectations around natural veining vs.
                    surface damage.
                  </p>
                </div>

                <div
                  onClick={() => handleRoleSwitch('craftsman')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeRole === 'craftsman'
                      ? 'bg-amber-500/10 border-amber-500/50'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      <HardHat className="w-3.5 h-3.5" /> Stage 2: Craftsman + AI Troubleshooter
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                      Wet-Hand UI
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Selects a floor defect (acid etch rings, iron grout bleed, lippage chips, or
                    oil stains). Vision + Knowledge Base RAG returns exact diamond grit sequences,
                    poultice ratios, and safety warnings.
                  </p>
                </div>

                <div
                  onClick={() => handleRoleSwitch('pm')}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeRole === 'pm'
                      ? 'bg-emerald-500/10 border-emerald-500/50'
                      : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5" /> Stage 3: PM Escalation &amp; Client
                      Sign-Off
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                      Live Ops
                    </span>
                  </div>
                  <p className="text-xs text-stone-300">
                    Reviews field escalations that add scope or cure time (e.g., 24-hr poultice
                    dwell), approves the SOP, and pushes verified before/after records to the
                    homeowner.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Role Permissions Matrix Card */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Role Permissions &amp; Handoff Access
                </h3>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-stone-800 text-stone-200">
                  {activeRole === 'sales'
                    ? 'Sales / Estimator'
                    : activeRole === 'craftsman'
                    ? 'Field Craftsman'
                    : 'Project Manager'}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed">
                {activeRole === 'sales' &&
                  'Can edit Site Intake readings (10% HCl Acid Drop Test, Tramex Moisture %, Lippage Level) and lock Pre-Job Handoffs to the PM.'}
                {activeRole === 'craftsman' &&
                  'Full Glove-UI access to AI Stone Troubleshooter, SOP Diamond Grit Checklists, Before/After Gloss Photo logging, and 1-tap PM Escalation.'}
                {activeRole === 'pm' &&
                  'Can approve Field Escalations, authorize schedule/scope adjustments, dispatch SMS updates to homeowners, and audit the full Job Record.'}
              </p>
            </div>

            {/* Quick Job Switcher outside phone as well for convenience */}
            <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Active Customer Job Records ({jobs.length})
              </h3>
              <div className="space-y-2">
                {jobs.map((job) => (
                  <button
                    key={job.id}
                    type="button"
                    onClick={() => setSelectedJobId(job.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedJobId === job.id
                        ? 'bg-stone-800 border-amber-500/60 shadow-md'
                        : 'bg-stone-950/50 border-stone-800/80 hover:bg-stone-900'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-stone-100">{job.client}</div>
                      <div className="text-[11px] text-stone-400">{job.title}</div>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        job.statusColor === 'emerald'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : job.statusColor === 'amber'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {job.timeline.length} logs
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: SLEEK IPHONE-STYLE MOBILE VIEWPORT (7 COLS ON DESKTOP) */}
        <div
          className={
            viewMode === 'framed'
              ? 'lg:col-span-7 flex justify-center order-1 lg:order-2'
              : 'w-full max-w-[480px]'
          }
        >
          <div className="w-full max-w-[430px] bg-stone-900 rounded-[44px] p-3 border-[6px] border-stone-800 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] relative">
            {/* Phone Speaker Notch & Status Bar */}
            <div className="bg-stone-950 rounded-t-[34px] pt-2.5 pb-2 px-6 flex items-center justify-between border-b border-stone-800/80">
              <span className="text-[11px] font-bold text-stone-300">9:41 AM</span>
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 border border-stone-800">
                <div className="w-2 h-2 rounded-full bg-stone-800" />
                <div className="w-8 h-1 rounded-full bg-stone-800" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                5G • Sync
              </div>
            </div>

            {/* Floating Notification Toast inside Phone */}
            {toastMessage && (
              <div
                role="status"
                aria-live="polite"
                className="absolute top-16 inset-x-6 z-50 bg-emerald-500 text-stone-950 px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-emerald-300 animate-bounce"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Mobile App Header: Active Role Banner + Active Job Selector */}
            <div className="bg-stone-950 px-4 pt-3 pb-3 border-b border-stone-800">
              {/* Role Context Pill */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeRole === 'sales'
                        ? 'bg-sky-400'
                        : activeRole === 'craftsman'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    {activeRole === 'sales' && 'Sales / Estimator Mode'}
                    {activeRole === 'craftsman' && 'Field Craftsman Mode (High-Contrast)'}
                    {activeRole === 'pm' && 'Project Manager Mode'}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                  {activeRole === 'sales'
                    ? 'Marcus V.'
                    : activeRole === 'craftsman'
                    ? 'Devon B.'
                    : 'Elena R.'}
                </span>
              </div>

              {/* Active Job Selector Dropdown inside App */}
              <div className="relative">
                <label
                  htmlFor="mobile-job-select"
                  className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1"
                >
                  Active Customer &amp; Stone Job Record
                </label>
                <div className="relative">
                  <select
                    id="mobile-job-select"
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full appearance-none bg-stone-900 hover:bg-stone-800/90 text-stone-100 text-xs font-bold rounded-xl pl-3 pr-9 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
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

              {/* Quick Status Strip */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-900 text-[11px]">
                <span className="text-stone-400 flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                  {currentJob.address}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentJob.statusColor === 'emerald'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : currentJob.statusColor === 'amber'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {currentJob.status}
                </span>
              </div>
            </div>

            {/* --- SCROLLABLE MOBILE VIEWPORT BODY --- */}
            <div className="bg-stone-950 h-[600px] overflow-y-auto px-4 py-4 space-y-4">
              {/* ===================================================================
                  TAB 1: SHARED CUSTOMER & JOB RECORD VIEW (SINGLE SOURCE OF TRUTH)
              =================================================================== */}
              {activeMobileTab === 'record' && (
                <div className="space-y-4">
                  {/* Stone Technical Profile Card (Single Source of Truth) */}
                  <div className="bg-gradient-to-b from-stone-900 to-stone-900/70 rounded-2xl p-3.5 border border-stone-800 shadow-md">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Layers className="w-4 h-4" />
                        Stone Diagnostic Profile
                      </span>
                      <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-semibold">
                        Age: {currentJob.stoneProfile.age}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800/80">
                        <div className="text-[10px] text-stone-400">Stone Composition</div>
                        <div className="font-bold text-stone-100 mt-0.5 leading-snug">
                          {currentJob.stoneProfile.type}
                        </div>
                      </div>
                      <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800/80">
                        <div className="text-[10px] text-stone-400">Target Finish</div>
                        <div className="font-bold text-stone-100 mt-0.5 leading-snug">
                          {currentJob.stoneProfile.finish}
                        </div>
                      </div>
                      <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800/80">
                        <div className="text-[10px] text-stone-400 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-sky-400" /> Tramex Moisture Reading
                        </div>
                        <div className="font-bold text-amber-300 mt-0.5 leading-snug">
                          {currentJob.stoneProfile.moistureReading}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          {currentJob.stoneProfile.subfloor}
                        </div>
                      </div>
                      <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800/80">
                        <div className="text-[10px] text-stone-400 flex items-center gap-1">
                          <FlaskConical className="w-3 h-3 text-amber-400" /> Acid Sensitivity
                        </div>
                        <div className="font-bold text-stone-100 mt-0.5 leading-snug">
                          {currentJob.stoneProfile.acidSensitivity}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          Lippage: {currentJob.stoneProfile.lippage}
                        </div>
                      </div>
                    </div>

                    {/* Customer Expectation & Site Notes */}
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-0.5">
                        Customer Notes &amp; Site Constraints
                      </div>
                      <p className="text-xs text-stone-200 leading-relaxed">
                        {currentJob.customerNotes}
                      </p>
                    </div>

                    {/* Assigned Team Strip */}
                    <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                      <span>
                        Sales: <strong className="text-stone-200">{currentJob.salesRep}</strong>
                      </span>
                      <span>
                        PM: <strong className="text-stone-200">{currentJob.pm}</strong>
                      </span>
                      <span>
                        Crew:{' '}
                        <strong className="text-amber-300">
                          {currentJob.leadCraftsman.split(' ')[0]}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Quick Handoff / Chemical-Grit Logger Form */}
                  <form
                    onSubmit={handleAddQuickTimelineNote}
                    className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        Log Handoff Note or Grit/Chemical Step
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Posting as {activeRole.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <select
                        aria-label="Step or Grit Badge"
                        value={quickStepBadge}
                        onChange={(e) => setQuickStepBadge(e.target.value)}
                        className="bg-stone-950 text-stone-200 text-[11px] font-semibold rounded-lg px-2.5 py-2 border border-stone-700 focus:outline-none focus:border-amber-500"
                      >
                        <option value="100-Grit Metal Lippage Cut">100-Grit Metal Cut</option>
                        <option value="200-Grit Resin Cut">200-Grit Resin Cut</option>
                        <option value="400-Grit Resin Pass">400-Grit Resin Pass</option>
                        <option value="800-Grit Polish Prep">800-Grit Polish Prep</option>
                        <option value="5X Polish Compound">5X Polish Compound</option>
                        <option value="Poultice Applied">Poultice Applied</option>
                        <option value="Sealer Coat #1">Sealer Coat #1</option>
                        <option value="Client Expectation Note">Client Expectation Note</option>
                      </select>
                      <input
                        type="text"
                        value={quickNoteText}
                        onChange={(e) => setQuickNoteText(e.target.value)}
                        placeholder="Add field note or handoff instruction..."
                        className="flex-1 bg-stone-950 text-stone-100 text-xs rounded-lg px-3 py-2 border border-stone-700 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Append to Shared Job Timeline
                    </button>
                  </form>

                  {/* Chronological Activity & Handoff Timeline */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Activity &amp; Handoff Timeline ({filteredTimeline.length})
                      </h3>
                      <div className="flex items-center gap-1">
                        {(['ALL', 'Sales', 'Craftsman', 'PM'] as const).map((roleFilter) => (
                          <button
                            key={roleFilter}
                            type="button"
                            onClick={() => setTimelineFilter(roleFilter)}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-semibold cursor-pointer transition-colors ${
                              timelineFilter === roleFilter
                                ? 'bg-amber-500 text-stone-950'
                                : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                            }`}
                          >
                            {roleFilter === 'ALL' ? 'All' : roleFilter}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 relative before:absolute before:inset-y-2 before:left-4 before:w-0.5 before:bg-stone-800">
                      {filteredTimeline.map((item) => {
                        const roleColors =
                          item.role === 'Sales'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : item.role === 'PM'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

                        return (
                          <div key={item.id} className="relative pl-9">
                            {/* Timeline Node Dot */}
                            <div
                              className={`w-3.5 h-3.5 rounded-full border-2 border-stone-950 absolute left-[9px] top-3 ${
                                item.type === 'escalation'
                                  ? 'bg-red-500 ring-4 ring-red-500/20'
                                  : item.role === 'Sales'
                                  ? 'bg-sky-400'
                                  : item.role === 'PM'
                                  ? 'bg-emerald-400'
                                  : 'bg-amber-400'
                              }`}
                            />

                            <div className="bg-stone-900/95 border border-stone-800 rounded-2xl p-3 space-y-1.5 shadow-sm">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${roleColors}`}
                                  >
                                    {item.role}
                                  </span>
                                  <span className="text-xs font-bold text-stone-200">
                                    {item.author}
                                  </span>
                                </div>
                                <span className="text-[10px] text-stone-400">{item.time}</span>
                              </div>

                              <div className="text-xs font-bold text-stone-100">{item.title}</div>
                              <p className="text-xs text-stone-300 leading-relaxed">{item.text}</p>

                              {item.badge && (
                                <div className="pt-1 flex items-center gap-1.5">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-stone-950 text-amber-300 border border-stone-700">
                                    <Wrench className="w-3 h-3 text-amber-400" />
                                    {item.badge}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ===================================================================
                  TAB 2: AI STONE TROUBLESHOOTER (VISION + KNOWLEDGE BASE RAG)
              =================================================================== */}
              {activeMobileTab === 'troubleshoot' && (
                <div className="space-y-4">
                  {/* Wet/Dusty Hands High-Contrast Banner */}
                  <div className="bg-gradient-to-r from-amber-500/20 via-stone-900 to-stone-900 rounded-2xl p-3.5 border border-amber-500/40 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider">
                        <Camera className="w-4 h-4" />
                        AI Stone Vision + RAG Troubleshooter
                      </div>
                      <p className="text-[11px] text-stone-300 mt-0.5">
                        Large tap targets for wet or dusty hands on site. Select a floor defect
                        below to run diagnosis.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-500 text-stone-950 px-2 py-1 rounded-lg shrink-0">
                      GLOVE UI
                    </span>
                  </div>

                  {/* Step 1: Select or Simulate Uploading Photo of Stone Issue (4 Preset Scenarios) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-300">
                        1. Select Captured Floor Issue (4 Presets)
                      </label>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        Tap card to load scan
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {DIAGNOSTIC_SCENARIOS.map((scen) => {
                        const isSelected = selectedScenarioId === scen.id;
                        return (
                          <button
                            key={scen.id}
                            type="button"
                            onClick={() => handleSelectScenario(scen)}
                            className={`text-left p-3 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[124px] ${
                              isSelected
                                ? 'bg-stone-800 border-amber-400 shadow-lg shadow-amber-500/10'
                                : 'bg-stone-900/90 border-stone-800 hover:border-stone-700'
                            }`}
                          >
                            {renderStoneVisualGraphic(scen.ringType)}
                            <div className="mt-2">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-bold text-amber-400 uppercase">
                                  {scen.stoneTag}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                )}
                              </div>
                              <div className="text-xs font-bold text-stone-100 leading-snug mt-0.5">
                                {scen.shortTitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Quick Symptom Tags & Field Input */}
                  <div className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                        2. Toggle Surface Symptoms (Large Tap Targets)
                      </label>
                      <span className="text-[10px] text-stone-400">
                        {selectedTags.length} active
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SYMPTOM_TAGS.map((tag) => {
                        const active = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleSymptomTag(tag)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              active
                                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm'
                                : 'bg-stone-950 text-stone-300 border-stone-700 hover:border-stone-600'
                            }`}
                          >
                            {active ? `✓ ${tag}` : `+ ${tag}`}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={customSymptomText}
                        onChange={(e) => setCustomSymptomText(e.target.value)}
                        placeholder="Optional: e.g. happened after 400-grit pass..."
                        className="flex-1 bg-stone-950 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleRunDiagnosis}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isAnalyzing
                        ? 'Querying Marble AI Knowledge Base...'
                        : 'Run Knowledge Base Diagnosis'}
                    </button>
                  </div>

                  {/* Step 3: Structured Knowledge Base SOP Output Card */}
                  {diagnosisResult && (
                    <div className="bg-stone-900 rounded-2xl border-2 border-emerald-500/50 overflow-hidden shadow-xl space-y-3.5 p-4">
                      {/* Header & Confidence Badge */}
                      <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-3">
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                            <BookOpen className="w-3 h-3" /> {diagnosisResult.confidence}
                          </span>
                          <h3 className="text-sm font-extrabold text-stone-100 leading-snug">
                            {diagnosisResult.fullTitle}
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold bg-stone-950 text-amber-300 px-2 py-1 rounded-lg border border-stone-700 shrink-0">
                          {diagnosisResult.estTimeImpact}
                        </span>
                      </div>

                      {/* Root Cause Analysis */}
                      <div className="bg-stone-950/90 p-3 rounded-xl border border-stone-800">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1">
                          Chemical &amp; Mechanical Root Cause
                        </div>
                        <p className="text-xs text-stone-200 leading-relaxed">
                          {diagnosisResult.rootCause}
                        </p>
                      </div>

                      {/* Interactive Step-by-Step Diamond Grit & Crew Instructions */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                            Diamond Grit &amp; SOP Progression (Tap to Check)
                          </span>
                          <span className="text-[10px] text-stone-400 font-semibold">
                            Spec: {diagnosisResult.recommendedGrit}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {diagnosisResult.crewSteps.map((step, idx) => {
                            const isChecked = !!checkedSopSteps[idx];
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() =>
                                  setCheckedSopSteps((prev) => ({
                                    ...prev,
                                    [idx]: !prev[idx]
                                  }))
                                }
                                className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                                  isChecked
                                    ? 'bg-emerald-950/30 border-emerald-500/40 text-stone-300'
                                    : 'bg-stone-950 border-stone-800 text-stone-100 hover:border-stone-700'
                                }`}
                              >
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                                ) : (
                                  <Square className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
                                )}
                                <span
                                  className={`text-xs leading-relaxed ${
                                    isChecked ? 'line-through text-stone-400' : 'font-medium'
                                  }`}
                                >
                                  <strong className="text-amber-400 mr-1">Step {idx + 1}:</strong>
                                  {step}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Safety & Stone Warnings */}
                      <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3 flex items-start gap-2.5">
                        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-red-300">
                            Critical Stone &amp; Chemical Safety Warning
                          </div>
                          <p className="text-xs text-red-100 leading-relaxed mt-0.5">
                            {diagnosisResult.safetyWarning}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons: Log to Job Record & Escalate to PM */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={handleLogDiagnosisToRecord}
                          className="py-3.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          Log to Job Record
                        </button>
                        <button
                          type="button"
                          onClick={handleEscalateToPM}
                          className="py-3.5 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          Escalate to PM
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===================================================================
                  TAB 3: ROLE-SPECIFIC HANDOFF & WORKFLOW ACTIONS
              =================================================================== */}
              {activeMobileTab === 'role-action' && (
                <div className="space-y-4">
                  {/* --- ROLE 1: SALES / ESTIMATOR SITE ASSESSMENT & HANDOFF --- */}
                  {activeRole === 'sales' && (
                    <div className="space-y-4">
                      <div className="bg-sky-500/15 border border-sky-500/40 rounded-2xl p-3.5">
                        <div className="text-xs font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          Sales / Estimator Site Intake &amp; Handoff
                        </div>
                        <p className="text-xs text-stone-300 mt-1">
                          Record diagnostic drop tests and Tramex slab readings so the PM and Field
                          Crew aren’t blindsided on job day.
                        </p>
                      </div>

                      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3.5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                            Acid Sensitivity Drop Test (10% HCl)
                          </label>
                          <select
                            value={salesForm.acidTest}
                            onChange={(e) =>
                              setSalesForm({ ...salesForm, acidTest: e.target.value })
                            }
                            className="w-full bg-stone-950 text-stone-100 text-xs font-semibold rounded-xl px-3 py-2.5 border border-stone-700"
                          >
                            <option value="Positive - Calcite Fizz (Marble/Travertine)">
                              Positive — Calcite Fizz (Genuine Marble / Travertine)
                            </option>
                            <option value="Negative - No Reaction (Dense Granite / True Quartzite)">
                              Negative — No Reaction (Dense Granite / True Quartzite)
                            </option>
                            <option value="Slight Etch - Dolomitic Marble">
                              Slow Fizz — Dolomitic Marble (Use Acid-Cautious Spec)
                            </option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                              Tramex Moisture %
                            </label>
                            <input
                              type="text"
                              value={salesForm.moisturePct}
                              onChange={(e) =>
                                setSalesForm({ ...salesForm, moisturePct: e.target.value })
                              }
                              className="w-full bg-stone-950 text-amber-300 font-bold text-xs rounded-xl px-3 py-2.5 border border-stone-700"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                              Tile Lippage Check
                            </label>
                            <select
                              value={salesForm.lippageLevel}
                              onChange={(e) =>
                                setSalesForm({ ...salesForm, lippageLevel: e.target.value })
                              }
                              className="w-full bg-stone-950 text-stone-100 text-xs font-semibold rounded-xl px-2.5 py-2.5 border border-stone-700"
                            >
                              <option value="Low (< 0.5mm - Hone & Polish Only)">
                                Low (&lt; 0.5mm)
                              </option>
                              <option value="Moderate (1.0 - 2.0mm - Needs Metal Cut)">
                                Moderate (1.0-2.0mm)
                              </option>
                              <option value="Severe (> 2.0mm - Full Flatten Required)">
                                Severe (&gt; 2.0mm)
                              </option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSalesForm((prev) => ({
                              ...prev,
                              containmentRequired: !prev.containmentRequired
                            }))
                          }
                          className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs cursor-pointer"
                        >
                          <span className="font-semibold text-stone-200">
                            Full ZipWall Dust Containment Required
                          </span>
                          {salesForm.containmentRequired ? (
                            <CheckSquare className="w-4 h-4 text-sky-400" />
                          ) : (
                            <Square className="w-4 h-4 text-stone-500" />
                          )}
                        </button>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                            Customer Expectations &amp; Pre-Existing Flaw Sign-Off
                          </label>
                          <textarea
                            rows={3}
                            value={salesForm.expectationNote}
                            onChange={(e) =>
                              setSalesForm({ ...salesForm, expectationNote: e.target.value })
                            }
                            className="w-full bg-stone-950 text-stone-100 text-xs rounded-xl p-3 border border-stone-700"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleCompleteSalesHandoff}
                          className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          Complete Sales Handoff to PM
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- ROLE 2: CRAFTSMAN WORK CHECKLIST & BEFORE/AFTER PHOTO VERIFICATION --- */}
                  {activeRole === 'craftsman' && (
                    <div className="space-y-4">
                      <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-3.5">
                        <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <HardHat className="w-4 h-4" />
                          On-Site Craftsman SOP Checklist &amp; Photo Proof
                        </div>
                        <p className="text-xs text-stone-300 mt-1">
                          Check off completed diamond passes and verify Before/After reflection
                          shots for the customer file.
                        </p>
                      </div>

                      {/* Diamond Grit & Chemical Execution Checklist */}
                      <div className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                            Assigned Job Execution Checklist
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400">
                            {currentJob.checklist.filter((i) => i.done).length} /{' '}
                            {currentJob.checklist.length} Done
                          </span>
                        </div>

                        <div className="space-y-2">
                          {currentJob.checklist.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleToggleChecklist(item.id)}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
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
                              <span
                                className={`text-xs ${
                                  item.done ? 'line-through' : 'font-semibold'
                                }`}
                              >
                                {item.text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Before / After Photo Log Verification */}
                      <div className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-amber-400" />
                            Before / After Gloss Verification Log
                          </span>
                        </div>

                        {currentJob.beforeAfterPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="bg-stone-950 rounded-xl p-3 border border-stone-800 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-100">{photo.area}</span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  photo.afterLogged
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {photo.afterLogged
                                  ? 'Before + After Complete'
                                  : 'Awaiting After Photo'}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-400">{photo.notes}</p>
                            {!photo.afterLogged ? (
                              <button
                                type="button"
                                onClick={() => handleLogAfterPhoto(photo.id)}
                                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                Capture &amp; Verify &ldquo;After&rdquo; Reflection Photo
                              </button>
                            ) : (
                              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Synced to Customer Record &amp; Final Invoice Packet
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* --- ROLE 3: PROJECT MANAGER ESCALATIONS & CUSTOMER UPDATES --- */}
                  {activeRole === 'pm' && (
                    <div className="space-y-4">
                      <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-3.5">
                        <div className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4" />
                          PM Dispatch &amp; Live Field Escalation Queue
                        </div>
                        <p className="text-xs text-stone-300 mt-1">
                          Approve field troubleshooting remedies that affect job duration and send
                          proactive updates to the homeowner.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {escalations.map((esc) => (
                          <div
                            key={esc.id}
                            className={`rounded-2xl p-3.5 border space-y-2.5 ${
                              esc.customerNotified
                                ? 'bg-stone-900/70 border-stone-800'
                                : 'bg-stone-900 border-amber-500/60 shadow-lg'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  esc.customerNotified
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500 text-stone-950'
                                }`}
                              >
                                {esc.status}
                              </span>
                              <span className="text-[10px] text-stone-400">{esc.time}</span>
                            </div>

                            <div>
                              <div className="text-xs font-bold text-stone-300">{esc.jobTitle}</div>
                              <div className="text-sm font-extrabold text-stone-100 mt-0.5">
                                {esc.issueTitle}
                              </div>
                            </div>

                            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-stone-400">Craftsman:</span>
                                <span className="font-semibold text-stone-200">
                                  {esc.craftsman}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-400">Proposed SOP Fix:</span>
                                <span className="font-semibold text-amber-300">
                                  {esc.recommendedFix}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-400">Schedule Impact:</span>
                                <span className="font-semibold text-red-300">{esc.impact}</span>
                              </div>
                            </div>

                            {!esc.customerNotified ? (
                              <button
                                type="button"
                                onClick={() => handleApproveEscalation(esc)}
                                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Approve Fix &amp; Send Client Update
                              </button>
                            ) : (
                              <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 pt-1">
                                <Check className="w-4 h-4" />
                                Approved &amp; logged to Shared Customer Timeline
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* --- BOTTOM NAVIGATION BAR INSIDE MOBILE FRAME --- */}
            <nav className="bg-stone-950 rounded-b-[34px] border-t border-stone-800 px-3 py-2 grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setActiveMobileTab('record')}
                className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all cursor-pointer ${
                  activeMobileTab === 'record'
                    ? 'bg-stone-800 text-amber-400 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileText className="w-4 h-4 mb-1" />
                <span className="text-[10px]">Job Record</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMobileTab('troubleshoot')}
                className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all cursor-pointer ${
                  activeMobileTab === 'troubleshoot'
                    ? 'bg-amber-500 text-stone-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Camera className="w-4 h-4 mb-1" />
                <span className="text-[10px]">AI Troubleshoot</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMobileTab('role-action')}
                className={`flex flex-col items-center justify-center py-2.5 rounded-2xl transition-all cursor-pointer relative ${
                  activeMobileTab === 'role-action'
                    ? 'bg-stone-800 text-emerald-400 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <ClipboardCheck className="w-4 h-4 mb-1" />
                <span className="text-[10px]">
                  {activeRole === 'sales'
                    ? 'Sales Intake'
                    : activeRole === 'craftsman'
                    ? 'Crew Checklist'
                    : 'PM Escalations'}
                </span>
                {activeRole === 'pm' && pendingEscalationCount > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-6" />
                )}
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}

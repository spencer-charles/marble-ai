'use client';

import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { DEFAULT_ESTIMATOR_RATES } from '@/data/estimatorRates';
import { INITIAL_KNOWLEDGE_ENTRIES } from '@/data/knowledgeBase';
import { INITIAL_ESCALATIONS, INITIAL_JOBS } from '@/data/mockData';
import {
  generateId,
  getActorNameForJob,
  getRoleDisplayLabel
} from '@/lib/helpers';
import { clearAllPhotosIndexedDb } from '@/lib/photoStore';
import {
  AttachedPhotoMeta,
  Correction,
  EscalationItem,
  Estimate,
  EstimatorRates,
  JobRecord,
  KnowledgeEntry,
  MobileTabType,
  RoleType,
  StoneCategory,
  TimelineEntry,
  UnansweredQuestion
} from '@/types/marble';

const STORAGE_KEY = 'marble_ai_state_v2';

export interface MarbleState {
  theme: 'light' | 'dark';
  activeRole: RoleType;
  selectedJobId: string;
  activeTab: MobileTabType;
  desktopFrameMode: 'framed' | 'full';
  jobs: JobRecord[];
  escalations: EscalationItem[];
  knowledgeEntries: KnowledgeEntry[];
  corrections: Correction[];
  unansweredQuestions: UnansweredQuestion[];
  estimatorRates: EstimatorRates;
  toastMessage: string | null;
}

export const INITIAL_STATE: MarbleState = {
  theme: 'light',
  activeRole: 'craftsman',
  selectedJobId: 'job-1',
  activeTab: 'troubleshoot',
  desktopFrameMode: 'framed',
  jobs: INITIAL_JOBS,
  escalations: INITIAL_ESCALATIONS,
  knowledgeEntries: INITIAL_KNOWLEDGE_ENTRIES,
  corrections: [],
  unansweredQuestions: [],
  estimatorRates: DEFAULT_ESTIMATOR_RATES,
  toastMessage: null
};

export type MarbleAction =
  | { type: 'HYDRATE'; payload: Partial<MarbleState> }
  | { type: 'SET_THEME'; theme: 'light' | 'dark' }
  | { type: 'SET_ROLE'; role: RoleType }
  | { type: 'SET_JOB'; jobId: string }
  | { type: 'SET_TAB'; tab: MobileTabType }
  | { type: 'SET_DESKTOP_FRAME_MODE'; mode: 'framed' | 'full' }
  | { type: 'SHOW_TOAST'; message: string | null }
  | {
      type: 'ADD_QUICK_TIMELINE_NOTE';
      badge: string;
      text: string;
    }
  | {
      type: 'COMPLETE_SALES_INTAKE';
      payload: {
        stoneCategory: StoneCategory;
        acidTest: string;
        moisturePct: string;
        lippageLevel: string;
        expectationNote: string;
        containmentRequired: boolean;
        areaSqFt: number;
        setting: 'residential' | 'commercial';
      };
    }
  | { type: 'SAVE_ESTIMATE'; estimate: Estimate }
  | { type: 'TOGGLE_CHECKLIST'; itemId: string }
  | { type: 'LOG_AFTER_PHOTO'; photoId: string }
  | { type: 'ATTACH_JOB_PHOTO'; photo: AttachedPhotoMeta }
  | {
      type: 'LOG_DIAGNOSIS_TO_JOB';
      entry: KnowledgeEntry;
      selectedTags: string[];
      checkedCount: number;
      customNote: string;
    }
  | {
      type: 'ESCALATE_TO_PM';
      issueTitle: string;
      impact: string;
      recommendedFix: string;
      notes?: string;
    }
  | {
      type: 'RESOLVE_ESCALATION';
      escalationId: string;
      resolution: 'Approved' | 'Rejected' | 'Question Sent to Crew';
      note: string;
    }
  | {
      type: 'SUBMIT_CORRECTION';
      targetType: 'diagnosis' | 'qa';
      entryId?: string;
      entryTitle: string;
      text: string;
    }
  | {
      type: 'RESOLVE_CORRECTION';
      correctionId: string;
      status: 'applied' | 'discarded';
    }
  | {
      type: 'ADD_KNOWLEDGE_ENTRY';
      entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>;
    }
  | {
      type: 'UPDATE_KNOWLEDGE_ENTRY';
      entry: KnowledgeEntry;
    }
  | {
      type: 'DELETE_KNOWLEDGE_ENTRY';
      entryId: string;
    }
  | {
      type: 'SUBMIT_UNANSWERED_QUESTION';
      question: string;
    }
  | {
      type: 'RESOLVE_UNANSWERED_QUESTION';
      questionId: string;
      status: 'answered' | 'discarded';
    }
  | {
      type: 'UPDATE_ESTIMATOR_RATES';
      rates: EstimatorRates;
    }
  | {
      type: 'IMPORT_KNOWLEDGE_DATA';
      entries: KnowledgeEntry[];
      rates?: EstimatorRates;
    }
  | { type: 'RESET_DEMO' };

function marbleReducer(state: MarbleState, action: MarbleAction): MarbleState {
  const currentJob = state.jobs.find((j) => j.id === state.selectedJobId) || state.jobs[0];

  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        ...action.payload,
        toastMessage: null
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.theme
      };

    case 'SET_ROLE': {
      const nextTab: MobileTabType =
        action.role === 'craftsman'
          ? 'troubleshoot'
          : 'role-action';
      return {
        ...state,
        activeRole: action.role,
        activeTab: nextTab
      };
    }

    case 'SET_JOB':
      return {
        ...state,
        selectedJobId: action.jobId
      };

    case 'SET_TAB':
      return {
        ...state,
        activeTab: action.tab
      };

    case 'SET_DESKTOP_FRAME_MODE':
      return {
        ...state,
        desktopFrameMode: action.mode
      };

    case 'SHOW_TOAST':
      return {
        ...state,
        toastMessage: action.message
      };

    case 'ADD_QUICK_TIMELINE_NOTE': {
      const trimmed = action.text.trim();
      if (!trimmed) return state;

      const roleLabel = getRoleDisplayLabel(state.activeRole);
      const authorName = getActorNameForJob(state.activeRole, currentJob);

      const newEntry: TimelineEntry = {
        id: generateId('t-note'),
        createdAt: new Date().toISOString(),
        role: roleLabel,
        author: authorName,
        type: 'field-log',
        title: `${roleLabel} Update (${action.badge})`,
        text: trimmed,
        badge: action.badge
      };

      return {
        ...state,
        jobs: state.jobs.map((j) =>
          j.id === currentJob.id ? { ...j, timeline: [newEntry, ...j.timeline] } : j
        ),
        toastMessage: 'Update added to Job Timeline'
      };
    }

    case 'COMPLETE_SALES_INTAKE': {
      const {
        stoneCategory,
        acidTest,
        moisturePct,
        lippageLevel,
        expectationNote,
        containmentRequired,
        areaSqFt,
        setting
      } = action.payload;

      const newEntry: TimelineEntry = {
        id: generateId('t-sales'),
        createdAt: new Date().toISOString(),
        role: 'Sales',
        author: currentJob.salesRep,
        type: 'intake',
        title: 'Sales Site Assessment & Handoff Locked',
        text: `Acid Test: ${acidTest}. Tramex Moisture: ${moisturePct}%. Lippage: ${lippageLevel}. Area: ${areaSqFt} sq ft (${setting}). Containment: ${
          containmentRequired ? 'Full ZipWall Required' : 'Standard Masking'
        }. Client Note: ${expectationNote}`,
        badge: `Moisture: ${moisturePct}% | Handoff Ready`
      };

      return {
        ...state,
        jobs: state.jobs.map((j) =>
          j.id === currentJob.id
            ? {
                ...j,
                status: 'Ready for PM Dispatch',
                statusColor: 'emerald',
                customerNotes: expectationNote,
                stoneProfile: {
                  ...j.stoneProfile,
                  stoneCategory,
                  moistureReading: `${moisturePct}% (Updated at Intake)`,
                  moisturePctNumeric: moisturePct,
                  acidSensitivity: acidTest,
                  lippage: lippageLevel,
                  areaSqFt,
                  setting,
                  containmentRequired
                },
                timeline: [newEntry, ...j.timeline]
              }
            : j
        ),
        toastMessage: 'Sales intake saved to Job Record'
      };
    }

    case 'SAVE_ESTIMATE': {
      const est = action.estimate;
      const targetJob = state.jobs.find((j) => j.id === est.jobId) || currentJob;
      const newEntry: TimelineEntry = {
        id: generateId('t-est'),
        createdAt: new Date().toISOString(),
        role: getRoleDisplayLabel(state.activeRole),
        author: getActorNameForJob(state.activeRole, targetJob),
        type: 'estimate',
        title: `Estimate Saved: $${est.priceLow.toLocaleString()}–$${est.priceHigh.toLocaleString()}`,
        text: `${est.areaSqFt.toLocaleString()} sq ft ${est.stoneType} (${est.setting}) — ${est.hours} hrs (~${est.crewDays} crew-days), ${est.riskBufferPct}% risk buffer. Stages: ${est.gritStages.join(' -> ')}.`,
        badge: `${est.hours} hrs | $${est.priceLow.toLocaleString()}+`
      };

      return {
        ...state,
        jobs: state.jobs.map((j) =>
          j.id === targetJob.id
            ? {
                ...j,
                estimate: est,
                timeline: [newEntry, ...j.timeline]
              }
            : j
        ),
        activeTab: 'record',
        toastMessage: 'Estimate saved to Job Record & Timeline'
      };
    }

    case 'TOGGLE_CHECKLIST': {
      const targetItem = currentJob.checklist.find((i) => i.id === action.itemId);
      if (!targetItem) return state;

      const willBeDone = !targetItem.done;
      const shouldLogToTimeline = willBeDone && !targetItem.loggedOnce;

      const updatedJobs = state.jobs.map((j) => {
        if (j.id !== currentJob.id) return j;
        const updatedChecklist = j.checklist.map((item) =>
          item.id === action.itemId
            ? { ...item, done: willBeDone, loggedOnce: item.loggedOnce || willBeDone }
            : item
        );

        if (!shouldLogToTimeline) {
          return { ...j, checklist: updatedChecklist };
        }

        const checkLog: TimelineEntry = {
          id: generateId('t-chk'),
          createdAt: new Date().toISOString(),
          role: getRoleDisplayLabel(state.activeRole),
          author: getActorNameForJob(state.activeRole, currentJob),
          type: 'field-log',
          title: 'Checklist Step Completed',
          text: `Completed: "${targetItem.text}"`,
          badge: 'Checklist Step Done'
        };

        return {
          ...j,
          checklist: updatedChecklist,
          timeline: [checkLog, ...j.timeline]
        };
      });

      return {
        ...state,
        jobs: updatedJobs,
        toastMessage: shouldLogToTimeline ? 'Checklist step logged to Timeline' : state.toastMessage
      };
    }

    case 'LOG_AFTER_PHOTO': {
      const targetPhoto = currentJob.beforeAfterPhotos.find((p) => p.id === action.photoId);
      if (!targetPhoto || targetPhoto.afterLogged) return state;

      const newLog: TimelineEntry = {
        id: generateId('t-photo'),
        createdAt: new Date().toISOString(),
        role: getRoleDisplayLabel(state.activeRole),
        author: getActorNameForJob(state.activeRole, currentJob),
        type: 'field-log',
        title: `Logged After-Photo: ${targetPhoto.area}`,
        text: 'Recorded after-work reflection check for customer job record.',
        badge: 'After-Photo Logged'
      };

      return {
        ...state,
        jobs: state.jobs.map((j) =>
          j.id === currentJob.id
            ? {
                ...j,
                beforeAfterPhotos: j.beforeAfterPhotos.map((p) =>
                  p.id === action.photoId ? { ...p, afterLogged: true } : p
                ),
                timeline: [newLog, ...j.timeline]
              }
            : j
        ),
        toastMessage: 'After-photo logged to Customer Record'
      };
    }

    case 'ATTACH_JOB_PHOTO': {
      const { photo } = action;
      const newLog: TimelineEntry = {
        id: generateId('t-att'),
        createdAt: photo.createdAt,
        role: getRoleDisplayLabel(state.activeRole),
        author: getActorNameForJob(state.activeRole, currentJob),
        type: 'field-log',
        title: `Attached Site Photo: ${photo.caption}`,
        text: 'Saved downscaled inspection photo to local device job record.',
        badge: 'Site Photo Attached'
      };

      return {
        ...state,
        jobs: state.jobs.map((j) =>
          j.id === photo.jobId
            ? {
                ...j,
                attachedPhotos: [photo, ...(j.attachedPhotos || [])],
                timeline: [newLog, ...j.timeline]
              }
            : j
        ),
        toastMessage: 'Photo saved to device & attached to job'
      };
    }

    case 'LOG_DIAGNOSIS_TO_JOB': {
      const { entry, selectedTags, checkedCount, customNote } = action;
      const roleLabel = getRoleDisplayLabel(state.activeRole);
      const authorName = getActorNameForJob(state.activeRole, currentJob);
      const symptomsText = selectedTags.length ? `Symptoms: ${selectedTags.join(', ')}. ` : '';
      const noteText = customNote.trim() ? `Note: "${customNote.trim()}". ` : '';

      const newEntry: TimelineEntry = {
        id: generateId('t-diag'),
        createdAt: new Date().toISOString(),
        role: roleLabel,
        author: authorName,
        type: 'ai-diag',
        title: `Troubleshooter Logged: ${entry.shortTitle} (${
          entry.status === 'approved' ? 'Owner-approved' : 'Draft'
        })`,
        text: `${symptomsText}${noteText}SOP: ${entry.recommendedGrit} (${checkedCount}/${entry.steps.length} steps ticked).`,
        badge: entry.recommendedGrit
      };

      return {
        ...state,
        jobs: state.jobs.map((j) =>
          j.id === currentJob.id ? { ...j, timeline: [newEntry, ...j.timeline] } : j
        ),
        activeTab: 'record',
        toastMessage: 'SOP logged to Job Timeline'
      };
    }

    case 'ESCALATE_TO_PM': {
      // Block duplicate pending escalation for the same job + issueTitle
      const alreadyPending = state.escalations.some(
        (e) =>
          e.jobId === currentJob.id &&
          e.status === 'Pending PM Approval' &&
          e.issueTitle.toLowerCase() === action.issueTitle.toLowerCase()
      );
      if (alreadyPending) {
        return {
          ...state,
          toastMessage: 'Escalation already pending for this job & issue'
        };
      }

      const authorName = getActorNameForJob(state.activeRole, currentJob);
      const roleLabel = getRoleDisplayLabel(state.activeRole);
      const nowIso = new Date().toISOString();

      const newEsc: EscalationItem = {
        id: generateId('esc'),
        jobId: currentJob.id,
        jobTitle: `${currentJob.client} — ${currentJob.title}`,
        craftsman: authorName,
        authorRole: state.activeRole,
        createdAt: nowIso,
        issueTitle: action.issueTitle,
        impact: action.impact,
        recommendedFix: action.recommendedFix,
        status: 'Pending PM Approval'
      };

      const newTimelineEntry: TimelineEntry = {
        id: generateId('t-esc'),
        createdAt: nowIso,
        role: roleLabel,
        author: authorName,
        type: 'escalation',
        title: `Escalated to PM: ${action.issueTitle}`,
        text: `Flagged ${action.impact} schedule impact. Proposed fix: ${action.recommendedFix}.${
          action.notes ? ` Note: ${action.notes}` : ''
        }`,
        badge: 'Escalated to PM'
      };

      return {
        ...state,
        escalations: [newEsc, ...state.escalations],
        jobs: state.jobs.map((j) =>
          j.id === currentJob.id
            ? {
                ...j,
                status: 'Escalation Review',
                statusColor: 'amber',
                timeline: [newTimelineEntry, ...j.timeline]
              }
            : j
        ),
        toastMessage: 'Escalation added to PM Queue & Job Timeline'
      };
    }

    case 'RESOLVE_ESCALATION': {
      const targetEsc = state.escalations.find((e) => e.id === action.escalationId);
      if (!targetEsc) return state;

      // Credit the escalation's own job PM (not the currently selected job on screen!)
      const escJob = state.jobs.find((j) => j.id === targetEsc.jobId);
      const pmAuthor = escJob?.pm || 'Elena Rostova';
      const nowIso = new Date().toISOString();

      const updatedEscalations = state.escalations.map((item) =>
        item.id === action.escalationId
          ? {
              ...item,
              status: action.resolution,
              pmResponseNote: action.note.trim() || undefined
            }
          : item
      );

      const resolutionVerb =
        action.resolution === 'Approved'
          ? 'PM Approved Fix'
          : action.resolution === 'Rejected'
          ? 'PM Rejected Proposed Fix'
          : 'PM Sent Question to Crew';

      const newEntry: TimelineEntry = {
        id: generateId('t-pm'),
        createdAt: nowIso,
        role: 'PM',
        author: pmAuthor,
        type: 'dispatch',
        title: `${resolutionVerb}: ${targetEsc.issueTitle.split('(')[0].trim()}`,
        text:
          action.note.trim() ||
          (action.resolution === 'Approved'
            ? `Authorized crew to proceed with ${targetEsc.recommendedFix} (${targetEsc.impact}).`
            : action.resolution === 'Rejected'
            ? `Declined proposed ${targetEsc.recommendedFix}. Hold for revised instructions.`
            : `Requested clarification from field crew regarding ${targetEsc.issueTitle}.`),
        badge: `PM: ${action.resolution}`
      };

      const nextStatus =
        action.resolution === 'Approved'
          ? 'In Progress - PM Approved SOP'
          : action.resolution === 'Rejected'
          ? 'On Hold - PM Rejected Escalation'
          : 'Escalation Review - Awaiting Crew Reply';

      const nextColor =
        action.resolution === 'Approved'
          ? 'emerald'
          : action.resolution === 'Rejected'
          ? 'red'
          : 'amber';

      return {
        ...state,
        escalations: updatedEscalations,
        jobs: state.jobs.map((j) =>
          j.id === targetEsc.jobId
            ? {
                ...j,
                status: nextStatus,
                statusColor: nextColor,
                timeline: [newEntry, ...j.timeline]
              }
            : j
        ),
        toastMessage: `Escalation marked: ${action.resolution}`
      };
    }

    case 'SUBMIT_CORRECTION': {
      const authorName = getActorNameForJob(state.activeRole, currentJob);
      const newCorr: Correction = {
        id: generateId('corr'),
        targetType: action.targetType,
        entryId: action.entryId,
        entryTitle: action.entryTitle,
        jobId: currentJob.id,
        authorRole: state.activeRole,
        authorName,
        text: action.text.trim(),
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      return {
        ...state,
        corrections: [newCorr, ...state.corrections],
        toastMessage: 'Correction sent to Owner / GM Review Queue'
      };
    }

    case 'RESOLVE_CORRECTION':
      return {
        ...state,
        corrections: state.corrections.map((c) =>
          c.id === action.correctionId ? { ...c, status: action.status } : c
        ),
        toastMessage:
          action.status === 'applied' ? 'Correction marked applied' : 'Correction discarded'
      };

    case 'ADD_KNOWLEDGE_ENTRY': {
      const nowIso = new Date().toISOString();
      const newEntry: KnowledgeEntry = {
        ...action.entry,
        id: generateId('kb'),
        createdAt: nowIso,
        updatedAt: nowIso
      };
      return {
        ...state,
        knowledgeEntries: [newEntry, ...state.knowledgeEntries],
        toastMessage: 'Saved to Knowledge Base as Draft'
      };
    }

    case 'UPDATE_KNOWLEDGE_ENTRY': {
      const updatedEntry: KnowledgeEntry = {
        ...action.entry,
        updatedAt: new Date().toISOString()
      };
      return {
        ...state,
        knowledgeEntries: state.knowledgeEntries.map((e) =>
          e.id === updatedEntry.id ? updatedEntry : e
        ),
        toastMessage:
          updatedEntry.status === 'approved'
            ? `Approved "${updatedEntry.shortTitle}"`
            : `Updated "${updatedEntry.shortTitle}"`
      };
    }

    case 'DELETE_KNOWLEDGE_ENTRY':
      return {
        ...state,
        knowledgeEntries: state.knowledgeEntries.filter((e) => e.id !== action.entryId),
        toastMessage: 'Knowledge entry removed'
      };

    case 'SUBMIT_UNANSWERED_QUESTION': {
      const trimmed = action.question.trim();
      if (!trimmed) return state;
      const newQ: UnansweredQuestion = {
        id: generateId('uq'),
        question: trimmed,
        askedByRole: state.activeRole,
        askedByName: getActorNameForJob(state.activeRole, currentJob),
        createdAt: new Date().toISOString(),
        status: 'open'
      };
      return {
        ...state,
        unansweredQuestions: [newQ, ...state.unansweredQuestions],
        toastMessage: 'Question added to Owner / GM queue'
      };
    }

    case 'RESOLVE_UNANSWERED_QUESTION':
      return {
        ...state,
        unansweredQuestions: state.unansweredQuestions.map((q) =>
          q.id === action.questionId ? { ...q, status: action.status } : q
        ),
        toastMessage:
          action.status === 'answered' ? 'Question marked answered' : 'Question dismissed'
      };

    case 'UPDATE_ESTIMATOR_RATES':
      return {
        ...state,
        estimatorRates: action.rates,
        toastMessage: 'Estimator rates updated'
      };

    case 'IMPORT_KNOWLEDGE_DATA':
      return {
        ...state,
        knowledgeEntries: action.entries,
        estimatorRates: action.rates || state.estimatorRates,
        toastMessage: `Imported ${action.entries.length} knowledge entries`
      };

    case 'RESET_DEMO':
      return {
        ...INITIAL_STATE,
        theme: state.theme,
        activeRole: state.activeRole,
        desktopFrameMode: state.desktopFrameMode,
        toastMessage: 'Demo data reset to initial state'
      };

    default:
      return state;
  }
}

interface MarbleStoreContextValue {
  state: MarbleState;
  currentJob: JobRecord;
  dispatch: React.Dispatch<MarbleAction>;
  triggerToast: (msg: string) => void;
  resetDemo: () => void;
}

const MarbleStoreContext = createContext<MarbleStoreContextValue | null>(null);

export function MarbleStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(marbleReducer, INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage after mount to avoid SSR hydration mismatches
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          dispatch({
            type: 'HYDRATE',
            payload: {
              theme: parsed.theme === 'dark' || parsed.theme === 'light' ? parsed.theme : 'light',
              jobs: Array.isArray(parsed.jobs) && parsed.jobs.length ? parsed.jobs : INITIAL_JOBS,
              escalations: Array.isArray(parsed.escalations)
                ? parsed.escalations
                : INITIAL_ESCALATIONS,
              knowledgeEntries:
                Array.isArray(parsed.knowledgeEntries) && parsed.knowledgeEntries.length
                  ? parsed.knowledgeEntries
                  : INITIAL_KNOWLEDGE_ENTRIES,
              corrections: Array.isArray(parsed.corrections) ? parsed.corrections : [],
              unansweredQuestions: Array.isArray(parsed.unansweredQuestions)
                ? parsed.unansweredQuestions
                : [],
              estimatorRates: parsed.estimatorRates || DEFAULT_ESTIMATOR_RATES
            }
          });
        }
      }
    } catch {
      // Ignore storage read errors
    }
    setIsHydrated(true);
  }, []);

  // Sync data-theme attribute on <html>
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', state.theme);
    }
  }, [state.theme]);

  // Persist changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const toPersist = {
        theme: state.theme,
        jobs: state.jobs,
        escalations: state.escalations,
        knowledgeEntries: state.knowledgeEntries,
        corrections: state.corrections,
        unansweredQuestions: state.unansweredQuestions,
        estimatorRates: state.estimatorRates
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch {
      // Ignore quota errors
    }
  }, [
    isHydrated,
    state.theme,
    state.jobs,
    state.escalations,
    state.knowledgeEntries,
    state.corrections,
    state.unansweredQuestions,
    state.estimatorRates
  ]);

  // Auto-clear toast message
  useEffect(() => {
    if (!state.toastMessage) return;
    const msg = state.toastMessage;
    const timer = setTimeout(() => {
      dispatch({ type: 'SHOW_TOAST', message: null });
    }, 3400);
    return () => clearTimeout(timer);
  }, [state.toastMessage]);

  const currentJob = state.jobs.find((j) => j.id === state.selectedJobId) || state.jobs[0];

  const triggerToast = (message: string) => {
    dispatch({ type: 'SHOW_TOAST', message });
  };

  const resetDemo = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('marble_ai_jobs_v1');
      localStorage.removeItem('marble_ai_escalations_v1');
    } catch {
      // Ignore
    }
    clearAllPhotosIndexedDb();
    dispatch({ type: 'RESET_DEMO' });
  };

  return (
    <MarbleStoreContext.Provider
      value={{ state, currentJob, dispatch, triggerToast, resetDemo }}
    >
      {children}
    </MarbleStoreContext.Provider>
  );
}

export function useMarbleStore(): MarbleStoreContextValue {
  const ctx = useContext(MarbleStoreContext);
  if (!ctx) {
    throw new Error('useMarbleStore must be used within a MarbleStoreProvider');
  }
  return ctx;
}

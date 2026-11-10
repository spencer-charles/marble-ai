'use client';

import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Mic,
  MicOff,
  CheckCircle2,
  Trash2,
  Edit3,
  Download,
  Upload,
  ChevronRight,
  ChevronLeft,
  AlertTriangle,
  PlusCircle,
  Sliders
} from 'lucide-react';
import { CAPTURE_PROMPTS } from '@/data/capturePrompts';
import { SUB_DOMAINS } from '@/data/knowledgeBase';
import { SYMPTOM_TAGS } from '@/data/mockData';
import { formatRelativeTime } from '@/lib/helpers';
import { useMarbleStore } from '@/lib/store';
import {
  Correction,
  KnowledgeEntry,
  StoneCategory,
  SubDomainId,
  UnansweredQuestion
} from '@/types/marble';

export default function OwnerKnowledge() {
  const { state, dispatch, triggerToast } = useMarbleStore();
  const { knowledgeEntries, corrections, unansweredQuestions, estimatorRates } = state;

  const [activeSection, setActiveSection] = useState<'prompt' | 'review' | 'library'>('review');

  // Section 1: Today's Question state
  const [promptIdx, setPromptIdx] = useState(0);
  const currentPrompt = CAPTURE_PROMPTS[promptIdx] || CAPTURE_PROMPTS[0];
  const [captureTitle, setCaptureTitle] = useState('');
  const [captureStone, setCaptureStone] = useState<StoneCategory>('marble');
  const [captureAnswerText, setCaptureAnswerText] = useState('');
  const [captureSafety, setCaptureSafety] = useState('');
  const [isDictating, setIsDictating] = useState(false);

  // Section 2: Review Queue editing state
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<KnowledgeEntry | null>(null);

  // Section 3: Library filter & JSON import ref
  const [selectedSubDomain, setSelectedSubDomain] = useState<SubDomainId | 'ALL'>('ALL');
  const [showRatesEditor, setShowRatesEditor] = useState(false);
  const importFileRef = useRef<HTMLInputElement | null>(null);

  const draftEntries = knowledgeEntries.filter((e) => e.status === 'draft');
  const pendingCorrections = corrections.filter((c) => c.status === 'pending');
  const openQuestions = unansweredQuestions.filter((q) => q.status === 'open');
  const totalReviewCount =
    draftEntries.length + pendingCorrections.length + openQuestions.length;

  // Voice dictation helper
  const handleDictatePromptAnswer = () => {
    const SpeechRec =
      typeof window !== 'undefined'
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;
    if (!SpeechRec) {
      triggerToast('Speech recognition unavailable in this browser — type your answer below');
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      setIsDictating(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setCaptureAnswerText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsDictating(false);
      };
      recognition.onerror = () => setIsDictating(false);
      recognition.onend = () => setIsDictating(false);
      recognition.start();
    } catch {
      setIsDictating(false);
    }
  };

  // Save Today's Prompt answer as a Draft KnowledgeEntry
  const handleSavePromptAsDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captureAnswerText.trim()) return;

    const rawLines = captureAnswerText
      .split(/\n|(?<=\.)\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 8);

    const stepsList =
      rawLines.length > 0 ? rawLines : [captureAnswerText.trim()];

    const titleText =
      captureTitle.trim() ||
      `${currentPrompt.styleLabel}: ${currentPrompt.prompt.slice(0, 48)}...`;

    dispatch({
      type: 'ADD_KNOWLEDGE_ENTRY',
      entry: {
        shortTitle: titleText.slice(0, 38),
        title: titleText,
        stoneTag: `${captureStone.toUpperCase()} • ${currentPrompt.styleLabel}`,
        surfaceTypes: [captureStone],
        symptomTags: ['White haze'],
        subDomain: currentPrompt.subDomain,
        serviceCategory:
          currentPrompt.defaultAudience === 'owner' ? 'operations' : 'restoration',
        audience: currentPrompt.defaultAudience,
        difficulty: 'standard',
        status: 'draft',
        reviewNote: 'Captured from Owner daily scenario prompt — review tags & steps before approving.',
        rootCause: captureAnswerText.trim(),
        steps: stepsList,
        safetyWarning:
          captureSafety.trim() ||
          'Verify stone sensitivity and moisture reading before executing.',
        recommendedGrit: 'Owner Captured SOP',
        estTimeImpact: 'Standard Field Spec',
        keywords: titleText
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .split(/\s+/)
          .filter((w) => w.length >= 3),
        source: `Owner Prompt #${currentPrompt.dayIndex}`
      }
    });

    setCaptureTitle('');
    setCaptureAnswerText('');
    setCaptureSafety('');
    setActiveSection('review');
  };

  // Start editing a knowledge entry in the Review Queue or Library
  const startEditingEntry = (entry: KnowledgeEntry) => {
    setEditingEntryId(entry.id);
    setEditDraft({ ...entry, steps: [...entry.steps], symptomTags: [...entry.symptomTags] });
  };

  // Approve an entry directly or from the edit form
  const handleApproveEntry = (entry: KnowledgeEntry) => {
    dispatch({
      type: 'UPDATE_KNOWLEDGE_ENTRY',
      entry: {
        ...entry,
        status: 'approved',
        reviewNote: undefined,
        source: entry.source.replace('(Unverified Draft)', '(Owner-Approved)')
      }
    });
    if (editingEntryId === entry.id) {
      setEditingEntryId(null);
      setEditDraft(null);
    }
  };

  const handleSaveEditedEntry = (approveAsWell: boolean) => {
    if (!editDraft) return;
    dispatch({
      type: 'UPDATE_KNOWLEDGE_ENTRY',
      entry: {
        ...editDraft,
        status: approveAsWell ? 'approved' : editDraft.status,
        reviewNote: approveAsWell ? undefined : editDraft.reviewNote
      }
    });
    setEditingEntryId(null);
    setEditDraft(null);
  };

  // Apply a crew correction to its target entry (opens the entry editor pre-populated)
  const handleOpenCorrectionInEditor = (corr: Correction) => {
    const target = knowledgeEntries.find((e) => e.id === corr.entryId);
    if (target) {
      setEditingEntryId(target.id);
      setEditDraft({
        ...target,
        reviewNote: `Crew correction from ${corr.authorName}: "${corr.text}"`,
        safetyWarning: `${target.safetyWarning} [Crew Note: ${corr.text}]`
      });
    }
    dispatch({
      type: 'RESOLVE_CORRECTION',
      correctionId: corr.id,
      status: 'applied'
    });
  };

  // Convert an unanswered question from the Ask tab into a new draft entry
  const handleTurnQuestionIntoDraft = (uq: UnansweredQuestion) => {
    setCaptureTitle(uq.question);
    setCaptureAnswerText('');
    dispatch({
      type: 'RESOLVE_UNANSWERED_QUESTION',
      questionId: uq.id,
      status: 'answered'
    });
    setActiveSection('prompt');
  };

  // JSON Export
  const handleExportJson = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      version: 2,
      knowledgeEntries,
      estimatorRates
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `marble-ai-knowledge-base-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast('Exported Knowledge Base as JSON');
  };

  // JSON Import
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const entries = Array.isArray(parsed)
          ? parsed
          : Array.isArray(parsed?.knowledgeEntries)
          ? parsed.knowledgeEntries
          : null;
        if (!entries || entries.length === 0) {
          triggerToast('Invalid JSON file: no knowledgeEntries array found');
          return;
        }
        dispatch({
          type: 'IMPORT_KNOWLEDGE_DATA',
          entries,
          rates: parsed?.estimatorRates
        });
      } catch {
        triggerToast('Failed to parse JSON file');
      }
    };
    reader.readAsText(file);
  };

  const filteredLibraryEntries =
    selectedSubDomain === 'ALL'
      ? knowledgeEntries
      : knowledgeEntries.filter((e) => e.subDomain === selectedSubDomain);

  return (
    <div className="space-y-4">
      {/* Owner Mode Banner & Sub-Navigation */}
      <div className="bg-purple-500/15 border border-purple-500/40 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="text-xs font-black uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            Owner / GM Knowledge Capture &amp; Review Hub
          </div>
          <span className="text-xs font-bold bg-stone-950 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30">
            {knowledgeEntries.filter((e) => e.status === 'approved').length} Approved /{' '}
            {draftEntries.length} Drafts
          </span>
        </div>

        {/* 3 Section Switcher Buttons */}
        <div className="grid grid-cols-3 gap-1.5 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
          <button
            type="button"
            onClick={() => setActiveSection('prompt')}
            className={`min-h-11 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'prompt'
                ? 'bg-purple-400 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            1. Today&apos;s Prompt
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('review')}
            className={`min-h-11 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeSection === 'review'
                ? 'bg-purple-400 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            <span>2. Review Queue</span>
            {totalReviewCount > 0 && (
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full font-black leading-none ${
                  activeSection === 'review'
                    ? 'bg-stone-950 text-purple-300'
                    : 'bg-amber-500 text-stone-950'
                }`}
              >
                {totalReviewCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('library')}
            className={`min-h-11 py-2 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSection === 'library'
                ? 'bg-purple-400 text-stone-950 shadow-sm'
                : 'text-stone-300 hover:text-white'
            }`}
          >
            3. KB Library ({knowledgeEntries.length})
          </button>
        </div>
      </div>

      {/* ===================================================================
          SECTION 1: TODAY'S QUESTION (VOICE / TEXT CAPTURE)
      =================================================================== */}
      {activeSection === 'prompt' && (
        <form
          onSubmit={handleSavePromptAsDraft}
          className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3.5"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Prompt #{currentPrompt.dayIndex}: {currentPrompt.styleLabel}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Previous prompt"
                onClick={() =>
                  setPromptIdx(
                    (prev) => (prev - 1 + CAPTURE_PROMPTS.length) % CAPTURE_PROMPTS.length
                  )
                }
                className="min-h-9 min-w-9 flex items-center justify-center rounded-lg bg-stone-950 text-stone-300 border border-stone-800 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                aria-label="Next prompt"
                onClick={() => setPromptIdx((prev) => (prev + 1) % CAPTURE_PROMPTS.length)}
                className="min-h-9 min-w-9 flex items-center justify-center rounded-lg bg-stone-950 text-stone-300 border border-stone-800 cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-1.5">
            <div className="text-base font-bold text-stone-100 leading-snug">
              &ldquo;{currentPrompt.prompt}&rdquo;
            </div>
            <p className="text-xs text-stone-400">{currentPrompt.followUpHint}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label
                htmlFor="capture-title-input"
                className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
              >
                Entry Title
              </label>
              <input
                id="capture-title-input"
                type="text"
                value={captureTitle}
                onChange={(e) => setCaptureTitle(e.target.value)}
                placeholder="e.g., Reading 45° Reflection on Soft Marble"
                className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm rounded-xl px-3 py-2 border border-stone-700"
              />
            </div>

            <div>
              <label
                htmlFor="capture-stone-select"
                className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
              >
                Primary Stone Type
              </label>
              <select
                id="capture-stone-select"
                value={captureStone}
                onChange={(e) => setCaptureStone(e.target.value as StoneCategory)}
                className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm font-semibold rounded-xl px-3 py-2 border border-stone-700"
              >
                <option value="marble">Marble</option>
                <option value="travertine">Travertine</option>
                <option value="terrazzo">Terrazzo</option>
                <option value="granite">Granite</option>
                <option value="limestone">Limestone</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="capture-answer-textarea"
                className="text-xs font-bold uppercase tracking-wider text-stone-300"
              >
                Your Answer / Step-by-Step Rule
              </label>
              <button
                type="button"
                onClick={handleDictatePromptAnswer}
                className={`min-h-9 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border cursor-pointer ${
                  isDictating
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-stone-950 text-purple-300 border-purple-500/40'
                }`}
              >
                {isDictating ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" /> Listening...
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" /> Dictate by Voice
                  </>
                )}
              </button>
            </div>
            <textarea
              id="capture-answer-textarea"
              rows={4}
              value={captureAnswerText}
              onChange={(e) => setCaptureAnswerText(e.target.value)}
              placeholder="Speak or type your explanation. Separate steps with periods or new lines..."
              className="w-full bg-stone-950 text-stone-100 text-sm rounded-xl p-3 border border-stone-700"
            />
          </div>

          <div>
            <label
              htmlFor="capture-safety-input"
              className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
            >
              Critical Safety or Stone Warning (Optional)
            </label>
            <input
              id="capture-safety-input"
              type="text"
              value={captureSafety}
              onChange={(e) => setCaptureSafety(e.target.value)}
              placeholder="e.g., Never run dry resin pads over 400-grit on dark marble..."
              className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm rounded-xl px-3 py-2 border border-stone-700"
            />
          </div>

          <button
            type="submit"
            className="min-h-12 w-full py-3 rounded-xl bg-purple-400 hover:bg-purple-300 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            Save Answer as Draft Knowledge Entry
          </button>
        </form>
      )}

      {/* ===================================================================
          SECTION 2: REVIEW QUEUE (DRAFTS, CREW CORRECTIONS & OPEN QUESTIONS)
      =================================================================== */}
      {activeSection === 'review' && (
        <div className="space-y-4">
          {/* Active Entry Editor Modal / Inline Card */}
          {editDraft && (
            <div className="bg-stone-900 rounded-2xl p-4 border-2 border-purple-400 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-purple-300">
                  Editing Knowledge Entry: {editDraft.shortTitle}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEntryId(null);
                    setEditDraft(null);
                  }}
                  className="text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
                >
                  Close Editor
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Full Title</label>
                <input
                  type="text"
                  value={editDraft.title}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      title: e.target.value,
                      shortTitle: e.target.value.slice(0, 36)
                    })
                  }
                  className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm rounded-xl px-3 py-2 border border-stone-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">Sub-Domain</label>
                  <select
                    value={editDraft.subDomain}
                    onChange={(e) =>
                      setEditDraft({ ...editDraft, subDomain: e.target.value as SubDomainId })
                    }
                    className="min-h-11 w-full bg-stone-950 text-stone-100 text-xs font-semibold rounded-xl px-2.5 py-2 border border-stone-700"
                  >
                    {SUB_DOMAINS.map((sd) => (
                      <option key={sd.id} value={sd.id}>
                        {sd.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-300 mb-1">Audience</label>
                  <select
                    value={editDraft.audience}
                    onChange={(e) =>
                      setEditDraft({
                        ...editDraft,
                        audience: e.target.value as 'tech' | 'owner'
                      })
                    }
                    className="min-h-11 w-full bg-stone-950 text-stone-100 text-xs font-semibold rounded-xl px-2.5 py-2 border border-stone-700"
                  >
                    <option value="tech">Tech &amp; All Roles</option>
                    <option value="owner">Owner / PM Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Root Cause</label>
                <textarea
                  rows={2}
                  value={editDraft.rootCause}
                  onChange={(e) => setEditDraft({ ...editDraft, rootCause: e.target.value })}
                  className="w-full bg-stone-950 text-stone-100 text-sm rounded-xl p-2.5 border border-stone-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Steps (One step per line)
                </label>
                <textarea
                  rows={4}
                  value={editDraft.steps.join('\n')}
                  onChange={(e) =>
                    setEditDraft({
                      ...editDraft,
                      steps: e.target.value
                        .split('\n')
                        .map((s) => s.trim())
                        .filter(Boolean)
                    })
                  }
                  className="w-full bg-stone-950 text-stone-100 text-sm rounded-xl p-2.5 border border-stone-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Safety Warning
                </label>
                <textarea
                  rows={2}
                  value={editDraft.safetyWarning}
                  onChange={(e) => setEditDraft({ ...editDraft, safetyWarning: e.target.value })}
                  className="w-full bg-stone-950 text-stone-100 text-sm rounded-xl p-2.5 border border-stone-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">
                  Symptom Tags
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {SYMPTOM_TAGS.map((tag) => {
                    const active = editDraft.symptomTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setEditDraft({
                            ...editDraft,
                            symptomTags: active
                              ? editDraft.symptomTags.filter((t) => t !== tag)
                              : [...editDraft.symptomTags, tag]
                          })
                        }
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                          active
                            ? 'bg-amber-500 text-stone-950 border-amber-400'
                            : 'bg-stone-950 text-stone-300 border-stone-800'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleSaveEditedEntry(true)}
                  className="min-h-11 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save &amp; Mark Owner-Approved
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveEditedEntry(false)}
                  className="min-h-11 py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs cursor-pointer"
                >
                  Save as Draft
                </button>
              </div>
            </div>
          )}

          {/* Crew Corrections Inbox */}
          {pendingCorrections.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Crew Corrections Inbox ({pendingCorrections.length})
              </h3>
              {pendingCorrections.map((corr) => (
                <div
                  key={corr.id}
                  className="bg-stone-900 rounded-2xl p-4 border border-amber-500/50 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-300">
                      Correction on: {corr.entryTitle}
                    </span>
                    <span className="text-stone-400">
                      {corr.authorName} • {formatRelativeTime(corr.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-stone-100 bg-stone-950 p-3 rounded-xl border border-stone-800">
                    &ldquo;{corr.text}&rdquo;
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenCorrectionInEditor(corr)}
                      className="min-h-11 flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs cursor-pointer"
                    >
                      Edit Entry &amp; Apply
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: 'RESOLVE_CORRECTION',
                          correctionId: corr.id,
                          status: 'discarded'
                        })
                      }
                      className="min-h-11 px-3 py-2 rounded-xl bg-stone-950 text-stone-400 hover:text-red-300 text-xs font-semibold border border-stone-800 cursor-pointer"
                    >
                      Discard
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Unanswered Questions from Ask Tab */}
          {openQuestions.length > 0 && (
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Unanswered Team Questions ({openQuestions.length})
              </h3>
              {openQuestions.map((uq) => (
                <div
                  key={uq.id}
                  className="bg-stone-900 rounded-2xl p-4 border border-sky-500/40 space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs text-stone-400">
                    <span>Asked by {uq.askedByName}</span>
                    <span>{formatRelativeTime(uq.createdAt)}</span>
                  </div>
                  <div className="text-sm font-bold text-stone-100">&ldquo;{uq.question}&rdquo;</div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleTurnQuestionIntoDraft(uq)}
                      className="min-h-11 flex-1 py-2 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold text-xs cursor-pointer"
                    >
                      Write Answer in Capture Form
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: 'RESOLVE_UNANSWERED_QUESTION',
                          questionId: uq.id,
                          status: 'discarded'
                        })
                      }
                      className="min-h-11 px-3 py-2 rounded-xl bg-stone-950 text-stone-400 text-xs font-semibold border border-stone-800 cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Draft Knowledge Entries Queue */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
              Unverified Draft Entries ({draftEntries.length})
            </h3>
            {draftEntries.length === 0 ? (
              <div className="bg-stone-900 rounded-2xl p-5 border border-stone-800 text-center text-sm text-stone-400">
                All Knowledge Base entries have been reviewed and approved!
              </div>
            ) : (
              draftEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-stone-900 rounded-2xl p-4 border border-amber-500/40 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Draft — Needs Owner Sign-Off
                    </span>
                    <span className="text-xs text-stone-400">{entry.stoneTag}</span>
                  </div>

                  <div className="text-base font-bold text-stone-100">{entry.title}</div>

                  {entry.reviewNote && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2 text-xs text-amber-200 leading-relaxed">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{entry.reviewNote}</span>
                    </div>
                  )}

                  <p className="text-xs text-stone-300 leading-relaxed">{entry.rootCause}</p>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleApproveEntry(entry)}
                      className="min-h-11 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      Approve
                    </button>

                    <button
                      type="button"
                      onClick={() => startEditingEntry(entry)}
                      className="min-h-11 py-2 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4 shrink-0" />
                      Edit / Tag
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        dispatch({ type: 'DELETE_KNOWLEDGE_ENTRY', entryId: entry.id })
                      }
                      className="min-h-11 py-2 px-3 rounded-xl bg-stone-950 hover:bg-red-950/40 text-stone-400 hover:text-red-300 border border-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 shrink-0" />
                      Discard
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ===================================================================
          SECTION 3: KNOWLEDGE LIBRARY, SUB-DOMAIN COVERAGE & JSON EXPORT/IMPORT
      =================================================================== */}
      {activeSection === 'library' && (
        <div className="space-y-4">
          {/* Export / Import & Rates Editor Controls */}
          <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                Backup &amp; Estimator Rate Settings
              </span>
              <button
                type="button"
                onClick={() => setShowRatesEditor((prev) => !prev)}
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                {showRatesEditor ? 'Hide Estimator Rates' : 'Edit Estimator Rates'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleExportJson}
                className="min-h-11 py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-100 text-xs font-bold border border-stone-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                Export KB JSON
              </button>

              <input
                ref={importFileRef}
                type="file"
                accept="application/json,.json"
                onChange={handleImportJson}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => importFileRef.current?.click()}
                className="min-h-11 py-2.5 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-100 text-xs font-bold border border-stone-700 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-sky-400" />
                Import KB JSON
              </button>
            </div>

            {showRatesEditor && (
              <div className="bg-stone-950 p-3.5 rounded-xl border border-stone-800 space-y-3">
                <div className="text-xs font-bold text-amber-300">
                  Owner Placeholder Estimator Rates (Used in Sales Bid Co-Pilot)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="block text-stone-400 mb-1">Hourly Labor ($/hr)</label>
                    <input
                      type="number"
                      value={estimatorRates.hourlyRate}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_ESTIMATOR_RATES',
                          rates: {
                            ...estimatorRates,
                            hourlyRate: Number(e.target.value) || 100
                          }
                        })
                      }
                      className="min-h-10 w-full bg-stone-900 text-stone-100 font-bold rounded-lg px-2.5 py-1.5 border border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Marble (sq ft/hr)</label>
                    <input
                      type="number"
                      value={estimatorRates.sqFtPerHour.marble}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_ESTIMATOR_RATES',
                          rates: {
                            ...estimatorRates,
                            sqFtPerHour: {
                              ...estimatorRates.sqFtPerHour,
                              marble: Number(e.target.value) || 50
                            }
                          }
                        })
                      }
                      className="min-h-10 w-full bg-stone-900 text-stone-100 font-bold rounded-lg px-2.5 py-1.5 border border-stone-700"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-400 mb-1">Travertine (sq ft/hr)</label>
                    <input
                      type="number"
                      value={estimatorRates.sqFtPerHour.travertine}
                      onChange={(e) =>
                        dispatch({
                          type: 'UPDATE_ESTIMATOR_RATES',
                          rates: {
                            ...estimatorRates,
                            sqFtPerHour: {
                              ...estimatorRates.sqFtPerHour,
                              travertine: Number(e.target.value) || 50
                            }
                          }
                        })
                      }
                      className="min-h-10 w-full bg-stone-900 text-stone-100 font-bold rounded-lg px-2.5 py-1.5 border border-stone-700"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 8 Sub-Domains Coverage Matrix */}
          <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300">
                8 Sub-Domains Coverage (Spot Gaps)
              </h3>
              {selectedSubDomain !== 'ALL' && (
                <button
                  type="button"
                  onClick={() => setSelectedSubDomain('ALL')}
                  className="text-xs text-purple-300 underline cursor-pointer"
                >
                  Show All ({knowledgeEntries.length})
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUB_DOMAINS.map((sd) => {
                const count = knowledgeEntries.filter((e) => e.subDomain === sd.id).length;
                const approvedCount = knowledgeEntries.filter(
                  (e) => e.subDomain === sd.id && e.status === 'approved'
                ).length;
                const isSelected = selectedSubDomain === sd.id;

                return (
                  <button
                    key={sd.id}
                    type="button"
                    onClick={() =>
                      setSelectedSubDomain(isSelected ? 'ALL' : sd.id)
                    }
                    className={`min-h-12 text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-purple-500/20 border-purple-400'
                        : count === 0
                        ? 'bg-stone-950/60 border-red-500/30 hover:border-red-500/50'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] text-stone-400 uppercase truncate">
                        {sd.pillar}
                      </div>
                      <div className="text-xs font-bold text-stone-100 truncate">{sd.label}</div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        count === 0
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : approvedCount > 0
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {count === 0 ? '0 (Gap)' : `${approvedCount}/${count} appv`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Filtered Library Entries */}
          <div className="space-y-2.5">
            {filteredLibraryEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-2"
              >
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        entry.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {entry.status === 'approved' ? 'Owner-approved' : 'Draft'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800">
                      Audience: {entry.audience === 'owner' ? 'Owner/PM' : 'All Techs'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      startEditingEntry(entry);
                      setActiveSection('review');
                    }}
                    className="text-xs font-bold text-purple-300 hover:text-purple-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>
                </div>

                <div className="text-sm font-bold text-stone-100">{entry.title}</div>
                <p className="text-xs text-stone-300 leading-relaxed">{entry.rootCause}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

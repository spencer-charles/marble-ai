'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  CheckSquare,
  Square,
  BookOpen,
  ThumbsDown,
  Mic,
  MicOff,
  Send,
  Sparkles,
  Eye,
  Volume2
} from 'lucide-react';
import { DECISION_QUESTIONS } from '@/data/knowledgeBase';
import { SYMPTOM_TAGS } from '@/data/mockData';
import { diagnose } from '@/lib/ai';
import { generateId } from '@/lib/helpers';
import { downscaleImageFile, savePhotoToIndexedDb } from '@/lib/photoStore';
import { useMarbleStore } from '@/lib/store';
import { DiagnosisMatch, StoneCategory } from '@/types/marble';

const STONE_OPTIONS: { value: StoneCategory; label: string }[] = [
  { value: 'marble', label: 'Marble (Calcite)' },
  { value: 'travertine', label: 'Travertine' },
  { value: 'terrazzo', label: 'Terrazzo' },
  { value: 'granite', label: 'Granite / Quartzite' },
  { value: 'limestone', label: 'Limestone' }
];

const QUICK_SCENARIO_PRESETS: {
  label: string;
  stone: StoneCategory;
  tags: string[];
  answers: Record<string, string>;
}[] = [
  {
    label: 'Cloudy Ring (Marble)',
    stone: 'marble',
    tags: ['White haze', 'Water rings'],
    answers: {
      water_test: 'absorbs-fast',
      acid_reaction: 'dull-smooth-ring',
      moisture_check: 'elevated-moisture'
    }
  },
  {
    label: 'Orange Grout Halo',
    stone: 'marble',
    tags: ['Orange rust halo', 'Water rings'],
    answers: {
      water_test: 'damp-wicking',
      acid_reaction: 'subsurface-discolor',
      moisture_check: 'elevated-moisture'
    }
  },
  {
    label: 'Tile Lippage & Chips',
    stone: 'marble',
    tags: ['Edge chipping', 'Pitting'],
    answers: {
      water_test: 'absorbs-fast',
      acid_reaction: 'sharp-tile-edge',
      moisture_check: 'normal-dry'
    }
  },
  {
    label: 'Dark Oil Stain (Granite)',
    stone: 'granite',
    tags: ['Stain darkening', 'Resin bleed'],
    answers: {
      water_test: 'beads-up',
      acid_reaction: 'subsurface-discolor',
      moisture_check: 'normal-dry'
    }
  }
];

export default function Troubleshooter() {
  const { state, currentJob, dispatch, triggerToast } = useMarbleStore();
  const { knowledgeEntries, escalations } = state;

  // Pre-fill stone type from active job, and re-sync when selected job changes
  const [stoneType, setStoneType] = useState<StoneCategory>(
    currentJob.stoneProfile.stoneCategory || 'marble'
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(['White haze', 'Water rings']);
  const [clarifyingAnswers, setClarifyingAnswers] = useState<Record<string, string>>({
    water_test: 'absorbs-fast',
    acid_reaction: 'dull-smooth-ring',
    moisture_check: 'elevated-moisture'
  });
  const [customSymptomText, setCustomSymptomText] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<DiagnosisMatch | null>(null);
  // SOP steps always start unticked ({})
  const [checkedSopSteps, setCheckedSopSteps] = useState<Record<number, boolean>>({});

  // Photo upload state
  const [attachedPreviewUrl, setAttachedPreviewUrl] = useState<string | null>(null);
  const [photoCaption, setPhotoCaption] = useState('Floor defect inspection photo');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Thumbs-down correction state
  const [showCorrectionBox, setShowCorrectionBox] = useState(false);
  const [correctionText, setCorrectionText] = useState('');
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Sync stone type when user switches active job
  useEffect(() => {
    setStoneType(currentJob.stoneProfile.stoneCategory || 'marble');
    setAttachedPreviewUrl(null);
  }, [currentJob.id, currentJob.stoneProfile.stoneCategory]);

  // Run simulated diagnosis whenever inputs or KB entries change
  useEffect(() => {
    let active = true;
    setIsMatching(true);
    diagnose(
      {
        stoneType,
        selectedTags,
        clarifyingAnswers,
        customText: customSymptomText
      },
      knowledgeEntries
    ).then((res) => {
      if (!active) return;
      setIsMatching(false);
      setMatchResult((prev) => {
        if (prev?.entry.id !== res?.entry.id) {
          // Reset checked SOP steps to unticked when matched entry changes
          setCheckedSopSteps({});
          setShowCorrectionBox(false);
        }
        return res;
      });
    });
    return () => {
      active = false;
    };
  }, [stoneType, selectedTags, clarifyingAnswers, customSymptomText, knowledgeEntries]);

  const toggleSymptomTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSelectClarifying = (qId: string, val: string) => {
    setClarifyingAnswers((prev) => ({
      ...prev,
      [qId]: prev[qId] === val ? '' : val
    }));
  };

  const handleApplyQuickPreset = (preset: (typeof QUICK_SCENARIO_PRESETS)[number]) => {
    setStoneType(preset.stone);
    setSelectedTags(preset.tags);
    setClarifyingAnswers(preset.answers);
    setCustomSymptomText('');
    setCheckedSopSteps({});
  };

  const handleClearAllInputs = () => {
    setSelectedTags([]);
    setClarifyingAnswers({});
    setCustomSymptomText('');
    setCheckedSopSteps({});
  };

  const handlePhotoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await downscaleImageFile(file, 800);
      const photoId = generateId('photo');
      await savePhotoToIndexedDb(photoId, dataUrl);
      setAttachedPreviewUrl(dataUrl);
      dispatch({
        type: 'ATTACH_JOB_PHOTO',
        photo: {
          id: photoId,
          jobId: currentJob.id,
          caption: photoCaption.trim() || file.name || 'Site Defect Photo',
          createdAt: new Date().toISOString()
        }
      });
    } catch {
      triggerToast('Could not process image file');
    }
  };

  const handleVoiceDictation = () => {
    const SpeechRec =
      typeof window !== 'undefined'
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        : null;
    if (!SpeechRec) {
      triggerToast('Browser speech recognition unavailable — please type your correction');
      return;
    }
    try {
      const recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      setIsRecordingVoice(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript || '';
        if (transcript) {
          setCorrectionText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
        setIsRecordingVoice(false);
      };
      recognition.onerror = () => setIsRecordingVoice(false);
      recognition.onend = () => setIsRecordingVoice(false);
      recognition.start();
    } catch {
      setIsRecordingVoice(false);
    }
  };

  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionText.trim() || !matchResult) return;
    dispatch({
      type: 'SUBMIT_CORRECTION',
      targetType: 'diagnosis',
      entryId: matchResult.entry.id,
      entryTitle: matchResult.entry.title,
      text: correctionText
    });
    setCorrectionText('');
    setShowCorrectionBox(false);
  };

  const matchedEntry = matchResult?.entry || null;

  // Check if an escalation is already pending for this job + issue
  const issueTitleForEscalation =
    matchedEntry?.title ||
    `Unmatched ${stoneType} defect (${selectedTags.join(', ') || 'site issue'})`;

  const isEscalationAlreadyPending = escalations.some(
    (esc) =>
      esc.jobId === currentJob.id &&
      esc.status === 'Pending PM Approval' &&
      esc.issueTitle.toLowerCase() === issueTitleForEscalation.toLowerCase()
  );

  return (
    <div className="space-y-4">
      {/* Step 1: Attach Site Photo & Select Stone Type */}
      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Camera className="w-4 h-4" />
            1. Site Photo &amp; Stone Surface
          </h2>
          <span className="text-xs text-stone-400">Pre-filled from job</span>
        </div>

        {/* Photo Upload / Camera Capture */}
        <div className="bg-stone-950 rounded-xl p-3 border border-stone-800 space-y-2.5">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={photoCaption}
              onChange={(e) => setPhotoCaption(e.target.value)}
              placeholder="Photo area / caption..."
              className="min-h-11 flex-1 bg-stone-900 text-stone-100 text-sm rounded-xl px-3 py-2 border border-stone-700"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelected}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-11 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 font-bold text-sm flex items-center justify-center gap-2 border border-stone-700 cursor-pointer shrink-0"
            >
              <Camera className="w-4 h-4" />
              Attach Photo
            </button>
          </div>

          {attachedPreviewUrl && (
            <div className="flex items-center gap-3 pt-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={attachedPreviewUrl}
                alt="Attached floor defect"
                className="w-16 h-16 object-cover rounded-lg border border-amber-500/50"
              />
              <div className="text-xs text-emerald-400 font-semibold">
                Saved to job record (downscaled in IndexedDB).
              </div>
            </div>
          )}

          <p className="text-xs text-stone-400 leading-relaxed">
            Note: Photo attaches to the job record. Simulated lookup does not analyze pixels—it
            matches using stone type, symptom tags, and clarifying answers below.
          </p>
        </div>

        {/* Stone Type Selector */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1.5">
            Stone Surface Type
          </label>
          <div className="flex flex-wrap gap-2">
            {STONE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStoneType(opt.value)}
                className={`min-h-11 px-3.5 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                  stoneType === opt.value
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm'
                    : 'bg-stone-950 text-stone-300 border-stone-700 hover:border-stone-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2: Symptom Tags & Quick Scenario Presets */}
      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <label className="text-sm font-bold uppercase tracking-wider text-stone-200">
            2. Surface Symptoms
          </label>
          <button
            type="button"
            onClick={handleClearAllInputs}
            className="text-xs font-semibold text-stone-400 hover:text-stone-200 underline cursor-pointer"
          >
            Clear selections
          </button>
        </div>

        {/* Quick Preset Loader Strip for Demo Convenience */}
        <div className="space-y-1.5">
          <div className="text-xs text-stone-400">Quick demo presets:</div>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_SCENARIO_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleApplyQuickPreset(preset)}
                className="min-h-11 px-3 py-2 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-200 text-xs font-semibold border border-stone-800 text-left transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Symptom Tag Pills (44px+ Tap Targets) */}
        <div className="flex flex-wrap gap-2 pt-1">
          {SYMPTOM_TAGS.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleSymptomTag(tag)}
                className={`min-h-11 px-3.5 py-2 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
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

        <input
          type="text"
          value={customSymptomText}
          onChange={(e) => setCustomSymptomText(e.target.value)}
          placeholder="Optional keyword or field note (e.g., rust, acetone, 400-grit)..."
          className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm rounded-xl px-3.5 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
        />
      </div>

      {/* Step 3: Clarifying Questions from Decision Tree */}
      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3.5">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-200">
            3. Clarifying Field Checks
          </h3>
          <p className="text-xs text-stone-400 mt-0.5">
            Answer 2–3 quick field checks to narrow down the root cause.
          </p>
        </div>

        <div className="space-y-3">
          {DECISION_QUESTIONS.map((q) => (
            <div
              key={q.id}
              className="bg-stone-950 rounded-xl p-3 border border-stone-800 space-y-2"
            >
              <div className="text-sm font-bold text-stone-100">{q.question}</div>
              <div className="text-xs text-stone-400">{q.helpText}</div>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {q.options.map((opt) => {
                  const selected = clarifyingAnswers[q.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectClarifying(q.id, opt.value)}
                      className={`min-h-11 text-left px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        selected
                          ? 'bg-sky-500/20 text-sky-200 border-sky-400 font-bold'
                          : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selected && <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 4: Knowledge Base Answer Card or No-Match State */}
      {isMatching ? (
        <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 text-center text-sm text-stone-300 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Matching Knowledge Base entries...</span>
        </div>
      ) : matchedEntry && matchResult ? (
        <div className="bg-stone-900 rounded-2xl border-2 border-stone-700 overflow-hidden shadow-xl space-y-4 p-4">
          {/* Status Badge (Draft vs Owner-approved) + Matched On Reasons */}
          <div className="space-y-2 border-b border-stone-800 pb-3">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                  matchedEntry.status === 'approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                {matchedEntry.status === 'approved' ? 'Owner-approved SOP' : 'Draft — Unverified'}
              </span>
              <span className="text-xs font-bold bg-stone-950 text-amber-300 px-2.5 py-1 rounded-lg border border-stone-700">
                {matchedEntry.estTimeImpact}
              </span>
            </div>

            <h3 className="text-base font-extrabold text-stone-100 leading-snug">
              {matchedEntry.title}
            </h3>

            {/* Matched-On Reasons */}
            <div className="flex items-center flex-wrap gap-1.5 pt-1">
              <span className="text-xs font-semibold text-stone-400">Matched on:</span>
              {matchResult.matchedReasons.map((reason, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 rounded-md bg-stone-950 text-stone-200 border border-stone-800"
                >
                  {reason}
                </span>
              ))}
            </div>

            {/* Draft Review Notice if unapproved */}
            {matchedEntry.status === 'draft' && matchedEntry.reviewNote && (
              <div className="mt-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
                <strong>Pending Owner Review:</strong> {matchedEntry.reviewNote}
              </div>
            )}
          </div>

          {/* Root Cause Analysis */}
          <div className="bg-stone-950/90 p-3.5 rounded-xl border border-stone-800">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-400 mb-1">
              Root Cause (Chemical / Mechanical)
            </div>
            <p className="text-sm text-stone-200 leading-relaxed">{matchedEntry.rootCause}</p>
          </div>

          {/* Sensory & Heuristic Cues (Sight / Sound / Rookie Trap) */}
          {matchedEntry.sensoryCues && (
            <div className="bg-stone-950/90 p-3.5 rounded-xl border border-stone-800 space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Master Craftsman Field Cues
              </div>
              {matchedEntry.sensoryCues.visual && (
                <div className="text-xs text-stone-200 flex items-start gap-2">
                  <Eye className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-100">Sight check:</strong>{' '}
                    {matchedEntry.sensoryCues.visual}
                  </span>
                </div>
              )}
              {matchedEntry.sensoryCues.soundFeel && (
                <div className="text-xs text-stone-200 flex items-start gap-2">
                  <Volume2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-stone-100">Sound &amp; feel:</strong>{' '}
                    {matchedEntry.sensoryCues.soundFeel}
                  </span>
                </div>
              )}
              {matchedEntry.sensoryCues.rookieTrap && (
                <div className="text-xs text-red-200 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-red-300">Rookie mistake to avoid:</strong>{' '}
                    {matchedEntry.sensoryCues.rookieTrap}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step-by-Step Diamond Grit & Remediation Checkboxes (Start Unticked) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Remediation Steps (Tap to Check Off)
              </span>
              <span className="text-xs text-stone-400 font-semibold">
                Spec: {matchedEntry.recommendedGrit}
              </span>
            </div>

            <div className="space-y-2">
              {matchedEntry.steps.map((step, idx) => {
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
                    className={`min-h-12 w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
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
                      className={`text-sm leading-relaxed ${
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

          {/* Safety & Stone Warning */}
          <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3.5 flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-black uppercase tracking-wider text-red-300">
                Safety &amp; Stone Protection Warning
              </div>
              <p className="text-sm text-red-100 leading-relaxed mt-0.5">
                {matchedEntry.safetyWarning}
              </p>
            </div>
          </div>

          {/* Action Buttons: Log to Job Record & Escalate to PM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() =>
                dispatch({
                  type: 'LOG_DIAGNOSIS_TO_JOB',
                  entry: matchedEntry,
                  selectedTags,
                  checkedCount: Object.values(checkedSopSteps).filter(Boolean).length,
                  customNote: customSymptomText
                })
              }
              className="min-h-12 py-3 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Log to Job Record
            </button>

            <button
              type="button"
              disabled={isEscalationAlreadyPending}
              onClick={() =>
                dispatch({
                  type: 'ESCALATE_TO_PM',
                  issueTitle: matchedEntry.title,
                  impact: matchedEntry.estTimeImpact,
                  recommendedFix: matchedEntry.recommendedGrit,
                  notes: customSymptomText.trim() || undefined
                })
              }
              className={`min-h-12 py-3 px-3 rounded-xl font-black text-sm flex items-center justify-center gap-1.5 border ${
                isEscalationAlreadyPending
                  ? 'bg-stone-800 text-stone-400 border-stone-700 cursor-not-allowed'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/50 cursor-pointer'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {isEscalationAlreadyPending ? 'Escalation Pending' : 'Escalate to PM'}
            </button>
          </div>

          {/* Thumbs-Down + Crew Correction Box */}
          <div className="pt-2 border-t border-stone-800">
            {!showCorrectionBox ? (
              <button
                type="button"
                onClick={() => setShowCorrectionBox(true)}
                className="min-h-11 w-full py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-800 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ThumbsDown className="w-3.5 h-3.5 text-amber-400" />
                Wrong or incomplete SOP? Flag &amp; send correction to Owner/GM
              </button>
            ) : (
              <form onSubmit={handleSubmitCorrection} className="space-y-2.5 bg-stone-950 p-3 rounded-xl border border-amber-500/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">
                    Submit SOP Correction to Owner / GM Queue
                  </span>
                  <button
                    type="button"
                    onClick={handleVoiceDictation}
                    className={`min-h-9 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border cursor-pointer ${
                      isRecordingVoice
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : 'bg-stone-900 text-stone-200 border-stone-700'
                    }`}
                  >
                    {isRecordingVoice ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" /> Listening...
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-amber-400" /> Dictate
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={correctionText}
                  onChange={(e) => setCorrectionText(e.target.value)}
                  placeholder="Describe what should be done instead (e.g., 'Do not use oxalic compound on this stone, use neutral compound at 400 grit')..."
                  className="w-full bg-stone-900 text-stone-100 text-sm rounded-xl p-3 border border-stone-700"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="min-h-11 flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send to Owner Queue
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCorrectionBox(false)}
                    className="min-h-11 px-3 py-2 rounded-xl bg-stone-900 text-stone-400 text-xs font-semibold border border-stone-800 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* No-Match Case (Phase 2 Requirement) */
        <div className="bg-stone-900 rounded-2xl p-5 border-2 border-amber-500/40 space-y-3 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
          <div className="text-base font-bold text-stone-100">
            No Matching Knowledge Base Entry Found
          </div>
          <p className="text-sm text-stone-300 leading-relaxed">
            No SOP in the Knowledge Base matched this combination of stone type ({stoneType}),
            symptom tags, and field checks. Try selecting at least one symptom tag or escalate this
            unmatched condition directly to the Project Manager.
          </p>
          <div className="pt-1">
            <button
              type="button"
              disabled={isEscalationAlreadyPending}
              onClick={() =>
                dispatch({
                  type: 'ESCALATE_TO_PM',
                  issueTitle: issueTitleForEscalation,
                  impact: 'TBD — Unmatched Field Condition',
                  recommendedFix: 'Requires PM / Owner inspection',
                  notes: customSymptomText.trim() || undefined
                })
              }
              className={`min-h-12 w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 border ${
                isEscalationAlreadyPending
                  ? 'bg-stone-800 text-stone-400 border-stone-700 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 border-amber-400 cursor-pointer'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              {isEscalationAlreadyPending
                ? 'Escalation Already Pending'
                : 'Escalate Unmatched Condition to PM'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  ThumbsDown,
  Send,
  Lock
} from 'lucide-react';
import { answer } from '@/lib/ai';
import { useMarbleStore } from '@/lib/store';
import { DiagnosisMatch } from '@/types/marble';

const SAMPLE_QUESTIONS_TECH = [
  'Cloudy white haze ring after honing Calacatta',
  'Orange rust halo along marble grout lines',
  'Deep tile lippage and chipped edges',
  'Dark cooking oil stain on granite island'
];

const SAMPLE_QUESTIONS_OWNER = [
  'Where do estimators underbid commercial terrazzo lobbies?',
  'Zero net profit in Q2 with two trucks running P&L check'
];

export default function AskGuide() {
  const { state, dispatch } = useMarbleStore();
  const { activeRole, knowledgeEntries } = state;

  const canSeeOwnerEntries = activeRole === 'owner' || activeRole === 'pm';

  const [query, setQuery] = useState('Cloudy white haze ring after honing Calacatta');
  const [results, setResults] = useState<DiagnosisMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [correctionEntryId, setCorrectionEntryId] = useState<string | null>(null);
  const [correctionText, setCorrectionText] = useState('');

  useEffect(() => {
    let active = true;
    setIsSearching(true);
    answer(query, activeRole, knowledgeEntries).then((res) => {
      if (!active) return;
      setResults(res);
      setIsSearching(false);
    });
    return () => {
      active = false;
    };
  }, [query, activeRole, knowledgeEntries]);

  const handleSubmitCorrection = (entryId: string, entryTitle: string) => {
    if (!correctionText.trim()) return;
    dispatch({
      type: 'SUBMIT_CORRECTION',
      targetType: 'qa',
      entryId,
      entryTitle,
      text: correctionText
    });
    setCorrectionEntryId(null);
    setCorrectionText('');
  };

  const handleSendUnansweredToOwner = () => {
    if (!query.trim()) return;
    dispatch({
      type: 'SUBMIT_UNANSWERED_QUESTION',
      question: query
    });
  };

  return (
    <div className="space-y-4">
      {/* Header & Role Audience Scope Notice */}
      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h2 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4" />
            Operations &amp; Technical Q&amp;A Guide
          </h2>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-stone-950 text-stone-300 border border-stone-800 flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-400" />
            {canSeeOwnerEntries
              ? 'Scope: Tech + Owner/GM Playbooks'
              : 'Scope: Field Tech SOPs Only'}
          </span>
        </div>
        <p className="text-xs text-stone-400 leading-relaxed">
          Answers are assembled from matching Knowledge Base entries.{' '}
          {canSeeOwnerEntries
            ? 'As PM or Owner/GM, you can search both technical SOPs and confidential bidding/P&L playbooks.'
            : 'Crew and Sales roles see technical SOP entries only (Owner/GM bidding & P&L entries are hidden).'}
        </p>
      </div>

      {/* Search Box & Quick Question Chips */}
      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a stone restoration or operations question..."
            className="min-h-12 w-full bg-stone-950 text-stone-100 text-sm rounded-xl pl-10 pr-4 py-2.5 border border-stone-700 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="text-xs text-stone-400">Sample questions:</div>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_QUESTIONS_TECH.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuery(q)}
                className="min-h-9 text-left text-xs px-2.5 py-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 text-stone-300 border border-stone-800 cursor-pointer"
              >
                {q}
              </button>
            ))}
            {canSeeOwnerEntries &&
              SAMPLE_QUESTIONS_OWNER.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuery(q)}
                  className="min-h-9 text-left text-xs px-2.5 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/40 text-purple-200 border border-purple-500/30 cursor-pointer"
                >
                  [Owner] {q}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Matching Results List */}
      {isSearching ? (
        <div className="bg-stone-900 rounded-2xl p-6 border border-stone-800 text-center text-sm text-stone-400">
          Searching Knowledge Base...
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-3.5">
          {results.map(({ entry, matchedReasons }) => (
            <div
              key={entry.id}
              className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3 shadow-md"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                      entry.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    {entry.status === 'approved' ? 'Owner-approved' : 'Draft (Unverified)'}
                  </span>
                  {entry.audience === 'owner' && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Owner / PM Only
                    </span>
                  )}
                </div>
                <span className="text-xs text-stone-400">Source: {entry.shortTitle}</span>
              </div>

              <h3 className="text-base font-extrabold text-stone-100">{entry.title}</h3>

              <div className="flex flex-wrap gap-1.5">
                {matchedReasons.map((r, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded bg-stone-950 text-stone-300 border border-stone-800"
                  >
                    {r}
                  </span>
                ))}
              </div>

              <p className="text-sm text-stone-200 leading-relaxed bg-stone-950 p-3 rounded-xl border border-stone-800">
                {entry.rootCause}
              </p>

              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Key Action Steps
                </div>
                <ol className="list-decimal list-inside space-y-1 text-sm text-stone-200">
                  {entry.steps.map((s, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {s}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Thumbs-down correction on Q&A answer */}
              <div className="pt-2 border-t border-stone-800">
                {correctionEntryId !== entry.id ? (
                  <button
                    type="button"
                    onClick={() => {
                      setCorrectionEntryId(entry.id);
                      setCorrectionText('');
                    }}
                    className="min-h-10 px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs font-semibold border border-stone-800 flex items-center gap-1.5 cursor-pointer"
                  >
                    <ThumbsDown className="w-3.5 h-3.5 text-amber-400" />
                    Flag answer / suggest correction
                  </button>
                ) : (
                  <div className="space-y-2 bg-stone-950 p-3 rounded-xl border border-amber-500/40">
                    <textarea
                      rows={2}
                      value={correctionText}
                      onChange={(e) => setCorrectionText(e.target.value)}
                      placeholder="What should this answer say instead?"
                      className="w-full bg-stone-900 text-stone-100 text-sm rounded-xl p-2.5 border border-stone-700"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleSubmitCorrection(entry.id, entry.title)}
                        className="min-h-10 px-3 py-1.5 rounded-lg bg-amber-500 text-stone-950 font-bold text-xs cursor-pointer"
                      >
                        Send Correction to Owner
                      </button>
                      <button
                        type="button"
                        onClick={() => setCorrectionEntryId(null)}
                        className="min-h-10 px-3 py-1.5 rounded-lg bg-stone-900 text-stone-400 text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Unanswered Question State -> Send to Owner Queue */
        <div className="bg-stone-900 rounded-2xl p-5 border border-sky-500/40 text-center space-y-3">
          <div className="text-base font-bold text-stone-100">
            No Matching Entry Found for &ldquo;{query}&rdquo;
          </div>
          <p className="text-sm text-stone-300 leading-relaxed">
            {!canSeeOwnerEntries
              ? 'No technical SOP matched your question (or the topic is restricted to Owner/PM playbooks). You can send this question to the Owner / GM queue to be answered.'
              : 'No entry in the Knowledge Base covers this question yet. Send it to the Owner / GM queue so it can be answered and added.'}
          </p>
          <button
            type="button"
            onClick={handleSendUnansweredToOwner}
            className="min-h-12 w-full py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            Send Question to Owner / GM Queue
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import {
  Layers,
  Droplets,
  FlaskConical,
  MessageSquare,
  Send,
  Clock,
  Wrench,
  FileSpreadsheet,
  Image as ImageIcon
} from 'lucide-react';
import { useMarbleStore } from '@/lib/store';
import {
  formatRelativeTime,
  getTimelineDotClasses,
  getTimelineRoleBadgeClasses
} from '@/lib/helpers';
import { getPhotoFromIndexedDb } from '@/lib/photoStore';

export default function JobRecord() {
  const { state, currentJob, dispatch } = useMarbleStore();
  const { activeRole } = state;

  const [quickStepBadge, setQuickStepBadge] = useState('400-Grit Resin Pass');
  const [quickNoteText, setQuickNoteText] = useState('');
  const [timelineFilter, setTimelineFilter] = useState<
    'ALL' | 'Sales' | 'Craftsman' | 'PM' | 'Owner'
  >('ALL');
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});
  const [showProposalText, setShowProposalText] = useState(false);

  // Load any attached IndexedDB photos for the selected job
  useEffect(() => {
    let active = true;
    async function loadPhotos() {
      const attached = currentJob.attachedPhotos || [];
      const loaded: Record<string, string> = {};
      for (const meta of attached) {
        const dataUrl = await getPhotoFromIndexedDb(meta.id);
        if (dataUrl) loaded[meta.id] = dataUrl;
      }
      if (active) setPhotoUrls(loaded);
    }
    loadPhotos();
    return () => {
      active = false;
    };
  }, [currentJob.id, currentJob.attachedPhotos]);

  const handleAddQuickNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNoteText.trim()) return;
    dispatch({
      type: 'ADD_QUICK_TIMELINE_NOTE',
      badge: quickStepBadge,
      text: quickNoteText
    });
    setQuickNoteText('');
  };

  const filteredTimeline =
    timelineFilter === 'ALL'
      ? currentJob.timeline
      : currentJob.timeline.filter((item) => item.role === timelineFilter);

  return (
    <div className="space-y-4">
      {/* Stone Diagnostic Profile Card */}
      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 shadow-md">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            Stone Diagnostic Profile
          </span>
          <span className="text-xs bg-stone-800 text-stone-300 px-2.5 py-0.5 rounded font-semibold">
            {currentJob.stoneProfile.areaSqFt.toLocaleString()} sq ft • Age:{' '}
            {currentJob.stoneProfile.age}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm">
          <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800/80">
            <div className="text-xs text-stone-400">Stone Composition</div>
            <div className="font-bold text-stone-100 mt-0.5 leading-snug">
              {currentJob.stoneProfile.type}
            </div>
          </div>
          <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800/80">
            <div className="text-xs text-stone-400">Target Finish</div>
            <div className="font-bold text-stone-100 mt-0.5 leading-snug">
              {currentJob.stoneProfile.finish}
            </div>
          </div>
          <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800/80">
            <div className="text-xs text-stone-400 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-sky-400" /> Tramex Moisture Reading
            </div>
            <div className="font-bold text-amber-300 mt-0.5 leading-snug">
              {currentJob.stoneProfile.moistureReading}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {currentJob.stoneProfile.subfloor}
            </div>
          </div>
          <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800/80">
            <div className="text-xs text-stone-400 flex items-center gap-1">
              <FlaskConical className="w-3.5 h-3.5 text-amber-400" /> Acid Sensitivity &amp; Lippage
            </div>
            <div className="font-bold text-stone-100 mt-0.5 leading-snug">
              {currentJob.stoneProfile.acidSensitivity}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              Lippage: {currentJob.stoneProfile.lippage}
            </div>
          </div>
        </div>

        {/* Customer Notes & Site Constraints */}
        <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-1">
            Customer Notes &amp; Site Constraints
          </div>
          <p className="text-sm text-stone-200 leading-relaxed">{currentJob.customerNotes}</p>
        </div>

        {/* Assigned Team Strip */}
        <div className="mt-3 pt-2.5 border-t border-stone-800 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400">
          <span>
            Sales: <strong className="text-stone-200">{currentJob.salesRep}</strong>
          </span>
          <span>
            PM: <strong className="text-stone-200">{currentJob.pm}</strong>
          </span>
          <span>
            Crew:{' '}
            <strong className="text-amber-300">
              {currentJob.leadCraftsman.split(' (')[0]}
            </strong>
          </span>
        </div>
      </div>

      {/* Saved Estimate Summary Card (if estimate exists on job) */}
      {currentJob.estimate && (
        <div className="bg-stone-900 rounded-2xl p-4 border border-sky-500/40 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4" />
              Saved Job Estimate (Placeholder Rates)
            </span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              ${currentJob.estimate.priceLow.toLocaleString()} – $
              {currentJob.estimate.priceHigh.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs bg-stone-950 p-2.5 rounded-xl border border-stone-800">
            <div>
              <div className="text-stone-400">Est. Hours</div>
              <div className="text-sm font-bold text-stone-100">
                {currentJob.estimate.hours} hrs ({currentJob.estimate.crewDays}d)
              </div>
            </div>
            <div>
              <div className="text-stone-400">Risk Buffer</div>
              <div className="text-sm font-bold text-amber-300">
                +{currentJob.estimate.riskBufferPct}%
              </div>
            </div>
            <div>
              <div className="text-stone-400">Chemicals</div>
              <div className="text-xs font-semibold text-stone-200">
                {currentJob.estimate.chemicalSummary}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowProposalText((prev) => !prev)}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 underline cursor-pointer"
          >
            {showProposalText ? 'Hide Proposal Draft' : 'View Proposal Draft Text'}
          </button>

          {showProposalText && (
            <pre className="text-xs text-stone-200 bg-stone-950 p-3 rounded-xl border border-stone-800 whitespace-pre-wrap font-mono">
              {currentJob.estimate.proposalDraft}
            </pre>
          )}
        </div>
      )}

      {/* Attached Site Photos (if any saved in IndexedDB) */}
      {currentJob.attachedPhotos && currentJob.attachedPhotos.length > 0 && (
        <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-amber-400" />
            Attached Site Photos ({currentJob.attachedPhotos.length})
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {currentJob.attachedPhotos.map((photo) => (
              <div
                key={photo.id}
                className="bg-stone-950 rounded-xl p-2 border border-stone-800 space-y-1.5"
              >
                {photoUrls[photo.id] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrls[photo.id]}
                    alt={photo.caption}
                    className="w-full h-24 object-cover rounded-lg border border-stone-800"
                  />
                ) : (
                  <div className="w-full h-24 rounded-lg bg-stone-900 flex items-center justify-center text-xs text-stone-500">
                    Photo stored locally
                  </div>
                )}
                <div className="text-xs font-semibold text-stone-200 truncate">
                  {photo.caption}
                </div>
                <div className="text-[11px] text-stone-400">
                  {formatRelativeTime(photo.createdAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Handoff / Chemical-Grit Logger Form */}
      <form
        onSubmit={handleAddQuickNote}
        className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-stone-200 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            Log Handoff Note or Grit/Chemical Step
          </span>
          <span className="text-xs text-stone-400">Posting as {activeRole.toUpperCase()}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <select
            aria-label="Step or Grit Badge"
            value={quickStepBadge}
            onChange={(e) => setQuickStepBadge(e.target.value)}
            className="min-h-11 bg-stone-950 text-stone-200 text-sm font-semibold rounded-xl px-3 py-2 border border-stone-700 focus:outline-none focus:border-amber-500"
          >
            <option value="100-Grit Metal Lippage Cut">100-Grit Metal Cut</option>
            <option value="200-Grit Resin Cut">200-Grit Resin Cut</option>
            <option value="400-Grit Resin Pass">400-Grit Resin Pass</option>
            <option value="800-Grit Polish Prep">800-Grit Polish Prep</option>
            <option value="Polish Compound Pass">Polish Compound Pass</option>
            <option value="Poultice Applied">Poultice Applied</option>
            <option value="Sealer Coat #1">Sealer Coat #1</option>
            <option value="Client Expectation Note">Client Expectation Note</option>
          </select>
          <input
            type="text"
            value={quickNoteText}
            onChange={(e) => setQuickNoteText(e.target.value)}
            placeholder="Add field note or handoff instruction..."
            className="min-h-11 flex-1 bg-stone-950 text-stone-100 text-sm rounded-xl px-3.5 py-2 border border-stone-700 focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          type="submit"
          className="min-h-11 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Append to Shared Job Timeline
        </button>
      </form>

      {/* Chronological Activity & Handoff Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2 px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-400" />
            Activity &amp; Handoff Timeline ({filteredTimeline.length})
          </h3>
          <div className="flex items-center gap-1 flex-wrap">
            {(['ALL', 'Sales', 'Craftsman', 'PM', 'Owner'] as const).map((roleFilter) => (
              <button
                key={roleFilter}
                type="button"
                onClick={() => setTimelineFilter(roleFilter)}
                className={`min-h-8 text-xs px-2.5 py-1 rounded-lg font-semibold cursor-pointer transition-colors ${
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
          {filteredTimeline.map((item) => (
            <div key={item.id} className="relative pl-9">
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 border-stone-950 absolute left-[9px] top-3.5 ${getTimelineDotClasses(
                  item.role,
                  item.type
                )}`}
              />

              <div className="bg-stone-900/95 border border-stone-800 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded border ${getTimelineRoleBadgeClasses(
                        item.role
                      )}`}
                    >
                      {item.role}
                    </span>
                    <span className="text-sm font-bold text-stone-200">{item.author}</span>
                  </div>
                  <span className="text-xs text-stone-400">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </div>

                <div className="text-sm font-bold text-stone-100">{item.title}</div>
                <p className="text-sm text-stone-300 leading-relaxed">{item.text}</p>

                {item.badge && (
                  <div className="pt-1 flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-950 text-amber-300 border border-stone-700">
                      <Wrench className="w-3.5 h-3.5 text-amber-400" />
                      {item.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

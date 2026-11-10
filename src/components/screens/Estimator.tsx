'use client';

import React, { useEffect, useState } from 'react';
import {
  Calculator,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy
} from 'lucide-react';
import { estimate } from '@/lib/ai';
import { useMarbleStore } from '@/lib/store';
import { Estimate, StoneCategory } from '@/types/marble';

interface EstimatorProps {
  initialAreaSqFt: number;
  initialStoneType: StoneCategory;
  initialLippageLevel: string;
  initialSetting: 'residential' | 'commercial';
  initialMoisturePct: string;
  initialAccessNotes: string;
  onBackToIntake: () => void;
}

function mapLippageStringToTier(lippageStr: string): 'low' | 'moderate' | 'severe' {
  const lower = lippageStr.toLowerCase();
  if (lower.includes('severe') || lower.includes('> 2.0')) return 'severe';
  if (lower.includes('low') || lower.includes('< 0.5')) return 'low';
  return 'moderate';
}

export default function Estimator({
  initialAreaSqFt,
  initialStoneType,
  initialLippageLevel,
  initialSetting,
  initialMoisturePct,
  initialAccessNotes,
  onBackToIntake
}: EstimatorProps) {
  const { state, currentJob, dispatch, triggerToast } = useMarbleStore();
  const { estimatorRates } = state;

  const [areaSqFt, setAreaSqFt] = useState<number>(initialAreaSqFt || 500);
  const [stoneType, setStoneType] = useState<StoneCategory>(initialStoneType || 'marble');
  const [condition, setCondition] = useState<
    'light-wear' | 'moderate-etch' | 'heavy-restoration'
  >('moderate-etch');
  const [lippage, setLippage] = useState<'low' | 'moderate' | 'severe'>(
    mapLippageStringToTier(initialLippageLevel)
  );
  const [setting, setSetting] = useState<'residential' | 'commercial'>(initialSetting);
  const [accessLimits, setAccessLimits] = useState<string>(initialAccessNotes);
  const [calculatedEstimate, setCalculatedEstimate] = useState<Estimate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Sync if active job changes while Estimator is open
  useEffect(() => {
    setAreaSqFt(initialAreaSqFt || 500);
    setStoneType(initialStoneType || 'marble');
    setLippage(mapLippageStringToTier(initialLippageLevel));
    setSetting(initialSetting);
    setAccessLimits(initialAccessNotes);
  }, [
    currentJob.id,
    initialAreaSqFt,
    initialStoneType,
    initialLippageLevel,
    initialSetting,
    initialAccessNotes
  ]);

  // Recalculate whenever inputs or Owner estimatorRates change
  useEffect(() => {
    let active = true;
    setIsCalculating(true);
    estimate(
      {
        jobId: currentJob.id,
        clientName: currentJob.client,
        areaSqFt,
        stoneType,
        condition,
        lippage,
        setting,
        accessLimits,
        moisturePct: initialMoisturePct
      },
      estimatorRates
    ).then((res) => {
      if (!active) return;
      setCalculatedEstimate(res);
      setIsCalculating(false);
    });
    return () => {
      active = false;
    };
  }, [
    currentJob.id,
    currentJob.client,
    areaSqFt,
    stoneType,
    condition,
    lippage,
    setting,
    accessLimits,
    initialMoisturePct,
    estimatorRates
  ]);

  const handleSaveEstimate = () => {
    if (!calculatedEstimate) return;
    dispatch({ type: 'SAVE_ESTIMATE', estimate: calculatedEstimate });
  };

  const handleCopyProposal = async () => {
    if (!calculatedEstimate) return;
    try {
      await navigator.clipboard.writeText(calculatedEstimate.proposalDraft);
      triggerToast('Proposal draft copied to clipboard');
    } catch {
      triggerToast('Could not copy to clipboard');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Back Button */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBackToIntake}
          className="min-h-11 px-3 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 text-xs font-bold flex items-center gap-1.5 border border-stone-800 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Intake
        </button>
        <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
          <Calculator className="w-4 h-4" />
          Estimator &amp; Bid Co-Pilot
        </span>
      </div>

      {/* Placeholder Rates Notice */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3.5 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-200 leading-relaxed">
          <strong>Placeholder Rates Active:</strong> Production speeds ({estimatorRates.sqFtPerHour[stoneType]} sq ft/hr for {stoneType}) and hourly labor (${estimatorRates.hourlyRate}/hr) are placeholder figures awaiting the Owner/GM’s real historical numbers. You can edit them in <strong>Owner / GM</strong> mode.
        </p>
      </div>

      {/* Estimator Inputs */}
      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="est-area-input"
              className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
            >
              Surface Area (sq ft)
            </label>
            <input
              id="est-area-input"
              type="number"
              min={20}
              max={50000}
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Number(e.target.value) || 0)}
              className="min-h-11 w-full bg-stone-950 text-amber-300 font-bold text-sm rounded-xl px-3.5 py-2.5 border border-stone-700"
            />
          </div>

          <div>
            <label
              htmlFor="est-stone-select"
              className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
            >
              Stone Type
            </label>
            <select
              id="est-stone-select"
              value={stoneType}
              onChange={(e) => setStoneType(e.target.value as StoneCategory)}
              className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm font-semibold rounded-xl px-3 py-2.5 border border-stone-700"
            >
              <option value="marble">Marble (Calcite)</option>
              <option value="travertine">Travertine (Voids/Hone)</option>
              <option value="terrazzo">Terrazzo</option>
              <option value="granite">Granite / Dense Igneous</option>
              <option value="limestone">Limestone</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label
              htmlFor="est-condition-select"
              className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
            >
              Surface Condition
            </label>
            <select
              id="est-condition-select"
              value={condition}
              onChange={(e) =>
                setCondition(
                  e.target.value as 'light-wear' | 'moderate-etch' | 'heavy-restoration'
                )
              }
              className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm font-semibold rounded-xl px-3 py-2.5 border border-stone-700"
            >
              <option value="light-wear">Light Traffic Wear</option>
              <option value="moderate-etch">Moderate Etch &amp; Dulling</option>
              <option value="heavy-restoration">Heavy Scratch / Deep Voids</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="est-lippage-select"
              className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
            >
              Lippage Level
            </label>
            <select
              id="est-lippage-select"
              value={lippage}
              onChange={(e) =>
                setLippage(e.target.value as 'low' | 'moderate' | 'severe')
              }
              className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm font-semibold rounded-xl px-3 py-2.5 border border-stone-700"
            >
              <option value="low">Low (&lt; 0.5mm)</option>
              <option value="moderate">Moderate (1–2mm)</option>
              <option value="severe">Severe (&gt; 2mm Full Cut)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="est-setting-select"
              className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
            >
              Job Setting
            </label>
            <select
              id="est-setting-select"
              value={setting}
              onChange={(e) =>
                setSetting(e.target.value as 'residential' | 'commercial')
              }
              className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm font-semibold rounded-xl px-3 py-2.5 border border-stone-700"
            >
              <option value="residential">Residential Day Shift</option>
              <option value="commercial">Commercial / Night Shift</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="est-access-input"
            className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
          >
            Access Limits &amp; Containment Notes
          </label>
          <input
            id="est-access-input"
            type="text"
            value={accessLimits}
            onChange={(e) => setAccessLimits(e.target.value)}
            placeholder="e.g., Full ZipWall around staircase, elevator load-in..."
            className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm rounded-xl px-3.5 py-2.5 border border-stone-700"
          />
        </div>
      </div>

      {/* Calculated Estimate Output Card */}
      {calculatedEstimate && (
        <div className="bg-stone-900 rounded-2xl p-4 border-2 border-sky-500/50 space-y-3.5 shadow-xl">
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-sky-400">
                Estimated Price Range (Placeholder Figures)
              </div>
              <div className="text-xl font-black text-stone-100 mt-0.5">
                ${calculatedEstimate.priceLow.toLocaleString()} – $
                {calculatedEstimate.priceHigh.toLocaleString()}
              </div>
            </div>
            <span className="text-xs font-bold bg-stone-950 text-amber-300 px-3 py-1.5 rounded-xl border border-stone-700">
              {isCalculating ? 'Updating...' : `${calculatedEstimate.hours} Crew Hrs`}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
              <div className="text-stone-400">Crew-Days</div>
              <div className="text-sm font-bold text-stone-100 mt-0.5">
                ~{calculatedEstimate.crewDays} days
              </div>
            </div>
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
              <div className="text-stone-400">Risk Buffer</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">
                +{calculatedEstimate.riskBufferPct}%
              </div>
            </div>
            <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
              <div className="text-stone-400">Chemicals</div>
              <div className="text-xs font-semibold text-stone-200 mt-0.5">
                {calculatedEstimate.chemicalSummary}
              </div>
            </div>
          </div>

          <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 space-y-1.5">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
              Planned Grit &amp; Chemical Sequence
            </div>
            <div className="flex flex-wrap gap-1.5">
              {calculatedEstimate.gritStages.map((stage, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-900 text-amber-300 border border-stone-800"
                >
                  {i + 1}. {stage}
                </span>
              ))}
            </div>
          </div>

          {/* Plain-Text Proposal Draft */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Plain-Text Proposal Draft
              </span>
              <button
                type="button"
                onClick={handleCopyProposal}
                className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Text
              </button>
            </div>
            <pre className="text-xs text-stone-200 bg-stone-950 p-3 rounded-xl border border-stone-800 whitespace-pre-wrap font-mono leading-relaxed">
              {calculatedEstimate.proposalDraft}
            </pre>
          </div>

          <button
            type="button"
            onClick={handleSaveEstimate}
            className="min-h-12 w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            Save Estimate to Job &amp; Timeline
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Send,
  Calculator,
  CheckSquare,
  Square
} from 'lucide-react';
import { useMarbleStore } from '@/lib/store';
import Estimator from '@/components/screens/Estimator';
import { StoneCategory } from '@/types/marble';

export default function SalesIntake() {
  const { currentJob, dispatch } = useMarbleStore();

  const [showEstimator, setShowEstimator] = useState(false);

  // Initialize form from the currently selected job's stoneProfile and reset when job changes
  const [stoneCategory, setStoneCategory] = useState<StoneCategory>(
    currentJob.stoneProfile.stoneCategory
  );
  const [acidTest, setAcidTest] = useState(currentJob.stoneProfile.acidSensitivity);
  const [moisturePct, setMoisturePct] = useState(currentJob.stoneProfile.moisturePctNumeric);
  const [lippageLevel, setLippageLevel] = useState(currentJob.stoneProfile.lippage);
  const [expectationNote, setExpectationNote] = useState(currentJob.customerNotes);
  const [containmentRequired, setContainmentRequired] = useState(
    currentJob.stoneProfile.containmentRequired
  );
  const [areaSqFt, setAreaSqFt] = useState<number>(currentJob.stoneProfile.areaSqFt);
  const [setting, setSetting] = useState<'residential' | 'commercial'>(
    currentJob.stoneProfile.setting
  );

  // Phase 0 Bug Fix: Sync form state whenever selectedJobId changes
  useEffect(() => {
    setStoneCategory(currentJob.stoneProfile.stoneCategory);
    setAcidTest(currentJob.stoneProfile.acidSensitivity);
    setMoisturePct(currentJob.stoneProfile.moisturePctNumeric);
    setLippageLevel(currentJob.stoneProfile.lippage);
    setExpectationNote(currentJob.customerNotes);
    setContainmentRequired(currentJob.stoneProfile.containmentRequired);
    setAreaSqFt(currentJob.stoneProfile.areaSqFt);
    setSetting(currentJob.stoneProfile.setting);
    setShowEstimator(false);
  }, [currentJob.id, currentJob.stoneProfile, currentJob.customerNotes]);

  const handleSaveIntake = (openEstAfter = false) => {
    dispatch({
      type: 'COMPLETE_SALES_INTAKE',
      payload: {
        stoneCategory,
        acidTest,
        moisturePct,
        lippageLevel,
        expectationNote,
        containmentRequired,
        areaSqFt,
        setting
      }
    });
    if (openEstAfter) {
      setShowEstimator(true);
    } else {
      dispatch({ type: 'SET_TAB', tab: 'record' });
    }
  };

  if (showEstimator) {
    return (
      <Estimator
        initialAreaSqFt={areaSqFt}
        initialStoneType={stoneCategory}
        initialLippageLevel={lippageLevel}
        initialSetting={setting}
        initialMoisturePct={moisturePct}
        initialAccessNotes={
          containmentRequired ? `Full ZipWall containment. ${expectationNote}` : expectationNote
        }
        onBackToIntake={() => setShowEstimator(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-sky-500/15 border border-sky-500/40 rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <div className="text-xs font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            Sales / Estimator Site Intake &amp; Handoff
          </div>
          <p className="text-sm text-stone-300 mt-1">
            Record diagnostic drop tests and slab readings for{' '}
            <strong className="text-stone-100">{currentJob.client}</strong>, then build the
            estimate.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowEstimator(true)}
          className="min-h-11 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-sky-300 font-bold text-xs border border-sky-500/40 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Calculator className="w-4 h-4" />
          Open Estimator &amp; Bid Co-Pilot
        </button>
      </div>

      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="intake-stone-category"
              className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
            >
              Primary Stone Category
            </label>
            <select
              id="intake-stone-category"
              value={stoneCategory}
              onChange={(e) => setStoneCategory(e.target.value as StoneCategory)}
              className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm font-semibold rounded-xl px-3 py-2.5 border border-stone-700"
            >
              <option value="marble">Marble (Calcite)</option>
              <option value="travertine">Travertine</option>
              <option value="terrazzo">Terrazzo</option>
              <option value="granite">Granite / Quartzite</option>
              <option value="limestone">Limestone</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="intake-area-sqft"
              className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
            >
              Measured Area (sq ft)
            </label>
            <input
              id="intake-area-sqft"
              type="number"
              min={10}
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Number(e.target.value) || 0)}
              className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm font-bold rounded-xl px-3 py-2.5 border border-stone-700"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="intake-acid-test"
            className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
          >
            Acid Sensitivity Drop Test (10% HCl)
          </label>
          <select
            id="intake-acid-test"
            value={acidTest}
            onChange={(e) => setAcidTest(e.target.value)}
            className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm font-semibold rounded-xl px-3 py-2.5 border border-stone-700"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="intake-moisture-pct"
              className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
            >
              Tramex Moisture %
            </label>
            <input
              id="intake-moisture-pct"
              type="text"
              value={moisturePct}
              onChange={(e) => setMoisturePct(e.target.value)}
              className="min-h-11 w-full bg-stone-950 text-amber-300 font-bold text-sm rounded-xl px-3 py-2.5 border border-stone-700"
            />
          </div>
          <div>
            <label
              htmlFor="intake-lippage-check"
              className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
            >
              Tile Lippage Check
            </label>
            <select
              id="intake-lippage-check"
              value={lippageLevel}
              onChange={(e) => setLippageLevel(e.target.value)}
              className="min-h-11 w-full bg-stone-950 text-stone-100 text-sm font-semibold rounded-xl px-3 py-2.5 border border-stone-700"
            >
              <option value="Low (< 0.5mm - Hone & Polish Only)">
                Low (&lt; 0.5mm - Hone &amp; Polish Only)
              </option>
              <option value="Moderate (1.0 - 2.0mm - Needs Metal Cut)">
                Moderate (1.0 - 2.0mm - Needs Metal Cut)
              </option>
              <option value="Severe (> 2.0mm - Full Flatten Required)">
                Severe (&gt; 2.0mm - Full Flatten Required)
              </option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setContainmentRequired((prev) => !prev)}
          className="min-h-12 w-full flex items-center justify-between p-3.5 rounded-xl bg-stone-950 border border-stone-800 text-sm cursor-pointer"
        >
          <span className="font-semibold text-stone-200">
            Full ZipWall Dust Containment Required
          </span>
          {containmentRequired ? (
            <CheckSquare className="w-5 h-5 text-sky-400 shrink-0" />
          ) : (
            <Square className="w-5 h-5 text-stone-500 shrink-0" />
          )}
        </button>

        <div>
          <label
            htmlFor="intake-expectation-note"
            className="block text-xs font-bold uppercase tracking-wider text-stone-300 mb-1"
          >
            Customer Expectations &amp; Site Notes
          </label>
          <textarea
            id="intake-expectation-note"
            rows={3}
            value={expectationNote}
            onChange={(e) => setExpectationNote(e.target.value)}
            className="w-full bg-stone-950 text-stone-100 text-sm rounded-xl p-3 border border-stone-700"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => handleSaveIntake(false)}
            className="min-h-12 py-3 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-sm flex items-center justify-center gap-2 border border-stone-700 cursor-pointer"
          >
            <Send className="w-4 h-4 text-sky-400" />
            Save Intake to Job Record
          </button>

          <button
            type="button"
            onClick={() => handleSaveIntake(true)}
            className="min-h-12 py-3 px-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            Save &amp; Calculate Estimate
          </button>
        </div>
      </div>
    </div>
  );
}

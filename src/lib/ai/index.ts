import { DECISION_QUESTIONS } from '@/data/knowledgeBase';
import { generateId } from '@/lib/helpers';
import {
  DiagnosisMatch,
  Estimate,
  EstimatorRates,
  KnowledgeEntry,
  RoleType,
  StoneCategory
} from '@/types/marble';

export interface DiagnoseInput {
  stoneType: StoneCategory;
  selectedTags: string[];
  clarifyingAnswers: Record<string, string>;
  customText: string;
}

/**
 * Simulated diagnostic matcher. Scores Knowledge Base entries by stone type,
 * selected symptom tags, clarifying decision-tree answers, and custom text keywords.
 * Returns null when no entry has meaningful symptom/answer/keyword evidence.
 */
export async function diagnose(
  input: DiagnoseInput,
  entries: KnowledgeEntry[]
): Promise<DiagnosisMatch | null> {
  await new Promise((resolve) => setTimeout(resolve, 220));

  const { stoneType, selectedTags, clarifyingAnswers, customText } = input;
  const normalizedText = customText.trim().toLowerCase();

  // Only consider diagnostic / technical restoration entries
  const candidates = entries.filter((e) => e.audience === 'tech');

  const scored: DiagnosisMatch[] = [];

  for (const entry of candidates) {
    let score = 0;
    let evidenceMatches = 0;
    const reasons: string[] = [];

    // 1. Stone surface compatibility
    if (entry.surfaceTypes.includes(stoneType)) {
      score += 2;
      reasons.push(`Stone: ${stoneType}`);
    } else {
      // Penalize incompatible stone types heavily if user didn't explicitly match multiple tags
      score -= 3;
    }

    // 2. Symptom tag overlap
    for (const tag of selectedTags) {
      if (entry.symptomTags.includes(tag)) {
        score += 4;
        evidenceMatches += 1;
        reasons.push(`Symptom: ${tag}`);
      }
    }

    // 3. Decision-tree clarifying question signals
    if (entry.clarifyingSignals) {
      for (const [qId, answerVal] of Object.entries(clarifyingAnswers)) {
        if (!answerVal) continue;
        const expectedList = entry.clarifyingSignals[qId];
        if (expectedList && expectedList.includes(answerVal)) {
          score += 4;
          evidenceMatches += 1;
          const qNode = DECISION_QUESTIONS.find((q) => q.id === qId);
          const optLabel =
            qNode?.options.find((o) => o.value === answerVal)?.label.split(' (')[0] || answerVal;
          reasons.push(`Check: ${optLabel}`);
        } else if (expectedList && !expectedList.includes(answerVal)) {
          score -= 2;
        }
      }
    }

    // 4. Keyword match in free-text field note
    if (normalizedText.length >= 3) {
      const kwList = entry.keywords || [];
      for (const kw of kwList) {
        if (normalizedText.includes(kw.toLowerCase())) {
          score += 3;
          evidenceMatches += 1;
          reasons.push(`Note keyword: "${kw}"`);
        }
      }
      if (entry.title.toLowerCase().includes(normalizedText)) {
        score += 3;
        evidenceMatches += 1;
        reasons.push(`Title match: "${customText.trim()}"`);
      }
    }

    // Require at least 1 positive symptom, clarifying check, or keyword match and score >= 4
    if (evidenceMatches >= 1 && score >= 4) {
      scored.push({
        entry,
        matchedReasons: reasons,
        score
      });
    }
  }

  scored.sort((a, b) => {
    // Prefer Owner-approved entries when scores are tied
    if (b.score === a.score) {
      if (a.entry.status === 'approved' && b.entry.status !== 'approved') return -1;
      if (b.entry.status === 'approved' && a.entry.status !== 'approved') return 1;
    }
    return b.score - a.score;
  });

  return scored[0] || null;
}

export interface EstimateInput {
  jobId: string;
  clientName: string;
  areaSqFt: number;
  stoneType: StoneCategory;
  condition: 'light-wear' | 'moderate-etch' | 'heavy-restoration';
  lippage: 'low' | 'moderate' | 'severe';
  setting: 'residential' | 'commercial';
  accessLimits: string;
  moisturePct: string;
}

/**
 * Simulated Estimator & Bid Co-Pilot calculation engine using Owner-configurable rates.
 */
export async function estimate(
  input: EstimateInput,
  rates: EstimatorRates
): Promise<Estimate> {
  await new Promise((resolve) => setTimeout(resolve, 180));

  const area = Math.max(20, Number(input.areaSqFt) || 100);
  const baseRate = rates.sqFtPerHour[input.stoneType] || 55;
  const conditionMult =
    input.condition === 'light-wear'
      ? 0.85
      : input.condition === 'heavy-restoration'
      ? 1.35
      : 1.0;

  let baseHours = (area / baseRate) * conditionMult;

  // Add metal-bond lippage grinding hours
  if (input.lippage === 'moderate') {
    baseHours += (area * 0.35) / rates.lippageCutSqFtPerHour;
  } else if (input.lippage === 'severe') {
    baseHours += area / rates.lippageCutSqFtPerHour;
  }

  // Commercial night-shift setup/teardown multiplier
  if (input.setting === 'commercial') {
    baseHours *= rates.commercialNightMultiplier;
  }

  // Risk buffer calculation
  let riskBufferPct = 0;
  if (
    input.stoneType === 'marble' ||
    input.stoneType === 'travertine' ||
    input.stoneType === 'limestone'
  ) {
    riskBufferPct += rates.fragileStoneRiskPct;
  }
  if (input.lippage === 'severe') {
    riskBufferPct += 10;
  }
  const numericMoisture = parseFloat(input.moisturePct);
  if (!Number.isNaN(numericMoisture) && numericMoisture > 3.5) {
    riskBufferPct += 8;
  }

  const totalHours = Math.max(3, Math.round(baseHours * 10) / 10);
  const crewDays = Math.max(0.5, Math.round((totalHours / 6.5) * 2) / 2);

  // Grit progression stages
  const gritStages: string[] = [];
  if (input.lippage === 'severe') {
    gritStages.push('50-Grit & 100-Grit Metal Bond Lippage Flatten');
  } else if (input.lippage === 'moderate') {
    gritStages.push('100-Grit Metal Bond Threshold/Joint Cut');
  }
  if (input.condition !== 'light-wear') {
    gritStages.push('200-Grit Resin Diamond Cut');
  }
  gritStages.push('400-Grit Uniform Resin Hone');
  if (input.stoneType === 'marble' || input.stoneType === 'terrazzo' || input.stoneType === 'granite') {
    gritStages.push('800-Grit Pre-Polish Resin Pass');
    gritStages.push('Final Polishing Compound & Buff');
  }
  gritStages.push('Penetrating Fluorochemical Sealer (2 Coats)');

  // Chemical quantities
  const sealerGallons = Math.max(0.5, Math.ceil(((area * 2) / rates.sealerSqFtPerGallon) * 10) / 10);
  const polishLbs = Math.max(1, Math.ceil((area / 100) * rates.polishLbPer100SqFt * 10) / 10);
  const chemicalSummary = `${polishLbs} lbs compound • ${sealerGallons} gal penetrating sealer`;

  const baseLaborCost = totalHours * rates.hourlyRate;
  const bufferedCost = baseLaborCost * (1 + riskBufferPct / 100);
  const materialCost = area * 0.65;
  const rawTotal = bufferedCost + materialCost;

  const priceLow = Math.round(rawTotal / 25) * 25;
  const priceHigh = Math.round((rawTotal * 1.15) / 25) * 25;

  const proposalDraft = [
    `PROPOSAL DRAFT — ${input.clientName.toUpperCase()}`,
    `Scope: ${area.toLocaleString()} sq ft ${input.stoneType.toUpperCase()} (${input.setting})`,
    `Condition: ${input.condition.replace('-', ' ')} | Lippage: ${input.lippage}`,
    input.accessLimits ? `Site Constraints: ${input.accessLimits}` : null,
    `Process: ${gritStages.join(' -> ')}`,
    `Estimated Crew Time: ${totalHours} hrs (~${crewDays} crew-days) | Risk Buffer: ${riskBufferPct}%`,
    `Estimated Investment Range: $${priceLow.toLocaleString()} – $${priceHigh.toLocaleString()} (Placeholder rates)`
  ]
    .filter(Boolean)
    .join('\n');

  return {
    id: generateId('est'),
    jobId: input.jobId,
    areaSqFt: area,
    stoneType: input.stoneType,
    condition: input.condition,
    lippage: input.lippage,
    setting: input.setting,
    accessLimits: input.accessLimits,
    hours: totalHours,
    crewDays,
    gritStages,
    chemicalSummary,
    riskBufferPct,
    priceLow,
    priceHigh,
    proposalDraft,
    createdAt: new Date().toISOString()
  };
}

/**
 * Simulated Operations & Technical Q&A search across the Knowledge Base.
 * Enforces role audience permissions: Crew/Sales see 'tech' entries; PM/Owner also see 'owner' entries.
 */
export async function answer(
  query: string,
  activeRole: RoleType,
  entries: KnowledgeEntry[]
): Promise<DiagnosisMatch[]> {
  await new Promise((resolve) => setTimeout(resolve, 180));

  const canSeeOwnerEntries = activeRole === 'owner' || activeRole === 'pm';
  const visibleEntries = entries.filter((e) =>
    canSeeOwnerEntries ? true : e.audience === 'tech'
  );

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return [];
  }

  const tokens = trimmed
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  const results: DiagnosisMatch[] = [];

  for (const entry of visibleEntries) {
    let score = 0;
    const reasons: string[] = [];

    const haystackTitle = `${entry.title} ${entry.shortTitle} ${entry.stoneTag}`.toLowerCase();
    const haystackBody = `${entry.rootCause} ${entry.steps.join(' ')} ${entry.safetyWarning}`.toLowerCase();
    const kwList = (entry.keywords || []).map((k) => k.toLowerCase());

    if (haystackTitle.includes(trimmed)) {
      score += 8;
      reasons.push(`Title match`);
    }

    for (const token of tokens) {
      if (kwList.some((k) => k.includes(token))) {
        score += 4;
        reasons.push(`Keyword: "${token}"`);
      } else if (haystackTitle.includes(token)) {
        score += 3;
        reasons.push(`Topic: "${token}"`);
      } else if (haystackBody.includes(token)) {
        score += 2;
        reasons.push(`SOP text: "${token}"`);
      }
    }

    if (score >= 3) {
      // Deduplicate reasons
      const uniqueReasons = Array.from(new Set(reasons)).slice(0, 4);
      results.push({
        entry,
        matchedReasons: uniqueReasons,
        score
      });
    }
  }

  results.sort((a, b) => {
    if (a.entry.status !== b.entry.status) {
      return a.entry.status === 'approved' ? -1 : 1;
    }
    return b.score - a.score;
  });

  return results;
}

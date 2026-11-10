export type RoleType = 'sales' | 'craftsman' | 'pm' | 'owner';

export type MobileTabType = 'record' | 'troubleshoot' | 'role-action' | 'ask';

export type StatusColor = 'emerald' | 'amber' | 'sky' | 'red';

export type StoneCategory = 'marble' | 'travertine' | 'terrazzo' | 'granite' | 'limestone';

export type SubDomainId =
  | 'surface-diagnostics'
  | 'stain-taxonomy'
  | 'tooling-grit'
  | 'edge-cases'
  | 'estimation-bidding'
  | 'tech-training-qa'
  | 'fleet-inventory'
  | 'sales-client';

export interface SubDomainMeta {
  id: SubDomainId;
  pillar: 'A. Master Craftsmanship' | 'B. Franchise Operations';
  label: string;
  description: string;
}

export interface StoneProfile {
  stoneCategory: StoneCategory;
  type: string;
  finish: string;
  subfloor: string;
  age: string;
  moistureReading: string;
  moisturePctNumeric: string;
  acidSensitivity: string;
  lippage: string;
  areaSqFt: number;
  setting: 'residential' | 'commercial';
  containmentRequired: boolean;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  role: string;
  loggedOnce?: boolean;
}

export interface BeforeAfterPhoto {
  id: string;
  area: string;
  beforeLogged: boolean;
  afterLogged: boolean;
  notes: string;
}

export interface AttachedPhotoMeta {
  id: string;
  jobId: string;
  caption: string;
  createdAt: string;
}

export type TimelineEventType =
  | 'intake'
  | 'dispatch'
  | 'field-log'
  | 'escalation'
  | 'ai-diag'
  | 'estimate'
  | 'owner-kb';

export interface TimelineEntry {
  id: string;
  createdAt: string;
  role: 'Sales' | 'PM' | 'Craftsman' | 'Owner';
  author: string;
  type: TimelineEventType;
  title: string;
  text: string;
  badge?: string;
}

export interface Estimate {
  id: string;
  jobId: string;
  areaSqFt: number;
  stoneType: StoneCategory;
  condition: 'light-wear' | 'moderate-etch' | 'heavy-restoration';
  lippage: 'low' | 'moderate' | 'severe';
  setting: 'residential' | 'commercial';
  accessLimits: string;
  hours: number;
  crewDays: number;
  gritStages: string[];
  chemicalSummary: string;
  riskBufferPct: number;
  priceLow: number;
  priceHigh: number;
  proposalDraft: string;
  createdAt: string;
}

export interface JobRecord {
  id: string;
  client: string;
  title: string;
  address: string;
  status: string;
  statusColor: StatusColor;
  salesRep: string;
  pm: string;
  leadCraftsman: string;
  stoneProfile: StoneProfile;
  customerNotes: string;
  checklist: ChecklistItem[];
  beforeAfterPhotos: BeforeAfterPhoto[];
  attachedPhotos: AttachedPhotoMeta[];
  estimate?: Estimate;
  timeline: TimelineEntry[];
}

export type RingGraphicType = 'cloudy-ring' | 'orange-frame' | 'lippage-chip' | 'oil-stain';

export interface KnowledgeEntry {
  id: string;
  shortTitle: string;
  title: string;
  stoneTag: string;
  ringType?: RingGraphicType;
  surfaceTypes: StoneCategory[];
  symptomTags: string[];
  subDomain: SubDomainId;
  serviceCategory:
    | 'restoration'
    | 'stain-removal'
    | 'lippage-repair'
    | 'sealing'
    | 'operations'
    | 'bidding';
  audience: 'tech' | 'owner';
  difficulty: 'standard' | 'advanced' | 'master-only';
  status: 'draft' | 'approved';
  reviewNote?: string;
  rootCause: string;
  steps: string[];
  safetyWarning: string;
  recommendedGrit: string;
  estTimeImpact: string;
  sensoryCues?: {
    visual?: string;
    soundFeel?: string;
    rookieTrap?: string;
  };
  clarifyingSignals?: Record<string, string[]>;
  keywords?: string[];
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface DecisionOption {
  value: string;
  label: string;
}

export interface DecisionNode {
  id: string;
  question: string;
  helpText: string;
  options: DecisionOption[];
}

export interface DiagnosisMatch {
  entry: KnowledgeEntry;
  matchedReasons: string[];
  score: number;
}

export interface EscalationItem {
  id: string;
  jobId: string;
  jobTitle: string;
  craftsman: string;
  authorRole: RoleType;
  createdAt: string;
  issueTitle: string;
  impact: string;
  recommendedFix: string;
  status: 'Pending PM Approval' | 'Approved' | 'Rejected' | 'Question Sent to Crew';
  pmResponseNote?: string;
}

export interface Correction {
  id: string;
  targetType: 'diagnosis' | 'qa';
  entryId?: string;
  entryTitle: string;
  jobId?: string;
  authorRole: RoleType;
  authorName: string;
  text: string;
  status: 'pending' | 'applied' | 'discarded';
  createdAt: string;
}

export interface CapturePrompt {
  id: string;
  dayIndex: number;
  style: 'rookie-vs-master' | 'sensory-proxy' | 'pre-mortem';
  styleLabel: string;
  subDomain: SubDomainId;
  prompt: string;
  followUpHint: string;
  defaultAudience: 'tech' | 'owner';
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  askedByRole: RoleType;
  askedByName: string;
  createdAt: string;
  status: 'open' | 'answered' | 'discarded';
}

export interface EstimatorRates {
  sqFtPerHour: Record<StoneCategory, number>;
  hourlyRate: number;
  lippageCutSqFtPerHour: number;
  sealerSqFtPerGallon: number;
  polishLbPer100SqFt: number;
  commercialNightMultiplier: number;
  fragileStoneRiskPct: number;
}

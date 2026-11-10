export type RoleType = 'sales' | 'craftsman' | 'pm';

export type MobileTabType = 'record' | 'troubleshoot' | 'role-action';

export type StatusColor = 'emerald' | 'amber' | 'sky';

export interface StoneProfile {
  type: string;
  finish: string;
  subfloor: string;
  age: string;
  moistureReading: string;
  acidSensitivity: string;
  lippage: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
  role: string;
}

export interface BeforeAfterPhoto {
  id: string;
  area: string;
  beforeLogged: boolean;
  afterLogged: boolean;
  notes: string;
}

export type TimelineEventType = 'intake' | 'dispatch' | 'field-log' | 'escalation' | 'ai-diag';

export interface TimelineEntry {
  id: string;
  time: string;
  role: 'Sales' | 'PM' | 'Craftsman';
  author: string;
  type: TimelineEventType;
  title: string;
  text: string;
  badge?: string;
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
  timeline: TimelineEntry[];
}

export type RingGraphicType = 'cloudy-ring' | 'orange-frame' | 'lippage-chip' | 'oil-stain';

export interface DiagnosticScenario {
  id: string;
  shortTitle: string;
  fullTitle: string;
  stoneTag: string;
  patternColor: string;
  ringType: RingGraphicType;
  confidence: string;
  defaultTags: string[];
  rootCause: string;
  crewSteps: string[];
  safetyWarning: string;
  recommendedGrit: string;
  estTimeImpact: string;
}

export interface EscalationItem {
  id: string;
  jobId: string;
  jobTitle: string;
  craftsman: string;
  time: string;
  issueTitle: string;
  impact: string;
  recommendedFix: string;
  status: string;
  customerNotified: boolean;
}

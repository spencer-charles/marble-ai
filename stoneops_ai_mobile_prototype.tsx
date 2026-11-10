import React, { useState } from 'react';
import {
  Camera,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Users,
  Wrench,
  Sparkles,
  ChevronRight,
  Plus,
  Send,
  ShieldAlert,
  Clock,
  MapPin,
  Layers,
  Droplets,
  Hammer,
  CheckSquare,
  Square,
  ArrowUpRight,
  Search,
  BookOpen,
  UserCheck,
  Briefcase,
  HardHat,
  Phone,
  Info,
  RefreshCw,
  Check,
  ChevronDown,
  Image as ImageIcon,
  Sliders,
  ClipboardCheck,
  MessageSquare,
  Zap
} from 'lucide-react';

// --- INITIAL MOCK DATA ---

const INITIAL_JOBS = [
  {
    id: 'job-1',
    client: 'Henderson Residence',
    title: '1,200 sq ft Calacatta Marble Foyer',
    address: '412 Highland Dr, Issaquah, WA',
    status: 'In Progress - Field Crew',
    statusColor: 'emerald',
    salesRep: 'Marcus Vance',
    pm: 'Elena Rostova',
    leadCraftsman: 'Devon Brooks (Crew A)',
    stoneProfile: {
      type: 'Calacatta Gold Marble (Natural Calcium Carbonate)',
      finish: 'High Polish (Target: 95+ GU Gloss)',
      subfloor: 'Radiant Heated Concrete Slab',
      age: '14 Years',
      moistureReading: '4.2% (Elevated near entryway)',
      acidSensitivity: 'High (Instant fizz on HCl drop test)',
      lippage: 'Moderate (up to 1.5mm near threshold)'
    },
    customerNotes: 'Homeowner is hosting a charity dinner Friday evening. Very sensitive to dust; ensure full zip-wall containment around the grand staircase. Noticed dulling near the front door and faint yellowish rings by the planter.',
    checklist: [
      { id: 'c1', text: 'Install ZipWall dust containment & mask baseboards', done: true, role: 'Craftsman' },
      { id: 'c2', text: 'Cut lippage at foyer threshold with 100-grit metal bond', done: true, role: 'Craftsman' },
      { id: 'c3', text: 'Run 200 -> 400 -> 800 resin diamond honing pass', done: false, role: 'Craftsman' },
      { id: 'c4', text: 'Apply 5X Oxalic-blend polishing compound & buff', done: false, role: 'Craftsman' },
      { id: 'c5', text: 'Penetrating fluorochemical sealer application (2 coats)', done: false, role: 'Craftsman' }
    ],
    beforeAfterPhotos: [
      { id: 'ba1', area: 'Main Entryway Threshold', beforeLogged: true, afterLogged: false, notes: 'Severe traffic wear & 1.5mm tile lippage' },
      { id: 'ba2', area: 'Planter Corner (North Wall)', beforeLogged: true, afterLogged: false, notes: 'Moisture ring & surface etch' }
    ],
    timeline: [
      {
        id: 't1',
        time: 'Yesterday, 2:15 PM',
        role: 'Sales',
        author: 'Marcus Vance',
        type: 'intake',
        title: 'Site Intake & Stone Diagnostic Completed',
        text: 'Confirmed genuine Calacatta Gold. Passed sound test (no hollow tiles), but moisture meter hit 4.2% near the planter box. Promised client we would address lippage by the front door and restore mirror polish.',
        badge: 'Acid Test: Positive (Marble)'
      },
      {
        id: 't2',
        time: 'Yesterday, 4:40 PM',
        role: 'PM',
        author: 'Elena Rostova',
        type: 'dispatch',
        title: 'Crew Dispatched & Chemical Spec Locked',
        text: 'Assigned Devon & Crew A. Loaded 17" planetary grinder, 5X marble polishing powder, and breathable solvent-based sealer onto Truck #3. Reminded crew: NO acidic grout cleaners.',
        badge: 'Spec: Planetary + 5X Polish'
      },
      {
        id: 't3',
        time: 'Today, 8:30 AM',
        role: 'Craftsman',
        author: 'Devon Brooks',
        type: 'field-log',
        title: 'Containment Up & 100-Grit Lippage Flatten Done',
        text: 'Masked off staircase and wood transitions. Flattened high corners near entryway. Moving to 200-grit resin pass now.',
        badge: 'Step: 100-Grit Complete'
      }
    ]
  },
  {
    id: 'job-2',
    client: 'Apex Boutique Hotel',
    title: '3,400 sq ft Honed Travertine Lobby',
    address: '88 Pine St, Downtown Seattle',
    status: 'Escalation Review',
    statusColor: 'amber',
    salesRep: 'Marcus Vance',
    pm: 'Elena Rostova',
    leadCraftsman: 'Carlos Mendez (Crew B)',
    stoneProfile: {
      type: 'Roman Silver Travertine (Unfilled Voids)',
      finish: 'Satin Matte Hone (400-Grit Target)',
      subfloor: 'Commercial Mud Bed',
      age: '8 Years',
      moistureReading: '2.1% (Normal)',
      acidSensitivity: 'High (Calcite base)',
      lippage: 'Low (< 0.5mm)'
    },
    customerNotes: 'Night-shift work only (10 PM - 6 AM). Facilities manager wants all natural travertine pits color-matched with polyester stone filler before final 400-grit satin hone.',
    checklist: [
      { id: 'c201', text: 'Deep rotary scrub with alkaline stone cleaner (pH 10)', done: true, role: 'Craftsman' },
      { id: 'c202', text: 'Trowel fill open travertine voids with customtinted Tenax resin', done: true, role: 'Craftsman' },
      { id: 'c203', text: '200-grit diamond cut to shave cured resin flush', done: false, role: 'Craftsman' },
      { id: 'c204', text: '400-grit uniform satin hone & matte enhancer seal', done: false, role: 'Craftsman' }
    ],
    beforeAfterPhotos: [
      { id: 'ba201', area: 'Reception Desk Approach', beforeLogged: true, afterLogged: true, notes: '24 voids filled with custom silver-taupe polyester resin' }
    ],
    timeline: [
      {
        id: 't201',
        time: '2 Days Ago, 11:00 AM',
        role: 'Sales',
        author: 'Marcus Vance',
        type: 'intake',
        title: 'Commercial Night-Scope Approved',
        text: 'Counted ~140 blown-out travertine pockets across the main concourse. Sampled custom polyester tint for facilities director approval.',
        badge: 'Tint Match: #Silver-04'
      },
      {
        id: 't202',
        time: 'Today, 1:15 AM',
        role: 'Craftsman',
        author: 'Carlos Mendez',
        type: 'escalation',
        title: 'AI Troubleshooter Alert: Resin Bleed Halo',
        text: 'Spotted dark halo bleeding around filled travertine pockets near the bell desk. Ran AI diagnostics—looks like moisture trapped in deep pores slowed cure.',
        badge: 'Escalated to PM'
      }
    ]
  },
  {
    id: 'job-3',
    client: 'Mercer Residence',
    title: '185 sq ft Absolute Black Granite Island',
    address: '7420 SE 24th St, Mercer Island',
    status: 'Site Intake Pending Handoff',
    statusColor: 'sky',
    salesRep: 'Marcus Vance',
    pm: 'Elena Rostova',
    leadCraftsman: 'Unassigned',
    stoneProfile: {
      type: 'Absolute Black Granite (Dense Igneous)',
      finish: 'Leathered / Antiqued Texture',
      subfloor: 'Plywood Countertop Substrate',
      age: '5 Years',
      moistureReading: '1.1% (Dry)',
      acidSensitivity: 'None (Silicate-based, watch for doctored dye)',
      lippage: 'Seam offset 0.8mm at sink cutout'
    },
    customerNotes: 'Dark cooking oil stain around the Wolf range cutout and dull gray rings where previous cleaner stripped factory topical dye.',
    checklist: [
      { id: 'c301', text: 'Solvent acetone + diatomaceous earth poultice on oil stain', done: false, role: 'Craftsman' },
      { id: 'c302', text: 'Silicon carbide antiquing brushes (120 -> 220 -> 320)', done: false, role: 'Craftsman' },
      { id: 'c303', text: 'Color-enhancing fluoropolymer impregnator application', done: false, role: 'Craftsman' }
    ],
    beforeAfterPhotos: [
      { id: 'ba301', area: 'Range Cutout Right Side', beforeLogged: true, afterLogged: false, notes: 'Deep olive oil penetration in leathered grain' }
    ],
    timeline: [
      {
        id: 't301',
        time: 'Today, 10:05 AM',
        role: 'Sales',
        author: 'Marcus Vance',
        type: 'intake',
        title: 'Initial Site Inspection Started',
        text: 'Testing granite around range for oil depth and checking whether surface was artificially darkened at the factory.',
        badge: 'In Scoping'
      }
    ]
  }
];

const DIAGNOSTIC_SCENARIOS = [
  {
    id: 'diag-1',
    shortTitle: 'Cloudy Ring After Honing',
    fullTitle: 'Cloudy/Hazy Ring After Honing (Acid Etch / Efflorescence)',
    stoneTag: 'Calacatta & Soft Marbles',
    patternColor: 'from-stone-300 via-stone-200 to-stone-400',
    ringType: 'cloudy-ring',
    confidence: '97% Match — KB-SOP #104',
    defaultTags: ['White haze', 'Water rings'],
    rootCause: 'Calcium carbonate dissolution (chemical acid etch) combined with sub-surface moisture wicking mineral salts (efflorescence) to the freshly opened pore structure during wet honing.',
    crewSteps: [
      'Stop wet honing immediately and vacuum all slurry thoroughly with a wet-vac.',
      'Check moisture meter reading: if > 4.0%, run low-profile air movers for 45 mins before polishing.',
      'Feather out the localized ring using a 400-grit followed by 800-grit resin bond diamond pad with minimal water (damp mist only).',
      'Apply 5X Marble Polishing Compound with a white hogs-hair pad at 175 RPM until slurry turns satin-dry, then flush cleanly.'
    ],
    safetyWarning: 'NEVER use acidic grout haze removers or vinegar-based cleaners on Calacatta marble. Do not apply topical wax or non-breathable sealer if subfloor moisture exceeds 3.5%—it will trap vapor and cause spalling.',
    recommendedGrit: '400 -> 800 Resin + 5X Oxalic Polish',
    estTimeImpact: '+45 mins on site'
  },
  {
    id: 'diag-2',
    shortTitle: 'Orange Grout Picture-Framing',
    fullTitle: 'Orange Picture-Framing Along Grout Lines (Iron Oxidation)',
    stoneTag: 'White Marble & Travertine',
    patternColor: 'from-amber-200/80 via-stone-200 to-amber-600/40',
    ringType: 'orange-frame',
    confidence: '94% Match — KB-SOP #219',
    defaultTags: ['Spalling', 'Water rings'],
    rootCause: 'Trace ferrous iron deposits (pyrite/marcasite veins) natural to white marble are oxidizing (rusting) due to trapped moisture migrating from wet mud-set beds or high-alkaline bleach cleaners.',
    crewSteps: [
      'Avoid standard acid rust removers—they will severely etch the marble surface.',
      'Mix a specialized pH-neutral Sodium Hydrosulfite iron-out poultice with talc/kaolin clay to a peanut-butter consistency.',
      'Trowel poultice 1/4" thick over the oxidized border, cover with plastic wrap, and tape edges with low-tack painter tape.',
      'Allow 24 hours dwell time to pull iron ions out of the stone matrix, then scrape with plastic putty knife and re-hone at 400-grit.'
    ],
    safetyWarning: 'Sodium hydrosulfite poultice emits strong sulfur odors—ensure active ventilation and wear nitrile gloves. Warn the Project Manager immediately: iron oxidation requires a 24-hour return visit and cannot be rushed in a single shift.',
    recommendedGrit: 'Neutral Iron Poultice + 400 Resin',
    estTimeImpact: '+24 hr dwell (Requires Return Trip)'
  },
  {
    id: 'diag-3',
    shortTitle: 'Deep Lippage & Chipped Edges',
    fullTitle: 'Deep Lippage & Chipped Edges on Marble Tile',
    stoneTag: 'Large Format Stone Tile',
    patternColor: 'from-stone-500 via-stone-300 to-stone-600',
    ringType: 'lippage-chip',
    confidence: '99% Match — KB-SOP #088',
    defaultTags: ['Pitting', 'Spalling'],
    rootCause: 'Uneven subfloor settling or improper mortar coverage causing >1.5mm height differential between adjacent tiles. Running flexible pads over sharp tile steps causes "picture framing" and chips the brittle marble arris.',
    crewSteps: [
      'Clean chipped joint edges with denatured alcohol and blow dry with compressed air.',
      'Color-match knife-grade polyester stone adhesive (mix clear + white + buff tint) and razor-fill chipped edges slightly proud.',
      'Lock rigid aluminum drive plate on planetary grinder with 50-grit or 100-grit sintered metal-bond diamonds to bridge and flatten high tiles.',
      'Cross-hatch grind (North-South then East-West) until flat across grout lines, then step through 200 -> 400 -> 800 -> 1500 resins.'
    ],
    safetyWarning: 'Do NOT use flexible Velcro backer pads during lippage removal—they follow the wave of the floor and dish out softer veins. Always fill chipped edges BEFORE metal grinding to prevent further spalling of the tile edge.',
    recommendedGrit: 'Polyester Fill + 100 Metal -> 200-1500 Resin',
    estTimeImpact: '+2.0 hrs grinding time'
  },
  {
    id: 'diag-4',
    shortTitle: 'Dark Oil Stain Near Island',
    fullTitle: 'Dark Oil Stain Near Kitchen Island (Organic Lipid Intrusion)',
    stoneTag: 'Granite, Quartzite & Honed Stone',
    patternColor: 'from-stone-800 via-stone-900 to-stone-700',
    ringType: 'oil-stain',
    confidence: '96% Match — KB-SOP #312',
    defaultTags: ['Resin bleed', 'Pitting'],
    rootCause: 'Cooking oils or lipid-based cosmetics have wicked deep into microscopic capillary pores where previous sealer wore thin from harsh dish-soap scrubbing.',
    crewSteps: [
      'Degrease surface first with high-alkaline stone cleaner (pH 11-12) and a stiff nylon brush.',
      'Mix pure Acetone (or lacquer thinner) with absorbent Diatomaceous Earth powder into a thick paste.',
      'Apply 3/8" thick extending 1 inch beyond the dark stain halo; cover tightly with polyethylene film and seal edges.',
      'Leave for 16–24 hours so solvent dissolves the oil and powder draws it upward. Remove dry powder, rinse with distilled water, and apply 2 coats of fluorochemical impregnator.'
    ],
    safetyWarning: 'Acetone poultice is highly flammable! Extinguish all pilot lights on nearby gas ranges and shut off spark igniters before applying near kitchen islands.',
    recommendedGrit: 'Acetone/DE Poultice + Fluorochemical Seal',
    estTimeImpact: '+1.5 hrs prep + overnight pull'
  }
];

const SYMPTOM_TAGS = [
  'White haze',
  'Water rings',
  'Spalling',
  'Pitting',
  'Resin bleed',
  'Orange rust halo',
  'Edge chipping',
  'Stain darkening'
];

export default function App() {
  // Top-level Role & Job State
  const [activeRole, setActiveRole] = useState('craftsman'); // 'sales' | 'craftsman' | 'pm'
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [selectedJobId, setSelectedJobId] = useState('job-1');
  const [activeMobileTab, setActiveMobileTab] = useState('troubleshoot'); // 'record' | 'troubleshoot' | 'role-action'
  const [toastMessage, setToastMessage] = useState(null);

  // Troubleshooter State
  const [selectedScenarioId, setSelectedScenarioId] = useState('diag-1');
  const [selectedTags, setSelectedTags] = useState(['White haze', 'Water rings']);
  const [customSymptomText, setCustomSymptomText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(DIAGNOSTIC_SCENARIOS[0]);
  const [checkedSopSteps, setCheckedSopSteps] = useState({ 0: true });

  // Quick Note / Grit Log State (Job Record View)
  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickStepBadge, setQuickStepBadge] = useState('400-Grit Resin Pass');

  // Sales Intake Form State
  const [salesForm, setSalesForm] = useState({
    acidTest: 'Positive - Calcite Fizz (Marble/Travertine)',
    moisturePct: '4.2',
    lippageLevel: 'Moderate (1.0 - 2.0mm - Needs Metal Cut)',
    expectationNote: 'Advised client that deep iron veins are geological features, while surface etch and lippage will be 95%+ eliminated.',
    containmentRequired: true
  });

  // Escalation Queue State for PM
  const [escalations, setEscalations] = useState([
    {
      id: 'esc-1',
      jobId: 'job-1',
      jobTitle: 'Henderson Residence — Calacatta Foyer',
      craftsman: 'Devon Brooks',
      time: '12 mins ago',
      issueTitle: 'Cloudy/Hazy Ring After Honing (Acid Etch / Efflorescence)',
      impact: '+45 mins on site',
      recommendedFix: '400 -> 800 Resin + 5X Oxalic Polish after 45m air-mover dry',
      status: 'Pending PM Approval',
      customerNotified: false
    },
    {
      id: 'esc-2',
      jobId: 'job-2',
      jobTitle: 'Apex Hotel Lobby — Honed Travertine',
      craftsman: 'Carlos Mendez',
      time: 'Today, 1:15 AM',
      issueTitle: 'Resin Bleed Halo Around Filled Voids',
      impact: '+1.5 hrs acetone pull',
      recommendedFix: 'Acetone poultice lift before final 400-grit hone',
      status: 'Approved & Sent to Client',
      customerNotified: true
    }
  ]);

  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  // Helper to show a sleek floating toast inside the mobile viewport
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  // Switch role and smartly set a relevant default tab if desired, while allowing free navigation
  const handleRoleSwitch = (newRole) => {
    setActiveRole(newRole);
    if (newRole === 'craftsman') {
      setActiveMobileTab('troubleshoot');
    } else if (newRole === 'sales') {
      setActiveMobileTab('role-action');
    } else if (newRole === 'pm') {
      setActiveMobileTab('role-action');
    }
  };

  // Handle selecting a preset scenario in AI Troubleshooter
  const handleSelectScenario = (scenario) => {
    setSelectedScenarioId(scenario.id);
    setSelectedTags(scenario.defaultTags);
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setDiagnosisResult(scenario);
      setCheckedSopSteps({ 0: true });
    }, 450);
  };

  // Toggle symptom tags
  const toggleSymptomTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Run Knowledge Base Diagnosis button
  const handleRunDiagnosis = () => {
    setIsAnalyzing(true);
    const matched =
      DIAGNOSTIC_SCENARIOS.find((d) => d.id === selectedScenarioId) || DIAGNOSTIC_SCENARIOS[0];
    setTimeout(() => {
      setIsAnalyzing(false);
      setDiagnosisResult(matched);
      setCheckedSopSteps({});
      triggerToast(`Loaded ${matched.confidence}`);
    }, 550);
  };

  // Log diagnosis to Shared Job Timeline
  const handleLogDiagnosisToRecord = () => {
    if (!diagnosisResult) return;
    const newEntry = {
      id: `t-${Date.now()}`,
      time: 'Just now',
      role: 'Craftsman',
      author: currentJob.leadCraftsman.split(' ')[0] || 'Field Tech',
      type: 'ai-diag',
      title: `AI Troubleshooter Logged: ${diagnosisResult.shortTitle}`,
      text: `Executing SOP: ${diagnosisResult.recommendedGrit}. Root cause identified as ${diagnosisResult.rootCause.slice(0, 95)}...`,
      badge: diagnosisResult.recommendedGrit
    };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === currentJob.id ? { ...j, timeline: [newEntry, ...j.timeline] } : j
      )
    );
    triggerToast('Logged SOP & grit progression to Shared Job Timeline');
    setActiveMobileTab('record');
  };

  // Escalate Diagnosis to PM Queue & Timeline
  const handleEscalateToPM = () => {
    if (!diagnosisResult) return;
    const newEsc = {
      id: `esc-${Date.now()}`,
      jobId: currentJob.id,
      jobTitle: `${currentJob.client} — ${currentJob.title.split(' ').slice(-2).join(' ')}`,
      craftsman: currentJob.leadCraftsman,
      time: 'Just now',
      issueTitle: diagnosisResult.fullTitle,
      impact: diagnosisResult.estTimeImpact,
      recommendedFix: diagnosisResult.recommendedGrit,
      status: 'Pending PM Approval',
      customerNotified: false
    };

    const newTimelineEntry = {
      id: `t-esc-${Date.now()}`,
      time: 'Just now',
      role: 'Craftsman',
      author: currentJob.leadCraftsman.split(' ')[0] || 'Field Tech',
      type: 'escalation',
      title: `Escalated to PM: ${diagnosisResult.shortTitle}`,
      text: `Flagged ${diagnosisResult.estTimeImpact} impact. Waiting on PM approval for ${diagnosisResult.recommendedGrit}.`,
      badge: 'Escalated to PM'
    };

    setEscalations((prev) => [newEsc, ...prev]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === currentJob.id
          ? {
              ...j,
              status: 'Escalation Review',
              statusColor: 'amber',
              timeline: [newTimelineEntry, ...j.timeline]
            }
          : j
      )
    );
    triggerToast('Escalation sent to PM Queue & logged on Customer Record!');
  };

  // Add Quick Handoff Note / Chemical-Grit step to Timeline
  const handleAddQuickTimelineNote = (e) => {
    e.preventDefault();
    if (!quickNoteText.trim()) return;

    const roleLabel =
      activeRole === 'sales' ? 'Sales' : activeRole === 'pm' ? 'PM' : 'Craftsman';
    const authorName =
      activeRole === 'sales'
        ? 'Marcus Vance'
        : activeRole === 'pm'
        ? 'Elena Rostova'
        : 'Devon Brooks';

    const newEntry = {
      id: `t-note-${Date.now()}`,
      time: 'Just now',
      role: roleLabel,
      author: authorName,
      type: 'field-log',
      title: `${roleLabel} Update Logged`,
      text: quickNoteText,
      badge: quickStepBadge
    };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === currentJob.id ? { ...j, timeline: [newEntry, ...j.timeline] } : j
      )
    );
    setQuickNoteText('');
    triggerToast('Handoff update added to live Job Timeline');
  };

  // Sales Handoff Action
  const handleCompleteSalesHandoff = () => {
    const newEntry = {
      id: `t-sales-${Date.now()}`,
      time: 'Just now',
      role: 'Sales',
      author: 'Marcus Vance',
      type: 'intake',
      title: 'Sales Site Assessment & Handoff Locked',
      text: `Acid Test: ${salesForm.acidTest}. Slab Moisture: ${salesForm.moisturePct}%. Lippage: ${salesForm.lippageLevel}. Client Note: ${salesForm.expectationNote}`,
      badge: `Moisture: ${salesForm.moisturePct}% | Handoff Ready`
    };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === currentJob.id
          ? {
              ...j,
              status: 'Ready for PM Dispatch',
              statusColor: 'emerald',
              stoneProfile: {
                ...j.stoneProfile,
                moistureReading: `${salesForm.moisturePct}% (Updated at Intake)`,
                lippage: salesForm.lippageLevel
              },
              timeline: [newEntry, ...j.timeline]
            }
          : j
      )
    );
    triggerToast('Sales Assessment pushed to PM & Job Timeline!');
    setActiveMobileTab('record');
  };

  // Toggle Craftsman Checklist Item
  const handleToggleChecklist = (itemId) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== currentJob.id) return j;
        return {
          ...j,
          checklist: j.checklist.map((item) =>
            item.id === itemId ? { ...item, done: !item.done } : item
          )
        };
      })
    );
  };

  // Toggle Craftsman Before/After Photo verification
  const handleLogAfterPhoto = (photoId) => {
    const targetPhoto = currentJob.beforeAfterPhotos.find((p) => p.id === photoId);
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== currentJob.id) return j;
        const updatedPhotos = j.beforeAfterPhotos.map((p) =>
          p.id === photoId ? { ...p, afterLogged: true } : p
        );
        const newLog = {
          id: `t-photo-${Date.now()}`,
          time: 'Just now',
          role: 'Craftsman',
          author: 'Devon Brooks',
          type: 'field-log',
          title: `Verified After-Photo: ${targetPhoto ? targetPhoto.area : 'Work Zone'}`,
          text: 'Captured high-angle gloss reflection photo confirming uniform clarity and zero lippage shadow.',
          badge: 'Photo Proof Verified'
        };
        return {
          ...j,
          beforeAfterPhotos: updatedPhotos,
          timeline: [newLog, ...j.timeline]
        };
      })
    );
    triggerToast('After-photo verification logged to Customer Record');
  };

  // PM Approve Escalation & Notify Customer
  const handleApproveEscalation = (esc) => {
    setEscalations((prev) =>
      prev.map((item) =>
        item.id === esc.id
          ? { ...item, status: 'Approved & Sent to Client', customerNotified: true }
          : item
      )
    );

    const newEntry = {
      id: `t-pm-${Date.now()}`,
      time: 'Just now',
      role: 'PM',
      author: 'Elena Rostova',
      type: 'dispatch',
      title: `PM Approved Fix & Updated Customer: ${esc.issueTitle.split('(')[0]}`,
      text: `Authorized crew to run ${esc.recommendedFix} (${esc.impact}). Sent SMS & photo update to homeowner explaining why the extra step protects the stone long-term.`,
      badge: 'PM Approved + Client SMS Sent'
    };

    setJobs((prev) =>
      prev.map((j) =>
        j.id === esc.jobId
          ? {
              ...j,
              status: 'In Progress - PM Approved SOP',
              statusColor: 'emerald',
              timeline: [newEntry, ...j.timeline]
            }
          : j
      )
    );
    triggerToast('Approved SOP & logged client notification on Job Timeline!');
  };

  // Render simulated stone texture thumbnail for the AI Troubleshooter cards
  const renderStoneVisualGraphic = (type) => {
    if (type === 'cloudy-ring') {
      return (
        <div className="relative w-full h-16 rounded-lg overflow-hidden bg-gradient-to-br from-stone-200 via-stone-100 to-stone-300 border border-stone-400/50 flex items-center justify-center">
          {/* Marble veins */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 60">
            <path d="M0 15 Q 30 25, 55 10 T 100 35" stroke="#57534e" strokeWidth="1.5" fill="none" />
            <path d="M15 60 Q 45 35, 85 45" stroke="#78716c" strokeWidth="1" fill="none" />
          </svg>
          {/* Acid etch cloudy ring */}
          <div className="w-10 h-10 rounded-full border-4 border-white/90 bg-white/50 blur-[0.5px] shadow-inner flex items-center justify-center">
            <span className="text-[9px] font-bold text-stone-700 bg-white/80 px-1 rounded">ETCH</span>
          </div>
        </div>
      );
    }
    if (type === 'orange-frame') {
      return (
        <div className="relative w-full h-16 rounded-lg overflow-hidden bg-stone-200 border border-amber-500/50 flex items-center justify-center">
          {/* Grout cross */}
          <div className="absolute inset-y-0 left-1/2 w-1.5 bg-stone-500 -translate-x-1/2" />
          <div className="absolute inset-x-0 top-1/2 h-1.5 bg-stone-500 -translate-y-1/2" />
          {/* Orange oxidation halo */}
          <div className="absolute inset-y-0 left-1/2 w-6 bg-amber-500/35 blur-[2px] -translate-x-1/2" />
          <div className="absolute inset-x-0 top-1/2 h-6 bg-amber-600/30 blur-[2px] -translate-y-1/2" />
          <span className="relative z-10 text-[9px] font-bold text-amber-950 bg-amber-200/90 px-1.5 py-0.5 rounded border border-amber-500/50">
            FE2O3 RUST
          </span>
        </div>
      );
    }
    if (type === 'lippage-chip') {
      return (
        <div className="relative w-full h-16 rounded-lg overflow-hidden bg-gradient-to-r from-stone-300 via-stone-400 to-stone-200 border border-stone-400/50 flex items-center justify-center">
          <div className="absolute inset-y-0 left-1/2 w-2 bg-stone-800 -translate-x-1/2 shadow-lg" />
          <div className="w-3 h-3 rounded-full bg-stone-700 absolute top-3 left-1/2 -translate-x-2" />
          <div className="w-2.5 h-2.5 rounded-full bg-stone-700 absolute bottom-4 left-1/2 translate-x-0.5" />
          <span className="relative z-10 text-[9px] font-bold text-stone-100 bg-stone-900/80 px-1.5 py-0.5 rounded">
            1.5mm STEP
          </span>
        </div>
      );
    }
    return (
      <div className="relative w-full h-16 rounded-lg overflow-hidden bg-stone-800 border border-stone-600 flex items-center justify-center">
        <div className="w-12 h-11 rounded-full bg-black/75 blur-[1px] border border-amber-900/40 flex items-center justify-center">
          <span className="text-[9px] font-bold text-amber-300">OIL DARK</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-500 selection:text-stone-950 pb-12">
      {/* --- TOP OUTSIDE BAR: ROLE SWITCHER & SYSTEM ARCHITECTURE OVERVIEW --- */}
      <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md border-b border-stone-800 px-4 py-3 shadow-xl">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Brand & Context */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-black shadow-lg shadow-amber-500/20">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-stone-100">
                    Marble AI
                  </h1>
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Field RAG + Handoff Mock
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Marble, Travertine & Terrazzo Restoration • Shared Job Record & Vision Troubleshooter
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Role Switcher Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 px-2.5 py-1 hidden xl:inline-block">
              Test App As Role:
            </span>
            <button
              onClick={() => handleRoleSwitch('sales')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'sales'
                  ? 'bg-sky-500 text-stone-950 shadow-md shadow-sky-500/20'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div>1. Sales / Estimator</div>
                <div className={`text-[10px] ${activeRole === 'sales' ? 'text-stone-900' : 'text-stone-500'}`}>
                  Site Intake & Scoping
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSwitch('craftsman')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'craftsman'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <HardHat className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div>2. Field Craftsman</div>
                <div className={`text-[10px] ${activeRole === 'craftsman' ? 'text-stone-900' : 'text-stone-500'}`}>
                  On-Site Work & AI Troubleshooter
                </div>
              </div>
            </button>

            <button
              onClick={() => handleRoleSwitch('pm')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeRole === 'pm'
                  ? 'bg-emerald-500 text-stone-950 shadow-md shadow-emerald-500/20'
                  : 'text-stone-300 hover:bg-stone-900 hover:text-white'
              }`}
            >
              <UserCheck className="w-4 h-4 shrink-0" />
              <div className="text-left">
                <div>3. Project Manager</div>
                <div className={`text-[10px] ${activeRole === 'pm' ? 'text-stone-900' : 'text-stone-500'}`}>
                  Dispatch, Escalations & Record
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* --- MAIN WORKSPACE: DESKTOP CONTEXT RAIL + CENTERED IPHONE PROTOTYPE --- */}
      <main className="max-w-6xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: WORKFLOW GUIDE & LIVE DATA FLOW ARCHITECTURE (4 COLS ON DESKTOP) */}
        <div className="lg:col-span-5 space-y-5 order-2 lg:order-1">
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              Interactive Product Blueprint
            </div>
            <h2 className="text-lg font-bold text-stone-100 mb-2">
              How Information Flows Across Teams
            </h2>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              In stone restoration, costly mistakes happen when what Sales promised doesn’t reach the Craftsman on the grinder, or when an unexpected marble reaction isn’t escalated to the PM. Try clicking through the roles to watch updates sync to the single customer record in real time.
            </p>

            {/* 3-Stage Handoff Pipeline Cards */}
            <div className="space-y-3">
              <div
                onClick={() => handleRoleSwitch('sales')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeRole === 'sales'
                    ? 'bg-sky-500/10 border-sky-500/50'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> Stage 1: Sales / Estimator Intake
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                    Pre-Job
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  Logs acid drop test (Marble vs. Quartzite), slab moisture %, and tile lippage. Sets realistic homeowner expectations around natural veining vs. surface damage.
                </p>
              </div>

              <div
                onClick={() => handleRoleSwitch('craftsman')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeRole === 'craftsman'
                    ? 'bg-amber-500/10 border-amber-500/50'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <HardHat className="w-3.5 h-3.5" /> Stage 2: Craftsman + AI Troubleshooter
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-medium">
                    Wet-Hand UI
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  Snaps a photo of unexpected haze, iron bleed, or stains. Vision + Knowledge Base RAG returns exact diamond grit sequences, poultice ratios, and safety warnings.
                </p>
              </div>

              <div
                onClick={() => handleRoleSwitch('pm')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  activeRole === 'pm'
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Stage 3: PM Escalation & Client Sign-Off
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                    Live Ops
                  </span>
                </div>
                <p className="text-xs text-stone-300">
                  Reviews field escalations that add scope or cure time (e.g., 24-hr poultice dwell), approves the SOP, and pushes verified before/after records to the homeowner.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Job Switcher outside phone as well for convenience */}
          <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
              Active Customer Job Records ({jobs.length})
            </h3>
            <div className="space-y-2">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedJobId === job.id
                      ? 'bg-stone-800 border-amber-500/60 shadow-md'
                      : 'bg-stone-950/50 border-stone-800/80 hover:bg-stone-900'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-stone-100">{job.client}</div>
                    <div className="text-[11px] text-stone-400">{job.title}</div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      job.statusColor === 'emerald'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : job.statusColor === 'amber'
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                    }`}
                  >
                    {job.timeline.length} logs
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SLEEK IPHONE-STYLE MOBILE VIEWPORT (7 COLS ON DESKTOP) */}
        <div className="lg:col-span-7 flex justify-center order-1 lg:order-2">
          <div className="w-full max-w-[430px] bg-stone-900 rounded-[44px] p-3 border-[6px] border-stone-800 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] relative">
            
            {/* Phone Speaker Notch & Status Bar */}
            <div className="bg-stone-950 rounded-t-[34px] pt-2.5 pb-2 px-6 flex items-center justify-between border-b border-stone-800/80">
              <span className="text-[11px] font-bold text-stone-300">9:41 AM</span>
              <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 border border-stone-800">
                <div className="w-2 h-2 rounded-full bg-stone-800" />
                <div className="w-8 h-1 rounded-full bg-stone-800" />
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                5G • Sync
              </div>
            </div>

            {/* Floating Notification Toast inside Phone */}
            {toastMessage && (
              <div className="absolute top-16 inset-x-6 z-50 bg-emerald-500 text-stone-950 px-3.5 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-bold border border-emerald-300 animate-bounce">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{toastMessage}</span>
              </div>
            )}

            {/* Mobile App Header: Active Role Banner + Active Job Selector */}
            <div className="bg-stone-950 px-4 pt-3 pb-3 border-b border-stone-800">
              {/* Role Context Pill */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      activeRole === 'sales'
                        ? 'bg-sky-400'
                        : activeRole === 'craftsman'
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                  />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-300">
                    {activeRole === 'sales' && 'Sales / Estimator Mode'}
                    {activeRole === 'craftsman' && 'Field Craftsman Mode (High-Contrast)'}
                    {activeRole === 'pm' && 'Project Manager Mode'}
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 bg-stone-900 px-2 py-0.5 rounded border border-stone-800">
                  {activeRole === 'sales'
                    ? 'Marcus V.'
                    : activeRole === 'craftsman'
                    ? 'Devon B.'
                    : 'Elena R.'}
                </span>
              </div>

              {/* Active Job Selector Dropdown inside App */}
              <div className="relative">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-400 mb-1">
                  Active Customer & Stone Job Record
                </label>
                <div className="relative">
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full appearance-none bg-stone-900 hover:bg-stone-800/90 text-stone-100 text-xs font-bold rounded-xl pl-3 pr-9 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.client} — {j.title}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-amber-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Quick Status Strip */}
              <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-stone-900 text-[11px]">
                <span className="text-stone-400 flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                  {currentJob.address}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    currentJob.statusColor === 'emerald'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : currentJob.statusColor === 'amber'
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                      : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                  }`}
                >
                  {currentJob.status}
                </span>
              </div>
            </div>

            {/* --- SCROLLABLE MOBILE VIEWPORT BODY --- */}
            <div className="bg-stone-950 h-[590px] overflow-y-auto px-4 py-4 space-y-4">
              
              {/* ===================================================================
                  TAB 1: SHARED CUSTOMER & JOB RECORD VIEW (SINGLE SOURCE OF TRUTH)
              =================================================================== */}
              {activeMobileTab === 'record' && (
                <div className="space-y-4">
                  {/* Stone Technical Profile Card (Travertine Warm Accent) */}
                  <div className="bg-gradient-to-b from-stone-900 to-stone-900/70 rounded-2xl p-3.5 border border-stone-800 shadow-md">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <Layers className="w-4 h-4" />
                        Stone Diagnostic Profile
                      </span>
                      <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-semibold">
                        Age: {currentJob.stoneProfile.age}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800/80">
                        <div className="text-[10px] text-stone-400">Stone Composition</div>
                        <div className="font-bold text-stone-100 mt-0.5 leading-snug">
                          {currentJob.stoneProfile.type}
                        </div>
                      </div>
                      <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800/80">
                        <div className="text-[10px] text-stone-400">Target Finish</div>
                        <div className="font-bold text-stone-100 mt-0.5 leading-snug">
                          {currentJob.stoneProfile.finish}
                        </div>
                      </div>
                      <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800/80">
                        <div className="text-[10px] text-stone-400 flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-sky-400" /> Subfloor & Moisture
                        </div>
                        <div className="font-bold text-amber-300 mt-0.5 leading-snug">
                          {currentJob.stoneProfile.moistureReading}
                        </div>
                      </div>
                      <div className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800/80">
                        <div className="text-[10px] text-stone-400">Pre-Existing Lippage</div>
                        <div className="font-bold text-stone-100 mt-0.5 leading-snug">
                          {currentJob.stoneProfile.lippage}
                        </div>
                      </div>
                    </div>

                    {/* Customer Expectation & Site Notes */}
                    <div className="mt-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-300 mb-0.5">
                        Customer Notes & Site Constraints
                      </div>
                      <p className="text-xs text-stone-200 leading-relaxed">
                        {currentJob.customerNotes}
                      </p>
                    </div>

                    {/* Assigned Team Strip */}
                    <div className="mt-3 pt-2.5 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
                      <span>Sales: <strong className="text-stone-200">{currentJob.salesRep}</strong></span>
                      <span>PM: <strong className="text-stone-200">{currentJob.pm}</strong></span>
                      <span>Crew: <strong className="text-amber-300">{currentJob.leadCraftsman.split(' ')[0]}</strong></span>
                    </div>
                  </div>

                  {/* Quick Handoff / Chemical-Grit Logger Form */}
                  <form
                    onSubmit={handleAddQuickTimelineNote}
                    className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                        Log Handoff Note or Grit/Chemical Step
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Posting as {activeRole.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <select
                        value={quickStepBadge}
                        onChange={(e) => setQuickStepBadge(e.target.value)}
                        className="bg-stone-950 text-stone-200 text-[11px] font-semibold rounded-lg px-2.5 py-1.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                      >
                        <option value="200-Grit Resin Cut">200-Grit Resin Cut</option>
                        <option value="400-Grit Resin Pass">400-Grit Resin Pass</option>
                        <option value="800-Grit Polish Prep">800-Grit Polish Prep</option>
                        <option value="5X Polish Compound">5X Polish Compound</option>
                        <option value="Poultice Applied">Poultice Applied</option>
                        <option value="Sealer Coat #1">Sealer Coat #1</option>
                        <option value="Client Expectation Note">Client Expectation Note</option>
                      </select>
                      <input
                        type="text"
                        value={quickNoteText}
                        onChange={(e) => setQuickNoteText(e.target.value)}
                        placeholder="Add field note or handoff instruction..."
                        className="flex-1 bg-stone-950 text-stone-100 text-xs rounded-lg px-3 py-1.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Append to Shared Job Timeline
                    </button>
                  </form>

                  {/* Chronological Activity & Handoff Timeline */}
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between px-1">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Activity & Handoff Timeline ({currentJob.timeline.length})
                      </h3>
                      <span className="text-[10px] text-stone-500">Live Sync</span>
                    </div>

                    <div className="space-y-3 relative before:absolute before:inset-y-2 before:left-4 before:w-0.5 before:bg-stone-800">
                      {currentJob.timeline.map((item) => {
                        const roleColors =
                          item.role === 'Sales'
                            ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                            : item.role === 'PM'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/40';

                        return (
                          <div key={item.id} className="relative pl-9">
                            {/* Timeline Node Dot */}
                            <div
                              className={`w-3.5 h-3.5 rounded-full border-2 border-stone-950 absolute left-[9px] top-3 ${
                                item.type === 'escalation'
                                  ? 'bg-red-500 ring-4 ring-red-500/20'
                                  : item.role === 'Sales'
                                  ? 'bg-sky-400'
                                  : item.role === 'PM'
                                  ? 'bg-emerald-400'
                                  : 'bg-amber-400'
                              }`}
                            />

                            <div className="bg-stone-900/95 border border-stone-800 rounded-2xl p-3 space-y-1.5 shadow-sm">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${roleColors}`}
                                  >
                                    {item.role}
                                  </span>
                                  <span className="text-xs font-bold text-stone-200">
                                    {item.author}
                                  </span>
                                </div>
                                <span className="text-[10px] text-stone-400">{item.time}</span>
                              </div>

                              <div className="text-xs font-bold text-stone-100">
                                {item.title}
                              </div>
                              <p className="text-xs text-stone-300 leading-relaxed">
                                {item.text}
                              </p>

                              {item.badge && (
                                <div className="pt-1 flex items-center gap-1.5">
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-0.5 rounded-md bg-stone-950 text-amber-300 border border-stone-700">
                                    <Wrench className="w-3 h-3 text-amber-400" />
                                    {item.badge}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ===================================================================
                  TAB 2: AI STONE TROUBLESHOOTER (VISION + KNOWLEDGE BASE RAG MOCK)
              =================================================================== */}
              {activeMobileTab === 'troubleshoot' && (
                <div className="space-y-4">
                  {/* Wet/Dusty Hands High-Contrast Banner */}
                  <div className="bg-gradient-to-r from-amber-500/20 via-stone-900 to-stone-900 rounded-2xl p-3.5 border border-amber-500/40 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-300 text-xs font-black uppercase tracking-wider">
                        <Camera className="w-4 h-4" />
                        AI Stone Vision + RAG Troubleshooter
                      </div>
                      <p className="text-[11px] text-stone-300 mt-0.5">
                        Snap or select a floor defect below to query the company SOP database.
                      </p>
                    </div>
                    <span className="text-[10px] font-bold bg-amber-500 text-stone-950 px-2 py-1 rounded-lg shrink-0">
                      GLOVE UI
                    </span>
                  </div>

                  {/* Step 1: Select or Simulate Uploading Photo of Stone Issue (4 Preset Scenarios) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-300">
                        1. Select Captured Stone Defect Photo
                      </label>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        Tap card to load scan
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {DIAGNOSTIC_SCENARIOS.map((scen) => {
                        const isSelected = selectedScenarioId === scen.id;
                        return (
                          <button
                            key={scen.id}
                            onClick={() => handleSelectScenario(scen)}
                            className={`text-left p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-stone-800 border-amber-400 shadow-lg shadow-amber-500/10'
                                : 'bg-stone-900/90 border-stone-800 hover:border-stone-700'
                            }`}
                          >
                            {renderStoneVisualGraphic(scen.ringType)}
                            <div className="mt-2">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-[10px] font-bold text-amber-400 uppercase">
                                  {scen.stoneTag}
                                </span>
                                {isSelected && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                                )}
                              </div>
                              <div className="text-xs font-bold text-stone-100 leading-snug mt-0.5">
                                {scen.shortTitle}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: Quick Symptom Tags & Field Input */}
                  <div className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-300">
                      2. Confirm Surface Symptoms (Large Tap Targets)
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {SYMPTOM_TAGS.map((tag) => {
                        const active = selectedTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleSymptomTag(tag)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
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

                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        value={customSymptomText}
                        onChange={(e) => setCustomSymptomText(e.target.value)}
                        placeholder="Optional: e.g. happened after 400-grit pass..."
                        className="flex-1 bg-stone-950 text-stone-100 text-xs rounded-xl px-3 py-2.5 border border-stone-700 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleRunDiagnosis}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      {isAnalyzing ? 'Querying Stone Knowledge Base...' : 'Run Knowledge Base Diagnosis'}
                    </button>
                  </div>

                  {/* Step 3: Structured Knowledge Base SOP Output Card */}
                  {diagnosisResult && (
                    <div className="bg-stone-900 rounded-2xl border-2 border-emerald-500/50 overflow-hidden shadow-xl space-y-3.5 p-4">
                      {/* Header & Confidence Badge */}
                      <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-3">
                        <div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                            <BookOpen className="w-3 h-3" /> {diagnosisResult.confidence}
                          </span>
                          <h3 className="text-sm font-extrabold text-stone-100 leading-snug">
                            {diagnosisResult.fullTitle}
                          </h3>
                        </div>
                        <span className="text-[10px] font-bold bg-stone-950 text-amber-300 px-2 py-1 rounded-lg border border-stone-700 shrink-0">
                          {diagnosisResult.estTimeImpact}
                        </span>
                      </div>

                      {/* Root Cause Analysis */}
                      <div className="bg-stone-950/90 p-3 rounded-xl border border-stone-800">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-sky-400 mb-1">
                          Root Cause Analysis (Chemical / Mechanical)
                        </div>
                        <p className="text-xs text-stone-200 leading-relaxed">
                          {diagnosisResult.rootCause}
                        </p>
                      </div>

                      {/* Interactive Step-by-Step Crew Instructions */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                            Crew Remediation Steps (Tap to Check Off)
                          </span>
                          <span className="text-[10px] text-stone-400 font-semibold">
                            Spec: {diagnosisResult.recommendedGrit}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {diagnosisResult.crewSteps.map((step, idx) => {
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
                                className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
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
                                  className={`text-xs leading-relaxed ${
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

                      {/* Safety & Stone Warnings */}
                      <div className="bg-red-950/40 border border-red-500/40 rounded-xl p-3 flex items-start gap-2.5">
                        <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-[10px] font-black uppercase tracking-wider text-red-300">
                            Critical Stone & Chemical Warning
                          </div>
                          <p className="text-xs text-red-100 leading-relaxed mt-0.5">
                            {diagnosisResult.safetyWarning}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons: Log to Job Record & Escalate to PM */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1">
                        <button
                          type="button"
                          onClick={handleLogDiagnosisToRecord}
                          className="py-3 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          Log to Job Record
                        </button>
                        <button
                          type="button"
                          onClick={handleEscalateToPM}
                          className="py-3 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          Escalate to PM
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===================================================================
                  TAB 3: ROLE-SPECIFIC HANDOFF & WORKFLOW ACTIONS
              =================================================================== */}
              {activeMobileTab === 'role-action' && (
                <div className="space-y-4">
                  {/* --- ROLE 1: SALES / ESTIMATOR SITE ASSESSMENT & HANDOFF --- */}
                  {activeRole === 'sales' && (
                    <div className="space-y-4">
                      <div className="bg-sky-500/15 border border-sky-500/40 rounded-2xl p-3.5">
                        <div className="text-xs font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          Sales / Estimator Site Intake & Handoff
                        </div>
                        <p className="text-xs text-stone-300 mt-1">
                          Record diagnostic drop tests and slab readings so the PM and Field Crew aren’t blindsided on job day.
                        </p>
                      </div>

                      <div className="bg-stone-900 rounded-2xl p-4 border border-stone-800 space-y-3.5">
                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                            Acid Sensitivity Drop Test (10% HCl)
                          </label>
                          <select
                            value={salesForm.acidTest}
                            onChange={(e) =>
                              setSalesForm({ ...salesForm, acidTest: e.target.value })
                            }
                            className="w-full bg-stone-950 text-stone-100 text-xs font-semibold rounded-xl px-3 py-2.5 border border-stone-700"
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

                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                              Tramex Moisture %
                            </label>
                            <input
                              type="text"
                              value={salesForm.moisturePct}
                              onChange={(e) =>
                                setSalesForm({ ...salesForm, moisturePct: e.target.value })
                              }
                              className="w-full bg-stone-950 text-amber-300 font-bold text-xs rounded-xl px-3 py-2.5 border border-stone-700"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                              Tile Lippage Check
                            </label>
                            <select
                              value={salesForm.lippageLevel}
                              onChange={(e) =>
                                setSalesForm({ ...salesForm, lippageLevel: e.target.value })
                              }
                              className="w-full bg-stone-950 text-stone-100 text-xs font-semibold rounded-xl px-2.5 py-2.5 border border-stone-700"
                            >
                              <option value="Low (< 0.5mm - Honey & Polish Only)">
                                Low (&lt; 0.5mm)
                              </option>
                              <option value="Moderate (1.0 - 2.0mm - Needs Metal Cut)">
                                Moderate (1.0-2.0mm)
                              </option>
                              <option value="Severe (> 2.0mm - Full Flatten Required)">
                                Severe (&gt; 2.0mm)
                              </option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-300 mb-1">
                            Customer Expectations & Pre-Existing Flaw Sign-Off
                          </label>
                          <textarea
                            rows={3}
                            value={salesForm.expectationNote}
                            onChange={(e) =>
                              setSalesForm({ ...salesForm, expectationNote: e.target.value })
                            }
                            className="w-full bg-stone-950 text-stone-100 text-xs rounded-xl p-3 border border-stone-700"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={handleCompleteSalesHandoff}
                          className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          Complete Sales Handoff to PM
                        </button>
                      </div>
                    </div>
                  )}

                  {/* --- ROLE 2: CRAFTSMAN WORK CHECKLIST & BEFORE/AFTER PHOTO VERIFICATION --- */}
                  {activeRole === 'craftsman' && (
                    <div className="space-y-4">
                      <div className="bg-amber-500/15 border border-amber-500/40 rounded-2xl p-3.5">
                        <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                          <HardHat className="w-4 h-4" />
                          On-Site Craftsman SOP Checklist & Photo Proof
                        </div>
                        <p className="text-xs text-stone-300 mt-1">
                          Check off completed diamond passes and verify Before/After reflection shots for the customer file.
                        </p>
                      </div>

                      {/* Diamond Grit & Chemical Execution Checklist */}
                      <div className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-300">
                            Assigned Job Execution Checklist
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400">
                            {currentJob.checklist.filter((i) => i.done).length} /{' '}
                            {currentJob.checklist.length} Done
                          </span>
                        </div>

                        <div className="space-y-2">
                          {currentJob.checklist.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleToggleChecklist(item.id)}
                              className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                                item.done
                                  ? 'bg-emerald-950/30 border-emerald-500/40 text-stone-400'
                                  : 'bg-stone-950 border-stone-800 text-stone-100 hover:border-stone-700'
                              }`}
                            >
                              {item.done ? (
                                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              ) : (
                                <Square className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                              )}
                              <span className={`text-xs ${item.done ? 'line-through' : 'font-semibold'}`}>
                                {item.text}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Before / After Photo Log Verification */}
                      <div className="bg-stone-900 rounded-2xl p-3.5 border border-stone-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-amber-400" />
                            Before / After Gloss Verification Log
                          </span>
                        </div>

                        {currentJob.beforeAfterPhotos.map((photo) => (
                          <div
                            key={photo.id}
                            className="bg-stone-950 rounded-xl p-3 border border-stone-800 space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-stone-100">
                                {photo.area}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  photo.afterLogged
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500/20 text-amber-300'
                                }`}
                              >
                                {photo.afterLogged ? 'Before + After Complete' : 'Awaiting After Photo'}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-400">{photo.notes}</p>
                            {!photo.afterLogged ? (
                              <button
                                type="button"
                                onClick={() => handleLogAfterPhoto(photo.id)}
                                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                <Camera className="w-3.5 h-3.5" />
                                Capture & Verify "After" Reflection Photo
                              </button>
                            ) : (
                              <div className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Synced to Customer Record & Final Invoice Packet
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* --- ROLE 3: PROJECT MANAGER ESCALATIONS & CUSTOMER UPDATES --- */}
                  {activeRole === 'pm' && (
                    <div className="space-y-4">
                      <div className="bg-emerald-500/15 border border-emerald-500/40 rounded-2xl p-3.5">
                        <div className="text-xs font-black uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4" />
                          PM Dispatch & Live Field Escalation Queue
                        </div>
                        <p className="text-xs text-stone-300 mt-1">
                          Approve field troubleshooting remedies that affect job duration and send proactive updates to the homeowner.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {escalations.map((esc) => (
                          <div
                            key={esc.id}
                            className={`rounded-2xl p-3.5 border space-y-2.5 ${
                              esc.customerNotified
                                ? 'bg-stone-900/70 border-stone-800'
                                : 'bg-stone-900 border-amber-500/60 shadow-lg'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  esc.customerNotified
                                    ? 'bg-emerald-500/20 text-emerald-300'
                                    : 'bg-amber-500 text-stone-950'
                                }`}
                              >
                                {esc.status}
                              </span>
                              <span className="text-[10px] text-stone-400">{esc.time}</span>
                            </div>

                            <div>
                              <div className="text-xs font-bold text-stone-300">
                                {esc.jobTitle}
                              </div>
                              <div className="text-sm font-extrabold text-stone-100 mt-0.5">
                                {esc.issueTitle}
                              </div>
                            </div>

                            <div className="bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-xs space-y-1">
                              <div className="flex justify-between">
                                <span className="text-stone-400">Craftsman:</span>
                                <span className="font-semibold text-stone-200">{esc.craftsman}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-400">Proposed SOP Fix:</span>
                                <span className="font-semibold text-amber-300">{esc.recommendedFix}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-stone-400">Schedule Impact:</span>
                                <span className="font-semibold text-red-300">{esc.impact}</span>
                              </div>
                            </div>

                            {!esc.customerNotified ? (
                              <button
                                type="button"
                                onClick={() => handleApproveEscalation(esc)}
                                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Approve Fix & Send Client Update
                              </button>
                            ) : (
                              <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5 pt-1">
                                <Check className="w-4 h-4" />
                                Approved & logged to Shared Customer Timeline
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* --- BOTTOM NAVIGATION BAR INSIDE MOBILE FRAME --- */}
            <nav className="bg-stone-950 rounded-b-[34px] border-t border-stone-800 px-3 py-2 grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setActiveMobileTab('record')}
                className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all cursor-pointer ${
                  activeMobileTab === 'record'
                    ? 'bg-stone-800 text-amber-400 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileText className="w-4 h-4 mb-1" />
                <span className="text-[10px]">Job Record</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMobileTab('troubleshoot')}
                className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all cursor-pointer ${
                  activeMobileTab === 'troubleshoot'
                    ? 'bg-amber-500 text-stone-950 font-black shadow-md shadow-amber-500/20'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Camera className="w-4 h-4 mb-1" />
                <span className="text-[10px]">AI Troubleshoot</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMobileTab('role-action')}
                className={`flex flex-col items-center justify-center py-2 rounded-2xl transition-all cursor-pointer relative ${
                  activeMobileTab === 'role-action'
                    ? 'bg-stone-800 text-emerald-400 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <ClipboardCheck className="w-4 h-4 mb-1" />
                <span className="text-[10px]">
                  {activeRole === 'sales'
                    ? 'Sales Intake'
                    : activeRole === 'craftsman'
                    ? 'Crew Checklist'
                    : 'PM Escalations'}
                </span>
                {activeRole === 'pm' &&
                  escalations.some((e) => !e.customerNotified) && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-1.5 right-6" />
                  )}
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
}
import { DecisionNode, KnowledgeEntry, SubDomainMeta } from '@/types/marble';

export const SUB_DOMAINS: SubDomainMeta[] = [
  {
    id: 'surface-diagnostics',
    pillar: 'A. Master Craftsmanship',
    label: 'Surface Diagnostics',
    description:
      'Visual & tactile identification of marble, travertine, granite, terrazzo, and limestone; testing porosity, acid sensitivity, and sub-surface moisture.'
  },
  {
    id: 'stain-taxonomy',
    pillar: 'A. Master Craftsmanship',
    label: 'Damage & Stain Taxonomy',
    description:
      'Differentiating acid etches from water rings, efflorescence, spalling, lippage, stun marks, and organic vs. oil/rust stains; poultice chemistry.'
  },
  {
    id: 'tooling-grit',
    pillar: 'A. Master Craftsmanship',
    label: 'Tooling & Grit Progression',
    description:
      'Diamond resin pad sequences, honing vs. polishing compounds, machine weights/RPMs, and sealer applications.'
  },
  {
    id: 'edge-cases',
    pillar: 'A. Master Craftsmanship',
    label: 'Edge Cases & Crisis Recovery',
    description:
      'Fixing burn marks on soft stone, managing crumbling historic mortar, matching factory finishes, and preventing collateral damage.'
  },
  {
    id: 'estimation-bidding',
    pillar: 'B. Franchise Operations',
    label: 'Estimation & Job Bidding',
    description:
      'Square-footage production rates, risk pricing for fragile stones, residential vs. commercial bidding nuances, and maintenance plan upsells.'
  },
  {
    id: 'tech-training-qa',
    pillar: 'B. Franchise Operations',
    label: 'Technician Training & QA',
    description:
      'Hiring traits for craftsmen, apprenticeship milestones, quality-control checklists, and correcting rookie technician errors.'
  },
  {
    id: 'fleet-inventory',
    pillar: 'B. Franchise Operations',
    label: 'Fleet, Inventory & Scheduling',
    description:
      'Van loadouts, chemical shelf-life and reorder thresholds, crew routing, and minimizing downtime on multi-day commercial jobs.'
  },
  {
    id: 'sales-client',
    pillar: 'B. Franchise Operations',
    label: 'Sales, Client Relations & Brand',
    description:
      'Handling price objections, educating clients on stone care to prevent callbacks, and commercial B2B relationship building.'
  }
];

export const DECISION_QUESTIONS: DecisionNode[] = [
  {
    id: 'water_test',
    question: '60-Second Water Drop Test: What happens when water sits on the spot?',
    helpText: 'Tests pore openness vs. topical coating or oil saturation.',
    options: [
      { value: 'absorbs-fast', label: 'Soaks in & darkens within 60s (Open pores)' },
      { value: 'beads-up', label: 'Beads on surface (Sealed or oil-repellent)' },
      { value: 'damp-wicking', label: 'Already dark/cool before wetting (Subfloor moisture)' }
    ]
  },
  {
    id: 'acid_reaction',
    question: 'Texture & Acid Check: How does the defect feel across the surface?',
    helpText: 'Distinguishes chemical calcium dissolution from subsurface staining or tile steps.',
    options: [
      { value: 'dull-smooth-ring', label: 'Rough/matte ring on calcite stone (Acid etch / salt haze)' },
      { value: 'subsurface-discolor', label: 'Smooth glass gloss, discoloration is deep inside pores' },
      { value: 'sharp-tile-edge', label: 'Physical step (>1mm) or chipped tile edges at grout line' }
    ]
  },
  {
    id: 'moisture_check',
    question: 'Tramex Subfloor Moisture Meter Reading:',
    helpText: 'High moisture causes efflorescence haze, iron rusting, and sealer failure.',
    options: [
      { value: 'elevated-moisture', label: 'Elevated (> 3.5% moisture)' },
      { value: 'normal-dry', label: 'Normal / Dry (< 3.0% moisture)' },
      { value: 'not-tested', label: 'Not measured yet' }
    ]
  }
];

export const INITIAL_KNOWLEDGE_ENTRIES: KnowledgeEntry[] = [
  {
    id: 'kb-1',
    shortTitle: 'Cloudy Ring After Honing',
    title: 'Cloudy/Hazy Ring After Honing (Acid Etch / Efflorescence)',
    stoneTag: 'Calacatta & Soft Marbles',
    ringType: 'cloudy-ring',
    surfaceTypes: ['marble', 'limestone', 'travertine'],
    symptomTags: ['White haze', 'Water rings'],
    subDomain: 'surface-diagnostics',
    serviceCategory: 'restoration',
    audience: 'tech',
    difficulty: 'standard',
    status: 'draft',
    reviewNote:
      'SETTLE BEFORE APPROVING: (1) Step 4 uses 5X Oxalic-blend polishing powder (which is mildly acidic) while the Safety Warning states "NEVER use acidic cleaners"—clarify when oxalic polish is permitted vs. acid grout cleaners. (2) Reconcile the two moisture thresholds (4.0% in Step 2 vs. 3.5% in the Safety Warning).',
    rootCause:
      'Calcium carbonate dissolution (chemical acid etch) combined with sub-surface moisture wicking mineral salts (efflorescence) to the freshly opened pore structure during wet honing.',
    steps: [
      'Stop wet honing immediately and vacuum all slurry thoroughly with a wet-vac.',
      'Check moisture meter reading: if > 3.5%, run low-profile air movers for 45 mins before polishing.',
      'Feather out the localized ring using a 400-grit followed by 800-grit resin bond diamond pad with minimal water (damp mist only).',
      'Buff with approved marble polishing compound and a white hogs-hair pad at 175 RPM until reflection is crisp, then flush with neutral water.'
    ],
    safetyWarning:
      'NEVER use acidic grout haze removers or vinegar-based cleaners on Calacatta marble. Do not apply topical wax or non-breathable sealer if subfloor moisture exceeds 3.5%—it will trap vapor and cause spalling.',
    recommendedGrit: '400 -> 800 Resin + Polish Compound',
    estTimeImpact: '+45 mins on site',
    sensoryCues: {
      visual:
        'Hone at 400-grit until the reflection of an overhead bulb at a 45° angle has crisp edges with zero cloudy halo.',
      soundFeel:
        'If the slurry turns chalky-thick rapidly, too much dry heat is building—mist lightly and keep the machine moving.',
      rookieTrap:
        'Rookies try to polish over an etch ring without honing at 400/800 first, which just makes the bottom of the etch shiny while leaving a visible dish.'
    },
    clarifyingSignals: {
      water_test: ['absorbs-fast', 'damp-wicking'],
      acid_reaction: ['dull-smooth-ring'],
      moisture_check: ['elevated-moisture', 'normal-dry']
    },
    keywords: ['cloudy', 'haze', 'ring', 'etch', 'efflorescence', 'calacatta', 'dull', 'water ring'],
    source: 'Seed SOP #104 (Unverified Draft)',
    createdAt: '2026-11-05T10:00:00.000Z',
    updatedAt: '2026-11-05T10:00:00.000Z'
  },
  {
    id: 'kb-2',
    shortTitle: 'Orange Grout Picture-Framing',
    title: 'Orange Picture-Framing Along Grout Lines (Iron Oxidation)',
    stoneTag: 'White Marble & Travertine',
    ringType: 'orange-frame',
    surfaceTypes: ['marble', 'travertine'],
    symptomTags: ['Spalling', 'Water rings', 'Orange rust halo'],
    subDomain: 'stain-taxonomy',
    serviceCategory: 'stain-removal',
    audience: 'tech',
    difficulty: 'advanced',
    status: 'draft',
    reviewNote:
      'Confirm preferred pH-neutral iron-out poultice brand and ventilation protocol before marking Owner-approved.',
    rootCause:
      'Trace ferrous iron deposits (pyrite/marcasite veins) natural to white marble are oxidizing (rusting) due to trapped moisture migrating from wet mud-set beds or high-alkaline bleach cleaners.',
    steps: [
      'Avoid standard acid rust removers—they will severely etch the marble surface.',
      'Mix a specialized pH-neutral Sodium Hydrosulfite iron-out poultice with talc/kaolin clay to a peanut-butter consistency.',
      'Trowel poultice 1/4" thick over the oxidized border, cover with plastic wrap, and tape edges with low-tack painter tape.',
      'Allow 24 hours dwell time to pull iron ions out of the stone matrix, then scrape with plastic putty knife and re-hone at 400-grit.'
    ],
    safetyWarning:
      'Sodium hydrosulfite poultice emits strong sulfur odors—ensure active ventilation and wear nitrile gloves. Warn the Project Manager immediately: iron oxidation requires a 24-hour return visit and cannot be rushed in a single shift.',
    recommendedGrit: 'Neutral Iron Poultice + 400 Resin',
    estTimeImpact: '+24 hr dwell (Requires Return Trip)',
    sensoryCues: {
      visual:
        'Warm amber/orange band parallel to grout joints that stays visible even when the top 0.5mm of stone is honed.',
      soundFeel:
        'Poultice mix should hold peaks like peanut butter—if runny, it will bleed iron deeper into adjacent white veins.',
      rookieTrap:
        'Using hardware-store rust remover (hydrofluoric/phosphoric acid) on white marble, causing permanent chemical craters.'
    },
    clarifyingSignals: {
      water_test: ['damp-wicking', 'absorbs-fast'],
      acid_reaction: ['subsurface-discolor'],
      moisture_check: ['elevated-moisture']
    },
    keywords: ['orange', 'rust', 'iron', 'grout', 'picture framing', 'yellow', 'oxidation', 'poultice'],
    source: 'Seed SOP #219 (Unverified Draft)',
    createdAt: '2026-11-05T10:05:00.000Z',
    updatedAt: '2026-11-05T10:05:00.000Z'
  },
  {
    id: 'kb-3',
    shortTitle: 'Deep Lippage & Chipped Edges',
    title: 'Deep Lippage & Chipped Edges on Marble Tile',
    stoneTag: 'Large Format Stone Tile',
    ringType: 'lippage-chip',
    surfaceTypes: ['marble', 'travertine', 'limestone', 'terrazzo'],
    symptomTags: ['Pitting', 'Spalling', 'Edge chipping'],
    subDomain: 'tooling-grit',
    serviceCategory: 'lippage-repair',
    audience: 'tech',
    difficulty: 'advanced',
    status: 'draft',
    reviewNote:
      'Verify minimum subfloor thickness and whether 50-grit vs 100-grit sintered metal bond is standard for Crew A planetary grinders.',
    rootCause:
      'Uneven subfloor settling or improper mortar coverage causing >1.5mm height differential between adjacent tiles. Running flexible pads over sharp tile steps causes "picture framing" and chips the brittle marble arris.',
    steps: [
      'Clean chipped joint edges with denatured alcohol and blow dry with compressed air.',
      'Color-match knife-grade polyester stone adhesive (mix clear + white + buff tint) and razor-fill chipped edges slightly proud.',
      'Lock rigid aluminum drive plate on planetary grinder with 50-grit or 100-grit sintered metal-bond diamonds to bridge and flatten high tiles.',
      'Cross-hatch grind (North-South then East-West) until flat across grout lines, then step through 200 -> 400 -> 800 -> 1500 resins.'
    ],
    safetyWarning:
      'Do NOT use flexible Velcro backer pads during lippage removal—they follow the wave of the floor and dish out softer veins. Always fill chipped edges BEFORE metal grinding to prevent further spalling of the tile edge.',
    recommendedGrit: 'Polyester Fill + 100 Metal -> 200-1500 Resin',
    estTimeImpact: '+2.0 hrs grinding time',
    sensoryCues: {
      visual:
        'Slide a metal razor blade or nickel across the joint; if it catches hard, flexible resin pads will dish the joint.',
      soundFeel:
        'Listen for the intermittent clack-clack of metal segments hitting high tile corners turning into a steady, even hum once the joint is bridged flat.',
      rookieTrap:
        'Grinding with metal diamonds BEFORE filling chipped edges with polyester resin—the metal segment catches the hollow edge and rips out a larger chip.'
    },
    clarifyingSignals: {
      water_test: ['absorbs-fast', 'beads-up'],
      acid_reaction: ['sharp-tile-edge'],
      moisture_check: ['normal-dry', 'not-tested']
    },
    keywords: ['lippage', 'chip', 'edge', 'step', 'uneven', 'tile', 'grind', 'metal', 'planetary'],
    source: 'Seed SOP #088 (Unverified Draft)',
    createdAt: '2026-11-05T10:10:00.000Z',
    updatedAt: '2026-11-05T10:10:00.000Z'
  },
  {
    id: 'kb-4',
    shortTitle: 'Dark Oil Stain Near Island',
    title: 'Dark Oil Stain Near Kitchen Island (Organic Lipid Intrusion)',
    stoneTag: 'Granite, Quartzite & Honed Stone',
    ringType: 'oil-stain',
    surfaceTypes: ['granite', 'marble', 'limestone', 'travertine'],
    symptomTags: ['Resin bleed', 'Pitting', 'Stain darkening'],
    subDomain: 'stain-taxonomy',
    serviceCategory: 'stain-removal',
    audience: 'tech',
    difficulty: 'standard',
    status: 'draft',
    reviewNote:
      'Confirm whether acetone + diatomaceous earth or pre-mixed oil poultice powder is stocked on vans, and check doctored-dye warning for Absolute Black granite.',
    rootCause:
      'Cooking oils or lipid-based cosmetics have wicked deep into microscopic capillary pores where previous sealer wore thin from harsh dish-soap scrubbing.',
    steps: [
      'Degrease surface first with high-alkaline stone cleaner (pH 11-12) and a stiff nylon brush.',
      'Mix pure Acetone with absorbent Diatomaceous Earth powder into a thick paste.',
      'Apply 3/8" thick extending 1 inch beyond the dark stain halo; cover tightly with polyethylene film and seal edges.',
      'Leave for 16–24 hours so solvent dissolves the oil and powder draws it upward. Remove dry powder, rinse with distilled water, and apply 2 coats of fluorochemical impregnator.'
    ],
    safetyWarning:
      'Acetone poultice is highly flammable! Extinguish all pilot lights on nearby gas ranges and shut off spark igniters before applying near kitchen islands.',
    recommendedGrit: 'Acetone/DE Poultice + Fluorochemical Seal',
    estTimeImpact: '+1.5 hrs prep + overnight pull',
    sensoryCues: {
      visual:
        'Test an inconspicuous spot on Absolute Black granite with acetone on a white rag first—if black pigment transfers, the slab was factory-dyed.',
      soundFeel:
        'Tape plastic wrap edges down firmly, then poke 3 tiny pinholes in the center so solvent vapor can draw oil upward into the diatomaceous earth.',
      rookieTrap:
        'Pulling the poultice off while it is still wet—the oil only migrates out of the stone pores into the powder as the poultice dries completely.'
    },
    clarifyingSignals: {
      water_test: ['beads-up'],
      acid_reaction: ['subsurface-discolor'],
      moisture_check: ['normal-dry']
    },
    keywords: ['oil', 'dark', 'stain', 'grease', 'granite', 'island', 'range', 'acetone', 'poultice'],
    source: 'Seed SOP #312 (Unverified Draft)',
    createdAt: '2026-11-05T10:15:00.000Z',
    updatedAt: '2026-11-05T10:15:00.000Z'
  },
  {
    id: 'kb-5',
    shortTitle: 'Commercial Terrazzo Underbidding Risks',
    title: 'Preventing Labor Blowouts on Commercial Terrazzo & Hotel Lobbies',
    stoneTag: 'Commercial Bidding & Margin',
    surfaceTypes: ['terrazzo', 'travertine', 'marble'],
    symptomTags: ['Pitting', 'White haze'],
    subDomain: 'estimation-bidding',
    serviceCategory: 'bidding',
    audience: 'owner',
    difficulty: 'master-only',
    status: 'approved',
    rootCause:
      'Estimators frequently underbid commercial hallways and hotel lobbies by quoting residential open-floor production rates without accounting for layers of acrylic janitorial wax, night-shift security staging, and blown-out travertine/terrazzo pinholes.',
    steps: [
      'Always test commercial floors with stripper in a 2x2 ft corner during intake to count how many coats of topical acrylic wax are hiding scratches.',
      'Add a 1.25x night-shift labor multiplier for 10 PM – 6 AM hotel/hospital windows due to daily setup/teardown of containment and hoses.',
      'Quote void/pinhole resin filling as a separate line item or add a 20% labor buffer when travertine pockets exceed 10 voids per sq ft.',
      'Present a quarterly high-traffic burnish & reseal maintenance plan alongside the restoration bid to lock in recurring B2B margin.'
    ],
    safetyWarning:
      'Never sign a fixed-price commercial lobby bid without testing for topical wax buildup—stripping 10 years of acrylic finish can add 8+ crew hours before diamonds ever touch the stone.',
    recommendedGrit: 'Wax Strip + 100/200/400/800 Diamond Hone',
    estTimeImpact: '+25% Night-Shift & Wax Strip Buffer',
    keywords: ['underbid', 'commercial', 'terrazzo', 'hotel', 'bid', 'estimate', 'margin', 'wax', 'pricing', 'maintenance'],
    source: 'Owner/GM Approved Playbook',
    createdAt: '2026-11-06T09:00:00.000Z',
    updatedAt: '2026-11-06T09:00:00.000Z'
  },
  {
    id: 'kb-6',
    shortTitle: 'Q2 Zero-Profit P&L Pre-Mortem Check',
    title: 'P&L & Dispatch Pre-Mortem: High Leads, 2 Trucks, Zero Net Profit',
    stoneTag: 'Franchise GM Operations',
    surfaceTypes: ['marble', 'travertine', 'terrazzo', 'granite', 'limestone'],
    symptomTags: [],
    subDomain: 'sales-client',
    serviceCategory: 'operations',
    audience: 'owner',
    difficulty: 'master-only',
    status: 'approved',
    rootCause:
      'When two trucks are fully booked but net profit is flat, the leak is almost always in three places: unbilled callback rework from rookie mistakes, windshield time from poor territory routing, or underpriced lippage grinding.',
    steps: [
      'Check KPI #1 — Revenue Per Billable Tech Hour: Target >= $135/hr. If lower, estimators are throwing in "free" lippage flattening without metal-bond charges.',
      'Check KPI #2 — Callback / Return-Visit Rate: Any unbilled return trip for cloudy sealer or missed etch rings wipes out the margin of two residential jobs.',
      'Check KPI #3 — Daily Billable Grinding Hours vs. Drive Time: Group estimates and multi-day jobs by zip code so crews spend >6.2 hours on the tool per shift.'
    ],
    safetyWarning:
      'Never incentivize technicians purely on speed—pay bonuses on zero-callback QA completion and verified before/after gloss reflection photos.',
    recommendedGrit: 'GM Dispatch & P&L Audit',
    estTimeImpact: 'Quarterly GM Review',
    keywords: ['profit', 'p&l', 'kpi', 'compensation', 'trucks', 'dispatch', 'callback', 'routing', 'owner', 'franchise'],
    source: 'Owner/GM Approved Playbook',
    createdAt: '2026-11-06T09:30:00.000Z',
    updatedAt: '2026-11-06T09:30:00.000Z'
  }
];

import { DiagnosticScenario, EscalationItem, JobRecord } from '@/types/marble';

export const INITIAL_JOBS: JobRecord[] = [
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
    customerNotes:
      'Homeowner is hosting a charity dinner Friday evening. Very sensitive to dust; ensure full zip-wall containment around the grand staircase. Noticed dulling near the front door and faint yellowish rings by the planter.',
    checklist: [
      {
        id: 'c1',
        text: 'Install ZipWall dust containment & mask baseboards',
        done: true,
        role: 'Craftsman'
      },
      {
        id: 'c2',
        text: 'Cut lippage at foyer threshold with 100-grit metal bond',
        done: true,
        role: 'Craftsman'
      },
      {
        id: 'c3',
        text: 'Run 200 -> 400 -> 800 resin diamond honing pass',
        done: false,
        role: 'Craftsman'
      },
      {
        id: 'c4',
        text: 'Apply 5X Oxalic-blend polishing compound & buff',
        done: false,
        role: 'Craftsman'
      },
      {
        id: 'c5',
        text: 'Penetrating fluorochemical sealer application (2 coats)',
        done: false,
        role: 'Craftsman'
      }
    ],
    beforeAfterPhotos: [
      {
        id: 'ba1',
        area: 'Main Entryway Threshold',
        beforeLogged: true,
        afterLogged: false,
        notes: 'Severe traffic wear & 1.5mm tile lippage'
      },
      {
        id: 'ba2',
        area: 'Planter Corner (North Wall)',
        beforeLogged: true,
        afterLogged: false,
        notes: 'Moisture ring & surface etch'
      }
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
    customerNotes:
      'Night-shift work only (10 PM - 6 AM). Facilities manager wants all natural travertine pits color-matched with polyester stone filler before final 400-grit satin hone.',
    checklist: [
      {
        id: 'c201',
        text: 'Deep rotary scrub with alkaline stone cleaner (pH 10)',
        done: true,
        role: 'Craftsman'
      },
      {
        id: 'c202',
        text: 'Trowel fill open travertine voids with custom-tinted Tenax resin',
        done: true,
        role: 'Craftsman'
      },
      {
        id: 'c203',
        text: '200-grit diamond cut to shave cured resin flush',
        done: false,
        role: 'Craftsman'
      },
      {
        id: 'c204',
        text: '400-grit uniform satin hone & matte enhancer seal',
        done: false,
        role: 'Craftsman'
      }
    ],
    beforeAfterPhotos: [
      {
        id: 'ba201',
        area: 'Reception Desk Approach',
        beforeLogged: true,
        afterLogged: true,
        notes: '24 voids filled with custom silver-taupe polyester resin'
      }
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
    customerNotes:
      'Dark cooking oil stain around the Wolf range cutout and dull gray rings where previous cleaner stripped factory topical dye.',
    checklist: [
      {
        id: 'c301',
        text: 'Solvent acetone + diatomaceous earth poultice on oil stain',
        done: false,
        role: 'Craftsman'
      },
      {
        id: 'c302',
        text: 'Silicon carbide antiquing brushes (120 -> 220 -> 320)',
        done: false,
        role: 'Craftsman'
      },
      {
        id: 'c303',
        text: 'Color-enhancing fluoropolymer impregnator application',
        done: false,
        role: 'Craftsman'
      }
    ],
    beforeAfterPhotos: [
      {
        id: 'ba301',
        area: 'Range Cutout Right Side',
        beforeLogged: true,
        afterLogged: false,
        notes: 'Deep olive oil penetration in leathered grain'
      }
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

export const DIAGNOSTIC_SCENARIOS: DiagnosticScenario[] = [
  {
    id: 'diag-1',
    shortTitle: 'Cloudy Ring After Honing',
    fullTitle: 'Cloudy/Hazy Ring After Honing (Acid Etch / Efflorescence)',
    stoneTag: 'Calacatta & Soft Marbles',
    patternColor: 'from-stone-300 via-stone-200 to-stone-400',
    ringType: 'cloudy-ring',
    confidence: '97% Match — KB-SOP #104',
    defaultTags: ['White haze', 'Water rings'],
    rootCause:
      'Calcium carbonate dissolution (chemical acid etch) combined with sub-surface moisture wicking mineral salts (efflorescence) to the freshly opened pore structure during wet honing.',
    crewSteps: [
      'Stop wet honing immediately and vacuum all slurry thoroughly with a wet-vac.',
      'Check moisture meter reading: if > 4.0%, run low-profile air movers for 45 mins before polishing.',
      'Feather out the localized ring using a 400-grit followed by 800-grit resin bond diamond pad with minimal water (damp mist only).',
      'Apply 5X Marble Polishing Compound with a white hogs-hair pad at 175 RPM until slurry turns satin-dry, then flush cleanly.'
    ],
    safetyWarning:
      'NEVER use acidic grout haze removers or vinegar-based cleaners on Calacatta marble. Do not apply topical wax or non-breathable sealer if subfloor moisture exceeds 3.5%—it will trap vapor and cause spalling.',
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
    defaultTags: ['Spalling', 'Water rings', 'Orange rust halo'],
    rootCause:
      'Trace ferrous iron deposits (pyrite/marcasite veins) natural to white marble are oxidizing (rusting) due to trapped moisture migrating from wet mud-set beds or high-alkaline bleach cleaners.',
    crewSteps: [
      'Avoid standard acid rust removers—they will severely etch the marble surface.',
      'Mix a specialized pH-neutral Sodium Hydrosulfite iron-out poultice with talc/kaolin clay to a peanut-butter consistency.',
      'Trowel poultice 1/4" thick over the oxidized border, cover with plastic wrap, and tape edges with low-tack painter tape.',
      'Allow 24 hours dwell time to pull iron ions out of the stone matrix, then scrape with plastic putty knife and re-hone at 400-grit.'
    ],
    safetyWarning:
      'Sodium hydrosulfite poultice emits strong sulfur odors—ensure active ventilation and wear nitrile gloves. Warn the Project Manager immediately: iron oxidation requires a 24-hour return visit and cannot be rushed in a single shift.',
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
    defaultTags: ['Pitting', 'Spalling', 'Edge chipping'],
    rootCause:
      'Uneven subfloor settling or improper mortar coverage causing >1.5mm height differential between adjacent tiles. Running flexible pads over sharp tile steps causes "picture framing" and chips the brittle marble arris.',
    crewSteps: [
      'Clean chipped joint edges with denatured alcohol and blow dry with compressed air.',
      'Color-match knife-grade polyester stone adhesive (mix clear + white + buff tint) and razor-fill chipped edges slightly proud.',
      'Lock rigid aluminum drive plate on planetary grinder with 50-grit or 100-grit sintered metal-bond diamonds to bridge and flatten high tiles.',
      'Cross-hatch grind (North-South then East-West) until flat across grout lines, then step through 200 -> 400 -> 800 -> 1500 resins.'
    ],
    safetyWarning:
      'Do NOT use flexible Velcro backer pads during lippage removal—they follow the wave of the floor and dish out softer veins. Always fill chipped edges BEFORE metal grinding to prevent further spalling of the tile edge.',
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
    defaultTags: ['Resin bleed', 'Pitting', 'Stain darkening'],
    rootCause:
      'Cooking oils or lipid-based cosmetics have wicked deep into microscopic capillary pores where previous sealer wore thin from harsh dish-soap scrubbing.',
    crewSteps: [
      'Degrease surface first with high-alkaline stone cleaner (pH 11-12) and a stiff nylon brush.',
      'Mix pure Acetone (or lacquer thinner) with absorbent Diatomaceous Earth powder into a thick paste.',
      'Apply 3/8" thick extending 1 inch beyond the dark stain halo; cover tightly with polyethylene film and seal edges.',
      'Leave for 16–24 hours so solvent dissolves the oil and powder draws it upward. Remove dry powder, rinse with distilled water, and apply 2 coats of fluorochemical impregnator.'
    ],
    safetyWarning:
      'Acetone poultice is highly flammable! Extinguish all pilot lights on nearby gas ranges and shut off spark igniters before applying near kitchen islands.',
    recommendedGrit: 'Acetone/DE Poultice + Fluorochemical Seal',
    estTimeImpact: '+1.5 hrs prep + overnight pull'
  }
];

export const SYMPTOM_TAGS: string[] = [
  'White haze',
  'Water rings',
  'Spalling',
  'Pitting',
  'Resin bleed',
  'Orange rust halo',
  'Edge chipping',
  'Stain darkening'
];

export const INITIAL_ESCALATIONS: EscalationItem[] = [
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
];

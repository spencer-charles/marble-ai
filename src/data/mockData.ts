import { EscalationItem, JobRecord } from '@/types/marble';

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
      stoneCategory: 'marble',
      type: 'Calacatta Gold Marble (Natural Calcium Carbonate)',
      finish: 'High Polish (Target: 95+ GU Gloss)',
      subfloor: 'Radiant Heated Concrete Slab',
      age: '14 Years',
      moistureReading: '4.2% (Elevated near entryway)',
      moisturePctNumeric: '4.2',
      acidSensitivity: 'Positive - Calcite Fizz (Marble/Travertine)',
      lippage: 'Moderate (1.0 - 2.0mm - Needs Metal Cut)',
      areaSqFt: 1200,
      setting: 'residential',
      containmentRequired: true
    },
    customerNotes:
      'Homeowner is hosting a charity dinner Friday evening. Very sensitive to dust; ensure full zip-wall containment around the grand staircase. Noticed dulling near the front door and faint yellowish rings by the planter.',
    checklist: [
      {
        id: 'c1',
        text: 'Install ZipWall dust containment & mask baseboards',
        done: true,
        role: 'Craftsman',
        loggedOnce: true
      },
      {
        id: 'c2',
        text: 'Cut lippage at foyer threshold with 100-grit metal bond',
        done: true,
        role: 'Craftsman',
        loggedOnce: true
      },
      {
        id: 'c3',
        text: 'Run 200 -> 400 -> 800 resin diamond honing pass',
        done: false,
        role: 'Craftsman'
      },
      {
        id: 'c4',
        text: 'Apply marble polishing compound & buff to crisp reflection',
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
    attachedPhotos: [],
    timeline: [
      {
        id: 't3',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        role: 'Craftsman',
        author: 'Devon Brooks',
        type: 'field-log',
        title: 'Containment Up & 100-Grit Lippage Flatten Done',
        text: 'Masked off staircase and wood transitions. Flattened high corners near entryway. Moving to 200-grit resin pass now.',
        badge: 'Step: 100-Grit Complete'
      },
      {
        id: 't2',
        createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
        role: 'PM',
        author: 'Elena Rostova',
        type: 'dispatch',
        title: 'Crew Dispatched & Chemical Spec Locked',
        text: 'Assigned Devon & Crew A. Loaded 17" planetary grinder, marble polishing powder, and breathable solvent-based sealer onto Truck #3. Reminded crew: NO acidic grout cleaners.',
        badge: 'Spec: Planetary + Polish'
      },
      {
        id: 't1',
        createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
        role: 'Sales',
        author: 'Marcus Vance',
        type: 'intake',
        title: 'Site Intake & Stone Diagnostic Completed',
        text: 'Confirmed genuine Calacatta Gold. Passed sound test (no hollow tiles), but moisture meter hit 4.2% near the planter box. Promised client we would address lippage by the front door and restore mirror polish.',
        badge: 'Acid Test: Positive (Marble)'
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
      stoneCategory: 'travertine',
      type: 'Roman Silver Travertine (Unfilled Voids)',
      finish: 'Satin Matte Hone (400-Grit Target)',
      subfloor: 'Commercial Mud Bed',
      age: '8 Years',
      moistureReading: '2.1% (Normal)',
      moisturePctNumeric: '2.1',
      acidSensitivity: 'Positive - Calcite Fizz (Marble/Travertine)',
      lippage: 'Low (< 0.5mm - Hone & Polish Only)',
      areaSqFt: 3400,
      setting: 'commercial',
      containmentRequired: false
    },
    customerNotes:
      'Night-shift work only (10 PM - 6 AM). Facilities manager wants all natural travertine pits color-matched with polyester stone filler before final 400-grit satin hone.',
    checklist: [
      {
        id: 'c201',
        text: 'Deep rotary scrub with alkaline stone cleaner (pH 10)',
        done: true,
        role: 'Craftsman',
        loggedOnce: true
      },
      {
        id: 'c202',
        text: 'Trowel fill open travertine voids with custom-tinted Tenax resin',
        done: true,
        role: 'Craftsman',
        loggedOnce: true
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
    attachedPhotos: [],
    timeline: [
      {
        id: 't202',
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        role: 'Craftsman',
        author: 'Carlos Mendez',
        type: 'escalation',
        title: 'Field Escalation: Resin Bleed Halo',
        text: 'Spotted dark halo bleeding around filled travertine pockets near the bell desk. Ran KB lookup—moisture trapped in deep pores slowed cure.',
        badge: 'Escalated to PM'
      },
      {
        id: 't201',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
        role: 'Sales',
        author: 'Marcus Vance',
        type: 'intake',
        title: 'Commercial Night-Scope Approved',
        text: 'Counted ~140 blown-out travertine pockets across the main concourse. Sampled custom polyester tint for facilities director approval.',
        badge: 'Tint Match: #Silver-04'
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
    pm: 'Samira Patel',
    leadCraftsman: 'Devon Brooks (Crew A)',
    stoneProfile: {
      stoneCategory: 'granite',
      type: 'Absolute Black Granite (Dense Igneous)',
      finish: 'Leathered / Antiqued Texture',
      subfloor: 'Plywood Countertop Substrate',
      age: '5 Years',
      moistureReading: '1.1% (Dry)',
      moisturePctNumeric: '1.1',
      acidSensitivity: 'Negative - No Reaction (Dense Granite / True Quartzite)',
      lippage: 'Low (< 0.5mm - Hone & Polish Only)',
      areaSqFt: 185,
      setting: 'residential',
      containmentRequired: true
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
    attachedPhotos: [],
    timeline: [
      {
        id: 't301',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
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

export const INITIAL_ESCALATIONS: EscalationItem[] = [
  {
    id: 'esc-1',
    jobId: 'job-1',
    jobTitle: 'Henderson Residence — Calacatta Foyer',
    craftsman: 'Devon Brooks',
    authorRole: 'craftsman',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    issueTitle: 'Cloudy/Hazy Ring After Honing (Acid Etch / Efflorescence)',
    impact: '+45 mins on site',
    recommendedFix: '400 -> 800 Resin + Polish Compound after 45m air-mover dry',
    status: 'Pending PM Approval'
  },
  {
    id: 'esc-2',
    jobId: 'job-2',
    jobTitle: 'Apex Hotel Lobby — Honed Travertine',
    craftsman: 'Carlos Mendez',
    authorRole: 'craftsman',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    issueTitle: 'Resin Bleed Halo Around Filled Voids',
    impact: '+1.5 hrs acetone pull',
    recommendedFix: 'Acetone poultice lift before final 400-grit hone',
    status: 'Approved',
    pmResponseNote: 'Approved 1.5h acetone pull prior to final 400-grit hone.'
  }
];

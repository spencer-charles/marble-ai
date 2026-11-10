import { CapturePrompt } from '@/types/marble';

export const CAPTURE_PROMPTS: CapturePrompt[] = [
  {
    id: 'prompt-1',
    dayIndex: 1,
    style: 'rookie-vs-master',
    styleLabel: 'Rookie vs. Master Contrast',
    subDomain: 'surface-diagnostics',
    prompt:
      'If a brand-new technician walked onto a marble foyer job site, what cue would they completely miss in the first 30 seconds that you spot immediately?',
    followUpHint:
      'Think about lighting angles, transition strips, planter moisture, or acid vs. coating wear.',
    defaultAudience: 'tech'
  },
  {
    id: 'prompt-2',
    dayIndex: 2,
    style: 'sensory-proxy',
    styleLabel: 'Sight / Sound / Feel Proxy',
    subDomain: 'tooling-grit',
    prompt:
      'How does the sound or vibration of the floor machine change when your diamond resin pads are glazed over or when the slurry is too dry?',
    followUpHint:
      'Describe the exact sound, handle chatter, and visual slurry color so a crew tech knows when to dress the diamonds or add water.',
    defaultAudience: 'tech'
  },
  {
    id: 'prompt-3',
    dayIndex: 3,
    style: 'pre-mortem',
    styleLabel: 'Business Pre-Mortem',
    subDomain: 'estimation-bidding',
    prompt:
      'Where do estimators most often accidentally underbid a residential marble shower or a commercial travertine lobby?',
    followUpHint:
      'Mention hidden labor traps like soap-scum calcification, corner hand-tooling hours, or blown-out travertine voids.',
    defaultAudience: 'owner'
  },
  {
    id: 'prompt-4',
    dayIndex: 4,
    style: 'sensory-proxy',
    styleLabel: 'Sight / Sound / Feel Proxy',
    subDomain: 'edge-cases',
    prompt:
      'When honing soft dark marble (like Emperador or Nero Marquina), what is the earliest visual sign that you are about to "burn" or orange-peel the stone?',
    followUpHint:
      'Explain how to read the 45-degree overhead light reflection and how to recover if a burn mark happens.',
    defaultAudience: 'tech'
  },
  {
    id: 'prompt-5',
    dayIndex: 5,
    style: 'rookie-vs-master',
    styleLabel: 'Rookie vs. Master Contrast',
    subDomain: 'tech-training-qa',
    prompt:
      'What is the #1 mistake new technicians make when applying penetrating sealer at the end of a long shift, and how do you train them to prevent callbacks?',
    followUpHint:
      'Cover slab moisture limits, dwell time before buffing dry, and checking for streaky residue.',
    defaultAudience: 'tech'
  },
  {
    id: 'prompt-6',
    dayIndex: 6,
    style: 'pre-mortem',
    styleLabel: 'Business Pre-Mortem',
    subDomain: 'fleet-inventory',
    prompt:
      'What single missing or expired item on a van causes the most expensive mid-job delays, and what is your weekly van loadout rule?',
    followUpHint:
      'Consider polyester tint shelf life, backup drive plates, wet-vac squeegee blades, or ZipWall poles.',
    defaultAudience: 'owner'
  }
];

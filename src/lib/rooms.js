export const ROOMS = [
  {
    id: 'build',
    num: '01',
    verb: 'COMMISSION',
    title: 'Custom Build',
    path: '/build',
    color: '#DFDACE',
    text: '#23282A',
    transitionType: 'split-assemble',
    foot: 'Tailored websites, tools & software.',
    blurb: 'Have something designed or built specifically for your needs.',
  },
  {
    id: 'blueprints',
    num: '02',
    verb: 'SHOWROOM',
    title: 'Blueprints',
    path: '/blueprints',
    color: '#17504A',
    text: '#EDE9E0',
    transitionType: 'showroom-unfold',
    foot: 'Ready-made templates, Figma kits & systems.',
    blurb: 'Ready-made websites, creative tools, and reusable systems.',
  },
  {
    id: 'work',
    num: '03',
    verb: 'INSPECT',
    title: 'Selected Work',
    path: '/work',
    color: '#2C3335',
    text: '#EDE9E0',
    transitionType: 'shutter-x',
    foot: 'Client builds, case studies & demos.',
    blurb: 'Explore completed projects, case studies, and demonstrations.',
  },
  {
    id: 'lab',
    num: '04',
    verb: 'EXPERIMENT',
    title: 'The Lab',
    path: '/lab',
    color: '#D9A62E',
    text: '#1A1E1F',
    transitionType: 'aperture-y',
    foot: 'Experiments, R&D & live instruments.',
    blurb: 'Explore experiments, ideas, and unconventional applications.',
  },
];

export const METHOD_ROOM = {
  id: 'method',
  num: 'METHOD',
  verb: 'CONNECT',
  title: 'The Method',
  path: '/method',
  color: '#17504A',
  text: '#EDE9E0',
  transitionType: 'stage-cascade',
  foot: 'How I work, scope & pricing.',
  blurb:
    'How I connect design and engineering around the actual problem—with clear scope, upfront pricing, and ways to engage.',
};

export const ALL_ROOMS = [...ROOMS, METHOD_ROOM];

export const roomById = (id) => ALL_ROOMS.find((r) => r.id === id);

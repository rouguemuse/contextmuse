import { PROJECTS } from '@/data/projects';

export const WORK = PROJECTS.map((p) => ({
  ...p,
  kicker: p.title,
  reel: p.palette || ['#23282A', '#DFDACE', '#D9A62E', '#17504A'],
}));

export { PROJECTS };

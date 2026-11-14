const SHAFT = 'M16 42h104v34H16z';
const HEAD = 'M104 16l80 43-80 43z';

export default function PosterArrow({ ink = '#23282A', accent = '#D9A62E' }) {
  return (
    <svg viewBox="0 0 200 120" className="h-full w-full" aria-hidden="true">
      <g transform="rotate(-12 100 60) translate(5 6)" fill={accent}>
        <path d={SHAFT} />
        <path d={HEAD} />
      </g>
      <g transform="rotate(-12 100 60)" fill={ink}>
        <path d={SHAFT} />
        <path d={HEAD} />
      </g>
    </svg>
  );
}
import { Link } from 'react-router-dom';

const SQUARES = ['#123F38', '#2B7C72', '#A9CFC7', '#D9A62E'];

export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="ContextMuse — home"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="grid shrink-0 grid-cols-2 gap-[2px]">
        {SQUARES.map((c) => (
          <span key={c} className="block h-[7px] w-[7px]" style={{ backgroundColor: c }} />
        ))}
      </span>
      <span className="font-display text-[15px] font-extrabold leading-none tracking-[-0.035em] lowercase">
        contextmuse<span className="align-super text-[8px] font-medium">®</span>
      </span>
    </Link>
  );
}
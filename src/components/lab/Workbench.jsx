import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const TOOLS = [
  { label: 'Contrast pocket', href: '#lab-contrast', note: 'Try colour pairs with a live ratio.' },
  { label: 'Scope signal', href: '#lab-scope', note: 'Explore the shape of a website.' },
  { label: 'Discovery prompts', href: '#lab-prompts', note: 'A small set of useful questions.' },
];

export default function Workbench() {
  return (
    <div className="mt-6">
      <div className="flex items-end justify-between gap-3 border-b border-[#23282A]/25 pb-2.5">
        <h2 className="stretch font-display text-lg font-extrabold uppercase tracking-[-0.03em]">
          From the workbench
        </h2>
        <span className="eyebrow t-faint">Tools — 03</span>
      </div>

      <div className="grid gap-px bg-[#23282A]/25 sm:grid-cols-2 lg:grid-cols-4">
        {TOOLS.map((tool) => (
          <a
            key={tool.href}
            href={tool.href}
            className="group flex min-h-[110px] flex-col justify-between bg-[#EFE3BE] p-3.5 transition-colors duration-300 hover:bg-[#23282A] hover:text-[#EFE3BE]"
          >
            <span className="flex items-start justify-between gap-2">
              <span className="font-display text-[13.5px] font-extrabold uppercase leading-tight tracking-[-0.02em]">
                {tool.label}
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
            <span className="mt-3 text-[11.5px] leading-snug opacity-70">{tool.note}</span>
          </a>
        ))}

        <Link
          to="/build"
          className="group flex min-h-[110px] flex-col justify-between bg-[#17504A] p-3.5 text-[#EFE3BE] transition-colors duration-300 hover:bg-[#123F38]"
        >
          <span className="flex items-start justify-between gap-2">
            <span className="font-display text-[13.5px] font-extrabold uppercase leading-tight tracking-[-0.02em]">
              Open the board
            </span>
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
          <span className="mt-3 text-[11.5px] leading-snug opacity-80">
            Take a question into Custom Builds.
          </span>
        </Link>
      </div>
    </div>
  );
}
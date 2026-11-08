export default function LabPanel({ id, num, kicker, title, note, children }) {
  return (
    <section id={id} className="notch flex h-full flex-col border border-[#23282A]/25 bg-[#EFE3BE] p-4 text-[#23282A] transition-transform duration-500 ease-out hover:-translate-y-[2px] sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="eyebrow">
          {num} / {kicker}
        </span>
        <span className="eyebrow t-faint">Live</span>
      </div>

      <h2 className="stretch mt-3 font-display text-[clamp(1.25rem,2.4vw,1.7rem)] font-extrabold uppercase leading-[0.95] tracking-[-0.035em]">
        {title}
      </h2>
      {note && <p className="mt-2 max-w-[42ch] text-[12px] leading-relaxed t-muted">{note}</p>}

      <div className="mt-4 flex flex-1 flex-col">{children}</div>
    </section>
  );
}
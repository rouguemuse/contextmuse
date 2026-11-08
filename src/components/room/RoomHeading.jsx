export default function RoomHeading({ num, verb, badge, title, sub, watermark, children }) {
  return (
    <div className="relative border-b t-line pb-5">
      <div className="relative z-10 flex flex-wrap items-center gap-3">
        <span className="eyebrow">
          {num} / {verb}
        </span>
        {badge && <span className="eyebrow border t-line-2 px-2 py-1 t-muted">{badge}</span>}
      </div>

      <h1 className="stretch relative z-10 mt-4 font-display text-[clamp(2.2rem,5.8vw,4.9rem)] font-black uppercase leading-[0.84] tracking-[-0.055em]">
        {title}
      </h1>

      {sub && (
        <p className="relative z-10 mt-3 max-w-[56ch] text-[13.5px] leading-relaxed t-muted sm:text-[14px]">
          {sub}
        </p>
      )}

      {children}

      {watermark && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 select-none font-display text-[clamp(3rem,8vw,6rem)] font-medium leading-[0.8] t-faint"
        >
          {watermark}
        </span>
      )}
    </div>
  );
}
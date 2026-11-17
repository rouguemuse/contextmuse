export default function RoomHeading({
  num,
  verb,
  badge,
  title,
  sub,
  watermark,
  accentColor,
  children,
}) {
  return (
    <div className="relative border-b t-line pb-4 sm:pb-7">
      <div className="relative z-10 flex flex-wrap items-center gap-2 sm:gap-3">
        <span className="eyebrow inline-flex items-center gap-2 font-semibold">
          {accentColor && (
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 shrink-0"
              style={{ backgroundColor: accentColor }}
            />
          )}
          <span>
            {num} / {verb}
          </span>
        </span>
        {badge && (
          <span className="eyebrow border t-line px-2 py-0.5 t-muted">
            {badge}
          </span>
        )}
      </div>

      <h1 className="stretch relative z-10 mt-2.5 sm:mt-4 font-display text-[clamp(1.95rem,5.6vw,4.9rem)] font-black uppercase leading-[0.88] tracking-[-0.05em]">
        {title}
      </h1>

      {sub && (
        <p className="relative z-10 mt-2.5 sm:mt-3.5 max-w-[62ch] text-[13.5px] leading-relaxed t-muted sm:text-[15px]">
          {sub}
        </p>
      )}

      {children}

      {watermark && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 select-none font-display text-[clamp(2.25rem,7vw,6rem)] font-medium leading-[0.8] opacity-15 sm:opacity-20"
          style={accentColor ? { color: accentColor } : undefined}
        >
          {watermark}
        </span>
      )}
    </div>
  );
}
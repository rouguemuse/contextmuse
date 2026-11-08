import { LIBRARY, PIECE_MIME } from '@/components/builds/buildLibrary';
import UiPiece from '@/components/builds/UiPiece';
import PosterArrow from '@/components/builds/PosterArrow';

function Thumb({ item }) {
  const scale = 52 / item.w;
  return (
    <span className="relative block h-9 w-[52px] shrink-0 overflow-hidden bg-[#E9E4D7]">
      <span
        className="absolute left-0 top-0 block origin-top-left"
        style={{ width: item.w, height: item.h, transform: `scale(${scale})` }}
      >
        {item.kind === 'arrow' ? <PosterArrow /> : <UiPiece variant={item.variant} />}
      </span>
    </span>
  );
}

export default function BoardLibrary({ onPlace }) {
  return (
    <div className="border border-[#23282A]/20 bg-[#C9C3B2]">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 border-b border-[#23282A]/15 px-2.5 py-1.5">
        <span className="eyebrow">Parts bin</span>
        <span className="eyebrow t-faint">Drag onto the board — or click to drop one in</span>
      </div>

      <div className="no-scrollbar flex gap-px overflow-x-auto bg-[#23282A]/20 p-px">
        {LIBRARY.map((item) => (
          <button
            key={item.variant}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(PIECE_MIME, JSON.stringify(item));
              e.dataTransfer.effectAllowed = 'copy';
            }}
            onClick={() => onPlace(item)}
            title={`${item.label} — drag onto the board`}
            className="group flex min-w-[88px] flex-1 cursor-grab flex-col gap-1.5 bg-[#C9C3B2] px-2 py-2 text-left transition-colors duration-200 hover:bg-bone active:cursor-grabbing"
          >
            <Thumb item={item} />
            <span className="text-[9px] uppercase leading-tight tracking-[0.12em] text-[#23282A]/65 group-hover:text-[#23282A]">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
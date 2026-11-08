import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function BoardReview({ open, pieces, links, onClose }) {
  const pages = pieces.filter((p) => p.type === 'page');
  const stickers = pieces.filter((p) => p.type === 'cta');
  const notes = pieces.filter((p) => p.type === 'note');
  const shots = pieces.filter((p) => p.type === 'shot');
  const texts = pieces.filter((p) => p.type === 'text');
  const linksOnBoard = pieces.filter((p) => p.type === 'link');
  const components = pieces.filter((p) => p.type === 'ui');
  const marks = pieces.filter((p) => p.type === 'shape' || p.type === 'arrow');
  const highlighted = pieces.filter((p) => p.highlight);
  const orphanStickers = stickers.filter((p) => !p.parentId);
  const lonelyPages = pages.filter((p) => !pieces.some((q) => q.parentId === p.id));

  const checks = [
    [pages.length > 0, 'The board has page frames'],
    [orphanStickers.length === 0, 'Every CTA sticker is attached to a page'],
    [links.length > 0, 'Pieces are connected to each other'],
    [highlighted.length > 0, 'Something is marked as important'],
    [lonelyPages.length === 0, 'Every page has a next step on it'],
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[88] flex items-end justify-end bg-[#171B1C]/60 p-0 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[86vh] w-full overflow-auto border border-line bg-ink p-5 text-bone sm:max-w-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="eyebrow t-faint">Board review</span>
                <h3 className="stretch mt-1 font-display text-2xl font-extrabold uppercase tracking-[-0.04em]">
                  What&apos;s in the room
                </h3>
              </div>
              <button onClick={onClose} aria-label="Close review" className="border border-line p-1.5 hover:text-mustard">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-px bg-white/15">
              {[
                ['Pages', pages.length],
                ['Notes', notes.length],
                ['Ideas', texts.length],
                ['CTA stickers', stickers.length],
                ['Screenshots', shots.length],
                ['Links', linksOnBoard.length],
                ['Components', components.length],
                ['Annotations', marks.length],
                ['Connections', links.length],
                ['Highlighted', highlighted.length],
              ].map(([label, value]) => (
                <div key={label} className="bg-ink px-3 py-2.5">
                  <div className="stretch font-display text-xl font-extrabold leading-none text-mustard">
                    {String(value).padStart(2, '0')}
                  </div>
                  <div className="eyebrow mt-1 t-faint">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-5 border-t border-line pt-4">
              <span className="eyebrow t-faint">Read of the board</span>
              <ul className="mt-3 space-y-2">
                {checks.map(([ok, label]) => (
                  <li key={label} className="flex items-start gap-2 text-[12.5px]">
                    <span
                      className="mt-[5px] inline-block h-[7px] w-[7px] shrink-0"
                      style={{ backgroundColor: ok ? '#D9A62E' : 'rgba(237,233,224,0.25)' }}
                    />
                    <span className={ok ? '' : 't-faint'}>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-5 border-t border-line pt-3 text-[11px] leading-relaxed t-faint">
              Saved locally in your browser so you can sketch freely before sharing your brief.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
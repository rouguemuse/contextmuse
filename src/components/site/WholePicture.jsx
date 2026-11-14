import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, X } from 'lucide-react';
import { ROOMS } from '@/lib/rooms';
import { useTransitionCoordinator } from '@/lib/TransitionContext';
import SiteFooter from '@/components/site/SiteFooter';

export default function WholePicture({ open, onClose }) {
  const navigate = useNavigate();
  const { startTransition } = useTransitionCoordinator();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          className="fixed inset-0 z-[90] flex flex-col bg-ink text-bone"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3 sm:px-6">
            <span className="eyebrow t-muted">Index — four rooms</span>
            <button
              onClick={onClose}
              className="flex items-center gap-2 border border-line px-2.5 py-1.5 text-[11px] transition-colors duration-300 hover:border-mustard hover:text-mustard"
            >
              Close <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto px-4 py-8 sm:px-8 sm:py-12">
            <div className="mx-auto w-full max-w-5xl">
              <p className="eyebrow text-mustard">One connected practice</p>
              <h2 className="stretch mt-4 font-display text-[clamp(2rem,5.5vw,4.5rem)] font-extrabold uppercase leading-[0.85] tracking-[-0.045em]">
                Four ways in.<br />The whole picture.
              </h2>

              <div className="mt-10 border-t border-line">
                {ROOMS.map((room) => (
                  <button
                    key={room.id}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      onClose();
                      startTransition(room, rect, navigate);
                    }}
                    className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line py-5 text-left transition-colors duration-300 hover:bg-white/[0.04]"
                  >
                    <span
                      className="eyebrow flex h-10 w-10 items-center justify-center"
                      style={{ backgroundColor: room.color, color: room.text }}
                    >
                      {room.num}
                    </span>
                    <span>
                      <span className="eyebrow block t-faint">{room.verb}</span>
                      <span className="mt-1 block font-display text-xl font-extrabold uppercase tracking-[-0.03em] sm:text-2xl">
                        {room.title}
                      </span>
                      <span className="mt-1 block text-[13px] t-muted">{room.blurb}</span>
                    </span>
                    <ArrowUpRight className="h-4 w-4 t-faint transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-mustard" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <SiteFooter />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
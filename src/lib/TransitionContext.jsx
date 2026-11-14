import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const TransitionContext = createContext({
  isTransitioning: false,
  activeRoomId: null,
  transitionType: null,
  startTransition: () => {},
});

export const useTransitionCoordinator = () => useContext(TransitionContext);

const EASE_SHUTTER = [0.22, 1, 0.36, 1];
const EASE_MECHANICAL = [0.65, 0, 0.35, 1];
const METHOD_STAGES = ['01 OBSERVE', '02 EXTRACT', '03 EVALUATE', '04 TRANSFORM', '05 EVOLVE'];

/**
 * Room 01 — 01 / INSPECT (The Work)
 * Horizontal editorial focal-plane shutter: sweeps left-to-right to cover,
 * then releases left-to-right from the right edge to reveal the dossier room.
 */
function WorkShutterTransition({ room, phase }) {
  const isEntering = phase === 'entering';
  return (
    <div
      data-testid="room-transition-overlay"
      data-transition-room={room.id}
      data-transition-type="shutter-x"
      data-transition-phase={phase}
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
    >
      <motion.div
        className="relative h-full w-full flex items-center justify-between px-8 sm:px-16"
        style={{
          backgroundColor: '#2C3335',
          color: '#EDE9E0',
          transformOrigin: isEntering ? 'left center' : 'right center',
          willChange: 'transform',
        }}
        initial={{ scaleX: isEntering ? 0 : 1 }}
        animate={{ scaleX: isEntering ? 1 : 0 }}
        transition={{ duration: 0.28, ease: EASE_SHUTTER }}
      >
        <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-[#EDE9E0]/80">
          <span className="text-[#D9A62E] font-bold">{room.num}</span>
          <span>/</span>
          <span>{room.verb}</span>
          <span className="hidden sm:inline text-[#EDE9E0]/40">— {room.title}</span>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[3px] bg-[#D9A62E]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[2px] bg-[#D9A62E]/60"
        />
      </motion.div>
    </div>
  );
}

/**
 * Room 02 — 02 / ASSEMBLE (Custom Builds)
 * Bilateral architectural drafting doors: left and right blueprint planes
 * slide inward horizontally to lock at the center seam, then part outward.
 */
function BuildAssembleTransition({ room, phase }) {
  const isEntering = phase === 'entering';
  return (
    <div
      data-testid="room-transition-overlay"
      data-transition-room={room.id}
      data-transition-type="split-assemble"
      data-transition-phase={phase}
      className="pointer-events-none fixed inset-0 z-[100] flex overflow-hidden"
    >
      {/* Left Drafting Plane */}
      <motion.div
        className="relative h-full w-1/2 flex items-center justify-end pr-6 sm:pr-10 border-r border-[#17504A]/40"
        style={{
          backgroundColor: '#DFDACE',
          color: '#23282A',
          willChange: 'transform',
        }}
        initial={{ x: isEntering ? '-100%' : '0%' }}
        animate={{ x: isEntering ? '0%' : '-100%' }}
        transition={{ duration: 0.28, ease: EASE_MECHANICAL }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-[#23282A]/75">
          {room.num} / {room.verb}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-[2px] bg-[#17504A]"
        />
      </motion.div>

      {/* Right Drafting Plane */}
      <motion.div
        className="relative h-full w-1/2 flex items-center justify-start pl-6 sm:pl-10 border-l border-[#17504A]/40"
        style={{
          backgroundColor: '#DFDACE',
          color: '#23282A',
          willChange: 'transform',
        }}
        initial={{ x: isEntering ? '100%' : '0%' }}
        animate={{ x: isEntering ? '0%' : '100%' }}
        transition={{ duration: 0.28, ease: EASE_MECHANICAL }}
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold text-[#17504A]">
          {room.title}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[2px] bg-[#D9A62E]"
        />
      </motion.div>
    </div>
  );
}

/**
 * Room 03 — 03 / EXPERIMENT (The Lab)
 * Precision optical instrument aperture: upper and lower calibration shutters
 * converge onto the horizontal center horizon with a #D9A62E gold calibration beam,
 * then retract symmetrically toward top and bottom.
 */
function LabApertureTransition({ room, phase }) {
  const isEntering = phase === 'entering';
  return (
    <div
      data-testid="room-transition-overlay"
      data-transition-room={room.id}
      data-transition-type="aperture-y"
      data-transition-phase={phase}
      className="pointer-events-none fixed inset-0 z-[100] flex flex-col overflow-hidden"
    >
      {/* Top Calibration Shutter */}
      <motion.div
        className="relative h-1/2 w-full flex items-end justify-between px-8 pb-4"
        style={{
          backgroundColor: '#1A1E1F',
          color: '#EDE9E0',
          willChange: 'transform',
        }}
        initial={{ y: isEntering ? '-100%' : '0%' }}
        animate={{ y: isEntering ? '0%' : '-100%' }}
        transition={{ duration: 0.28, ease: EASE_MECHANICAL }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#D9A62E] font-bold">
          {room.num} / {room.verb}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#EDE9E0]/60">
          INSTRUMENT CALIBRATION
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-0 inset-x-0 h-[2px] bg-[#D9A62E]"
        />
      </motion.div>

      {/* Bottom Calibration Shutter */}
      <motion.div
        className="relative h-1/2 w-full flex items-start justify-between px-8 pt-4"
        style={{
          backgroundColor: '#1A1E1F',
          color: '#EDE9E0',
          willChange: 'transform',
        }}
        initial={{ y: isEntering ? '100%' : '0%' }}
        animate={{ y: isEntering ? '0%' : '100%' }}
        transition={{ duration: 0.28, ease: EASE_MECHANICAL }}
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#EDE9E0]/85 font-bold">
          {room.title}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D9A62E]">
          LIVE PROTOTYPES
        </span>
        <span
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[2px] bg-[#D9A62E]"
        />
      </motion.div>
    </div>
  );
}

/**
 * Room 04 — 04 / CONNECT (The Method)
 * Five-stage connected horizontal column cascade: five vertical architectural louvers
 * (representing Observe, Extract, Evaluate, Transform, Evolve) wipe across in a
 * staggered left-to-right sequence and release in wave order.
 */
function MethodCascadeTransition({ room, phase }) {
  const isEntering = phase === 'entering';
  return (
    <div
      data-testid="room-transition-overlay"
      data-transition-room={room.id}
      data-transition-type="stage-cascade"
      data-transition-phase={phase}
      className="pointer-events-none fixed inset-0 z-[100] grid grid-cols-5 overflow-hidden"
    >
      {METHOD_STAGES.map((stageLabel, idx) => (
        <motion.div
          key={stageLabel}
          className="relative h-full w-full flex flex-col justify-between p-4 sm:p-6 border-r border-[#EDE9E0]/15"
          style={{
            backgroundColor: '#17504A',
            color: '#EDE9E0',
            transformOrigin: isEntering ? 'left center' : 'right center',
            willChange: 'transform',
          }}
          initial={{ scaleX: isEntering ? 0 : 1 }}
          animate={{ scaleX: isEntering ? 1 : 0 }}
          transition={{
            duration: 0.2,
            delay: idx * 0.018,
            ease: EASE_SHUTTER,
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#D9A62E] font-bold">
            {idx === 0 ? `${room.num} / ${room.verb}` : `STAGE 0${idx + 1}`}
          </span>
          <span className="hidden sm:block font-mono text-[10px] uppercase tracking-[0.16em] text-[#EDE9E0]/75">
            {stageLabel}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeFold, setActiveFold] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'entering' | 'revealing'
  const timersRef = useRef([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => clearTimeout(id));
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const startTransition = useCallback(
    (room, rect, navigate) => {
      if (!room || !navigate) return;
      if (isTransitioning) return;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReducedMotion) {
        setIsTransitioning(true);
        navigate(room.path);
        const id = setTimeout(() => {
          setIsTransitioning(false);
        }, 120);
        timersRef.current.push(id);
        return;
      }

      clearTimers();
      setIsTransitioning(true);
      setActiveFold({
        room,
        rect: rect || null,
        transitionType: room.transitionType || 'shutter-x',
      });
      setPhase('entering');

      // Stage 1: Cover completes at ~290ms -> swap route while viewport is 100% covered
      const swapTimer = setTimeout(() => {
        navigate(room.path);

        // Hold coverage for 45ms so the destination room DOM & ScrollToTop paint cleanly behind the curtain
        const revealTimer = setTimeout(() => {
          setPhase('revealing');

          // Stage 2: Reveal completes -> return to idle
          const doneTimer = setTimeout(() => {
            setPhase('idle');
            setActiveFold(null);
            setIsTransitioning(false);
          }, 340);
          timersRef.current.push(doneTimer);
        }, 45);
        timersRef.current.push(revealTimer);
      }, 295);

      timersRef.current.push(swapTimer);
    },
    [isTransitioning, clearTimers]
  );

  const renderRoomTransition = () => {
    if (!activeFold || phase === 'idle') return null;
    const { room } = activeFold;

    switch (room.id) {
      case 'work':
        return <WorkShutterTransition room={room} phase={phase} />;
      case 'build':
        return <BuildAssembleTransition room={room} phase={phase} />;
      case 'lab':
        return <LabApertureTransition room={room} phase={phase} />;
      case 'method':
        return <MethodCascadeTransition room={room} phase={phase} />;
      default:
        return <WorkShutterTransition room={room} phase={phase} />;
    }
  };

  return (
    <TransitionContext.Provider
      value={{
        isTransitioning,
        activeRoomId: activeFold?.room?.id || null,
        transitionType: activeFold?.transitionType || null,
        startTransition,
      }}
    >
      {children}
      {renderRoomTransition()}
    </TransitionContext.Provider>
  );
}

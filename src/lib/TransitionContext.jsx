import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EASE } from '@/lib/motion';

const TransitionContext = createContext({
  isTransitioning: false,
  startTransition: () => {},
});

export const useTransitionCoordinator = () => useContext(TransitionContext);

export function TransitionProvider({ children }) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeFold, setActiveFold] = useState(null);
  const [phase, setPhase] = useState('idle'); // 'idle' | 'expanding' | 'settling'
  const navCallbackRef = useRef(null);

  const startTransition = useCallback((room, rect, navigate) => {
    // Prevent overlapping transitions during rapid repeated clicks
    if (isTransitioning) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !rect) {
      setIsTransitioning(true);
      navigate(room.path);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 150);
      return;
    }

    const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

    navCallbackRef.current = navigate;
    setIsTransitioning(true);
    setActiveFold({
      room,
      rect,
      vw,
      vh,
    });
    setPhase('expanding');
  }, [isTransitioning]);

  const handleExpansionComplete = () => {
    if (navCallbackRef.current && activeFold?.room?.path) {
      navCallbackRef.current(activeFold.room.path);
    }
    // Switch to settling phase: overlay fades out smoothly over the mounted destination room
    setPhase('settling');
  };

  const handleSettlingComplete = () => {
    setPhase('idle');
    setActiveFold(null);
    setIsTransitioning(false);
    navCallbackRef.current = null;
  };

  return (
    <TransitionContext.Provider value={{ isTransitioning, startTransition }}>
      {children}

      {/* Single Coordinated Overlay at App Root */}
      <AnimatePresence>
        {activeFold && phase !== 'idle' && (
          <motion.div
            key="app-transition-overlay"
            className="pointer-events-none fixed inset-0 z-[100]"
            style={{
              backgroundColor: activeFold.room.color,
              transformOrigin: 'top left',
              willChange: 'transform, opacity',
            }}
            initial={
              phase === 'expanding'
                ? {
                    x: Math.max(0, activeFold.rect.left),
                    y: Math.max(0, activeFold.rect.top),
                    scaleX: Math.min(1, Math.max(activeFold.rect.width / activeFold.vw, 0.02)),
                    scaleY: Math.min(1, Math.max(activeFold.rect.height / activeFold.vh, 0.02)),
                    opacity: 1,
                  }
                : { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }
            }
            animate={
              phase === 'expanding'
                ? { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 }
                : { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 0 }
            }
            transition={
              phase === 'expanding'
                ? { duration: 0.44, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.28, ease: 'easeOut' }
            }
            onAnimationComplete={() => {
              if (phase === 'expanding') {
                handleExpansionComplete();
              } else if (phase === 'settling') {
                handleSettlingComplete();
              }
            }}
          />
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

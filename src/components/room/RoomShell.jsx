import React from 'react';
import { motion } from 'framer-motion';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';
import PageAnnotationOverlay from '@/components/site/PageAnnotationOverlay';

export default function RoomShell({
  room,
  children,
  canvasBg,
  canvasText,
  accentBarColor,
}) {
  const bg = canvasBg || room.color;
  const fg = canvasText || room.text;

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ backgroundColor: bg, color: fg }}
    >
      <SiteHeader />

      {accentBarColor && (
        <div
          aria-hidden="true"
          className="h-1.5 w-full shrink-0"
          style={{ backgroundColor: accentBarColor }}
        />
      )}

      <main
        className="flex flex-1 flex-col min-w-0"
        style={{ backgroundColor: bg }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 flex-1 flex flex-col"
          style={{ backgroundColor: bg, color: fg }}
        >
          {children}
        </motion.div>
      </main>

      <PageAnnotationOverlay />
      <SiteFooter />
    </div>
  );
}

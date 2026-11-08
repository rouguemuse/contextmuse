import React from 'react';
import { motion } from 'framer-motion';
import SiteHeader from '@/components/site/SiteHeader';
import SiteFooter from '@/components/site/SiteFooter';

export default function RoomShell({ room, children }) {
  return (
    <div
      className="flex min-h-screen flex-col text-[#EDE9E0]"
      style={{ backgroundColor: room.color }}
    >
      <SiteHeader />

      <main
        className="flex flex-1 flex-col min-w-0"
        style={{ backgroundColor: room.color }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 flex-1 flex flex-col"
          style={{ backgroundColor: room.color, color: room.text }}
        >
          {children}
        </motion.div>
      </main>

      <SiteFooter />
    </div>
  );
}

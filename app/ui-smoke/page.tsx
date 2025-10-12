'use client';

import { motion } from 'framer-motion';
// If you really want to sanity-import recharts, do it via dynamic import (see Option B)
// import dynamic from 'next/dynamic';

export default function UiSmoke() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">UI Smoke</h1>
      <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg">
        Primary Button
      </button>
      <div className="bg-card text-card-foreground border border-border rounded-lg p-4">
        Card sample
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-lg border border-border p-3"
      >
        Framer-motion works in a client component.
      </motion.div>
    </div>
  );
}

"use client"

import { Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

export function GlobalLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-[60vh]"
    >
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground">Loading data...</p>
      </div>
    </motion.div>
  )
}

"use client";

import { motion, AnimatePresence } from "motion/react";
import { Info } from "lucide-react";

export function ExplanationCard({
  title,
  text,
  stepKey,
}: {
  title: string;
  text: string;
  stepKey: string;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
      >
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <Info className="size-4 text-fd-primary/60" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-medium text-white/80 mb-1">{title}</h4>
            <p className="text-xs text-white/40 leading-relaxed">{text}</p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

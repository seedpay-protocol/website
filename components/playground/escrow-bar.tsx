"use client";

import { motion } from "motion/react";

export function EscrowBar({
  deposit,
  paid,
  visible,
}: {
  deposit: number;
  paid: number;
  visible: boolean;
}) {
  if (!visible) return null;

  const paidPct = deposit > 0 ? Math.min((paid / deposit) * 100, 100) : 0;
  const remaining = Math.max(deposit - paid, 0);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.4 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
          Escrow Channel
        </span>
        <span className="text-[10px] font-mono text-white/30">
          {deposit.toFixed(2)} USDC deposited
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-white/[0.04] overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500/70 to-emerald-400/70"
          initial={{ width: "0%" }}
          animate={{ width: `${paidPct}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] font-mono text-emerald-400/60">
          Paid: ${paid.toFixed(4)}
        </span>
        <span className="text-[10px] font-mono text-sky-400/60">
          Remaining: ${remaining.toFixed(4)}
        </span>
      </div>
    </motion.div>
  );
}

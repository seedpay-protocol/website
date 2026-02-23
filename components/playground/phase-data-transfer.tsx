"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PenLine, Square, AlertTriangle } from "lucide-react";
import type {
  SubStep,
  PlaygroundAction,
  TransferState,
  ChannelState,
} from "./playground-types";
import { ExplanationCard } from "./explanation-card";
import { explanations, CHECK_INTERVAL_MB, PRICE_PER_MB } from "./playground-data";

export function PhaseDataTransfer({
  subStep,
  transfer,
  channel,
  dispatch,
}: {
  subStep: SubStep;
  transfer: TransferState;
  channel: ChannelState;
  dispatch: React.Dispatch<PlaygroundAction>;
}) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const explanation = explanations[subStep] ?? explanations["dt:transferring"];

  // Transfer ticks
  useEffect(() => {
    if (transfer.isChoked) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      dispatch({ type: "TRANSFER_TICK" });
    }, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [transfer.isChoked, dispatch]);

  const checkUrgency = transfer.mbSinceLastCheck / CHECK_INTERVAL_MB;
  const needsCheck = subStep === "dt:check-required" || subStep === "dt:choked";

  return (
    <div className="space-y-5">
      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1">
            Downloaded
          </div>
          <div className="text-base font-mono text-sky-400/80">
            {transfer.mbDownloaded.toFixed(0)} MB
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1">
            Total Paid
          </div>
          <div className="text-base font-mono text-emerald-400/80">
            ${transfer.totalCost.toFixed(4)}
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1">
            Checks Sent
          </div>
          <div className="text-base font-mono text-white/60">
            {transfer.lastCheckNonce}
          </div>
        </div>
        <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
          <div className="text-[9px] font-mono text-white/20 uppercase tracking-wider mb-1">
            Rate
          </div>
          <div className="text-base font-mono text-white/60">
            ${PRICE_PER_MB}/MB
          </div>
        </div>
      </div>

      {/* Payment check progress indicator */}
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] font-mono text-white/20 uppercase tracking-wider">
            MB since last check
          </span>
          <span
            className={`text-[9px] font-mono ${
              checkUrgency >= 1 ? "text-red-400/70" : checkUrgency >= 0.7 ? "text-amber-400/70" : "text-white/30"
            }`}
          >
            {transfer.mbSinceLastCheck.toFixed(0)} / {CHECK_INTERVAL_MB} MB
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
          <motion.div
            className={`h-full rounded-full transition-colors ${
              checkUrgency >= 1
                ? "bg-red-500/60"
                : checkUrgency >= 0.7
                  ? "bg-amber-500/60"
                  : "bg-emerald-500/40"
            }`}
            animate={{ width: `${Math.min(checkUrgency * 100, 100)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Warning if check required or choked */}
      <AnimatePresence>
        {needsCheck && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              subStep === "dt:choked"
                ? "border-red-500/30 bg-red-500/5"
                : "border-amber-500/30 bg-amber-500/5"
            }`}
          >
            <AlertTriangle
              className={`size-3 shrink-0 ${
                subStep === "dt:choked" ? "text-red-400/70" : "text-amber-400/70"
              }`}
            />
            <span
              className={`text-[10px] font-mono ${
                subStep === "dt:choked" ? "text-red-400/60" : "text-amber-400/60"
              }`}
            >
              {subStep === "dt:choked"
                ? "Connection choked! Sign a payment check to resume."
                : "Seeder requires a payment check!"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      <ExplanationCard
        title={explanation.title}
        text={explanation.text}
        stepKey={subStep}
      />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <motion.button
          onClick={() => dispatch({ type: "SEND_PAYMENT_CHECK" })}
          animate={
            needsCheck
              ? {
                  boxShadow: [
                    "0 0 0 0 rgba(52,211,153,0)",
                    "0 0 0 8px rgba(52,211,153,0.2)",
                    "0 0 0 0 rgba(52,211,153,0)",
                  ],
                }
              : {}
          }
          transition={needsCheck ? { duration: 1.5, repeat: Infinity } : {}}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
            needsCheck
              ? "bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400"
              : "bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white/70"
          }`}
        >
          <PenLine className="size-3" />
          Sign Payment Check
        </motion.button>

        <motion.button
          onClick={() => dispatch({ type: "CLOSE_CHANNEL" })}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-mono text-white/40 hover:text-white/60 transition-all"
        >
          <Square className="size-3" />
          Close Channel
        </motion.button>
      </div>
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, X, Loader2, ScanSearch } from "lucide-react";
import type { SubStep, PlaygroundAction, ChannelState } from "./playground-types";
import { ExplanationCard } from "./explanation-card";
import { explanations } from "./playground-data";

const verifySteps: { step: SubStep; label: string; detail: string }[] = [
  { step: "vf:querying", label: "Query Blockchain", detail: "RPC getAccountInfo" },
  { step: "vf:check-state", label: "Channel State", detail: "Open + wallet match" },
  { step: "vf:check-deposit", label: "Deposit Amount", detail: "≥ min_prepayment" },
  { step: "vf:check-token", label: "Token & Chain", detail: "USDC on Solana" },
  { step: "vf:check-session", label: "Session Binding", detail: "SHA-256(UUID) match" },
  { step: "vf:check-freshness", label: "Freshness", detail: "< 10 min old" },
  { step: "vf:confirmed", label: "Confirmed", detail: "All checks passed" },
];

function stepStatus(current: SubStep, target: SubStep): "done" | "active" | "pending" {
  const order = verifySteps.map((s) => s.step);
  const ci = order.indexOf(current);
  const ti = order.indexOf(target);
  if (ci > ti) return "done";
  if (ci === ti) return "active";
  return "pending";
}

function CheckIcon({ status }: { status: "done" | "active" | "pending" }) {
  if (status === "done") {
    return (
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="size-5 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center"
      >
        <Check className="size-2.5 text-emerald-400" />
      </motion.div>
    );
  }
  if (status === "active") {
    return (
      <div className="size-5 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center">
        <Loader2 className="size-2.5 text-white/50 animate-spin" />
      </div>
    );
  }
  return (
    <div className="size-5 rounded-full border border-white/[0.06] flex items-center justify-center">
      <div className="size-1.5 rounded-full bg-white/10" />
    </div>
  );
}

export function PhaseVerification({
  subStep,
  channel,
  dispatch,
}: {
  subStep: SubStep;
  channel: ChannelState;
  dispatch: React.Dispatch<PlaygroundAction>;
}) {
  const explanation = explanations[subStep] ?? explanations["vf:querying"];

  return (
    <div className="space-y-5">
      {/* Seeder-centric badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 w-fit">
        <ScanSearch className="size-3 text-emerald-400/60" />
        <span className="text-[10px] font-mono text-emerald-400/60">
          Seeder verifying on-chain...
        </span>
      </div>

      {/* Verification checklist */}
      <div className="space-y-1">
        {verifySteps.map((s) => {
          const status = stepStatus(subStep, s.step);
          return (
            <motion.div
              key={s.step}
              layout
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 ${
                status === "active" ? "bg-white/[0.03]" : ""
              }`}
            >
              <CheckIcon status={status} />
              <div className="flex-1 min-w-0">
                <span
                  className={`text-xs font-mono transition-colors duration-500 ${
                    status === "done"
                      ? "text-white/50"
                      : status === "active"
                        ? "text-white/80"
                        : "text-white/15"
                  }`}
                >
                  {s.label}
                </span>
                {(status === "active" || status === "done") && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[9px] font-mono text-white/25 mt-0.5"
                  >
                    {s.detail}
                  </motion.div>
                )}
              </div>
              {status === "done" && s.step !== "vf:querying" && s.step !== "vf:confirmed" && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[9px] font-mono text-emerald-400/40 bg-emerald-500/5 px-1.5 py-0.5 rounded"
                >
                  PASS
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Channel info badge */}
      <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
        <div className="grid grid-cols-2 gap-3 text-[10px] font-mono">
          <div>
            <span className="text-white/20">Channel</span>
            <div className="text-white/50 mt-0.5">{channel.channelId}</div>
          </div>
          <div>
            <span className="text-white/20">Deposit</span>
            <div className="text-emerald-400/60 mt-0.5">{channel.deposit.toFixed(2)} USDC</div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <ExplanationCard
        title={explanation.title}
        text={explanation.text}
        stepKey={subStep}
      />

      {/* Next button */}
      {subStep !== "vf:confirmed" ? (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-mono text-white/70 transition-all"
        >
          Run Next Check
          <ArrowRight className="size-3" />
        </motion.button>
      ) : (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono text-emerald-400 transition-all"
        >
          Start Data Transfer
          <ArrowRight className="size-3" />
        </motion.button>
      )}
    </div>
  );
}

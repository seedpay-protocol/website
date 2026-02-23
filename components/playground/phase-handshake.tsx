"use client";

import { motion, AnimatePresence } from "motion/react";
import { Handshake, ArrowRight, Check } from "lucide-react";
import type { SubStep, PlaygroundAction } from "./playground-types";
import { ExplanationCard } from "./explanation-card";
import { explanations } from "./playground-data";

const handshakeSteps: { step: SubStep; label: string }[] = [
  { step: "hs:bt-handshake", label: "BT Handshake Exchanged" },
  { step: "hs:seeder-extended", label: "Seeder Extended Handshake" },
  { step: "hs:leecher-extended", label: "Leecher Extended Handshake" },
  { step: "hs:capability-detected", label: "SeedPay Negotiated" },
];

function stepStatus(
  current: SubStep,
  target: SubStep,
): "done" | "active" | "pending" {
  const order = handshakeSteps.map((s) => s.step);
  const ci = order.indexOf(current);
  const ti = order.indexOf(target);
  if (ci > ti) return "done";
  if (ci === ti) return "active";
  return "pending";
}

export function PhaseHandshake({
  subStep,
  dispatch,
}: {
  subStep: SubStep;
  dispatch: React.Dispatch<PlaygroundAction>;
}) {
  const explanation = explanations[subStep] ?? explanations["hs:bt-handshake"];

  return (
    <div className="space-y-5">
      {/* Sub-step checklist */}
      <div className="space-y-1">
        {handshakeSteps.map((s, i) => {
          const status = stepStatus(subStep, s.step);
          return (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.3 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-400 ${
                status === "active" ? "bg-white/[0.04]" : ""
              }`}
            >
              <div className="relative shrink-0">
                <div
                  className={`size-5 rounded-full border flex items-center justify-center text-[9px] font-mono transition-all duration-500 ${
                    status === "done"
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : status === "active"
                        ? "border-white/25 bg-white/[0.06] text-white/60"
                        : "border-white/[0.08] text-white/15"
                  }`}
                >
                  {status === "done" ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Check className="size-2.5" />
                    </motion.span>
                  ) : (
                    i + 1
                  )}
                </div>
                {status === "active" && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white/10"
                    animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </div>
              <span
                className={`text-xs font-mono transition-colors duration-500 ${
                  status === "done"
                    ? "text-white/40"
                    : status === "active"
                      ? "text-white/80"
                      : "text-white/15"
                }`}
              >
                {s.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Explanation */}
      <ExplanationCard
        title={explanation.title}
        text={explanation.text}
        stepKey={subStep}
      />

      {/* Next button */}
      <AnimatePresence mode="wait">
        {subStep !== "hs:capability-detected" ? (
          <motion.button
            key="next"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: "NEXT_STEP" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-mono text-white/70 transition-all"
          >
            Next Step
            <ArrowRight className="size-3" />
          </motion.button>
        ) : (
          <motion.button
            key="proceed"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: "NEXT_STEP" })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono text-emerald-400 transition-all"
          >
            <Handshake className="size-3" />
            Begin Channel Setup
            <ArrowRight className="size-3" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

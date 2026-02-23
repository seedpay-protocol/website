"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";
import { phaseConfig } from "./playground-data";
import type { Phase } from "./playground-types";

const phaseOrder: Phase[] = [
  "handshake",
  "channel-setup",
  "verification",
  "data-transfer",
  "closing",
];

function getStatus(
  stepPhase: Phase,
  currentPhase: Phase,
): "done" | "active" | "pending" {
  const currentIdx = phaseOrder.indexOf(currentPhase);
  const stepIdx = phaseOrder.indexOf(stepPhase);

  // closed means everything is done
  if (currentPhase === "closed") return "done";
  if (currentPhase === "idle") return "pending";

  if (stepIdx < currentIdx) return "done";
  if (stepIdx === currentIdx) return "active";
  // closing phase also marks data-transfer as done
  if (currentPhase === "closing" && stepPhase === "data-transfer") return "done";
  return "pending";
}

export function PhaseStepper({ currentPhase }: { currentPhase: Phase }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
      {phaseConfig.map((step, i) => {
        const status = getStatus(step.key, currentPhase);
        return (
          <div key={step.key} className="flex items-center shrink-0">
            {i > 0 && (
              <div
                className={cn(
                  "w-6 h-px mx-1 transition-colors duration-500",
                  status === "done" || status === "active"
                    ? "bg-emerald-500/30"
                    : "bg-white/[0.06]",
                )}
              />
            )}
            <div
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-400",
                status === "active" && "bg-white/[0.04]",
              )}
            >
              <div className="relative">
                <div
                  className={cn(
                    "size-6 rounded-full border flex items-center justify-center text-[10px] font-mono transition-all duration-500",
                    status === "done" &&
                      "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
                    status === "active" &&
                      "border-white/25 bg-white/[0.06] text-white/70",
                    status === "pending" && "border-white/[0.08] text-white/15",
                  )}
                >
                  {status === "done" ? (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Check className="size-3" />
                    </motion.span>
                  ) : (
                    step.number
                  )}
                </div>
                {status === "active" && (
                  <motion.div
                    className="absolute inset-0 rounded-full border border-white/15"
                    animate={{ scale: [1, 1.6], opacity: [0.4, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                  />
                )}
              </div>
              <span
                className={cn(
                  "text-[11px] font-mono whitespace-nowrap transition-colors duration-500",
                  status === "done" && "text-white/40",
                  status === "active" && "text-white/70",
                  status === "pending" && "text-white/15",
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { motion } from "motion/react";
import { ArrowRight, Check, RotateCcw, Loader2 } from "lucide-react";
import type {
  SubStep,
  PlaygroundAction,
  TransferState,
  ChannelState,
} from "./playground-types";
import { ExplanationCard } from "./explanation-card";
import { explanations } from "./playground-data";

export function PhaseClose({
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
  const explanation = explanations[subStep] ?? explanations["cl:tx-submitted"];
  const refund = Math.max(channel.deposit - transfer.totalCost, 0);

  return (
    <div className="space-y-5">
      {/* Close status */}
      <div className="space-y-2">
        {/* Tx submitted */}
        <div
          className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
            subStep === "cl:tx-submitted" ? "bg-fd-accent" : ""
          }`}
        >
          {subStep === "cl:tx-submitted" ? (
            <Loader2 className="size-4 text-fd-muted-foreground animate-spin" />
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Check className="size-4 text-emerald-400" />
            </motion.div>
          )}
          <span
            className={`text-xs font-mono ${
              subStep === "cl:tx-submitted" ? "text-fd-foreground/60" : "text-fd-muted-foreground"
            }`}
          >
            Close Transaction{" "}
            {subStep === "cl:tx-submitted" ? "Pending..." : "Confirmed"}
          </span>
        </div>

        {/* Settlement */}
        {(subStep === "cl:settled" || subStep === "cl:closed") && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
          >
            <Check className="size-4 text-emerald-400" />
            <span className="text-xs font-mono text-fd-muted-foreground">Settlement Complete</span>
          </motion.div>
        )}

        {subStep === "cl:closed" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg"
          >
            <Check className="size-4 text-emerald-400" />
            <span className="text-xs font-mono text-fd-muted-foreground">Channel Closed</span>
          </motion.div>
        )}
      </div>

      {/* Settlement summary card */}
      {(subStep === "cl:settled" || subStep === "cl:closed") && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 space-y-3"
        >
          <h4 className="text-xs font-mono text-emerald-400/60 uppercase tracking-wider">
            Final Settlement
          </h4>
          <div className="grid grid-cols-2 gap-3 text-sm font-mono">
            <div>
              <div className="text-[9px] text-fd-muted-foreground/40 uppercase mb-1">
                Data Transferred
              </div>
              <div className="text-sky-400/70">
                {transfer.mbDownloaded.toFixed(0)} MB
              </div>
            </div>
            <div>
              <div className="text-[9px] text-fd-muted-foreground/40 uppercase mb-1">
                Total Paid
              </div>
              <div className="text-emerald-400/70">
                ${transfer.totalCost.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-fd-muted-foreground/40 uppercase mb-1">
                Seeder Received
              </div>
              <div className="text-emerald-400/70">
                ${transfer.totalCost.toFixed(4)}
              </div>
            </div>
            <div>
              <div className="text-[9px] text-fd-muted-foreground/40 uppercase mb-1">
                Leecher Refunded
              </div>
              <div className="text-sky-400/70">${refund.toFixed(4)}</div>
            </div>
          </div>
          <div className="pt-2 border-t border-fd-border text-[9px] font-mono text-fd-muted-foreground/40">
            On-chain transactions: 2 (open + close) &bull; Off-chain checks:{" "}
            {transfer.lastCheckNonce}
          </div>
        </motion.div>
      )}

      {/* Explanation */}
      <ExplanationCard
        title={explanation.title}
        text={explanation.text}
        stepKey={subStep}
      />

      {/* Action buttons */}
      {subStep === "cl:tx-submitted" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fd-muted hover:bg-fd-accent border border-fd-border text-xs font-mono text-fd-foreground/70 transition-all"
        >
          Confirm Settlement
          <ArrowRight className="size-3" />
        </motion.button>
      )}
      {subStep === "cl:settled" && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fd-muted hover:bg-fd-accent border border-fd-border text-xs font-mono text-fd-foreground/70 transition-all"
        >
          Finalize Close
          <ArrowRight className="size-3" />
        </motion.button>
      )}
      {subStep === "cl:closed" && (
        <motion.button
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => dispatch({ type: "RESET" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-fd-primary/10 hover:bg-fd-primary/20 border border-fd-primary/30 text-xs font-mono text-fd-primary transition-all"
        >
          <RotateCcw className="size-3" />
          Start Over
        </motion.button>
      )}
    </div>
  );
}

"use client";

import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, ArrowRight } from "lucide-react";
import { usePlaygroundState } from "./use-playground-state";
import { PhaseStepper } from "./phase-stepper";
import { PeerVisualization } from "./peer-visualization";
import { PhaseHandshake } from "./phase-handshake";
import { PhaseChannelSetup } from "./phase-channel-setup";
import { PhaseVerification } from "./phase-verification";
import { PhaseDataTransfer } from "./phase-data-transfer";
import { PhaseClose } from "./phase-close";
import { MessageLog } from "./message-log";
import { EscrowBar } from "./escrow-bar";
import { ExplanationCard } from "./explanation-card";
import { explanations } from "./playground-data";

export function PlaygroundClient() {
  const [state, dispatch] = usePlaygroundState();

  const showEscrow =
    state.channel.status !== "none" &&
    state.phase !== "idle" &&
    state.phase !== "handshake";

  return (
    <div className="min-h-screen text-fd-foreground">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Protocol Playground
            </h1>
            <p className="text-sm text-fd-muted-foreground mt-1">
              Step through the complete SeedPay protocol interactively.
            </p>
          </div>
          {state.phase !== "idle" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => dispatch({ type: "RESET" })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-fd-muted hover:bg-fd-accent border border-fd-border text-xs font-mono text-fd-muted-foreground hover:text-fd-foreground transition-all shrink-0"
            >
              <RotateCcw className="size-3" />
              Reset
            </motion.button>
          )}
        </div>

        {/* Terminal-style container */}
        <div className="rounded-2xl border border-fd-border bg-fd-card backdrop-blur-xl overflow-hidden">
          {/* macOS traffic lights header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-fd-border">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <span className="ml-3 text-[11px] text-fd-muted-foreground/50 font-mono tracking-wider">
              seedpay://playground
            </span>
          </div>

          <div className="p-5 space-y-5">
            {/* Phase stepper */}
            {state.phase !== "idle" && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PhaseStepper currentPhase={state.phase} />
              </motion.div>
            )}

            {/* Peer visualization */}
            <PeerVisualization
              phase={state.phase}
              isChoked={state.transfer.isChoked}
            />

            {/* Main content: interactive panel + message log */}
            <div className="grid lg:grid-cols-[55%_1fr] gap-5">
              {/* Left: Interactive panel */}
              <div className="min-w-0">
                <AnimatePresence mode="wait">
                  {state.phase === "idle" && (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <ExplanationCard
                        title={explanations.idle.title}
                        text={explanations.idle.text}
                        stepKey="idle"
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => dispatch({ type: "NEXT_STEP" })}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-fd-primary/10 hover:bg-fd-primary/20 border border-fd-primary/30 text-sm font-mono text-fd-primary transition-all"
                      >
                        Begin Handshake
                        <ArrowRight className="size-4" />
                      </motion.button>
                    </motion.div>
                  )}

                  {state.phase === "handshake" && (
                    <motion.div
                      key="handshake"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PhaseHandshake
                        subStep={state.subStep}
                        dispatch={dispatch}
                      />
                    </motion.div>
                  )}

                  {state.phase === "channel-setup" && (
                    <motion.div
                      key="channel-setup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PhaseChannelSetup
                        subStep={state.subStep}
                        crypto={state.crypto}
                        channel={state.channel}
                        dispatch={dispatch}
                      />
                    </motion.div>
                  )}

                  {state.phase === "verification" && (
                    <motion.div
                      key="verification"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PhaseVerification
                        subStep={state.subStep}
                        channel={state.channel}
                        dispatch={dispatch}
                      />
                    </motion.div>
                  )}

                  {state.phase === "data-transfer" && (
                    <motion.div
                      key="data-transfer"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PhaseDataTransfer
                        subStep={state.subStep}
                        transfer={state.transfer}
                        channel={state.channel}
                        dispatch={dispatch}
                      />
                    </motion.div>
                  )}

                  {(state.phase === "closing" || state.phase === "closed") && (
                    <motion.div
                      key="closing"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.35 }}
                    >
                      <PhaseClose
                        subStep={state.subStep}
                        transfer={state.transfer}
                        channel={state.channel}
                        dispatch={dispatch}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: Message log */}
              <div className="min-w-0 lg:min-h-[400px]">
                <MessageLog messages={state.messages} />
              </div>
            </div>

            {/* Escrow bar */}
            <EscrowBar
              deposit={state.channel.deposit}
              paid={state.transfer.totalCost}
              visible={showEscrow}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

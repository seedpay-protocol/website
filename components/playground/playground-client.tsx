"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RotateCcw,
  ArrowRight,
  Play,
  Pause,
  Settings2,
  Zap,
  DollarSign,
  Gauge,
  Timer,
} from "lucide-react";
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
import { explanations, scenarios, DEFAULT_CONFIG } from "./playground-data";
import type { PlaygroundConfig, ScenarioId } from "./playground-types";

const scenarioColors: Record<string, { bg: string; border: string; text: string; activeBg: string }> = {
  emerald: { bg: "bg-emerald-500/5", border: "border-emerald-500/20", text: "text-emerald-400", activeBg: "bg-emerald-500/15" },
  amber: { bg: "bg-amber-500/5", border: "border-amber-500/20", text: "text-amber-400", activeBg: "bg-amber-500/15" },
  purple: { bg: "bg-purple-500/5", border: "border-purple-500/20", text: "text-purple-400", activeBg: "bg-purple-500/15" },
  sky: { bg: "bg-sky-500/5", border: "border-sky-500/20", text: "text-sky-400", activeBg: "bg-sky-500/15" },
  neutral: { bg: "bg-fd-muted/50", border: "border-fd-border", text: "text-fd-muted-foreground", activeBg: "bg-fd-accent" },
};

const speedOptions = [0.5, 1, 2, 4];

function ConfigPanel({
  config,
  onChange,
}: {
  config: PlaygroundConfig;
  onChange: (updates: Partial<PlaygroundConfig>) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="rounded-xl border border-fd-border bg-fd-card p-4 space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-mono text-fd-muted-foreground/60 uppercase tracking-wider mb-2">
            <DollarSign className="size-3" />
            Deposit (USDC)
          </label>
          <input
            type="range"
            min={0.01}
            max={50}
            step={0.01}
            value={config.deposit}
            onChange={(e) => onChange({ deposit: parseFloat(e.target.value) })}
            className="w-full accent-emerald-500 h-1.5 bg-fd-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400"
          />
          <div className="text-xs font-mono text-fd-foreground/60 mt-1">{config.deposit.toFixed(2)}</div>
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-mono text-fd-muted-foreground/60 uppercase tracking-wider mb-2">
            <Gauge className="size-3" />
            Price/MB (USDC)
          </label>
          <input
            type="range"
            min={0.00001}
            max={0.01}
            step={0.00001}
            value={config.pricePerMb}
            onChange={(e) => onChange({ pricePerMb: parseFloat(e.target.value) })}
            className="w-full accent-sky-500 h-1.5 bg-fd-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-400"
          />
          <div className="text-xs font-mono text-fd-foreground/60 mt-1">${config.pricePerMb.toFixed(5)}</div>
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-mono text-fd-muted-foreground/60 uppercase tracking-wider mb-2">
            <Timer className="size-3" />
            Check Interval (MB)
          </label>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={config.checkIntervalMb}
            onChange={(e) => onChange({ checkIntervalMb: parseInt(e.target.value) })}
            className="w-full accent-amber-500 h-1.5 bg-fd-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400"
          />
          <div className="text-xs font-mono text-fd-foreground/60 mt-1">{config.checkIntervalMb} MB</div>
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-[10px] font-mono text-fd-muted-foreground/60 uppercase tracking-wider mb-2">
            <Zap className="size-3" />
            Transfer Speed (MB/tick)
          </label>
          <input
            type="range"
            min={1}
            max={25}
            step={1}
            value={config.transferSpeedMb}
            onChange={(e) => onChange({ transferSpeedMb: parseInt(e.target.value) })}
            className="w-full accent-purple-500 h-1.5 bg-fd-muted rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-400"
          />
          <div className="text-xs font-mono text-fd-foreground/60 mt-1">{config.transferSpeedMb} MB</div>
        </div>
      </div>
      <div className="text-[9px] font-mono text-fd-muted-foreground/40 pt-2 border-t border-fd-border">
        Max downloadable: ~{Math.floor(config.deposit / config.pricePerMb).toLocaleString()} MB
        &bull; Checks before exhaustion: ~{Math.floor(config.deposit / (config.pricePerMb * config.checkIntervalMb))}
      </div>
    </motion.div>
  );
}

export function PlaygroundClient() {
  const [state, dispatch] = usePlaygroundState();
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>("happy-path");
  const [showConfig, setShowConfig] = useState(false);
  const [customConfig, setCustomConfig] = useState<PlaygroundConfig>({ ...DEFAULT_CONFIG });
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-play logic
  useEffect(() => {
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
      autoPlayRef.current = null;
    }

    if (!state.config.autoPlay || state.phase === "idle" || state.phase === "closed") return;

    const baseDelay = 1200;
    const delay = baseDelay / state.config.autoPlaySpeed;

    autoPlayRef.current = setInterval(() => {
      const { phase, subStep } = state;

      if (phase === "data-transfer") {
        if (subStep === "dt:check-required" || subStep === "dt:choked") {
          dispatch({ type: "SEND_PAYMENT_CHECK" });
        }
        // Transfer ticks are handled by PhaseDataTransfer's own interval
        return;
      }

      if (phase === "closing" || phase === "closed") {
        dispatch({ type: "NEXT_STEP" });
        return;
      }

      // Skip the deposit slider in auto-play
      dispatch({ type: "NEXT_STEP" });
    }, delay);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [state.config.autoPlay, state.config.autoPlaySpeed, state.phase, state.subStep, dispatch, state]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        const { phase, subStep } = state;

        if (phase === "data-transfer") {
          if (subStep === "dt:check-required" || subStep === "dt:choked") {
            dispatch({ type: "SEND_PAYMENT_CHECK" });
          } else {
            dispatch({ type: "CLOSE_CHANNEL" });
          }
        } else if (phase === "closed") {
          dispatch({ type: "RESET" });
        } else {
          dispatch({ type: "NEXT_STEP" });
        }
      }

      if (e.key === "ArrowLeft" || e.key === "Backspace") {
        if (state.phase !== "idle") {
          e.preventDefault();
          dispatch({ type: "RESET" });
        }
      }
    },
    [state, dispatch],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const showEscrow =
    state.channel.status !== "none" &&
    state.phase !== "idle" &&
    state.phase !== "handshake";

  const handleSelectScenario = (id: ScenarioId) => {
    setSelectedScenario(id);
    const scenario = scenarios.find((s) => s.id === id);
    if (scenario && id !== "custom") {
      setCustomConfig({
        ...DEFAULT_CONFIG,
        ...scenario.config,
      });
    }
  };

  const handleStart = () => {
    const config = selectedScenario === "custom"
      ? customConfig
      : { ...DEFAULT_CONFIG, ...scenarios.find((s) => s.id === selectedScenario)?.config };
    dispatch({ type: "SELECT_SCENARIO", scenarioId: selectedScenario, config });
    // Start by advancing to first step
    setTimeout(() => dispatch({ type: "NEXT_STEP" }), 50);
  };

  const handleStartWithAutoPlay = () => {
    const config = selectedScenario === "custom"
      ? { ...customConfig, autoPlay: true, autoPlaySpeed: 1 }
      : { ...DEFAULT_CONFIG, ...scenarios.find((s) => s.id === selectedScenario)?.config, autoPlay: true, autoPlaySpeed: 1 };
    dispatch({ type: "SELECT_SCENARIO", scenarioId: selectedScenario, config });
    setTimeout(() => dispatch({ type: "NEXT_STEP" }), 50);
  };

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
              {state.phase === "idle"
                ? "Choose a scenario and explore how SeedPay works interactively."
                : "Step through the complete SeedPay protocol interactively."}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Auto-play controls */}
            {state.phase !== "idle" && state.phase !== "closed" && (
              <div className="flex items-center gap-1">
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => dispatch({ type: "TOGGLE_AUTO_PLAY" })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                    state.config.autoPlay
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-fd-muted border-fd-border text-fd-muted-foreground hover:text-fd-foreground"
                  }`}
                >
                  {state.config.autoPlay ? (
                    <><Pause className="size-3" /> Pause</>
                  ) : (
                    <><Play className="size-3" /> Auto</>
                  )}
                </motion.button>
                {state.config.autoPlay && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    className="flex items-center gap-0.5"
                  >
                    {speedOptions.map((speed) => (
                      <button
                        key={speed}
                        onClick={() => dispatch({ type: "SET_AUTO_PLAY_SPEED", speed })}
                        className={`px-1.5 py-1 rounded text-[10px] font-mono transition-colors ${
                          state.config.autoPlaySpeed === speed
                            ? "bg-fd-accent text-fd-foreground"
                            : "text-fd-muted-foreground/50 hover:text-fd-muted-foreground"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
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
              {state.scenarioId && state.phase !== "idle" && (
                <span className="ml-2 text-fd-muted-foreground/30">
                  [{scenarios.find((s) => s.id === state.scenarioId)?.name}]
                </span>
              )}
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
                        title="Choose a Scenario"
                        text="Pick a preset to see different protocol behaviors, or create a custom configuration. Each scenario changes the deposit, pricing, and transfer parameters."
                        stepKey="scenario-select"
                      />

                      {/* Scenario cards */}
                      <div className="grid gap-2">
                        {scenarios.map((scenario) => {
                          const colors = scenarioColors[scenario.color];
                          const isSelected = selectedScenario === scenario.id;
                          return (
                            <motion.button
                              key={scenario.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => handleSelectScenario(scenario.id)}
                              className={`text-left rounded-xl border p-3 transition-all ${
                                isSelected
                                  ? `${colors.activeBg} ${colors.border} ring-1 ring-inset ${colors.border}`
                                  : `${colors.bg} ${colors.border} hover:${colors.activeBg}`
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`size-2 rounded-full ${isSelected ? colors.text.replace("text-", "bg-") : "bg-fd-muted-foreground/30"}`} />
                                <span className={`text-xs font-mono font-medium ${isSelected ? colors.text : "text-fd-foreground/70"}`}>
                                  {scenario.name}
                                </span>
                                {scenario.id !== "custom" && (
                                  <span className="text-[9px] font-mono text-fd-muted-foreground/40 ml-auto">
                                    ${scenario.config.pricePerMb}/MB &bull; {scenario.config.deposit} USDC
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-fd-muted-foreground/60 leading-relaxed pl-4">
                                {scenario.description}
                              </p>
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Config toggle for custom */}
                      {selectedScenario === "custom" && (
                        <div className="space-y-2">
                          <button
                            onClick={() => setShowConfig(!showConfig)}
                            className="flex items-center gap-1.5 text-[10px] font-mono text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                          >
                            <Settings2 className="size-3" />
                            {showConfig ? "Hide" : "Show"} Configuration
                          </button>
                          <AnimatePresence>
                            {showConfig && (
                              <ConfigPanel
                                config={customConfig}
                                onChange={(updates) =>
                                  setCustomConfig((prev) => ({ ...prev, ...updates }))
                                }
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                      {/* Start buttons */}
                      <div className="flex flex-wrap gap-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleStart}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-fd-primary/10 hover:bg-fd-primary/20 border border-fd-primary/30 text-sm font-mono text-fd-primary transition-all"
                        >
                          Step Through
                          <ArrowRight className="size-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleStartWithAutoPlay}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-sm font-mono text-emerald-400 transition-all"
                        >
                          <Play className="size-4" />
                          Auto Play
                        </motion.button>
                      </div>
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
                        checkIntervalMb={state.config.checkIntervalMb}
                        pricePerMb={state.config.pricePerMb}
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

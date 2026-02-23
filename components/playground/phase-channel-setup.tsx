"use client";

import { motion, AnimatePresence } from "motion/react";
import { Key, ArrowRight, Check, Wallet } from "lucide-react";
import type { SubStep, PlaygroundAction, CryptoState, ChannelState } from "./playground-types";
import { ExplanationCard } from "./explanation-card";
import { explanations, MIN_PREPAYMENT } from "./playground-data";

const setupSteps: { step: SubStep; label: string }[] = [
  { step: "cs:ecdh-leecher-pk", label: "Leecher Ephemeral Key" },
  { step: "cs:ecdh-seeder-pk", label: "Seeder Ephemeral Key" },
  { step: "cs:shared-secret", label: "Shared Secret Derived" },
  { step: "cs:session-uuid", label: "Session UUID (HKDF)" },
  { step: "cs:choose-deposit", label: "Choose Deposit" },
  { step: "cs:tx-submitted", label: "Deposit Submitted" },
  { step: "cs:channel-opened", label: "Channel Opened" },
];

function stepStatus(current: SubStep, target: SubStep): "done" | "active" | "pending" {
  const order = setupSteps.map((s) => s.step);
  const ci = order.indexOf(current);
  const ti = order.indexOf(target);
  if (ci > ti) return "done";
  if (ci === ti) return "active";
  return "pending";
}

function HexReveal({ value, label, color }: { value: string; label: string; color: "sky" | "emerald" | "white" }) {
  const colorClasses = {
    sky: "border-sky-500/20 text-sky-400/60",
    emerald: "border-emerald-500/20 text-emerald-400/60",
    white: "border-white/10 text-white/40",
  }[color];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`rounded-lg border p-3 bg-black/20 ${colorClasses}`}
    >
      <div className="text-[9px] font-mono uppercase tracking-wider mb-1.5 opacity-60">
        {label}
      </div>
      <div className="font-mono text-[10px] break-all leading-relaxed">
        {value.slice(0, 32)}
        {value.length > 32 && <span className="opacity-30">...{value.slice(-8)}</span>}
      </div>
    </motion.div>
  );
}

export function PhaseChannelSetup({
  subStep,
  crypto,
  channel,
  dispatch,
}: {
  subStep: SubStep;
  crypto: CryptoState;
  channel: ChannelState;
  dispatch: React.Dispatch<PlaygroundAction>;
}) {
  const explanation = explanations[subStep] ?? explanations["cs:ecdh-leecher-pk"];

  return (
    <div className="space-y-5">
      {/* Sub-step checklist */}
      <div className="space-y-1">
        {setupSteps.map((s, i) => {
          const status = stepStatus(subStep, s.step);
          return (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className={`flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all duration-400 ${
                status === "active" ? "bg-white/[0.04]" : ""
              }`}
            >
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
                  <Check className="size-2.5" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[11px] font-mono transition-colors duration-500 ${
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

      {/* Crypto visualizer */}
      <AnimatePresence mode="wait">
        {/* ECDH keys */}
        {crypto.leecherEphemeralPk && subStep === "cs:ecdh-leecher-pk" && (
          <motion.div key="lpk" exit={{ opacity: 0 }}>
            <HexReveal value={crypto.leecherEphemeralPk} label="Leecher Public Key" color="sky" />
          </motion.div>
        )}
        {crypto.seederEphemeralPk && subStep === "cs:ecdh-seeder-pk" && (
          <motion.div key="spk" exit={{ opacity: 0 }} className="space-y-2">
            <HexReveal value={crypto.leecherEphemeralPk!} label="Leecher Public Key" color="sky" />
            <HexReveal value={crypto.seederEphemeralPk} label="Seeder Public Key" color="emerald" />
          </motion.div>
        )}

        {/* Shared secret */}
        {crypto.sharedSecret && subStep === "cs:shared-secret" && (
          <motion.div
            key="ss"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <div className="flex gap-2">
              <div className="flex-1 opacity-40">
                <HexReveal value={crypto.leecherEphemeralPk!} label="Leecher PK" color="sky" />
              </div>
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Key className="size-4 text-fd-primary/60" />
                </motion.div>
              </div>
              <div className="flex-1 opacity-40">
                <HexReveal value={crypto.seederEphemeralPk!} label="Seeder PK" color="emerald" />
              </div>
            </div>
            <HexReveal value={crypto.sharedSecret} label="Shared Secret (Curve25519)" color="white" />
          </motion.div>
        )}

        {/* Session UUID */}
        {crypto.sessionUuid && subStep === "cs:session-uuid" && (
          <motion.div key="uuid" exit={{ opacity: 0 }} className="space-y-2">
            <div className="opacity-30">
              <HexReveal value={crypto.sharedSecret!} label="Shared Secret" color="white" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <HexReveal value={crypto.sessionUuid} label="Session UUID (HKDF → seedpay-v1-session)" color="white" />
            </motion.div>
          </motion.div>
        )}

        {/* Deposit slider */}
        {subStep === "cs:choose-deposit" && (
          <motion.div
            key="deposit"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/40">Deposit Amount</span>
              <span className="text-lg font-mono text-emerald-400 font-semibold">
                {channel.deposit.toFixed(2)} USDC
              </span>
            </div>
            <input
              type="range"
              min={MIN_PREPAYMENT}
              max={50}
              step={0.01}
              value={channel.deposit}
              onChange={(e) =>
                dispatch({ type: "SET_DEPOSIT", amount: parseFloat(e.target.value) })
              }
              className="w-full accent-emerald-500 h-1.5 bg-white/[0.06] rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(52,211,153,0.4)]"
            />
            <div className="flex justify-between text-[9px] font-mono text-white/20">
              <span>$0.01</span>
              <span>Max downloadable: ~{Math.floor(channel.deposit / 0.0001)} MB</span>
              <span>$50.00</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      <ExplanationCard
        title={explanation.title}
        text={explanation.text}
        stepKey={subStep}
      />

      {/* Action button */}
      {subStep !== "cs:channel-opened" ? (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-mono text-white/70 transition-all"
        >
          {subStep === "cs:choose-deposit" ? (
            <>
              <Wallet className="size-3" />
              Deposit {channel.deposit.toFixed(2)} USDC
            </>
          ) : (
            <>
              Next Step
              <ArrowRight className="size-3" />
            </>
          )}
        </motion.button>
      ) : (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-mono text-emerald-400 transition-all"
        >
          Begin Verification
          <ArrowRight className="size-3" />
        </motion.button>
      )}
    </div>
  );
}

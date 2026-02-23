"use client";

import { motion } from "motion/react";
import type { Phase } from "./playground-types";

function PeerNode({
  label,
  sublabel,
  color,
  active,
}: {
  label: string;
  sublabel: string;
  color: "blue" | "emerald";
  active: boolean;
}) {
  const colors = {
    blue: {
      border: "border-sky-500/40",
      bg: "bg-sky-500/10",
      dot: "bg-sky-400",
      glow: "0 0 24px rgba(56,189,248,0.25)",
      text: "text-sky-400/70",
    },
    emerald: {
      border: "border-emerald-500/40",
      bg: "bg-emerald-500/10",
      dot: "bg-emerald-400",
      glow: "0 0 24px rgba(52,211,153,0.25)",
      text: "text-emerald-400/70",
    },
  }[color];

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <motion.div
        animate={active ? { boxShadow: colors.glow } : {}}
        transition={{ duration: 0.8 }}
        className={`size-11 rounded-full border flex items-center justify-center transition-all duration-700 ${
          active
            ? `${colors.border} ${colors.bg}`
            : "border-fd-border bg-fd-muted"
        }`}
      >
        <motion.div
          animate={active ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={`size-2.5 rounded-full transition-colors duration-700 ${
            active ? colors.dot : "bg-fd-muted-foreground/30"
          }`}
        />
      </motion.div>
      <span className="text-[11px] font-mono text-fd-muted-foreground">{label}</span>
      <span
        className={`text-[9px] font-mono ${active ? colors.text : "text-fd-muted-foreground/30"} transition-colors duration-500`}
      >
        {sublabel}
      </span>
    </div>
  );
}

export function PeerVisualization({
  phase,
  isChoked,
}: {
  phase: Phase;
  isChoked: boolean;
}) {
  const active = phase !== "idle";
  const showDataFlow = phase === "data-transfer" && !isChoked;
  const showPaymentFlow = phase === "data-transfer" && !isChoked;

  return (
    <div className="flex items-start justify-between">
      <PeerNode
        label="Leecher"
        sublabel="0x8a3…f21"
        color="blue"
        active={active}
      />

      <div className="flex-1 mx-3 relative" style={{ height: 56 }}>
        {/* Base line */}
        <div className="absolute top-[27px] left-0 right-0 h-px bg-fd-border" />

        {/* Active connection glow */}
        {active && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="absolute top-[27px] left-0 right-0 h-px origin-left"
            style={{
              background:
                "linear-gradient(90deg, rgba(96,165,250,0.5), rgba(128,128,128,0.15), rgba(52,211,153,0.5))",
            }}
          />
        )}

        {/* Choked indicator */}
        {phase === "data-transfer" && isChoked && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] text-red-400/70 font-mono tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20"
          >
            CHOKED
          </motion.span>
        )}

        {/* Flowing data packets (right to left = Seeder → Leecher) */}
        {showDataFlow &&
          [0, 1, 2, 3].map((i) => (
            <motion.div
              key={`d${i}`}
              className="absolute top-[24px] size-[5px] rounded-full bg-sky-400/80"
              style={{ filter: "blur(0.5px)" }}
              animate={{
                right: ["0%", "100%"],
                opacity: [0, 0.9, 0.9, 0],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                delay: i * 0.45,
                ease: "linear",
              }}
            />
          ))}

        {/* Flowing payment checks (left to right = Leecher → Seeder) */}
        {showPaymentFlow &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={`p${i}`}
              className="absolute top-[30px] size-[4px] rounded-full bg-emerald-400/70"
              style={{ filter: "blur(0.5px)" }}
              animate={{
                left: ["0%", "100%"],
                opacity: [0, 0.8, 0.8, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: i * 0.7,
                ease: "linear",
              }}
            />
          ))}

        {/* Flow direction labels */}
        {showDataFlow && (
          <>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] text-sky-400/50 font-mono tracking-widest"
            >
              DATA
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400/50 font-mono tracking-widest"
            >
              USDC
            </motion.span>
          </>
        )}

        {/* Phase-specific labels */}
        {phase === "handshake" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-fd-muted-foreground/40 font-mono tracking-widest"
          >
            BEP 10
          </motion.span>
        )}
        {phase === "channel-setup" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-fd-primary/40 font-mono tracking-widest"
          >
            ECDH
          </motion.span>
        )}
        {phase === "verification" && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-amber-400/40 font-mono tracking-widest"
          >
            VERIFY
          </motion.span>
        )}
        {(phase === "closing" || phase === "closed") && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] text-fd-muted-foreground/40 font-mono tracking-widest"
          >
            CLOSE
          </motion.span>
        )}
      </div>

      <PeerNode
        label="Seeder"
        sublabel="0x4b7…c09"
        color="emerald"
        active={active}
      />
    </div>
  );
}

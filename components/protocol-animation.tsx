"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

const phases = [
  { label: "ECDH Handshake", detail: "Ephemeral keys exchanged" },
  { label: "Channel Open", detail: "5.00 USDC escrowed" },
  { label: "On-chain Verify", detail: "Channel confirmed on Solana" },
  { label: "Streaming Transfer", detail: "Pieces + payment checks" },
];

export function ProtocolAnimation() {
  const [phase, setPhase] = useState(0);
  const [dataTransferred, setDataTransferred] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000),
      setTimeout(() => setPhase(2), 2200),
      setTimeout(() => setPhase(3), 3400),
      setTimeout(() => setPhase(4), 4600),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (phase < 4) return;
    const interval = setInterval(() => {
      setDataTransferred((prev) => {
        if (prev >= 1024) return 1024;
        return prev + 3;
      });
      setAmountPaid((prev) => {
        if (prev >= 0.1024) return 0.1024;
        return prev + 0.0003;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Subtle outer glow */}
      <div className="absolute -inset-6 bg-emerald-500/[0.04] rounded-3xl blur-2xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </div>
          <span className="ml-3 text-[11px] text-white/25 font-mono tracking-wider">
            seedpay://session
          </span>
        </div>

        <div className="p-6 space-y-6">
          {/* Peer nodes with animated connection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-start justify-between"
          >
            {/* Leecher */}
            <PeerNode label="Leecher" sublabel="0x8a3…f21" color="blue" active={phase >= 1} />

            {/* Connection visualization */}
            <div className="flex-1 mx-3 relative" style={{ height: 56 }}>
              {/* Base line */}
              <div className="absolute top-[27px] left-0 right-0 h-px bg-white/[0.06]" />

              {/* Active connection glow */}
              {phase >= 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="absolute top-[27px] left-0 right-0 h-px origin-left"
                  style={{
                    background: "linear-gradient(90deg, rgba(96,165,250,0.5), rgba(255,255,255,0.15), rgba(52,211,153,0.5))",
                  }}
                />
              )}

              {/* Flowing data packets (Seeder → Leecher) - top row */}
              {phase >= 4 &&
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

              {/* Flowing payment checks (Leecher → Seeder) - bottom row */}
              {phase >= 4 &&
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
              {phase >= 4 && (
                <>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute top-1.5 left-1/2 -translate-x-1/2 text-[9px] text-sky-400/50 font-mono tracking-widest"
                  >
                    DATA
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[9px] text-emerald-400/50 font-mono tracking-widest"
                  >
                    USDC
                  </motion.span>
                </>
              )}
            </div>

            {/* Seeder */}
            <PeerNode label="Seeder" sublabel="0x4b7…c09" color="emerald" active={phase >= 1} />
          </motion.div>

          {/* Phase steps */}
          <div className="space-y-1">
            {phases.map((step, i) => (
              <PhaseRow
                key={step.label}
                label={step.label}
                detail={step.detail}
                index={i}
                status={
                  phase > i + 1 ? "done" : phase === i + 1 ? "active" : "pending"
                }
              />
            ))}
          </div>

          {/* Live stats footer */}
          {phase >= 4 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-3"
            >
              <StatBlock label="Transferred" value={`${dataTransferred.toFixed(0)} MB`} />
              <StatBlock label="Rate" value="$0.0001/MB" accent />
              <StatBlock label="Total Paid" value={`$${amountPaid.toFixed(4)}`} accent align="right" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

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
          active ? `${colors.border} ${colors.bg}` : "border-white/10 bg-white/[0.02]"
        }`}
      >
        <motion.div
          animate={active ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
          className={`size-2.5 rounded-full transition-colors duration-700 ${
            active ? colors.dot : "bg-white/15"
          }`}
        />
      </motion.div>
      <span className="text-[11px] font-mono text-white/50">{label}</span>
      <span className={`text-[9px] font-mono ${active ? colors.text : "text-white/15"} transition-colors duration-500`}>
        {sublabel}
      </span>
    </div>
  );
}

function PhaseRow({
  label,
  detail,
  index,
  status,
}: {
  label: string;
  detail: string;
  index: number;
  status: "pending" | "active" | "done";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.8 + index * 0.12, duration: 0.35 }}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-500 ${
        status === "active" ? "bg-white/[0.04]" : ""
      }`}
    >
      {/* Step indicator */}
      <div className="relative shrink-0">
        <div
          className={`size-6 rounded-full border flex items-center justify-center text-[10px] font-mono transition-all duration-500 ${
            status === "done"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : status === "active"
                ? "border-white/25 bg-white/[0.06] text-white/70"
                : "border-white/[0.08] text-white/15"
          }`}
        >
          {status === "done" ? (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400 }}>
              ✓
            </motion.span>
          ) : (
            index + 1
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

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div
          className={`text-xs font-mono transition-colors duration-500 ${
            status === "done"
              ? "text-white/50"
              : status === "active"
                ? "text-white/90"
                : "text-white/20"
          }`}
        >
          {label}
        </div>
        {(status === "active" || status === "done") && (
          <motion.div
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[10px] text-white/25 font-mono mt-0.5"
          >
            {detail}
          </motion.div>
        )}
      </div>

      {/* Timing badge */}
      {status === "done" && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-[9px] text-white/15 font-mono shrink-0 bg-white/[0.03] px-1.5 py-0.5 rounded"
        >
          {["142ms", "1.3s", "380ms", "—"][index]}
        </motion.span>
      )}
    </motion.div>
  );
}

function StatBlock({
  label,
  value,
  accent,
  align,
}: {
  label: string;
  value: string;
  accent?: boolean;
  align?: "right";
}) {
  return (
    <div className={align === "right" ? "text-right" : ""}>
      <div className="text-[9px] text-white/20 font-mono uppercase tracking-wider mb-1">
        {label}
      </div>
      <div
        className={`text-sm font-mono ${accent ? "text-emerald-400/80" : "text-white/70"}`}
      >
        {value}
      </div>
    </div>
  );
}

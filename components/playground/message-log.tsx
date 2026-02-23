"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Monitor,
  Blocks,
  ChevronDown,
  Copy,
  Check,
} from "lucide-react";
import type { Message } from "./playground-types";

function directionIcon(dir: Message["direction"]) {
  switch (dir) {
    case "leecher-to-seeder":
      return <ArrowRight className="size-3 text-sky-400/70" />;
    case "seeder-to-leecher":
      return <ArrowLeft className="size-3 text-emerald-400/70" />;
    case "blockchain":
      return <Blocks className="size-3 text-amber-400/70" />;
    case "system":
      return <Monitor className="size-3 text-white/30" />;
  }
}

function directionColor(dir: Message["direction"]) {
  switch (dir) {
    case "leecher-to-seeder":
      return "border-sky-500/20";
    case "seeder-to-leecher":
      return "border-emerald-500/20";
    case "blockchain":
      return "border-amber-500/20";
    case "system":
      return "border-white/[0.06]";
  }
}

function directionLabel(dir: Message["direction"]) {
  switch (dir) {
    case "leecher-to-seeder":
      return "Leecher → Seeder";
    case "seeder-to-leecher":
      return "Seeder → Leecher";
    case "blockchain":
      return "Blockchain";
    case "system":
      return "System";
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="p-1 rounded hover:bg-white/[0.06] transition-colors"
    >
      {copied ? (
        <Check className="size-3 text-emerald-400" />
      ) : (
        <Copy className="size-3 text-white/20 hover:text-white/40" />
      )}
    </button>
  );
}

function JsonBlock({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data, null, 2);
  return (
    <pre className="text-[10px] font-mono text-white/35 leading-relaxed whitespace-pre-wrap break-all mt-2 p-2 rounded-lg bg-black/20 overflow-x-auto">
      {json}
    </pre>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`rounded-lg border p-3 ${directionColor(message.direction)} bg-white/[0.015]`}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {directionIcon(message.direction)}
          <span className="text-[10px] font-mono text-white/25">
            {directionLabel(message.direction)}
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <CopyButton text={JSON.stringify(message.payload, null, 2)} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-white/[0.06] transition-colors"
          >
            <ChevronDown
              className={`size-3 text-white/20 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>
      <div className="text-xs font-medium text-white/60 mt-1.5">
        {message.label}
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <JsonBlock data={message.payload} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function MessageLog({ messages }: { messages: Message[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] h-full flex items-center justify-center p-8">
        <p className="text-xs font-mono text-white/15 text-center">
          Protocol messages will appear here as you step through the flow.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/[0.04]">
        <span className="text-[10px] font-mono text-white/25 uppercase tracking-wider">
          Messages ({messages.length})
        </span>
        {/* Mobile toggle */}
        <button
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="lg:hidden p-1 rounded hover:bg-white/[0.06]"
        >
          <ChevronDown
            className={`size-3 text-white/25 transition-transform ${mobileExpanded ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Desktop: always visible; Mobile: toggleable */}
      <div
        ref={scrollRef}
        className={`overflow-y-auto p-3 space-y-2 scroll-smooth ${
          mobileExpanded ? "max-h-80" : "max-h-20 lg:max-h-none"
        } lg:flex-1`}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

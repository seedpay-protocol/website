"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { BookOpen, Code } from "lucide-react";
import { Vortex } from "@/components/ui/vortex";
import { ProtocolAnimation } from "@/components/protocol-animation";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <Vortex
        baseHue={160}
        backgroundColor="transparent"
        particleCount={600}
        rangeY={300}
        baseSpeed={0.1}
        rangeSpeed={1.5}
        baseRadius={2}
        rangeRadius={4}
        containerClassName="absolute inset-0"
        className="h-full w-full"
      />

      {/* Softer overlay so particles show through */}
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text */}
          <div className="flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 mb-6"
            >
              <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
              v0.3 Pre-Alpha / RFC
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-white"
            >
              Payments Protocol for{" "}
              <span className="text-green-400">BitTorrent</span>{" "}
              Networks
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 text-lg text-white/50 max-w-lg leading-relaxed"
            >
              Seeders earn crypto for sharing files. Leechers pay for faster
              downloads. Streaming micropayments via payment channels with
              on-chain privacy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-4 mt-8"
            >
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/90 transition-colors"
              >
                <BookOpen className="size-4" />
                Read the Docs
              </Link>
              <Link
                href="https://github.com/seedpay-protocol/seedpay"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-medium text-white/70 hover:bg-white/5 transition-colors"
              >
                <Code className="size-4" />
                GitHub
              </Link>
            </motion.div>
          </div>

          {/* Right: Protocol Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="hidden lg:block"
          >
            <ProtocolAnimation />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

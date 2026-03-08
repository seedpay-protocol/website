"use client";

import { useState, useMemo } from "react";
import {
  Calculator,
  Download,
  Upload,
  ArrowRight,
  Coins,
  Zap,
} from "lucide-react";

const PRICE_TIERS = [
  { label: "Budget", pricePerMb: 0.0001 },
  { label: "Standard", pricePerMb: 0.0005 },
  { label: "Premium", pricePerMb: 0.001 },
];

const SOLANA_TX_FEE = 0.000005; // ~0.000005 SOL per tx
const SOL_PRICE_USD = 150; // approximate
const TX_FEE_USD = SOLANA_TX_FEE * SOL_PRICE_USD;
const TXS_PER_SESSION = 2; // open + close

const FILE_PRESETS = [
  { label: "Solana Snapshot", size: 70 },
  { label: "ML Model (LLaMA)", size: 40 },
  { label: "Linux ISO", size: 4 },
  { label: "Game Update", size: 15 },
];

function Slider({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  formatValue,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">{label}</label>
        <span className="text-sm font-mono text-fd-primary">
          {formatValue ? formatValue(value) : value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-fd-border accent-fd-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-fd-primary [&::-webkit-slider-thumb]:shadow-[0_0_8px_-1px] [&::-webkit-slider-thumb]:shadow-fd-primary/40"
      />
    </div>
  );
}

export function CalculatorClient() {
  const [fileSizeGb, setFileSizeGb] = useState(10);
  const [selectedTier, setSelectedTier] = useState(1); // Standard

  const pricePerMb = PRICE_TIERS[selectedTier].pricePerMb;

  const results = useMemo(() => {
    const fileSizeMb = fileSizeGb * 1024;
    const downloadCost = fileSizeMb * pricePerMb;
    const txFees = TXS_PER_SESSION * TX_FEE_USD;
    const totalCost = downloadCost + txFees;

    // Seeder earnings
    const seederEarnings = downloadCost;

    // Break-even: how much to seed to pay for this download
    const seedToDownloadRatio = 1; // 1:1 at same price
    const breakEvenGb = fileSizeGb * seedToDownloadRatio;

    return {
      fileSizeMb,
      downloadCost,
      txFees,
      totalCost,
      seederEarnings,
      breakEvenGb,
      costPerGb: downloadCost / fileSizeGb,
    };
  }, [fileSizeGb, pricePerMb]);

  return (
    <div className="flex flex-col">
      <section className="relative px-4 pt-20 pb-8 max-w-3xl mx-auto w-full text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(142_71%_45%/0.08)_0%,transparent_70%)]" />
        <h1 className="text-3xl font-bold mb-3">Cost Calculator</h1>
        <p className="text-fd-muted-foreground max-w-lg mx-auto mb-8">
          Estimate download costs and seeder earnings on SeedPay. All payments
          are in USDC.
        </p>
      </section>

      <section className="px-4 pb-20 max-w-3xl mx-auto w-full space-y-6">
        {/* Controls */}
        <div className="rounded-xl border border-fd-primary/20 bg-fd-primary/3 p-6 space-y-6 overflow-hidden relative">
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fd-primary/40 to-transparent" />

          {/* File size presets */}
          <div>
            <div className="text-sm font-medium mb-3">Quick Presets</div>
            <div className="flex flex-wrap gap-2">
              {FILE_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setFileSizeGb(p.size)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    fileSizeGb === p.size
                      ? "bg-fd-primary text-fd-primary-foreground"
                      : "border border-fd-border text-fd-muted-foreground hover:bg-fd-accent"
                  }`}
                >
                  {p.label} ({p.size} GB)
                </button>
              ))}
            </div>
          </div>

          {/* File size slider */}
          <Slider
            label="File Size"
            value={fileSizeGb}
            min={0.1}
            max={200}
            step={0.1}
            unit="GB"
            onChange={setFileSizeGb}
            formatValue={(v) => (v >= 1 ? v.toFixed(1) : (v * 1024).toFixed(0) + " MB")}
          />

          {/* Price tier */}
          <div>
            <div className="text-sm font-medium mb-3">Seeder Price Tier</div>
            <div className="grid grid-cols-3 gap-3">
              {PRICE_TIERS.map((tier, i) => (
                <button
                  key={tier.label}
                  onClick={() => setSelectedTier(i)}
                  className={`rounded-lg border p-3 text-center transition-all ${
                    selectedTier === i
                      ? "border-fd-primary/50 bg-fd-primary/10 shadow-[0_0_12px_-3px] shadow-fd-primary/20"
                      : "border-fd-border hover:border-fd-primary/30"
                  }`}
                >
                  <div className="text-xs text-fd-muted-foreground mb-1">
                    {tier.label}
                  </div>
                  <div
                    className={`text-sm font-mono font-bold ${selectedTier === i ? "text-fd-primary" : ""}`}
                  >
                    ${tier.pricePerMb}
                  </div>
                  <div className="text-[10px] text-fd-muted-foreground/60">
                    per MB
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Download cost */}
          <div className="rounded-xl border border-fd-border/60 bg-fd-card p-6">
            <div className="flex items-center gap-2 text-xs text-fd-muted-foreground/60 mb-3">
              <Download className="size-3.5" />
              Download Cost
            </div>
            <div className="text-3xl font-bold text-fd-primary mb-1">
              ${results.totalCost < 0.01
                ? results.totalCost.toFixed(4)
                : results.totalCost.toFixed(2)}
            </div>
            <div className="text-xs text-fd-muted-foreground">
              for {fileSizeGb >= 1 ? `${fileSizeGb} GB` : `${(fileSizeGb * 1024).toFixed(0)} MB`}
            </div>
            <div className="mt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-fd-muted-foreground">
                <span>Data payment</span>
                <span className="font-mono">
                  ${results.downloadCost < 0.01
                    ? results.downloadCost.toFixed(4)
                    : results.downloadCost.toFixed(2)}{" "}
                  USDC
                </span>
              </div>
              <div className="flex justify-between text-fd-muted-foreground">
                <span>Solana tx fees ({TXS_PER_SESSION} txns)</span>
                <span className="font-mono">
                  ~${results.txFees.toFixed(4)} USD
                </span>
              </div>
              <div className="flex justify-between text-fd-muted-foreground">
                <span>Cost per GB</span>
                <span className="font-mono">
                  ${results.costPerGb < 0.01
                    ? results.costPerGb.toFixed(4)
                    : results.costPerGb.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Seeder earnings */}
          <div className="rounded-xl border border-fd-border/60 bg-fd-card p-6">
            <div className="flex items-center gap-2 text-xs text-fd-muted-foreground/60 mb-3">
              <Upload className="size-3.5" />
              Seeder Earnings
            </div>
            <div className="text-3xl font-bold text-emerald-500 dark:text-emerald-400 mb-1">
              +${results.seederEarnings < 0.01
                ? results.seederEarnings.toFixed(4)
                : results.seederEarnings.toFixed(2)}
            </div>
            <div className="text-xs text-fd-muted-foreground">
              USDC earned for serving this file
            </div>
            <div className="mt-4 space-y-1.5 text-xs">
              <div className="flex justify-between text-fd-muted-foreground">
                <span>Revenue per GB seeded</span>
                <span className="font-mono">
                  ${(pricePerMb * 1024).toFixed(2)} USDC
                </span>
              </div>
              <div className="flex justify-between text-fd-muted-foreground">
                <span>Serve to 10 leechers</span>
                <span className="font-mono text-emerald-500 dark:text-emerald-400">
                  +${(results.seederEarnings * 10) < 0.01
                    ? (results.seederEarnings * 10).toFixed(4)
                    : (results.seederEarnings * 10).toFixed(2)}{" "}
                  USDC
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Circular economy */}
        <div className="rounded-xl border border-fd-primary/20 bg-fd-primary/5 p-6">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Coins className="size-4 text-fd-primary" />
            Circular Economy
          </h3>
          <div className="flex items-center gap-4 flex-wrap text-sm">
            <div className="flex items-center gap-2">
              <Upload className="size-4 text-emerald-500" />
              <span>
                Seed <span className="font-mono font-bold">{results.breakEvenGb.toFixed(1)} GB</span>
              </span>
            </div>
            <ArrowRight className="size-4 text-fd-muted-foreground/40" />
            <div className="flex items-center gap-2">
              <Coins className="size-4 text-fd-primary" />
              <span>
                Earn{" "}
                <span className="font-mono font-bold text-emerald-500 dark:text-emerald-400">
                  ${results.seederEarnings < 0.01
                    ? results.seederEarnings.toFixed(4)
                    : results.seederEarnings.toFixed(2)}
                </span>
              </span>
            </div>
            <ArrowRight className="size-4 text-fd-muted-foreground/40" />
            <div className="flex items-center gap-2">
              <Download className="size-4 text-fd-primary" />
              <span>
                Download{" "}
                <span className="font-mono font-bold">
                  {fileSizeGb >= 1 ? `${fileSizeGb} GB` : `${(fileSizeGb * 1024).toFixed(0)} MB`}
                </span>
              </span>
            </div>
          </div>
          <p className="text-xs text-fd-muted-foreground/60 mt-3">
            No crypto purchase needed — seed first, then spend your earnings on downloads.
          </p>
        </div>

        {/* Comparison */}
        <div className="rounded-xl border border-fd-border/60 bg-fd-card overflow-hidden">
          <div className="border-b border-fd-border/60 px-6 py-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Zap className="size-4 text-fd-primary" />
              How It Compares
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fd-border/40 text-xs text-fd-muted-foreground/60">
                  <th className="text-left px-6 py-3 font-medium">Method</th>
                  <th className="text-left px-6 py-3 font-medium">
                    Cost for {fileSizeGb >= 1 ? `${fileSizeGb} GB` : `${(fileSizeGb * 1024).toFixed(0)} MB`}
                  </th>
                  <th className="text-left px-6 py-3 font-medium">On-chain txns</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-fd-border/30 bg-fd-primary/5">
                  <td className="px-6 py-3 font-medium text-fd-primary">
                    SeedPay (payment channel)
                  </td>
                  <td className="px-6 py-3 font-mono">
                    ${results.totalCost < 0.01
                      ? results.totalCost.toFixed(4)
                      : results.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 font-mono">2</td>
                </tr>
                <tr className="border-b border-fd-border/30">
                  <td className="px-6 py-3 text-fd-muted-foreground">
                    Atomic per-piece payments
                  </td>
                  <td className="px-6 py-3 font-mono text-fd-muted-foreground">
                    ${results.totalCost < 0.01
                      ? results.totalCost.toFixed(4)
                      : results.totalCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 font-mono text-red-500">
                    ~{Math.ceil(results.fileSizeMb / 0.256).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-3 text-fd-muted-foreground">
                    Standard BitTorrent
                  </td>
                  <td className="px-6 py-3 font-mono text-fd-muted-foreground">
                    Free*
                  </td>
                  <td className="px-6 py-3 font-mono text-fd-muted-foreground">
                    0
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 text-[10px] text-fd-muted-foreground/40 border-t border-fd-border/30">
            * Free but no availability guarantees — 38% of torrents die within
            the first month.
          </div>
        </div>
      </section>
    </div>
  );
}

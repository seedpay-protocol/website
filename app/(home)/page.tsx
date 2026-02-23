import Link from "next/link";
import {
  Coins,
  ArrowLeftRight,
  ShieldCheck,
  Puzzle,
  RefreshCw,
  Globe,
  Handshake,
  Wallet,
  ScanSearch,
  ArrowDownToLine,
  Check,
  X,
  BookOpen,
  Code,
  Play,
  GitBranch,
  ExternalLink,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { HeroSection } from "@/components/hero-section";

const features = [
  {
    icon: Coins,
    title: "Micropayments",
    description:
      "Pay as low as $0.0001/MB. Streaming payment checks minimize trust requirements — seeders get paid per chunk of data served.",
  },
  {
    icon: ArrowLeftRight,
    title: "Payment Channels",
    description:
      "Only 2 on-chain transactions per session (open + close). All intermediate payments happen off-chain via signed checks.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy (ECDH)",
    description:
      "Ephemeral session keys ensure blockchain observers cannot link wallet addresses to download activity or peer IDs.",
  },
  {
    icon: Puzzle,
    title: "Backward Compatible",
    description:
      "Extends BEP 10 (Extension Protocol). Non-SeedPay clients continue to work without modification. Payments are opt-in.",
  },
  {
    icon: RefreshCw,
    title: "Circular Economy",
    description:
      "Earn USDC by seeding popular content, then spend it on downloads. No need to buy crypto upfront if you seed first.",
  },
  {
    icon: Globe,
    title: "Open Protocol",
    description:
      "No centralized infrastructure. No proprietary tokens. Built on open standards (Curve25519, HKDF, SHA-256) and public blockchains.",
  },
];

function Features() {
  return (
    <section className="relative px-4 py-16 max-w-6xl mx-auto">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(142_71%_45%/0.08)_0%,transparent_70%)]" />
      <AnimateOnScroll>
        <h2 className="text-2xl font-bold text-center mb-2">
          Why <span className="text-fd-primary">SeedPay</span>?
        </h2>
        <p className="text-fd-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Direct economic incentives for seeding, built on open standards.
        </p>
      </AnimateOnScroll>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <AnimateOnScroll key={f.title} delay={i * 80}>
            <div className="group relative rounded-xl border border-fd-primary/20 bg-fd-primary/3 p-6 h-full hover:border-fd-primary/50 transition-all hover:shadow-[0_0_24px_-6px] hover:shadow-fd-primary/20 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fd-primary/40 to-transparent" />
              <div className="inline-flex items-center justify-center size-10 rounded-lg bg-fd-primary/15 text-fd-primary mb-4 group-hover:bg-fd-primary/25 transition-colors">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-fd-muted-foreground">
                {f.description}
              </p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}

const steps = [
  {
    icon: Handshake,
    title: "Handshake",
    description:
      "Peers exchange BEP 10 extended handshakes to advertise SeedPay support, wallet address, and pricing.",
  },
  {
    icon: Wallet,
    title: "Channel Setup",
    description:
      "ECDH key exchange derives an ephemeral Session UUID. Leecher deposits USDC into an on-chain escrow.",
  },
  {
    icon: ScanSearch,
    title: "Verification",
    description:
      "Seeder independently verifies the payment channel on-chain — checking deposit, session binding, and freshness.",
  },
  {
    icon: ArrowDownToLine,
    title: "Data Transfer",
    description:
      "Standard BitTorrent piece exchange. Leecher streams signed payment checks. Seeder claims funds on channel close.",
  },
];

function ProtocolFlow() {
  return (
    <section className="relative px-4 py-16 max-w-5xl mx-auto">
      <AnimateOnScroll>
        <h2 className="text-2xl font-bold text-center mb-2">How It Works</h2>
        <p className="text-fd-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Four phases from connection to settlement.
        </p>
      </AnimateOnScroll>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <AnimateOnScroll key={s.title} delay={i * 120}>
            <div className="relative rounded-xl border border-fd-primary/20 bg-fd-primary/5 p-6 h-full hover:border-fd-primary/50 transition-all hover:shadow-[0_0_24px_-6px] hover:shadow-fd-primary/20 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fd-primary/40 to-transparent" />
              <div className="inline-flex items-center justify-center size-10 rounded-full bg-fd-primary text-fd-primary-foreground mb-4 shadow-[0_0_20px_-2px] shadow-fd-primary/30">
                <s.icon className="size-5" />
              </div>
              <div className="text-xs font-medium text-fd-primary/60 font-mono mb-1">
                0{i + 1}
              </div>
              <h3 className="font-semibold mb-2">{s.title}</h3>
              <p className="text-sm text-fd-muted-foreground">
                {s.description}
              </p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </section>
  );
}

function Cell({ value }: { value: boolean }) {
  return value ? (
    <Check className="size-4 text-green-600 dark:text-green-400 mx-auto" />
  ) : (
    <X className="size-4 text-fd-muted-foreground/40 mx-auto" />
  );
}

function Comparison() {
  const rows = [
    {
      feature: "Decentralized",
      seedpay: true,
      tft: true,
      tracker: false,
      btt: false,
    },
    {
      feature: "Micropayments",
      seedpay: true,
      tft: false,
      tracker: false,
      btt: true,
    },
    {
      feature: "Post-download incentive",
      seedpay: true,
      tft: false,
      tracker: true,
      btt: true,
    },
    {
      feature: "Privacy-preserving",
      seedpay: true,
      tft: true,
      tracker: false,
      btt: false,
    },
    {
      feature: "Backward compatible",
      seedpay: true,
      tft: true,
      tracker: false,
      btt: false,
    },
    {
      feature: "Open standard",
      seedpay: true,
      tft: true,
      tracker: false,
      btt: false,
    },
    {
      feature: "No proprietary token",
      seedpay: true,
      tft: true,
      tracker: true,
      btt: false,
    },
  ];

  return (
    <section className="relative px-4 py-16 max-w-4xl mx-auto">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(142_71%_45%/0.07)_0%,transparent_60%)]" />
      <AnimateOnScroll>
        <h2 className="text-2xl font-bold text-center mb-2">
          Compared to Alternatives
        </h2>
        <p className="text-fd-muted-foreground text-center mb-12 max-w-xl mx-auto">
          How SeedPay stacks up against existing solutions.
        </p>
      </AnimateOnScroll>
      <AnimateOnScroll delay={100}>
        <div className="overflow-x-auto rounded-xl border border-fd-primary/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fd-primary/15 bg-fd-primary/5">
                <th className="text-left p-4 font-semibold">Feature</th>
                <th className="p-4 font-semibold text-fd-primary">SeedPay</th>
                <th className="p-4 font-semibold text-fd-muted-foreground">Tit-for-tat</th>
                <th className="p-4 font-semibold text-fd-muted-foreground">Private Trackers</th>
                <th className="p-4 font-semibold text-fd-muted-foreground">BTT</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.feature}
                  className="border-b border-fd-border/60 last:border-0 hover:bg-fd-primary/5 transition-colors"
                >
                  <td className="p-4 text-fd-muted-foreground">
                    {row.feature}
                  </td>
                  <td className="p-4 bg-fd-primary/8">
                    <Cell value={row.seedpay} />
                  </td>
                  <td className="p-4">
                    <Cell value={row.tft} />
                  </td>
                  <td className="p-4">
                    <Cell value={row.tracker} />
                  </td>
                  <td className="p-4">
                    <Cell value={row.btt} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimateOnScroll>
    </section>
  );
}

function Economics() {
  return (
    <section className="relative px-4 py-16 max-w-4xl mx-auto">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom,hsl(142_71%_45%/0.08)_0%,transparent_70%)]" />
      <AnimateOnScroll>
        <h2 className="text-2xl font-bold text-center mb-2">
          Circular Economy
        </h2>
        <p className="text-fd-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Earn by seeding. Spend on downloads. No proprietary tokens — just
          USDC.
        </p>
      </AnimateOnScroll>
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          {
            stat: "$0.0001",
            label: "per MB (minimum)",
            detail: "Download a 1 GB file for ~$0.10",
          },
          {
            stat: "2 txns",
            label: "per session on-chain",
            detail:
              "Open channel + close channel. Everything else is off-chain.",
          },
          {
            stat: "USDC",
            label: "stablecoin payments",
            detail: "No volatile tokens. Earn and spend real value.",
          },
        ].map((item, i) => (
          <AnimateOnScroll key={item.stat} delay={i * 100}>
            <div className="relative rounded-xl border border-fd-primary/20 bg-fd-primary/3 p-6 text-center h-full hover:border-fd-primary/50 transition-all hover:shadow-[0_0_24px_-6px] hover:shadow-fd-primary/20 overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fd-primary/40 to-transparent" />
              <div className="text-3xl font-bold text-fd-primary mb-2">
                {item.stat}
              </div>
              <div className="text-sm text-fd-muted-foreground">
                {item.label}
              </div>
              <p className="text-xs text-fd-muted-foreground mt-3">
                {item.detail}
              </p>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
      <AnimateOnScroll delay={150}>
        <div className="mt-8 rounded-xl border border-fd-primary/25 bg-fd-primary/5 p-6">
          <h3 className="font-semibold mb-4">Example: The Seeder Economy</h3>
          <div className="grid gap-4 sm:grid-cols-3 text-sm">
            <div>
              <div className="text-fd-muted-foreground mb-1">Seed 10 GB</div>
              <div className="font-medium text-emerald-500 dark:text-emerald-400">Earn ~0.10 USDC</div>
            </div>
            <div>
              <div className="text-fd-muted-foreground mb-1">Download 5 GB</div>
              <div className="font-medium">Spend ~0.05 USDC</div>
            </div>
            <div>
              <div className="text-fd-muted-foreground mb-1">Net balance</div>
              <div className="font-medium text-fd-primary">
                +0.05 USDC
              </div>
            </div>
          </div>
        </div>
      </AnimateOnScroll>
    </section>
  );
}

function Implementation() {
  const items = [
    {
      label: "Smart Contract",
      detail: "Anchor 0.32 / Rust — 3 instructions (open, close, timeout)",
    },
    {
      label: "TypeScript SDK",
      detail: "ECDH key exchange, payment check signing, Solana client",
    },
    {
      label: "Integration Tests",
      detail: "Happy path, timeout recovery, replay protection — all passing",
    },
    {
      label: "End-to-End Demo",
      detail: "Full flow from ECDH handshake to channel settlement",
    },
  ];

  return (
    <section className="relative px-4 py-16 max-w-4xl mx-auto">
      <AnimateOnScroll>
        <h2 className="text-2xl font-bold text-center mb-2">
          Solana Implementation
        </h2>
        <p className="text-fd-muted-foreground text-center mb-12 max-w-xl mx-auto">
          A working proof-of-concept on Solana with payment channels, ECDH
          privacy, and off-chain micropayments.
        </p>
      </AnimateOnScroll>
      <AnimateOnScroll delay={80}>
        <div className="rounded-xl border border-fd-primary/20 bg-fd-primary/3 overflow-hidden">
          <div className="border-b border-fd-primary/15 bg-fd-primary/5 px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center size-9 rounded-lg bg-fd-primary/15 text-fd-primary">
                <GitBranch className="size-4" />
              </div>
              <div>
                <div className="font-semibold text-sm">seedpay-solana</div>
                <div className="text-xs text-fd-muted-foreground">
                  Anchor + SPL Token + Ed25519 verification
                </div>
              </div>
            </div>
            <a
              href="https://github.com/seedpay-protocol/seedpay-solana"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-fd-border px-4 py-2 text-xs font-medium text-fd-foreground hover:bg-fd-accent transition-colors"
            >
              View on GitHub
              <ExternalLink className="size-3" />
            </a>
          </div>
          <div className="grid gap-0 sm:grid-cols-2">
            {items.map((item, i) => (
              <div
                key={item.label}
                className={`px-6 py-4 ${i < 2 ? "border-b border-fd-primary/10" : ""} ${i % 2 === 0 ? "sm:border-r sm:border-fd-primary/10" : ""}`}
              >
                <div className="text-sm font-medium mb-1">{item.label}</div>
                <div className="text-xs text-fd-muted-foreground">
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateOnScroll>
      <AnimateOnScroll delay={120}>
        <div className="mt-4 text-center">
          <Link
            href="/docs/implementation/solana-poc"
            className="text-sm text-fd-primary hover:underline"
          >
            Read the full implementation docs →
          </Link>
        </div>
      </AnimateOnScroll>
    </section>
  );
}

function CTA() {
  return (
    <AnimateOnScroll>
      <section className="px-4 py-20 text-center">
        <div className="mx-auto max-w-2xl rounded-2xl border border-fd-primary/30 bg-fd-primary/8 px-8 py-12">
          <h2 className="text-2xl font-bold mb-4">Read the Protocol</h2>
          <p className="text-fd-muted-foreground mb-8 max-w-lg mx-auto">
            SeedPay is an open RFC. Explore the full specification, security
            model, and implementation guide.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/playground"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
            >
              <Play className="size-4" />
              Try the Playground
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-6 py-3 text-sm font-medium text-fd-foreground hover:bg-fd-accent transition-colors"
            >
              <BookOpen className="size-4" />
              Documentation
            </Link>
            <Link
              href="/docs/core-protocol"
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border px-6 py-3 text-sm font-medium text-fd-foreground hover:bg-fd-accent transition-colors"
            >
              <Code className="size-4" />
              Core Protocol
            </Link>
          </div>
        </div>
      </section>
    </AnimateOnScroll>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <Features />
      <ProtocolFlow />
      <Comparison />
      <Economics />
      <Implementation />
      <CTA />
    </div>
  );
}

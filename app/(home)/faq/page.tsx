import type { Metadata } from "next";
import Link from "next/link";
import { AnimateOnScroll } from "@/components/animate-on-scroll";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ – SeedPay",
  description:
    "Frequently asked questions about SeedPay — the payments protocol for BitTorrent networks.",
};

type FAQItem = { q: string; a: React.ReactNode };

const general: FAQItem[] = [
  {
    q: "What is SeedPay?",
    a: "SeedPay is an open payment protocol that lets BitTorrent seeders earn cryptocurrency (USDC) for sharing files, while leechers pay seeders directly for faster downloads and guaranteed availability. It extends the BitTorrent Wire Protocol with payment handshakes and blockchain-verified payment channels.",
  },
  {
    q: "What problem does it solve?",
    a: (
      <>
        The <strong>free-rider problem</strong>. BitTorrent depends on users
        seeding after downloading, but rational actors have no incentive to do
        so. Popular torrents survive on altruism; long-tail content dies once
        initial interest fades. SeedPay provides direct economic incentives for
        seeding — seeders earn real money for the bandwidth they provide.
      </>
    ),
  },
  {
    q: "What is the current status?",
    a: (
      <>
        SeedPay is at <strong>v0.3 Pre-Alpha / RFC</strong> stage. This is
        research software and should not be used in production. V0.3 introduced
        privacy protections via ephemeral session keys (ECDH), payment channels
        with streaming micropayments, and a simplified protocol focused on
        crypto-native users.
      </>
    ),
  },
  {
    q: "Who is SeedPay for?",
    a: "The primary target is crypto-native users who value speed, availability, and supporting content creators. Non-crypto users can continue using standard BitTorrent without any changes — SeedPay payments are entirely opt-in.",
  },
];

const howItWorks: FAQItem[] = [
  {
    q: "How do payments work?",
    a: (
      <>
        SeedPay uses <strong>unidirectional payment channels</strong>. The
        leecher deposits USDC into an on-chain escrow, then signs off-chain
        payment checks as data is downloaded. The seeder submits the final check
        to claim funds when the session ends. Only 2 on-chain transactions are
        needed per session (open + close) — all intermediate payments happen
        off-chain.
      </>
    ),
  },
  {
    q: "How much does it cost to download?",
    a: (
      <>
        Seeders set their own prices, but typical pricing is{" "}
        <strong>$0.0001–$0.001 per MB</strong>. That means a 1 GB file costs
        roughly $0.10–$1.00. Seeders also define a minimum prepayment
        (typically $0.01) to open a channel.
      </>
    ),
  },
  {
    q: "Do I need to buy crypto to use it?",
    a: "Not necessarily. You can seed popular content first to earn USDC from leechers, then spend those earnings on your own downloads. This creates a circular economy — seed 10 GB, earn ~$0.10, download 5 GB, spend ~$0.05, keep the rest.",
  },
  {
    q: "What happens if the connection drops mid-download?",
    a: "If the connection drops, the seeder can close the channel with the highest payment check they received. If the seeder disappears, the leecher can force-close the channel after a timeout period (default 24 hours) to recover unspent funds. No money is lost permanently.",
  },
  {
    q: "Can I still use BitTorrent for free?",
    a: "Yes. SeedPay is fully opt-in and backward compatible. Non-SeedPay clients continue to work without modification. Standard tit-for-tat seeding remains available. Payments only happen between peers that both support and have enabled SeedPay.",
  },
];

const privacySecurity: FAQItem[] = [
  {
    q: "How does SeedPay protect my privacy?",
    a: (
      <>
        V0.3 uses <strong>Ephemeral Session Keys</strong> based on
        Elliptic Curve Diffie-Hellman (ECDH). Each session derives a unique
        Session UUID, and only a SHA-256 hash of it appears on-chain. Blockchain
        observers cannot link wallet addresses to download activity, peer IDs,
        or IP addresses. Each session is also unlinkable from previous ones.
      </>
    ),
  },
  {
    q: "What's the maximum I can lose in a session?",
    a: (
      <>
        <strong>For leechers:</strong> The maximum loss is the amount deposited
        in the channel (e.g. $0.01). If the seeder sends no data, the leecher
        can force-close after timeout to recover funds.
        <br />
        <br />
        <strong>For seeders:</strong> $0. The seeder only serves data after
        verifying the channel on-chain, and stops when payment checks stop
        arriving.
      </>
    ),
  },
  {
    q: "What if a seeder sends corrupted data?",
    a: "BitTorrent's built-in piece hash verification catches corrupted data. The leecher verifies piece hashes before signing payment checks, so the seeder only gets paid for valid data. Maximum loss from a corrupted piece is approximately $0.000025.",
  },
  {
    q: "Can payment checks be forged or replayed?",
    a: "No. Each payment check is cryptographically signed with Ed25519 and includes a monotonically increasing nonce. Checks are bound to a specific channel ID, so they cannot be replayed across sessions. The smart contract enforces nonce ordering and rejects stale or duplicate checks.",
  },
  {
    q: "Are Sybil attacks a concern?",
    a: "Payment channels require real cryptocurrency deposits and each channel opening costs transaction fees. This makes Sybil attacks economically infeasible — an attacker creating 100 fake seeders would gain roughly $0.0025/day while spending more on transaction fees.",
  },
];

const technical: FAQItem[] = [
  {
    q: "Which blockchains are supported?",
    a: "V0.3 targets Solana first (using SPL Token for USDC). The protocol is blockchain-agnostic by design — the ECDH session binding works on any chain. Ethereum/EVM support (with ERC-20 tokens) is planned for future versions.",
  },
  {
    q: "Is SeedPay compatible with my BitTorrent client?",
    a: "SeedPay extends the BEP 10 Extension Protocol, which is supported by most modern clients. However, SeedPay V0.3 requires MSE (Message Stream Encryption) for the ECDH key exchange. A SeedPay-enabled client plugin or native implementation is needed — non-SeedPay clients still work normally without payments.",
  },
  {
    q: "What cryptography does SeedPay use?",
    a: (
      <>
        <strong>Curve25519</strong> (x25519) for ECDH key exchange,{" "}
        <strong>HKDF-SHA256</strong> for session key derivation,{" "}
        <strong>SHA-256</strong> for session hashing, and{" "}
        <strong>Ed25519</strong> for payment check signatures. All are
        well-established, widely audited standards with implementations in
        libsodium, NaCl, and OpenSSL.
      </>
    ),
  },
  {
    q: "Why USDC instead of a custom token?",
    a: "USDC is a widely adopted stablecoin with real, stable value. A proprietary token would introduce volatility risk, require liquidity bootstrapping, and add friction. With USDC, earned funds are immediately useful — no exchange step needed. This also avoids the regulatory and perception issues around launching a new token.",
  },
  {
    q: "How is SeedPay different from BitTorrent Token (BTT)?",
    a: "BTT uses a centralized ledger with a proprietary token, limited adoption, and doesn't integrate with existing clients. SeedPay is fully decentralized, uses an established stablecoin (USDC), is backward compatible with standard BitTorrent, and is built on open standards with no proprietary infrastructure.",
  },
];

function FAQCategory({
  title,
  items,
  baseDelay = 0,
}: {
  title: string;
  items: FAQItem[];
  baseDelay?: number;
}) {
  return (
    <div>
      <AnimateOnScroll delay={baseDelay}>
        <h2 className="text-lg font-semibold text-fd-primary mb-4">{title}</h2>
      </AnimateOnScroll>
      <div className="space-y-3">
        {items.map((item, i) => (
          <AnimateOnScroll key={i} delay={baseDelay + (i + 1) * 60}>
            <details className="group rounded-xl border border-fd-primary/20 bg-fd-primary/3 overflow-hidden hover:border-fd-primary/40 transition-colors">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-medium select-none [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <span className="shrink-0 text-fd-primary transition-transform duration-200 group-open:rotate-45 text-lg leading-none">
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-sm text-fd-muted-foreground leading-relaxed">
                {item.a}
              </div>
            </details>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="flex flex-col">
      <section className="relative px-4 pt-20 pb-8 max-w-3xl mx-auto w-full text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(142_71%_45%/0.08)_0%,transparent_70%)]" />
        <AnimateOnScroll>
          <h1 className="text-3xl font-bold mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-fd-muted-foreground max-w-lg mx-auto">
            Everything you need to know about SeedPay — the payments protocol
            for BitTorrent networks.
          </p>
        </AnimateOnScroll>
      </section>

      <section className="px-4 pb-20 max-w-3xl mx-auto w-full space-y-10">
        <FAQCategory title="General" items={general} />
        <FAQCategory title="How It Works" items={howItWorks} baseDelay={40} />
        <FAQCategory
          title="Privacy & Security"
          items={privacySecurity}
          baseDelay={40}
        />
        <FAQCategory title="Technical" items={technical} baseDelay={40} />

        <AnimateOnScroll delay={60}>
          <div className="rounded-xl border border-fd-primary/30 bg-fd-primary/8 p-6 text-center">
            <p className="text-fd-muted-foreground text-sm mb-4">
              Have a question that isn't answered here?
            </p>
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-5 py-2.5 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
            >
              <BookOpen className="size-4" />
              Read the Full Documentation
            </Link>
          </div>
        </AnimateOnScroll>
      </section>
    </div>
  );
}

import Link from 'next/link';

function Hero() {
  return (
    <section className="flex flex-col items-center text-center px-4 pt-20 pb-16">
      <div className="inline-flex items-center gap-2 rounded-full border border-fd-border bg-fd-secondary px-4 py-1.5 text-sm text-fd-muted-foreground mb-6">
        <span className="inline-block size-2 rounded-full bg-yellow-500" />
        v0.3 Pre-Alpha / RFC
      </div>
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl">
        Payments Protocol for{' '}
        <span className="text-fd-primary">BitTorrent</span> Networks
      </h1>
      <p className="mt-6 text-lg text-fd-muted-foreground max-w-2xl">
        Seeders earn crypto for sharing files. Leechers pay for faster downloads.
        Streaming micropayments via payment channels with on-chain privacy.
      </p>
      <div className="flex gap-4 mt-8">
        <Link
          href="/docs"
          className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
        >
          Read the Docs
        </Link>
        <Link
          href="https://github.com/codecrunch/seedpay"
          className="rounded-lg border border-fd-border px-6 py-3 text-sm font-medium text-fd-foreground hover:bg-fd-accent transition-colors"
        >
          GitHub
        </Link>
      </div>
    </section>
  );
}

const features = [
  {
    title: 'Micropayments',
    description:
      'Pay as low as $0.0001/MB. Streaming payment checks minimize trust requirements — seeders get paid per chunk of data served.',
  },
  {
    title: 'Payment Channels',
    description:
      'Only 2 on-chain transactions per session (open + close). All intermediate payments happen off-chain via signed checks.',
  },
  {
    title: 'Privacy (ECDH)',
    description:
      'Ephemeral session keys ensure blockchain observers cannot link wallet addresses to download activity or peer IDs.',
  },
  {
    title: 'Backward Compatible',
    description:
      'Extends BEP 10 (Extension Protocol). Non-SeedPay clients continue to work without modification. Payments are opt-in.',
  },
  {
    title: 'Circular Economy',
    description:
      'Earn USDC by seeding popular content, then spend it on downloads. No need to buy crypto upfront if you seed first.',
  },
  {
    title: 'Open Protocol',
    description:
      'No centralized infrastructure. No proprietary tokens. Built on open standards (Curve25519, HKDF, SHA-256) and public blockchains.',
  },
];

function Features() {
  return (
    <section className="px-4 py-16 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">Why SeedPay?</h2>
      <p className="text-fd-muted-foreground text-center mb-12 max-w-xl mx-auto">
        Direct economic incentives for seeding, built on open standards.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-fd-border bg-fd-card p-6"
          >
            <h3 className="font-semibold mb-2">{f.title}</h3>
            <p className="text-sm text-fd-muted-foreground">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

const steps = [
  {
    step: '1',
    title: 'Handshake',
    description:
      'Peers exchange BEP 10 extended handshakes to advertise SeedPay support, wallet address, and pricing.',
  },
  {
    step: '2',
    title: 'Channel Setup',
    description:
      'ECDH key exchange derives an ephemeral Session UUID. Leecher deposits USDC into an on-chain escrow.',
  },
  {
    step: '3',
    title: 'Verification',
    description:
      'Seeder independently verifies the payment channel on-chain — checking deposit, session binding, and freshness.',
  },
  {
    step: '4',
    title: 'Data Transfer',
    description:
      'Standard BitTorrent piece exchange. Leecher streams signed payment checks. Seeder claims funds on channel close.',
  },
];

function ProtocolFlow() {
  return (
    <section className="px-4 py-16 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">How It Works</h2>
      <p className="text-fd-muted-foreground text-center mb-12 max-w-xl mx-auto">
        Four phases from connection to settlement.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.step} className="relative rounded-xl border border-fd-border bg-fd-card p-6">
            <span className="inline-flex items-center justify-center size-8 rounded-full bg-fd-primary text-fd-primary-foreground text-sm font-bold mb-4">
              {s.step}
            </span>
            <h3 className="font-semibold mb-2">{s.title}</h3>
            <p className="text-sm text-fd-muted-foreground">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    { feature: 'Decentralized', seedpay: true, tft: true, tracker: false, btt: false },
    { feature: 'Micropayments', seedpay: true, tft: false, tracker: false, btt: true },
    { feature: 'Post-download incentive', seedpay: true, tft: false, tracker: true, btt: true },
    { feature: 'Privacy-preserving', seedpay: true, tft: true, tracker: false, btt: false },
    { feature: 'Backward compatible', seedpay: true, tft: true, tracker: false, btt: false },
    { feature: 'Open standard', seedpay: true, tft: true, tracker: false, btt: false },
    { feature: 'No proprietary token', seedpay: true, tft: true, tracker: true, btt: false },
  ];

  return (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">
        Compared to Alternatives
      </h2>
      <p className="text-fd-muted-foreground text-center mb-12 max-w-xl mx-auto">
        How SeedPay stacks up against existing solutions.
      </p>
      <div className="overflow-x-auto rounded-xl border border-fd-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border bg-fd-card">
              <th className="text-left p-4 font-semibold">Feature</th>
              <th className="p-4 font-semibold">SeedPay</th>
              <th className="p-4 font-semibold">Tit-for-tat</th>
              <th className="p-4 font-semibold">Private Trackers</th>
              <th className="p-4 font-semibold">BTT</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-fd-border last:border-0">
                <td className="p-4 text-fd-muted-foreground">{row.feature}</td>
                <td className="p-4 text-center">{row.seedpay ? '\u2705' : '\u274C'}</td>
                <td className="p-4 text-center">{row.tft ? '\u2705' : '\u274C'}</td>
                <td className="p-4 text-center">{row.tracker ? '\u2705' : '\u274C'}</td>
                <td className="p-4 text-center">{row.btt ? '\u2705' : '\u274C'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Economics() {
  return (
    <section className="px-4 py-16 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-2">Circular Economy</h2>
      <p className="text-fd-muted-foreground text-center mb-12 max-w-xl mx-auto">
        Earn by seeding. Spend on downloads. No proprietary tokens — just USDC.
      </p>
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-fd-border bg-fd-card p-6 text-center">
          <div className="text-3xl font-bold text-fd-primary mb-2">$0.0001</div>
          <div className="text-sm text-fd-muted-foreground">per MB (minimum)</div>
          <p className="text-xs text-fd-muted-foreground mt-3">
            Download a 1 GB file for ~$0.10
          </p>
        </div>
        <div className="rounded-xl border border-fd-border bg-fd-card p-6 text-center">
          <div className="text-3xl font-bold text-fd-primary mb-2">2 txns</div>
          <div className="text-sm text-fd-muted-foreground">per session on-chain</div>
          <p className="text-xs text-fd-muted-foreground mt-3">
            Open channel + close channel. Everything else is off-chain.
          </p>
        </div>
        <div className="rounded-xl border border-fd-border bg-fd-card p-6 text-center">
          <div className="text-3xl font-bold text-fd-primary mb-2">USDC</div>
          <div className="text-sm text-fd-muted-foreground">stablecoin payments</div>
          <p className="text-xs text-fd-muted-foreground mt-3">
            No volatile tokens. Earn and spend real value.
          </p>
        </div>
      </div>
      <div className="mt-8 rounded-xl border border-fd-border bg-fd-card p-6">
        <h3 className="font-semibold mb-4">Example: The Seeder Economy</h3>
        <div className="grid gap-4 sm:grid-cols-3 text-sm">
          <div>
            <div className="text-fd-muted-foreground mb-1">Seed 10 GB</div>
            <div className="font-medium">Earn ~0.10 USDC</div>
          </div>
          <div>
            <div className="text-fd-muted-foreground mb-1">Download 5 GB</div>
            <div className="font-medium">Spend ~0.05 USDC</div>
          </div>
          <div>
            <div className="text-fd-muted-foreground mb-1">Net balance</div>
            <div className="font-medium text-green-600 dark:text-green-400">+0.05 USDC</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="px-4 py-20 text-center">
      <h2 className="text-2xl font-bold mb-4">Read the Protocol</h2>
      <p className="text-fd-muted-foreground mb-8 max-w-lg mx-auto">
        SeedPay is an open RFC. Explore the full specification, security model,
        and implementation guide.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          href="/docs"
          className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors"
        >
          Documentation
        </Link>
        <Link
          href="/docs/core-protocol"
          className="rounded-lg border border-fd-border px-6 py-3 text-sm font-medium text-fd-foreground hover:bg-fd-accent transition-colors"
        >
          Core Protocol
        </Link>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <ProtocolFlow />
      <Comparison />
      <Economics />
      <CTA />
    </div>
  );
}

import Link from "next/link";
import Image from "next/image";

const sections = [
  {
    title: "Protocol",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Core Protocol", href: "/docs/core-protocol" },
      { label: "Security Model", href: "/docs/security" },
      { label: "Solana PoC", href: "/docs/implementation/solana-poc" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Playground", href: "/playground" },
      { label: "FAQ", href: "/faq" },
      { label: "Message Reference", href: "/docs/reference/message-types" },
      { label: "Future Extensions", href: "/docs/reference/future-extensions" },
    ],
  },
  {
    title: "Community",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/seedpay-protocol/seedpay",
        external: true,
      },
      {
        label: "Solana PoC Repo",
        href: "https://github.com/seedpay-protocol/seedpay-solana",
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-fd-border bg-fd-card/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image
                src="/seedpay-logo.png"
                alt="SeedPay"
                width={28}
                height={28}
              />
              <span className="font-semibold text-lg">SeedPay</span>
            </Link>
            <p className="text-sm text-fd-muted-foreground leading-relaxed">
              Payment channels for streaming delivery. Pay as data arrives with
              cryptographic fair exchange.
            </p>
            <p className="text-xs text-fd-muted-foreground/50 mt-4">
              v0.3 Pre-Alpha / RFC
            </p>
          </div>

          {/* Link columns */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {"external" in link ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                      >
                        {link.label}
                        <span className="text-[10px] ml-1 opacity-50">
                          &#8599;
                        </span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-fd-border pt-6">
          <p className="text-xs text-fd-muted-foreground/60">
            {new Date().getFullYear()} SeedPay Protocol. Open source under MIT.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="text-xs text-fd-muted-foreground/60 hover:text-fd-muted-foreground transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/llms.txt"
              className="text-xs text-fd-muted-foreground/60 hover:text-fd-muted-foreground transition-colors"
            >
              llms.txt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

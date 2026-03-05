import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";

export const gitConfig = {
  user: "seedpay-protocol",
  repo: "seedpay",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/seedpay-logo.png"
            alt="SeedPay"
            width={24}
            height={24}
            className="dark:invert-0"
          />
          <span className="font-semibold">SeedPay</span>
        </>
      ),
    },
    links: [
      {
        text: "Playground",
        url: "/playground",
      },
      {
        text: "FAQ",
        url: "/faq",
      },
      {
        text: "Docs",
        url: "/docs",
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

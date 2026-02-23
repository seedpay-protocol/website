import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export const gitConfig = {
  user: "seedpay-protocol",
  repo: "seedpay",
  branch: "main",
};

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "SeedPay",
    },
    links: [
      {
        text: "Playground",
        url: "/playground",
      },
      {
        text: "Docs",
        url: "/docs",
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}

import type { Metadata } from "next";
import { ExplorerClient } from "@/components/explorer/explorer-client";

export const metadata: Metadata = {
  title: "Channel Explorer",
  description:
    "Inspect SeedPay payment channels on Solana. View channel state, deposits, participants, and transaction history.",
  alternates: {
    canonical: "/explorer",
  },
};

export default function ExplorerPage() {
  return <ExplorerClient />;
}

import type { Metadata } from "next";
import { PlaygroundClient } from "@/components/playground/playground-client";

export const metadata: Metadata = {
  title: "Playground – SeedPay",
  description:
    "Interactive walkthrough of the complete SeedPay protocol. Step through handshake, payment channel setup, verification, and data transfer.",
};

export default function PlaygroundPage() {
  return <PlaygroundClient />;
}

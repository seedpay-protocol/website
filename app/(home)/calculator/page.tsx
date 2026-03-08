import type { Metadata } from "next";
import { CalculatorClient } from "@/components/calculator/calculator-client";

export const metadata: Metadata = {
  title: "Cost Calculator",
  description:
    "Estimate SeedPay download costs and seeder earnings. Compare payment channel efficiency with atomic per-piece payments.",
  alternates: {
    canonical: "/calculator",
  },
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}

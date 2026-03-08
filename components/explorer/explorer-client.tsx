"use client";

import { useState, useCallback } from "react";
import { address, type Address } from "@solana/kit";
import {
  Search,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Wallet,
  Hash,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowDownToLine,
} from "lucide-react";
import {
  type Cluster,
  type ChannelState,
  type TransactionSignature,
  ChannelStatus,
  CHANNEL_STATUS_LABELS,
  getRpc,
  fetchChannelState,
  fetchTransactionHistory,
  formatTokenAmount,
  shortenAddress,
  getExplorerUrl,
} from "@/lib/solana";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center justify-center size-6 rounded hover:bg-fd-accent transition-colors text-fd-muted-foreground"
      title="Copy"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
    </button>
  );
}

function AddressDisplay({
  addr,
  cluster,
  label,
}: {
  addr: string;
  cluster: Cluster;
  label: string;
}) {
  return (
    <div>
      <div className="text-xs text-fd-muted-foreground/60 mb-1">{label}</div>
      <div className="flex items-center gap-1.5">
        <code className="text-xs font-mono break-all">{addr}</code>
        <CopyButton text={addr} />
        <a
          href={getExplorerUrl("address", addr, cluster)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center size-6 rounded hover:bg-fd-accent transition-colors text-fd-muted-foreground"
        >
          <ExternalLink className="size-3" />
        </a>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ChannelStatus }) {
  const colors: Record<ChannelStatus, string> = {
    [ChannelStatus.Open]:
      "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
    [ChannelStatus.Closed]:
      "bg-fd-muted-foreground/10 text-fd-muted-foreground border-fd-muted-foreground/20",
    [ChannelStatus.TimedOut]:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${colors[status]}`}
    >
      <span
        className={`size-1.5 rounded-full ${status === ChannelStatus.Open ? "bg-green-500 animate-pulse" : status === ChannelStatus.TimedOut ? "bg-amber-500" : "bg-fd-muted-foreground/40"}`}
      />
      {CHANNEL_STATUS_LABELS[status]}
    </span>
  );
}

function ChannelDetails({
  channel,
  channelAddress,
  cluster,
}: {
  channel: ChannelState;
  channelAddress: string;
  cluster: Cluster;
}) {
  const createdDate = new Date(Number(channel.createdAt) * 1000);
  const timeoutDate = new Date(Number(channel.timeout) * 1000);
  const now = Date.now();
  const isExpired = now > timeoutDate.getTime();
  const timeRemaining = timeoutDate.getTime() - now;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-fd-primary/20 bg-fd-primary/3 p-6 overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-fd-primary/40 to-transparent" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs text-fd-muted-foreground/60 mb-1">
              Channel Address
            </div>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono">
                {shortenAddress(channelAddress, 8)}
              </code>
              <CopyButton text={channelAddress} />
              <a
                href={getExplorerUrl("address", channelAddress, cluster)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
              >
                <ExternalLink className="size-3.5" />
              </a>
            </div>
          </div>
          <StatusBadge status={channel.status} />
        </div>

        {/* Key metrics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-fd-border/60 bg-fd-card p-4">
            <div className="flex items-center gap-2 text-xs text-fd-muted-foreground/60 mb-1">
              <Wallet className="size-3" />
              Deposited
            </div>
            <div className="text-xl font-bold text-fd-primary">
              {formatTokenAmount(channel.deposited)} <span className="text-sm font-normal text-fd-muted-foreground">USDC</span>
            </div>
          </div>

          <div className="rounded-lg border border-fd-border/60 bg-fd-card p-4">
            <div className="flex items-center gap-2 text-xs text-fd-muted-foreground/60 mb-1">
              <ArrowDownToLine className="size-3" />
              Last Nonce
            </div>
            <div className="text-xl font-bold">
              {channel.lastNonce.toString()}
            </div>
          </div>

          <div className="rounded-lg border border-fd-border/60 bg-fd-card p-4">
            <div className="flex items-center gap-2 text-xs text-fd-muted-foreground/60 mb-1">
              <Clock className="size-3" />
              Timeout
            </div>
            <div className="text-sm font-medium">
              {channel.status === ChannelStatus.Open ? (
                isExpired ? (
                  <span className="text-amber-500">Expired</span>
                ) : (
                  <span>
                    {Math.floor(timeRemaining / 3600000)}h{" "}
                    {Math.floor((timeRemaining % 3600000) / 60000)}m remaining
                  </span>
                )
              ) : (
                <span className="text-fd-muted-foreground">
                  {timeoutDate.toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="rounded-xl border border-fd-border/60 bg-fd-card p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck className="size-4 text-fd-primary" />
          Participants
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <AddressDisplay
            addr={channel.leecher}
            cluster={cluster}
            label="Leecher (Payer)"
          />
          <AddressDisplay
            addr={channel.seeder}
            cluster={cluster}
            label="Seeder (Payee)"
          />
        </div>
      </div>

      {/* Channel Details */}
      <div className="rounded-xl border border-fd-border/60 bg-fd-card p-6">
        <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
          <Hash className="size-4 text-fd-primary" />
          Channel Data
        </h3>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-fd-muted-foreground/60 mb-1">
              Channel ID (Session Hash)
            </div>
            <div className="flex items-center gap-1.5">
              <code className="text-xs font-mono break-all text-fd-muted-foreground">
                {channel.channelId}
              </code>
              <CopyButton text={channel.channelId} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs text-fd-muted-foreground/60 mb-1">
                Created At
              </div>
              <div className="text-sm">
                {createdDate.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-fd-muted-foreground/60 mb-1">
                Timeout Deadline
              </div>
              <div className="text-sm">
                {timeoutDate.toLocaleString()}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-fd-muted-foreground/60 mb-1">
              PDA Bump
            </div>
            <div className="text-sm font-mono">{channel.bump}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionHistory({
  transactions,
  cluster,
}: {
  transactions: TransactionSignature[];
  cluster: Cluster;
}) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-fd-border/60 bg-fd-card p-6 text-center text-sm text-fd-muted-foreground">
        No transactions found for this channel.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-fd-border/60 bg-fd-card overflow-hidden">
      <div className="border-b border-fd-border/60 px-6 py-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Clock className="size-4 text-fd-primary" />
          Transaction History
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-fd-border/40 text-xs text-fd-muted-foreground/60">
              <th className="text-left px-6 py-3 font-medium">Signature</th>
              <th className="text-left px-6 py-3 font-medium">Time</th>
              <th className="text-left px-6 py-3 font-medium">Slot</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.signature}
                className="border-b border-fd-border/30 last:border-0 hover:bg-fd-primary/5 transition-colors"
              >
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={getExplorerUrl("tx", tx.signature, cluster)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-fd-primary hover:underline"
                    >
                      {shortenAddress(tx.signature, 8)}
                    </a>
                    <CopyButton text={tx.signature} />
                  </div>
                  {tx.memo && (
                    <div className="text-[10px] text-fd-muted-foreground/50 mt-0.5 font-mono">
                      {tx.memo}
                    </div>
                  )}
                </td>
                <td className="px-6 py-3 text-fd-muted-foreground text-xs">
                  {tx.blockTime
                    ? new Date(tx.blockTime * 1000).toLocaleString()
                    : "—"}
                </td>
                <td className="px-6 py-3 text-fd-muted-foreground font-mono text-xs">
                  {tx.slot.toLocaleString()}
                </td>
                <td className="px-6 py-3">
                  {tx.err ? (
                    <span className="inline-flex items-center gap-1 text-xs text-red-500">
                      <AlertCircle className="size-3" />
                      Failed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <Check className="size-3" />
                      Success
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ExplorerClient() {
  const [input, setInput] = useState("");
  const [cluster, setCluster] = useState<Cluster>("devnet");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<ChannelState | null>(null);
  const [transactions, setTransactions] = useState<TransactionSignature[]>([]);
  const [searchedAddress, setSearchedAddress] = useState<string>("");

  const handleSearch = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setChannel(null);
    setTransactions([]);

    try {
      let addr: Address;
      try {
        addr = address(trimmed);
      } catch {
        setError("Invalid Solana address. Please enter a valid base58 channel address.");
        setLoading(false);
        return;
      }

      const rpc = getRpc(cluster);

      const [channelData, txHistory] = await Promise.all([
        fetchChannelState(rpc, addr),
        fetchTransactionHistory(rpc, addr),
      ]);

      if (!channelData && txHistory.length === 0) {
        setError(
          "No SeedPay channel found at this address. Make sure the address is a valid channel PDA and you've selected the correct cluster."
        );
        setLoading(false);
        return;
      }

      setChannel(channelData);
      setTransactions(txHistory);
      setSearchedAddress(trimmed);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch channel data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [input, cluster]);

  return (
    <div className="flex flex-col">
      {/* Hero / Search */}
      <section className="relative px-4 pt-20 pb-8 max-w-3xl mx-auto w-full text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,hsl(142_71%_45%/0.08)_0%,transparent_70%)]" />
        <h1 className="text-3xl font-bold mb-3">Channel Explorer</h1>
        <p className="text-fd-muted-foreground max-w-lg mx-auto mb-8">
          Inspect any SeedPay payment channel on Solana. View channel state,
          deposits, participants, and transaction history.
        </p>

        {/* Cluster toggle */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {(["devnet", "mainnet-beta"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCluster(c)}
              className={`rounded-lg px-4 py-2 text-xs font-medium transition-colors ${
                cluster === c
                  ? "bg-fd-primary text-fd-primary-foreground"
                  : "border border-fd-border text-fd-muted-foreground hover:bg-fd-accent"
              }`}
            >
              {c === "devnet" ? "Devnet" : "Mainnet"}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="flex gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-fd-muted-foreground/50" />
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter channel PDA address..."
              className="w-full rounded-lg border border-fd-border bg-fd-card pl-10 pr-4 py-3 text-sm font-mono placeholder:text-fd-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-fd-primary/30 focus:border-fd-primary/50 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !input.trim()}
            className="rounded-lg bg-fd-primary px-6 py-3 text-sm font-medium text-fd-primary-foreground hover:bg-fd-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Search className="size-4" />
            )}
            Search
          </button>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 pb-20 max-w-3xl mx-auto w-full space-y-6">
        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!channel && transactions.length > 0 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
            <AlertCircle className="size-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                Channel Closed
              </p>
              <p className="text-xs text-fd-muted-foreground mt-1">
                This channel has been closed and the account data was deallocated to reclaim rent.
                Transaction history is still available below.
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <code className="text-xs font-mono text-fd-muted-foreground">{searchedAddress}</code>
                <CopyButton text={searchedAddress} />
                <a
                  href={getExplorerUrl("address", searchedAddress, cluster)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                >
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {channel && (
          <ChannelDetails
            channel={channel}
            channelAddress={searchedAddress}
            cluster={cluster}
          />
        )}

        {transactions.length > 0 && (
          <TransactionHistory
            transactions={transactions}
            cluster={cluster}
          />
        )}
      </section>
    </div>
  );
}

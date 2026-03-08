import {
  createSolanaRpc,
  address,
  fetchEncodedAccount,
  type Address,
  type Rpc,
  type SolanaRpcApi,
} from "@solana/kit";

export const PROGRAM_ID = address(
  "7DwPMoGzTjRUroE47VPEEJn4FBSypAA5dbeMn3ocVdsS"
);

export type Cluster = "devnet" | "mainnet-beta";

const RPC_URLS: Record<Cluster, string> = {
  devnet: "https://api.devnet.solana.com",
  "mainnet-beta": "https://api.mainnet-beta.solana.com",
};

export function getRpc(cluster: Cluster): Rpc<SolanaRpcApi> {
  return createSolanaRpc(RPC_URLS[cluster]);
}

export enum ChannelStatus {
  Open = 0,
  Closed = 1,
  TimedOut = 2,
}

export const CHANNEL_STATUS_LABELS: Record<ChannelStatus, string> = {
  [ChannelStatus.Open]: "Open",
  [ChannelStatus.Closed]: "Closed",
  [ChannelStatus.TimedOut]: "Timed Out",
};

export interface ChannelState {
  leecher: string;
  seeder: string;
  deposited: bigint;
  channelId: string; // hex
  createdAt: bigint;
  timeout: bigint;
  lastNonce: bigint;
  status: ChannelStatus;
  bump: number;
}

const ANCHOR_DISCRIMINATOR_SIZE = 8;

function readPubkey(data: Uint8Array, offset: number): string {
  const bytes = data.slice(offset, offset + 32);
  // base58 encode
  return encodeBase58(bytes);
}

function readU64(data: Uint8Array, offset: number): bigint {
  const view = new DataView(data.buffer, data.byteOffset + offset, 8);
  return view.getBigUint64(0, true);
}

function readI64(data: Uint8Array, offset: number): bigint {
  const view = new DataView(data.buffer, data.byteOffset + offset, 8);
  return view.getBigInt64(0, true);
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const BASE58_ALPHABET =
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function encodeBase58(bytes: Uint8Array): string {
  let num = BigInt(0);
  for (const b of bytes) {
    num = num * 256n + BigInt(b);
  }
  let result = "";
  while (num > 0n) {
    const mod = Number(num % 58n);
    result = BASE58_ALPHABET[mod] + result;
    num = num / 58n;
  }
  for (const b of bytes) {
    if (b !== 0) break;
    result = "1" + result;
  }
  return result || "1";
}

export function deserializeChannelState(data: Uint8Array): ChannelState {
  let offset = ANCHOR_DISCRIMINATOR_SIZE;

  const leecher = readPubkey(data, offset);
  offset += 32;

  const seeder = readPubkey(data, offset);
  offset += 32;

  const deposited = readU64(data, offset);
  offset += 8;

  const channelId = bytesToHex(data.slice(offset, offset + 32));
  offset += 32;

  const createdAt = readI64(data, offset);
  offset += 8;

  const timeout = readI64(data, offset);
  offset += 8;

  const lastNonce = readU64(data, offset);
  offset += 8;

  const status = data[offset] as ChannelStatus;
  offset += 1;

  const bump = data[offset];

  return {
    leecher,
    seeder,
    deposited,
    channelId,
    createdAt,
    timeout,
    lastNonce,
    status,
    bump,
  };
}

export async function fetchChannelState(
  rpc: Rpc<SolanaRpcApi>,
  addr: Address
): Promise<ChannelState | null> {
  const account = await fetchEncodedAccount(rpc, addr);
  if (!account.exists) return null;
  return deserializeChannelState(new Uint8Array(account.data));
}

export interface TransactionSignature {
  signature: string;
  slot: number;
  blockTime: number | null;
  err: unknown;
  memo: string | null;
}

export async function fetchTransactionHistory(
  rpc: Rpc<SolanaRpcApi>,
  addr: Address,
  limit = 20
): Promise<TransactionSignature[]> {
  const sigs = await rpc
    .getSignaturesForAddress(addr, { limit })
    .send();

  return sigs.map((s) => ({
    signature: s.signature,
    slot: Number(s.slot),
    blockTime: s.blockTime ? Number(s.blockTime) : null,
    err: s.err,
    memo: s.memo ?? null,
  }));
}

export function formatTokenAmount(amount: bigint, decimals = 6): string {
  const divisor = BigInt(10 ** decimals);
  const whole = amount / divisor;
  const remainder = amount % divisor;
  const decimal = remainder
    .toString()
    .padStart(decimals, "0")
    .replace(/0+$/, "");
  return decimal ? `${whole}.${decimal}` : whole.toString();
}

export function shortenAddress(addr: string, chars = 4): string {
  if (addr.length <= chars * 2 + 3) return addr;
  return `${addr.slice(0, chars)}...${addr.slice(-chars)}`;
}

export function getExplorerUrl(
  type: "address" | "tx",
  value: string,
  cluster: Cluster
): string {
  const base = "https://explorer.solana.com";
  const clusterParam = cluster === "mainnet-beta" ? "" : `?cluster=${cluster}`;
  return `${base}/${type}/${value}${clusterParam}`;
}

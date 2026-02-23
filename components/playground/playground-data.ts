export const LEECHER_WALLET = "8a3F…d21b";
export const SEEDER_WALLET = "4b7C…c09e";
export const LEECHER_EPHEMERAL_PK =
  "7a2f8c4e91b3d5a70e6f2c8b14d97e3a5f0c6b82a41d9e7f3b5c8a02e6d1f4b3";
export const SEEDER_EPHEMERAL_PK =
  "9e1d5b7a3c8f20e4b6a91d7c5e3f8b2a04d6c9e1f7b3a85c2e0d4f6a8b1c9e7";
export const SHARED_SECRET =
  "3f8a2c6e91d4b7f05c3e8a1d6b9f2e7c4a0d5b8e3f1c6a94e7d2b5f8a3c0e1d";
export const SESSION_UUID =
  "d4e7b1a3-9c2f-4e8d-b5a1-7f3c6e0d8a2b";
export const SESSION_HASH =
  "a1b2c3d4e5f67890abcdef1234567890abcdef1234567890abcdef1234567890";
export const CHANNEL_ID = "ch_9x7k2m4p8v";
export const TX_SIGNATURE =
  "5KtR8mGn2vXp4bYq9wLjN7cFhD3sAeUx6kMzJrTfWy1QaCdEgHiVoSuBnOlPzXw";

export const DEFAULT_DEPOSIT = 5.0;
export const PRICE_PER_MB = 0.0001;
export const MIN_PREPAYMENT = 0.01;
export const CHANNEL_TIMEOUT = 3600;
export const CHECK_INTERVAL_MB = 50;

export const phaseConfig = [
  { key: "handshake" as const, label: "Handshake", number: 1 },
  { key: "channel-setup" as const, label: "Channel Setup", number: 2 },
  { key: "verification" as const, label: "Verification", number: 3 },
  { key: "data-transfer" as const, label: "Data Transfer", number: 4 },
  { key: "closing" as const, label: "Close", number: 5 },
] as const;

export const explanations: Record<string, { title: string; text: string }> = {
  idle: {
    title: "Welcome to the SeedPay Playground",
    text: "Walk through the complete SeedPay protocol step by step. Click \"Next Step\" to begin the handshake between a Leecher (downloader) and a Seeder (uploader).",
  },
  "hs:bt-handshake": {
    title: "BitTorrent Handshake",
    text: "Peers establish a standard BitTorrent connection and exchange BEP 10 extended handshakes to discover each other's capabilities.",
  },
  "hs:seeder-extended": {
    title: "Seeder Announces SeedPay",
    text: "The seeder's extended handshake advertises SeedPay support along with wallet address, price per MB, and blockchain chain.",
  },
  "hs:leecher-extended": {
    title: "Leecher Confirms Support",
    text: "The leecher responds with its own extended handshake declaring SeedPay support. Both peers now know they can use the payment protocol.",
  },
  "hs:capability-detected": {
    title: "SeedPay Negotiated",
    text: "Both peers have confirmed SeedPay support. The leecher knows the seeder charges $0.0001/MB on Solana. Time to set up a payment channel.",
  },
  "cs:ecdh-leecher-pk": {
    title: "Leecher Generates Ephemeral Key",
    text: "The leecher generates a Curve25519 keypair for this session only. The public key is sent to the seeder via an ecdh_init message.",
  },
  "cs:ecdh-seeder-pk": {
    title: "Seeder Generates Ephemeral Key",
    text: "The seeder generates its own Curve25519 keypair and sends the public key back. Both peers now have each other's public keys.",
  },
  "cs:shared-secret": {
    title: "Shared Secret Derived",
    text: "Both peers independently compute the same shared secret: their private key × the other's public key. No one observing the network can derive this secret.",
  },
  "cs:session-uuid": {
    title: "Session UUID via HKDF",
    text: "HKDF-Expand with info=\"seedpay-v1-session\" derives a unique 32-byte Session UUID from the shared secret. This binds the payment channel to this specific peer session.",
  },
  "cs:choose-deposit": {
    title: "Choose Deposit Amount",
    text: "The leecher chooses how much USDC to deposit into escrow. This is the maximum they can spend in this session. Use the slider to adjust the amount.",
  },
  "cs:tx-submitted": {
    title: "Escrow Deposit Submitted",
    text: "The leecher submits a Solana transaction depositing USDC into a smart contract escrow. The on-chain memo contains only an opaque session_hash — no wallet or peer info is linked.",
  },
  "cs:channel-opened": {
    title: "Channel Opened",
    text: "The leecher notifies the seeder that the payment channel is open by sending the transaction signature and channel details.",
  },
  "vf:querying": {
    title: "Seeder Queries Blockchain",
    text: "The seeder independently queries Solana to verify the payment channel. Trust nothing — verify everything.",
  },
  "vf:check-state": {
    title: "Check: Channel State",
    text: "Verify the channel exists on-chain, is in \"Open\" state, and the seeder wallet matches.",
  },
  "vf:check-deposit": {
    title: "Check: Deposit Amount",
    text: "Verify the deposited amount is >= the minimum prepayment requirement.",
  },
  "vf:check-token": {
    title: "Check: Token & Chain",
    text: "Verify the escrow holds the correct token (USDC) on the correct chain (Solana).",
  },
  "vf:check-session": {
    title: "Check: Session Binding",
    text: "Verify the on-chain memo session_hash matches SHA-256(Session_UUID). This proves the channel was opened for this specific peer session.",
  },
  "vf:check-freshness": {
    title: "Check: Freshness",
    text: "Verify the channel was opened recently (within 5-10 minutes) to prevent replay attacks using old channels.",
  },
  "vf:confirmed": {
    title: "Channel Confirmed",
    text: "All 6 verification checks passed. The seeder confirms the channel, unchokes the leecher, and data transfer can begin.",
  },
  "dt:transferring": {
    title: "Streaming Data + Payments",
    text: "Standard BitTorrent piece exchange is now active. The leecher must periodically sign payment checks to keep the data flowing. Click \"Sign Payment Check\" before the seeder demands one!",
  },
  "dt:check-required": {
    title: "Payment Check Required!",
    text: "The seeder has sent a payment_check_required message. You've downloaded data without paying. Sign a check now or the seeder will choke the connection!",
  },
  "dt:choked": {
    title: "Connection Choked",
    text: "The seeder choked the connection — data transfer has stopped. Sign a payment check to resume downloading.",
  },
  "cl:tx-submitted": {
    title: "Close Transaction Submitted",
    text: "The seeder submits the highest valid payment check to close the channel cooperatively on-chain.",
  },
  "cl:settled": {
    title: "Channel Settled",
    text: "The smart contract transferred earned USDC to the seeder and refunded the remainder to the leecher.",
  },
  "cl:closed": {
    title: "Session Complete",
    text: "The payment channel is closed. The entire session used only 2 on-chain transactions (open + close) while streaming thousands of off-chain payments.",
  },
};

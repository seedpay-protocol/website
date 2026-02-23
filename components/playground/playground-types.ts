export type Phase =
  | "idle"
  | "handshake"
  | "channel-setup"
  | "verification"
  | "data-transfer"
  | "closing"
  | "closed";

export type SubStep =
  // Idle
  | "idle"
  // Handshake
  | "hs:bt-handshake"
  | "hs:seeder-extended"
  | "hs:leecher-extended"
  | "hs:capability-detected"
  // Channel setup
  | "cs:ecdh-leecher-pk"
  | "cs:ecdh-seeder-pk"
  | "cs:shared-secret"
  | "cs:session-uuid"
  | "cs:choose-deposit"
  | "cs:tx-submitted"
  | "cs:channel-opened"
  // Verification
  | "vf:querying"
  | "vf:check-state"
  | "vf:check-deposit"
  | "vf:check-token"
  | "vf:check-session"
  | "vf:check-freshness"
  | "vf:confirmed"
  // Data transfer
  | "dt:transferring"
  | "dt:check-required"
  | "dt:choked"
  // Closing
  | "cl:tx-submitted"
  | "cl:settled"
  | "cl:closed";

export interface Message {
  id: string;
  direction: "leecher-to-seeder" | "seeder-to-leecher" | "system" | "blockchain";
  label: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

export interface CryptoState {
  leecherEphemeralPk: string | null;
  seederEphemeralPk: string | null;
  sharedSecret: string | null;
  sessionUuid: string | null;
  sessionHash: string | null;
}

export interface ChannelState {
  channelId: string | null;
  deposit: number;
  seederWallet: string;
  leecherWallet: string;
  pricePerMb: number;
  timeout: number;
  status: "none" | "open" | "confirmed" | "closed";
}

export interface TransferState {
  mbDownloaded: number;
  totalCost: number;
  lastCheckAmount: number;
  lastCheckNonce: number;
  piecesTransferred: number;
  isChoked: boolean;
  mbSinceLastCheck: number;
}

export interface PlaygroundState {
  phase: Phase;
  subStep: SubStep;
  messages: Message[];
  crypto: CryptoState;
  channel: ChannelState;
  transfer: TransferState;
}

export type PlaygroundAction =
  | { type: "NEXT_STEP" }
  | { type: "RESET" }
  | { type: "SET_DEPOSIT"; amount: number }
  | { type: "SEND_PAYMENT_CHECK" }
  | { type: "TRANSFER_TICK" }
  | { type: "CLOSE_CHANNEL" };

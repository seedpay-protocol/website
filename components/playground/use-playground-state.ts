import { useReducer } from "react";
import type {
  PlaygroundState,
  PlaygroundAction,
  Message,
  SubStep,
  Phase,
} from "./playground-types";
import {
  LEECHER_WALLET,
  SEEDER_WALLET,
  LEECHER_EPHEMERAL_PK,
  SEEDER_EPHEMERAL_PK,
  SHARED_SECRET,
  SESSION_UUID,
  SESSION_HASH,
  CHANNEL_ID,
  TX_SIGNATURE,
  PRICE_PER_MB,
  DEFAULT_DEPOSIT,
  CHANNEL_TIMEOUT,
  CHECK_INTERVAL_MB,
} from "./playground-data";

let msgCounter = 0;
function createMessage(
  direction: Message["direction"],
  label: string,
  payload: Record<string, unknown>,
): Message {
  return {
    id: `msg-${++msgCounter}`,
    direction,
    label,
    payload,
    timestamp: Date.now(),
  };
}

const initialState: PlaygroundState = {
  phase: "idle",
  subStep: "idle",
  messages: [],
  crypto: {
    leecherEphemeralPk: null,
    seederEphemeralPk: null,
    sharedSecret: null,
    sessionUuid: null,
    sessionHash: null,
  },
  channel: {
    channelId: null,
    deposit: DEFAULT_DEPOSIT,
    seederWallet: SEEDER_WALLET,
    leecherWallet: LEECHER_WALLET,
    pricePerMb: PRICE_PER_MB,
    timeout: CHANNEL_TIMEOUT,
    status: "none",
  },
  transfer: {
    mbDownloaded: 0,
    totalCost: 0,
    lastCheckAmount: 0,
    lastCheckNonce: 0,
    piecesTransferred: 0,
    isChoked: false,
    mbSinceLastCheck: 0,
  },
};

// Sub-step progression order for NEXT_STEP
const stepOrder: SubStep[] = [
  "idle",
  // Handshake
  "hs:bt-handshake",
  "hs:seeder-extended",
  "hs:leecher-extended",
  "hs:capability-detected",
  // Channel setup
  "cs:ecdh-leecher-pk",
  "cs:ecdh-seeder-pk",
  "cs:shared-secret",
  "cs:session-uuid",
  "cs:choose-deposit",
  "cs:tx-submitted",
  "cs:channel-opened",
  // Verification
  "vf:querying",
  "vf:check-state",
  "vf:check-deposit",
  "vf:check-token",
  "vf:check-session",
  "vf:check-freshness",
  "vf:confirmed",
  // Data transfer (entry point only — loop handled separately)
  "dt:transferring",
];

function phaseForStep(step: SubStep): Phase {
  if (step === "idle") return "idle";
  if (step.startsWith("hs:")) return "handshake";
  if (step.startsWith("cs:")) return "channel-setup";
  if (step.startsWith("vf:")) return "verification";
  if (step.startsWith("dt:")) return "data-transfer";
  if (step.startsWith("cl:")) return "closing";
  return "idle";
}

function reducer(state: PlaygroundState, action: PlaygroundAction): PlaygroundState {
  switch (action.type) {
    case "RESET": {
      msgCounter = 0;
      return { ...initialState, messages: [] };
    }

    case "SET_DEPOSIT": {
      if (state.subStep !== "cs:choose-deposit") return state;
      return {
        ...state,
        channel: { ...state.channel, deposit: action.amount },
      };
    }

    case "NEXT_STEP": {
      // For data-transfer, closing, and closed — NEXT_STEP doesn't apply
      if (
        state.subStep === "dt:transferring" ||
        state.subStep === "dt:check-required" ||
        state.subStep === "dt:choked" ||
        state.subStep.startsWith("cl:")
      ) {
        return state;
      }

      const currentIndex = stepOrder.indexOf(state.subStep);
      if (currentIndex === -1 || currentIndex >= stepOrder.length - 1) return state;

      const nextStep = stepOrder[currentIndex + 1];
      const nextPhase = phaseForStep(nextStep);
      const newMessages = [...state.messages];
      let crypto = { ...state.crypto };
      let channel = { ...state.channel };

      // Generate messages for the new step
      switch (nextStep) {
        case "hs:bt-handshake":
          newMessages.push(
            createMessage("system", "BitTorrent Handshake", {
              protocol: "BitTorrent protocol",
              reserved: "0x0000000000100005",
              info_hash: "a1b2c3...f4e5d6",
              peer_id: "-SD0100-randomchars",
            }),
          );
          break;

        case "hs:seeder-extended":
          newMessages.push(
            createMessage("seeder-to-leecher", "Extended Handshake (Seeder)", {
              m: { seedpay: 1, ut_metadata: 2 },
              seedpay_wallet: SEEDER_WALLET,
              seedpay_price_per_mb: PRICE_PER_MB,
              seedpay_chain: "solana",
              seedpay_min_prepayment: 0.01,
            }),
          );
          break;

        case "hs:leecher-extended":
          newMessages.push(
            createMessage("leecher-to-seeder", "Extended Handshake (Leecher)", {
              m: { seedpay: 1, ut_metadata: 2 },
              seedpay_supported: true,
            }),
          );
          break;

        case "hs:capability-detected":
          newMessages.push(
            createMessage("system", "SeedPay Negotiated", {
              status: "Both peers support SeedPay",
              price_per_mb: PRICE_PER_MB,
              chain: "solana",
              currency: "USDC",
            }),
          );
          break;

        case "cs:ecdh-leecher-pk":
          crypto.leecherEphemeralPk = LEECHER_EPHEMERAL_PK;
          newMessages.push(
            createMessage("leecher-to-seeder", "ecdh_init", {
              type: "ecdh_init",
              ephemeral_pk: LEECHER_EPHEMERAL_PK,
            }),
          );
          break;

        case "cs:ecdh-seeder-pk":
          crypto.seederEphemeralPk = SEEDER_EPHEMERAL_PK;
          newMessages.push(
            createMessage("seeder-to-leecher", "ecdh_init", {
              type: "ecdh_init",
              ephemeral_pk: SEEDER_EPHEMERAL_PK,
            }),
          );
          break;

        case "cs:shared-secret":
          crypto.sharedSecret = SHARED_SECRET;
          newMessages.push(
            createMessage("system", "Shared Secret Derived", {
              method: "Curve25519 ECDH",
              shared_secret: SHARED_SECRET.slice(0, 16) + "...",
            }),
          );
          break;

        case "cs:session-uuid":
          crypto.sessionUuid = SESSION_UUID;
          crypto.sessionHash = SESSION_HASH;
          newMessages.push(
            createMessage("system", "Session UUID Derived", {
              method: "HKDF-Expand",
              info: "seedpay-v1-session",
              session_uuid: SESSION_UUID,
              session_hash: SESSION_HASH.slice(0, 16) + "...",
            }),
          );
          break;

        case "cs:choose-deposit":
          // No message — user interaction step
          break;

        case "cs:tx-submitted":
          channel = { ...channel, channelId: CHANNEL_ID, status: "open" };
          newMessages.push(
            createMessage("blockchain", "Deposit Transaction", {
              tx_signature: TX_SIGNATURE,
              action: "deposit",
              amount: `${channel.deposit} USDC`,
              escrow_account: CHANNEL_ID,
              memo_session_hash: SESSION_HASH.slice(0, 16) + "...",
              chain: "solana",
              status: "confirmed",
            }),
          );
          break;

        case "cs:channel-opened":
          newMessages.push(
            createMessage("leecher-to-seeder", "channel_opened", {
              type: "channel_opened",
              tx_signature: TX_SIGNATURE,
              channel_id: CHANNEL_ID,
              amount: channel.deposit,
              timestamp: new Date().toISOString(),
            }),
          );
          break;

        case "vf:querying":
          newMessages.push(
            createMessage("system", "Seeder Querying Blockchain", {
              action: "rpc_getAccountInfo",
              account: CHANNEL_ID,
              chain: "solana",
            }),
          );
          break;

        case "vf:check-state":
          newMessages.push(
            createMessage("system", "Check: Channel State", {
              check: "channel_state",
              expected: "Open",
              actual: "Open",
              seeder_wallet_match: true,
              result: "PASS",
            }),
          );
          break;

        case "vf:check-deposit":
          newMessages.push(
            createMessage("system", "Check: Deposit Amount", {
              check: "deposit_amount",
              deposited: channel.deposit,
              min_required: 0.01,
              result: "PASS",
            }),
          );
          break;

        case "vf:check-token":
          newMessages.push(
            createMessage("system", "Check: Token & Chain", {
              check: "token_chain",
              expected_token: "USDC",
              actual_token: "USDC",
              expected_chain: "solana",
              result: "PASS",
            }),
          );
          break;

        case "vf:check-session":
          newMessages.push(
            createMessage("system", "Check: Session Binding", {
              check: "session_binding",
              memo_hash: SESSION_HASH.slice(0, 16) + "...",
              computed_hash: SESSION_HASH.slice(0, 16) + "...",
              match: true,
              result: "PASS",
            }),
          );
          break;

        case "vf:check-freshness":
          newMessages.push(
            createMessage("system", "Check: Freshness", {
              check: "freshness",
              channel_age_seconds: 42,
              max_allowed_seconds: 600,
              result: "PASS",
            }),
          );
          break;

        case "vf:confirmed":
          channel = { ...channel, status: "confirmed" };
          newMessages.push(
            createMessage("seeder-to-leecher", "channel_confirmed", {
              type: "channel_confirmed",
              confirmed: true,
              channel_id: CHANNEL_ID,
              deposit: channel.deposit,
              price_per_mb: PRICE_PER_MB,
              timeout: CHANNEL_TIMEOUT,
            }),
          );
          break;

        case "dt:transferring":
          newMessages.push(
            createMessage("system", "Data Transfer Started", {
              status: "Seeder unchoked leecher",
              mode: "standard BitTorrent piece exchange",
              payment: "off-chain signed checks",
            }),
          );
          break;
      }

      return {
        ...state,
        phase: nextPhase,
        subStep: nextStep,
        messages: newMessages,
        crypto,
        channel,
      };
    }

    case "TRANSFER_TICK": {
      if (state.phase !== "data-transfer") return state;
      if (state.transfer.isChoked) return state;

      const tickMb = 5;
      const tickCost = tickMb * PRICE_PER_MB;
      const newMb = state.transfer.mbDownloaded + tickMb;
      const newCost = state.transfer.totalCost + tickCost;
      const newMbSinceCheck = state.transfer.mbSinceLastCheck + tickMb;
      const newPieces = state.transfer.piecesTransferred + 1;

      const transfer = {
        ...state.transfer,
        mbDownloaded: newMb,
        totalCost: newCost,
        piecesTransferred: newPieces,
        mbSinceLastCheck: newMbSinceCheck,
      };

      // After CHECK_INTERVAL_MB without a check, seeder demands one
      if (newMbSinceCheck >= CHECK_INTERVAL_MB && state.subStep === "dt:transferring") {
        const newMessages = [
          ...state.messages,
          createMessage("seeder-to-leecher", "payment_check_required", {
            type: "payment_check_required",
            required_amount: newCost,
            current_check_amount: state.transfer.lastCheckAmount,
            estimated_remaining_mb: Math.floor(
              (state.channel.deposit - newCost) / PRICE_PER_MB,
            ),
          }),
        ];
        return {
          ...state,
          subStep: "dt:check-required",
          messages: newMessages,
          transfer,
        };
      }

      // After another CHECK_INTERVAL_MB without paying, choke
      if (
        newMbSinceCheck >= CHECK_INTERVAL_MB * 2 &&
        state.subStep === "dt:check-required"
      ) {
        return {
          ...state,
          subStep: "dt:choked",
          transfer: { ...transfer, isChoked: true },
        };
      }

      return { ...state, transfer };
    }

    case "SEND_PAYMENT_CHECK": {
      if (state.phase !== "data-transfer") return state;

      const nonce = state.transfer.lastCheckNonce + 1;
      const amount = state.transfer.totalCost;

      const newMessages = [
        ...state.messages,
        createMessage("leecher-to-seeder", "payment_check", {
          type: "payment_check",
          channel_id: CHANNEL_ID,
          amount: Number(amount.toFixed(4)),
          nonce,
          signature: `ed25519:${SHARED_SECRET.slice(0, 24)}...${nonce}`,
        }),
      ];

      return {
        ...state,
        subStep: "dt:transferring",
        messages: newMessages,
        transfer: {
          ...state.transfer,
          lastCheckAmount: amount,
          lastCheckNonce: nonce,
          isChoked: false,
          mbSinceLastCheck: 0,
        },
      };
    }

    case "CLOSE_CHANNEL": {
      if (state.phase !== "data-transfer") return state;

      const newMessages = [
        ...state.messages,
        createMessage("system", "Closing Channel", {
          action: "cooperative_close",
          final_check_nonce: state.transfer.lastCheckNonce,
          final_amount: Number(state.transfer.totalCost.toFixed(4)),
        }),
      ];

      return {
        ...state,
        phase: "closing",
        subStep: "cl:tx-submitted",
        messages: newMessages,
        transfer: { ...state.transfer, isChoked: true },
      };
    }

    default:
      return state;
  }
}

// Handle closing phase NEXT_STEP separately (called from phase-close)
export function closeReducer(
  state: PlaygroundState,
  action: PlaygroundAction,
): PlaygroundState {
  if (action.type === "RESET") {
    msgCounter = 0;
    return { ...initialState, messages: [] };
  }

  if (action.type !== "NEXT_STEP") return reducer(state, action);

  if (state.subStep === "cl:tx-submitted") {
    const newMessages = [
      ...state.messages,
      createMessage("blockchain", "Channel Closed", {
        tx_signature: `close_${TX_SIGNATURE.slice(0, 20)}`,
        seeder_received: Number(state.transfer.totalCost.toFixed(4)),
        leecher_refund: Number(
          (state.channel.deposit - state.transfer.totalCost).toFixed(4),
        ),
        status: "confirmed",
      }),
    ];
    return {
      ...state,
      subStep: "cl:settled",
      messages: newMessages,
    };
  }

  if (state.subStep === "cl:settled") {
    const newMessages = [
      ...state.messages,
      createMessage("seeder-to-leecher", "channel_closed", {
        type: "channel_closed",
        channel_id: CHANNEL_ID,
        tx_signature: `close_${TX_SIGNATURE.slice(0, 20)}`,
        final_amount: Number(state.transfer.totalCost.toFixed(4)),
        reason: "cooperative_close",
      }),
    ];
    return {
      ...state,
      phase: "closed",
      subStep: "cl:closed",
      messages: newMessages,
      channel: { ...state.channel, status: "closed" },
    };
  }

  return state;
}

function combinedReducer(
  state: PlaygroundState,
  action: PlaygroundAction,
): PlaygroundState {
  if (state.phase === "closing" || state.phase === "closed") {
    return closeReducer(state, action);
  }
  return reducer(state, action);
}

export function usePlaygroundState() {
  return useReducer(combinedReducer, { ...initialState, messages: [] });
}

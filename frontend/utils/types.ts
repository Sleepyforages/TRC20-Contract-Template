// ─── DepoFi shared TypeScript types ────────────────────────────────────────

export interface PoolStatus {
  address:           string;
  borrower:          string;
  amountNeeded:      bigint;   // USDT 6-decimal
  rewardAmount:      bigint;
  maturityTime:      bigint;   // unix timestamp
  totalDeposited:    bigint;
  repaid:            boolean;
  isActive:          boolean;
  borrowerWithdrawn: boolean;
  fundedPct:         number;   // 0-100
  poolBalance:       bigint;
  durationDays?:     number;   // enriched client-side
  rewardPct?:        number;   // enriched client-side
}

export interface LenderPosition {
  poolAddress:    string;
  deposited:      bigint;
  availableClaim: bigint;
  claimed:        boolean;
  maturityTime:   bigint;
}

export type Network = "development" | "nile" | "mainnet";

export interface WalletState {
  address:     string | null;
  isConnected: boolean;
  isOwner:     boolean;
  tronWeb:     any | null;
}

export type DurationDays = 7 | 14 | 21 | 30;

export const REWARD_TIERS: Record<DurationDays, number> = {
  7:  3,
  14: 7,
  21: 11,
  30: 16,
};

// Pool lifecycle states for UI display
export type PoolState =
  | "open"        // accepting deposits, not fully funded
  | "funded"      // 100% funded, borrower hasn't withdrawn
  | "active"      // borrower has withdrawn, term in progress
  | "matured"     // past maturity, awaiting claim
  | "repaid"      // fully repaid, claimable
  | "defaulted"   // past maturity, no liquidity
  | "inactive";   // admin deactivated

export function getPoolState(pool: PoolStatus): PoolState {
  if (!pool.isActive) return "inactive";
  if (!pool.borrowerWithdrawn && pool.fundedPct < 100) return "open";
  if (!pool.borrowerWithdrawn && pool.fundedPct === 100) return "funded";
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (pool.borrowerWithdrawn && pool.maturityTime > now) return "active";
  if (pool.repaid) return "repaid";
  if (pool.poolBalance > 0n) return "matured";
  return "defaulted";
}

export function formatUsdt(raw: bigint): string {
  const usdt = Number(raw) / 1_000_000;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(usdt);
}

export function formatAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function formatCountdown(maturityTime: bigint): string {
  const now = BigInt(Math.floor(Date.now() / 1000));
  if (maturityTime === 0n) return "—";
  if (maturityTime <= now) return "Matured";
  const diff = Number(maturityTime - now);
  const days  = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  if (days > 0) return `${days}d ${hours}h`;
  const mins = Math.floor((diff % 3600) / 60);
  return `${hours}h ${mins}m`;
}

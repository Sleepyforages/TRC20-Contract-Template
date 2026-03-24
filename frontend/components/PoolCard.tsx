"use client";

import { useState } from "react";
import type { PoolStatus } from "@/utils/types";
import {
  getPoolState,
  formatUsdt,
  formatAddress,
  formatCountdown,
  REWARD_TIERS,
} from "@/utils/types";
import { toUsdt, fromUsdt } from "@/utils/tronweb";
import { depositToPool, previewPoolReward } from "@/utils/contracts";
import { txUrl } from "@/utils/constants";

interface Props {
  pool:            PoolStatus;
  walletAddress:   string | null;
  onDepositSuccess: () => void;
}

export default function PoolCard({ pool, walletAddress, onDepositSuccess }: Props) {
  const [expanded,      setExpanded]      = useState(false);
  const [depositInput,  setDepositInput]  = useState("");
  const [previewReward, setPreviewReward] = useState<bigint | null>(null);
  const [depositing,    setDepositing]    = useState(false);
  const [txHash,        setTxHash]        = useState<string | null>(null);
  const [txError,       setTxError]       = useState<string | null>(null);

  const state  = getPoolState(pool);
  const rewardPct = pool.rewardPct ?? REWARD_TIERS[pool.durationDays as 7 | 14 | 21 | 30 ?? 7] ?? 0;

  const stateBadge = {
    open:      <span className="badge-open">Open</span>,
    funded:    <span className="badge-active">Funded</span>,
    active:    <span className="badge-active">Active</span>,
    matured:   <span className="badge-repaid">Matured</span>,
    repaid:    <span className="badge-repaid">Claimable</span>,
    defaulted: <span className="badge-default">Defaulted</span>,
    inactive:  <span className="badge-inactive">Closed</span>,
  }[state];

  const handleDepositPreview = async (val: string) => {
    setDepositInput(val);
    if (!val || isNaN(Number(val))) { setPreviewReward(null); return; }
    try {
      const raw = toUsdt(val);
      const reward = await previewPoolReward(pool.address, raw);
      setPreviewReward(reward);
    } catch { setPreviewReward(null); }
  };

  const handleDeposit = async () => {
    if (!walletAddress || !depositInput) return;
    setDepositing(true);
    setTxError(null);
    setTxHash(null);
    try {
      const amount = toUsdt(depositInput);
      const hash   = await depositToPool(pool.address, amount, walletAddress);
      setTxHash(hash);
      setDepositInput("");
      setPreviewReward(null);
      onDepositSuccess();
    } catch (e: any) {
      setTxError(e?.message ?? "Transaction failed");
    } finally {
      setDepositing(false);
    }
  };

  const remaining = pool.amountNeeded - pool.totalDeposited;
  const canDeposit = state === "open" && !!walletAddress;

  return (
    <div className="card overflow-hidden transition-all duration-200 hover:border-brand-border/80 animate-slide-up">
      {/* Header */}
      <div
        className="p-5 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {stateBadge}
              <span className="text-brand-muted text-xs">
                {pool.durationDays ?? "?"}-day term
              </span>
            </div>
            <p className="text-brand-muted text-xs font-mono">
              {formatAddress(pool.address)}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-gold-glow text-2xl font-bold">{rewardPct}%</p>
            <p className="text-brand-muted text-xs">flat reward</p>
          </div>
        </div>

        {/* Amount & progress */}
        <div className="mb-3">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-white font-semibold">{formatUsdt(pool.amountNeeded)}</span>
            <span className="text-brand-muted">{pool.fundedPct}% funded</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${Math.min(pool.fundedPct, 100)}%` }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          <Stat label="You earn" value={`+${formatUsdt(pool.rewardAmount)}`} gold />
          <Stat label="Maturity" value={formatCountdown(pool.maturityTime)} />
          <Stat label="Available" value={formatUsdt(remaining)} />
        </div>
      </div>

      {/* Expandable deposit section */}
      {expanded && (
        <div className="border-t border-brand-border p-5 animate-fade-in">
          {canDeposit ? (
            <>
              <p className="text-sm text-brand-muted mb-3">
                Deposit USDT into this pool. You'll earn a pro-rata share of the{" "}
                <span className="text-brand-gold font-medium">{rewardPct}%</span> reward after maturity.
              </p>

              <div className="flex gap-2 mb-2">
                <input
                  type="number"
                  className="input"
                  placeholder={`Max ${fromUsdt(remaining)} USDT`}
                  value={depositInput}
                  onChange={e => handleDepositPreview(e.target.value)}
                  min="0"
                  step="1"
                />
                <button
                  onClick={() => handleDepositPreview(fromUsdt(remaining).replace(/,/g, ""))}
                  className="btn-outline text-xs shrink-0 px-3"
                >
                  MAX
                </button>
              </div>

              {/* Live reward preview */}
              {previewReward !== null && depositInput && (
                <div className="bg-brand-gold/5 border border-brand-gold/15 rounded-xl p-3 mb-3 animate-fade-in">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Your deposit</span>
                    <span className="text-white">${depositInput}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-brand-muted">Your reward</span>
                    <span className="text-brand-gold font-medium">+{formatUsdt(previewReward)}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1 border-t border-brand-border/50 pt-1.5">
                    <span className="text-white font-medium">You receive</span>
                    <span className="text-brand-green font-semibold">
                      {formatUsdt(toUsdt(depositInput) + previewReward)}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={handleDeposit}
                disabled={depositing || !depositInput || Number(depositInput) <= 0}
                className="btn-primary w-full"
              >
                {depositing ? "Confirming…" : "Deposit USDT"}
              </button>

              {txHash && (
                <p className="text-brand-green text-xs text-center mt-2 animate-fade-in">
                  ✓ Transaction sent.{" "}
                  <a href={txUrl(txHash)} target="_blank" rel="noopener noreferrer" className="underline">
                    View on TronScan
                  </a>
                </p>
              )}
              {txError && (
                <p className="text-brand-red text-xs text-center mt-2">{txError}</p>
              )}
            </>
          ) : state === "open" && !walletAddress ? (
            <p className="text-brand-muted text-sm text-center">
              Connect your wallet to deposit.
            </p>
          ) : (
            <p className="text-brand-muted text-sm text-center">
              {state === "defaulted"
                ? "This pool has defaulted. No funds available."
                : state === "matured" || state === "repaid"
                ? "Pool is past maturity. Go to My Claims to withdraw."
                : "Deposits are closed for this pool."}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, gold }: { label: string; value: string; gold?: boolean }) {
  return (
    <div className="bg-brand-dark/60 rounded-lg p-2 text-center">
      <p className="text-brand-muted text-[10px] uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${gold ? "text-brand-gold" : "text-white"}`}>{value}</p>
    </div>
  );
}

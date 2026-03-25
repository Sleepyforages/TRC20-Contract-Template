"use client";

import type { LenderPosition, PoolStatus } from "@/utils/types";
import {
  formatUsdt,
  formatAddress,
  formatCountdown,
} from "@/utils/types";

interface Props {
  positions: LenderPosition[];
  pools:     PoolStatus[];
  loading:   boolean;
}

export default function MyDeposits({ positions, pools, loading }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="card p-4 animate-pulse h-20" />
        ))}
      </div>
    );
  }

  const active = positions.filter(p => !p.claimed && p.deposited > 0n);

  if (active.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-brand-muted">No active deposits yet.</p>
        <p className="text-xs text-brand-dim mt-1">
          Browse Open Offers above and deposit USDT to start earning.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {active.map(pos => {
        const pool = pools.find(p => p.address === pos.poolAddress);
        const rewardPct = pool?.rewardPct ?? 0;
        const expectedReturn = pos.deposited + (pool
          ? (pos.deposited * pool.rewardAmount) / pool.amountNeeded
          : 0n);
        const now = BigInt(Math.floor(Date.now() / 1000));
        const matured = pos.maturityTime > 0n && pos.maturityTime <= now;

        return (
          <div key={pos.poolAddress} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            {/* Pool info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-brand-muted truncate">
                  {formatAddress(pos.poolAddress)}
                </span>
                {pool?.durationDays && (
                  <span className="text-xs text-brand-dim shrink-0">
                    {pool.durationDays}-day
                  </span>
                )}
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-brand-muted">Deposited</p>
                  <p className="text-white font-semibold">{formatUsdt(pos.deposited)}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted">Expected return</p>
                  <p className="text-brand-gold font-semibold">{formatUsdt(expectedReturn)}</p>
                </div>
                <div>
                  <p className="text-xs text-brand-muted">Matures in</p>
                  <p className={`font-semibold text-sm ${matured ? "text-brand-green" : "text-white"}`}>
                    {pos.maturityTime === 0n ? "Awaiting withdrawal" : formatCountdown(pos.maturityTime)}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="shrink-0">
              {matured ? (
                <span className="badge-open">Ready to claim</span>
              ) : pos.maturityTime === 0n ? (
                <span className="badge-active">Awaiting borrower</span>
              ) : (
                <span className="badge-active">Earning</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

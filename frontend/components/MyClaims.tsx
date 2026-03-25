"use client";

import { useState } from "react";
import type { LenderPosition, PoolStatus } from "@/utils/types";
import { formatUsdt, formatAddress } from "@/utils/types";
import { claimFromPool } from "@/utils/contracts";
import { txUrl } from "@/utils/constants";

interface Props {
  positions:     LenderPosition[];
  pools:         PoolStatus[];
  walletAddress: string;
  loading:       boolean;
  onClaimed:     () => void;
}

export default function MyClaims({
  positions,
  pools,
  walletAddress,
  loading,
  onClaimed,
}: Props) {
  const [claiming, setClaiming] = useState<string | null>(null);
  const [txMap,    setTxMap]    = useState<Record<string, string>>({});
  const [errMap,   setErrMap]   = useState<Record<string, string>>({});

  const claimable = positions.filter(
    p => !p.claimed && p.availableClaim > 0n
  );
  const claimed   = positions.filter(p => p.claimed);

  const handleClaim = async (poolAddress: string) => {
    setClaiming(poolAddress);
    setErrMap(m => ({ ...m, [poolAddress]: "" }));
    try {
      const hash = await claimFromPool(poolAddress, walletAddress);
      setTxMap(m => ({ ...m, [poolAddress]: hash }));
      onClaimed();
    } catch (e: any) {
      setErrMap(m => ({ ...m, [poolAddress]: e?.message ?? "Claim failed" }));
    } finally {
      setClaiming(null);
    }
  };

  if (loading) {
    return <div className="card p-4 animate-pulse h-24" />;
  }

  if (claimable.length === 0 && claimed.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-brand-muted">Nothing to claim yet.</p>
        <p className="text-xs text-brand-dim mt-1">
          Claims become available after a pool matures and repayment is deposited.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Claimable */}
      {claimable.length > 0 && (
        <div>
          <h3 className="text-sm text-brand-muted font-medium mb-2">Ready to Claim</h3>
          <div className="space-y-3">
            {claimable.map(pos => {
              const pool = pools.find(p => p.address === pos.poolAddress);
              return (
                <div key={pos.poolAddress} className="card p-4 border-brand-green/20 bg-brand-green/5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-brand-muted mb-1">
                        {formatAddress(pos.poolAddress)}
                      </p>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-brand-muted">Your claim</p>
                          <p className="text-brand-green font-bold text-lg">
                            {formatUsdt(pos.availableClaim)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-brand-muted">Principal</p>
                          <p className="text-white font-semibold">{formatUsdt(pos.deposited)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-brand-muted">Reward</p>
                          <p className="text-brand-gold font-semibold">
                            {formatUsdt(
                              pos.availableClaim > pos.deposited
                                ? pos.availableClaim - pos.deposited
                                : 0n
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 space-y-1">
                      <button
                        onClick={() => handleClaim(pos.poolAddress)}
                        disabled={claiming === pos.poolAddress}
                        className="btn-primary w-full sm:w-auto"
                      >
                        {claiming === pos.poolAddress ? "Claiming…" : "Claim USDT"}
                      </button>
                      {txMap[pos.poolAddress] && (
                        <p className="text-brand-green text-xs text-center animate-fade-in">
                          ✓{" "}
                          <a
                            href={txUrl(txMap[pos.poolAddress])}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                          >
                            View tx
                          </a>
                        </p>
                      )}
                      {errMap[pos.poolAddress] && (
                        <p className="text-brand-red text-xs text-center">
                          {errMap[pos.poolAddress]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Already claimed */}
      {claimed.length > 0 && (
        <div>
          <h3 className="text-sm text-brand-muted font-medium mb-2">Claimed</h3>
          <div className="space-y-2">
            {claimed.map(pos => (
              <div key={pos.poolAddress} className="card p-4 opacity-60">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono text-brand-muted">
                    {formatAddress(pos.poolAddress)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{formatUsdt(pos.deposited)}</span>
                    <span className="badge-repaid">Claimed</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

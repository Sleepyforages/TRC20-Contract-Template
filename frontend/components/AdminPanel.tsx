"use client";

import { useState } from "react";
import { adminCreatePool, adminCreateDemoPool } from "@/utils/contracts";
import { toUsdt } from "@/utils/tronweb";
import { txUrl } from "@/utils/constants";
import { REWARD_TIERS, type DurationDays } from "@/utils/types";

interface Props {
  walletAddress: string;
  onCreated:     () => void;
}

const DURATION_OPTIONS: { value: DurationDays; label: string; reward: number }[] = [
  { value: 7,  label: "7 days",  reward: 3  },
  { value: 14, label: "14 days", reward: 7  },
  { value: 21, label: "21 days", reward: 11 },
  { value: 30, label: "30 days", reward: 16 },
];

export default function AdminPanel({ walletAddress, onCreated }: Props) {
  const [amount,    setAmount]    = useState("");
  const [duration,  setDuration]  = useState<DurationDays>(7);
  const [borrower,  setBorrower]  = useState("");
  const [creating,  setCreating]  = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [txHash,    setTxHash]    = useState<string | null>(null);
  const [error,     setError]     = useState<string | null>(null);

  const rewardPct    = REWARD_TIERS[duration];
  const rewardAmount = amount && !isNaN(Number(amount))
    ? (Number(amount) * rewardPct / 100).toFixed(2)
    : "—";
  const totalReturn = amount && !isNaN(Number(amount))
    ? (Number(amount) * (1 + rewardPct / 100)).toFixed(2)
    : "—";

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !borrower) return;
    setCreating(true);
    setError(null);
    setTxHash(null);
    try {
      const amountRaw = toUsdt(amount);
      const hash = await adminCreatePool(amountRaw, duration, borrower, walletAddress);
      setTxHash(hash);
      setAmount("");
      setBorrower("");
      onCreated();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create pool");
    } finally {
      setCreating(false);
    }
  };

  const handleDemo = async () => {
    setDemoLoading(true);
    setError(null);
    setTxHash(null);
    try {
      const hash = await adminCreateDemoPool(walletAddress, walletAddress);
      setTxHash(hash);
      onCreated();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create demo pool");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="card p-6 border-brand-gold/20 bg-brand-gold/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <h2 className="text-lg font-bold text-brand-gold">Admin Panel</h2>
          </div>
          <p className="text-brand-muted text-xs">
            Only visible to the contract owner.
          </p>
        </div>
        {/* Demo button */}
        <button
          onClick={handleDemo}
          disabled={demoLoading}
          className="btn-outline border-brand-gold/30 text-brand-gold text-sm hover:bg-brand-gold/10"
        >
          {demoLoading ? "Creating…" : "⚡ Create Demo Loan"}
        </button>
      </div>

      <p className="text-brand-muted text-xs mb-4">
        Demo: $100 USDT · 3-day term · 1% reward — for instant on-chain testing.
      </p>

      <div className="border-t border-brand-border mb-6" />

      {/* Create pool form */}
      <h3 className="text-white font-semibold mb-4">Create New Loan Offer</h3>
      <form onSubmit={handleCreate} className="space-y-4">
        {/* Amount */}
        <div>
          <label className="text-xs text-brand-muted mb-1.5 block">
            Principal Amount (USDT)
          </label>
          <input
            type="number"
            className="input"
            placeholder="e.g. 50000"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="1"
            step="any"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="text-xs text-brand-muted mb-1.5 block">
            Loan Duration &amp; Reward Tier
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DURATION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDuration(opt.value)}
                className={`rounded-xl py-3 text-center text-sm font-medium border transition-all ${
                  duration === opt.value
                    ? "bg-brand-gold/15 border-brand-gold/50 text-brand-gold"
                    : "border-brand-border text-brand-muted hover:border-brand-border/80"
                }`}
              >
                <span className="block font-bold text-base">{opt.reward}%</span>
                <span className="block text-xs opacity-70">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reward preview */}
        {amount && (
          <div className="bg-brand-dark rounded-xl p-3 border border-brand-border animate-fade-in">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-brand-muted mb-0.5">Principal</p>
                <p className="text-white font-semibold text-sm">${amount}</p>
              </div>
              <div>
                <p className="text-xs text-brand-muted mb-0.5">Total Reward</p>
                <p className="text-brand-gold font-semibold text-sm">${rewardAmount}</p>
              </div>
              <div>
                <p className="text-xs text-brand-muted mb-0.5">Lenders Receive</p>
                <p className="text-brand-green font-semibold text-sm">${totalReturn}</p>
              </div>
            </div>
          </div>
        )}

        {/* Borrower address */}
        <div>
          <label className="text-xs text-brand-muted mb-1.5 block">
            Approved Borrower Address (Tron base58)
          </label>
          <input
            type="text"
            className="input font-mono text-sm"
            placeholder="T…"
            value={borrower}
            onChange={e => setBorrower(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={creating || !amount || !borrower}
          className="btn-primary w-full"
        >
          {creating ? "Deploying Pool…" : "Deploy Loan Pool"}
        </button>

        {txHash && (
          <p className="text-brand-green text-xs text-center animate-fade-in">
            ✓ Pool created.{" "}
            <a href={txUrl(txHash)} target="_blank" rel="noopener noreferrer" className="underline">
              View on TronScan
            </a>
          </p>
        )}
        {error && (
          <p className="text-brand-red text-xs text-center">{error}</p>
        )}
      </form>
    </div>
  );
}

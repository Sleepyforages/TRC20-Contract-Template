"use client";

import { useState } from "react";
import { REWARD_TIERS, type DurationDays } from "@/utils/types";

export default function RewardCalculator() {
  const [amount,   setAmount]   = useState("1000");
  const [duration, setDuration] = useState<DurationDays>(14);

  const rewardPct = REWARD_TIERS[duration];
  const reward    = (Number(amount || 0) * rewardPct / 100);
  const total     = Number(amount || 0) + reward;
  const daily     = reward / duration;

  return (
    <div className="card p-5">
      <h3 className="text-white font-semibold mb-4">Reward Calculator</h3>

      <div className="space-y-4">
        {/* Amount input */}
        <div>
          <label className="text-xs text-brand-muted mb-1.5 block">Deposit Amount (USDT)</label>
          <input
            type="number"
            className="input"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min="0"
            step="100"
          />
        </div>

        {/* Duration selector */}
        <div>
          <label className="text-xs text-brand-muted mb-1.5 block">Term</label>
          <div className="grid grid-cols-4 gap-1.5">
            {(Object.entries(REWARD_TIERS) as [string, number][]).map(([d, r]) => (
              <button
                key={d}
                type="button"
                onClick={() => setDuration(Number(d) as DurationDays)}
                className={`rounded-lg py-2 text-xs font-medium border transition-all ${
                  duration === Number(d)
                    ? "bg-brand-gold/15 border-brand-gold/40 text-brand-gold"
                    : "border-brand-border text-brand-muted hover:text-white"
                }`}
              >
                <span className="block font-bold text-sm">{r}%</span>
                <span className="block opacity-70">{d}d</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {amount && Number(amount) > 0 && (
          <div className="bg-brand-dark rounded-xl p-4 border border-brand-border animate-fade-in space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">You deposit</span>
              <span className="text-white">${Number(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Flat reward</span>
              <span className="text-brand-gold font-medium">+${reward.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-brand-muted">Daily equivalent</span>
              <span className="text-white">${daily.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/day</span>
            </div>
            <div className="border-t border-brand-border pt-2 flex justify-between">
              <span className="text-white font-semibold">You receive</span>
              <span className="text-gold-glow font-bold text-lg">
                ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

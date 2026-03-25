"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar        from "@/components/Navbar";
import PoolCard      from "@/components/PoolCard";
import AdminPanel    from "@/components/AdminPanel";
import MyDeposits    from "@/components/MyDeposits";
import MyClaims      from "@/components/MyClaims";
import RewardCalculator from "@/components/RewardCalculator";
import { useWallet } from "@/hooks/useWallet";
import { usePools, useLenderPositions } from "@/hooks/usePools";
import { getPoolState } from "@/utils/types";
import { FACTORY_ADDRESS } from "@/utils/constants";

type Tab = "offers" | "deposits" | "claims";

export default function Dashboard() {
  const router = useRouter();
  const wallet = useWallet();
  const [tab, setTab] = useState<Tab>("offers");

  const { pools, loading: poolsLoading, refresh: refreshPools } = usePools();
  const poolAddresses = pools.map(p => p.address);
  const { positions, loading: posLoading, refresh: refreshPositions } =
    useLenderPositions(wallet.address, poolAddresses);

  // Gate: redirect to home if not unlocked
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("depofi_unlocked") !== "1") {
        router.replace("/");
      }
    }
  }, [router]);

  // Stats
  const openPools   = pools.filter(p => getPoolState(p) === "open").length;
  const totalLocked = pools.reduce((s, p) => s + Number(p.totalDeposited), 0) / 1_000_000;
  const myDeposited = positions.reduce((s, p) => s + Number(p.deposited), 0) / 1_000_000;
  const myClaimable = positions.filter(p => !p.claimed && p.availableClaim > 0n)
    .reduce((s, p) => s + Number(p.availableClaim), 0) / 1_000_000;

  const onAction = () => {
    refreshPools();
    refreshPositions();
  };

  const notDeployed = !FACTORY_ADDRESS;

  return (
    <div className="min-h-screen">
      <Navbar wallet={wallet} />

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Setup banner */}
        {notDeployed && (
          <div className="card p-4 border-brand-amber/30 bg-brand-amber/5">
            <p className="text-brand-amber text-sm">
              <strong>Setup required:</strong> Add{" "}
              <code className="bg-brand-dark px-1 rounded text-xs">NEXT_PUBLIC_LOAN_FACTORY_ADDRESS</code>{" "}
              to your <code className="bg-brand-dark px-1 rounded text-xs">.env.local</code> file after deploying contracts.
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Open Offers"   value={String(openPools)} />
          <StatCard label="Total Locked"  value={`$${totalLocked.toLocaleString("en-US", { maximumFractionDigits: 0 })}`} gold />
          <StatCard label="My Deposits"   value={`$${myDeposited.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} />
          <StatCard label="My Claimable"  value={`$${myClaimable.toLocaleString("en-US", { minimumFractionDigits: 2 })}`} green={myClaimable > 0} />
        </div>

        {/* Admin panel */}
        {wallet.isOwner && wallet.address && (
          <AdminPanel walletAddress={wallet.address} onCreated={onAction} />
        )}

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: tabs */}
          <div className="lg:col-span-2 space-y-4">
            {/* Tab bar */}
            <div className="flex gap-1 bg-brand-card border border-brand-border rounded-xl p-1">
              {(["offers", "deposits", "claims"] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    tab === t
                      ? "bg-brand-gold/10 text-brand-gold"
                      : "text-brand-muted hover:text-white"
                  }`}
                >
                  {t === "offers"   ? "Open Offers"  : ""}
                  {t === "deposits" ? "My Deposits"  : ""}
                  {t === "claims"   ? `My Claims${myClaimable > 0 ? " ✦" : ""}` : ""}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {tab === "offers" && (
              <div className="space-y-3">
                {poolsLoading ? (
                  <>
                    {[1, 2, 3].map(i => (
                      <div key={i} className="card p-5 h-32 animate-pulse" />
                    ))}
                  </>
                ) : pools.filter(p => p.isActive).length === 0 ? (
                  <div className="card p-10 text-center">
                    <p className="text-brand-muted">No active loan offers yet.</p>
                    {wallet.isOwner && (
                      <p className="text-xs text-brand-dim mt-1">
                        Use the Admin Panel above to create the first pool.
                      </p>
                    )}
                  </div>
                ) : (
                  pools
                    .filter(p => p.isActive)
                    .map(pool => (
                      <PoolCard
                        key={pool.address}
                        pool={pool}
                        walletAddress={wallet.address}
                        onDepositSuccess={onAction}
                      />
                    ))
                )}
              </div>
            )}

            {tab === "deposits" && (
              <MyDeposits
                positions={positions}
                pools={pools}
                loading={posLoading}
              />
            )}

            {tab === "claims" && wallet.address && (
              <MyClaims
                positions={positions}
                pools={pools}
                walletAddress={wallet.address}
                loading={posLoading}
                onClaimed={onAction}
              />
            )}

            {(tab === "deposits" || tab === "claims") && !wallet.address && (
              <div className="card p-8 text-center">
                <p className="text-brand-muted text-sm">
                  Connect your wallet to view your positions.
                </p>
                <button onClick={wallet.connect} className="btn-primary mt-4">
                  Connect Wallet
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <RewardCalculator />

            {/* How it works */}
            <div className="card p-5">
              <h3 className="text-white font-semibold mb-3">How it works</h3>
              <ol className="space-y-3">
                {[
                  { n: 1, text: "Connect your TronLink wallet." },
                  { n: 2, text: "Browse open offers. Pick a term (7–30 days) and deposit USDT." },
                  { n: 3, text: "Pool fills to 100%. Business withdraws principal and deploys capital." },
                  { n: 4, text: "After the loan term, business repays principal + flat reward." },
                  { n: 5, text: "You claim your share. Pro-rata, on-chain, no middleman." },
                ].map(item => (
                  <li key={item.n} className="flex gap-3 text-sm text-brand-muted">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-brand-gold/15 text-brand-gold text-xs flex items-center justify-center font-bold">
                      {item.n}
                    </span>
                    {item.text}
                  </li>
                ))}
              </ol>
            </div>

            {/* Risk notice */}
            <div className="card p-4 border-brand-red/20 bg-brand-red/5">
              <p className="text-brand-red text-xs font-medium mb-1">⚠ Risk Disclosure</p>
              <p className="text-brand-muted text-xs">
                Zero collateral. Lenders accept 100% risk of principal loss. Only
                deposit what you can afford to lose. This is not financial advice.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  gold,
  green,
}: {
  label: string;
  value: string;
  gold?:  boolean;
  green?: boolean;
}) {
  return (
    <div className="card p-4">
      <p className="text-xs text-brand-muted mb-1">{label}</p>
      <p
        className={`text-xl font-bold ${
          gold  ? "text-brand-gold" :
          green ? "text-brand-green" :
          "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

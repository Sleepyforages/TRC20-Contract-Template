"use client";

import type { WalletState } from "@/utils/types";
import { formatAddress } from "@/utils/types";

interface Props {
  wallet: WalletState & {
    loading:    boolean;
    connect:    () => void;
    disconnect: () => void;
  };
}

export default function WalletConnect({ wallet }: Props) {
  if (wallet.loading) {
    return (
      <div className="h-9 w-28 rounded-xl bg-brand-border animate-pulse" />
    );
  }

  if (wallet.isConnected && wallet.address) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-brand-card border border-brand-border rounded-xl px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse-slow" />
          <span className="text-sm font-mono text-white">
            {formatAddress(wallet.address)}
          </span>
        </div>
        <button
          onClick={wallet.disconnect}
          className="text-brand-muted hover:text-white text-xs px-2 py-1.5 rounded-lg hover:bg-brand-border transition-colors"
          title="Disconnect"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={wallet.connect}
      className="btn-primary text-sm py-2 px-4"
    >
      Connect Wallet
    </button>
  );
}

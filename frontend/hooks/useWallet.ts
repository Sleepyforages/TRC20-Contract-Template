"use client";

import { useState, useEffect, useCallback } from "react";
import {
  connectTronLink,
  getConnectedAddress,
  isTronLinkReady,
} from "@/utils/tronweb";
import { getFactoryOwner } from "@/utils/contracts";
import type { WalletState } from "@/utils/types";

const DEFAULT_STATE: WalletState = {
  address:     null,
  isConnected: false,
  isOwner:     false,
  tronWeb:     null,
};

export function useWallet() {
  const [state, setState] = useState<WalletState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  const refreshOwner = useCallback(async (address: string) => {
    try {
      const owner = await getFactoryOwner();
      setState(prev => ({
        ...prev,
        isOwner: owner.toLowerCase() === address.toLowerCase(),
      }));
    } catch {
      // factory not deployed yet – no owner check
    }
  }, []);

  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const address = await connectTronLink();
      if (!address) {
        setError("TronLink not found or access denied. Please install TronLink and try again.");
        return;
      }
      const tronWeb = (window as any).tronWeb;
      setState({
        address,
        isConnected: true,
        isOwner:     false,
        tronWeb,
      });
      await refreshOwner(address);
    } catch (e: any) {
      setError(e?.message ?? "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  }, [refreshOwner]);

  const disconnect = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  // Auto-connect if TronLink is already ready
  useEffect(() => {
    let cancelled = false;
    const tryAutoConnect = async () => {
      const ready = await isTronLinkReady();
      if (!ready || cancelled) return;
      const address = getConnectedAddress();
      if (!address) return;
      const tronWeb = (window as any).tronWeb;
      if (!cancelled) {
        setState({ address, isConnected: true, isOwner: false, tronWeb });
        await refreshOwner(address);
      }
    };
    // Slight delay to let TronLink inject
    setTimeout(tryAutoConnect, 500);
    return () => { cancelled = true; };
  }, [refreshOwner]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: any) => {
      const address = e?.detail?.address ?? e?.data?.message?.action === "accountsChanged"
        ? e?.data?.message?.data?.address
        : null;
      if (address) {
        setState(prev => ({ ...prev, address, isConnected: true }));
        refreshOwner(address);
      } else {
        setState(DEFAULT_STATE);
      }
    };

    window.addEventListener("message", (e) => {
      if (e?.data?.message?.action === "accountsChanged") handler(e);
      if (e?.data?.message?.action === "connect")         handler(e);
    });
  }, [refreshOwner]);

  return { ...state, loading, error, connect, disconnect };
}

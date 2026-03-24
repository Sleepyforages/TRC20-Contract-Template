"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchAllPools, fetchLenderPositions } from "@/utils/contracts";
import { getPool } from "@/utils/contracts";
import { watchEvent } from "@/utils/tronweb";
import type { PoolStatus, LenderPosition } from "@/utils/types";

// ─── All pools ────────────────────────────────────────────────────────────────

export function usePools() {
  const [pools,   setPools]   = useState<PoolStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllPools();
      setPools(data.reverse()); // newest first
    } catch (e: any) {
      setError(e?.message ?? "Failed to load pools");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
    // Poll every 30s for live updates
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  return { pools, loading, error, refresh };
}

// ─── Lender positions ─────────────────────────────────────────────────────────

export function useLenderPositions(address: string | null, poolAddresses: string[]) {
  const [positions, setPositions] = useState<LenderPosition[]>([]);
  const [loading,   setLoading]   = useState(false);

  const refresh = useCallback(async () => {
    if (!address || poolAddresses.length === 0) {
      setPositions([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchLenderPositions(address, poolAddresses);
      setPositions(data);
    } catch {
      setPositions([]);
    } finally {
      setLoading(false);
    }
  }, [address, poolAddresses.join(",")]);

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  return { positions, loading, refresh };
}

// ─── Single pool with live event listener ────────────────────────────────────

export function usePool(address: string | null) {
  const [pool,    setPool]    = useState<PoolStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!address) return;
    try {
      const { fetchPoolStatus } = await import("@/utils/contracts");
      const data = await fetchPoolStatus(address);
      setPool(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (!address) return;
    refresh();

    // Subscribe to Deposited events for live funded % update
    let contract: any;
    try {
      contract = getPool(address);
      watchEvent(contract, "Deposited", () => refresh());
      watchEvent(contract, "Repaid",    () => refresh());
      watchEvent(contract, "Claimed",   () => refresh());
    } catch { /* TronLink not ready yet */ }

    const id = setInterval(refresh, 15_000);
    return () => clearInterval(id);
  }, [address, refresh]);

  return { pool, loading, refresh };
}

"use client";

import { TRON_FULL_HOST, NETWORK } from "./constants";

declare global {
  interface Window {
    tronWeb?:  any;
    tronLink?: any;
  }
}

// ─── TronWeb helpers ─────────────────────────────────────────────────────────

/** Returns the TronWeb instance injected by TronLink, or null. */
export function getInjectedTronWeb(): any | null {
  if (typeof window === "undefined") return null;
  return window.tronWeb ?? null;
}

/** Returns true if TronLink is installed and wallet is unlocked/ready. */
export async function isTronLinkReady(): Promise<boolean> {
  const tw = getInjectedTronWeb();
  if (!tw) return false;
  return Boolean(tw.ready);
}

/** Requests account access from TronLink. Returns connected address or null. */
export async function connectTronLink(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  // TronLink v3+ exposes tronLink.request
  if (window.tronLink?.request) {
    try {
      await window.tronLink.request({ method: "tron_requestAccounts" });
    } catch {
      return null;
    }
  }

  const tw = getInjectedTronWeb();
  if (!tw?.ready) return null;
  return tw.defaultAddress?.base58 ?? null;
}

/** Returns the current connected wallet address, or null. */
export function getConnectedAddress(): string | null {
  const tw = getInjectedTronWeb();
  if (!tw?.ready) return null;
  return tw.defaultAddress?.base58 ?? null;
}

/**
 * Returns a TronWeb contract instance for the given address and ABI.
 * Uses the injected TronLink provider when available.
 */
export function getContract(abi: readonly any[], address: string): any {
  const tw = getInjectedTronWeb();
  if (!tw) throw new Error("TronLink not installed");
  return tw.contract(abi, address);
}

/** Convert USDT display amount (e.g. "100") to 6-decimal bigint. */
export function toUsdt(display: string | number): bigint {
  const n = typeof display === "string" ? parseFloat(display) : display;
  return BigInt(Math.round(n * 1_000_000));
}

/** Convert 6-decimal raw amount to display string. */
export function fromUsdt(raw: bigint | string | number): string {
  const n = BigInt(raw);
  const usdt = Number(n) / 1_000_000;
  return usdt.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Convert hex or base58 address to the other format using TronWeb. */
export function toHex(base58: string): string {
  const tw = getInjectedTronWeb();
  if (!tw) return base58;
  return tw.address.toHex(base58);
}

/** Subscribe to a contract event and call `handler` on each new event. */
export function watchEvent(
  contract: any,
  eventName: string,
  handler: (err: any, event: any) => void
): void {
  try {
    contract[eventName]().watch(handler);
  } catch (e) {
    console.warn(`[DepoFi] Could not watch event ${eventName}:`, e);
  }
}

/**
 * Approve the pool contract to spend `amount` USDT on behalf of the signer.
 * Checks existing allowance first to avoid unnecessary transactions.
 */
export async function ensureApproval(
  usdtContract: any,
  spender: string,
  amount: bigint,
  owner: string
): Promise<void> {
  const current = BigInt(await usdtContract.allowance(owner, spender).call());
  if (current >= amount) return;
  const tx = await usdtContract.approve(spender, amount.toString()).send({
    feeLimit: 100_000_000,
  });
  // Wait for confirmation
  await pollTx(tx);
}

/** Poll tronweb until a tx is confirmed (max 60s). */
export async function pollTx(txHash: string, maxMs = 60_000): Promise<void> {
  const tw = getInjectedTronWeb();
  if (!tw) return;
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    await new Promise(r => setTimeout(r, 2_000));
    const info = await tw.trx.getTransactionInfo(txHash).catch(() => null);
    if (info?.receipt?.result === "SUCCESS") return;
    if (info?.receipt?.result === "FAILED") throw new Error("Transaction failed");
  }
  throw new Error("Transaction timed out");
}

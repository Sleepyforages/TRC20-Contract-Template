"use client";

import {
  FACTORY_ADDRESS,
  LOAN_FACTORY_ABI_MINIMAL,
  LOAN_POOL_ABI_MINIMAL,
  ERC20_ABI_MINIMAL,
  USDT_ADDRESS,
  NETWORK,
} from "./constants";
import { getContract, ensureApproval, pollTx } from "./tronweb";
import type { PoolStatus, LenderPosition } from "./types";
import { REWARD_TIERS } from "./types";

// ─── Contract instances ───────────────────────────────────────────────────────

export function getFactory() {
  return getContract([...LOAN_FACTORY_ABI_MINIMAL], FACTORY_ADDRESS);
}

export function getPool(address: string) {
  return getContract([...LOAN_POOL_ABI_MINIMAL], address);
}

export function getUsdt() {
  return getContract([...ERC20_ABI_MINIMAL], USDT_ADDRESS[NETWORK]);
}

// ─── Pool data fetching ───────────────────────────────────────────────────────

export async function fetchAllPools(): Promise<PoolStatus[]> {
  const factory = getFactory();
  const addresses: string[] = await factory.getAllPools().call();
  return Promise.all(addresses.map(fetchPoolStatus));
}

export async function fetchPoolStatus(address: string): Promise<PoolStatus> {
  const pool = getPool(address);

  const [status, durationRaw] = await Promise.all([
    pool.getPoolStatus().call(),
    pool.durationDays().call(),
  ]);

  const duration = Number(durationRaw) as 7 | 14 | 21 | 30;
  const rewardPct = REWARD_TIERS[duration] ?? 0;

  return {
    address,
    borrower:          status.borrower,
    amountNeeded:      BigInt(status.amountNeeded),
    rewardAmount:      BigInt(status.rewardAmount),
    maturityTime:      BigInt(status.maturityTime),
    totalDeposited:    BigInt(status.totalDeposited),
    repaid:            status.repaid,
    isActive:          status.isActive,
    borrowerWithdrawn: status.borrowerWithdrawn,
    fundedPct:         Number(status.fundedPct),
    poolBalance:       BigInt(status.poolBalance),
    durationDays:      duration,
    rewardPct,
  };
}

export async function fetchLenderPositions(
  lender: string,
  poolAddresses: string[]
): Promise<LenderPosition[]> {
  const results = await Promise.all(
    poolAddresses.map(async (addr) => {
      const pool = getPool(addr);
      const [sharesRaw, claimableRaw, claimed, statusRaw] = await Promise.all([
        pool.lenderShares(lender).call(),
        pool.availableToClaim(lender).call(),
        pool.hasClaimed(lender).call(),
        pool.getPoolStatus().call(),
      ]);
      return {
        poolAddress:    addr,
        deposited:      BigInt(sharesRaw),
        availableClaim: BigInt(claimableRaw),
        claimed,
        maturityTime:   BigInt(statusRaw.maturityTime),
      } as LenderPosition;
    })
  );
  return results.filter(p => p.deposited > 0n);
}

// ─── Transaction helpers ──────────────────────────────────────────────────────

export async function depositToPool(
  poolAddress: string,
  amount: bigint,
  from: string
): Promise<string> {
  const usdt = getUsdt();
  await ensureApproval(usdt, poolAddress, amount, from);

  const pool = getPool(poolAddress);
  const txHash = await pool.deposit(amount.toString()).send({
    from,
    feeLimit: 200_000_000,
    shouldPollResponse: false,
  });
  return txHash;
}

export async function claimFromPool(
  poolAddress: string,
  from: string
): Promise<string> {
  const pool = getPool(poolAddress);
  const txHash = await pool.lenderClaim().send({
    from,
    feeLimit: 200_000_000,
    shouldPollResponse: false,
  });
  return txHash;
}

export async function repayPool(
  poolAddress: string,
  totalAmount: bigint,
  from: string
): Promise<string> {
  const usdt = getUsdt();
  await ensureApproval(usdt, poolAddress, totalAmount, from);

  const pool = getPool(poolAddress);
  const txHash = await pool.repay().send({
    from,
    feeLimit: 200_000_000,
    shouldPollResponse: false,
  });
  return txHash;
}

export async function borrowerWithdrawPool(
  poolAddress: string,
  from: string
): Promise<string> {
  const pool = getPool(poolAddress);
  const txHash = await pool.borrowerWithdraw().send({
    from,
    feeLimit: 200_000_000,
    shouldPollResponse: false,
  });
  return txHash;
}

// ─── Admin actions ────────────────────────────────────────────────────────────

export async function adminCreatePool(
  amountNeeded: bigint,
  durationDays: number,
  borrower: string,
  from: string
): Promise<string> {
  const factory = getFactory();
  const txHash = await factory
    .createLoanPool(amountNeeded.toString(), durationDays, borrower)
    .send({ from, feeLimit: 500_000_000, shouldPollResponse: false });
  return txHash;
}

export async function adminCreateDemoPool(
  borrower: string,
  from: string
): Promise<string> {
  const factory = getFactory();
  const txHash = await factory
    .createDemoPool(borrower)
    .send({ from, feeLimit: 500_000_000, shouldPollResponse: false });
  return txHash;
}

export async function getFactoryOwner(): Promise<string> {
  const factory = getFactory();
  return factory.owner().call();
}

export async function previewPoolReward(
  poolAddress: string,
  depositAmount: bigint
): Promise<bigint> {
  const pool = getPool(poolAddress);
  const raw = await pool.previewReward(depositAmount.toString()).call();
  return BigInt(raw);
}

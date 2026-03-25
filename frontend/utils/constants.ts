// ─── DepoFi contract addresses & network config ─────────────────────────────

export const PASSCODE = process.env.NEXT_PUBLIC_PASSCODE ?? "admin25";

export const NETWORK = (process.env.NEXT_PUBLIC_NETWORK ?? "nile") as
  | "development"
  | "nile"
  | "mainnet";

// USDT TRC20 mainnet: TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
export const USDT_ADDRESS: Record<string, string> = {
  development: process.env.NEXT_PUBLIC_USDT_ADDRESS_DEV   ?? "",
  nile:        process.env.NEXT_PUBLIC_USDT_ADDRESS_NILE  ?? "TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf",
  mainnet:     process.env.NEXT_PUBLIC_USDT_ADDRESS_MAINNET ?? "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
};

export const FACTORY_ADDRESS =
  process.env.NEXT_PUBLIC_LOAN_FACTORY_ADDRESS ?? "";

export const ROUTER_ADDRESS =
  process.env.NEXT_PUBLIC_DEPOFI_ROUTER_ADDRESS ?? "";

// ─── TronGrid API ────────────────────────────────────────────────────────────
export const TRON_FULL_HOST: Record<string, string> = {
  development: "http://127.0.0.1:9090",
  nile:        "https://nile.trongrid.io",
  mainnet:     "https://api.trongrid.io",
};

export const TRON_SCAN_BASE: Record<string, string> = {
  development: "https://nile.tronscan.org/#",
  nile:        "https://nile.tronscan.org/#",
  mainnet:     "https://tronscan.org/#",
};

export function txUrl(txHash: string): string {
  return `${TRON_SCAN_BASE[NETWORK]}/transaction/${txHash}`;
}

export function addressUrl(addr: string): string {
  return `${TRON_SCAN_BASE[NETWORK]}/address/${addr}`;
}

// ─── ABI fragments ──────────────────────────────────────────────────────────
// Full ABIs are loaded dynamically from build/contracts/*.json
// These minimal fragments are used for direct tronweb.contract calls.

export const LOAN_POOL_ABI_MINIMAL = [
  // deposit
  { inputs:[{name:"usdtAmount",type:"uint256"}], name:"deposit",  outputs:[], stateMutability:"nonpayable", type:"function" },
  // borrowerWithdraw
  { inputs:[], name:"borrowerWithdraw", outputs:[], stateMutability:"nonpayable", type:"function" },
  // repay
  { inputs:[], name:"repay", outputs:[], stateMutability:"nonpayable", type:"function" },
  // lenderClaim
  { inputs:[], name:"lenderClaim", outputs:[], stateMutability:"nonpayable", type:"function" },
  // getPoolStatus
  { inputs:[], name:"getPoolStatus", outputs:[
    {name:"borrower",type:"address"},{name:"amountNeeded",type:"uint256"},
    {name:"rewardAmount",type:"uint256"},{name:"maturityTime",type:"uint256"},
    {name:"totalDeposited",type:"uint256"},{name:"repaid",type:"bool"},
    {name:"isActive",type:"bool"},{name:"borrowerWithdrawn",type:"bool"},
    {name:"fundedPct",type:"uint256"},{name:"poolBalance",type:"uint256"},
  ], stateMutability:"view", type:"function" },
  // previewReward
  { inputs:[{name:"depositAmount",type:"uint256"}], name:"previewReward", outputs:[{name:"",type:"uint256"}], stateMutability:"view", type:"function" },
  // availableToClaim
  { inputs:[{name:"lender",type:"address"}], name:"availableToClaim", outputs:[{name:"",type:"uint256"}], stateMutability:"view", type:"function" },
  // lenderShares
  { inputs:[{name:"",type:"address"}], name:"lenderShares", outputs:[{name:"",type:"uint256"}], stateMutability:"view", type:"function" },
  // hasClaimed
  { inputs:[{name:"",type:"address"}], name:"hasClaimed", outputs:[{name:"",type:"bool"}], stateMutability:"view", type:"function" },
  // durationDays
  { inputs:[], name:"durationDays", outputs:[{name:"",type:"uint8"}], stateMutability:"view", type:"function" },
  // Events
  { anonymous:false, inputs:[{indexed:true,name:"lender",type:"address"},{indexed:false,name:"amount",type:"uint256"},{indexed:false,name:"newTotal",type:"uint256"}], name:"Deposited", type:"event" },
  { anonymous:false, inputs:[{indexed:true,name:"lender",type:"address"},{indexed:false,name:"principal",type:"uint256"},{indexed:false,name:"reward",type:"uint256"},{indexed:false,name:"total",type:"uint256"}], name:"Claimed", type:"event" },
  { anonymous:false, inputs:[{indexed:true,name:"repayer",type:"address"},{indexed:false,name:"amount",type:"uint256"}], name:"Repaid", type:"event" },
] as const;

export const LOAN_FACTORY_ABI_MINIMAL = [
  { inputs:[{name:"amountNeeded",type:"uint256"},{name:"durationDays_",type:"uint8"},{name:"borrower",type:"address"}], name:"createLoanPool", outputs:[{name:"pool",type:"address"}], stateMutability:"nonpayable", type:"function" },
  { inputs:[{name:"borrower",type:"address"}], name:"createDemoPool", outputs:[{name:"pool",type:"address"}], stateMutability:"nonpayable", type:"function" },
  { inputs:[], name:"getAllPools", outputs:[{name:"",type:"address[]"}], stateMutability:"view", type:"function" },
  { inputs:[], name:"getPoolCount", outputs:[{name:"",type:"uint256"}], stateMutability:"view", type:"function" },
  { inputs:[{name:"index",type:"uint256"}], name:"getPool", outputs:[{name:"",type:"address"}], stateMutability:"view", type:"function" },
  { inputs:[], name:"owner", outputs:[{name:"",type:"address"}], stateMutability:"view", type:"function" },
  { inputs:[{name:"",type:"uint8"}], name:"rewardBps", outputs:[{name:"",type:"uint256"}], stateMutability:"view", type:"function" },
  { anonymous:false, inputs:[{indexed:true,name:"pool",type:"address"},{indexed:true,name:"borrower",type:"address"},{indexed:false,name:"amountNeeded",type:"uint256"},{indexed:false,name:"durationDays",type:"uint8"},{indexed:false,name:"rewardBps_",type:"uint256"},{indexed:true,name:"poolIndex",type:"uint256"}], name:"LoanPoolCreated", type:"event" },
] as const;

export const ERC20_ABI_MINIMAL = [
  { inputs:[{name:"spender",type:"address"},{name:"amount",type:"uint256"}], name:"approve", outputs:[{name:"",type:"bool"}], stateMutability:"nonpayable", type:"function" },
  { inputs:[{name:"account",type:"address"}], name:"balanceOf", outputs:[{name:"",type:"uint256"}], stateMutability:"view", type:"function" },
  { inputs:[{name:"owner",type:"address"},{name:"spender",type:"address"}], name:"allowance", outputs:[{name:"",type:"uint256"}], stateMutability:"view", type:"function" },
] as const;

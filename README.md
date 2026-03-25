# DepoFi — Invite-Only USDT Lending Protocol on Tron

> **Members-only, fully decentralized, short-term USDT lending.
> Up to 16% flat reward in 30 days. One contract per loan. Zero intermediaries.**

---

## Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Folder Structure](#2-folder-structure)
3. [Smart Contract Reference](#3-smart-contract-reference)
4. [Reward Tiers](#4-reward-tiers)
5. [How to Run Locally](#5-how-to-run-locally)
6. [Run Tests](#6-run-tests)
7. [Deploy to Nile Testnet](#7-deploy-to-nile-testnet)
8. [Deploy to Mainnet](#8-deploy-to-mainnet)
9. [Frontend Setup](#9-frontend-setup)
10. [Verify on TronScan](#10-verify-on-tronscan)
11. [Security Checklist](#11-security-checklist)
12. [Slither Recommendations](#12-slither-recommendations)

---

## 1. Architecture Overview

```
Admin (owner)
    │
    ▼
LoanFactory (UUPS proxy)
    │  createLoanPool(amountNeeded, durationDays, borrower)
    │  createDemoPool(borrower)
    │
    ├──► LoanPool clone A  ◄── lenders deposit
    ├──► LoanPool clone B  ◄── lenders deposit
    └──► LoanPool clone N  ...

DepoFiRouter (UUPS proxy)
    └── getAllPoolSnapshots() / getLenderPortfolio()  → frontend reads
```

**Key invariants:**
- Every loan = its own isolated `LoanPool` contract (EIP-1167 clone)
- Borrowers are whitelisted per-pool by admin
- Lenders are fully permissionless
- Pro-rata claim distribution uses `shares / totalShares * poolBalance`
- Maturity clock starts **when borrower withdraws** (not at pool creation)

---

## 2. Folder Structure

```
depofi/
├── contracts/
│   ├── interfaces/
│   │   └── ILoanPool.sol          ← shared interface + events/errors
│   ├── mocks/
│   │   └── MockUSDT.sol           ← test helper (6-decimal ERC20)
│   ├── LoanPool.sol               ← per-loan isolated pool (cloned)
│   ├── LoanFactory.sol            ← UUPS factory – deploys clones
│   └── DepoFiRouter.sol           ← UUPS read aggregator for frontend
│
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy_depofi.js         ← deploys impl + UUPS proxies
│
├── test/
│   └── DepoFi.test.js             ← Mocha/Chai full test suite
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               ← passcode gate
│   │   ├── dashboard/page.tsx     ← main UI
│   │   └── apply/page.tsx         ← static borrower application page
│   ├── components/
│   │   ├── PasscodeGate.tsx
│   │   ├── Navbar.tsx
│   │   ├── WalletConnect.tsx
│   │   ├── PoolCard.tsx           ← deposit UI + live calculator
│   │   ├── AdminPanel.tsx         ← owner-only create/demo buttons
│   │   ├── MyDeposits.tsx
│   │   ├── MyClaims.tsx
│   │   └── RewardCalculator.tsx
│   ├── hooks/
│   │   ├── useWallet.ts           ← TronLink connection
│   │   └── usePools.ts            ← pool data + event listeners
│   ├── utils/
│   │   ├── types.ts               ← shared TS types + formatters
│   │   ├── constants.ts           ← addresses + ABI fragments
│   │   ├── tronweb.ts             ← TronWeb helpers
│   │   └── contracts.ts           ← contract interaction layer
│   └── package.json
│
├── tronbox.js                     ← network config
├── package.json
├── .env.example
└── README.md
```

---

## 3. Smart Contract Reference

### LoanPool.sol

| Function | Access | Description |
|---|---|---|
| `initialize(owner, usdt, borrower, amountNeeded, rewardBps, durationDays)` | Once | Called by factory clone deployer |
| `deposit(usdtAmount)` | Anyone | Deposit USDT. Pool closes at 100% |
| `borrowerWithdraw()` | Borrower | Withdraw principal after 100% funded. Starts maturity clock |
| `repay()` | Anyone | Deposit principal + reward back |
| `lenderClaim()` | Lenders | Claim pro-rata after maturity + liquidity |
| `getPoolStatus()` | View | Full state snapshot |
| `previewReward(amount)` | View | Estimated reward for deposit amount |
| `availableToClaim(lender)` | View | Current claimable amount |
| `pause()` / `unpause()` | Owner | Emergency stop |
| `deactivate()` | Owner | Close pool to new deposits |

### LoanFactory.sol

| Function | Access | Description |
|---|---|---|
| `createLoanPool(amountNeeded, durationDays, borrower)` | Owner | Deploy new LoanPool clone |
| `createDemoPool(borrower)` | Owner | $100 / 3-day / 1% demo pool |
| `getAllPools()` | View | All deployed pool addresses |
| `setImplementation(newImpl)` | Owner | Rotate clone implementation |

### DepoFiRouter.sol

| Function | Access | Description |
|---|---|---|
| `getAllPoolSnapshots()` | View | All pools with full status |
| `getActivePools()` | View | Only isActive=true pools |
| `getLenderPortfolio(address)` | View | All positions for a lender |

---

## 4. Reward Tiers

| Duration | Reward | Example: $10,000 in → Out |
|---|---|---|
| 7 days | **3%** flat | $10,300 |
| 14 days | **7%** flat | $10,700 |
| 21 days | **11%** flat | $11,100 |
| 30 days | **16%** flat | $11,600 |

Demo pool (testing only): $100 · 3 days · 1%

---

## 5. How to Run Locally

### Prerequisites

- Node.js ≥ 18
- Docker (for TronBox Quickstart)
- TronLink browser extension

```bash
# 1. Clone & install
git clone <repo>
cd depofi
npm install

# 2. Start local Tron node
docker run -it -p 9090:9090 --rm --name tron \
  -e "defaultBalance=100000" \
  -e "showQueryString=true" \
  -e "showBody=true" \
  -e "formatJson=true" \
  tronbox/quickstart

# 3. Copy env
cp .env.example .env
# Edit .env with your private key (default dev key works with quickstart)

# 4. Compile contracts
npm run compile

# 5. Deploy locally
npm run migrate:dev
# → copy printed proxy addresses into .env

# 6. Start frontend
cd frontend
cp ../.env.example .env.local   # edit NEXT_PUBLIC_* vars
npm install
npm run dev
# → http://localhost:3000  passcode: admin25
```

---

## 6. Run Tests

```bash
# Make sure quickstart docker is running
npm test

# With verbose output
./node_modules/.bin/tronbox test --show-events
```

**Test coverage includes:**
- ✅ Admin-only pool creation (reverts for non-owner)
- ✅ All four reward tiers validation
- ✅ Full lifecycle: deposit → borrowerWithdraw → repay → lenderClaim
- ✅ Multi-lender pro-rata accuracy
- ✅ Maturity enforcement (can't claim early)
- ✅ Partial funding (borrower can't withdraw, lenders keep deposits)
- ✅ No liquidity / default path
- ✅ Demo pool creation
- ✅ Pause/unpause
- ✅ Double-claim prevention
- ✅ Double-withdraw prevention
- ✅ Reentrancy guard structural validation
- ✅ UUPS upgrade authorization
- ✅ DepoFiRouter aggregation views

---

## 7. Deploy to Nile Testnet

```bash
# 1. Get test TRX from https://nileex.io/join/getJoinPage

# 2. Add Nile USDT to .env (or deploy MockUSDT by leaving NILE_USDT_ADDRESS blank)
#    PRIVATE_KEY_NILE=<your_key>

# 3. Deploy
npm run migrate:nile

# 4. Copy proxy addresses from output → frontend/.env.local
#    NEXT_PUBLIC_LOAN_FACTORY_ADDRESS=<factory_proxy>
#    NEXT_PUBLIC_DEPOFI_ROUTER_ADDRESS=<router_proxy>
#    NEXT_PUBLIC_NETWORK=nile
```

---

## 8. Deploy to Mainnet

> ⚠ **Never share or commit your mainnet private key.**

```bash
# 1. Ensure wallet has sufficient TRX for Energy/Bandwidth
#    Estimated deployment cost: ~800–1200 TRX total

# 2. Set PRIVATE_KEY_MAINNET in .env (NOT committed)

# 3. Dry-run first with --dry-run flag to estimate costs
./node_modules/.bin/tronbox migrate --network mainnet --dry-run

# 4. Deploy
npm run migrate:mainnet

# 5. Immediately verify on TronScan (see section 10)

# 6. Transfer ownership to a multisig hardware wallet
#    after confirming deployment is correct.
```

---

## 9. Frontend Setup

```bash
cd frontend
cp .env.example .env.local

# Edit .env.local:
NEXT_PUBLIC_NETWORK=nile
NEXT_PUBLIC_LOAN_FACTORY_ADDRESS=<from migration output>
NEXT_PUBLIC_DEPOFI_ROUTER_ADDRESS=<from migration output>
NEXT_PUBLIC_USDT_ADDRESS_NILE=<usdt address>

npm install
npm run dev         # development
npm run build       # production build
npm start           # serve production
```

**Wallet**: TronLink browser extension.
**Passcode**: `admin25` (set via `NEXT_PUBLIC_PASSCODE` env var).

---

## 10. Verify on TronScan

```bash
# Nile TronScan: https://nile.tronscan.org
# Mainnet:       https://tronscan.org

# For each contract (LoanPool impl, LoanFactory impl, DepoFiRouter impl):
# 1. Go to contract address on TronScan
# 2. Click "Verify & Publish Contract"
# 3. Select:
#    - Compiler: v0.8.24
#    - Optimization: Yes (200 runs)
#    - EVM Version: paris
# 4. Paste flattened source (flatten with: npx hardhat flatten contracts/LoanPool.sol)
# 5. Submit – verification typically completes in 1-2 minutes

# Proxy addresses automatically show the implementation via ERC-1967 storage slot
```

---

## 11. Security Checklist

| Category | Status | Notes |
|---|---|---|
| **Reentrancy** | ✅ | `nonReentrant` on all state-changing functions. CEI pattern throughout |
| **Access Control** | ✅ | `onlyOwner` on factory creates, pool admin. `Ownable2Step` prevents accidental transfer |
| **Pausable** | ✅ | Owner can pause each pool individually |
| **Integer Overflow** | ✅ | Solidity 0.8.24 built-in overflow checks |
| **SafeERC20** | ✅ | All USDT transfers via `safeTransfer`/`safeTransferFrom` |
| **Flash Loan Attack** | ✅ Low risk | Shares computed from actual deposits, not current balance |
| **Proxy Storage Collision** | ✅ | OZ UUPS uses ERC-1967 slots. Implementation uses `_disableInitializers()` |
| **Frontrunning** | ⚠ Acceptable | Deposits first-come-first-served. Max deposit = remaining capacity |
| **Donation Attack** | ✅ | Pool balance tracked via `usdt.balanceOf()`. Extra donations benefit all lenders pro-rata (acceptable) |
| **Borrower Default** | ✅ By design | Explicitly documented 100% lender risk. No oracle needed |
| **Owner Key Compromise** | ⚠ Action needed | Rotate owner to multisig (Gnosis Safe on Tron: JustSafe) post-deployment |
| **Upgrade Authorization** | ✅ | `_authorizeUpgrade` is `onlyOwner` |
| **Zero-address checks** | ✅ | All constructors/initializers validate |
| **Timestamp dependence** | ✅ Low | Maturity uses `block.timestamp`. ±15s miner drift is acceptable for day-scale terms |

### Recommended post-launch steps

1. Transfer factory + router ownership to a multisig
2. Audit with a qualified Tron/Solidity auditor before mainnet
3. Set up monitoring (TronGrid webhooks) for large deposits
4. Cap maximum pool size initially (e.g. $50,000)

---

## 12. Slither Recommendations

Run Slither on the codebase:

```bash
pip3 install slither-analyzer
slither contracts/ --solc-remaps \
  "@openzeppelin=node_modules/@openzeppelin" \
  --exclude-dependencies
```

**Expected findings and mitigations:**

| Finding | Severity | Mitigation |
|---|---|---|
| `block.timestamp` used for maturity | Low | Acceptable for day-scale terms |
| `lenderClaim` modifies `totalShares` | Low | Intentional CEI pattern – reduces share atomically |
| Loop over `allPools` in router | Info | Use `getPoolsRange` for pagination in production |
| Proxy uninitialized implementation | Info | Mitigated by `_disableInitializers()` in constructors |
| Missing events on some admin setters | Info | Events added for all state changes |

**False positives to ignore:**
- OZ's own internal patterns (reentrancy false positives in upgradeable contracts)
- UUPS `_authorizeUpgrade` visibility warnings (expected pattern)

---

## License

MIT — see [LICENSE](LICENSE)

> Built on Tron. USDT TRC20. Pure on-chain.
> No backend. No custody. No compromise.

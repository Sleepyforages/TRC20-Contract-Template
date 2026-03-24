# DepoFi Security Checklist & Threat Model

## Threat Model

### Actors
| Actor | Trust Level | Capabilities |
|---|---|---|
| Protocol Admin (owner) | Trusted | Deploy pools, pause, upgrade contracts |
| Borrower | Partially trusted | Withdraw principal (if approved by admin), repay |
| Lender | Untrusted | Deposit USDT, claim after maturity |
| Stranger | Untrusted | No privileged access |

### Assets at Risk
- USDT deposited by lenders (principal)
- USDT rewards (from borrower repayment)

### Non-Risks (by design)
- Borrower default → lenders lose principal (explicitly documented, 100% risk)
- No governance token → no governance attack surface
- No oracle → no price manipulation

---

## Contract-Level Checks

### LoanPool.sol

```
deposit()
 ✓ nonReentrant
 ✓ whenNotPaused
 ✓ isActive check
 ✓ ZeroAmount check
 ✓ ExceedsPoolCapacity check (prevents over-deposit)
 ✓ Effects before Interaction (balance updated before safeTransferFrom)

borrowerWithdraw()
 ✓ nonReentrant
 ✓ whenNotPaused
 ✓ NotBorrower check (msg.sender == loan.borrower)
 ✓ PoolNotFullyFunded check (totalDeposited >= amountNeeded)
 ✓ AlreadyWithdrawn check (idempotency guard)
 ✓ maturityTime set atomically before transfer

repay()
 ✓ nonReentrant
 ✓ whenNotPaused
 ✓ BorrowerHasNotWithdrawn guard (prevent phantom repay)
 ✓ AlreadyRepaid guard
 ✓ loan.repaid = true BEFORE transfer

lenderClaim()
 ✓ nonReentrant
 ✓ whenNotPaused
 ✓ PoolNotMatured check (maturityTime == 0 || timestamp < maturityTime)
 ✓ AlreadyClaimed guard
 ✓ ZeroAmount check on shares
 ✓ NoLiquidity check
 ✓ hasClaimed set BEFORE transfer (CEI)
 ✓ totalShares decremented BEFORE transfer (prevents share inflation)
```

### LoanFactory.sol

```
createLoanPool()
 ✓ onlyOwner
 ✓ InvalidDuration check (rewardBps[durationDays] != 0)
 ✓ ZeroAddress check on borrower
 ✓ ZeroAmount check on amountNeeded

createDemoPool()
 ✓ onlyOwner

setImplementation()
 ✓ onlyOwner
 ✓ ZeroAddress check

_authorizeUpgrade()
 ✓ onlyOwner
```

---

## Known Limitations (MVP Scope)

1. **No maximum pool size cap** — add `maxPoolSize` parameter in v2
2. **No maturity override for unfunded pools** — admin workaround: call deactivate() + wait
3. **Router loops over all pools** — add pagination for 100+ pools
4. **No on-chain KYC** — borrower approval is fully off-chain
5. **Single-sig admin** — must rotate to multisig before mainnet launch

---

## Audit Recommendations (Pre-Mainnet)

1. Full audit by a Tron/EVM specialist (e.g. CertiK, OpenZeppelin, BlockSec)
2. Formal verification of pro-rata math (Certora or Echidna fuzzing)
3. Penetration test the frontend (XSS, wallet spoofing, phishing vectors)
4. TronGrid API key rate limits to prevent DoS on public RPC endpoints

---

## Incident Response

If a vulnerability is discovered:

1. Admin immediately calls `pause()` on affected LoanPool(s)
2. Factory can be paused at proxy level via upgrade to paused implementation
3. Coordinate with TronScan for contract labeling
4. Communicate transparently with affected lenders

Contact: security@depofi.xyz (placeholder)

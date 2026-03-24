// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 *  ██████╗ ███████╗██████╗  ██████╗ ███████╗██╗
 *  ██╔══██╗██╔════╝██╔══██╗██╔═══██╗██╔════╝██║
 *  ██║  ██║█████╗  ██████╔╝██║   ██║█████╗  ██║
 *  ██║  ██║██╔══╝  ██╔═══╝ ██║   ██║██╔══╝  ██║
 *  ██████╔╝███████╗██║     ╚██████╔╝██║     ██║
 *  ╚═════╝ ╚══════╝╚═╝      ╚═════╝ ╚═╝     ╚═╝
 *
 *  DepoFi – LoanPool v1.0
 *  One contract per business loan. Deployed (cloned) by LoanFactory.
 *
 *  Architecture: EIP-1167 minimal proxy clone + Initializable
 *  Security:  ReentrancyGuard · Pausable · Ownable2Step · SafeERC20
 *             Checks-Effects-Interactions throughout.
 */

import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/ILoanPool.sol";

/**
 * @title LoanPool
 * @notice Isolated liquidity pool for a single business lending offer.
 *         Lenders deposit USDT; borrower withdraws once 100 % funded;
 *         anyone repays principal + reward; lenders claim pro-rata after maturity.
 * @dev    Deployed as EIP-1167 clone by LoanFactory.  Uses OpenZeppelin
 *         upgradeable initializer pattern (not UUPS itself—clones are not
 *         individually upgradeable, but the implementation can be replaced
 *         at the factory level for new pools).
 */
contract LoanPool is
    Initializable,
    Ownable2StepUpgradeable,
    ReentrancyGuardUpgradeable,
    PausableUpgradeable,
    ILoanPool
{
    using SafeERC20 for IERC20;

    // ─────────────────────────────────────────────────────────────────────────
    // Storage
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice USDT TRC20 token address (TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t on mainnet)
    IERC20 public usdt;

    /// @notice Core loan parameters and state
    LoanInfo public loan;

    /// @notice Duration used for display / maturity calculation
    uint8 public durationDays;

    /// @notice Lender deposit shares (used for pro-rata claim calculation)
    mapping(address => uint256) public lenderShares;

    /// @notice Sum of all outstanding (unclaimed) shares
    uint256 public totalShares;

    /// @notice Guards against double-claiming
    mapping(address => bool) public hasClaimed;

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor – disable initializers on implementation
    // ─────────────────────────────────────────────────────────────────────────

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Initializer (called once per clone by LoanFactory)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Initializes a new loan pool clone.
     * @param owner_       Protocol admin (factory owner) – receives Ownable/Pausable control.
     * @param usdt_        USDT TRC20 contract address.
     * @param borrower_    Approved business wallet that may withdraw once funded.
     * @param amountNeeded_ Principal amount required (USDT 6-decimal units).
     * @param rewardBps_   Flat reward in basis points (e.g. 300 = 3 %).
     * @param durationDays_ Loan term in days; maturity starts on borrower withdrawal.
     */
    function initialize(
        address owner_,
        address usdt_,
        address borrower_,
        uint256 amountNeeded_,
        uint256 rewardBps_,
        uint8   durationDays_
    ) external initializer {
        __Ownable2Step_init();
        __ReentrancyGuard_init();
        __Pausable_init();
        _transferOwnership(owner_);

        if (usdt_     == address(0)) revert ZeroAmount();
        if (borrower_ == address(0)) revert ZeroAmount();
        if (amountNeeded_ == 0)      revert ZeroAmount();

        usdt        = IERC20(usdt_);
        durationDays = durationDays_;

        uint256 reward = (amountNeeded_ * rewardBps_) / 10_000;

        loan = LoanInfo({
            borrower:          borrower_,
            amountNeeded:      amountNeeded_,
            rewardAmount:      reward,
            maturityTime:      0,           // set when borrower withdraws
            totalDeposited:    0,
            repaid:            false,
            isActive:          true,
            borrowerWithdrawn: false
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Lender: deposit
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Deposit USDT into this pool.  Deposits close automatically once
     *         the pool is 100 % funded.
     * @param usdtAmount USDT amount in 6-decimal units (e.g. 1_000_000 = $1).
     *
     * Requirements:
     *  - Pool must be active and not paused.
     *  - `usdtAmount` must not exceed remaining capacity.
     *  - Caller must have approved this contract for `usdtAmount` USDT.
     *
     * Emits {Deposited}.
     */
    function deposit(uint256 usdtAmount) external nonReentrant whenNotPaused {
        if (!loan.isActive)   revert PoolNotActive();
        if (usdtAmount == 0)  revert ZeroAmount();

        uint256 remaining = loan.amountNeeded - loan.totalDeposited;
        if (usdtAmount > remaining) revert ExceedsPoolCapacity();

        // Checks → Effects → Interactions
        lenderShares[msg.sender] += usdtAmount;
        totalShares              += usdtAmount;
        loan.totalDeposited      += usdtAmount;

        usdt.safeTransferFrom(msg.sender, address(this), usdtAmount);

        emit Deposited(msg.sender, usdtAmount, loan.totalDeposited);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Borrower: withdraw principal
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Withdraw the full principal once the pool is 100 % funded.
     *         Starts the maturity clock from this moment.
     *
     * Requirements:
     *  - Caller must be the designated borrower.
     *  - Pool must be fully funded (totalDeposited == amountNeeded).
     *  - Borrower has not already withdrawn.
     *
     * Emits {BorrowerWithdrew}.
     */
    function borrowerWithdraw() external nonReentrant whenNotPaused {
        if (msg.sender != loan.borrower)                revert NotBorrower();
        if (loan.totalDeposited < loan.amountNeeded)    revert PoolNotFullyFunded();
        if (loan.borrowerWithdrawn)                     revert AlreadyWithdrawn();

        // Effects
        loan.borrowerWithdrawn = true;
        loan.maturityTime      = block.timestamp + (uint256(durationDays) * 1 days);

        // Interaction
        usdt.safeTransfer(loan.borrower, loan.amountNeeded);

        emit BorrowerWithdrew(loan.borrower, loan.amountNeeded, loan.maturityTime);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Repayment
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Repay principal + reward back into the pool.
     *         Can be called by the borrower or any counterparty (e.g. a guarantor).
     *
     * Requirements:
     *  - Borrower must have already withdrawn (funds were deployed).
     *  - Pool must not already be marked repaid.
     *  - Caller must have approved this contract for `amountNeeded + rewardAmount`.
     *
     * Emits {Repaid}.
     */
    function repay() external nonReentrant whenNotPaused {
        if (!loan.borrowerWithdrawn) revert BorrowerHasNotWithdrawn();
        if (loan.repaid)             revert AlreadyRepaid();

        uint256 totalRepay = loan.amountNeeded + loan.rewardAmount;

        // Effects
        loan.repaid = true;

        // Interaction
        usdt.safeTransferFrom(msg.sender, address(this), totalRepay);

        emit Repaid(msg.sender, totalRepay);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Lender: claim
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Claim pro-rata principal + reward after maturity.
     *         If the pool has insufficient liquidity (borrower defaulted) lenders
     *         receive whatever balance exists pro-rata.  Zero balance → reverts.
     *
     * Requirements:
     *  - Current time must be >= maturityTime.
     *  - Caller must have non-zero shares.
     *  - Caller must not have already claimed.
     *  - Pool must hold some USDT balance.
     *
     * Emits {Claimed}.
     */
    function lenderClaim() external nonReentrant whenNotPaused {
        if (loan.maturityTime == 0 || block.timestamp < loan.maturityTime)
            revert PoolNotMatured();
        if (hasClaimed[msg.sender])         revert AlreadyClaimed();
        if (lenderShares[msg.sender] == 0)  revert ZeroAmount();

        uint256 poolBalance  = usdt.balanceOf(address(this));
        if (poolBalance == 0) revert NoLiquidity();

        uint256 myShares   = lenderShares[msg.sender];
        uint256 myPrincipal = myShares; // shares == deposit amount

        // Pro-rata: claimAmount = myShares / totalShares * poolBalance
        // Reducing totalShares after each claim keeps subsequent claims correct.
        uint256 claimAmount = (myShares * poolBalance) / totalShares;

        // Effects
        hasClaimed[msg.sender] = true;
        totalShares            -= myShares;

        // Interaction
        usdt.safeTransfer(msg.sender, claimAmount);

        uint256 rewardReceived = claimAmount > myPrincipal ? claimAmount - myPrincipal : 0;
        emit Claimed(msg.sender, myPrincipal, rewardReceived, claimAmount);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // View helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns a snapshot of all relevant pool state in one call
     *         (minimises frontend RPC calls).
     */
    function getPoolStatus()
        external
        view
        returns (
            address borrower,
            uint256 amountNeeded,
            uint256 rewardAmount,
            uint256 maturityTime,
            uint256 totalDeposited,
            bool    repaid,
            bool    isActive,
            bool    borrowerWithdrawn,
            uint256 fundedPct,
            uint256 poolBalance
        )
    {
        LoanInfo memory l = loan;
        fundedPct   = l.amountNeeded > 0
                      ? (l.totalDeposited * 100) / l.amountNeeded
                      : 0;
        poolBalance = usdt.balanceOf(address(this));

        return (
            l.borrower,
            l.amountNeeded,
            l.rewardAmount,
            l.maturityTime,
            l.totalDeposited,
            l.repaid,
            l.isActive,
            l.borrowerWithdrawn,
            fundedPct,
            poolBalance
        );
    }

    /**
     * @notice Preview the reward a lender would earn on `depositAmount`.
     * @param depositAmount Hypothetical deposit in USDT 6-decimal units.
     * @return rewardForLender Pro-rata reward amount.
     */
    function previewReward(uint256 depositAmount) external view returns (uint256) {
        if (loan.amountNeeded == 0) return 0;
        return (depositAmount * loan.rewardAmount) / loan.amountNeeded;
    }

    /**
     * @notice Returns how much USDT `lender` can claim right now.
     *         Returns 0 if not yet matured, already claimed, or no liquidity.
     */
    function availableToClaim(address lender) external view returns (uint256) {
        if (loan.maturityTime == 0 || block.timestamp < loan.maturityTime) return 0;
        if (hasClaimed[lender])            return 0;
        if (lenderShares[lender] == 0)     return 0;
        if (totalShares == 0)              return 0;

        uint256 bal = usdt.balanceOf(address(this));
        if (bal == 0) return 0;

        return (lenderShares[lender] * bal) / totalShares;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Pause all state-changing operations (emergency stop).
    function pause() external onlyOwner { _pause(); }

    /// @notice Resume normal operations.
    function unpause() external onlyOwner { _unpause(); }

    /**
     * @notice Permanently deactivate this pool (no new deposits accepted).
     *         Existing depositors can still claim after maturity.
     */
    function deactivate() external onlyOwner {
        loan.isActive = false;
        emit PoolDeactivated();
    }
}

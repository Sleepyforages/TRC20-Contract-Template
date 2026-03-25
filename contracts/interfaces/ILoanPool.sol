// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ILoanPool – Interface for individual DepoFi loan pool contracts
interface ILoanPool {
    // ─────────────────────────────────────────────
    // Structs
    // ─────────────────────────────────────────────

    struct LoanInfo {
        address borrower;
        uint256 amountNeeded;    // principal in USDT (6-decimal)
        uint256 rewardAmount;    // total reward = amountNeeded * rewardBps / 10_000
        uint256 maturityTime;    // unix ts after which lenders may claim
        uint256 totalDeposited;  // cumulative lender deposits
        bool    repaid;          // true once full repayment deposited
        bool    isActive;        // false after admin deactivates
        bool    borrowerWithdrawn; // true once borrower pulled principal
    }

    // ─────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────

    event Deposited(address indexed lender, uint256 amount, uint256 newTotal);
    event BorrowerWithdrew(address indexed borrower, uint256 amount, uint256 maturityTime);
    event Repaid(address indexed repayer, uint256 amount);
    event Claimed(address indexed lender, uint256 principal, uint256 reward, uint256 total);
    event PoolDeactivated();

    // ─────────────────────────────────────────────
    // Errors
    // ─────────────────────────────────────────────

    error NotBorrower();
    error PoolNotFullyFunded();
    error AlreadyWithdrawn();
    error BorrowerHasNotWithdrawn();
    error AlreadyRepaid();
    error PoolNotMatured();
    error NoLiquidity();
    error AlreadyClaimed();
    error PoolNotActive();
    error ExceedsPoolCapacity();
    error ZeroAmount();
    error InvalidDuration();

    // ─────────────────────────────────────────────
    // Initializer
    // ─────────────────────────────────────────────

    function initialize(
        address owner_,
        address usdt_,
        address borrower_,
        uint256 amountNeeded_,
        uint256 rewardBps_,
        uint8   durationDays_
    ) external;

    // ─────────────────────────────────────────────
    // Lender actions
    // ─────────────────────────────────────────────

    function deposit(uint256 usdtAmount) external;
    function lenderClaim() external;

    // ─────────────────────────────────────────────
    // Borrower actions
    // ─────────────────────────────────────────────

    function borrowerWithdraw() external;
    function repay() external;

    // ─────────────────────────────────────────────
    // View helpers
    // ─────────────────────────────────────────────

    function getPoolStatus() external view returns (
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
    );

    function previewReward(uint256 depositAmount) external view returns (uint256);
    function availableToClaim(address lender) external view returns (uint256);
    function lenderShares(address lender) external view returns (uint256);
    function totalShares() external view returns (uint256);
    function hasClaimed(address lender) external view returns (bool);
}

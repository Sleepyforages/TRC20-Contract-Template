// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 *  DepoFi – LoanFactory v1.0
 *
 *  Owner-only factory for deploying isolated LoanPool instances.
 *  Uses EIP-1167 minimal proxies (Clones) for gas-efficient deployment.
 *  The factory itself is UUPS upgradeable.
 */

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

import "./interfaces/ILoanPool.sol";

/**
 * @title LoanFactory
 * @notice Deploys a new {LoanPool} clone for each approved business loan offer.
 *         Only the contract owner (protocol admin) can create pools.
 *
 * @dev  UUPS upgradeable.  The implementation for new clones can be rotated
 *       via `setImplementation` (does not affect existing pools).
 *
 * Fixed reward tiers:
 *  ┌──────────┬────────┐
 *  │ Duration │ Reward │
 *  ├──────────┼────────┤
 *  │  7 days  │  3 %   │
 *  │ 14 days  │  7 %   │
 *  │ 21 days  │ 11 %   │
 *  │ 30 days  │ 16 %   │
 *  └──────────┴────────┘
 */
contract LoanFactory is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    using Clones for address;

    // ─────────────────────────────────────────────────────────────────────────
    // Storage
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Address of the LoanPool implementation used for cloning.
    address public implementation;

    /// @notice USDT TRC20 address passed to every pool.
    address public usdt;

    /// @notice All deployed pool addresses in creation order.
    address[] private _allPools;

    /// @notice durationDays → rewardBps mapping (e.g. 7 → 300).
    mapping(uint8 => uint256) public rewardBps;

    /// @notice Pools created per borrower address.
    mapping(address => address[]) public poolsByBorrower;

    // ─────────────────────────────────────────────────────────────────────────
    // Events
    // ─────────────────────────────────────────────────────────────────────────

    event LoanPoolCreated(
        address indexed pool,
        address indexed borrower,
        uint256 amountNeeded,
        uint8   durationDays,
        uint256 rewardBps_,
        uint256 indexed poolIndex
    );

    event ImplementationUpdated(address oldImpl, address newImpl);

    // ─────────────────────────────────────────────────────────────────────────
    // Errors
    // ─────────────────────────────────────────────────────────────────────────

    error InvalidDuration(uint8 duration);
    error ZeroAddress();
    error ZeroAmount();

    // ─────────────────────────────────────────────────────────────────────────
    // Constructor
    // ─────────────────────────────────────────────────────────────────────────

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Initializer
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Initializes the factory (called once via proxy constructor).
     * @param usdt_           USDT contract address.
     * @param implementation_ LoanPool implementation contract address.
     */
    function initialize(address usdt_, address implementation_) external initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        if (usdt_           == address(0)) revert ZeroAddress();
        if (implementation_ == address(0)) revert ZeroAddress();

        usdt           = usdt_;
        implementation = implementation_;

        // Reward tiers (basis points)
        rewardBps[7]  = 300;   //  3 %
        rewardBps[14] = 700;   //  7 %
        rewardBps[21] = 1_100; // 11 %
        rewardBps[30] = 1_600; // 16 %
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Pool creation
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Deploy a new LoanPool for an approved business.
     * @param amountNeeded  Principal required (USDT 6-decimal, e.g. 1_000_000 = $1).
     * @param durationDays_ Term length – must be one of {7, 14, 21, 30}.
     * @param borrower      Approved business wallet address.
     * @return pool         Address of the newly deployed LoanPool clone.
     *
     * Emits {LoanPoolCreated}.
     */
    function createLoanPool(
        uint256 amountNeeded,
        uint8   durationDays_,
        address borrower
    ) external onlyOwner returns (address pool) {
        uint256 bps = rewardBps[durationDays_];
        if (bps == 0) revert InvalidDuration(durationDays_);
        if (borrower == address(0)) revert ZeroAddress();
        if (amountNeeded == 0)      revert ZeroAmount();

        pool = _deployPool(amountNeeded, durationDays_, bps, borrower);
    }

    /**
     * @notice Create a demo loan for quick testing:
     *         $100 USDT · 3-day term · 1 % reward.
     * @param borrower  Address that will receive the demo principal.
     * @return pool     Address of the demo LoanPool.
     *
     * Emits {LoanPoolCreated}.
     */
    function createDemoPool(address borrower) external onlyOwner returns (address pool) {
        if (borrower == address(0)) revert ZeroAddress();
        // $100 USDT (6 decimals) · 3 days · 1 % (100 bps)
        pool = _deployPool(100_000_000, 3, 100, borrower);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────────────────────

    function _deployPool(
        uint256 amountNeeded,
        uint8   durationDays_,
        uint256 bps,
        address borrower
    ) internal returns (address pool) {
        pool = implementation.clone();

        ILoanPool(pool).initialize(
            owner(),          // admin owns each pool
            usdt,
            borrower,
            amountNeeded,
            bps,
            durationDays_
        );

        uint256 idx = _allPools.length;
        _allPools.push(pool);
        poolsByBorrower[borrower].push(pool);

        emit LoanPoolCreated(pool, borrower, amountNeeded, durationDays_, bps, idx);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // View functions
    // ─────────────────────────────────────────────────────────────────────────

    /// @notice Returns all deployed pool addresses.
    function getAllPools() external view returns (address[] memory) {
        return _allPools;
    }

    /// @notice Returns total number of pools ever created.
    function getPoolCount() external view returns (uint256) {
        return _allPools.length;
    }

    /// @notice Returns pool address by index.
    function getPool(uint256 index) external view returns (address) {
        return _allPools[index];
    }

    /// @notice Returns all pools for a given borrower.
    function getPoolsByBorrower(address borrower) external view returns (address[] memory) {
        return poolsByBorrower[borrower];
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Update the LoanPool implementation used for future clones.
     *         Existing pools are NOT affected.
     * @param newImpl New implementation contract address.
     */
    function setImplementation(address newImpl) external onlyOwner {
        if (newImpl == address(0)) revert ZeroAddress();
        emit ImplementationUpdated(implementation, newImpl);
        implementation = newImpl;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UUPS
    // ─────────────────────────────────────────────────────────────────────────

    /// @dev Required by UUPS – only owner can upgrade.
    function _authorizeUpgrade(address) internal override onlyOwner {}
}

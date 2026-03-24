// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/*
 *  DepoFi – DepoFiRouter v1.0
 *
 *  Convenience entry-point for the frontend.
 *  Aggregates pool data in a single call to minimize Tron API round-trips.
 *  UUPS upgradeable.
 */

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "./LoanFactory.sol";
import "./interfaces/ILoanPool.sol";

/**
 * @title  DepoFiRouter
 * @notice Read-only aggregation router for the DepoFi frontend.
 *         Provides batched pool info and lender portfolio snapshots.
 */
contract DepoFiRouter is Initializable, OwnableUpgradeable, UUPSUpgradeable {

    // ─────────────────────────────────────────────────────────────────────────
    // Structs
    // ─────────────────────────────────────────────────────────────────────────

    struct PoolSnapshot {
        address poolAddress;
        address borrower;
        uint256 amountNeeded;
        uint256 rewardAmount;
        uint256 maturityTime;
        uint256 totalDeposited;
        bool    repaid;
        bool    isActive;
        bool    borrowerWithdrawn;
        uint256 fundedPct;
        uint256 poolBalance;
    }

    struct LenderPosition {
        address poolAddress;
        uint256 deposited;       // lender's share in this pool
        uint256 availableClaim;  // 0 before maturity or already claimed
        bool    claimed;
        uint256 maturityTime;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Storage
    // ─────────────────────────────────────────────────────────────────────────

    LoanFactory public factory;

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

    function initialize(address factory_) external initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        require(factory_ != address(0), "DepoFiRouter: zero address");
        factory = LoanFactory(factory_);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Aggregation views
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * @notice Returns snapshots for ALL pools ever created.
     * @dev    Use pagination via {getPoolsRange} on large deployments.
     */
    function getAllPoolSnapshots() external view returns (PoolSnapshot[] memory snapshots) {
        address[] memory pools = factory.getAllPools();
        return _buildSnapshots(pools);
    }

    /**
     * @notice Returns snapshots for a slice of pools [start, end).
     */
    function getPoolsRange(uint256 start, uint256 end)
        external
        view
        returns (PoolSnapshot[] memory)
    {
        uint256 total = factory.getPoolCount();
        if (end > total) end = total;
        require(start <= end, "DepoFiRouter: invalid range");

        address[] memory slice = new address[](end - start);
        for (uint256 i = start; i < end; i++) {
            slice[i - start] = factory.getPool(i);
        }
        return _buildSnapshots(slice);
    }

    /**
     * @notice Returns all active (accepting deposits) pool snapshots.
     */
    function getActivePools() external view returns (PoolSnapshot[] memory) {
        address[] memory all = factory.getAllPools();
        uint256 count;
        for (uint256 i; i < all.length; i++) {
            (,,,,,, bool isActive,,, ) = ILoanPool(all[i]).getPoolStatus();
            if (isActive) count++;
        }
        PoolSnapshot[] memory active = new PoolSnapshot[](count);
        uint256 idx;
        for (uint256 i; i < all.length; i++) {
            (,,,,,, bool isActive,,, ) = ILoanPool(all[i]).getPoolStatus();
            if (isActive) {
                active[idx++] = _snapshot(all[i]);
            }
        }
        return active;
    }

    /**
     * @notice Returns all positions (deposits + claim status) for a given lender.
     * @param lender  Wallet address to query.
     */
    function getLenderPortfolio(address lender)
        external
        view
        returns (LenderPosition[] memory positions)
    {
        address[] memory pools = factory.getAllPools();
        uint256 count;
        for (uint256 i; i < pools.length; i++) {
            if (ILoanPool(pools[i]).lenderShares(lender) > 0) count++;
        }

        positions = new LenderPosition[](count);
        uint256 idx;
        for (uint256 i; i < pools.length; i++) {
            uint256 shares = ILoanPool(pools[i]).lenderShares(lender);
            if (shares > 0) {
                ILoanPool pool = ILoanPool(pools[i]);
                (,,, uint256 maturityTime,,,,,, ) = pool.getPoolStatus();
                positions[idx++] = LenderPosition({
                    poolAddress:    pools[i],
                    deposited:      shares,
                    availableClaim: pool.availableToClaim(lender),
                    claimed:        pool.hasClaimed(lender),
                    maturityTime:   maturityTime
                });
            }
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Admin
    // ─────────────────────────────────────────────────────────────────────────

    function setFactory(address factory_) external onlyOwner {
        require(factory_ != address(0), "DepoFiRouter: zero address");
        factory = LoanFactory(factory_);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────────────────────

    function _buildSnapshots(address[] memory pools)
        internal
        view
        returns (PoolSnapshot[] memory snapshots)
    {
        snapshots = new PoolSnapshot[](pools.length);
        for (uint256 i; i < pools.length; i++) {
            snapshots[i] = _snapshot(pools[i]);
        }
    }

    function _snapshot(address poolAddr)
        internal
        view
        returns (PoolSnapshot memory s)
    {
        (
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
        ) = ILoanPool(poolAddr).getPoolStatus();

        s = PoolSnapshot({
            poolAddress:       poolAddr,
            borrower:          borrower,
            amountNeeded:      amountNeeded,
            rewardAmount:      rewardAmount,
            maturityTime:      maturityTime,
            totalDeposited:    totalDeposited,
            repaid:            repaid,
            isActive:          isActive,
            borrowerWithdrawn: borrowerWithdrawn,
            fundedPct:         fundedPct,
            poolBalance:       poolBalance
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // UUPS
    // ─────────────────────────────────────────────────────────────────────────

    function _authorizeUpgrade(address) internal override onlyOwner {}
}

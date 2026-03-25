// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title MockUSDT – ERC20 token used in local/testnet testing only.
/// @dev   Matches USDT TRC20 decimals (6).  Anyone can mint via `mint()`.
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    constructor() ERC20("Mock USDT", "USDT") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /// @notice Mint `amount` tokens to `to` – test helper, not for production.
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

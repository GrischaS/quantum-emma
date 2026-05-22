// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
//  QUANTUM EMMA — Mock ERC20 for Tests
//  © 2026 Grigori Saks — Patent Pending
// ============================================================

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/// @dev Simple mintable ERC20 used in test fixtures
contract MockERC20 is ERC20 {
    constructor(
        string memory name_,
        string memory symbol_,
        uint256 initialSupply_
    ) ERC20(name_, symbol_) {
        _mint(msg.sender, initialSupply_);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

/// @dev Mock QEMMA token with distributeMiningReward interface
contract MockQEMMAToken is ERC20 {
    constructor() ERC20("Quantum Emma", "QEMMA") {
        _mint(msg.sender, 100_000_000 * 1e18);
    }

    function distributeMiningReward(address miner) external {
        _mint(miner, 2500 * 1e18);
    }

    function currentMiningReward() external pure returns (uint256) {
        return 2500 * 1e18;
    }

    function getAgent(uint8 agentId) external pure returns (
        string memory name,
        string memory role,
        bool active,
        uint256 tasksCompleted,
        uint256 rewardsDistributed,
        address agentAddress
    ) {
        require(agentId >= 1 && agentId <= 12, "Invalid agent");
        return ("ALPHA-Q", "TRADING", true, 0, 0, address(0));
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

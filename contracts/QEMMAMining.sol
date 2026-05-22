// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
//  QUANTUM EMMA — MINING ORCHESTRATOR
//  Handles proof-of-work style mining via 12 Agents
//  Version: 1.0.0 · March 2026
// ============================================================

interface IQEMMAToken {
    function distributeMiningReward(address miner) external;
    function currentMiningReward() external view returns (uint256);
    function getAgent(uint8 agentId) external view returns (
        string memory, string memory, bool, uint256, uint256, address
    );
}

/// @title QEMMAMining — Quantum Mining Pool Contract
/// @notice Manages mining pools, difficulty, and agent coordination
contract QEMMAMining {

    IQEMMAToken public immutable qemmaToken;
    address public owner;

    // ─── DIFFICULTY ───────────────────────────────────────────────────────────
    uint256 public difficulty = 3;  // leading zeros required in hash
    uint256 public constant MAX_DIFFICULTY = 8;
    uint256 public lastDifficultyAdjust;
    uint256 public constant DIFFICULTY_PERIOD = 2016; // blocks

    // ─── MINING POOLS ─────────────────────────────────────────────────────────
    struct Pool {
        string  name;
        uint8   leadAgentId;
        uint256 totalHashPower;
        uint256 membersCount;
        uint256 totalRewards;
        bool    active;
        uint256 feeBps; // pool fee in basis points
    }
    uint256 public poolCount;
    mapping(uint256 => Pool) public pools;
    mapping(address => uint256) public minerPool; // miner → poolId
    mapping(uint256 => address[]) public poolMembers;

    // ─── MINING SUBMISSIONS ───────────────────────────────────────────────────
    struct MiningSubmission {
        address miner;
        uint256 poolId;
        bytes32 nonce;
        uint256 blockNumber;
        uint256 timestamp;
        bool    validated;
    }
    uint256 public submissionCount;
    mapping(uint256 => MiningSubmission) public submissions;

    // ─── HASH POWER ───────────────────────────────────────────────────────────
    mapping(address => uint256) public hashPower;    // TH/s * 100
    uint256 public totalNetworkHashPower;

    // ─── EVENTS ───────────────────────────────────────────────────────────────
    event PoolCreated(uint256 indexed poolId, string name, uint8 leadAgent);
    event MinerJoinedPool(address indexed miner, uint256 indexed poolId);
    event MinerLeftPool(address indexed miner, uint256 indexed poolId);
    event BlockMined(address indexed miner, uint256 indexed poolId, bytes32 nonce, uint256 reward);
    event DifficultyAdjusted(uint256 oldDifficulty, uint256 newDifficulty);
    event HashPowerUpdated(address indexed miner, uint256 newHashPower);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(address _qemmaToken) {
        qemmaToken = IQEMMAToken(_qemmaToken);
        owner = msg.sender;
        lastDifficultyAdjust = block.number;

        // Create default pools matching the 12 agents
        _createDefaultPools();
    }

    function _createDefaultPools() internal {
        _createPool("ALPHA POOL",   1, 100, true);
        _createPool("NEURAL POOL",  2, 150, true);
        _createPool("GAMMA POOL",   3, 80,  true);
        _createPool("HEALING POOL", 4, 120, false);
    }

    function _createPool(string memory name, uint8 agentId, uint256 feeBps, bool active) internal {
        poolCount++;
        pools[poolCount] = Pool(name, agentId, 0, 0, 0, active, feeBps);
        emit PoolCreated(poolCount, name, agentId);
    }

    function createPool(string calldata name, uint8 leadAgentId, uint256 feeBps) external onlyOwner returns (uint256) {
        require(leadAgentId >= 1 && leadAgentId <= 12, "Invalid agent");
        require(feeBps <= 2000, "Fee too high"); // max 20%
        poolCount++;
        pools[poolCount] = Pool(name, leadAgentId, 0, 0, 0, true, feeBps);
        emit PoolCreated(poolCount, name, leadAgentId);
        return poolCount;
    }

    function joinPool(uint256 poolId) external {
        require(pools[poolId].active, "Pool not active");
        require(minerPool[msg.sender] == 0, "Already in a pool");
        minerPool[msg.sender] = poolId;
        pools[poolId].membersCount++;
        poolMembers[poolId].push(msg.sender);
        emit MinerJoinedPool(msg.sender, poolId);
    }

    function leavePool() external {
        uint256 poolId = minerPool[msg.sender];
        require(poolId != 0, "Not in a pool");
        minerPool[msg.sender] = 0;
        pools[poolId].membersCount--;
        emit MinerLeftPool(msg.sender, poolId);
    }

    /// @notice Submit a valid proof-of-work nonce
    function submitWork(bytes32 nonce) external returns (bool) {
        require(minerPool[msg.sender] != 0, "Join a pool first");
        require(_validateNonce(msg.sender, nonce), "Invalid nonce");

        submissionCount++;
        submissions[submissionCount] = MiningSubmission(
            msg.sender,
            minerPool[msg.sender],
            nonce,
            block.number,
            block.timestamp,
            true
        );

        uint256 reward = qemmaToken.currentMiningReward();
        pools[minerPool[msg.sender]].totalRewards += reward;

        // Distribute via token contract
        qemmaToken.distributeMiningReward(msg.sender);

        // Adjust difficulty every DIFFICULTY_PERIOD blocks
        if (block.number - lastDifficultyAdjust >= DIFFICULTY_PERIOD) {
            _adjustDifficulty();
        }

        emit BlockMined(msg.sender, minerPool[msg.sender], nonce, reward);
        return true;
    }

    function _validateNonce(address miner, bytes32 nonce) internal view returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(miner, nonce, block.number));
        // Check leading zeros based on difficulty
        uint256 target = type(uint256).max >> (difficulty * 4);
        return uint256(hash) <= target;
    }

    function _adjustDifficulty() internal {
        uint256 oldDiff = difficulty;
        uint256 blocksSinceAdjust = block.number - lastDifficultyAdjust;

        if (blocksSinceAdjust < DIFFICULTY_PERIOD / 2 && difficulty < MAX_DIFFICULTY) {
            difficulty++;
        } else if (blocksSinceAdjust > DIFFICULTY_PERIOD * 2 && difficulty > 1) {
            difficulty--;
        }

        lastDifficultyAdjust = block.number;
        if (oldDiff != difficulty) {
            emit DifficultyAdjusted(oldDiff, difficulty);
        }
    }

    function updateHashPower(address miner, uint256 power) external onlyOwner {
        uint256 old = hashPower[miner];
        hashPower[miner] = power;
        totalNetworkHashPower = totalNetworkHashPower - old + power;
        emit HashPowerUpdated(miner, power);
    }

    function getPoolInfo(uint256 poolId) external view returns (
        string memory name,
        uint8 leadAgentId,
        uint256 membersCount,
        uint256 totalRewards,
        bool active,
        uint256 feeBps
    ) {
        Pool memory p = pools[poolId];
        return (p.name, p.leadAgentId, p.membersCount, p.totalRewards, p.active, p.feeBps);
    }
}

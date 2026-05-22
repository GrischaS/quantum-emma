// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
//  QUANTUM EMMA — ADVANCED STAKING VAULT
//  Lock periods, boosted APY, NFT-style tier badges
//  Version: 1.0.0 · March 2026
// ============================================================

interface IERC20 {
    function transferFrom(address, address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
    function balanceOf(address) external view returns (uint256);
}

/// @title QEMMAStaking — Tiered Staking with Lock Periods
contract QEMMAStaking {

    IERC20  public immutable qemmaToken;
    address public owner;

    // ─── LOCK TIERS ───────────────────────────────────────────────────────────
    struct LockTier {
        uint256 lockDuration;  // seconds
        uint256 apyBps;        // APY in basis points (100 = 1%)
        string  name;
        string  badge;         // emoji badge
    }
    LockTier[5] public lockTiers;

    // ─── USER STAKES ──────────────────────────────────────────────────────────
    struct UserStake {
        uint256 amount;
        uint256 stakedAt;
        uint256 unlockAt;
        uint256 lastClaimed;
        uint8   tierIndex;
        bool    active;
    }
    mapping(address => UserStake[]) public userStakes;
    mapping(address => uint256) public totalUserStaked;

    uint256 public totalValueLocked;
    uint256 public totalRewardsPaid;

    // ─── EVENTS ───────────────────────────────────────────────────────────────
    event Staked(address indexed user, uint256 amount, uint8 tierIndex, uint256 unlockAt);
    event Unstaked(address indexed user, uint256 amount, uint256 stakeIndex);
    event RewardClaimed(address indexed user, uint256 reward, uint256 stakeIndex);
    event EarlyUnstakePenalty(address indexed user, uint256 penalty);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    constructor(address _qemmaToken) {
        qemmaToken = IERC20(_qemmaToken);
        owner = msg.sender;

        // Initialize 5 lock tiers
        lockTiers[0] = LockTier(0,         1200,  "FLEXIBLE",   "🔓"); // No lock — 12% APY
        lockTiers[1] = LockTier(30 days,   1800,  "BRONZE",     "🥉"); // 30d  — 18% APY
        lockTiers[2] = LockTier(90 days,   2400,  "SILVER",     "🥈"); // 90d  — 24% APY
        lockTiers[3] = LockTier(180 days,  3600,  "GOLD",       "🥇"); // 180d — 36% APY
        lockTiers[4] = LockTier(365 days,  6000,  "QUANTUM",    "⚛️"); // 365d — 60% APY
    }

    function stake(uint256 amount, uint8 tierIndex) external {
        require(amount > 0, "Amount must be > 0");
        require(tierIndex < 5, "Invalid tier");
        require(qemmaToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");

        LockTier memory tier = lockTiers[tierIndex];
        uint256 unlockAt = block.timestamp + tier.lockDuration;

        userStakes[msg.sender].push(UserStake({
            amount:      amount,
            stakedAt:    block.timestamp,
            unlockAt:    unlockAt,
            lastClaimed: block.timestamp,
            tierIndex:   tierIndex,
            active:      true
        }));

        totalUserStaked[msg.sender] += amount;
        totalValueLocked += amount;

        emit Staked(msg.sender, amount, tierIndex, unlockAt);
    }

    function unstake(uint256 stakeIndex) external {
        UserStake storage s = userStakes[msg.sender][stakeIndex];
        require(s.active, "Stake not active");

        uint256 amount = s.amount;
        uint256 penalty = 0;

        // Early unstake penalty: 15% if locked period not complete
        if (block.timestamp < s.unlockAt) {
            penalty = (amount * 1500) / 10_000; // 15%
            amount -= penalty;
            emit EarlyUnstakePenalty(msg.sender, penalty);
        }

        // Claim pending rewards first
        _claimReward(msg.sender, stakeIndex);

        s.active = false;
        s.amount = 0;
        totalUserStaked[msg.sender] -= userStakes[msg.sender][stakeIndex].amount + amount; // net
        totalValueLocked -= (s.amount + penalty);

        require(qemmaToken.transfer(msg.sender, amount), "Transfer failed");
        if (penalty > 0) {
            // Penalty goes to reward pool (burn or redistribute)
            require(qemmaToken.transfer(owner, penalty), "Penalty transfer failed");
        }

        emit Unstaked(msg.sender, amount, stakeIndex);
    }

    function claimReward(uint256 stakeIndex) external {
        _claimReward(msg.sender, stakeIndex);
    }

    function claimAllRewards() external {
        for (uint256 i = 0; i < userStakes[msg.sender].length; i++) {
            if (userStakes[msg.sender][i].active) {
                _claimReward(msg.sender, i);
            }
        }
    }

    function _claimReward(address user, uint256 stakeIndex) internal {
        UserStake storage s = userStakes[user][stakeIndex];
        if (!s.active || s.amount == 0) return;

        uint256 reward = pendingReward(user, stakeIndex);
        if (reward == 0) return;

        s.lastClaimed = block.timestamp;
        totalRewardsPaid += reward;

        require(qemmaToken.transfer(user, reward), "Reward transfer failed");
        emit RewardClaimed(user, reward, stakeIndex);
    }

    function pendingReward(address user, uint256 stakeIndex) public view returns (uint256) {
        UserStake memory s = userStakes[user][stakeIndex];
        if (!s.active || s.amount == 0) return 0;
        uint256 elapsed = block.timestamp - s.lastClaimed;
        uint256 apy = lockTiers[s.tierIndex].apyBps;
        return (s.amount * apy * elapsed) / (365 days * 10_000);
    }

    function totalPendingRewards(address user) external view returns (uint256 total) {
        for (uint256 i = 0; i < userStakes[user].length; i++) {
            total += pendingReward(user, i);
        }
    }

    function getUserStakes(address user) external view returns (UserStake[] memory) {
        return userStakes[user];
    }

    function getLockTiers() external view returns (LockTier[5] memory) {
        return lockTiers;
    }
}

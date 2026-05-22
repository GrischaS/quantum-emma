// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
//  QUANTUM EMMA — QEMMA TOKEN
//  Meta Genius TR2 Protocol · Metamorphic Token System
//  Version: 1.0.0 · March 2026
//  Author: Grigori Saks · Quantum Emma AI
// ============================================================

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title QEMMAToken — Quantum Emma Governance & Utility Token
/// @notice ERC-20 with Metamorphic phases, Mining Rewards, Staking, Governance
contract QEMMAToken is ERC20, ERC20Burnable, ERC20Permit, Ownable, ReentrancyGuard {

    // ─── SUPPLY ───────────────────────────────────────────────────────────────
    uint256 public constant MAX_SUPPLY         = 100_000_000 * 1e18;
    uint256 public constant COMMUNITY_ALLOC    =  40_000_000 * 1e18; // 40%
    uint256 public constant TEAM_ALLOC         =  20_000_000 * 1e18; // 20%
    uint256 public constant ECOSYSTEM_ALLOC    =  20_000_000 * 1e18; // 20%
    uint256 public constant PUBLIC_SALE_ALLOC  =  15_000_000 * 1e18; // 15%
    uint256 public constant RESERVE_ALLOC      =   5_000_000 * 1e18; //  5%

    // ─── METAMORPHIC PHASES ───────────────────────────────────────────────────
    enum TokenPhase { GENESIS, METAMORPH_I, METAMORPH_II, ASCENSION }
    TokenPhase public currentPhase = TokenPhase.GENESIS;

    uint256 public constant PHASE_THRESHOLD_1 =  20_000_000 * 1e18; // → METAMORPH_I
    uint256 public constant PHASE_THRESHOLD_2 =  50_000_000 * 1e18; // → METAMORPH_II
    uint256 public constant PHASE_THRESHOLD_3 =  80_000_000 * 1e18; // → ASCENSION

    // ─── MINING ───────────────────────────────────────────────────────────────
    uint256 public constant BASE_MINING_REWARD = 2_500 * 1e18;   // 2500 QEMMA per block
    uint256 public constant HALVING_INTERVAL   = 210_000;         // blocks between halvings
    uint256 public totalMinedSupply;
    uint256 public miningStartBlock;
    bool    public miningActive;

    struct MinerStats {
        uint256 totalMined;
        uint256 blocksFound;
        uint256 lastRewardBlock;
        uint8   activeAgentId;
    }
    mapping(address => MinerStats) public miners;

    // ─── 12x ORCHESTRATOR AGENTS ──────────────────────────────────────────────
    struct Agent {
        string  name;
        string  role;
        bool    active;
        uint256 tasksCompleted;
        uint256 rewardsDistributed;
    }
    mapping(uint8 => Agent) public agents;          // agentId 1–12
    mapping(address => uint8) public agentAddress;  // address → agentId
    mapping(uint8 => address) public agentWallet;   // agentId → address

    // ─── STAKING ──────────────────────────────────────────────────────────────
    uint256 public constant STAKING_APY_BASE    = 1200; // 12.00% (basis points)
    uint256 public constant STAKING_APY_PREMIUM = 2400; // 24.00% — for ASCENSION holders
    uint256 public totalStaked;

    struct Stake {
        uint256 amount;
        uint256 stakedAt;
        uint256 lastClaimed;
        bool    premium;
    }
    mapping(address => Stake) public stakes;

    // ─── GOVERNANCE ───────────────────────────────────────────────────────────
    struct Proposal {
        uint256 id;
        string  description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool    executed;
        address proposer;
    }
    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    uint256 public constant VOTING_PERIOD    = 7 days;
    uint256 public constant PROPOSAL_MINIMUM = 10_000 * 1e18; // min 10k QEMMA to propose

    // ─── TRADING FEE DISCOUNT ─────────────────────────────────────────────────
    // Tier based on holdings
    struct FeeTier {
        uint256 minHolding;
        uint256 discountBps; // basis points, 5000 = 50%
        string  tierName;
    }
    FeeTier[4] public feeTiers;

    // ─── BURN ─────────────────────────────────────────────────────────────────
    uint256 public totalBurned;
    uint256 public constant AUTO_BURN_BPS = 100; // 1% of each trading fee burned

    // ─── EVENTS ───────────────────────────────────────────────────────────────
    event PhaseEvolved(TokenPhase indexed oldPhase, TokenPhase indexed newPhase, uint256 totalSupply);
    event AgentActivated(uint8 indexed agentId, address indexed wallet, string name);
    event AgentDeactivated(uint8 indexed agentId);
    event MiningStarted(uint256 startBlock);
    event MiningRewardDistributed(address indexed miner, uint256 amount, uint8 agentId, uint256 blockNumber);
    event TokensStaked(address indexed staker, uint256 amount, bool premium);
    event StakeWithdrawn(address indexed staker, uint256 amount, uint256 reward);
    event RewardsClaimed(address indexed staker, uint256 reward);
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string description);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId, bool passed);
    event TokensBurned(address indexed burner, uint256 amount, uint256 totalBurned);

    // ─── CONSTRUCTOR ──────────────────────────────────────────────────────────
    constructor(
        address teamWallet,
        address ecosystemWallet,
        address reserveWallet
    )
        ERC20("Quantum Emma", "QEMMA")
        ERC20Permit("Quantum Emma")
        Ownable(msg.sender)
    {
        // Mint allocations
        _mint(msg.sender,      PUBLIC_SALE_ALLOC);  // 15M — Public Sale
        _mint(teamWallet,      TEAM_ALLOC);          // 20M — Team
        _mint(ecosystemWallet, ECOSYSTEM_ALLOC);     // 20M — Ecosystem
        _mint(reserveWallet,   RESERVE_ALLOC);       // 5M  — Reserve
        // Community 40M stays locked — released via mining

        // Initialize fee tiers
        feeTiers[0] = FeeTier(0,              0,    "STANDARD");
        feeTiers[1] = FeeTier(1_000  * 1e18, 1000, "SILVER");   // 1k+  → 10% off
        feeTiers[2] = FeeTier(10_000 * 1e18, 2500, "GOLD");     // 10k+ → 25% off
        feeTiers[3] = FeeTier(50_000 * 1e18, 5000, "QUANTUM");  // 50k+ → 50% off

        // Initialize 12 agents (deactivated by default)
        _initAgents();
    }

    // ─── AGENT SYSTEM ─────────────────────────────────────────────────────────

    function _initAgents() internal {
        agents[1]  = Agent("ALPHA-Q",   "Quantum Hash Generator",      false, 0, 0);
        agents[2]  = Agent("BETA-N",    "Neural Pattern Miner",        false, 0, 0);
        agents[3]  = Agent("GAMMA-R",   "Recursive Optimizer",         false, 0, 0);
        agents[4]  = Agent("DELTA-H",   "Healing & Error Corrector",   false, 0, 0);
        agents[5]  = Agent("EPSILON-S", "Self-Learning Strategist",    false, 0, 0);
        agents[6]  = Agent("ZETA-M",    "Metamorphic Token Forger",    false, 0, 0);
        agents[7]  = Agent("ETA-P",     "Predictive Market Analyzer",  false, 0, 0);
        agents[8]  = Agent("THETA-D",   "Dimensional Data Miner",      false, 0, 0);
        agents[9]  = Agent("IOTA-V",    "Validation & Consensus Node", false, 0, 0);
        agents[10] = Agent("KAPPA-E",   "Energy Efficiency Module",    false, 0, 0);
        agents[11] = Agent("LAMBDA-O",  "Orchestration Controller",    false, 0, 0);
        agents[12] = Agent("META-TR2",  "Meta Genius Core Conductor",  false, 0, 0);
    }

    /// @notice Assign a wallet to an orchestrator agent and activate it
    function activateAgent(uint8 agentId, address wallet) external onlyOwner {
        require(agentId >= 1 && agentId <= 12, "Invalid agent ID");
        require(wallet != address(0), "Zero address");
        agents[agentId].active = true;
        agentAddress[wallet] = agentId;
        agentWallet[agentId] = wallet;
        emit AgentActivated(agentId, wallet, agents[agentId].name);
    }

    function deactivateAgent(uint8 agentId) external onlyOwner {
        agents[agentId].active = false;
        address wallet = agentWallet[agentId];
        delete agentAddress[wallet];
        emit AgentDeactivated(agentId);
    }

    modifier onlyActiveAgent() {
        require(agents[agentAddress[msg.sender]].active, "Not an active agent");
        _;
    }

    // ─── MINING ───────────────────────────────────────────────────────────────

    function startMining() external onlyOwner {
        require(!miningActive, "Mining already active");
        miningActive = true;
        miningStartBlock = block.number;
        emit MiningStarted(block.number);
    }

    function stopMining() external onlyOwner {
        miningActive = false;
    }

    /// @notice Calculate current mining reward accounting for halvings
    function currentMiningReward() public view returns (uint256) {
        if (!miningActive || miningStartBlock == 0) return 0;
        uint256 halvings = (block.number - miningStartBlock) / HALVING_INTERVAL;
        if (halvings >= 20) return 0; // reward reaches 0 after 20 halvings
        return BASE_MINING_REWARD >> halvings;
    }

    /// @notice Distribute mining reward to a miner (called by authorized agent)
    function distributeMiningReward(address miner) external onlyActiveAgent nonReentrant {
        require(miningActive, "Mining not active");
        uint256 reward = currentMiningReward();
        require(reward > 0, "No reward available");
        require(totalMinedSupply + reward <= COMMUNITY_ALLOC, "Community pool exhausted");
        require(block.number > miners[miner].lastRewardBlock, "Already rewarded this block");

        totalMinedSupply += reward;
        miners[miner].totalMined += reward;
        miners[miner].blocksFound += 1;
        miners[miner].lastRewardBlock = block.number;
        miners[miner].activeAgentId = agentAddress[msg.sender];

        agents[agentAddress[msg.sender]].tasksCompleted += 1;
        agents[agentAddress[msg.sender]].rewardsDistributed += reward;

        _mint(miner, reward);
        _checkPhaseEvolution();

        emit MiningRewardDistributed(miner, reward, agentAddress[msg.sender], block.number);
    }

    // ─── METAMORPHIC PHASE EVOLUTION ──────────────────────────────────────────

    function _checkPhaseEvolution() internal {
        TokenPhase newPhase = currentPhase;
        uint256 supply = totalSupply();

        if (supply >= PHASE_THRESHOLD_3 && currentPhase < TokenPhase.ASCENSION)
            newPhase = TokenPhase.ASCENSION;
        else if (supply >= PHASE_THRESHOLD_2 && currentPhase < TokenPhase.METAMORPH_II)
            newPhase = TokenPhase.METAMORPH_II;
        else if (supply >= PHASE_THRESHOLD_1 && currentPhase < TokenPhase.METAMORPH_I)
            newPhase = TokenPhase.METAMORPH_I;

        if (newPhase != currentPhase) {
            TokenPhase old = currentPhase;
            currentPhase = newPhase;
            emit PhaseEvolved(old, newPhase, supply);
        }
    }

    // ─── STAKING ──────────────────────────────────────────────────────────────

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Amount must be > 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Claim pending rewards first
        if (stakes[msg.sender].amount > 0) {
            _claimStakingReward(msg.sender);
        }

        _transfer(msg.sender, address(this), amount);
        bool isPremium = (currentPhase == TokenPhase.ASCENSION);

        stakes[msg.sender].amount    += amount;
        stakes[msg.sender].stakedAt   = block.timestamp;
        stakes[msg.sender].lastClaimed = block.timestamp;
        stakes[msg.sender].premium    = isPremium;
        totalStaked += amount;

        emit TokensStaked(msg.sender, amount, isPremium);
    }

    function unstake(uint256 amount) external nonReentrant {
        require(stakes[msg.sender].amount >= amount, "Insufficient staked");
        _claimStakingReward(msg.sender);
        stakes[msg.sender].amount -= amount;
        totalStaked -= amount;
        _transfer(address(this), msg.sender, amount);
        emit StakeWithdrawn(msg.sender, amount, 0);
    }

    function claimStakingRewards() external nonReentrant {
        require(stakes[msg.sender].amount > 0, "Nothing staked");
        _claimStakingReward(msg.sender);
    }

    function _claimStakingReward(address staker) internal {
        uint256 reward = pendingStakingReward(staker);
        if (reward == 0) return;
        require(totalSupply() + reward <= MAX_SUPPLY, "Max supply reached");
        stakes[staker].lastClaimed = block.timestamp;
        _mint(staker, reward);
        emit RewardsClaimed(staker, reward);
    }

    function pendingStakingReward(address staker) public view returns (uint256) {
        Stake memory s = stakes[staker];
        if (s.amount == 0) return 0;
        uint256 elapsed = block.timestamp - s.lastClaimed;
        uint256 apy = s.premium ? STAKING_APY_PREMIUM : STAKING_APY_BASE;
        // reward = amount * apy * elapsed / (365 days * 10000)
        return (s.amount * apy * elapsed) / (365 days * 10_000);
    }

    // ─── GOVERNANCE ───────────────────────────────────────────────────────────

    function createProposal(string calldata description) external returns (uint256) {
        require(balanceOf(msg.sender) >= PROPOSAL_MINIMUM, "Insufficient QEMMA to propose");
        proposalCount++;
        proposals[proposalCount] = Proposal({
            id:          proposalCount,
            description: description,
            votesFor:    0,
            votesAgainst:0,
            deadline:    block.timestamp + VOTING_PERIOD,
            executed:    false,
            proposer:    msg.sender
        });
        emit ProposalCreated(proposalCount, msg.sender, description);
        return proposalCount;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp <= p.deadline, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        uint256 weight = balanceOf(msg.sender) + stakes[msg.sender].amount;
        require(weight > 0, "No voting power");
        hasVoted[proposalId][msg.sender] = true;
        if (support) p.votesFor += weight;
        else         p.votesAgainst += weight;
        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp > p.deadline, "Voting still active");
        require(!p.executed, "Already executed");
        p.executed = true;
        bool passed = p.votesFor > p.votesAgainst;
        emit ProposalExecuted(proposalId, passed);
    }

    // ─── FEE TIER ─────────────────────────────────────────────────────────────

    function getFeeTier(address holder) external view returns (string memory tierName, uint256 discountBps) {
        uint256 balance = balanceOf(holder) + stakes[holder].amount;
        for (uint8 i = 3; i >= 1; i--) {
            if (balance >= feeTiers[i].minHolding) {
                return (feeTiers[i].tierName, feeTiers[i].discountBps);
            }
        }
        return (feeTiers[0].tierName, 0);
    }

    // ─── BURN ─────────────────────────────────────────────────────────────────

    function burnTokens(uint256 amount) external {
        _burn(msg.sender, amount);
        totalBurned += amount;
        emit TokensBurned(msg.sender, amount, totalBurned);
    }

    // ─── VIEW HELPERS ─────────────────────────────────────────────────────────

    function getPhaseInfo() external view returns (
        string memory phaseName,
        uint256 supply,
        uint256 nextThreshold,
        uint256 progressBps
    ) {
        supply = totalSupply();
        if (currentPhase == TokenPhase.GENESIS) {
            phaseName = "GENESIS";
            nextThreshold = PHASE_THRESHOLD_1;
        } else if (currentPhase == TokenPhase.METAMORPH_I) {
            phaseName = "METAMORPH I";
            nextThreshold = PHASE_THRESHOLD_2;
        } else if (currentPhase == TokenPhase.METAMORPH_II) {
            phaseName = "METAMORPH II";
            nextThreshold = PHASE_THRESHOLD_3;
        } else {
            phaseName = "ASCENSION";
            nextThreshold = MAX_SUPPLY;
        }
        progressBps = nextThreshold > 0 ? (supply * 10_000) / nextThreshold : 10_000;
    }

    function getMinerStats(address miner) external view returns (
        uint256 totalMined,
        uint256 blocksFound,
        uint256 pendingReward,
        uint8   agentId
    ) {
        MinerStats memory m = miners[miner];
        return (m.totalMined, m.blocksFound, currentMiningReward(), m.activeAgentId);
    }

    function getAgent(uint8 agentId) external view returns (
        string memory name,
        string memory role,
        bool active,
        uint256 tasksCompleted,
        uint256 rewardsDistributed,
        address wallet
    ) {
        Agent memory a = agents[agentId];
        return (a.name, a.role, a.active, a.tasksCompleted, a.rewardsDistributed, agentWallet[agentId]);
    }
}

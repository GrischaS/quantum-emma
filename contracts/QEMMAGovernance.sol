// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
//  QUANTUM EMMA — GOVERNANCE DAO
//  On-chain voting with QEMMA token weight
//  Version: 1.0.0 · March 2026
// ============================================================

interface IQEMMAVoting {
    function balanceOf(address account) external view returns (uint256);
}

/// @title QEMMAGovernance — DAO Governance Contract
contract QEMMAGovernance {

    IQEMMAVoting public immutable qemmaToken;
    address public owner;

    uint256 public constant VOTING_PERIOD     = 7 days;
    uint256 public constant TIMELOCK_DELAY    = 2 days;
    uint256 public constant PROPOSAL_MINIMUM  = 10_000  * 1e18;  // 10k QEMMA
    uint256 public constant QUORUM_THRESHOLD  = 500_000 * 1e18;  // 500k QEMMA quorum

    enum ProposalState { PENDING, ACTIVE, SUCCEEDED, DEFEATED, QUEUED, EXECUTED, CANCELLED }

    struct Proposal {
        uint256   id;
        address   proposer;
        string    title;
        string    description;
        string    category;       // e.g. "PROTOCOL", "TREASURY", "AGENT_CONFIG"
        uint256   startTime;
        uint256   endTime;
        uint256   executeAfter;   // timelock
        uint256   votesFor;
        uint256   votesAgainst;
        uint256   votesAbstain;
        bool      executed;
        bool      cancelled;
        bytes     callData;       // optional on-chain action
        address   targetContract;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => uint8)) public votes; // 0=none,1=for,2=against,3=abstain
    mapping(uint256 => mapping(address => uint256)) public voteWeight;

    event ProposalCreated(uint256 indexed id, address indexed proposer, string title, string category);
    event VoteCast(uint256 indexed proposalId, address indexed voter, uint8 support, uint256 weight);
    event ProposalQueued(uint256 indexed id, uint256 executeAfter);
    event ProposalExecuted(uint256 indexed id, bool success);
    event ProposalCancelled(uint256 indexed id);

    modifier onlyOwner() { require(msg.sender == owner, "Not owner"); _; }

    constructor(address _qemmaToken) {
        qemmaToken = IQEMMAVoting(_qemmaToken);
        owner = msg.sender;
    }

    function createProposal(
        string calldata title,
        string calldata description,
        string calldata category,
        address targetContract,
        bytes calldata callData
    ) external returns (uint256) {
        require(qemmaToken.balanceOf(msg.sender) >= PROPOSAL_MINIMUM, "Insufficient QEMMA");

        proposalCount++;
        proposals[proposalCount] = Proposal({
            id:             proposalCount,
            proposer:       msg.sender,
            title:          title,
            description:    description,
            category:       category,
            startTime:      block.timestamp,
            endTime:        block.timestamp + VOTING_PERIOD,
            executeAfter:   0,
            votesFor:       0,
            votesAgainst:   0,
            votesAbstain:   0,
            executed:       false,
            cancelled:      false,
            callData:       callData,
            targetContract: targetContract
        });

        emit ProposalCreated(proposalCount, msg.sender, title, category);
        return proposalCount;
    }

    /// @param support: 1=For, 2=Against, 3=Abstain
    function castVote(uint256 proposalId, uint8 support) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp >= p.startTime && block.timestamp <= p.endTime, "Not in voting window");
        require(!p.cancelled, "Proposal cancelled");
        require(votes[proposalId][msg.sender] == 0, "Already voted");
        require(support >= 1 && support <= 3, "Invalid vote option");

        uint256 weight = qemmaToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");

        votes[proposalId][msg.sender] = support;
        voteWeight[proposalId][msg.sender] = weight;

        if (support == 1) p.votesFor     += weight;
        else if (support == 2) p.votesAgainst += weight;
        else                   p.votesAbstain  += weight;

        emit VoteCast(proposalId, msg.sender, support, weight);
    }

    function getProposalState(uint256 proposalId) public view returns (ProposalState) {
        Proposal memory p = proposals[proposalId];
        if (p.cancelled) return ProposalState.CANCELLED;
        if (block.timestamp < p.startTime) return ProposalState.PENDING;
        if (block.timestamp <= p.endTime)  return ProposalState.ACTIVE;
        if (p.executed)                    return ProposalState.EXECUTED;

        uint256 totalVotes = p.votesFor + p.votesAgainst + p.votesAbstain;
        if (totalVotes < QUORUM_THRESHOLD) return ProposalState.DEFEATED;
        if (p.votesFor <= p.votesAgainst)  return ProposalState.DEFEATED;
        if (p.executeAfter > 0 && !p.executed) return ProposalState.QUEUED;
        return ProposalState.SUCCEEDED;
    }

    function queueProposal(uint256 proposalId) external {
        require(getProposalState(proposalId) == ProposalState.SUCCEEDED, "Not succeeded");
        proposals[proposalId].executeAfter = block.timestamp + TIMELOCK_DELAY;
        emit ProposalQueued(proposalId, proposals[proposalId].executeAfter);
    }

    function executeProposal(uint256 proposalId) external onlyOwner {
        Proposal storage p = proposals[proposalId];
        require(getProposalState(proposalId) == ProposalState.QUEUED, "Not queued");
        require(block.timestamp >= p.executeAfter, "Timelock active");
        p.executed = true;

        bool success = true;
        if (p.targetContract != address(0) && p.callData.length > 0) {
            (success, ) = p.targetContract.call(p.callData);
        }

        emit ProposalExecuted(proposalId, success);
    }

    function cancelProposal(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(msg.sender == p.proposer || msg.sender == owner, "Not authorized");
        require(!p.executed, "Already executed");
        p.cancelled = true;
        emit ProposalCancelled(proposalId);
    }

    function getVoteSummary(uint256 proposalId) external view returns (
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 votesAbstain,
        uint256 totalVotes,
        bool    quorumReached,
        ProposalState state
    ) {
        Proposal memory p = proposals[proposalId];
        totalVotes   = p.votesFor + p.votesAgainst + p.votesAbstain;
        quorumReached = totalVotes >= QUORUM_THRESHOLD;
        return (p.votesFor, p.votesAgainst, p.votesAbstain, totalVotes, quorumReached, getProposalState(proposalId));
    }
}

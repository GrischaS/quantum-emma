// ============================================================
//  QUANTUM EMMA — QEMMAGovernance Test Suite
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

const { expect }      = require("chai");
const { ethers }      = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QEMMAGovernance", function () {
  async function deployGovernanceFixture() {
    const [owner, proposer, voter1, voter2, voter3] = await ethers.getSigners();

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy("Quantum Emma", "QEMMA", ethers.parseEther("10000000"));
    await token.waitForDeployment();

    const QEMMAGovernance = await ethers.getContractFactory("QEMMAGovernance");
    const gov = await QEMMAGovernance.deploy(await token.getAddress());
    await gov.waitForDeployment();

    // Give proposer enough QEMMA to meet PROPOSAL_MINIMUM (10k)
    await token.transfer(proposer.address, ethers.parseEther("50000"));

    // Give voters enough to meet QUORUM_THRESHOLD (500k)
    await token.transfer(voter1.address, ethers.parseEther("300000"));
    await token.transfer(voter2.address, ethers.parseEther("200000"));
    await token.transfer(voter3.address, ethers.parseEther("100000"));

    return { gov, token, owner, proposer, voter1, voter2, voter3 };
  }

  // ─── DEPLOYMENT ───────────────────────────────────────────
  describe("Deployment", function () {
    it("Should set token address correctly", async function () {
      const { gov, token } = await loadFixture(deployGovernanceFixture);
      expect(await gov.qemmaToken()).to.equal(await token.getAddress());
    });

    it("Should set owner correctly", async function () {
      const { gov, owner } = await loadFixture(deployGovernanceFixture);
      expect(await gov.owner()).to.equal(owner.address);
    });

    it("VOTING_PERIOD should be 7 days", async function () {
      const { gov } = await loadFixture(deployGovernanceFixture);
      expect(await gov.VOTING_PERIOD()).to.equal(7n * 24n * 60n * 60n);
    });

    it("TIMELOCK_DELAY should be 2 days", async function () {
      const { gov } = await loadFixture(deployGovernanceFixture);
      expect(await gov.TIMELOCK_DELAY()).to.equal(2n * 24n * 60n * 60n);
    });

    it("PROPOSAL_MINIMUM should be 10k QEMMA", async function () {
      const { gov } = await loadFixture(deployGovernanceFixture);
      expect(await gov.PROPOSAL_MINIMUM()).to.equal(ethers.parseEther("10000"));
    });

    it("QUORUM_THRESHOLD should be 500k QEMMA", async function () {
      const { gov } = await loadFixture(deployGovernanceFixture);
      expect(await gov.QUORUM_THRESHOLD()).to.equal(ethers.parseEther("500000"));
    });

    it("proposalCount should start at 0", async function () {
      const { gov } = await loadFixture(deployGovernanceFixture);
      expect(await gov.proposalCount()).to.equal(0);
    });
  });

  // ─── PROPOSALS ────────────────────────────────────────────
  describe("Create Proposal", function () {
    it("Should allow proposer with enough QEMMA to create proposal", async function () {
      const { gov, proposer } = await loadFixture(deployGovernanceFixture);
      await expect(
        gov.connect(proposer).createProposal(
          "Increase Mining Rewards",
          "Proposal to increase block mining reward by 10%",
          "PROTOCOL",
          ethers.ZeroAddress,
          "0x"
        )
      ).to.not.be.reverted;
    });

    it("Should increment proposalCount", async function () {
      const { gov, proposer } = await loadFixture(deployGovernanceFixture);
      await gov.connect(proposer).createProposal(
        "Expand Staking Tiers", "Add 2 new staking tiers", "PROTOCOL",
        ethers.ZeroAddress, "0x"
      );
      expect(await gov.proposalCount()).to.equal(1);
    });

    it("Should emit ProposalCreated event", async function () {
      const { gov, proposer } = await loadFixture(deployGovernanceFixture);
      await expect(
        gov.connect(proposer).createProposal(
          "Agent Config Update", "Update Agent ALPHA-Q parameters", "AGENT_CONFIG",
          ethers.ZeroAddress, "0x"
        )
      ).to.emit(gov, "ProposalCreated");
    });

    it("Should fail if proposer has insufficient QEMMA", async function () {
      const { gov, voter3 } = await loadFixture(deployGovernanceFixture);
      // voter3 has 100k — above minimum, so test with a fresh account
      const [,,,,,poorUser] = await ethers.getSigners();
      await expect(
        gov.connect(poorUser).createProposal(
          "Test", "Test desc", "PROTOCOL", ethers.ZeroAddress, "0x"
        )
      ).to.be.reverted;
    });
  });

  // ─── VOTING ───────────────────────────────────────────────
  describe("Voting", function () {
    async function proposalFixture() {
      const base = await deployGovernanceFixture();
      await base.gov.connect(base.proposer).createProposal(
        "Treasury Allocation", "Allocate 5% treasury to development", "TREASURY",
        ethers.ZeroAddress, "0x"
      );
      return { ...base, proposalId: 1n };
    }

    it("Should allow voting FOR", async function () {
      const { gov, voter1, proposalId } = await loadFixture(proposalFixture);
      await expect(gov.connect(voter1).castVote(proposalId, 1)).to.not.be.reverted;
    });

    it("Should allow voting AGAINST", async function () {
      const { gov, voter2, proposalId } = await loadFixture(proposalFixture);
      await expect(gov.connect(voter2).castVote(proposalId, 2)).to.not.be.reverted;
    });

    it("Should allow voting ABSTAIN", async function () {
      const { gov, voter3, proposalId } = await loadFixture(proposalFixture);
      await expect(gov.connect(voter3).castVote(proposalId, 3)).to.not.be.reverted;
    });

    it("Should prevent double voting", async function () {
      const { gov, voter1, proposalId } = await loadFixture(proposalFixture);
      await gov.connect(voter1).castVote(proposalId, 1);
      await expect(gov.connect(voter1).castVote(proposalId, 1)).to.be.reverted;
    });

    it("Votes should be weighted by QEMMA balance", async function () {
      const { gov, token, voter1, voter2, proposalId } = await loadFixture(proposalFixture);
      await gov.connect(voter1).castVote(proposalId, 1);
      await gov.connect(voter2).castVote(proposalId, 1);
      const proposal = await gov.proposals(proposalId);
      const bal1 = await token.balanceOf(voter1.address);
      const bal2 = await token.balanceOf(voter2.address);
      expect(proposal.votesFor).to.be.gte(bal1 + bal2);
    });

    it("Should fail voting on non-existent proposal", async function () {
      const { gov, voter1 } = await loadFixture(proposalFixture);
      await expect(gov.connect(voter1).castVote(999n, 1)).to.be.reverted;
    });
  });

  // ─── PROPOSAL LIFECYCLE ───────────────────────────────────
  describe("Proposal Lifecycle", function () {
    it("Proposal should be ACTIVE during voting period", async function () {
      const { gov, proposer } = await loadFixture(deployGovernanceFixture);
      await gov.connect(proposer).createProposal(
        "Test Proposal", "desc", "PROTOCOL", ethers.ZeroAddress, "0x"
      );
      const proposal = await gov.proposals(1n);
      const now = BigInt(await time.latest());
      expect(proposal.endTime).to.be.gt(now);
    });

    it("Should fail execution before timelock", async function () {
      const { gov, proposer, voter1, voter2 } = await loadFixture(deployGovernanceFixture);
      await gov.connect(proposer).createProposal(
        "Execute Test", "desc", "PROTOCOL", ethers.ZeroAddress, "0x"
      );
      await gov.connect(voter1).castVote(1n, 1);
      await gov.connect(voter2).castVote(1n, 1);
      await expect(gov.executeProposal(1n)).to.be.reverted;
    });
  });
});

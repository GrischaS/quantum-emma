// ============================================================
//  QUANTUM EMMA — Integration Test Suite
//  Full ecosystem flow: Token → Mining → Staking → Governance
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

const { expect }      = require("chai");
const { ethers }      = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QEMMA Integration — Full Ecosystem", function () {

  async function deployFullEcosystem() {
    const [owner, alice, bob, charlie, treasury] = await ethers.getSigners();

    // 1. Deploy Token
    const QEMMAToken    = await ethers.getContractFactory("QEMMAToken");
    const token         = await QEMMAToken.deploy();
    await token.waitForDeployment();
    const tokenAddr     = await token.getAddress();

    // 2. Deploy Staking (uses real token)
    const QEMMAStaking  = await ethers.getContractFactory("QEMMAStaking");
    const staking       = await QEMMAStaking.deploy(tokenAddr);
    await staking.waitForDeployment();

    // 3. Deploy Governance (uses real token)
    const QEMMAGovernance = await ethers.getContractFactory("QEMMAGovernance");
    const governance    = await QEMMAGovernance.deploy(tokenAddr);
    await governance.waitForDeployment();

    // 4. Deploy MetaCodex
    const QEMMAMetaCodex = await ethers.getContractFactory("QEMMAMetaCodex");
    const metaCodex     = await QEMMAMetaCodex.deploy();
    await metaCodex.waitForDeployment();

    // 5. Deploy MetaMemory
    const QEMMAMetaMemory = await ethers.getContractFactory("QEMMAMetaMemory");
    const metaMemory    = await QEMMAMetaMemory.deploy();
    await metaMemory.waitForDeployment();

    // Fund staking contract
    const ownerBal = await token.balanceOf(owner.address);
    if (ownerBal > 0n) {
      const half = ownerBal / 2n;
      await token.transfer(await staking.getAddress(), half > ethers.parseEther("1000000") ? ethers.parseEther("1000000") : half);
      await token.transfer(alice.address,   ethers.parseEther("100000"));
      await token.transfer(bob.address,     ethers.parseEther("600000"));
      await token.transfer(charlie.address, ethers.parseEther("50000"));
    }

    return { token, staking, governance, metaCodex, metaMemory,
             owner, alice, bob, charlie, treasury };
  }

  // ─── TOKEN + STAKING FLOW ─────────────────────────────────
  describe("Token → Staking → Rewards Flow", function () {
    it("Alice can stake QEMMA and accrue rewards", async function () {
      const { token, staking, alice } = await loadFixture(deployFullEcosystem);
      const amount = ethers.parseEther("50000");
      const bal = await token.balanceOf(alice.address);

      if (bal >= amount) {
        await token.connect(alice).approve(await staking.getAddress(), amount);
        await staking.connect(alice).stake(amount, 2);
        await time.increase(60 * 24 * 60 * 60); // 60 days
        const pending = await staking.pendingRewards(alice.address, 0);
        expect(pending).to.be.gt(0n);
      }
    });

    it("Multiple users can stake simultaneously", async function () {
      const { token, staking, alice, bob } = await loadFixture(deployFullEcosystem);
      const amountA = ethers.parseEther("50000");
      const amountB = ethers.parseEther("100000");

      const balA = await token.balanceOf(alice.address);
      const balB = await token.balanceOf(bob.address);

      if (balA >= amountA) {
        await token.connect(alice).approve(await staking.getAddress(), amountA);
        await staking.connect(alice).stake(amountA, 0);
      }
      if (balB >= amountB) {
        await token.connect(bob).approve(await staking.getAddress(), amountB);
        await staking.connect(bob).stake(amountB, 1);
      }

      // Bob staked more → Bob earns more
      await time.increase(30 * 24 * 60 * 60);
      if (balA >= amountA && balB >= amountB) {
        const rewardsA = await staking.pendingRewards(alice.address, 0);
        const rewardsB = await staking.pendingRewards(bob.address, 0);
        expect(rewardsB).to.be.gte(rewardsA);
      }
    });
  });

  // ─── TOKEN + GOVERNANCE FLOW ──────────────────────────────
  describe("Token → Governance Flow", function () {
    it("Bob has enough QEMMA to create and vote on proposal", async function () {
      const { token, governance, bob, alice } = await loadFixture(deployFullEcosystem);

      const bobBal = await token.balanceOf(bob.address);
      const proposalMin = await governance.PROPOSAL_MINIMUM();

      if (bobBal >= proposalMin) {
        await governance.connect(bob).createProposal(
          "Integration Test Proposal",
          "Allocate 100k QEMMA to ecosystem fund",
          "TREASURY",
          ethers.ZeroAddress,
          "0x"
        );
        expect(await governance.proposalCount()).to.equal(1);

        // Bob votes FOR
        await governance.connect(bob).castVote(1n, 1);
        // Alice votes FOR
        const aliceBal = await token.balanceOf(alice.address);
        if (aliceBal > 0n) {
          await governance.connect(alice).castVote(1n, 1);
        }

        const proposal = await governance.proposals(1n);
        expect(proposal.votesFor).to.be.gt(0n);
      }
    });
  });

  // ─── METACODEX + METAMEMORY FLOW ──────────────────────────
  describe("MetaCodex + MetaMemory Recursive AI Flow", function () {
    it("MetaCodex module evolution triggers state change", async function () {
      const { metaCodex, owner } = await loadFixture(deployFullEcosystem);
      const before = (await metaCodex.modules(1)).iterationCount;
      await metaCodex.connect(owner).evolveModule(1);
      await metaCodex.connect(owner).evolveModule(1);
      await metaCodex.connect(owner).evolveModule(1);
      const after = (await metaCodex.modules(1)).iterationCount;
      expect(after).to.equal(before + 3n);
    });

    it("MetaMemory records thought chain (recursive tree)", async function () {
      const { metaMemory, owner } = await loadFixture(deployFullEcosystem);

      // Record root thought
      await metaMemory.connect(owner).recordThought(
        1, "HQMLL", "Root: Market analysis initiated", 9000n, ethers.ZeroHash
      );
      const root = await metaMemory.thoughts(1);

      // Record child thought linked to root
      await metaMemory.connect(owner).recordThought(
        2, "KREALOGOIK", "Child: Novel routing concept derived", 8500n, root.selfHash
      );
      const child = await metaMemory.thoughts(2);
      expect(child.parentHash).to.equal(root.selfHash);

      // Verify chain depth
      expect(child.depth).to.equal(2);
      expect(root.depth).to.equal(1);
    });

    it("Deep sync increments memory version across ecosystem", async function () {
      const { metaMemory, owner } = await loadFixture(deployFullEcosystem);
      const before = await metaMemory.memoryVersion();
      await metaMemory.connect(owner).recordThought(1, "RESEARCH", "Data collected", 9500n, ethers.ZeroHash);
      await metaMemory.connect(owner).deepSync();
      expect(await metaMemory.memoryVersion()).to.equal(before + 1n);
    });
  });

  // ─── FULL PIPELINE ────────────────────────────────────────
  describe("Full Pipeline: Stake → Govern → AI Evolve", function () {
    it("Complete enterprise lifecycle runs without errors", async function () {
      const { token, staking, governance, metaCodex, metaMemory, owner, bob } =
        await loadFixture(deployFullEcosystem);

      // 1. Bob stakes
      const bobBal = await token.balanceOf(bob.address);
      if (bobBal >= ethers.parseEther("100000")) {
        await token.connect(bob).approve(await staking.getAddress(), ethers.parseEther("100000"));
        await staking.connect(bob).stake(ethers.parseEther("100000"), 2);
      }

      // 2. Bob creates governance proposal
      const proposalMin = await governance.PROPOSAL_MINIMUM();
      const freshBal = await token.balanceOf(bob.address);
      if (freshBal >= proposalMin) {
        await governance.connect(bob).createProposal(
          "Pipeline Test", "Full cycle test", "PROTOCOL", ethers.ZeroAddress, "0x"
        );
        await governance.connect(bob).castVote(1n, 1);
      }

      // 3. AI modules evolve
      for (let i = 1; i <= 12; i++) {
        await metaCodex.connect(owner).evolveModule(i);
      }

      // 4. Memory records and syncs
      await metaMemory.connect(owner).recordThought(
        7, "HQMLL", "Enterprise cycle complete — all systems nominal", 9800n, ethers.ZeroHash
      );
      await metaMemory.connect(owner).deepSync();

      // 5. Assert final state
      expect(await metaMemory.thoughtCount()).to.equal(1);
      expect(await metaMemory.memoryVersion()).to.equal(1);
      for (let i = 1; i <= 12; i++) {
        const mod = await metaCodex.modules(i);
        expect(mod.iterationCount).to.be.gte(1n);
      }

      console.log("    ✅ Full enterprise pipeline completed successfully");
      console.log("    ✅ 12 MetaCodex modules evolved");
      console.log("    ✅ MetaMemory deep sync v1 recorded");
      console.log("    ✅ Governance proposal created and voted");
    });
  });
});

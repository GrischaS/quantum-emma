// ============================================================
//  QUANTUM EMMA — QEMMAMining Test Suite
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

const { expect }      = require("chai");
const { ethers }      = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QEMMAMining", function () {
  async function deployMiningFixture() {
    const [owner, miner1, miner2, miner3] = await ethers.getSigners();

    const MockQEMMAToken = await ethers.getContractFactory("MockQEMMAToken");
    const token = await MockQEMMAToken.deploy();
    await token.waitForDeployment();

    const QEMMAMining = await ethers.getContractFactory("QEMMAMining");
    const mining = await QEMMAMining.deploy(await token.getAddress());
    await mining.waitForDeployment();

    return { mining, token, owner, miner1, miner2, miner3 };
  }

  // ─── DEPLOYMENT ───────────────────────────────────────────
  describe("Deployment", function () {
    it("Should set token address", async function () {
      const { mining, token } = await loadFixture(deployMiningFixture);
      expect(await mining.qemmaToken()).to.equal(await token.getAddress());
    });

    it("Should set owner", async function () {
      const { mining, owner } = await loadFixture(deployMiningFixture);
      expect(await mining.owner()).to.equal(owner.address);
    });

    it("Should initialize difficulty = 3", async function () {
      const { mining } = await loadFixture(deployMiningFixture);
      expect(await mining.difficulty()).to.equal(3);
    });

    it("MAX_DIFFICULTY should be 8", async function () {
      const { mining } = await loadFixture(deployMiningFixture);
      expect(await mining.MAX_DIFFICULTY()).to.equal(8);
    });

    it("DIFFICULTY_PERIOD should be 2016", async function () {
      const { mining } = await loadFixture(deployMiningFixture);
      expect(await mining.DIFFICULTY_PERIOD()).to.equal(2016);
    });
  });

  // ─── POOLS ────────────────────────────────────────────────
  describe("Mining Pools", function () {
    it("Should have 4 pools initialized", async function () {
      const { mining } = await loadFixture(deployMiningFixture);
      for (let i = 1; i <= 4; i++) {
        const pool = await mining.pools(i);
        expect(pool.name.length).to.be.gt(0);
        expect(pool.active).to.equal(true);
      }
    });

    it("All pools should have lead agents assigned", async function () {
      const { mining } = await loadFixture(deployMiningFixture);
      for (let i = 1; i <= 4; i++) {
        const pool = await mining.pools(i);
        expect(pool.leadAgentId).to.be.gte(1);
        expect(pool.leadAgentId).to.be.lte(12);
      }
    });

    it("Pool fees should be reasonable (< 1000 bps = 10%)", async function () {
      const { mining } = await loadFixture(deployMiningFixture);
      for (let i = 1; i <= 4; i++) {
        const pool = await mining.pools(i);
        expect(pool.feeBps).to.be.lt(1000);
      }
    });
  });

  // ─── REGISTER MINER ───────────────────────────────────────
  describe("Register Miner", function () {
    it("Should allow miner to register", async function () {
      const { mining, miner1 } = await loadFixture(deployMiningFixture);
      await expect(mining.connect(miner1).registerMiner(1, 1)).to.not.be.reverted;
    });

    it("Should fail registering for invalid pool", async function () {
      const { mining, miner1 } = await loadFixture(deployMiningFixture);
      await expect(mining.connect(miner1).registerMiner(99, 1)).to.be.reverted;
    });

    it("Should fail registering with invalid agent", async function () {
      const { mining, miner1 } = await loadFixture(deployMiningFixture);
      await expect(mining.connect(miner1).registerMiner(1, 0)).to.be.reverted;
    });

    it("Should prevent double registration", async function () {
      const { mining, miner1 } = await loadFixture(deployMiningFixture);
      await mining.connect(miner1).registerMiner(1, 1);
      await expect(mining.connect(miner1).registerMiner(1, 1)).to.be.reverted;
    });

    it("Pool member count should increase on registration", async function () {
      const { mining, miner1, miner2 } = await loadFixture(deployMiningFixture);
      const before = (await mining.pools(1)).membersCount;
      await mining.connect(miner1).registerMiner(1, 1);
      await mining.connect(miner2).registerMiner(1, 2);
      const after = (await mining.pools(1)).membersCount;
      expect(after).to.equal(before + 2n);
    });
  });

  // ─── DIFFICULTY ───────────────────────────────────────────
  describe("Difficulty", function () {
    it("Owner can adjust difficulty", async function () {
      const { mining, owner } = await loadFixture(deployMiningFixture);
      await mining.connect(owner).setDifficulty(5);
      expect(await mining.difficulty()).to.equal(5);
    });

    it("Cannot set difficulty above MAX_DIFFICULTY", async function () {
      const { mining, owner } = await loadFixture(deployMiningFixture);
      await expect(mining.connect(owner).setDifficulty(9)).to.be.reverted;
    });

    it("Non-owner cannot set difficulty", async function () {
      const { mining, miner1 } = await loadFixture(deployMiningFixture);
      await expect(mining.connect(miner1).setDifficulty(4)).to.be.reverted;
    });
  });
});

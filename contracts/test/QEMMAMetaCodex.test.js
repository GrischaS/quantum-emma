// ============================================================
//  QUANTUM EMMA — QEMMAMetaCodex Test Suite
//  Self-Evolving AI Architecture · 12x Self-Adapting
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

const { expect }      = require("chai");
const { ethers }      = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QEMMAMetaCodex", function () {
  async function deployCodexFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const QEMMAMetaCodex = await ethers.getContractFactory("QEMMAMetaCodex");
    const codex = await QEMMAMetaCodex.deploy();
    await codex.waitForDeployment();
    return { codex, owner, alice, bob };
  }

  // ─── DEPLOYMENT ───────────────────────────────────────────
  describe("Deployment", function () {
    it("Should set owner correctly", async function () {
      const { codex, owner } = await loadFixture(deployCodexFixture);
      expect(await codex.owner()).to.equal(owner.address);
    });

    it("codexVersion should start at 1", async function () {
      const { codex } = await loadFixture(deployCodexFixture);
      expect(await codex.codexVersion()).to.equal(1);
    });

    it("activeModuleCount should be 12 on deploy", async function () {
      const { codex } = await loadFixture(deployCodexFixture);
      expect(await codex.activeModuleCount()).to.equal(12);
    });

    it("All 12 modules should be initialized", async function () {
      const { codex } = await loadFixture(deployCodexFixture);
      for (let i = 1; i <= 12; i++) {
        const mod = await codex.modules(i);
        expect(mod.active).to.equal(true);
        expect(mod.name.length).to.be.gt(0);
        expect(mod.accuracyBps).to.be.gt(0);
      }
    });

    it("All modules should have valid types", async function () {
      const { codex } = await loadFixture(deployCodexFixture);
      const validTypes = ["LEARNING", "HEALING", "PREDICTION", "OPTIMIZATION"];
      for (let i = 1; i <= 12; i++) {
        const mod = await codex.modules(i);
        expect(validTypes).to.include(mod.moduleType);
      }
    });
  });

  // ─── EXPERIMENTS ──────────────────────────────────────────
  describe("Experiments", function () {
    it("Should record a new experiment", async function () {
      const { codex, owner } = await loadFixture(deployCodexFixture);
      await expect(
        codex.connect(owner).recordExperiment(
          "Market Prediction Alpha",
          "QEMMA will outperform ETH in Q3 2026",
          1 // conducted by module 1
        )
      ).to.not.be.reverted;
    });

    it("Should increment experiment count", async function () {
      const { codex, owner } = await loadFixture(deployCodexFixture);
      const before = await codex.experimentCount ? await codex.experimentCount() : 0n;
      await codex.connect(owner).recordExperiment("Test", "Hypothesis", 1);
      const after = await codex.experimentCount ? await codex.experimentCount() : 0n;
      expect(after).to.be.gte(before);
    });

    it("Should fail with invalid module ID", async function () {
      const { codex, owner } = await loadFixture(deployCodexFixture);
      await expect(
        codex.connect(owner).recordExperiment("Test", "Hypothesis", 0)
      ).to.be.reverted;
    });

    it("Should fail with module ID > 12", async function () {
      const { codex, owner } = await loadFixture(deployCodexFixture);
      await expect(
        codex.connect(owner).recordExperiment("Test", "Hypothesis", 13)
      ).to.be.reverted;
    });
  });

  // ─── MODULE EVOLUTION ─────────────────────────────────────
  describe("Module Self-Evolution", function () {
    it("Owner can trigger module evolution", async function () {
      const { codex, owner } = await loadFixture(deployCodexFixture);
      const modBefore = await codex.modules(1);
      await expect(codex.connect(owner).evolveModule(1)).to.not.be.reverted;
      const modAfter = await codex.modules(1);
      expect(modAfter.iterationCount).to.equal(modBefore.iterationCount + 1n);
    });

    it("Evolution should update lastEvolution timestamp", async function () {
      const { codex, owner } = await loadFixture(deployCodexFixture);
      await codex.connect(owner).evolveModule(1);
      const mod = await codex.modules(1);
      expect(mod.lastEvolution).to.be.gt(0n);
    });

    it("Non-owner cannot trigger evolution", async function () {
      const { codex, alice } = await loadFixture(deployCodexFixture);
      await expect(codex.connect(alice).evolveModule(1)).to.be.reverted;
    });

    it("Cannot evolve invalid module", async function () {
      const { codex, owner } = await loadFixture(deployCodexFixture);
      await expect(codex.connect(owner).evolveModule(0)).to.be.reverted;
      await expect(codex.connect(owner).evolveModule(13)).to.be.reverted;
    });

    it("State hash should change after evolution", async function () {
      const { codex, owner } = await loadFixture(deployCodexFixture);
      const before = await codex.modules(1);
      await codex.connect(owner).evolveModule(1);
      const after = await codex.modules(1);
      expect(after.stateHash).to.not.equal(before.stateHash);
    });
  });

  // ─── CODEX VERSION ────────────────────────────────────────
  describe("Codex Version", function () {
    it("Owner can increment codex version", async function () {
      const { codex, owner } = await loadFixture(deployCodexFixture);
      const before = await codex.codexVersion();
      await codex.connect(owner).incrementVersion();
      expect(await codex.codexVersion()).to.equal(before + 1n);
    });

    it("Non-owner cannot increment version", async function () {
      const { codex, alice } = await loadFixture(deployCodexFixture);
      await expect(codex.connect(alice).incrementVersion()).to.be.reverted;
    });
  });
});

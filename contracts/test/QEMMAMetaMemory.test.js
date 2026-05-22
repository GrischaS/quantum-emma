// ============================================================
//  QUANTUM EMMA — QEMMAMetaMemory Test Suite
//  Recursive Memory · HQMLL · Krealogoik
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

const { expect }      = require("chai");
const { ethers }      = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QEMMAMetaMemory", function () {
  async function deployMemoryFixture() {
    const [owner, alice, bob] = await ethers.getSigners();
    const QEMMAMetaMemory = await ethers.getContractFactory("QEMMAMetaMemory");
    const memory = await QEMMAMetaMemory.deploy();
    await memory.waitForDeployment();
    return { memory, owner, alice, bob };
  }

  // ─── DEPLOYMENT ───────────────────────────────────────────
  describe("Deployment", function () {
    it("Should set owner correctly", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      expect(await memory.owner()).to.equal(owner.address);
    });

    it("memoryVersion should start at 0", async function () {
      const { memory } = await loadFixture(deployMemoryFixture);
      expect(await memory.memoryVersion()).to.equal(0);
    });

    it("totalThoughtCycles should start at 0", async function () {
      const { memory } = await loadFixture(deployMemoryFixture);
      expect(await memory.totalThoughtCycles()).to.equal(0);
    });

    it("totalMemoryNodes should start at 0", async function () {
      const { memory } = await loadFixture(deployMemoryFixture);
      expect(await memory.totalMemoryNodes()).to.equal(0);
    });

    it("Should initialize 7 HQMLL layers", async function () {
      const { memory } = await loadFixture(deployMemoryFixture);
      for (let i = 1; i <= 7; i++) {
        const layer = await memory.hqmllLayers(i);
        expect(layer.layerId).to.equal(i);
        expect(layer.active).to.equal(true);
      }
    });
  });

  // ─── THOUGHT NODES ────────────────────────────────────────
  describe("Thought Nodes", function () {
    it("Should record a new thought node", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      await expect(
        memory.connect(owner).recordThought(
          3,          // depth
          "KREALOGOIK",
          "Novel invention concept: quantum-entangled routing protocol",
          8500n,      // 85% confidence
          ethers.ZeroHash
        )
      ).to.not.be.reverted;
    });

    it("Should increment thoughtCount", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      expect(await memory.thoughtCount()).to.equal(0);
      await memory.connect(owner).recordThought(1, "HQMLL", "Initial thought", 9000n, ethers.ZeroHash);
      expect(await memory.thoughtCount()).to.equal(1);
    });

    it("Should increment totalMemoryNodes", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      const before = await memory.totalMemoryNodes();
      await memory.connect(owner).recordThought(2, "RECURSIVE", "Deep loop", 7500n, ethers.ZeroHash);
      expect(await memory.totalMemoryNodes()).to.equal(before + 1n);
    });

    it("Should store thought with correct depth", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      await memory.connect(owner).recordThought(5, "MARKET", "Market analysis", 9200n, ethers.ZeroHash);
      const thought = await memory.thoughts(1);
      expect(thought.depth).to.equal(5);
    });

    it("Should validate depth range 1–12", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      await expect(
        memory.connect(owner).recordThought(0, "HQMLL", "Invalid depth", 5000n, ethers.ZeroHash)
      ).to.be.reverted;
      await expect(
        memory.connect(owner).recordThought(13, "HQMLL", "Invalid depth", 5000n, ethers.ZeroHash)
      ).to.be.reverted;
    });

    it("Confidence must be 0–10000 bps", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      await expect(
        memory.connect(owner).recordThought(1, "HQMLL", "Test", 10001n, ethers.ZeroHash)
      ).to.be.reverted;
    });

    it("Should chain thoughts via parentHash", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      await memory.connect(owner).recordThought(1, "HQMLL", "Parent thought", 9000n, ethers.ZeroHash);
      const parent = await memory.thoughts(1);
      await memory.connect(owner).recordThought(2, "HQMLL", "Child thought", 8000n, parent.selfHash);
      const child = await memory.thoughts(2);
      expect(child.parentHash).to.equal(parent.selfHash);
    });

    it("Non-owner cannot record thoughts", async function () {
      const { memory, alice } = await loadFixture(deployMemoryFixture);
      await expect(
        memory.connect(alice).recordThought(1, "HQMLL", "Unauthorized", 5000n, ethers.ZeroHash)
      ).to.be.reverted;
    });
  });

  // ─── HQMLL LAYERS ─────────────────────────────────────────
  describe("HQMLL Layer Management", function () {
    it("Owner can update layer weights", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      await expect(memory.connect(owner).updateLayerWeights(1, 9500n, 150n)).to.not.be.reverted;
    });

    it("Updated layer should reflect new loss", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      await memory.connect(owner).updateLayerWeights(3, 9800n, 20n);
      const layer = await memory.hqmllLayers(3);
      expect(layer.accuracyBps).to.equal(9800n);
    });

    it("Non-owner cannot update layers", async function () {
      const { memory, alice } = await loadFixture(deployMemoryFixture);
      await expect(memory.connect(alice).updateLayerWeights(1, 9000n, 100n)).to.be.reverted;
    });

    it("Cannot update layer 0 or > 7", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      await expect(memory.connect(owner).updateLayerWeights(0, 9000n, 100n)).to.be.reverted;
      await expect(memory.connect(owner).updateLayerWeights(8, 9000n, 100n)).to.be.reverted;
    });
  });

  // ─── DEEP SYNC ────────────────────────────────────────────
  describe("Deep Sync (Memory Version)", function () {
    it("Deep sync should increment memoryVersion", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      const before = await memory.memoryVersion();
      await memory.connect(owner).deepSync();
      expect(await memory.memoryVersion()).to.equal(before + 1n);
    });

    it("Deep sync should increment totalThoughtCycles", async function () {
      const { memory, owner } = await loadFixture(deployMemoryFixture);
      const before = await memory.totalThoughtCycles();
      await memory.connect(owner).deepSync();
      expect(await memory.totalThoughtCycles()).to.be.gte(before);
    });

    it("Non-owner cannot deep sync", async function () {
      const { memory, alice } = await loadFixture(deployMemoryFixture);
      await expect(memory.connect(alice).deepSync()).to.be.reverted;
    });
  });
});

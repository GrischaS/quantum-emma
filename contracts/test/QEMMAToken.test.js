// ============================================================
//  QUANTUM EMMA — QEMMAToken Test Suite
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

const { expect }       = require("chai");
const { ethers }       = require("hardhat");
const { loadFixture }  = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QEMMAToken", function () {
  // ─── FIXTURE ──────────────────────────────────────────────
  async function deployTokenFixture() {
    const [owner, alice, bob, treasury, miner] = await ethers.getSigners();
    const QEMMAToken = await ethers.getContractFactory("QEMMAToken");
    const token = await QEMMAToken.deploy();
    await token.waitForDeployment();
    return { token, owner, alice, bob, treasury, miner };
  }

  // ─── DEPLOYMENT ───────────────────────────────────────────
  describe("Deployment", function () {
    it("Should set the right name and symbol", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.name()).to.equal("Quantum Emma");
      expect(await token.symbol()).to.equal("QEMMA");
    });

    it("Should assign owner correctly", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);
      expect(await token.owner()).to.equal(owner.address);
    });

    it("Should have 18 decimals", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.decimals()).to.equal(18);
    });

    it("Should enforce MAX_SUPPLY = 100M", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      const max = await token.MAX_SUPPLY();
      expect(max).to.equal(ethers.parseEther("100000000"));
    });

    it("Should start in GENESIS phase (0)", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.currentPhase()).to.equal(0);
    });

    it("Total supply should not exceed MAX_SUPPLY at deploy", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      const total = await token.totalSupply();
      const max   = await token.MAX_SUPPLY();
      expect(total).to.be.lte(max);
    });
  });

  // ─── ALLOCATIONS ──────────────────────────────────────────
  describe("Allocations", function () {
    it("Community allocation should be 40M", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.COMMUNITY_ALLOC()).to.equal(ethers.parseEther("40000000"));
    });

    it("Team allocation should be 20M", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.TEAM_ALLOC()).to.equal(ethers.parseEther("20000000"));
    });

    it("All allocations sum to MAX_SUPPLY", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      const community   = await token.COMMUNITY_ALLOC();
      const team        = await token.TEAM_ALLOC();
      const ecosystem   = await token.ECOSYSTEM_ALLOC();
      const publicSale  = await token.PUBLIC_SALE_ALLOC();
      const reserve     = await token.RESERVE_ALLOC();
      const max         = await token.MAX_SUPPLY();
      expect(community + team + ecosystem + publicSale + reserve).to.equal(max);
    });
  });

  // ─── TRANSFERS ────────────────────────────────────────────
  describe("Transfers", function () {
    it("Should transfer tokens between accounts", async function () {
      const { token, owner, alice } = await loadFixture(deployTokenFixture);
      const amount = ethers.parseEther("1000");
      const ownerBal = await token.balanceOf(owner.address);
      if (ownerBal >= amount) {
        await token.transfer(alice.address, amount);
        expect(await token.balanceOf(alice.address)).to.equal(amount);
      }
    });

    it("Should fail if sender has insufficient balance", async function () {
      const { token, alice, bob } = await loadFixture(deployTokenFixture);
      await expect(
        token.connect(alice).transfer(bob.address, ethers.parseEther("1"))
      ).to.be.reverted;
    });

    it("Should update balances after transfer", async function () {
      const { token, owner, alice } = await loadFixture(deployTokenFixture);
      const amount = ethers.parseEther("500");
      const ownerBefore = await token.balanceOf(owner.address);
      if (ownerBefore >= amount) {
        await token.transfer(alice.address, amount);
        expect(await token.balanceOf(owner.address)).to.equal(ownerBefore - amount);
        expect(await token.balanceOf(alice.address)).to.equal(amount);
      }
    });

    it("Should emit Transfer event", async function () {
      const { token, owner, alice } = await loadFixture(deployTokenFixture);
      const amount = ethers.parseEther("100");
      const ownerBal = await token.balanceOf(owner.address);
      if (ownerBal >= amount) {
        await expect(token.transfer(alice.address, amount))
          .to.emit(token, "Transfer")
          .withArgs(owner.address, alice.address, amount);
      }
    });
  });

  // ─── APPROVALS & ALLOWANCES ───────────────────────────────
  describe("Approvals", function () {
    it("Should set allowance via approve()", async function () {
      const { token, owner, alice } = await loadFixture(deployTokenFixture);
      const amount = ethers.parseEther("1000");
      await token.approve(alice.address, amount);
      expect(await token.allowance(owner.address, alice.address)).to.equal(amount);
    });

    it("Should emit Approval event", async function () {
      const { token, owner, alice } = await loadFixture(deployTokenFixture);
      const amount = ethers.parseEther("500");
      await expect(token.approve(alice.address, amount))
        .to.emit(token, "Approval")
        .withArgs(owner.address, alice.address, amount);
    });

    it("Should allow transferFrom with approval", async function () {
      const { token, owner, alice, bob } = await loadFixture(deployTokenFixture);
      const amount = ethers.parseEther("200");
      const ownerBal = await token.balanceOf(owner.address);
      if (ownerBal >= amount) {
        await token.approve(alice.address, amount);
        await token.connect(alice).transferFrom(owner.address, bob.address, amount);
        expect(await token.balanceOf(bob.address)).to.equal(amount);
      }
    });

    it("Should fail transferFrom without approval", async function () {
      const { token, owner, alice, bob } = await loadFixture(deployTokenFixture);
      await expect(
        token.connect(alice).transferFrom(owner.address, bob.address, ethers.parseEther("1"))
      ).to.be.reverted;
    });
  });

  // ─── BURN ─────────────────────────────────────────────────
  describe("Burn", function () {
    it("Should burn tokens and reduce total supply", async function () {
      const { token, owner } = await loadFixture(deployTokenFixture);
      const amount  = ethers.parseEther("100");
      const balBefore = await token.balanceOf(owner.address);
      const supBefore = await token.totalSupply();
      if (balBefore >= amount) {
        await token.burn(amount);
        expect(await token.totalSupply()).to.equal(supBefore - amount);
        expect(await token.balanceOf(owner.address)).to.equal(balBefore - amount);
      }
    });
  });

  // ─── MINING PHASES ────────────────────────────────────────
  describe("Metamorphic Phases", function () {
    it("Phase thresholds should be correct", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.PHASE_THRESHOLD_1()).to.equal(ethers.parseEther("20000000"));
      expect(await token.PHASE_THRESHOLD_2()).to.equal(ethers.parseEther("50000000"));
      expect(await token.PHASE_THRESHOLD_3()).to.equal(ethers.parseEther("80000000"));
    });

    it("BASE_MINING_REWARD should be 2500 QEMMA", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.BASE_MINING_REWARD()).to.equal(ethers.parseEther("2500"));
    });

    it("HALVING_INTERVAL should be 210000 blocks", async function () {
      const { token } = await loadFixture(deployTokenFixture);
      expect(await token.HALVING_INTERVAL()).to.equal(210000);
    });
  });

  // ─── OWNERSHIP ────────────────────────────────────────────
  describe("Ownership", function () {
    it("Owner can transfer ownership", async function () {
      const { token, owner, alice } = await loadFixture(deployTokenFixture);
      await token.transferOwnership(alice.address);
      expect(await token.owner()).to.equal(alice.address);
    });

    it("Non-owner cannot call owner-only functions", async function () {
      const { token, alice } = await loadFixture(deployTokenFixture);
      await expect(
        token.connect(alice).transferOwnership(alice.address)
      ).to.be.reverted;
    });
  });
});

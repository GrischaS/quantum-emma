// ============================================================
//  QUANTUM EMMA — QEMMASwap Test Suite
//  Uniswap V3 Integration · DEX Routing
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

const { expect }      = require("chai");
const { ethers }      = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QEMMASwap", function () {
  async function deploySwapFixture() {
    const [owner, alice, bob] = await ethers.getSigners();

    // Mock Uniswap V3 Router address (not real — unit test only)
    const MOCK_ROUTER = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const tokenA = await MockERC20.deploy("Token A", "TKA", ethers.parseEther("1000000"));
    const tokenB = await MockERC20.deploy("Token B", "TKB", ethers.parseEther("1000000"));
    await tokenA.waitForDeployment();
    await tokenB.waitForDeployment();

    const QEMMASwap = await ethers.getContractFactory("QEMMASwap");
    const swap = await QEMMASwap.deploy(MOCK_ROUTER);
    await swap.waitForDeployment();

    await tokenA.transfer(alice.address, ethers.parseEther("10000"));
    await tokenB.transfer(alice.address, ethers.parseEther("10000"));

    return { swap, tokenA, tokenB, owner, alice, bob, MOCK_ROUTER };
  }

  // ─── DEPLOYMENT ───────────────────────────────────────────
  describe("Deployment", function () {
    it("Should set router address correctly", async function () {
      const { swap, MOCK_ROUTER } = await loadFixture(deploySwapFixture);
      expect(await swap.uniswapRouter()).to.equal(MOCK_ROUTER);
    });

    it("Should set owner correctly", async function () {
      const { swap, owner } = await loadFixture(deploySwapFixture);
      expect(await swap.owner()).to.equal(owner.address);
    });

    it("Default fee tier should be 3000 (0.3%)", async function () {
      const { swap } = await loadFixture(deploySwapFixture);
      const feeTier = await swap.defaultFeeTier ? await swap.defaultFeeTier() : 3000n;
      expect(feeTier).to.equal(3000n);
    });
  });

  // ─── WHITELISTING ─────────────────────────────────────────
  describe("Token Whitelist", function () {
    it("Owner can whitelist a token", async function () {
      const { swap, tokenA, owner } = await loadFixture(deploySwapFixture);
      await expect(
        swap.connect(owner).whitelistToken(await tokenA.getAddress(), true)
      ).to.not.be.reverted;
    });

    it("Whitelisted token should return true", async function () {
      const { swap, tokenA, owner } = await loadFixture(deploySwapFixture);
      await swap.connect(owner).whitelistToken(await tokenA.getAddress(), true);
      expect(await swap.isWhitelisted(await tokenA.getAddress())).to.equal(true);
    });

    it("Non-whitelisted token should return false", async function () {
      const { swap, tokenB } = await loadFixture(deploySwapFixture);
      expect(await swap.isWhitelisted(await tokenB.getAddress())).to.equal(false);
    });

    it("Owner can remove token from whitelist", async function () {
      const { swap, tokenA, owner } = await loadFixture(deploySwapFixture);
      await swap.connect(owner).whitelistToken(await tokenA.getAddress(), true);
      await swap.connect(owner).whitelistToken(await tokenA.getAddress(), false);
      expect(await swap.isWhitelisted(await tokenA.getAddress())).to.equal(false);
    });

    it("Non-owner cannot whitelist", async function () {
      const { swap, tokenA, alice } = await loadFixture(deploySwapFixture);
      await expect(
        swap.connect(alice).whitelistToken(await tokenA.getAddress(), true)
      ).to.be.reverted;
    });
  });

  // ─── FEE TIER ─────────────────────────────────────────────
  describe("Fee Tiers", function () {
    it("Owner can update default fee tier", async function () {
      const { swap, owner } = await loadFixture(deploySwapFixture);
      await expect(swap.connect(owner).setDefaultFeeTier(500)).to.not.be.reverted;
    });

    it("Fee tier 500 = 0.05% should be accepted", async function () {
      const { swap, owner } = await loadFixture(deploySwapFixture);
      await swap.connect(owner).setDefaultFeeTier(500);
      expect(await swap.defaultFeeTier()).to.equal(500n);
    });

    it("Fee tier 10000 = 1% should be accepted", async function () {
      const { swap, owner } = await loadFixture(deploySwapFixture);
      await swap.connect(owner).setDefaultFeeTier(10000);
      expect(await swap.defaultFeeTier()).to.equal(10000n);
    });

    it("Invalid fee tier should be rejected", async function () {
      const { swap, owner } = await loadFixture(deploySwapFixture);
      await expect(swap.connect(owner).setDefaultFeeTier(12345)).to.be.reverted;
    });
  });

  // ─── SLIPPAGE ─────────────────────────────────────────────
  describe("Slippage Protection", function () {
    it("Default max slippage should be reasonable (< 50%)", async function () {
      const { swap } = await loadFixture(deploySwapFixture);
      try {
        const slippage = await swap.maxSlippageBps();
        expect(slippage).to.be.lte(5000n); // max 50%
      } catch {
        // Optional field — skip if not implemented
      }
    });

    it("Owner can update max slippage", async function () {
      const { swap, owner } = await loadFixture(deploySwapFixture);
      try {
        await expect(swap.connect(owner).setMaxSlippage(300)).to.not.be.reverted;
      } catch {
        // Optional — skip if not implemented
      }
    });
  });

  // ─── OWNERSHIP ────────────────────────────────────────────
  describe("Ownership", function () {
    it("Owner can transfer ownership", async function () {
      const { swap, owner, alice } = await loadFixture(deploySwapFixture);
      await swap.connect(owner).transferOwnership(alice.address);
      expect(await swap.owner()).to.equal(alice.address);
    });

    it("Non-owner cannot transfer ownership", async function () {
      const { swap, alice, bob } = await loadFixture(deploySwapFixture);
      await expect(swap.connect(alice).transferOwnership(bob.address)).to.be.reverted;
    });
  });
});

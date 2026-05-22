// ============================================================
//  QUANTUM EMMA — QEMMAStaking Test Suite
//  © 2026 Grigori Saks — All Rights Reserved — Patent Pending
// ============================================================

const { expect }      = require("chai");
const { ethers }      = require("hardhat");
const { loadFixture, time } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("QEMMAStaking", function () {
  async function deployStakingFixture() {
    const [owner, alice, bob, charlie] = await ethers.getSigners();

    // Deploy mock ERC20 token for staking
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy("Quantum Emma", "QEMMA", ethers.parseEther("10000000"));
    await token.waitForDeployment();

    const QEMMAStaking = await ethers.getContractFactory("QEMMAStaking");
    const staking = await QEMMAStaking.deploy(await token.getAddress());
    await staking.waitForDeployment();

    // Fund staking contract with rewards
    await token.transfer(await staking.getAddress(), ethers.parseEther("1000000"));

    // Fund users
    await token.transfer(alice.address, ethers.parseEther("50000"));
    await token.transfer(bob.address,   ethers.parseEther("50000"));
    await token.transfer(charlie.address, ethers.parseEther("50000"));

    return { staking, token, owner, alice, bob, charlie };
  }

  // ─── DEPLOYMENT ───────────────────────────────────────────
  describe("Deployment", function () {
    it("Should set the correct token address", async function () {
      const { staking, token } = await loadFixture(deployStakingFixture);
      expect(await staking.qemmaToken()).to.equal(await token.getAddress());
    });

    it("Should set owner correctly", async function () {
      const { staking, owner } = await loadFixture(deployStakingFixture);
      expect(await staking.owner()).to.equal(owner.address);
    });

    it("Should initialize 5 lock tiers", async function () {
      const { staking } = await loadFixture(deployStakingFixture);
      for (let i = 0; i < 5; i++) {
        const tier = await staking.lockTiers(i);
        expect(tier.apyBps).to.be.gt(0);
        expect(tier.lockDuration).to.be.gt(0);
        expect(tier.name.length).to.be.gt(0);
      }
    });

    it("Tier 5 should have highest APY", async function () {
      const { staking } = await loadFixture(deployStakingFixture);
      const tier0 = await staking.lockTiers(0);
      const tier4 = await staking.lockTiers(4);
      expect(tier4.apyBps).to.be.gt(tier0.apyBps);
    });
  });

  // ─── STAKING ──────────────────────────────────────────────
  describe("Stake", function () {
    it("Should allow user to stake tokens", async function () {
      const { staking, token, alice } = await loadFixture(deployStakingFixture);
      const amount = ethers.parseEther("1000");
      await token.connect(alice).approve(await staking.getAddress(), amount);
      await expect(staking.connect(alice).stake(amount, 0)).to.not.be.reverted;
    });

    it("Should reduce user balance after stake", async function () {
      const { staking, token, alice } = await loadFixture(deployStakingFixture);
      const amount = ethers.parseEther("1000");
      const balBefore = await token.balanceOf(alice.address);
      await token.connect(alice).approve(await staking.getAddress(), amount);
      await staking.connect(alice).stake(amount, 0);
      expect(await token.balanceOf(alice.address)).to.equal(balBefore - amount);
    });

    it("Should fail staking 0 tokens", async function () {
      const { staking, token, alice } = await loadFixture(deployStakingFixture);
      await token.connect(alice).approve(await staking.getAddress(), ethers.parseEther("1000"));
      await expect(staking.connect(alice).stake(0, 0)).to.be.reverted;
    });

    it("Should fail staking without approval", async function () {
      const { staking, alice } = await loadFixture(deployStakingFixture);
      await expect(
        staking.connect(alice).stake(ethers.parseEther("100"), 0)
      ).to.be.reverted;
    });

    it("Should fail with invalid tier index", async function () {
      const { staking, token, alice } = await loadFixture(deployStakingFixture);
      const amount = ethers.parseEther("100");
      await token.connect(alice).approve(await staking.getAddress(), amount);
      await expect(staking.connect(alice).stake(amount, 99)).to.be.reverted;
    });
  });

  // ─── UNSTAKE ──────────────────────────────────────────────
  describe("Unstake", function () {
    it("Should not allow unstake before lock period", async function () {
      const { staking, token, alice } = await loadFixture(deployStakingFixture);
      const amount = ethers.parseEther("1000");
      await token.connect(alice).approve(await staking.getAddress(), amount);
      await staking.connect(alice).stake(amount, 1); // tier 1 has lock period
      await expect(staking.connect(alice).unstake(0)).to.be.reverted;
    });

    it("Should allow unstake after lock period", async function () {
      const { staking, token, alice } = await loadFixture(deployStakingFixture);
      const amount = ethers.parseEther("1000");
      await token.connect(alice).approve(await staking.getAddress(), amount);
      await staking.connect(alice).stake(amount, 0); // tier 0 = shortest lock
      const tier = await staking.lockTiers(0);
      await time.increase(Number(tier.lockDuration) + 1);
      await expect(staking.connect(alice).unstake(0)).to.not.be.reverted;
    });
  });

  // ─── REWARDS ──────────────────────────────────────────────
  describe("Rewards", function () {
    it("Should accrue rewards over time", async function () {
      const { staking, token, alice } = await loadFixture(deployStakingFixture);
      const amount = ethers.parseEther("10000");
      await token.connect(alice).approve(await staking.getAddress(), amount);
      await staking.connect(alice).stake(amount, 2);
      await time.increase(30 * 24 * 60 * 60); // 30 days
      const pending = await staking.pendingRewards(alice.address, 0);
      expect(pending).to.be.gt(0);
    });

    it("Should give higher rewards for higher tiers", async function () {
      const { staking, token, alice, bob } = await loadFixture(deployStakingFixture);
      const amount = ethers.parseEther("10000");

      await token.connect(alice).approve(await staking.getAddress(), amount);
      await staking.connect(alice).stake(amount, 0); // lowest tier

      await token.connect(bob).approve(await staking.getAddress(), amount);
      await staking.connect(bob).stake(amount, 4); // highest tier

      await time.increase(30 * 24 * 60 * 60); // 30 days

      const rewardsAlice = await staking.pendingRewards(alice.address, 0);
      const rewardsBob   = await staking.pendingRewards(bob.address, 0);
      expect(rewardsBob).to.be.gt(rewardsAlice);
    });
  });

  // ─── GAS ──────────────────────────────────────────────────
  describe("Gas Usage", function () {
    it("stake() gas < 200k", async function () {
      const { staking, token, alice } = await loadFixture(deployStakingFixture);
      const amount = ethers.parseEther("1000");
      await token.connect(alice).approve(await staking.getAddress(), amount);
      const tx = await staking.connect(alice).stake(amount, 0);
      const receipt = await tx.wait();
      console.log(`    stake() gas used: ${receipt.gasUsed.toString()}`);
      expect(receipt.gasUsed).to.be.lt(200000n);
    });
  });
});

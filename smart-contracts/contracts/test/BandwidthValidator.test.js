const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("U2UBandwidthValidator", function () {
  let validator, owner, addr1, addr2;
  const STAKE_AMOUNT = ethers.utils.parseEther("50");
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const U2UBandwidthValidator = await ethers.getContractFactory("U2UBandwidthValidator");
    validator = await U2UBandwidthValidator.deploy();
    await validator.deployed();
  });
  
  describe("Validator Registration", function () {
    it("Should register a validator with correct stake", async function () {
      const nodeId = "node_123";
      
      await validator.connect(addr1).registerValidator(nodeId, "", { value: STAKE_AMOUNT });
      
      const validatorData = await validator.validators(nodeId);
      expect(validatorData.owner).to.equal(addr1.address);
      expect(validatorData.stake).to.equal(STAKE_AMOUNT);
      expect(validatorData.isActive).to.be.true;
    });
    
    it("Should fail with insufficient stake", async function () {
      const nodeId = "node_123";
      const lowStake = ethers.utils.parseEther("10");
      
      await expect(
        validator.connect(addr1).registerValidator(nodeId, "", { value: lowStake })
      ).to.be.revertedWith("Insufficient stake");
    });
    
    it("Should handle referral system correctly", async function () {
      const referrerNodeId = "referrer_node";
      const referredNodeId = "referred_node";
      
      // Register referrer first
      await validator.connect(addr1).registerValidator(referrerNodeId, "", { value: STAKE_AMOUNT });
      
      // Register with referral
      await validator.connect(addr2).registerValidator(referredNodeId, referrerNodeId, { value: STAKE_AMOUNT });
      
      const referrerData = await validator.validators(referrerNodeId);
      expect(referrerData.totalReferrals).to.equal(1);
      expect(referrerData.boostPercentage).to.equal(2); // First tier boost
    });
  });
  
  describe("Bandwidth Testing", function () {
    beforeEach(async function () {
      const nodeId = "test_node";
      await validator.connect(addr1).registerValidator(nodeId, "", { value: STAKE_AMOUNT });
    });
    
    it("Should submit bandwidth test and update stats", async function () {
      const nodeId = "test_node";
      const uploadSpeed = 100;
      const downloadSpeed = 200;
      const latency = 50;
      const uptime = 99;
      const proofHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test_proof"));
      
      await validator.connect(addr1).submitBandwidthTest(
        nodeId, uploadSpeed, downloadSpeed, latency, uptime, proofHash
      );
      
      const validatorData = await validator.validators(nodeId);
      expect(validatorData.totalTests).to.equal(1);
      expect(validatorData.avgUploadSpeed).to.equal(uploadSpeed);
      expect(validatorData.avgDownloadSpeed).to.equal(downloadSpeed);
    });
    
    it("Should calculate rewards correctly", async function () {
      const nodeId = "test_node";
      const initialEarnings = await validator.earnings(addr1.address);
      
      await validator.connect(addr1).submitBandwidthTest(
        nodeId, 100, 200, 50, 99, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test"))
      );
      
      const finalEarnings = await validator.earnings(addr1.address);
      expect(finalEarnings).to.be.gt(initialEarnings);
    });
  });
  
  describe("Earnings Management", function () {
    it("Should allow claiming earnings", async function () {
      const nodeId = "test_node";
      await validator.connect(addr1).registerValidator(nodeId, "", { value: STAKE_AMOUNT });
      
      // Submit test to earn rewards
      await validator.connect(addr1).submitBandwidthTest(
        nodeId, 100, 200, 50, 99, ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test"))
      );
      
      const earningsBefore = await validator.earnings(addr1.address);
      const balanceBefore = await addr1.getBalance();
      
      await validator.connect(addr1).claimEarnings();
      
      const earningsAfter = await validator.earnings(addr1.address);
      const balanceAfter = await addr1.getBalance();
      
      expect(earningsAfter).to.equal(0);
      expect(balanceAfter).to.be.gt(balanceBefore);
    });
  });
});

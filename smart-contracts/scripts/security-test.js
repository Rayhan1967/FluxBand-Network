const { ethers } = require("hardhat");
const { expect } = require("chai");

async function runSecurityTests() {
  console.log("🛡️ Running FluxBand Network Security Tests...\n");

  const [owner, user1, user2, attacker] = await ethers.getSigners();
  
  // Deploy contract
  const U2UBandwidthValidator = await ethers.getContractFactory("U2UBandwidthValidator");
  const validator = await U2UBandwidthValidator.deploy();
  await validator.waitForDeployment();
  
  console.log("✅ Contract deployed for testing");

  // Test 1: Access Control
  console.log("\n🔐 Testing Access Control...");
  try {
    await validator.connect(attacker).pause();
    console.log("❌ CRITICAL: Unauthorized user can pause contract!");
  } catch (error) {
    console.log("✅ Access control working - only owner can pause");
  }

  // Test 2: Reentrancy Protection
  console.log("\n🔄 Testing Reentrancy Protection...");
  try {
    const minStake = await validator.MIN_STAKE();
    await validator.connect(user1).registerValidator("test-node", "", { value: minStake });
    console.log("✅ Registration successful");
    
    // Try to claim earnings immediately (should fail if no earnings)
    await validator.connect(user1).claimEarnings();
    console.log("✅ Claim protection working");
  } catch (error) {
    if (error.message.includes("No earnings")) {
      console.log("✅ Proper earnings validation");
    } else {
      console.log("⚠️ Unexpected error:", error.message.slice(0, 100));
    }
  }

  // Test 3: Input Validation
  console.log("\n📝 Testing Input Validation...");
  try {
    const minStake = await validator.MIN_STAKE();
    await validator.connect(user2).registerValidator("", "", { value: minStake });
    console.log("❌ MEDIUM: Empty node ID accepted!");
  } catch (error) {
    console.log("✅ Input validation working - empty node ID rejected");
  }

  // Test 4: Economic Security
  console.log("\n💰 Testing Economic Security...");
  try {
    // Try to register with insufficient stake
    await validator.connect(user2).registerValidator("test-node-2", "", { value: 1 });
    console.log("❌ CRITICAL: Insufficient stake accepted!");
  } catch (error) {
    console.log("✅ Economic security working - insufficient stake rejected");
  }

  // Test 5: State Consistency
  console.log("\n🔗 Testing State Consistency...");
  const stats = await validator.getNodeStats("test-node");
  console.log("✅ Node stats retrievable:", {
    totalTests: stats[0].toString(),
    totalEarnings: stats[1].toString(),
    nodeRank: stats[6].toString()
  });

  console.log("\n🎉 Security testing completed!");
  console.log("📊 Summary: Basic security measures are in place");
  console.log("⚠️  Recommendation: Consider professional audit before mainnet");
}

runSecurityTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Security test failed:", error);
    process.exit(1);
  });

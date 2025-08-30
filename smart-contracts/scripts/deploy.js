const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Deploying FluxBand Network Contracts...");

  // Get signers (array of available accounts)
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with account:", deployer.address);

  // Fix: Use provider to get balance in ethers v6
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy U2UBandwidthValidator contract
  console.log("\n📋 Deploying U2UBandwidthValidator...");
  const U2UBandwidthValidator = await ethers.getContractFactory("U2UBandwidthValidator");
  
  const validator = await U2UBandwidthValidator.deploy();
  await validator.waitForDeployment(); // ethers v6 syntax
  
  const validatorAddress = await validator.getAddress(); // ethers v6 syntax
  console.log("✅ U2UBandwidthValidator deployed to:", validatorAddress);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const code = await ethers.provider.getCode(validatorAddress);
  if (code === '0x') {
    console.log("❌ Deployment failed - no contract code found");
    return;
  }
  
  console.log("✅ Contract code verified on blockchain");

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: validatorAddress,
    deployerAddress: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    timestamp: new Date().toISOString(),
    gasUsed: "TBD" // Will be filled by transaction receipt
  };

  console.log("\n📊 Deployment Summary:");
  console.log("Network:", deploymentInfo.network);
  console.log("Contract Address:", deploymentInfo.contractAddress);
  console.log("Deployer:", deploymentInfo.deployerAddress);
  console.log("Block Number:", deploymentInfo.blockNumber);
  console.log("Timestamp:", deploymentInfo.timestamp);

  // Test basic contract functions
  console.log("\n🧪 Testing contract functions...");
  try {
    const minStake = await validator.MIN_STAKE();
    const baseReward = await validator.BASE_REWARD();
    
    console.log("✅ MIN_STAKE:", ethers.formatEther(minStake), "tokens");
    console.log("✅ BASE_REWARD:", ethers.formatEther(baseReward), "tokens");
  } catch (error) {
    console.log("⚠️ Warning: Could not test contract functions:", error.message);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log("💡 Save this contract address for frontend integration:");
  console.log("CONTRACT_ADDRESS=" + validatorAddress);
}

// Enhanced error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });

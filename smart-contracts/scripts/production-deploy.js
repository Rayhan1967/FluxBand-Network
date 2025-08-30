const { ethers } = require("hardhat");
const fs = require('fs');

async function deployProduction() {
  console.log("🚀 FluxBand Network Production Deployment\n");

  const [deployer] = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  
  console.log("Deploying on network:", network.name);
  console.log("Deployer address:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH");

  if (parseFloat(ethers.formatEther(balance)) < 0.1) {
    throw new Error("Insufficient balance for deployment");
  }

  // Deploy with production settings
  console.log("\n📋 Deploying U2UBandwidthValidator...");
  
  const U2UBandwidthValidator = await ethers.getContractFactory("U2UBandwidthValidator");
  const validator = await U2UBandwidthValidator.deploy();
  
  await validator.waitForDeployment();
  const contractAddress = await validator.getAddress();
  
  console.log("✅ Contract deployed to:", contractAddress);

  // Verify deployment
  const code = await ethers.provider.getCode(contractAddress);
  if (code === '0x') {
    throw new Error("Contract deployment failed - no code at address");
  }

  // Test basic functionality
  console.log("\n🧪 Verifying contract functionality...");
  const minStake = await validator.MIN_STAKE();
  const baseReward = await validator.BASE_REWARD();
  
  console.log("✅ MIN_STAKE:", ethers.formatEther(minStake), "tokens");
  console.log("✅ BASE_REWARD:", ethers.formatEther(baseReward), "tokens");

  // Generate deployment info
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    contractAddress: contractAddress,
    deployerAddress: deployer.address,
    blockNumber: await ethers.provider.getBlockNumber(),
    gasPrice: (await ethers.provider.getFeeData()).gasPrice?.toString(),
    timestamp: new Date().toISOString(),
    contractVerified: false,
    minStake: ethers.formatEther(minStake),
    baseReward: ethers.formatEther(baseReward)
  };

  // Save deployment info
  const filename = `deployments/${network.name}-${Date.now()}.json`;
  if (!fs.existsSync('deployments')) {
    fs.mkdirSync('deployments');
  }
  
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to:", filename);

  // Generate frontend config
  const frontendConfig = {
    CONTRACT_ADDRESS: contractAddress,
    CHAIN_ID: Number(network.chainId),
    NETWORK_NAME: network.name,
    MIN_STAKE_ETH: ethers.formatEther(minStake),
    BASE_REWARD_ETH: ethers.formatEther(baseReward)
  };

  fs.writeFileSync('deployments/frontend-config.json', JSON.stringify(frontendConfig, null, 2));
  console.log("📄 Frontend config saved to: deployments/frontend-config.json");

  // Instructions
  console.log("\n🎯 Next steps:");
  console.log("1. Verify contract on explorer (if supported)");
  console.log("2. Update frontend environment variables:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`   NEXT_PUBLIC_CHAIN_ID=${network.chainId}`);
  console.log("3. Run security tests with production contract");
  console.log("4. Consider bug bounty program");
  
  console.log("\n🚀 Production deployment completed successfully!");
}

deployProduction()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Production deployment failed:", error);
    process.exit(1);
  });

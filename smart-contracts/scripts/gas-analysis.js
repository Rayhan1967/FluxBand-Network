const { ethers } = require("hardhat");

async function analyzeGasUsage() {
  console.log("⛽ FluxBand Network Gas Analysis\n");

  const [deployer, user1] = await ethers.getSigners();
  
  const U2UBandwidthValidator = await ethers.getContractFactory("U2UBandwidthValidator");
  const validator = await U2UBandwidthValidator.deploy();
  await validator.waitForDeployment();

  const minStake = await validator.MIN_STAKE();

  // Test gas usage for key functions
  const gasTests = [
    {
      name: "Register Validator",
      fn: () => validator.connect(user1).registerValidator("test-node-gas", "", { value: minStake })
    },
    {
      name: "Submit Bandwidth Test", 
      fn: () => validator.connect(user1).submitBandwidthTest(
        "test-node-gas", 100, 200, 30, 95, 
        ethers.keccak256(ethers.toUtf8Bytes("test-proof"))
      )
    },
    {
      name: "Get Node Stats",
      fn: () => validator.getNodeStats("test-node-gas")
    }
  ];

  console.log("Function                | Gas Used    | USD Cost*");
  console.log("--------------------- | ----------- | ---------");

  for (const test of gasTests) {
    try {
      let gasUsed;
      if (test.name === "Get Node Stats") {
        // View function - estimate gas
        gasUsed = await validator.getNodeStats.estimateGas("test-node-gas");
      } else {
        const tx = await test.fn();
        const receipt = await tx.wait();
        gasUsed = receipt.gasUsed;
      }
      
      // Estimate USD cost (assuming $2000 ETH, 20 gwei gas price)
      const gasPriceGwei = 20;
      const ethPrice = 2000;
      const costUSD = (Number(gasUsed) * gasPriceGwei * ethPrice) / 1e9 / 1e18;
      
      console.log(`${test.name.padEnd(20)} | ${gasUsed.toString().padStart(11)} | $${costUSD.toFixed(4)}`);
    } catch (error) {
      console.log(`${test.name.padEnd(20)} | ERROR       | N/A`);
    }
  }

  console.log("\n* Estimated at $2000 ETH, 20 gwei gas price");
  console.log("📊 Gas optimization recommendations:");
  console.log("   • Pack struct variables to save storage slots");
  console.log("   • Use events instead of storage for historical data");
  console.log("   • Consider batch operations for multiple actions");
}

analyzeGasUsage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

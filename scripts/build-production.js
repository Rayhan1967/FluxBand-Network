const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    console.log("📁 Found .env.local file");
    
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...values] = trimmedLine.split('=');
        if (key && values.length > 0) {
          const value = values.join('=').trim();
          process.env[key] = value;
          console.log(`   ✅ Loaded: ${key}`);
        }
      }
    });
    return true;
  } else {
    console.log("❌ .env.local file not found at:", envPath);
    return false;
  }
}

function buildProduction() {
  console.log("🏗️ Preparing FluxBand Network for Production\n");

  // Load environment variables
  if (!loadEnvFile()) {
    console.log("💡 Please create .env.local file in web-dashboard directory");
    return false;
  }

  const requiredEnvVars = [
    'NEXT_PUBLIC_CONTRACT_ADDRESS',
    'NEXT_PUBLIC_RPC_URL', 
    'NEXT_PUBLIC_CHAIN_ID',
    'NEXT_PUBLIC_NETWORK_NAME'
  ];

  console.log("\n📋 Checking environment configuration...");
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log("❌ Missing environment variables:");
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    return false;
  }

  console.log("✅ All environment variables configured");

  // Validate contract address
  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress)) {
    console.log("❌ Invalid contract address format");
    return false;
  }

  console.log("✅ Contract address format valid");

  // Create production config
  const productionConfig = {
    CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID),
    NETWORK_NAME: process.env.NEXT_PUBLIC_NETWORK_NAME,
    BUILD_TIME: new Date().toISOString(),
    VERSION: '1.0.0'
  };

  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  
  fs.writeFileSync('public/config.json', JSON.stringify(productionConfig, null, 2));
  console.log("✅ Production config generated");

  console.log("\n🚀 Ready for production build!");
  
  return true;
}

if (require.main === module) {
  buildProduction();
}

module.exports = buildProduction;

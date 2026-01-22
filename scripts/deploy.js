const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying Voting contract...");

  try {
    // Get accounts
    const accounts = await hre.ethers.getSigners();
    console.log("📍 Deploying from account:", accounts[0].address);

    // Get contract factory
    const Voting = await hre.ethers.getContractFactory("Voting");
    console.log("✓ Contract factory loaded");

    // Deploy contract
    const voting = await Voting.deploy();
    console.log("⏳ Waiting for deployment confirmation...");

    await voting.waitForDeployment();
    const address = await voting.getAddress();

    console.log(`✅ Voting contract deployed to: ${address}`);

    // Verify contract is accessible
    const pollCount = await voting.pollCount();
    console.log(`✓ Contract verified - pollCount: ${pollCount.toString()}`);

    // Save contract address for frontend
    const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir, { recursive: true });
      console.log("📁 Created contracts directory");
    }

    // Save address
    const addressFile = path.join(contractsDir, "contract-address.json");
    fs.writeFileSync(
      addressFile,
      JSON.stringify({ Voting: address }, null, 2)
    );
    console.log(`✓ Saved contract address to ${addressFile}`);

    // Copy ABI
    const artifact = await hre.artifacts.readArtifact("Voting");
    const abiFile = path.join(contractsDir, "Voting.json");
    fs.writeFileSync(
      abiFile,
      JSON.stringify(artifact, null, 2)
    );
    console.log(`✓ Saved contract ABI to ${abiFile}`);

    console.log("\n✅ Deployment successful!");
    console.log(`📋 Contract Address: ${address}`);
    console.log("📌 Frontend files updated - refresh your browser to use the new contract");

  } catch (error) {
    console.error("❌ Deployment failed!");
    console.error("Error:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

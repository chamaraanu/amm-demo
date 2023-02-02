const hre = require("hardhat");

async function main() {
  console.log("deploying Swap Tokens Contract...");
  const SwapTokens = await hre.ethers.getContractFactory("SwapTokens");
  const swapTokens = await SwapTokens.deploy(
    /*{gasPrice: 30000000000, gasLimit: 1000000, nonce: 1311}*/
  );

  await swapTokens.deployed();

  console.log(`Swap Tokens contract deployed to: ${swapTokens.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

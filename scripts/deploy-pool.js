const hre = require("hardhat");

async function main() {
  console.log("deploying Uniswap Pool...");
  const UniswapV3PoolDeployer = await hre.ethers.getContractFactory("UniswapV3PoolDeployer");
  const uniswapV3PoolDeployer = await UniswapV3PoolDeployer.deploy(
    /*{gasPrice: 30000000000, gasLimit: 1000000, nonce: 1311}*/
  );

  await uniswapV3PoolDeployer.deployed();

  console.log(`Swap Tokens contract deployed to: ${uniswapV3PoolDeployer.address}`);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
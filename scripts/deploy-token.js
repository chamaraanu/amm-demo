const hre = require("hardhat");

async function main() {
  console.log("deploying token...");
  const [owner] = await ethers.getSigners();

  const Token = await hre.ethers.getContractFactory("Token");
  const token = await Token.deploy(
    "Smart Contracts Meetup Coin", "SCMC", 10, owner.address 
    /*, {gasPrice: 30000000000, gasLimit: 1000000, nonce: 1311}*/
  );

  await token.deployed();
  console.log(`Token contract is deployed: ${token.address} and the owner is: ${owner.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const { ethers } = require("hardhat");

async function main() {
    const [signer1] = await ethers.getSigners();
    const SwapTokens = await hre.ethers.getContractFactory("SwapTokens");
    const swapTokens = SwapTokens.attach(process.env.SWAP_ADDRESS);

    const Token = await hre.ethers.getContractFactory("Token");
    const toToken = await Token.attach(process.env.USDC);
    const fromToken = await Token.attach(process.env.LINK);

    amount1 = ethers.utils.parseUnits('0.0001', process.env.DECIMALS);
    await fromToken.connect(signer1).approve(swapTokens.address, amount1);
    await swapTokens.connect(signer1).swapExactInputSingle(amount1, fromToken.address, toToken.address, {gasLimit: 3000000});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
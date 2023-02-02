const { ethers } = require("hardhat");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider('https://eth-goerli.alchemyapi.io/v2/HlV6pIzIK1ZHKm_bIeznnMpYEiXzVomY')

    const signer1 = new ethers.Wallet("ecb054e0114cc4b80c43ccef9b962d2468bc217cc42d08d24313c0648a697312", provider);
    const swapAddress = "0xade20C4a58D9AB7Ce0B336B29D021E294b9d83B7";

    const SwapTokens = await hre.ethers.getContractFactory("SwapTokens");
    const swapTokens = SwapTokens.attach(swapAddress);

    const Token = await hre.ethers.getContractFactory("Token");
    const toToken = await Token.attach("0x07865c6E87B9F70255377e024ace6630C1Eaa37F"); // USDC
    const fromToken = await Token.attach("0x326C977E6efc84E512bB9C30f76E30c160eD06FB"); // LINK

    amount1 = ethers.utils.parseUnits('0.08', 18);
    await fromToken.connect(signer1).approve(swapTokens.address, amount1);
    await swapTokens.connect(signer1).swapExactInputSingle(amount1, fromToken.address, toToken.address, {gasLimit: 3000000});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
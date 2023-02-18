const { ethers } = require("hardhat");

async function main() {
    const [signer1] = await ethers.getSigners();
    const SwapTokens = await hre.ethers.getContractFactory("SwapTokens");
    const swapTokens = SwapTokens.attach(process.env.SWAP_ADDRESS);

    const Token = await hre.ethers.getContractFactory("Token");
    const fromToken = await Token.attach(process.env.LINK);
    const fromTokenDecimals = await fromToken.decimals();
    const toToken = await Token.attach(process.env.USDC);
    const toTokenDecimals = await toToken.decimals();
    
    amountIn = ethers.utils.parseUnits('0.1', fromTokenDecimals);
    await fromToken.connect(signer1).approve(swapTokens.address, amountIn);
    await swapTokens.connect(signer1).swapExactInputSingle(amountIn, fromToken.address, toToken.address, {gasLimit: 3000000});
    
    const handleInputEvent = (from, to, amount) => {
        const amountOutInt = ethers.utils.formatUnits(amount, toTokenDecimals);
        console.log("Swapped", amountOutInt );
    }
    swapTokens.on("inputSingleSwapOccurred", handleInputEvent);
    
    await fromToken.connect(signer1).approve(swapTokens.address, amountIn);
    amountOut = ethers.utils.parseUnits('1', toTokenDecimals);
    await swapTokens.connect(signer1).swapExactOutputSingle(amountOut, amountIn, fromToken.address, toToken.address, {gasLimit: 3000000});

    const handleOutputEvent = (from, to, amount) => {
        const amountInInt = ethers.utils.formatUnits(amount, fromTokenDecimals);
        console.log("Swapped", amountInInt );
        process.exit();
    }
    swapTokens.on("outputSingleSwapOccurred", handleOutputEvent);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
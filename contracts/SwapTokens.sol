// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
pragma abicoder v2;

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";

contract SwapTokens {
    address public constant routerAddress = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    ISwapRouter public immutable swapRouter = ISwapRouter(routerAddress);

    // For this example, we will set the pool fee to 0.3%.
    uint24 public constant poolFee = 3000;

    constructor() {}

    function swapExactInputSingle(uint256 amountIn, address inToken, address outToken)
        external
        returns (uint256 amountOut)
    {
        TransferHelper.safeTransferFrom(
            inToken,
            msg.sender,
            address(this),
            amountIn
        );

        TransferHelper.safeApprove(inToken, address(swapRouter), amountIn);

        ISwapRouter.ExactInputSingleParams memory params = ISwapRouter
            .ExactInputSingleParams({
                tokenIn: inToken,
                tokenOut: outToken,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        amountOut = swapRouter.exactInputSingle(params);
    }

    function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum, address inToken, address outToken)
        external
        returns (uint256 amountIn)
    {
        ISwapRouter.ExactOutputSingleParams memory params = ISwapRouter
            .ExactOutputSingleParams({
                tokenIn: inToken,
                tokenOut: outToken,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountOut: amountOut,
                amountInMaximum: amountInMaximum,
                sqrtPriceLimitX96: 0
            });

        amountIn = swapRouter.exactOutputSingle(params);

        if (amountIn < amountInMaximum) {
            IERC20(inToken).approve(address(swapRouter), 0);
            IERC20(inToken).transfer(address(this), amountInMaximum - amountIn);
        }
    }
}

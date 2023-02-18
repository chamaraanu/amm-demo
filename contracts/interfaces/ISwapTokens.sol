// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

interface ISwapTokens {
    event inputSingleSwapOccurred(address from, address to, uint256 amount);
    event outputSingleSwapOccurred(address from, address to, uint256 amount);
}
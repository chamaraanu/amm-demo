// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;
pragma abicoder v2;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    uint8 dc;
    constructor(string memory _name, string memory _sybmol, uint8 decimal, uint256 amount, address mintTo) ERC20(_name, _sybmol) {
        dc = decimal;
        _mint(mintTo, amount * 10**(dc));
    }

    function decimals() public view override returns (uint8) {
		return dc;
	}
}

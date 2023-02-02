const { expect } = require("chai");
const { ethers } = require('hardhat');

describe("Token contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
      const [owner] = await ethers.getSigners();
  
      const Token = await ethers.getContractFactory("Token");
  
      const hardhatToken = await Token.deploy("Smart Contracts Meetup Coin", "SCMC", 10, owner.address);
      
      const ownerBalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
    });
  });
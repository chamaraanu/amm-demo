import React, { Component } from 'react';
import { Button } from "semantic-ui-react";

import Swap from './Swap';

import { ethers } from "ethers";
import Token from "./token";

class Metamask extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", []);
    const balance = await provider.getBalance(accounts[0]);
    const balanceInEther = ethers.utils.formatEther(balance);
    this.setState({ selectedAddress: accounts[0], balance: balanceInEther })

    const erc20Address = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB';
    const erc20Contract = Token(erc20Address);
    const erc20Symbol = await erc20Contract.symbol();
    const erc20Balance  =  await erc20Contract.balanceOf(accounts[0]);
    const erc20Decimals = await erc20Contract.decimals();
    
    const formattedErc20Balance = ethers.utils.formatUnits(erc20Balance, erc20Decimals);
    this.setState({ selectedAddress: accounts[0], erc20Balance: formattedErc20Balance })
    this.setState({ erc20Symbol: erc20Symbol })
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <Button
         onClick={() => this.connectToMetamask()}>Connect to Metamask</Button>
      )
    } else {
      return (
        <div>
          <h>Welcome {this.state.selectedAddress}</h>
          <p>Your ETH Balance is: {this.state.balance}</p>
          <p>Your {this.state.erc20Symbol} Balance is: {this.state.erc20Balance}</p>
          <div>
            <Swap />
          </div>
        </div>
      );
    }
  }

  render() {
    return(
      <div>
        {this.renderMetamask()}
      </div>
    )
  }
}

export default Metamask;

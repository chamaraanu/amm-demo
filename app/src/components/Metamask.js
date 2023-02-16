import React, { Component } from 'react'
import { Header, Button, Label, Message } from 'semantic-ui-react'
import {
  ERC20_FROM_TOKEN_ADDRESS,
  ERC20_TO_TOKEN_ADDRESS,
} from '../constants/constants'

import Swap from './Swap'

import { ethers } from 'ethers'
import Token from './token'
import Layout from './Layout'

class Metamask extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  async connectToMetamask() {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    const balance = await provider.getBalance(accounts[0])
    const balanceInEther = ethers.utils.formatEther(balance)
    this.setState({ selectedAddress: accounts[0], balance: balanceInEther })

    const fromTokenContract = Token(ERC20_FROM_TOKEN_ADDRESS)
    const erc20Symbol = await fromTokenContract.symbol()
    const erc20Balance = await fromTokenContract.balanceOf(accounts[0])
    const erc20Decimals = await fromTokenContract.decimals()

    const formattedErc20Balance = ethers.utils.formatUnits(
      erc20Balance,
      erc20Decimals,
    )

    const toTokenContract = Token(ERC20_TO_TOKEN_ADDRESS)
    const toTokenSymbol = await toTokenContract.symbol()
    const toTokenBalance = await toTokenContract.balanceOf(accounts[0])
    const toTokenDecimals = await toTokenContract.decimals()

    const formattedToTokenBalance = ethers.utils.formatUnits(toTokenBalance, toTokenDecimals)

    this.setState({
      selectedAddress: accounts[0],
      erc20Balance: formattedErc20Balance,
      toTokenBalance: formattedToTokenBalance,
      erc20Symbol: erc20Symbol,
      toTokenSymbol: toTokenSymbol
    })
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <div>
          <Message>
            <Header as="h1">Connect Your Wallet</Header>
            <Button onClick={() => this.connectToMetamask()}>Connect</Button>
          </Message>
        </div>
      )
    } else {
      return (
        <Layout>
          <div>
            <Message>
              <Header as="h1">Welcome {this.state.selectedAddress}</Header>
              <Header as="h4">Your ETH Balance is: {this.state.balance}</Header>
            </Message>
            <Message>
              <p>
                Your {this.state.erc20Symbol} Balance is:{' '}
                {this.state.erc20Balance}
              </p>
              <p>
                Your {this.state.toTokenSymbol} Balance is: {this.state.toTokenBalance}
              </p>
            </Message>

            <Message>
              <div>
                <Swap />
              </div>
            </Message>
          </div>
        </Layout>
      )
    }
  }

  render() {
    return <div>{this.renderMetamask()}</div>
  }
}

export default Metamask

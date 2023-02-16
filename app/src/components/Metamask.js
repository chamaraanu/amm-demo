import React, { Component } from 'react'
import { Header, Button, Label, Message } from 'semantic-ui-react'
import Swap from './Swap'
import { ethers } from 'ethers'
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

    this.setState({
      selectedAddress: accounts[0],
    })
  }

  renderMetamask() {
    if (!this.state.selectedAddress) {
      return (
        <div>
          <p></p>
          <Message>
            <Header as="h1">Connect Your Wallet</Header>
            <Button primary onClick={() => this.connectToMetamask()}>Connect</Button>
          </Message>
        </div>
      )
    } else {
      return (
        <Layout>
          <div>
            <p></p>
            <Message>
              <Header as="h1">Welcome {this.state.selectedAddress}</Header>
              <Header as="h4">Your ETH Balance is: {this.state.balance}</Header>
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

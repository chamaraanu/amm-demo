import React, { Component } from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'
import { ERC20_FROM_TOKEN_ADDRESS, ERC20_TO_TOKEN_ADDRESS, SWAP_ADDRESS } from '../constants/constants'
import { ethers } from 'ethers'
import Token from './token'
import SwapTokens from '../contracts/contracts/SwapTokens.sol/SwapTokens.json'

class Swap extends Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.load()
    }

    fromAddress = ERC20_FROM_TOKEN_ADDRESS;
    toAddress = ERC20_TO_TOKEN_ADDRESS;
    swapAddress = SWAP_ADDRESS;

    onSubmit = async (event) => {
        event.preventDefault();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const swapContract = new ethers.Contract(
            this.swapAddress,
            SwapTokens.abi,
            provider,
        );
        const fromToken = Token(this.fromAddress)
        const fromTokenDecimals = await fromToken.decimals();
        const toToken = Token(this.toAddress);
        const toTokenDecimals = await toToken.decimals();

        const signer = provider.getSigner()
        const amount1 = ethers.utils.parseUnits(this.state.value, fromTokenDecimals)

        try {
            await fromToken.connect(signer).approve(this.swapAddress, amount1);
            await swapContract
                .connect(signer)
                .swapExactInputSingle(amount1, this.fromAddress, this.toAddress, {
                    gasLimit: 20000000,
                })
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false, value: "" });

        const handleEvent = (from, to, amount) => {
            this.load();
            const amountInt = ethers.utils.formatUnits(amount, toTokenDecimals);
            this.setState({ swapAmount: amountInt });
        }

        swapContract.on("swapOccurred", handleEvent);
        //fire event to Metamask
    };

    render() {
        return (
            <div>
                <Message>
                    <p>From {this.state.fromTokenSymbol} {this.state.fromTokenBalance}</p>
                    <p>To {this.state.toTokenSymbol} {this.state.toTokenBalance}</p>
                </Message>
                <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                    <Form.Field>
                        <label>Amount to Swap</label>
                        <Input
                            value={this.state.value}
                            onChange={(event) => this.setState({ value: event.target.value })}
                            labelPosition="center"
                        />
                    </Form.Field>
                    <Button primary loading={this.state.loading}>
                        Swap Tokens
                    </Button>
                    <p></p>

                    <Message>
                        <p>Received: {this.state.swapAmount}</p>
                    </Message>

                </Form>
            </div>
        )
    }

    load = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send('eth_requestAccounts', []);

        const fromToken = Token(this.fromAddress);
        const fromTokenSymbol = await fromToken.symbol();
        const fromTokenDecimals = await fromToken.decimals();
        const fromTokenBalance = await fromToken.balanceOf(accounts[0]);
        const formattedFromTokenBalance = ethers.utils.formatUnits(fromTokenBalance, fromTokenDecimals);

        const toToken = Token(this.toAddress);
        const toTokenSymbol = await toToken.symbol();
        const toTokenDecimals = await toToken.decimals();
        const toTokenBalance = await toToken.balanceOf(accounts[0]);
        const formattedToTokenBalance = ethers.utils.formatUnits(toTokenBalance, toTokenDecimals);

        this.setState({
            fromTokenSymbol: fromTokenSymbol,
            fromTokenBalance: formattedFromTokenBalance,
            toTokenSymbol: toTokenSymbol,
            toTokenBalance: formattedToTokenBalance
        })
    }
}

export default Swap

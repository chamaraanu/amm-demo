import React, { Component } from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'
import { ERC20_FROM_TOKEN_ADDRESS, ERC20_TO_TOKEN_ADDRESS, SWAP_ADDRESS } from '../constants/constants'
import { ethers } from 'ethers'
import Token from './token'
import SwapTokens from '../contracts/contracts/SwapTokens.sol/SwapTokens.json'

class Swap extends Component {
    state = {
        value: "",
        errorMessage: "",
        loading: false,
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const swapAddress = SWAP_ADDRESS
        const fromAddress = ERC20_FROM_TOKEN_ADDRESS
        const toAddress = ERC20_TO_TOKEN_ADDRESS
        const swapContract = new ethers.Contract(
            swapAddress,
            SwapTokens.abi,
            provider,
        );
        const fromToken = Token(fromAddress)
        const fromTokenName = await fromToken.name();
        const toToken = Token(toAddress);
        const toTokenName = await toToken.name();
        const toTokenSymbol = await toToken.symbol();
        const toTokenDecimals = await toToken.decimals();
        this.setState({ toTokenDecimals: toTokenDecimals})

        const signer = provider.getSigner()
        const amount1 = ethers.utils.parseUnits(this.state.value, 8)

        try {
            await fromToken.connect(signer).approve(swapAddress, amount1);
            const res = await swapContract
                .connect(signer)
                .swapExactInputSingle(amount1, fromAddress, toAddress, {
                    gasLimit: 20000000,
                })
                this.setState({ res: res});
                console.log(res);
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false, value: "" });

        const handleEvent = (from, to, amount) => {
            const amountString = amount.toString();
            // const amountInt = ethers.utils.parseUnits(amountString, toTokenDecimals)
            console.log({"Event is": from, to, amountString})

            this.setState({ fromTokenName: fromTokenName, toTokenName: toTokenName })
            this.setState({swapAmount: amountString})
        }

        swapContract.on("swapOccurred", handleEvent);
        //fire event to Metamask
    };

    render() {
        return (
            <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
                <Form.Field>
                    <label>Amount to Swap</label>
                    <Input
                        value={this.state.value}
                        onChange={(event) => this.setState({ value: event.target.value })}
                        labelPosition="right"
                    />
                </Form.Field>
                <Button primary loading={this.state.loading}>
                    Swap Tokens
                </Button>
                <p></p>
                
                    <Message>
                        <p>Swapped From: {this.state.fromTokenName}</p>
                        <p>Swapped To: {this.state.toTokenName}</p>
                        <p>Received: {this.state.swapAmount}</p>
                    </Message>
                
            </Form>
        )
    }
}

export default Swap

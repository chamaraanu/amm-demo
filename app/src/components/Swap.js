import React, { Component } from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'

import { ethers } from 'ethers'
import Token from './token'
import SwapTokens from '../contracts/contracts/SwapTokens.sol/SwapTokens.json'
import Layout from './Layout'

class Swap extends Component {
    state = {
        value: "",
        errorMessage: "",
        loading: false,
    };

    onSubmit = async (event) => {
        event.preventDefault();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const swapAddress = '0xbDac982ccB82f9382611888d610de9516A26f273'
        const fromAddress = '0x7AFd8dEA4CCD6d26222920b428a6feB6d4AA8E60'
        const toAddress = '0xa3f3d8c3754CF6Aa25A0d2315F9ed4aE2A48E9c7'
        const swapContract = new ethers.Contract(
            swapAddress,
            SwapTokens.abi,
            provider,
        );
        const fromToken = Token(fromAddress)
        const fromTokenName = await fromToken.name();
        const toToken = Token(toAddress);
        const toTokenName = await toToken.name();
        this.setState({ fromTokenName: fromTokenName, toTokenName: toTokenName })

        const signer = provider.getSigner()
        const amount1 = ethers.utils.parseUnits(this.state.value, 18)

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
            console.log({"Event is": from, to, amountString})

            this.setState({swappedFrom: from, swappedTo: to, swapAmount: amountString})

        }

        swapContract.on("swapOccurred", handleEvent);
    };

    render() {
        return (
            <Layout>
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
                <Form.Field>
                    <Message>
                        <p>Swapped From: {this.state.fromTokenName}</p>
                        <p>Swapped To: {this.state.toTokenName}</p>
                        <p>Received: {this.state.swapAmount}</p>
                    </Message>
                </Form.Field>
            </Form>
            </Layout>
        )
    }
}

export default Swap

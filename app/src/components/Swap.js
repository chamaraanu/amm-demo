import React, { Component } from 'react'
import { Form, Input, Message, Button } from 'semantic-ui-react'

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
        const swapAddress = '0x1b7195714De15c4DB077da64a0e918FcbaF552BF'
        const fromAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
        const toAddress = '0x07865c6E87B9F70255377e024ace6630C1Eaa37F'
        const swapContract = new ethers.Contract(
            swapAddress,
            SwapTokens.abi,
            provider,
        );
        const fromToken = Token(fromAddress)
        const fromTokenName = await fromToken.name();
        this.setState({ fromTokenName: fromTokenName })

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
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }
        this.setState({ loading: false, value: "" });

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
            </Form>
        )
    }
}

export default Swap

import { ethers } from "ethers";
import Token from "../contracts/contracts/Token.sol/Token.json"

const token = (address) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return new ethers.Contract(address, Token.abi, provider);
};

export default token;
# amm-demo
Automated Market Maker - Demo

Your .env file needs to have following entries: 
Alchemy API key for Goerli network: ALCHEMY_GOERLI_API_KEY
Your own goerli account private key: PRIVATE_KEY
Swapping from token (USDC): USDC
Swapping to token (LINK): LINK

Once the swap is deployed: SWAP_ADDRESS


Creating a new token
% npx hardhat run scripts/swap-transactions.js --network goerli

deploying token...
Token contract is deployed: 0xdbc3a964e813e6c1E51cFe3714F02a3e6ED87D75 and the owner is: 0x4d41CD1eA66E221c35620872f1e5cCf5e0f99681

Running the Swap: 
% npx hardhat run scripts/swap-transactions.js --network goerli
# Dapp to send ETH across Metamask walldts using QR codes
This Dapp constitutes a simple programme to send and receive ether (ETH) across Metamask wallets using QR codes.

Author: Moritz Dillmann <br>
Institution: University of Lausanne

## Motivation: 
Proof of concept for a consumer CO2 compensation loyalty programme.

##  Language requirements:
1) Backend: Solidity (Ethereum)
2) API: Javascript (web3 package)
3) Frontend: HTML, Javascript

## Environments:
1) Smart contract development: Remix (http://remix.ethereum.org/)
2) Smart contract deployment: Truffle (https://www.trufflesuite.com/)
3) Smart contract testing: Ganache GUI (and -cli) (https://www.trufflesuite.com/ganache)
4) Smart contract/ Dapp interaction in the browser: Metamask (https://metamask.io/)

"MetaMask is the easiest way to interact with dapps in a browser. It is an extension for Chrome or Firefox that connects to an Ethereum network without running a full node on the browser's machine. It can connect to the main Ethereum network, any of the testnets (Ropsten, Kovan, and Rinkeby), or a local blockchain such as the one created by Ganache or Truffle Develop."
Source: https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask

## Getting started:

### Create a Truffle project
1. Install node.js (v14.17.0) and npm (v6.14.13) <br>
https://nodejs.org/en/

2. Install Truffle: 
`npm install truffle -g` <br>
https://www.trufflesuite.com/truffle

3. Create a new Truffle project:
`truffle init` <br>
(You can check all commands you can use with Truffle with: `truffle`)

### Smart contract development
1. Create Smart Contracts in _.contracts/_ folder: <br>
`cd contracts` <br>
`truffle create contract Trust.sol` <br>
—> creates a new Solidity file in the contracts/ directory

2. Edit Smart Contract in your favourite Code Editor (e.g. Visual Studio Code). <br>
 <p> I created the smart contract for this Dapp, "Trust.sol", in Remix: http://remix.ethereum.org/. Remix allows you to test your contracts functionality before you deploy it in your project. </p>

### Migrate your smart contract
1. navigate to the migrations folder: <br>
`ls migrations/` <br>
Don’t modify this first migration file, because Truffle needs it to use its migration feature.

2. create a migration file: <br>
`truffle create migration Trust`

 Truffle adds a random number to the name of your new migration file in order to know in what order it has to run the migration.

3. 	Modify your new migration file in your text editor:
	—> copy the content from the _1_initial_migration.js_ file
	—> then modify it a bit
```
// first, we require our smart contract of interest:
var Trust = artifacts.require("./Trust.sol");

// here, we have our deployer (function) which calls the method 'deploy'
module.exports = function(deployer) {
	deployer.deploy(Trust, "This is my message"); // deploys the Trust.sol smart contract. The smart contract is supposed to say the random string "This is my message" after its deployed.
};
	
```


## Future steps: 

Connect to a public testnet like Ropsten or Kovan using a public API service for Ethereum from 'Infura' (instead of running an Ethereum node yourself)

This allows users to:
1. receive a transaction request from Web3
2. sign the transaction request in their wallet (e.g. Metamask)

Only after it received the signed transaction from the user's wallet, Web3 sends the signed transaction to the Ethereum network via the Infura node.

Btw:
When you use Metamask, you _do not have to set up Infura_ (for public testnets), because Metamask takes care by itself of how to send transactions to the Ethereum blockchain.

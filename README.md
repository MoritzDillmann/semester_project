
## Author: Moritz Dillmann
## Institution: HEC Lausanne, University of Lausanne

## Description:
A simple programme to send and receive ether (ETH) across Metamask wallets using QR codes.

## Motivation: 
Proof of concept for a sustainable customer loyalty programme.

##  Languages: 
1) API: Python (web3 package)
2) Backend:  Solidity (Ethereum)
3) Frontend: HTML, CSS, Javascript

## Blockchain:
I use ganache-cli to build local blockchain and truffle to deploy contract. 
To interact with deployed contracts i use truffle console.

"MetaMask is the easiest way to interact with dapps in a browser. It is an extension for Chrome or Firefox that connects to an Ethereum network without running a full node on the browser's machine. It can connect to the main Ethereum network, any of the testnets (Ropsten, Kovan, and Rinkeby), or a local blockchain such as the one created by Ganache or Truffle Develop."

Source: https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask


## Start Angular App Development: 
Navigate to ./app
>  npm install -g @ionic/cli
>  npm install
>  ionic serve 


## Future steps: 

Connect to a public testnet like Ropsten or Kovan using a public API service for Ethereum from 'Infura' (instead of running an Ethereum node yourself)

This allows users to:
1. receive a transaction request from Web3
2. sign the transaction request in their wallet (e.g. Metamask)

Only after it received the signed transaction from the user's wallet, Web3 sends the signed transaction to the Ethereum network via the Infura node.

Btw:
When you use Metamask, you _do not have to set up Infura_ (for public testnets), because Metamask takes care by itself of how to send transactions to the Ethereum blockchain.

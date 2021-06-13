# Dapp to send ETH across Metamask accounts using QR codes 🧞

  - [About](#about)
  - [Language requirements](#language-requirements)
  - [Development Environments](#development-environments)
- [Dapp to send ETH across Metamask accounts using QR codes 🧞](#dapp-to-send-eth-across-metamask-accounts-using-qr-codes-)
  - [About](#about)
  - [Language requirements](#language-requirements)
  - [Development Environments](#development-environments)
- [Getting started](#getting-started)
  - [1. Backend](#1-backend)
    - [Install Node.js](#install-nodejs)
    - [Create a Truffle project](#create-a-truffle-project)
    - [Create your smart contract](#create-your-smart-contract)
    - [Migrate your smart contract](#migrate-your-smart-contract)
    - [Set up a server](#set-up-a-server)
  - [2. Frontend](#2-frontend)
## About
<p> This Dapp constitutes a simple programme to send and receive ether (ETH) across Metamask wallets using QR codes.<br>
It consists of <br>

1. a *backend* with a single smart contract and a minimalistic server and,<br>
2. a *frontend* with a Web3 API and a basic web page from where we call the smart contract and display the corresponding QR code. <br>

Author: Moritz Dillmann <br>
Institution: University of Lausanne 

Motivation: <br>
This project aims to provide a *proof of concept* for using smart contracts in a _consumer CO2 compensation loyalty programme_ initiated by the Munich-based start-up <a href="https://imero.de/">IMERO GmbH</a>.</p>

##  Language requirements
1. Backend:
   1. Javascript
   2. Solidity (Ethereum smart contract)
   
2. Frontend:
   1. Javascript (web3 API)
   2. HTML

## Development Environments
1. Smart contract development and testing:
<a href="https://www.trufflesuite.com/">Truffle</a> (v5.3.2) Ethereum development framework <br>

2. Setting up a local blockchain: <a href="https://www.trufflesuite.com/ganache">Ganache-cli</a> <br>
   
3. Smart contract/ Dapp interaction in the browser: <a href="https://metamask.io/">Metamask wallet</a><br>

# Getting started

## 1. Backend
<p> We'll begin with the backend, which includes the development of our smart contract and the setup of a server.

### Install Node.js
<p> Node.js is an open-source, server-side JavaScript runtime environment that executes Javascript outside a browser. <br>
To learn more about Node.js, have a look at the <a href="https://nodejs.org/en/docs/">docs</a>. <br>
I recommend to install Node.js using its version manager <a href="https://github.com/nvm-sh/nvm">nvm</a>.</p>


1. Install <a href="https://nodejs.org/en/">node.js</a> (v14.17.0) together with its package manager, npm (v6.14.13) <br>

### Create a Truffle project

1. Create a new directory where you want your blockchain project to reside
   
2. Install <a href="https://www.trufflesuite.com/">Truffle</a> (v5.3.2)
   
3. Create a new Truffle project: <br>
`truffle init` <br>
(You can check all commands you can use with Truffle with: `truffle`)

### Create your smart contract
1. Create your smart contract in the _.contracts/_ directory: <br>
`cd contracts` <br>
`truffle create contract Trust.sol` <br>
—> creates a new Solidity file 

2. Edit Smart Contract in your favourite Code Editor (e.g. Visual Studio Code). <br>
 <p> I created the smart contract for this Dapp, "Trust.sol", in <a href="http://remix.ethereum.org/">Remix IDE</a>. Remix is great when you are new to Solidity and it allows you to test your contract's functionality before you deploy it in your project.</p>

 ### Migrate your smart contract
 <p> Before we can deploy our new smart contract, we first have to _migrate_ it: </p>

 1. navigate to the _./migrations_ folder: <br>
`ls migrations/` <br>
Don’t modify the already existing migration file, Truffle needs it to use its migration feature.

2. create a migration file: <br>
`truffle create migration Trust` <br>

<p>  Truffle adds a random number to the name of your new migration file in order to know in what order it has to run the migration. </p>

3. 	Modify your new migration file in your text editor:
	1. copy the content from the _1_initial_migration.js_ file <br>
    2. then modify it as follows: <br>

        1. First, we import our smart contract of interest: <br>

        `var Trust = artifacts.require("./Trust.sol");` 

        2. Next, create a deployer (function) which calls the  method 'deploy': <br>
        <br>
        ```
        module.exports = function(deployer) {
            deployer.deploy(Trust, "This is my message")}; 
        ```

        This function will deploy the Trust.sol smart contract. <br>
        The smart contract is supposed to say the random string "This is my message" after it's deployed.

<p> Before we deploy our smart contract, "Trust.sol", we first need to do a few more steps. </p>

### Set up a server

1. Create a new directory named "server": <br>
`mkdir server` <br>
`cd server`

2. In the new directory, install Express (v4.17.1) <br>
`$ npm install express --save`<br>

3. Install Cors <br>
`npm install cors`

4. Create a new file named "server.js": <br>
`touch server.js`

5. In _server.js_, import Express and Cors: <br>
```
// imports
const express = require('express')
var cors = require('cors')
```

1. Start a server and make it ready to connect at Port 3000 <br>
   
```
const app = express()
app.use(cors())
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

2. Create a server interface (where we will later integrate the web3 API) <br>
```
app.get('/generateqrcode', async (req, res) => {
    })
```

## 2. Frontend


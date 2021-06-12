# Dapp to send ETH across Metamask wallets using QR codes 🧞
<p> This Dapp constitutes a simple programme to send and receive ether (ETH) across Metamask wallets using QR codes. </p>

<p> Author: Moritz Dillmann <br>
Institution: University of Lausanne </p>

## Motivation: 
<p> Proof of concept for a consumer CO2 compensation loyalty programme. </p>

##  Language requirements:
1) Backend: Solidity (Ethereum)
2) API: Javascript (web3 package)
3) Frontend: HTML, Javascript

## Environments:
1) Smart contract development: Remix (http://remix.ethereum.org/)
2) Smart contract deployment: Truffle (https://www.trufflesuite.com/)
3) Smart contract testing: Ganache GUI (and -cli) (https://www.trufflesuite.com/ganache)
4) Smart contract/ Dapp interaction in the browser: Metamask (https://metamask.io/)

<p> "MetaMask is the easiest way to interact with dapps in a browser. It is an extension for Chrome or Firefox that connects to an Ethereum network without running a full node on the browser's machine. It can connect to the main Ethereum network, any of the testnets (Ropsten, Kovan, and Rinkeby), or a local blockchain such as the one created by Ganache or Truffle Develop."
Source: https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask </p>

# Getting started:

## 1. Backend

### Create a Truffle project
1. Install node.js (v14.17.0) and npm (v6.14.13) <br>
https://nodejs.org/en/

2. Install Truffle: 
`npm install truffle -g` <br>
https://www.trufflesuite.com/truffle

3. Create a new Truffle project:
`truffle init` <br>
(You can check all commands you can use with Truffle with: `truffle`)

### Create your smart contract
1. Create Smart Contracts in _.contracts/_ folder: <br>
`cd contracts` <br>
`truffle create contract Trust.sol` <br>
—> creates a new Solidity file in the contracts/ directory

2. Edit Smart Contract in your favourite Code Editor (e.g. Visual Studio Code). <br>
 I created the smart contract for this Dapp, "Trust.sol", in Remix: http://remix.ethereum.org/. Remix allows you to test your contracts functionality before you deploy it in your project.

### Migrate your smart contract
1. navigate to the _./migrations_ folder: <br>
`ls migrations/` <br>
Don’t modify the already existing migration file, Truffle needs it to use its migration feature.

2. create a migration file: <br>
`truffle create migration Trust` <br>

 Truffle adds a random number to the name of your new migration file in order to know in what order it has to run the migration.

3. 	Modify your new migration file in your text editor:
	1. copy the content from the _1_initial_migration.js_ file <br>
    2. then modify it a bit: <br>

        1. First, we require our smart contract of interest:

        `var Trust = artifacts.require("./Trust.sol");` <br>

        2. Here, we have our deployer (function) which calls the  method 'deploy': <br>
        <br>
        ```
        module.exports = function(deployer) {
            deployer.deploy(Trust, "This is my message")}; 
        ```

        This deploys the Trust.sol smart contract. <br>
        The smart contract is supposed to say the random string "This is my message" after its deployed.


### Start a local blockchain with Ganache 

1. Install Ganache GUI <br>
https://www.trufflesuite.com/ganache

2. Install Ganache-cli <br>
`npm install -g ganache-cli`

3. Start Ganache CLI from the command line (in a separate Terminal tab) <br>
`truffle develop` <br>
—> this command starts a local test net <br>
—> we now also have an interactive prompt with which we can interact with our smart contract.

2. Start Ganache GUI (i.e. the visual tool) <br>
`open -a Ganache`

3. Configure Ganache GUI (to work with the Ganache-cli)

    1. Go to Settings in Ganache GUI
	2. Change the Port Number to 9545 (this is the port number of the blockchain the Ganache-cli instance started).
    3. Change the seed phrase: 
        1. Go to “Accounts & Keys” Menu.
        2. Insert the Mnemonic Seed phrase that was generated when you started Ganache CLI in the Terminal.
    4. Restart Ganache GUI

<p> Everything is now synced and up to date! 🧞 </p>
<p> Ganache GUI automatically handles the mining of the blocks, so you do not have to care about it. Convenient! <br> 
With each transaction, Ganache shows you the Gas that was used to pay for the mining.</p>

### Deploy your smart contract to the local blockchain

1. In the Ganache-cli terminal tab, type: <br>
`migrate` <br>

<p> That's it! Your smart contract is now deployed to your local blockchain. Next, we will set up an API to interact with the smart contract. </p>

## API

<p> In a next step, we connect web3.js to our Truffle project to interact with our smart contract.
web3.js is a commonly used Ethereum Javascript API.
For details about the web3 library collection, look at the 
<a href="https://web3js.readthedocs.io/en/v1.3.4/#:~:text=Ethereum%20JavaScript%20API-,web3.,using%20HTTP%2C%20IPC%20or%20WebSocket.&text=js%20as%20well%20as%20providing%20an%20API%20reference%20documentation%20with%20examples">docs</a>.
### Install web3.js

### Install web3.js (v1.3.6)
`npm install web3` <br>
You can check your web3 version with: `npm view web3 version`

### Import Web3 into your Truffle project

1. Create a new file: <br>
`vim server.js`

2. In server.js: import web3 <br>
`const Web3 = require(‘web3’);` <br>
—> now, you can use web3 with the ‘Web3’ _object_.

### Create a connection to your Ethereum node

<p> To connect to the blockchain, web3 needs a “provider” object. It is this object that will do the actual communication with the blockchain. <br>

This design allows for flexibility: it allows the user to decide which Ethereum wallet to use. e.g. Metamask. </p>

1. go to the newly created _index.js_ file: <br>

<p> Here, we create the web3 _instance_ (this is different to the previously created Web3 object): </p>

`const web3 = new Web3('http://127.0.0.1:9545');` <br>

<p> (http://127.0.0.1:9545) is the URL of the local Ganache blockchain. <br>
Now, we’re connected to the blockchain! 🧞

Later, we will create a second instance to connect to Metamask.
</p>

### Configure your smart contract

1. Create a “Contract instance” <br>
<p> —> that is an object that you can use to communicate with the smart contract <br>
We “teach” Web3 to interact with your smart contract by giving it 2 pieces of information: <br>
    1. Contract address <br>
    2. Contract abi (a JSON document that describes all the functions that can be called from outside the blockchain).</p>
    <br>
```
const contract = new web3.eth.Contract(
    Trust.abi, /*required argument. (A JSON document that describes all the functions that can be called from outside the blockchain).*/
    deployedNetwork.address //optional argument (uniquely identifies a specific smart contract on the blockchain)
);
``` 

::Where to find the ‘abi’ and ‘address’ information?::<br>
		1. Open a new terminal tab 
		2. Go to the _.contracts/_ folder in the build directory of the project
		3. There you see all the abis that were created when we compiled our smart contract
		4. Open the Trust.json file
		5.  This shows us all the (public) functions that are accessible from outside the smart contract
		6. The contract address appears in the “networks” section of the Trust.json file (after we deployed our smart contract)


2. Add to the second line of the server.js file: <br>

`const Trust = require('./build/contracts/Trust.json');` <br>

3. And above the contract instance, add the following:

```
const id = await web3.eth.net.getId();
const deployedNetwork = Trust.networks[id];
```

Your server.js should now look as follows: 

```
// imports
const Web3 = require(‘web3’);
const Trust = require('./build/contracts/Trust.json');

// create a web3 instance
const web3 = new Web3('http://127.0.0.1:9545');

const id = await web3.eth.net.getId();
const deployedNetwork = Trust.networks[id];

// create a contract instance
const contract = new web3.eth.Contract(
    Trust.abi, 
    deployedNetwork.address
);
```

### Interact with your smart contract
<p> We can now interact with our smart contract by calling its functions. Here, we have to distinguish between Ethereum's call and transaction API.





## Future steps: 

Connect to a public testnet like Ropsten or Kovan using a public API service for Ethereum from 'Infura' (instead of running an Ethereum node yourself)

This allows users to:
1. receive a transaction request from Web3
2. sign the transaction request in their wallet (e.g. Metamask)

Only after it received the signed transaction from the user's wallet, Web3 sends the signed transaction to the Ethereum network via the Infura node.

Btw:
When you use Metamask, you _do not have to set up Infura_ (for public testnets), because Metamask takes care by itself of how to send transactions to the Ethereum blockchain.

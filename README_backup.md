# Dapp to send ETH across Metamask accounts using QR codes 🧞
<p> This Dapp constitutes a simple programme to send and receive ether (ETH) across Metamask wallets using QR codes. <br> 
It consists of <br>

1. a *backend* with a single smart contract and a minimalistic server and,<br>
2. a *frontend* with a basic web page (displaying our QR code) and a Web3 API.

Author: Moritz Dillmann <br>
Institution: University of Lausanne </p>

## Motivation: 
<p> This project aims to provide a *proof of concept* for using smart contracts in a _consumer CO2 compensation loyalty programme_ initiated by the Munich-based start-up <a href="https://imero.de/">IMERO GmbH</a>. </p> 

##  Language requirements:
1. Backend:
   1. Javascript
   2. Solidity (Ethereum smart contract)
   
2. Frontend:
   1. Javascript (web3 API)
   2. HTML

## Environments:
1. Smart contract development and testing:
<a href="https://www.trufflesuite.com/">Truffle</a> (v5.3.2) Ethereum development framework <br>

2. Setting up a local blockchain: <a href="https://www.trufflesuite.com/ganache">Ganache</a>-cli and Ganache GUI <br>
   
3. Smart contract/ Dapp interaction in the browser: <a href="https://metamask.io/">Metamask wallet</a><br>

<p> "MetaMask is the easiest way to interact with dapps in a browser. It is an extension for Chrome or Firefox that connects to an Ethereum network without running a full node on the browser's machine. It can connect to the main Ethereum network, any of the testnets (Ropsten, Kovan, and Rinkeby), or a local blockchain such as the one created by Ganache or Truffle Develop."
Source: https://www.trufflesuite.com/docs/truffle/getting-started/truffle-with-metamask </p>

# Getting started:

## 1. Backend
<p> The backend mainly consists of our smart contract </p>

### Install Node.js
<p> Node.js is an open-source, server-side JavaScript runtime environment that executes Javascript outside a browser. <br>
To learn more about Node.js, have a look at the <a href="https://nodejs.org/en/docs/">docs</a>. </p>

1. Install <a href="https://nodejs.org/en/">node.js</a> (v14.17.0) together with its package manager, npm (v6.14.13) <br>

### Create a Truffle project

1. Install Truffle: 
`npm install truffle -g` <br>
https://www.trufflesuite.com/truffle

2. Create a new Truffle project:
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

1. go to the newly created _server.js_ file: <br>

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
```
const contract = new web3.eth.Contract(
    Trust.abi, 
    deployedNetwork.address 
);
```

2. Where to find the ‘abi’ and ‘address’ information?<br>
    1. Open a new terminal tab 
    2. Go to the _.contracts/_ folder in the build directory of the project
    3. There you see all the abis that were created when we compiled our smart contract
    4. Open the Trust.json file
    5. This shows us all the (public) functions that are accessible from outside the smart contract
    6. The contract address appears in the “networks” section of the Trust.json file (after we deployed our smart contract)


2. Add to the second line of the server.js file: <br>

`const Trust = require('./build/contracts/Trust.json');` <br>

3. And above the newly created contract instance in the server.js file, add the following:

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

1. Call a 'call' function of the smart contract using Ethereum's call API <br>

```
const result = await contract.methods.admin().call(); 
console.log("our admin is:", result);
```
2. get the ten unlocked accounts of ganache <br>

`const addresses = await web3.eth.getAccounts();`

3. Call a 'transaction' function of the smart contract using Ethereum's transaction API

```
const receipt = await contract.methods.addCustomer(addresses[1], 0).send({
        from: addresses[0],
	        value: web3.utils.toWei('1') //translates ETH to wei
            // alternative 1: value: '1000000000000000000' //wei
		    // alternative 2: use BN library:
		    // value: web3.utils.toBN('1000000000000000000')
    });
    console.log("receipt of admin's transaction to the smart contract", receipt); 
    /*get receipt of the transaction (that your transaction was 
    received by the blockchain and is being processed).*/
```

4. Call a second 'call' function telling us the amount a customer is supposed to receive (msg.value) and whether she already received it (true/false)
```
const result2 = await contract.methods.customers(addresses[1]).call();
    console.log("Status of the customer(s):", result2);
```

5. Call the second transaction function of our smart contract, "withdraw":
```
const receipt2 = await contract.methods.withdraw().send({
    from: addresses[1]});
console.log("Customer withdraws amount from contract:", receipt2);
```

6. Call a third 'call' function telling us the amount a customer is supposed to receive (msg.value) and whether she eventually received it (true/false)

```
const result3 = await contract.methods.customers(addresses[1]).call();
console.log("New status of the customer(s):", result3);
```

Next, let's connect the Metamask wallet to our Dapp.


### Integrate Web3 with Metamask
<p> With Metamask, you can connect to both, public networks (e.g. Mainnet, Ropsten, Kovan & Rinekeby testnet) or to your Local development (Ganache). <br> </p>
Metamask is a wallet that <br>
1. receives the unsigned transaction request by Web3 <br>
2. Asks the wallet user to confirm the transaction <br>
3. Sends the signed transaction to the Ethereum network <br>

1. Install Metamask <a href="https://metamask.io/download">browser extension</a> and create an account<br>
Extensions exist for Chrome, Firefox, Brave, and Edge.

2. Detect Metamask's web3 injection <br>
Add the following to the server.js file: 

```
// Is there is an injected web3 instance by Metamask?
    let web3;
    if (typeof web3 !== 'undefined') {
        init.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
    } else {
        // If no injected web3 instance is detected, fallback to Ganache.
        init.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:8545'); // truffle suggests new web3.providers.HttpProvider('http://127.0.0.1:9545');
        web3 = new Web3(init.web3Provider);
    }
```

3. add a web3 instance for Metamask
<p> As mentioned earlier, we now add a second web3-instance to allow our Metamask wallet to communicate with our local blockchain. <br>
Let's use the localhost network for it: </p> <br>

`const web3 = new Web3('http://127.0.0.1:8545');` <br>

'http://127.0.0.1:8545' is the URL of localhost 8545

4. Check out the seed phrase of your Metamask wallet
   1. In your Metamask wallet, go to Settings
   2. Go to Security & Privacy
   3. Click on “Reveal Seed Phrase”
   4. Copy the Seed Phrase to the Clipboard

5. Add the seed phrase to the following command in a new terminal tab: <br>

`ganache-cli -m "<seed phrase>"` <br>

—> this way, the addresses in Metamask will already have some ETH to do transactions

6. Go back to Metamask and change your network to Localhost 8545 <br>

<p> —> you see that the first address generated by Metamask already has 100 ETH in its account</p>

7. Open the _truffle-config.js_ file and comment out the following: <br>
<img src="./assets/img/development_network.png"/>

### Deploy your smart contract
<p>Open a new terminal and run the following command:</p>

`truffle migrate --reset --network development` <br>

<p> We can now see in Metamask that the first account already has a little bit less ETH because it pays for the deployment of the contract (and all other transactions) </p>


### Connect Metamask to Ganache



## Frontend
1. set up a server
2. set up a client using an HTML file
3. add a QR plugin to the server.js file
   
### Set up a server using Express
1. create a new directory and call it, for example, "server": 
2. Move your _server.js_ file to this new directory:
3. Install Express (v4.17.1)
`$ npm install express --save`<br>
`npm install cors`


## Future steps: 

Connect to a public testnet like Ropsten or Kovan using a public API service for Ethereum from 'Infura' (instead of running an Ethereum node yourself)

This allows users to:
1. receive a transaction request from Web3
2. sign the transaction request in their wallet (e.g. Metamask)

Only after it received the signed transaction from the user's wallet, Web3 sends the signed transaction to the Ethereum network via the Infura node.

Btw:
When you use Metamask, you _do not have to set up Infura_ (for public testnets), because Metamask takes care by itself of how to send transactions to the Ethereum blockchain.
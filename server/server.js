//imports

const Web3 = require('web3'); // Javascript API
const Trust = require('../build/contracts/Trust.json'); // smart contract

const EthereumQRPlugin = require("ethereum-qr-code"); // QR code plugin
// Adapted from: https://github.com/jibrelnetwork/ethereum-qr-code

const express = require('express') // server
var cors = require('cors')

// start server
const app = express()
app.use(cors())
const port = 3000

// QR code
const qr = new EthereumQRPlugin();

//Server Interface ("Schnittstelle")
app.get('/generateqrcode', async (req, res) => {
    console.log('init function called')

    /* -------------- Detecting MetaMask's web3 injection -------------------
    // Is there is an injected web3 instance by Metamask?
    let web3;
    if (typeof web3 !== 'undefined') {
        init.web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
    } else {
        // If no injected web3 instance is detected, fallback to Ganache.
        init.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:8545'); // truffle suggests new web3.providers.HttpProvider('http://127.0.0.1:7545');
        web3 = new Web3(init.web3Provider);
    }
    --------------------------------------------------------------------- */

    // instantiate web3
    //const web3 = new Web3('HTTP://127.0.0.1:9545'); // 'HTTP://127.0.0.1:9545' is the URL of the local Ganache GUI blockchain
    const web3 = new Web3('http://127.0.0.1:8545'); // 'http://127.0.0.1:8545' is the URL of localhost 8545

    const id = await web3.eth.net.getId();
    const deployedNetwork = Trust.networks[id];

    // configure your smart contract: create a "contract instance"
    // that is the object you use to communicate with the smart contract
    const contract = new web3.eth.Contract(
        Trust.abi, /*required argument. (A JSON document that describes all the 
      functions that can be called from outside the blockchain).*/
        deployedNetwork.address //optional argument (uniquely identifies a specific smart contract on the blockchain)
    );

    // ----------- Interact with your smart contract ---------------
    // Call a 'call' function of the smart contract using Ethereum's call API
    const result = await contract.methods.admin().call(); 
    console.log("our admin is:", result);
  
    // get the ten unlocked accounts of ganache, or when you connect 
    // to Metamask these are the addresses of the user:
    const addresses = await web3.eth.getAccounts();

    // Call a 'transaction' function of the smart contract using Ethereum's transaction API
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

    /*However, you only receive the receipt (see example above) if you’re 
    the one sending the transaction. If you want to get information about 
    all transactions (i.e. also the ones sent by others) you have to 
    add “Events” to your smart contract.
    --> not necessary in this local application, because only we send transactions.*/

    // Call a second 'call' function telling us 
    // the amount a customer is supposed to receive (msg.value) and
    // whether she already received it (true/false)
    const result2 = await contract.methods.customers(addresses[1]).call();
    console.log("Status of the customer(s):", result2);

    // second 'transaction' function: withdraw
    const receipt2 = await contract.methods.withdraw().send({
        from: addresses[1]});
    console.log("Customer withdraws amount from contract:", receipt2);

    // Call a third 'call' function telling us 
    // the amount a customer is supposed to receive (msg.value) and
    // whether she eventually received it (true/false)
    const result3 = await contract.methods.customers(addresses[1]).call();
    console.log("New status of the customer(s):", result3);
    
    // generate QR code
    qr.toDataUrl({
        to: addresses[1], //required: address of the smart contract
        from: "0xA0769D8100B85D3142Bc46F21C52Dc8BC18e9077", //optional, defaults to current active user account
        value: 1000000000000000000, //Amount of ETH to send. Measured in wei. Defaults to 0.
        gas: 21000, // optional - Recommended amount of gas. Defaults to 21000.
        /*
        mode: "contract_function", // required - Mode of invocation. Expected value: contract_function
        "functionSignature": {
          "name": "withdraw", // Name of the invoked function
          payable: true, //required - Defines whether function is able to receive ETH or not. (value should be zero if false)
        },
        */
      }).then((qrCodeDataUri) => {
        // base64 image string
        myQR = qrCodeDataUri.dataURL;
        console.log('Your QR id generated:', myQR); //> 'data:image/png;base64,iVBORw0KGgoA....'
        res.send(myQR)
    });
})

// listen at port 3000 of localhost
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


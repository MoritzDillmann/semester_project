// import QR-Code plugin
// from: https://github.com/jibrelnetwork/ethereum-qr-code/blob/master/README.md
// import EthereumQRPlugin from 'ethereum-qr-code'

// let's use web3 with the 'Web3' object
const Web3 = require('web3');

// configure your smart contract: 
const Trust = require('./build/contracts/Trust.json');

const init = async () => {
  // create the web3 instance (which connects us to the blockchain)
  const web3 = new Web3('HTTP://127.0.0.1:9545'); // 'http://localhost:8545' is the URL of the local Ganache blockchain

  const id = await web3.eth.net.getId();
	const deployedNetwork = Trust.networks[id];

  // configure your smart contract: create a "contract instance"
  // that is the object you use to communicate with the smart contract
  const contract = new web3.eth.Contract(
    Trust.abi, /*required argument. (A JSON document that describes all the 
      functions that can be called from outside the blockchain).*/
    deployedNetwork.address //optional argument (uniquely identifies a specific smart contract on the blockchain)
  );

  // Call a 'call' function of the smart contract
  // using Ethereum's call API
  const result = await contract.methods.admin().call(); 
  console.log("our admin is:", result);
  

  // Call a 'transaction' function of the smart contract
  // using Ethereum's transaction API

  // get the ten unlocked accounts of ganache, or when you connect 
  // to Metamask these are the addresses of the user:
  const addresses = await web3.eth.getAccounts();
	const receipt = await contract.methods.addCustomer(addresses[1], 0).send({
    from: addresses[0],
		value: web3.utils.toWei('1') //translates ETH to wei
    //value: '1000000000000000000' //wei
		// alternative: use BN library:
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

  // Call a second 'call' function telling us 
  // the amount a customer is supposed to receive (msg.value) and
  // whether she already received it (true/false)
  const result3 = await contract.methods.customers(addresses[1]).call();
  console.log("New status of the customer(s):", result3);

}

init();

// --------------------------------------------------------------

// QR code
/* const qr = new EthereumQRPlugin();

const qrCode = qr.toCanvas({
  "to": "0xcontractaddress",
  "from": "0xsenderaddress",
  "value": 0,
  "gas": 100000,
  "mode": "contract_function",
  "functionSignature": {
    "name": "transfer",
    "payable": false,
    "args": [
      {
        "name": "to",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint"
      }
    ]
  },
  "argsDefaults": [
    {
      "name": "to",
      "value": "0xtokensrecipient"
    },
    {
      "name": "value",
      "value": 1000000000000000000
    }
  ]
}, {
  
  selector: '#my-qr-code',
})
*/
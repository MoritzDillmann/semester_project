// import QR-Code plugin
// from: https://github.com/jibrelnetwork/ethereum-qr-code/blob/master/README.md
// import EthereumQRPlugin from 'ethereum-qr-code'

// let's use web3 with the 'Web3' object
const Web3 = require('web3');

// configure your smart contract: 
const Trust = require('./build/contracts/Trust.json');

const init = async () => {
  /*
  window.addEventListener('load', async () => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
     if (window.ethereum) {
       const web3 = new Web3(window.ethereum);
       try {
         // Request account access if needed
         await window.ethereum.enable();
         // Acccounts now exposed
         return web3;
       } catch (error) {
         console.error(error);
       }
     }
     // Legacy dapp browsers...
     else if (window.web3) {
       // Use Mist/MetaMask's provider.
       const web3 = window.web3;
       console.log('Injected web3 detected.');
       return web3;
     }
     // Fallback to localhost; use dev console port by default...
     else {
       const provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
       const web3 = new Web3(provider);
       console.log('No web3 instance injected, using Local web3.');
       return web3;
     }
   });
//--------
  ---- Alternative 1 (MEDIUM): -------
  if(window.ethereum){
    window.web3 = new Web3(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
  }
  else if(window.web3){
    window.web3 = new Web3(window.ethereum)
  }
  else{
    window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
  }
//--------
  ----- Alternative 2: -------
  // create the web3 instance (which connects us to the blockchain)
  if (window.ethereum) {
    await window.ethereum.send('eth_requestAccounts');
    window.web3 = new Web3(window.ethereum);
    return true;
  }
  return false;

  ----- Alternative 3: (TRUFFLE): ------
  // Is there is an injected web3 instance by Metamask?
  let web3;
  if (typeof web3 !== 'undefined') {
    init.web3Provider = web3.currentProvider;
    web3 = new Web3(web3.currentProvider);
  } else {
    // If no injected web3 instance is detected, fallback to Ganache.
    init.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:8545'); // truffle suggests new web3.providers.HttpProvider('http://127.0.0.1:7545');
    web3 = new Web3(init.web3Provider);
  }*/
  //--------

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
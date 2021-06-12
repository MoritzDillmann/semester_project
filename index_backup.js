// --------
// import QR-Code plugin from: https://github.com/jibrelnetwork/ethereum-qr-code/blob/master/README.md
//const EthereumQRPlugin = require("ethereum-qr-code");
// vs. ES6: import EthereumQRPlugin from 'ethereum-qr-code'

// -------- include JSDOM to allow for broswer-side testing (since Node JS is only server-side) -------------------
const jsdom = require("jsdom");
const  { JSDOM }  = jsdom; // create the JSDOM constructor, a named export of the jsdom main module.

const { document } = new JSDOM(`<!DOCTYPE html>

<head>
    <title>My Blockchain Project</title>
    <style>
        *,
        html {
            margin: 0;
            padding: 0;
            border: 0;
        }

        html {
            width: 100%;
            height: 100%;
        }

        body {
            width: 100%;
            height: 100%;
            position: relative;
            background-color: rgb(32, 119, 233);
        }

        .center {
            width: 100%;
            height: 50%;
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;
            font-family: "Trebuchet MS", Helvetica, sans-serif;
            text-align: center;
        }

        h1 {
            font-size: 144px;
        }

        p {
            font-size: 64px;
        }
    </style>

</head>
<body>
    <div id="image-placeholder"></div>
    <div class="center">
        <h2>Hello Max!</h2>
        <p>This is served from a file</p>
        <br>
        <p>Click the following button to see the function in action</p>    
        <input type = "button" onclick = "displayBase64Image(imagePlaceholder, base64Image)" value = "Display">
    </div>

</body>

</html>`, {runScripts: "dangerously", resources: "usable", pretendToBeVisual: true}).window; //Pass the constructor a string.

//You will get back a JSDOM object, which has a number of useful properties, notably window
//console.log(dom.window.document.querySelector("p").textContent); // "Hello world"

//--------------------------------------------------------------------


// --------- create a webserver ----------------
// load the http-module
const http = require("http");
// import the fs-module to be able to read files
const fs = require('fs').promises;

// define host and port to which our server is connected to
const host = 'localhost';
const port = 8000;

// formulate server answer to requests
// read the HTML file
let indexFile;
const requestListener = function (req, res) {
  res.setHeader("Content-Type", "text/html");
  res.writeHead(200);
  res.end(indexFile);
};


// create server and use Request Listener
const server = http.createServer(requestListener);

fs.readFile(__dirname + "/index.html")
    .then(contents => {
        indexFile = contents;
        // connect the server to a network address
        server.listen(port, host, () => {
            console.log(`Server is running on http://${host}:${port}`);
        });
    })
    .catch(err => {
        console.error(`Could not read index.html file: ${err}`);
        process.exit(1);
    });
  
// ----------------------------------------------


// let's use web3 with the 'Web3' object
//const Web3 = require('web3');

// configure your smart contract: 
//const Trust = require('./build/contracts/Trust.json');

/*
const init = async () => {

   -------------- Detecting MetaMask's web3 injection -------------------
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
  }
  //---------------------------------------------------------------------

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
  get receipt of the transaction (that your transaction was 
    received by the blockchain and is being processed).*/

  However, you only receive the receipt (see example above) if you’re 
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
  
  // QR code
  const qr = new EthereumQRPlugin();
  
   --------- using Canvas method to display QR code --------------
  const qrCode = qr.toCanvas({
  to,
  gas,
  }, {
    selector: '#my-qr-code',
  })

  qrCode.then((code) => {
    console.log('Your QR is generated!')
    console.log(code.value)
  })
  -----------------------------------------------------------------*/ 

  qr.toDataUrl({
    to: addresses[1], //required: address of the smart contract
    from: "0xA0769D8100B85D3142Bc46F21C52Dc8BC18e9077", //optional, defaults to current active user account
    value: 1000000000000000000, //Amount of ETH to send. Measured in wei. Defaults to 0.
    gas: 21000, // optional - Recommended amount of gas. Defaults to 21000.
    
    mode: "contract_function", // required - Mode of invocation. Expected value: contract_function
    "functionSignature": {
      "name": "withdraw", // Name of the invoked function
      payable: true, //required - Defines whether function is able to receive ETH or not. (value should be zero if false)
    },
    
  }).then((qrCodeDataUri) => {
    // base64 image string
    myQR = qrCodeDataUri.dataURL;
    console.log('Your QR id generated:', myQR); //> 'data:image/png;base64,iVBORw0KGgoA....'
    displayBase64Image(imagePlaceholder, myQR);
  });
  
}

init();
*/

myQR = "data:image/png;base64,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";

//var myQR = "data:image/png;base64,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";

function displayBase64Image(placeholder, myQR) {
  var image = document.createElement('img');
  image.onload = function() {
      placeholder.innerHTML = '';
      placeholder.appendChild(this);
  }
  image.src = myQR;
};


// image placeholder where the image will be displayed
var imagePlaceholder = document.getElementById('image-placeholder');

// display the image in placeholder
//displayBase64Image(imagePlaceholder, myQR);

// --------------------------------------------------------------


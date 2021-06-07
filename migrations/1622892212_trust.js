// first, we require our smart contract of interest:
var Trust = artifacts.require("./Trust.sol");

// here, we have our deployer (function) which calls the method 'deploy'
module.exports = function(deployer) {
	deployer.deploy(Trust); /* deploys the Trust.sol smart contract. 
  The smart contract is supposed to say the random string "This is my message" after its deployed.*/
};

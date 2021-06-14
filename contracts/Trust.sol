// SPDX-License-Identifier: MIT
pragma solidity = 0.8.4; //specify which version of Solidity you're going to use

// Supermarket deploys contract and sends ETH. 
// Customers withdraw ETH. Option that customer withdraws not before ETH is unlocked at "maturity (date)".

// In general, try to make the Solidity contract as simple as possible 
// in order to keep the amount of Gas needed to call a function as low as possible.

//start your smart contract
contract Trust {    
    struct Customer {
        uint amount;
        uint maturity;
        bool paid;
    }
    mapping(address => Customer) public customers; 
    address public admin; // define an admin address to only allow the supermarket to use the addCustomer function 
    
    constructor() { // the constructor function is only called when you first deploy the smart contract. 
        admin = msg.sender;
    }

    // next, let's define some rules about how to manipulate the veriables from above:
    // for that, we need functions:
    //the smart contract itself is allowed to have a balance of ETH.
    
    function addCustomer(address customer, uint timeToMaturity) external payable { /* the external keyword makes the function 
        callable from outside the smart contract, i.e. it's 'public'. The 'payable' keyword makes this function able to receive ether.*/
        require(msg.sender == admin, 'only admin'); // requires that only the supermarket can add a customer
        require(customers[msg.sender].amount == 0, 'customer already exists'); // this is how you access a field of a "struct"
        customers[customer] = Customer(msg.value, block.timestamp + timeToMaturity, false);
    }
    
    // create a function to allow the customer to withdraw the money.
    
    function withdraw() external {
        Customer storage customer = customers[msg.sender]; // "storage" refers to what is stored in the blockchain
        require(customer.maturity <= block.timestamp, 'too early'); // make sure that we're after the maturity; otherwise print an error message.
        require(customer.amount > 0, 'only customer can withdraw'); // make sure that the address that is calling the function is indeed a customer
        require(customer.paid == false, 'paid already');
        customer.paid = true;
        
        // next, send the money to the respective customer:
        payable(msg.sender).transfer(customer.amount); //"transfer" sends the money that is in the contract (i.e. "customer.amount") to "customer".
    }
}

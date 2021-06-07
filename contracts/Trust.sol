// SPDX-License-Identifier: MIT
//pragma solidity = 0.8.1; //specify which version of Solidity you're going to use
pragma solidity = 0.8.4; //specify which version of Solidity you're going to use

/*Supermarket deploys contract and sends ETH. 
Customers withdraw ETH not before ETH is unlocked at "maturity (date)".*/

/*In general, try to make the Solidity contract as simple as possible 
in order to keep the amount of Gas needed to call a function as low as possible. */ 


contract Trust {    //start your smart contract
    struct Customer {
        uint amount;
        uint maturity;
        bool paid;
    }
    mapping(address => Customer) public customers; // more efficient than "mappings" below
    /*
    mapping(address => uint) public amounts; //these are the amounts that we give to the different customers
    mapping(address => uint) public maturities; // the customers might withdraw at different points in time
    mapping(address => bool) public paid; /* --> who has been paid or not? 
        to prevent a customer from calling the function several times, stealing the ETH from the other customers
        */
    address public admin; // define an admin address to only allow the supermarket to use the addCustomer function 
    
    constructor() { // remember, the constructor function is only called when you first deploy the smart contract. 
        admin = msg.sender;
    }
    
    /*
    // next, let's define some rules about how to manipulate the veriables from above:
    // for that, we need functions:
     
    the 'payable' keyword allows us to send some ETH when we deploy the smart contract. 
    the smart contract itself is allowed to have a balance of ETH.
    
    constructor(address _customer, uint timeToMaturity) payable { 
        maturity = block.timestamp + timeToMaturity; // initialise the value for maturity
        customer = _customer; // initialise the customer variable
    }
    */
    
    function addCustomer(address customer, uint timeToMaturity) external payable { /* the external keyword makes the function 
        callable from outside the smart contract, i.e. it's 'public'.the 'payable' keyword makes this function able to receive ether.*/
        require(msg.sender == admin, 'only admin'); // require that only the supermarket can add a customer
        require(customers[msg.sender].amount == 0, 'customer already exists'); // this is how you access a field of a "struct"
        customers[customer] = Customer(msg.value, block.timestamp + timeToMaturity, false);
        
        /* -------------------------------------
        // next, we address the two mappings:
        amounts[customer] = msg.value; // the amounts a customer can withdraw
        maturities[customer] = block.timestamp + timeToMaturity; // when the customer can withdraw the ETH
        ------------------------------------------  
        */
    }
    
    // create a function to allow the customer to withdraw the money.
    // 'external' tells us that this function can be called from outside the smart contract
    
    function withdraw() external {
        /*  
        // before we send the money to the customer, we do a few checks:
        require(block.timestamp >= maturity, 'too early'); 
        --> change to "require(block.timestamp <= maturity, 'too late');"   
        
        
        require(msg.sender == customer, 'only customer can withdraw'); // make sure that the address that is calling the function is indeed the customer
        */ 
        Customer storage customer = customers[msg.sender]; // "storage" refers to what is stored in the blockchain
        require(customer.maturity <= block.timestamp, 'too early'); // make sure that we're after the maturity; otherwise print an error message.
        require(customer.amount > 0, 'only customer can withdraw'); // make sure that the address that is calling the function is indeed a customer
        require(customer.paid == false, 'paid already');
        customer.paid = true;
        
        // next, send the money to the respective customer:
        payable(msg.sender).transfer(customer.amount); //"transfer" sends the money that is in the contract (i.e. "customer.amount") to "customer".
    
    }
        /*
        require(maturities[msg.sender] <= block.timestamp, 'too early');  // make sure that we're after the maturity; otherwise print an error message.
        require(amounts[msg.sender] > 0, 'only kid can withdraw'); // make sure that the address that is calling the function is indeed a customer
        require(paid[msg.sender] == false, 'paid already');
        
        paid[msg.sender] = true; 
        
        // next, send the money to the respective customer:
        payable(msg.sender).transfer(amounts[msg.sender]); //"transfer" sends the money that is in the contract (i.e. "amounts[customer]") to "customer".
        */
}

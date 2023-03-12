const {expect, assert} = require('chai');
const hre = require("hardhat");

const {DAI, DAI_WHALE, POOL_ADDRESS_PROVIDER} = require("../config");

describe("Flash loans", function() {
    it("Should take a flash loan and be able to return it", async function() {

        const FlashLoanExample = await hre.ethers.getContractFactory("FlashLoanExample");
// Deploy our FlashLoanExample smart contract
// Address of the PoolAddressProvider: you can find it here: https://docs.aave.com/developers/deployed-contracts/v3-mainnet/polygon

        const flashLoanExample = await FlashLoanExample.deploy(POOL_ADDRESS_PROVIDER); 
        await flashLoanExample.deployed();
        
// Fetch the DAI smart contract

//  using Hardhat's extended ethers version, 
// we call the function getContractAt to get the instance of DAI deployed on Polygon Mainnet

// Remember Hardhat will simulate Polygon Mainnet, so when you get the contract at the address of DAI which you had specified in the config.js, 
// Hardhat will actually create an instance of the DAI contract which matches that of Polygon Mainnet.
        const token = await ethers.getContractAt("IERC20", DAI);

// Move 2000 DAI from DAI_WHALE to our contract by impersonating them
        const BALANCE_AMOUNT_DAI = ethers.utils.parseEther("2000");

// even though Hardhat doesn't have the private key of DAI_WHALE in the local testing environment, 
// it will act as if we already know its private key and can sign transactions on the behalf of DAI_WHALE. 
// It will also have the amount of DAI it has on the polygon mainnet.        

        await hre.network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [DAI_WHALE],
          });


// Now we create a signer for DAI_WHALE so that we can call the simlulated DAI contract with the address of DAI_WHALE and transfer some DAI to FlashLoanExample Contract

// We need to do this so we can pay off the loan with premium, as we will otherwise not be able to pay the premium. 
// In real world applications, the premium would be paid off the profits made from arbitrage or attacking a smart contract.

        const signer = await ethers.getSigner(DAI_WHALE);
        await token
              .connect(signer)
              .transfer(flashLoanExample.address, BALANCE_AMOUNT_DAI);  // Sends our contract 2000 DAI from the DAI_WHALE
     
// Request and execute a flash loan of 10,000 DAI from Aave
        const tx = await flashLoanExample.createFlashLoan(DAI, 10000);
        await tx.wait();              

// By this point, we should have executed the flash loan and paid back (10,000 + premium) DAI to Aave
// Let's check our contract's remaining DAI balance to see how much it has left
        const remainingBalance = await token.balanceOf(flashLoanExample.address);

// Our remaining balance should be <2000 DAI we originally had, because we had to pay the premium
        expect(remainingBalance.lt(BALANCE_AMOUNT_DAI)).to.equal(true);

    });
});
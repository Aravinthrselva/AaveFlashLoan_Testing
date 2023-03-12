// Polygon Mainnet DAI Contract Address
const DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
// Random user's address that happens to have a lot of DAI on Polygon Mainnet
// By the time you're doing this lesson, if this address doesn't have DAI on Polygon Mainnet,
// switch it out for someone else who does have a lot of DAI
const DAI_WHALE = "0xdfD74E3752c187c4BA899756238C76cbEEfa954B";

// Mainnet Pool contract address
//POOL_ADDRESS_PROVIDER is the address of the PoolAddressesProvider on polygon mainnet that our contract is expecting in the constructor.
// https://docs.aave.com/developers/deployed-contracts/v3-mainnet/polygon - addresses found here

const POOL_ADDRESS_PROVIDER = "0xa97684ead0e402dc232d5a977953df7ecbab3cdb";

module.exports = {
    DAI,
    DAI_WHALE,
    POOL_ADDRESS_PROVIDER,
  };

  //Since we are not actually executing any arbitrage, and therefore will not be able to pay the premium if we run the contract as-is, 
  //we use another Hardhat feature called impersonation that lets us send transactions on behalf of any address, even without their private key. 
  //However, of course, this only works on the local development network and not on real networks. 
  //Using impersonation, we will steal some DAI from the DAI_WHALE so we have enough DAI to pay back the loan with premium.
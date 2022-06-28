# Ipanema

## ℹ️ General Info
Ipanema builds the bridge between traditional banks and the blockchain ecosystem. It is a platform that enables banks to grant loans via the Celo blockchain to their customers.

### The Problem
In the last years, decentralized finance protocols that operate independently of banks and the traditional infrastructure recorded a giant growth. The new platforms use blockchains like Ethereum as core infrastructure and enable users to transfer values as digital tokens. Many financial services are already rebuilt in DeFi. Due to the missing authentication tools, loans can only be provided if an asset is locked up in a smart contract as col-lateral. This keeps DeFi developers from creating many more use cases. 
Parallel to this, traditional banks implemented online banking applications that offer a user-friendly frontend with secure KYC solutions meeting all regulatory requirements. The banking systems rely on legacy banking infrastructure that was set up decades ago therefore many systems are not up to date and processes are slow and expensive. 

### Large Opportunity
Blockchains provide layers for settlements and transactions that are faster, more secure, more transparent, and more interoperable than in the banking world. But the lack of providing loans in DeFi is a large opportunity for banks. With Ipanema, they can easily get access to the DeFi world and offer loans in cryptocurrencies to their customers. Ipanema builds the bridge between the traditional world and the blockchain ecosystem, by combining the advantages of banking interfaces with KYC solutions and the open world of blockchains. 

### Team & Background
Ipanema was created as part of the Celo x Huobi Hackathon with a focus on Stablecoin in Web3 &amp; Sustainability. The hackathon offered three topics of which we took the 3rd one 'Stablecoins + DeFi mobile solutions'. 

The Ipanema team consists of the german Capgemini Invent programmers [Volker Dufner](https://github.com/dFohlen), [Tim Schmitz](https://github.com/0x0tim), [Jonas Engelhardt](https://github.com/joengelh) and the consultant [Seyhan Ilhan](https://github.com/seyhdervis). 

[![Youtube: Ipanema - Celo x Huobi: Stablecoin in Web3 & Sustainability](http://img.youtube.com/vi/0tGJYdqTGI0/0.jpg)](https://www.youtube.com/watch?v=0tGJYdqTGI0 "Ipanema - Celo x Huobi: Stablecoin in Web3 & Sustainability")

## 🔄 Demo Flow

### Authentication
1. The customer logs into their online banking account.
2. The customer connects a wallet of their choice to receive the loan.
3. (planned) The bank verifies the customer's wallet e.g. with soulbound tokens.

### Taking a loan
3. The customer uses the Ipanema demo frontend to request a loan.
4. The bank checks the loan request and verifies the interest rate. Then the bank publishes a loan offer to the Celo blockchain
5. The customer takes the loan from the smart contract.

### Repaying a loan
6. The Customer repays the loan + interest amount in time. Then Bank liquidates the loan after the due date has passed.

The customer has no collateral by default if the loan is not repaid the bank can take legal actions in the real world in contrast to other DeFi applications. 

## 📣 What comes next?
The current version of Ipanema gives just a small insight into how banks could be integrated into the decentralized financial system. 
In the future, updates can be implemented that provide a better user experience, and more functionality and that help to meet current and incoming regulations. 

- Customer verification/KYC: banks are generally not allowed to provide loans to unauthenticated customers. Ipanema will integrate functions that use the bank’s KYC methods to verify each customer. Example: the customer enters his wallet address in his online banking application where KYC was already done. The bank will send a verification token to the customer’s wallet. Only customers with a verification token will be allowed to take loans. 

- Several categories of loans: currently there is only one version of fixed loans, that have to be fully repaid after a certain time. In the future, more versions of loans for example with variable interest rates and variable repayments could be implemented. We also want to introduce collateralized loans that can not only be covered by Bitcoin and Co., but also by tokenized real world assets.

- Full integration in a bank’s backend: the bank will be able to implement its risk models and provide each customer with a calculated interest rate.  

## 🧑‍💻 Technologies

### Celo: Mobile-First DeFi Platform

[Celo](https://celo.org/) is a fully EVM compatible proof-of-stake layer-1 protocol, featuring a fast ultralight client and built-in seigniorage stablecoins, collateralized by crypto and natural assets.

- [Whitepapers](https://celo.org/papers)
- [Docs](https://docs.celo.org/)
- [Developer Resources](https://celo.org/developers)
- [Tutorials](https://docs.celo.org/blog)

### Ipanema: Smart Contract
The Ipanema smart contract is written in Solidity and will initially be deployed on the [Alfajores test-net](https://docs.celo.org/getting-started/alfajores-testnet).

The ```multiLoanErc20.sol``` contract enables peer-to-peer loans using any ERC20 token.

### Ipanema: Backend
The backend consists of a service that demonstrates the banks backend, inclduing the wallet and calculation of the credit conditions. It is also written in Typescript and uses the Celo [ContractKit](https://github.com/celo-org/celo-monorepo/tree/master/packages/sdk/contractkit) to access the Ipanema smart contract.

### Ipanema: Mobile-First dApp
The Ipanema mobile-first decentralized application is written in Typescript including the [React](https://reactjs.org/) framework. Using the [react-celo](https://github.com/celo-org/react-celo) React hook, we manage access to Celo with an integrated headless modal system for connecting to the wallet of your choice.

## 🏗️ How to build/run

Please take a look at the underlying documents:

- [Hardhat](https://github.com/Blockchain-Garage-Capgemini-Invent/ipanema/tree/develop/packages/hardhat)
- [Backend](https://github.com/Blockchain-Garage-Capgemini-Invent/ipanema/tree/develop/packages/backend)
- [App](https://github.com/Blockchain-Garage-Capgemini-Invent/ipanema/tree/develop/packages/app)

or using Docker 🐳

1. Run `docker-compose build` to build the images.
2. Run `docker-compose up` to start the containers.

--- 
Copyright: [Volker Dufner](https://github.com/dFohlen) @ Capgemini Invent | 2022

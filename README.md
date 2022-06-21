# Ipanema

## 📑 Table of Contents
1. [General Info](#ℹ%EF%B8%8F-general-info)
2. [Technologies](#-technologies)
3. [First Steps](#-first-steps)
4. [FAQs](#%EF%B8%8F-faqs)

## ℹ️ General Info
Ipanema builds the bridge between traditional banks and the blockchain ecosystem. It is a platform that enables banks to grant loans via the Celo blockchain to their customers. The platform provides a frontend for customers to start loan requests and a backend that simulates a banking infrastructure. Loans can be provided in the stablecoins that are offered on the Celo blockchain. 

### The Problem
In the last years, decentralized finance protocols that operate independent from banks and the traditional infrastructure recorded a giant growth. The new platforms use blockchains like Ethereum as core infrastructure and enable users to transfer values in the form of digital token. Many financial services are already rebuilt in DeFi. Due to the missing authentication tools, loans can only be provided if an asset is locked up in a smart contract as collateral. This keeps DeFi developers from creating many more use-cases. 
Parallel to this, traditional banks implemented online banking applications that offer a user-friendly frontend with secure KYC solutions meeting all regulatoric requrements. The banking systems relies on legacy banking infrastructure that was set up decades ago therefore many systems are not up to date and processes are slow and expensive. 

### Large Opportunity
Blockchains provide layers for settlements and transactions that are faster, more secure, more transparent and more interoperable than in the banking world. But the lack in providing loans in DeFi is a large opportunity for banks. With Ipanema they can easily get access to the DeFi world and offer loans in cryptocurrencies to their customers. Ipanema builds the bridge between the traditional world and the blockchain ecosystem, by combining the advantages of banking interfaces with KYC solutions and the open world of blockchains. 

### Team & Background
Ipanema was created as part of the Celo x Huobi Hackathon with focus on Stablecoin in Web3 &amp; Sustainability. The hackathon offered three topics of which we took the 3rd one 'Stablecoins + DeFi mobile solutions'. 

The Ipanema team consists of the german Capgemini Invent programmers Volker Dufner, Tim Schmitz and Jonas Engelhardt. 

## 🧑‍💻 Technologies

### Celo: Mobile-First DeFi Platform

[Celo](https://celo.org/) is a fully EVM compatible proof-of-stake layer-1 protocol, featuring a fast ultralight client and built-in seigniorage stablecoins, collateralized by crypto and natural assets.

- [Whitepapers](https://celo.org/papers)
- [Docs](https://docs.celo.org/)
- [Developer Resources](https://celo.org/developers)
- [Tutorials](https://docs.celo.org/blog)

### Ipanema: Smart Contract
The Ipanema smart contract is written in Solidity and will initially be deployed on the [Alfajores testnet](https://docs.celo.org/getting-started/alfajores-testnet).

The ```ERC20.sol``` Contract deploys a test token that can be used to issue test loans.
The ```multiLoanErc20.sol``` contract enables peer to peer loans using any ERC20 token.

### Ipanema: Mobile-First dApp
The Ipanema mobile-first decentralized application is written in Typescript using the [React](https://reactjs.org/) and [Next](https://nextjs.org/) framework.

## 🚶 First Steps

1. [Set up a Testnet Development Wallet](https://docs.celo.org/developer-resources/testnet-wallet)
2. [Deploy on Celo](https://docs.celo.org/developer-resources/deploy-dapp)
3. [Integrate with Celo](https://docs.celo.org/developer-guide/integrations)

## Ipanema: Demo Flow

### Preparation

1. Bank customer logs into bank and requests loan on chain
2. Bank checks in backend eligibility, max loan size and rate
3. Customer selects credit option
4. Customer enters wallet public key
5. Bank verifies customers address by sending souldbound token with a PIN
6. Customer enters the PIN

### Loan Smart Contract

7. Bank opens funded loan offering
8. Customer accpets loan offering
9. Customer repays loan + interest in time | Bank liquidates loan after due date has passed

## 📣 What comes next?
The current version of Ipanema gives just a small insight of how banks could be integrated in the decentralized financial system. 
In future, updates can be implemented that provide a better user experience, more functionality and that help to meet current and incoming regulations. 

- Customer verification/KYC: banks are generally not allowed to provide loans to unauthenticated customers. Ipanema will integrate functions that use the banks KYC methods to verify each customer. Example: the customer enters his wallet address in his online banking application where KYC was already done. The bank will send a verification token to the customers wallet. Only customers with a verification token will be allowed to take loans. 

- Several categories of loans: currently there is only one version of fixed loans, that have to be fully repaid after a certain time. In future, more versions of loans for example with variable interest rates and variable repayments could be implemented. 

- Full integration in a banks backend: the bank will be able to implement its risk models and provide each customer with a calculated interest rate. 

## 🗣️ FAQs

--- 
Copyright: [Volker Dufner](https://github.com/dFohlen) @ Capgemini Invent | 2022

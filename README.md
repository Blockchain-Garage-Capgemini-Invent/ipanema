# Ipanema

## 📑 Table of Contents
1. [General Info](#ℹ%EF%B8%8F-general-info)
2. [Technologies](#-technologies)
3. [First Steps](#-first-steps)
4. [FAQs](#%EF%B8%8F-faqs)

## ℹ️ General Info
Celo x Huobi: Stablecoin in Web3 &amp; Sustainability

Ipanema is a platform that enables banks to grant loans via the Celo blockchain to their customers. The platform provides a frontend for customers to start loan requests and a backend that simulates a banking infrastructure. Loans can be provided in the stablecoins that are offered by the Celo blockchain. 

### The Problem
Decentralized finance platforms recorded a fast development and a giant growth in user base the last years. Due to the decentralization and the missing KYC tools, traditional banks stayed away from using the new platforms. Currently, there is no way for a bank to grant a loan in a cryptocurrency via a blockchain. For the users of decentralized platforms, there is no way to get a loan without having to put assets as collateral into a smart contract. 

Ipanema solves this issues by building a bridge between banks and DeFi users. 

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

/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      index.ts
 *      Created on: 08.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import Web3 from 'web3';
import ContractKit from "@celo/contractkit";

const deployedContracts: ContractJSON = import("@ipanema/hardhat/deployments/hardhat_contracts.json");
const web3 = new Web3("https://alfajores-forno.celo-testnet.org");
const kit = ContractKit.newKitFromWeb3(web3);

const getAccount = require("./getAccount").getAccount;

function loanRequest(addressUser: string, numOfDays: number, amount: number) {
    grantLoan(addressUser, calculateConditions(addressUser, numOfDays, amount));
}

function calculateConditions(addressUser: string, numOfDays: number, amount: number): number {
    let interestRate = 500;  // Calculated by the banks risk algorithm
    return interestRate;
}



const contract = new kit.web3.eth.Contract(
    contracts?.CentralizedLoan.abi,
    contracts?.CentralizedLoan.address
);


async function grantLoan(addressUser: string, interestRate: number) {
    let account = await getAccount();
    kit.connection.addAccount(account.privateKey);
    let amount = 10000;

    let multiLoan = await kit.contracts.
    let cEURtx = await multiLoan.offerLoan(loanAmount, interestAmount, repayByTimestamp, borrower, ercAddress).send({from: account.address});
}

// Alfajores Testnet Account:
// 0x6c87D48da426993ca8Eb3e8cD432CCCBD61c8cDc
// 959a7b54e849bafce5b40b1c6645d1b8b8b4b7557f1b9a8d8de7630d7a85cbb2

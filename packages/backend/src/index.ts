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

import Web3 from "web3";
import { AbiItem } from "web3-utils";
import path from "path";
import { readFileSync } from "fs";
import { ContractKit, newKit } from "@celo/contractkit";
import deployedContracts from "@ipanema/hardhat/deployments/hardhat_contracts.json";
import { CentralizedLoan } from "@ipanema/hardhat/types/CentralizedLoan";

// interface ContractJSON {
//   [key: string]: any;
// }

// function loanRequest(addressUser: string, numOfDays: number, amount: number) {
//   grantLoan(addressUser, calculateConditions(addressUser, numOfDays, amount));
// }

// function calculateConditions(
//   addressUser: string,
//   numOfDays: number,
//   amount: number
// ): number {
//   let interestRate = 500; // Calculated by the banks risk algorithm
//   return interestRate;
// }

const main = async () => {
  const pathToPrivateKey = path.join(__dirname, "./.secret");
  const privateKey =
    "959a7b54e849bafce5b40b1c6645d1b8b8b4b7557f1b9a8d8de7630d7a85cbb2";
  const address = "0x6c87D48da426993ca8Eb3e8cD432CCCBD61c8cDc";
  const kit: ContractKit = newKit("https://alfajores-forno.celo-testnet.org");

  // default from account
  kit.defaultAccount = address;

  // add the account private key for tx signing when connecting to a remote node
  kit.connection.addAccount(privateKey);

  const contracts = deployedContracts["44787"][0].contracts;
  const oneGold = kit.connection.web3.utils.toWei("1", "ether");

  const contract = new kit.connection.web3.eth.Contract(
    contracts?.CentralizedLoan.abi as AbiItem[] | AbiItem,
    contracts?.CentralizedLoan.address
  ) as any as CentralizedLoan;

  let estimateGas = await contract.methods
    .offerLoan(
      100,
      5,
      1655116468,
      "0x8F8aB9A6374D1a971ca614bC277218929869Bf89",
      "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
      //   loanAmount,
      //   interestAmount,
      //   repayByTimestamp,
      //   borrower,
      //   ercAddress
    ).estimateGas();

    console.log(estimateGas);


    await contract.methods
    .offerLoan(
      100,
      5,
      1655116468,
      "0x8F8aB9A6374D1a971ca614bC277218929869Bf89",
      "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1"
      //   loanAmount,
      //   interestAmount,
      //   repayByTimestamp,
      //   borrower,
      //   ercAddress
    ).send({ from: address });

    console.log("Loan offerted");
};

main().catch(err => {
  console.error(err);
});

// };

// main().catch(err => {
//   console.error(err);
// });
// Alfajores Testnet Account:
// cUSD: 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
// 0x6c87D48da426993ca8Eb3e8cD432CCCBD61c8cDc
// 959a7b54e849bafce5b40b1c6645d1b8b8b4b7557f1b9a8d8de7630d7a85cbb2

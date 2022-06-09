/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      centralized-loan-test.js
 *      Created on: 08.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CentralizedLoan", function () {
  it("Should add a new loan to the contract", async function () {
    const CentralizedLoan = await ethers.getContractFactory("CentralizedLoan");
    const centralizedLoan = await CentralizedLoan.deploy();
    await centralizedLoan.deployed();

    const offeredLoanTx = await centralizedLoan.offerLoan(
      100, // loan amount
      150, // interest amount
      1654639441, // repay by timestamp
      "0x8F8aB9A6374D1a971ca614bC277218929869Bf89", // borrower address
      "0x76dD98D306C879D78bC3574c3BD4dd795958d4d2" // erc20 address;
    );

    // wait until the transaction is mined
    await offeredLoanTx.wait();
  });
});

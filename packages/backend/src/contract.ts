/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      contract.ts
 *      Created on: 14.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import { ContractKit, newKit } from "@celo/contractkit";
import deployedContracts from "@ipanema/hardhat/deployments/hardhat_contracts.json";
import { CentralizedLoan } from "@ipanema/hardhat/types/CentralizedLoan";

export class Contract {
  private kit: ContractKit;
  private loanContract: CentralizedLoan;

  constructor() {
    const url = process.env.CELO_BLOCKCHAIN_NODE_URL as string;
    console.log("[CONTRACT] Using contract at", url);
    this.kit = newKit(url);
    this.kit.connection.addAccount(process.env.PRIVATE_KEY as string);
    this.loanContract = {} as CentralizedLoan;
  }

  public async init(): Promise<void> {
    const chainId = await this.kit.connection.chainId();
    interface ContractJSON {
      [key: string]: any;
    }
    console.log("[CONTRACT] Chain ID", chainId);
    const abi = (deployedContracts as ContractJSON)[chainId.toString()][0]
      .contracts.CentralizedLoan.abi;
    const address = (deployedContracts as ContractJSON)[chainId.toString()][0]
      .contracts.CentralizedLoan.address;
    this.loanContract = new this.kit.connection.web3.eth.Contract(
      abi,
      address
    ) as any as CentralizedLoan;
    console.log(
      "[CONTRACT] Loan contract address",
      this.loanContract.options.address
    );
  }

  public async offerLoan(
    loanAmount: number,
    interestAmount: number,
    repayByTimestamp: number,
    borrower: string,
    ercAddress: string
  ): Promise<void> {
    // Make approval for the loan contract to spend the token
    console.log("[CONTRACT] Approving loan contract to spend token");
    const token = await this.kit.contracts.getErc20(ercAddress);
    const amountToExchange = this.kit.web3.utils.toWei(
      loanAmount.toString(),
      "ether"
    );
    const approveTx = await token
      .approve(this.loanContract.options.address, amountToExchange)
      .send({ from: process.env.ADDRESS as string });
    const approveReceipt = await approveTx.waitReceipt();
    console.log("[CONTRACT] Approve receipt:\n", approveReceipt);

    // Check the allowance
    console.log("[CONTRACT] Checking allowance");
    const allowanceTx = await token.allowance(
      process.env.ADDRESS as string,
      this.loanContract.options.address
    );
    console.log("[CONTRACT] Allowance to spend", allowanceTx.toNumber());

    // Make the loan offer
    console.log("[CONTRACT] Making loan offer");
    try {
      const estimateGas = await this.loanContract.methods
        .offerLoan(
          amountToExchange,
          this.kit.web3.utils.toWei(interestAmount.toString(), "ether"),
          repayByTimestamp,
          borrower,
          ercAddress
        )
        .estimateGas({ from: process.env.ADDRESS as string });

      console.log("[CONTRACT] Estimated gas", estimateGas);

      const loanOffer = await this.loanContract.methods
        .offerLoan(
          amountToExchange,
          this.kit.web3.utils.toWei(interestAmount.toString(), "ether"),
          repayByTimestamp,
          borrower,
          ercAddress
        )
        .send({ from: process.env.ADDRESS as string, gas: estimateGas });
      console.log("[CONTRACT] Loan offer:\n", loanOffer);
      console.log(
        "[CONTRACT] ============================== Loan offered, waiting for next request =============================="
      );
    } catch (e) {
      console.log("[CONTRACT] Error:\n", e);
    }
  }
}

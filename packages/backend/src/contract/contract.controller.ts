/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      contract.controller.ts
 *      Created on: 14.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import { Request, Response } from "express";
import { ContractService } from "./contract.service";
import { FinancialService } from "../financial/financial.service";

class ContractController {
  private contract: ContractService;

  constructor() {
    console.log("[CONTRACT] controller created");
    this.contract = new ContractService();
    this.contract.init();
  }

  public async offerLoan(req: Request, res: Response) {
    console.log("[CONTRACT] offer loan request");
    try {
      if (
        !req.body.loanAmount ||
        !req.body.interestAmount || // we calculate this from scratch in the backend and do not need it here
        !req.body.repayByTimestamp ||
        !req.body.borrower ||
        !req.body.ercAddress
      ) {
        console.log("[CONTRACT] missing parameter");
        res.status(400).json({ status: "bad request - missing parameter" });
        return;
      } else if (req.body.loanAmount <= 0) {
        console.log("[CONTRACT] loanAmount <= 0");
        res.status(400).json({ status: "bad request - loanAmount <= 0" });
        return;
      } else if (
        new Date(req.body.repayByTimestamp * 1000) <= new Date(Date.now() + 1000 * 60 * 60 * 24)
      ) {
        console.log("[CONTRACT] repayByTimestamp <= now + 1 day");
        res.status(400).json({ status: "bad request - repayByTimestamp <= now + 1 day" });
        return;
      } else if (req.body.borrower.length !== 42) {
        console.log("[CONTRACT] borrower length != 42");
        res.status(400).json({ status: "bad request - borrower address is not valid" });
        return;
      } else if (req.body.ercAddress.length !== 42) {
        console.log("[CONTRACT] ercAddress length != 42");
        res.status(400).json({ status: "bad request - ercAddress is not valid" });
        return;
      }

      if (this.contract === undefined) {
        console.log("[CONTRACT] contract not initialized");
        res.status(500).json({ status: "internal server error - contract not initialized" });
        return;
      }

      const interestAmount = FinancialService.calculateInterestAmount(
        res.locals.username,
        req.body.loanAmount,
        req.body.repayByTimestamp,
      );
      if (interestAmount === undefined) {
        console.log("[CONTRACT] interest amount not found");
        res.status(500).json({ status: "internal server error - interest amount not found" });
        return;
      }

      if (interestAmount !== req.body.interestAmount) {
        console.log(
          "[CONTRACT] interest amount mismatch - backend: " +
            interestAmount +
            " vs app: " +
            req.body.interestAmount,
        );
        res.status(500).json({ status: "internal server error - interest amount mismatch" });
        return;
      }

      const offerLoanTx = await this.contract.offerLoan(
        req.body.loanAmount,
        interestAmount,
        req.body.repayByTimestamp,
        req.body.borrower,
        req.body.ercAddress,
      );

      if (!offerLoanTx) {
        console.log("[CONTRACT] offer loan failed");
        res.status(500).json({ status: "offer loan failed" });
        return;
      }

      console.log("[CONTRACT] offer loan successful");
      res.status(200).json({ status: "offer loan successful", tx: offerLoanTx });
    } catch (error: any) {
      console.error("[CONTRACT] error at offerLoan:\n", error);
      res.status(500).json({ status: "error" });
    }
  }
}

export default new ContractController();

/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      financial.controller.ts
 *      Created on: 22.06.22
 *      Author:     Tim Schmitz
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import { Request, Response } from "express";
import { FinancialService } from "./financial.service";

class FinancialController {
  private financialService: FinancialService;

  constructor() {
    console.log("[FINANCIAL] created");
    this.financialService = new FinancialService();
  }

  public async getBaseInterestRate(req: Request, res: Response) {
    console.log("[FINANCIAL] get base interest rate request");
    try {
      console.log("[FINANCIAL] get base interest for user: " + res.locals.username);
      const baseInterestRate = FinancialService.getBaseInterestRate(res.locals.username);
      if (!baseInterestRate) {
        console.log("[FINANCIAL] get base interest rate failed");
        res
          .status(500)
          .json({ status: "internal server error - get base interest rate failed" });
        return;
      }
      console.log("[FINANCIAL] base interest rate for user: " + res.locals.username + " is: " + baseInterestRate);
      res
        .status(200)
        .json({ status: "base interest rate successful", base_interest_rate: baseInterestRate });
    } catch (e) {
      console.error("[FINANCIAL] error at getBaseInterestRate:\n", e);
      res.status(500).json({ status: "error" });
    }
  }
}

export default new FinancialController();

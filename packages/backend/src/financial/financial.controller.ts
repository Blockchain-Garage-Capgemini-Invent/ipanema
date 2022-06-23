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

  public async getBaseInterest(req: Request, res: Response) {
    console.log("[FINANCIAL] get base interest request");
    try {
      const baseInterest = this.financialService.getBaseInterest(res.locals.username);
      if (!baseInterest) {
        console.log("[FINANCIAL] base interest calculation failed");
        res
          .status(500)
          .send({ status: "internal server error - base interest calculation failed" });
        return;
      }
      console.log("[FINANCIAL] interest calculation successful");
      res
        .status(200)
        .send({ status: "interest calculation successful", base_interest: baseInterest });
    } catch (e) {
      console.error("[FINANCIAL] error at getBaseInterest:\n", e);
      res.status(500).send({ status: "error" });
    }
  }
}

export default new FinancialController();

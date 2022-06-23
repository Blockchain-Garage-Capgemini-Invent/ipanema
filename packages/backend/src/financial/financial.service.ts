/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      financial.service.ts
 *      Created on: 22.06.22
 *      Author:     Tim Schmitz
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import { getFinancialData } from "./financialdata";

export class FinancialService {
  static getBaseInterestRate(username: string): number | undefined {
    const financialData = getFinancialData(username);
    if (!financialData) {
      console.log("[FINANCIAL] financial data for user " + username + " not found");
      return undefined;
    }
    return (financialData.average_income_per_month / financialData.average_expenses_last_month * -1) + (1 / financialData.balance);
  }

  static calculateInterestAmount(username: string, loanAmount: number, repayByTimestamp: number): number {
    return (loanAmount * 0.001) + this.getBaseInterestRate(username)!;
  }
}

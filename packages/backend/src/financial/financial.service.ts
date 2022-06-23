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
  public getBaseInterest(username: string): number | undefined {
    console.log("[FINANCIAL] get base interest for user: " + username);
    const financialData = getFinancialData(username);
    if (!financialData) {
      console.log("[FINANCIAL] financial data for user " + username + " not found");
      return undefined;
    }
    return (financialData.expenses_last_month - financialData.income_last_month) * 0.0001 -
        financialData.balance * 0.00001;
  }

  static calculateInterestAmount(username: string, loanAmount: number, repayByTimestamp: number) {
    const financialData = getFinancialData(username);
    if (!financialData) {
      console.log("[FINANCIAL] base interest calculation failed");
      return undefined;
    }
    const conditionalInterest = loanAmount * 0.0001;
    return conditionalInterest + (financialData.expenses_last_month - financialData.income_last_month) * 0.0001 -
        financialData.balance * 0.00001;
  }
}

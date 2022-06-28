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

interface FinancialData {
  username: string;
  balance: number;
  average_monthly_income: number;
  average_monthly_expenses: number;
  currency: string;
}

const financialDatabase: FinancialData[] = [
  {
    username: "max.muster@capgemini.com",
    balance: 10254.98,
    average_monthly_income: 3014.56,
    average_monthly_expenses: -2234.41,
    currency: "EUR",
  },
];

export class FinancialService {
  static getFinancialData(username: string): FinancialData | undefined {
    return financialDatabase.find(user => user.username === username);
  }

  static calculateBaseInterestRate(username: string): number | undefined {
    const financialData = FinancialService.getFinancialData(username);
    if (!financialData) {
      console.log("[FINANCIAL] financial data for user " + username + " not found");
      return undefined;
    }
    return (
      (financialData.average_monthly_income / financialData.average_monthly_expenses) * -1 +
      1 / financialData.balance
    );
  }

  static calculateInterestAmount(
    username: string,
    loanAmount: number,
    repayByTimestamp: number,
  ): number {
    const loanDuration = Math.round(
      (new Date(repayByTimestamp * 1000).getTime() - new Date(Date.now()).getTime()) /
        1000 /
        60 /
        60 /
        24,
    );
    return Number(
      (
        ((this.calculateBaseInterestRate(username)! + loanAmount * 0.0001 + loanDuration * 0.001) /
          100) *
        loanAmount
      ).toFixed(4),
    );
  }
}

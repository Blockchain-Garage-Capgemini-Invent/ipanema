/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      financialdata.ts
 *      Created on: 20.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

// export function getFinancialData(borrowerAddress: String): Promise<any>{
//   if (!borrowerAddress) {
//     console.log("[FINANCIALDATA] borrowerAddress param missing");
//     return {balance: 0, income_last_month: 0, expenses_last_month: 0};
//   } else {
//     return {balance: 10254.98, income_last_month: 3014.56, expenses_last_month: -2234.41};
//   }
//

interface FinancialData {
    username: string;
    balance: number;
    income_last_month: number;
    expenses_last_month: number;
}
const financialDatabase: FinancialData[] = [{ username: "max.muster@capgemini.com", balance: 10254.98, income_last_month: 3014.56, expenses_last_month: -2234.41 }]

export function getFinancialData(username: string): FinancialData | undefined {
    return financialDatabase.find(user => user.username === username);
}

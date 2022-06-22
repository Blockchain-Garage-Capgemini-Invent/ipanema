/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      contract.service.ts
 *      Created on: 22.06.22
 *      Author:     Tim Schmitz
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import {getFinancialData} from "./financialdata";

export class FinancialService {
    private borrowerAddress: String;

    constructor(borrowerAddress: String) {
        this.borrowerAddress = borrowerAddress;
    }

    public async getBaseInterest() {
        try{
            const baseInterest = 2;
            const {balance, income_last_month, expenses_last_month} = getFinancialData(this.borrowerAddress);
            const historicInterest = (expenses_last_month - income_last_month) * 0.0001 - balance * 0.00001;

            return baseInterest + historicInterest;
        } catch (e) {
            console.error("Error at getBaseInterest:\n", e);
        }
    }

    // TODO: implement this into contract.controller.ts
    /*
    public calculateInterestAmount(loanAmount: number, repayByTimestamp: number) {
        const baseInterest = 2;
        const durationInterest = (repayByTimestamp - Math.floor(Date.now() / 1000)) * 0.0000001
        const conditionalInterest = loanAmount * 0.0001

        const {balance, income_last_month, expenses_last_month} = getFinancialData(this.borrowerAddress);
        const historicInterest = (expenses_last_month - income_last_month) * 0.0001 - balance * 0.00001;

        return baseInterest + durationInterest + conditionalInterest + historicInterest;
    }
     */
}
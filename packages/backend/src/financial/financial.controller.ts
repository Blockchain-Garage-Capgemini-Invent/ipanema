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

import {NextFunction, Request, Response} from "express";
import {FinancialService} from "./financial.service";

class FinancialController{
    private financial: FinancialService;

    constructor() {
        console.log("FinancialController created");
        this.financial = new FinancialService();
    }

    public async getBaseInterest(req: Request, res: Response, next: NextFunction) {
        console.log("[FINANCIAL] get base interest request");
        try {
            if (!req.body.borrower) {
                console.log("[CONTRACT] missing parameter");
                res.status(400).send({ status: "bad request - missing parameter" });
                return;
            } else if (req.body.borrower.length !== 42) {
                console.log("[CONTRACT] borrower length != 42");
                res.status(400).send({ status: "bad request - borrower address is not valid" });
                return;
            }

            const baseInterest = await this.financial.getBaseInterest();

            if (!baseInterest) {
                console.log("[FINANCIAL] base interest calculation failed");
                res.status(500).send({ status: "offer loan failed" });
            }

            console.log("[FINANCIAL] interest calculation successful");
            res.status(200).send({ status: "interest calculation successful", tx: baseInterest });
        } catch (e) {
            console.error("Error at baseInterest:\n", e);
            res.status(500).send({ status: "error" });
        }
    }
}

export default new FinancialController();
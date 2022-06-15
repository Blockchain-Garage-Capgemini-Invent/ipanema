/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      index.ts
 *      Created on: 08.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import { Contract } from "./contract";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
dotenv.config();

const host: string = process.env.HOST || "localhost";
const port: number = Number(process.env.PORT);

const main = async () => {
  console.log("[MAIN] Starting backend");

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  const contract = new Contract();
  await contract.init();

  app.post("/api/v1/loan", async (req, res) => {
    console.log("[Server] Request at /api/loan:\n", req.body);
    try {
      if (
        !req.body.loanAmount ||
        !req.body.interestAmount ||
        !req.body.repayByTimestamp ||
        !req.body.borrower ||
        !req.body.ercAddress
      ) {
        res.status(400).send({ status: "bad request" });
        return;
      }
      await contract.offerLoan(
        req.body.loanAmount,
        req.body.interestAmount,
        req.body.repayByTimestamp,
        req.body.borrower,
        req.body.ercAddress
      );
      res.status(200).send({ status: "ok" });
    } catch (e) {
      console.error("[Server] Error at /api/loan:\n", e);
      res.status(500).send({ status: "error" });
    }
  });

  app.listen(port, () => {
    console.log(`[Server] Server is running at https://localhost:${port}`);
  });
};

main().catch(e => {
  console.error("[MAIN] Error:\n", e);
});

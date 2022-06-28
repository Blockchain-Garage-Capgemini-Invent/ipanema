/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      index.ts
 *      Created on: 14.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { AuthRoutes } from "./auth/auth.routes";
import { ContractRoutes } from "./contract/contract.routes";
import { FinancialRoutes } from "./financial/financial.routes";
dotenv.config();

const host: string = process.env.HOST || "0.0.0.0";
const port: number = Number(process.env.PORT);

const main = async () => {
  console.log("[MAIN] Starting backend");

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());

  AuthRoutes.configureRoutes(app);
  ContractRoutes.configureRoutes(app);
  FinancialRoutes.configureRoutes(app);

  app.listen(port, host, () => {
    console.log(`[Server] listen on http://${host}:${port}`);
  });
};

main().catch(error => {
  console.error("[MAIN] Error:\n", error);
});

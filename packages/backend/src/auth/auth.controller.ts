/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      auth.controller.ts
 *      Created on: 14.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import { Request, Response, NextFunction } from "express";
import { User } from "./auth.service";

class AuthController {
  constructor() {
    console.log("AuthController created");
  }

  public async login(req: Request, res: Response) {
    console.log("[SERVER] login request");
    try {
      console.log("[SERVER] login request: " + JSON.stringify(req.body));
      if (!req.body.username || !req.body.password) {
        console.log("[SERVER] no username or password");
        res.status(400).send({ status: "bad request - missing parameter" });
        return;
      }

      const user = User.getUser(req.body.username);
      if (!user) {
        console.log("[SERVER] user not found: " + req.body.username);
        res.status(403).send({ status: "forbidden - user not found" });
        return;
      } else if (user.password !== req.body.password) {
        console.log("[SERVER] wrong password for user: " + req.body.username);
        res.status(403).send({ status: "forbidden - wrong password" });
        return;
      }

      console.log("[SERVER] user authenticated: " + req.body.username);
      res.status(200).send({ status: "ok", data: user });
    } catch (err) {
      res.status(500).send({ status: "error", error: err });
    }
  }

  public async authenticate(req: Request, res: Response, next: NextFunction) {
    console.log("[SERVER] authenticate request");
    try {
        console.log("[SERVER] authenticate request: " + JSON.stringify(req.headers));
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.split(" ")[1]) {
        console.log("[SERVER] auth header is missing");
        res.status(401).send({ status: "unauthorized - missing parameter" });
        return;
      }

      const credentials = Buffer.from(authHeader.split(" ")[1], "base64").toString("binary");
      const [username, password] = credentials.split(":");
      if (!username || !password) {
        console.log("[SERVER] no username or password");
        res.status(401).send({ status: "unauthorized - missing credentials" });
        return;
      }

      const user = User.getUser(username);
      if (!user) {
        console.log("[SERVER] user not found: " + username);
        res.status(403).send({ status: "forbidden - user not found" });
        return;
      } else if (user.password !== password) {
        console.log("[SERVER] wrong password for user: " + username);
        res.status(403).send({ status: "forbidden - wrong password" });
        return;
      }

      console.log("[SERVER] user authenticated: " + username);
      res.locals.username = username;
      next();
    } catch (e) {
      console.error("Error at authenticate:\n", e);
      res.status(500).send({ status: "error" });
    }
  }
}

export default new AuthController();

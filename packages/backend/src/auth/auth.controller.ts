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
    console.log("[AUTH] created");
  }

  public async login(req: Request, res: Response) {
    console.log("[AUTH] login request");
    try {
      if (!req.body.username || !req.body.password) {
        console.log("[AUTH] no username or password");
        res.status(400).json({ status: "bad request - missing parameter" });
        return;
      }

      const user = User.getUser(req.body.username);
      if (!user) {
        console.log("[AUTH] user not found: " + req.body.username);
        res.status(403).json({ status: "forbidden - user not found" });
        return;
      } else if (user.password !== req.body.password) {
        console.log("[AUTH] wrong password for user: " + req.body.username);
        res.status(403).json({ status: "forbidden - wrong password" });
        return;
      }

      console.log("[AUTH] user authenticated: " + req.body.username);
      res.status(200).json({ status: "ok", data: user });
    } catch (err) {
      res.status(500).json({ status: "error", error: err });
    }
  }

  public async authenticate(req: Request, res: Response, next: NextFunction) {
    console.log("[AUTH] authenticate request");
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.split(" ")[1]) {
        console.log("[AUTH] auth header is missing");
        res.status(401).json({ status: "unauthorized - missing parameter" });
        return;
      }

      const credentials = Buffer.from(authHeader.split(" ")[1], "base64").toString("binary");
      const [username, password] = credentials.split(":");
      if (!username || !password) {
        console.log("[AUTH] no username or password");
        res.status(401).json({ status: "unauthorized - missing credentials" });
        return;
      }

      const user = User.getUser(username);
      if (!user) {
        console.log("[AUTH] user not found: " + username);
        res.status(403).json({ status: "forbidden - user not found" });
        return;
      } else if (user.password !== password) {
        console.log("[AUTH] wrong password for user: " + username);
        res.status(403).json({ status: "forbidden - wrong password" });
        return;
      }

      console.log("[AUTH] user authenticated: " + username);
      res.locals.username = username;
      next();
    } catch (e) {
      console.error("[AUTH] error at authenticate:\n", e);
      res.status(500).json({ status: "error" });
    }
  }
}

export default new AuthController();

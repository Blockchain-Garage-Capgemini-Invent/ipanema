/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      user.ts
 *      Created on: 20.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import * as dotenv from "dotenv";
dotenv.config();

export async function login(username: string, password: string): Promise<boolean> {
  const response = await fetch(`http://localhost:3000/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: username, password: password }),
  });

  if (!response.ok) {
    // auto logout if 401 response returned from api
    if (response.status === 401) {
      logout();
    }
    console.log("Login failed: " + response.status);
    return false;
  }

  if (!response.body) {
    console.log("No data returned from server");
    return false;
  }

  // store user details and basic auth credentials in local storage
  // to keep user logged in between page refreshes
  console.log("Storing user data in local storage");
  localStorage.setItem("user", window.btoa(username + ":" + password));
  return true;
}

export function logout() {
  // remove user from local storage to log user out
  localStorage.removeItem("user");
}

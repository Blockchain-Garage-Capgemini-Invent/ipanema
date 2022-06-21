/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      ConnectWallet.tsx
 *      Created on: 15.06.22
 *      Author:     Tim Schmitz
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { useCelo } from "@celo/react-celo";
import { authHeader } from "../helpers/auth";
import { logout } from "../services/user";

export default function ConnectWallet() {
  const navigate = useNavigate();
  const { address, network, connect } = useCelo();

  if (!authHeader()) {
    logout();
    navigate("/");
  }

  const connected = address && network && network.name === "Alfajores";
  if (connected) {
    navigate("/maintenance");
  }

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item sm={6} xs={12} sx={{ m: 2 }}>
        <Card sx={{ mt: 5, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <CardContent>
            <Typography variant="h5">Connect your Wallet</Typography>
            <FormControl fullWidth sx={{ m: 1 }}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                onClick={() => connect().catch(e => console.log(e))}
              >
                Choose Wallet
              </Button>
            </FormControl>
          </CardContent>
        </Card>

        <Card sx={{ mt: 5 }}>
          <CardContent>
            <Typography variant="h5">How it works:</Typography>
            <Typography variant="h6" marginTop={2}>
              1. Authenticate
            </Typography>
            <Typography>- Enter your wallet address at your banking app</Typography>
            <Typography>- Your bank will verify your address</Typography>
            <Typography variant="h6" marginTop={2}>
              2. Get a loan
            </Typography>
            <Typography>- Connect your wallet in the frontend</Typography>
            <Typography>- Enter time range and amount</Typography>
            <Typography>- Get the loan from your bank</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

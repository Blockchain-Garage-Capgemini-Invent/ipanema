/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      MarketData.tsx
 *      Created on: 28.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import { Stack, Typography } from "@mui/material";

export default function MarketData() {
  // TODO: Load market data from blockchain (smart contract)

  return (
    <Stack direction="column" marginTop={3}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Market
      </Typography>
      <Typography variant="body1">
        {" "}
        <b>13</b> Loan(s) taken
      </Typography>
      <Typography variant="body1">
        <b>12</b> Loan(s) repaid
      </Typography>
      <Typography variant="body1">
        <b>1</b> Loan(s) ongoing
      </Typography>
      <Typography variant="body1">
        <b>102</b> cUSD, <b>74</b> cEUR and <b>5</b> cREAL in total
      </Typography>
    </Stack>
  );
}

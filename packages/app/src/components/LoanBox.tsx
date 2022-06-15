/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      MaintenanceBox.tsx
 *      Created on: 13.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import * as React from "react";
import { Card, CardContent, Grid, Typography, Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

interface State {
  date: Date | null;
  amount: number;
  rate: number;
}

async function postLoan(state: State): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:3000/api/v1/loan", {
      method: "POST",
      body: JSON.stringify({
        loanAmount: state.amount,
        interestAmount: state.rate,
        // repayByTimestamp: state.date?.getTime() / 1000, // TODO: Fix undefined
        borrower: "0x0000000000000000000000000000000000000000",
        ercAddress: "0x0000000000000000000000000000000000000000",
      }),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
      return false;
    }

    // OPTIONAL: handle response here, e.g. show transaction id or whatever
    return true;
  } catch (err) {
    // setErr(err.message);
  } finally {
    // setIsLoading(false);
  }
  return false;
}

// async function takeLoanAndAcceptTerms(): Promise<boolean> {
//   try {
//     // TODO: implement
//   } catch (err) {
//     // setErr(err.message);
//   } finally {
//     // setIsLoading(false);
//   }
//   return false;
// }

export default function LoanBox() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [values, setValues] = React.useState<State>({
    date: new Date(Date.now()),
    amount: 0,
    rate: 5,
  });

  const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleChangeDate = (newValue: Date | null) => {
    setValues({ ...values, date: newValue });
  };

  const handleSubmit = async () => {
    console.log(values);
    await postLoan(values);
  };

  return (
    <>
      <Grid sx={{ m: 1 }} container justifyContent="center">
        <Grid item sm={6} xs={12} sx={{ m: 2 }}>
          <Typography variant="h3">Get a loan from your bank</Typography>
          <Typography variant="body1">
            Welcome to the Ipanema DeFi borrowing platform. Here you can get DeFi loans from your
            bank in just a few minutes! These loans are currently on Celo network.
          </Typography>
          <Card sx={{ mt: 5 }}>
            <CardContent>
              <FormControl fullWidth sx={{ m: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Stack spacing={3}>
                    {!isMobile ? (
                      <DesktopDatePicker
                        label="Repay date"
                        inputFormat="dd/MM/yyyy"
                        value={values.date}
                        onChange={handleChangeDate}
                        renderInput={params => <TextField {...params} />}
                      />
                    ) : (
                      <MobileDatePicker
                        label="Repay date"
                        inputFormat="dd/MM/yyyy"
                        value={values.date}
                        onChange={handleChangeDate}
                        renderInput={params => <TextField {...params} />}
                      />
                    )}
                  </Stack>
                </LocalizationProvider>
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">Amount</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  type="number"
                  value={values.amount}
                  onChange={handleChange("amount")}
                  startAdornment={<InputAdornment position="start">cUSD</InputAdornment>}
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-interest-rate">Interest Rate</InputLabel>
                <OutlinedInput
                  id="outlined-adornment-interest-rate"
                  type="number"
                  value={5}
                  disabled={true}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  label="Interest Rate"
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <Button variant="contained" type="submit" color="primary" onClick={handleSubmit}>
                  Get Loan!
                </Button>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

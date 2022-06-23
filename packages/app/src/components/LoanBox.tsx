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
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { useTheme } from "@mui/material/styles";
import { useCelo } from "@celo/react-celo";
import { StableToken } from "@celo/contractkit/lib/celo-tokens";
import deployedContracts from "@ipanema/hardhat/deployments/hardhat_contracts.json";
import { CentralizedLoan } from "@ipanema/hardhat/types/CentralizedLoan";
import { useSnackbar } from "notistack";
import { getAuthentication } from "../helpers/auth";
import { logout } from "../services/user";
import { useEffect } from "react";

interface defaultValues {
  token: StableToken;
  date: Date | null;
  amount: number;
  rate: number;
}

export default function LoanBox() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { kit, address, network } = useCelo();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  let baseInterest: number;

  if (!getAuthentication()) {
    logout();
    navigate("/");
  }

  const connected = address && network && network.name === "Alfajores";
  if (!connected) {
    navigate("/connect");
  }

  interface ContractJSON {
    [key: string]: any;
  }

  const contractAbi = (deployedContracts as ContractJSON)[network.chainId.toString()][0].contracts
    .CentralizedLoan.abi;
  const contractAddress = (deployedContracts as ContractJSON)[network.chainId.toString()][0]
    .contracts.CentralizedLoan.address;
  const loanContract = new kit.connection.web3.eth.Contract(
    contractAbi,
    contractAddress,
  ) as any as CentralizedLoan;

  const [formValues, setFormValues] = React.useState<defaultValues>({
    token: StableToken.cUSD,
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    amount: 1,
    rate: 5,
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange = (prop: keyof defaultValues) => (event: any) => {
    updateInterestRate();
    if (prop === "token") {
      setFormValues({ ...formValues, [prop]: event.target.value as StableToken });
    } else if (prop === "date") {
      setFormValues({ ...formValues, [prop]: event.target.value as Date });
    } else if (prop === "amount") {
      setFormValues({ ...formValues, [prop]: parseFloat(event.target.value) });
    }
  };

  const handleChangeDate = (newValue: Date | null) => {
    setFormValues({ ...formValues, date: newValue });
  };

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!baseInterest) {
      getInterestRate();
    }
  }, []);

  const getInterestRate = async () => {
    // baseInterest = interest based on account history (will be taken from backend at the beginning)
    // conditionalInterest = interest based on amount and time range (will be calculated in the frontend)
    // interestRate = baseInterest + conditional Interest (will be calculated in the frontend AND in the backend)

    try {
      const response = await fetch("http://localhost:3000/interest", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthentication(),
        },
      });

      if (!response.ok || !response.body) {
        enqueueSnackbar("Error submitting loan information!", { variant: "error" });
        return false;
      }

      baseInterest = JSON.parse(response.body.toString()).interest_rate;
      return true;
    } catch (err) {
      enqueueSnackbar("Error submitting loan information!", { variant: "error" });
      console.log(err);
    }
  };

  const updateInterestRate = () => {
    const conditionalInterest = formValues.amount * 0.0001;
    setFormValues({ ...formValues, rate: baseInterest + conditionalInterest });
  };

  const postLoan = async (formValues: defaultValues, borrower: string, ercAddress: string) => {
    try {
      const response = await fetch("http://localhost:3000/loan", {
        method: "POST",
        body: JSON.stringify({
          loanAmount: Number(formValues.amount),
          interestAmount: Number(formValues.amount) * (formValues.rate / 100),
          repayByTimestamp: formValues.date ? Math.round(formValues.date.getTime() / 1000) : 0,
          borrower: borrower,
          ercAddress: ercAddress,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: getAuthentication(),
        },
      });

      if (!response.ok) {
        enqueueSnackbar("Error submitting loan information!", { variant: "error" });
        return false;
      }

      // OPTIONAL: show transaction id or whatever
      return true;
    } catch (err) {
      enqueueSnackbar("Error submitting loan information!", { variant: "error" });
      console.log(err);
    }
    return false;
  };

  const takeLoanAndAcceptTerms = async () => {
    try {
      console.log("Taking the loan");
      const estimateGas = await loanContract.methods.takeLoanAndAcceptTerms().estimateGas();
      console.log("Estimated gas:", estimateGas);
      const takeLoanTx = await loanContract.methods
        .takeLoanAndAcceptTerms()
        .send({ from: address as string });
      console.log("Loan:\n", takeLoanTx);
      if (!takeLoanTx.status) {
        enqueueSnackbar("Error taking the loan!", { variant: "error" });
        return;
      }
      enqueueSnackbar("Congratulations! You have taken a loan!", { variant: "success" });
      navigate("/maintenance");
    } catch (err) {
      console.log(err);
      enqueueSnackbar("Error taking the loan!", { variant: "error" });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = await kit.contracts.getStableToken(formValues.token);
    await postLoan(formValues, address!, token.address);
    await takeLoanAndAcceptTerms();
    setLoading(false);
  };

  return (
    <>
      <Grid sx={{ m: 1 }} container justifyContent="center">
        <Grid item sm={6} xs={12} sx={{ m: 2 }}>
          <Typography variant="h3">Get a loan from your bank</Typography>
          <Typography variant="body1">
            Welcome to the Ipanema DeFi borrowing platform. Here you can get DeFi loans from your
            bank in just a few seconds! These loans are currently on Celo Alfajores network.
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
                        value={formValues.date}
                        onChange={handleChangeDate}
                        renderInput={params => <TextField {...params} />}
                      />
                    ) : (
                      <MobileDatePicker
                        label="Repay date"
                        inputFormat="dd/MM/yyyy"
                        value={formValues.date}
                        onChange={handleChangeDate}
                        renderInput={params => <TextField {...params} />}
                      />
                    )}
                  </Stack>
                </LocalizationProvider>
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="token">Token</InputLabel>
                <Select
                  id="token"
                  label="Token"
                  value={formValues.token}
                  onChange={handleChange("token")}
                >
                  <MenuItem value={StableToken.cUSD}>cUSD</MenuItem>
                  <MenuItem value={StableToken.cEUR}>cEUR</MenuItem>
                  <MenuItem value={StableToken.cREAL}>cREAL</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="amount">Amount</InputLabel>
                <OutlinedInput
                  id="amount"
                  label="Amount"
                  type="number"
                  value={formValues.amount}
                  endAdornment={<InputAdornment position="end">{formValues.token}</InputAdornment>}
                  onChange={handleChange("amount")}
                  error={formValues.amount <= 0}
                />
                {formValues.amount <= 0 ? (
                  <FormHelperText id="amount" error>
                    The amount must be greater than 0
                  </FormHelperText>
                ) : null}
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="interest-rate">Interest Rate</InputLabel>
                <OutlinedInput
                  id="interest-rate"
                  label="Interest Rate"
                  type="number"
                  value={formValues.rate}
                  disabled={true}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  color="primary"
                  loading={loading}
                  loadingIndicator="Waiting for approval..."
                  onClick={handleSubmit}
                >
                  Get Loan
                </LoadingButton>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

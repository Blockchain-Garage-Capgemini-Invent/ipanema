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
  Grid,
  InputAdornment,
  OutlinedInput,
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

interface defaultValues {
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
    date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    amount: 1,
    rate: 0,
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange =
    (prop: keyof defaultValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({ ...formValues, [prop]: event.target.value });
    };

  const handleChangeDate = (newValue: Date | null) => {
    setFormValues({ ...formValues, date: newValue });
  };

  const calculateInterestRate = () => {

  };

  const postLoan = async (formValues: defaultValues, borrower: string, ercAddress: string) => {
    try {
      console.log("authHeader: ", getAuthentication());
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
    const token = await kit.contracts.getStableToken(StableToken.cUSD);
    if (await postLoan(formValues, address!, token.address)) {
      takeLoanAndAcceptTerms();
    }
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
                <OutlinedInput
                  type="number"
                  value={formValues.amount}
                  onChange={handleChange("amount")}
                  startAdornment={<InputAdornment position="start">cUSD</InputAdornment>}
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <OutlinedInput
                  type="number"
                  value={5}
                  disabled={true}
                  startAdornment={<InputAdornment position="start">%</InputAdornment>}
                  label="Interest Rate"
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

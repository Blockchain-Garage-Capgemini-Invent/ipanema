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
  CardActions,
  CardContent,
  CardHeader,
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
import InfoIcon from "@mui/icons-material/Info";
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
import MarketData from "./MarketData";
import * as dotenv from "dotenv";
dotenv.config();

interface FinancialData {
  balance: number;
  averageMonthlyIncome: number;
  averageMonthlyExpenses: number;
  currency: string;
  baseInterestRate: number;
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

  const [amount, setAmount] = React.useState(1);
  const [interestRate, setInterestRate] = React.useState(0);
  const [date, setDate] = React.useState<Date | null>(
    new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
  );
  const [stableToken, setStableToken] = React.useState<StableToken>(StableToken.cUSD);
  const [financialData, setFinancialData] = React.useState<FinancialData>({
    balance: 0,
    averageMonthlyIncome: 0,
    averageMonthlyExpenses: 0,
    currency: "",
    baseInterestRate: 0,
  });
  const [loading, setLoading] = React.useState(false);

  const handleChangeAmount = (newValue: any) => {
    setAmount(newValue.target.value);
    console.log("amount", amount);
  };

  const handleChangeToken = (newValue: any) => {
    setStableToken(newValue.target.value);
  };

  const handleChangeDate = (newValue: Date | null) => {
    setDate(newValue);
  };

  useEffect(() => {
    if (!financialData.balance) {
      const fetchData = async () => {
        await getFinancialData();
      };
      fetchData().catch(console.error);
    }
  }, []);

  useEffect(() => {
    updateInterestRate();
  }, [amount, financialData.baseInterestRate, date]);

  const getFinancialData = async () => {
    // baseInterest = interest based on account history (will be taken from backend at the beginning)
    // interestRate = baseInterest + conditional Interest (will be calculated in the frontend AND in the backend)
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/financial_data", {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: getAuthentication(),
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      console.log("financial_data", data);
      setFinancialData({
        balance: data.financial_data.balance,
        averageMonthlyIncome: data.financial_data.average_monthly_income,
        averageMonthlyExpenses: data.financial_data.average_monthly_expenses,
        currency: data.financial_data.currency,
        baseInterestRate: data.base_interest_rate,
      });
    } catch (error: any) {
      console.log(error);
    }
    return financialData;
  };

  const updateInterestRate = () => {
    console.log("amount", amount);
    console.log("baseInterestRate", financialData.baseInterestRate);
    console.log("date", date);
    console.log("stableToken", stableToken);
    const loanDuration = Math.round(
      (date!.getTime() - new Date(Date.now()).getTime()) / 1000 / 60 / 60 / 24,
    );
    const interestRate = financialData.baseInterestRate + amount * 0.0001 + loanDuration * 0.001;
    console.log("Interest rate:", interestRate);
    setInterestRate(Number(interestRate.toFixed(4)));
  };

  const postLoan = async (borrower: string, ercAddress: string) => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + "/loan", {
        method: "POST",
        body: JSON.stringify({
          loanAmount: Number(amount),
          interestAmount: Number(((amount * interestRate) / 100).toFixed(4)),
          repayByTimestamp: date ? Math.round(date.getTime() / 1000) : 0,
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
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar("Error submitting loan information! Message: " + error.message, {
        variant: "error",
      });
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
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar("Error taking the loan! Message: " + error.message, { variant: "error" });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = await kit.contracts.getStableToken(stableToken);
    await postLoan(address!, token.address);
    await takeLoanAndAcceptTerms();
    setLoading(false);
  };

  return (
    <>
      <Grid sx={{ mt: 5 }} container justifyContent="center">
        <Grid item sm={6} xs={12} sx={{ mr: 2, ml: 2 }}>
          <Stack direction="row" alignItems="center" gap={2}>
            <Typography variant="h2" sx={{ fontWeight: "bold" }}>
              Get a loan from your{" "}
            </Typography>
            <Typography variant="h2" color="secondary" sx={{ fontWeight: "bold" }}>
              bank
            </Typography>
          </Stack>
          <Typography variant="body1" marginTop={3}>
            Welcome to the Ipanema DeFi borrowing platform. Here you can get DeFi loans from your
            bank in just a few seconds! These loans are currently on Celo Alfajores network.
          </Typography>
          <MarketData />
          <Card
            sx={{
              mt: 3,
              p: 3,
              borderRadius: "18px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              title={
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  Loan details
                </Typography>
              }
            ></CardHeader>
            <CardContent
              sx={{
                alignContent: "center",
              }}
            >
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  {!isMobile ? (
                    <DesktopDatePicker
                      label="Repay date"
                      inputFormat="dd/MM/yyyy"
                      value={date}
                      onChange={handleChangeDate}
                      renderInput={params => <TextField {...params} />}
                      InputProps={{ style: { borderRadius: "12px" } }}
                    />
                  ) : (
                    <MobileDatePicker
                      label="Repay date"
                      inputFormat="dd/MM/yyyy"
                      value={date}
                      onChange={handleChangeDate}
                      renderInput={params => <TextField {...params} />}
                      InputProps={{ style: { borderRadius: "12px" } }}
                    />
                  )}
                </LocalizationProvider>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel htmlFor="token">Token</InputLabel>
                <Select
                  sx={{ borderRadius: "12px" }}
                  id="token"
                  label="Token"
                  value={stableToken}
                  onChange={handleChangeToken}
                >
                  <MenuItem value={StableToken.cUSD}>cUSD</MenuItem>
                  <MenuItem value={StableToken.cEUR}>cEUR</MenuItem>
                  <MenuItem value={StableToken.cREAL}>cREAL</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel htmlFor="amount">Amount</InputLabel>
                <OutlinedInput
                  id="amount"
                  label="Amount"
                  type="number"
                  value={amount}
                  endAdornment={<InputAdornment position="end">{stableToken}</InputAdornment>}
                  onChange={handleChangeAmount}
                  error={amount <= 0}
                  sx={{ borderRadius: "12px" }}
                />
                {amount <= 0 ? (
                  <FormHelperText id="amount" error>
                    The amount must be greater than 0
                  </FormHelperText>
                ) : null}
              </FormControl>
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel htmlFor="interest-rate">Interest Rate</InputLabel>
                <OutlinedInput
                  id="interest-rate"
                  label="Interest Rate"
                  type="number"
                  value={interestRate}
                  disabled={true}
                  endAdornment={<InputAdornment position="end">%</InputAdornment>}
                  sx={{ borderRadius: "12px" }}
                />
              </FormControl>
              <Stack direction="row" alignItems="top" gap={1} marginTop={3}>
                <InfoIcon />
                <Typography variant="body1">
                  The interest rate is calculated from your financial balance and the
                  income-expenditure ratio of your account, the loan amount and the loan term.
                </Typography>
              </Stack>
              <Stack direction="column" marginTop={3}>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  Your account statistics:
                </Typography>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="body1">Balance</Typography>
                  {financialData.balance >= 0 ? (
                    <Typography variant="body1" color="green">
                      {financialData.balance} {financialData.currency}
                    </Typography>
                  ) : (
                    <Typography variant="body1" color="red">
                      {financialData.balance} {financialData.currency}
                    </Typography>
                  )}
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="body1">Average monthly income</Typography>
                  <Typography variant="body1" color="green">
                    {financialData.averageMonthlyIncome} {financialData.currency}
                  </Typography>
                </Stack>
                <Stack direction="row" alignItems="center" gap={1}>
                  <Typography variant="body1">Average monthly expenses</Typography>
                  <Typography variant="body1" color="red">
                    {financialData.averageMonthlyExpenses} {financialData.currency}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
            <CardActions sx={{ m: 1, flexDirection: "column" }}>
              <FormControl fullWidth>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  color="primary"
                  loading={loading}
                  loadingIndicator="Waiting for approval..."
                  onClick={handleSubmit}
                  sx={{ borderRadius: "12px" }}
                >
                  TAKE OUT LOAN
                </LoadingButton>
              </FormControl>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

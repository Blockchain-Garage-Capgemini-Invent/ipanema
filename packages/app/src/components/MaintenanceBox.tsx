/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      MaintenanceBox.tsx
 *      Created on: 14.06.22
 *      Author:     Tim Schmitz
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Typography,
  Stack,
  Chip,
  CardHeader,
} from "@mui/material";
import DateRangeIcon from "@mui/icons-material/DateRange";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import InfoIcon from "@mui/icons-material/Info";
import FormControl from "@mui/material/FormControl";
import { useCelo } from "@celo/react-celo";
import { StableToken } from "@celo/contractkit/lib/celo-tokens";
import deployedContracts from "@ipanema/hardhat/deployments/hardhat_contracts.json";
import { CentralizedLoan } from "@ipanema/hardhat/types/CentralizedLoan";
import { useSnackbar } from "notistack";
import { getAuthentication } from "../helpers/auth";
import { logout } from "../services/user";
import MarketData from "./MarketData";

enum LoanState {
  Offered,
  Recalled,
  Taken,
  Repaid,
  Defaulted,
}

export default function MaintenanceBox() {
  const { kit, address, network, performActions } = useCelo();
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

  const [repaymentAmount, setRepaymentAmount] = useState(0);
  const [date, setDate] = useState(new Date());
  const [ercAddress, setErcAddress] = useState("");
  const [stableToken, setStableToken] = useState<StableToken>();

  useEffect(() => {
    // You need to restrict it at some point
    // This is just dummy code and should be replaced by actual
    if (!repaymentAmount || !ercAddress) {
      getLoanInformation();
    }
  }, []);

  async function getStableToken(address: string): Promise<StableToken | null> {
    const tokens = await kit.celoTokens.getWrappers();
    for (const [symbol, token] of Object.entries(tokens)) {
      if (token.address === address) {
        return symbol as StableToken;
      }
    }
    return null;
  }

  const getLoanInformation = async () => {
    try {
      console.log("Requesting loan information");
      const loanData = await loanContract.methods.getMyLoan().call();
      console.log("Loan information: ", loanData);
      if (Number(loanData._state) !== LoanState.Taken) {
        navigate("/getloan");
      }
      const loanAmount = kit.connection.web3.utils.fromWei(loanData._loanAmount, "ether");
      const interestAmount = kit.connection.web3.utils.fromWei(loanData._interestAmount, "ether");
      setRepaymentAmount(Number(loanAmount) + Number(interestAmount));
      setDate(new Date(Number(loanData._repayByTimestamp) * 1000));
      setErcAddress(loanData._ercAddress);
      const stableToken = await getStableToken(loanData._ercAddress);
      if (!stableToken) {
        console.error("Could not find stable token for address: ", loanData._ercAddress);
        return;
      }
      setStableToken(stableToken);
    } catch (error: any) {
      console.log(error);
      navigate("/getloan");
    }
  };

  const handleSubmit = async () => {
    try {
      await performActions(async kit => {
        console.log("Approving loan contract to spend token");
        const amountToExchange = kit.connection.web3.utils.toWei(
          repaymentAmount.toString(),
          "ether",
        );
        const stableToken = await getStableToken(ercAddress);
        if (!stableToken) {
          console.error("Could not find stable token for address: ", ercAddress);
          return;
        }
        const token = await kit.contracts.getStableToken(stableToken);
        kit.connection.defaultGasPrice = 1000000000;
        const approveTx = await token!
          .approve(loanContract.options.address, amountToExchange)
          .send({ from: address as string });
        const approveReceipt = await approveTx.waitReceipt();
        console.log("Approve receipt:\n", approveReceipt);
        if (!approveReceipt.status) {
          enqueueSnackbar("Failed to approve loan contract", { variant: "error" });
          return;
        }

        // Check the allowance
        console.log("Checking allowance");
        const allowanceTx = await token!.allowance(address as string, loanContract.options.address);
        console.log("Allowance to spend", allowanceTx.toNumber());

        // Make the repayment
        console.log("Making repayment");
        const estimateGas = await loanContract.methods.repay().estimateGas();
        console.log("Estimated gas:", estimateGas);
        const repayTx = await loanContract.methods.repay().send({ from: address as string });
        console.log("Repayment:\n", repayTx);
        if (!repayTx.status) {
          enqueueSnackbar("Failed to repay loan", { variant: "error" });
          return;
        }
        enqueueSnackbar("Loan successfully repaid!", { variant: "success" });
        navigate("/getloan");
      });
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar("Failed to repay loan! Message: " + error.message, { variant: "error" });
    }
  };

  return (
    <Grid sx={{ mt: 5 }} container justifyContent="center">
      <Grid item sm={6} xs={12} sx={{ mr: 2, ml: 2 }}>
        <Stack direction="row" alignItems="center" gap={2}>
          <Typography variant="h2" sx={{ fontWeight: "bold" }}>
            Repay your{" "}
          </Typography>
          <Typography variant="h2" color="secondary" sx={{ fontWeight: "bold" }}>
            loan
          </Typography>
        </Stack>
        <Typography variant="body1" marginTop={3}>
          Thanks for using our service to get a DeFi loan from your bank.
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
            <Stack direction="column" spacing={1} justifyContent="left">
              <Chip
                icon={<DateRangeIcon />}
                label={date.toLocaleString()}
                variant="outlined"
                sx={{ width: "fit-content" }}
              />
              <Chip
                icon={<CurrencyBitcoinIcon />}
                label={repaymentAmount + " " + stableToken}
                variant="outlined"
                sx={{ width: "fit-content" }}
              />
            </Stack>
            <Stack direction="row" alignItems="top" gap={1} marginTop={3}>
              <InfoIcon />
              <Typography variant="body1">
                Please note that repaying before the deadline will result in a positive score, which
                will improve the terms of your next loan.
              </Typography>
            </Stack>
          </CardContent>
          <CardActions sx={{ m: 1, flexDirection: "column" }}>
            <FormControl fullWidth>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                onClick={handleSubmit}
                sx={{ borderRadius: "12px" }}
              >
                Make repayment
              </Button>
            </FormControl>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
}

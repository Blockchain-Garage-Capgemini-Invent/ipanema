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

import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { useCelo } from "@celo/react-celo";
import { StableToken } from "@celo/contractkit/lib/celo-tokens";
import deployedContracts from "@ipanema/hardhat/deployments/hardhat_contracts.json";
import { CentralizedLoan } from "@ipanema/hardhat/types/CentralizedLoan";
import { useSnackbar } from "notistack";

export default function MaintenanceBox() {
  const { kit, address, network, performActions } = useCelo();
  const { enqueueSnackbar } = useSnackbar();

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

  // TODO: Read from contract
  const repaymentAmount = 0;

  // const loadRepaymentAmount = async () => {
  //   try{
  //     const loanData = await loanContract.methods.getMyLoan();
  //     repaymentAmount = loanData["loanAmount"] + loanData["interestAmount"];
  //   }catch (err) {
  //     console.log(err);
  //   }
  // }

  const handleSubmit = async () => {
    try {
      await performActions(async (kit) => {
        // TODO: Make approval for the loan contract to spend the token
        // Damn, why is the kit.contracts.getErc20() missing?
        console.log("Approving loan contract to spend token");
        const amountToExchange = kit.connection.web3.utils.toWei(
          repaymentAmount.toString(),
          "ether",
        );
        // TODO: Check which token is being used (from the contract)
        const token = await kit.contracts.getStableToken(StableToken.cUSD);
        const approveTx = await token
          .approve(loanContract.options.address, amountToExchange)
          .send({ from: address as string });
        const approveReceipt = await approveTx.waitReceipt();
        console.log("Approve receipt:\n", approveReceipt);

        // Check the allowance
        console.log("Checking allowance");
        const allowanceTx = await token.allowance(address as string, loanContract.options.address);
        console.log("Allowance to spend", allowanceTx.toNumber());

        // Make the repayment
        console.log("Making repayment");
        const estimateGas = await loanContract.methods.repay().estimateGas();
        console.log("Estimated gas:", estimateGas);
        const repayTx = await loanContract.methods.repay().send({ from: address as string });
        console.log("Repayment:\n", repayTx);

        // TODO: Show notification
        enqueueSnackbar("Loan successfully repaid");
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item sm={6} xs={12} sx={{ m: 2 }}>
        <Card sx={{ mt: 5 }}>
          <CardContent>
            <Typography variant="h5">Repay your Loan</Typography>
            <Typography variant="body1">Amount: {repaymentAmount}</Typography>
            <FormControl fullWidth sx={{ m: 1 }}>
              <Button variant="contained" type="submit" color="primary" onClick={handleSubmit}>
                Make repay payment
              </Button>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

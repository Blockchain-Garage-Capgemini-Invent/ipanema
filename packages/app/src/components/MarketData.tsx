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
import { useCelo } from "@celo/react-celo";
import deployedContracts from "@ipanema/hardhat/deployments/hardhat_contracts.json";
import { CentralizedLoan } from "@ipanema/hardhat/types/CentralizedLoan";
import { useEffect, useState } from "react";
import { StableToken } from "@celo/contractkit/lib/celo-tokens";

export default function MarketData() {
  const { kit, network } = useCelo();

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

  const [loansTaken, setLoansTaken] = useState(0);
  const [loansRepaid, setLoansRepaid] = useState(0);
  const [totalAmountTakenInCeloUSD, setTotalAmountTakenInCeloUSD] = useState(0);
  const [totalAmountTakenInCeloEUR, setTotalAmountTakenInCeloEUR] = useState(0);
  const [totalAmountTakenInCeloREAL, setTotalAmountTakenInCeloREAL] = useState(0);

  // TODO: Move to separate file (duplicated in MaintenanceBox.tsx)
  async function getStableToken(address: string): Promise<StableToken | null> {
    const tokens = await kit.celoTokens.getWrappers();
    for (const [symbol, token] of Object.entries(tokens)) {
      if (token.address === address) {
        return symbol as StableToken;
      }
    }
    return null;
  }

  const getStatistics = async () => {
    try {
      console.log("Requesting statistics");
      const statisticsData = await loanContract.methods.getStatistics().call();
      console.log("Statistics data: ", statisticsData);
      setLoansTaken(Number(statisticsData._totalLoansTaken));
      setLoansRepaid(Number(statisticsData._totalLoansRepaid));
      for (let i = 0; i < statisticsData._erc20Addresses.length; i++) {
        const stableToken = await getStableToken(statisticsData._erc20Addresses[i]);
        if (!stableToken) {
          console.error(
            "Could not find stable token for address: ",
            statisticsData._erc20Addresses[i],
          );
          return;
        }
        const amount = kit.connection.web3.utils.fromWei(
          statisticsData._totalLoanAmountTaken[i],
          "ether",
        );
        switch (stableToken) {
          case StableToken.cUSD:
            setTotalAmountTakenInCeloUSD(Number(amount));
            break;
          case StableToken.cEUR:
            setTotalAmountTakenInCeloEUR(Number(amount));
            break;
          case StableToken.cREAL:
            setTotalAmountTakenInCeloREAL(Number(amount));
            break;
          default:
            console.log("Unknown stable token: ", stableToken);
        }
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loansTaken === 0) {
      const fetchData = async () => {
        await getStatistics();
      };
      fetchData().catch(console.error);
    }
  }, []);

  return (
    <Stack direction="column" marginTop={3}>
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        Market
      </Typography>
      <Typography variant="body1">
        <b>{loansTaken}</b> Loan(s) taken
      </Typography>
      <Typography variant="body1">
        <b>{loansRepaid}</b> Loan(s) repaid
      </Typography>
      <Typography variant="body1">
        <b>{loansTaken - loansRepaid}</b> Loan(s) ongoing
      </Typography>
      <Typography variant="body1">
        <b>{totalAmountTakenInCeloUSD}</b> cUSD, <b>{totalAmountTakenInCeloEUR}</b> cEUR and{" "}
        <b>{totalAmountTakenInCeloREAL}</b> cREAL in total
      </Typography>
    </Stack>
  );
}

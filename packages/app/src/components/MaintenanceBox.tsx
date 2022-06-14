import * as React from "react";
import {Button, Card, CardContent, Grid, Typography} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import {ContractKit, newKit} from "@celo/contractkit";
import {AbiItem} from "web3-utils";
import deployedContracts from "@ipanema/hardhat/deployments/hardhat_contracts.json";
import { CentralizedLoan } from "@ipanema/hardhat/types/CentralizedLoan";

const privateKey = "959a7b54e849bafce5b40b1c6645d1b8b8b4b7557f1b9a8d8de7630d7a85cbb2";
const address = "0x6c87D48da426993ca8Eb3e8cD432CCCBD61c8cDc";
const kit: ContractKit = newKit("https://alfajores-forno.celo-testnet.org");

export default function MaintenanceBox() {

    var repaymentAmount;

    const handleSubmit = async () => {
        kit.defaultAccount = address;
        kit.connection.addAccount(privateKey);
        const contracts = deployedContracts["44787"][0].contracts;
        const contract = new kit.connection.web3.eth.Contract(
            contracts?.CentralizedLoan.abi as AbiItem[] | AbiItem,
            contracts?.CentralizedLoan.address
        ) as any as CentralizedLoan;
        await contract.methods.repay().send({ from: address });
    };

    return(
        <Grid sx={{ m: 1 }} container justifyContent="center">
            <Grid item sm={6} xs={12} sx={{ m: 2 }}>
                <Card sx={{ mt: 5 }}>
                    <CardContent>
                        <Typography variant="h5">Repay your Loan</Typography>
                        <Typography variant="body1">
                            Amount: {repaymentAmount}
                        </Typography>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Make repay payment
                            </Button>
                        </FormControl>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

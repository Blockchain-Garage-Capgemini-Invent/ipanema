import {Button, Card, CardContent, Grid, Typography} from "@mui/material";
import FormControl from "@mui/material/FormControl";
import { useCelo } from "@celo/react-celo";

export default function ConnectWallet() {

    const { address, network, connect, destroy } = useCelo();

    const handleSubmit = async () => {
        try {
            // TODO: what happens when connected
            connect().catch((e) => console.log(e));
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Grid sx={{ m: 1 }} container justifyContent="center">
            <Grid item sm={6} xs={12} sx={{ m: 2 }}>
                <Card sx={{ mt: 5 }}>
                    <CardContent>
                        <Typography variant="h5">Connect your Wallet</Typography>
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <Button
                                variant="contained"
                                type="submit"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Choose Wallet
                            </Button>
                        </FormControl>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

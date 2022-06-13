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
  time: Date | null;
  amount: number;
  interestRate: number;
}

export default function LoanBox() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [values, setValues] = React.useState<State>({
    time: new Date(Date.now()),
    amount: 0,
    interestRate: 0,
  });

  const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleChangeTime = (newValue: Date | null) => {
    setValues({ ...values, time: newValue });
  };

  const handleSubmit = () => {
    console.log(values);
  };

  return (
    <>
      <Grid sx={{ m: 1 }} container justifyContent="center">
        <Grid item sm={6} xs={12} sx={{ m: 2 }}>
          <Typography variant="h3">Get a loan from your bank</Typography>
          <Typography variant="body1">
            Welcome to the Ipanema DeFi borrowing platform. Here you can get
            DeFi loans from your bank in just a few minutes! These loans are
            currently on Celo network.
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
                        value={values.time}
                        onChange={handleChangeTime}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    ) : (
                      <MobileDatePicker
                        label="Repay date"
                        inputFormat="dd/MM/yyyy"
                        value={values.time}
                        onChange={handleChangeTime}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    )}
                  </Stack>
                </LocalizationProvider>
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-amount">
                  Amount
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  type="number"
                  value={values.amount}
                  onChange={handleChange("amount")}
                  startAdornment={
                    <InputAdornment position="start">cUSD</InputAdornment>
                  }
                  label="Amount"
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel htmlFor="outlined-adornment-interest-rate">
                  Interest Rate
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-interest-rate"
                  type="number"
                  value={values.interestRate}
                  onChange={handleChange("interestRate")}
                  startAdornment={
                    <InputAdornment position="start">%</InputAdornment>
                  }
                  label="Interest Rate"
                />
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
                <Button
                  variant="contained"
                  type="submit"
                  color="primary"
                  onClick={handleSubmit}
                >
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

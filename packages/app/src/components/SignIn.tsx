/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      SignIn.tsx
 *      Created on: 20.06.22
 *      Author:     Volker Dufner
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Box, FormControl, Grid, Link, TextField, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useSnackbar } from "notistack";
import { login } from "../services/user";

interface defaultValues {
  email: string;
  password: string;
}

export default function SignIn() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [formValues, setFormValues] = React.useState<defaultValues>({
    email: "max.muster@capgemini.com",
    password: "12345678",
  });
  const [loading, setLoading] = React.useState(false);

  const handleChange =
    (prop: keyof defaultValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues({ ...formValues, [prop]: event.target.value });
    };

  const handleSubmit = async () => {
    setLoading(true);
    const success = await login(formValues.email, formValues.password);
    setLoading(false);
    if (!success) {
      enqueueSnackbar("Login failed", { variant: "error" });
      return;
    }
    navigate("/connect");
  };

  return (
    <Grid sx={{ m: 1 }} container justifyContent="center">
      <Grid item sm={3} xs={12} sx={{ m: 2 }}>
        <Box
          sx={{
            mt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h3">Ipanema Demo Bank</Typography>
          <Typography variant="body1">Please log in to your online banking account</Typography>
          <Avatar sx={{ m: 3, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <FormControl fullWidth sx={{ m: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              name="email"
              label="Email Address"
              type="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
              value={formValues.email}
              onChange={handleChange("email")}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              value={formValues.password}
              onChange={handleChange("password")}
            />
          </FormControl>
          <FormControl fullWidth sx={{ m: 1 }}>
            <LoadingButton
              variant="contained"
              type="submit"
              color="primary"
              loading={loading}
              loadingIndicator="Waiting for authentication..."
              onClick={handleSubmit}
            >
              Sign In
            </LoadingButton>
          </FormControl>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

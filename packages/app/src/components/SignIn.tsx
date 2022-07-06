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
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  Link,
  OutlinedInput,
  Typography,
} from "@mui/material";
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
    email: "max.muster@ipanema.com",
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
    <>
      <Grid sx={{ mt: 5 }} container justifyContent="center">
        <Grid item sm={6} xs={12} sx={{ mr: 2, ml: 2 }}>
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
                <Typography variant="h3" align="center" sx={{ fontWeight: "bold" }}>
                  Ipanema Demo Bank
                </Typography>
              }
            ></CardHeader>
            <CardContent
              sx={{
                alignContent: "center",
              }}
            >
              <Box display="flex" justifyContent="center" alignItems="center">
                <Avatar sx={{ bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
              </Box>
              <Typography variant="body1" align="center" marginTop={3}>
                Please log in to your online banking account
              </Typography>
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <OutlinedInput
                  id="email"
                  type="email"
                  label="Email Address"
                  autoFocus
                  autoComplete="email"
                  required={true}
                  value={formValues.email}
                  onChange={handleChange("email")}
                  sx={{ borderRadius: "12px" }}
                />
              </FormControl>
              <FormControl fullWidth sx={{ mt: 3 }}>
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  required={true}
                  value={formValues.password}
                  onChange={handleChange("password")}
                  sx={{ borderRadius: "12px" }}
                />
              </FormControl>
            </CardContent>
            <CardActions sx={{ m: 1, flexDirection: "column" }}>
              <FormControl fullWidth>
                <LoadingButton
                  variant="contained"
                  type="submit"
                  color="primary"
                  loading={loading}
                  loadingIndicator="Waiting for authentication..."
                  onClick={handleSubmit}
                  sx={{ borderRadius: "12px" }}
                >
                  Sign In
                </LoadingButton>
              </FormControl>
              <Grid container marginTop={1}>
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
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

import { useCelo } from "@celo/react-celo";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Button, Link, Typography } from "@mui/material";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useThemeContext } from "../contexts/userTheme";
import Logo from "./images/ipanema-logo.png";

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(38)}`;
}

function AccountDetails() {
  const { address, network, connect, destroy } = useCelo();

  return (
    <>
      {address && network && network.name !== "Alfajores" ? (
        <Typography style={{ color: "red" }}>
          {network.name} is not supported, please switch to Alfajores!
        </Typography>
      ) : (
        ""
      )}
      {address ? (
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => destroy().catch(e => console.log(e))}
          sx={{ borderRadius: "12px" }}
        >
          Disconnect {truncateAddress(address)}
        </Button>
      ) : (
        <Button
          color="inherit"
          variant="outlined"
          onClick={() => connect().catch(e => console.log(e))}
          sx={{ borderRadius: "12px" }}
        >
          Connect wallet
        </Button>
      )}
    </>
  );
}

export default function Header() {
  const { theme: themeContext, setTheme } = useThemeContext();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="default">
        <Toolbar sx={{ gap: { md: 2, xs: 0.5 } }}>
          <Link href="/">
            <img src={Logo} alt="ipanema logo" style={{ height: "35px" }} />
          </Link>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" color="inherit" underline="none">
              Ipanema Finance
            </Link>
          </Typography>
          <AccountDetails />
          <ThemeSwitcher
            sx={{ m: 1 }}
            onChange={e => setTheme(e.target.checked)}
            checked={themeContext}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

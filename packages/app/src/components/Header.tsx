import { useCelo } from "@celo/react-celo";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {Box, Button, Link, Typography,} from "@mui/material";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useThemeContext } from "../contexts/userTheme";

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
        <Button variant="outlined" color="inherit" onClick={destroy}>
          Disconnect {truncateAddress(address)}
        </Button>
      ) : (
        <Button
          color="inherit"
          variant="outlined"
          onClick={() => connect().catch(e => console.log(e))}
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
      <AppBar position="static">
        <Toolbar sx={{ gap: { md: 2, xs: 0.5 } }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/" color="inherit" underline="none">Ipanema Finance</Link>
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

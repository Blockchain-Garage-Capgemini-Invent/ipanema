import { useCelo } from "@celo/react-celo";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Typography, Button } from "@mui/material";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { useThemeContext } from "../contexts/userTheme";

export function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(38)}`;
}

function AccountDetails() {
  const { address, network, connect, destroy } = useCelo();

  return (
    <>
      {network && network.name !== "Alfajores" ? (
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
          onClick={() => connect().catch((e) => console.log(e))}
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
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ background: "transparent", boxShadow: "none" }}>
          <Toolbar sx={{ gap: { md: 2, xs: 0.5 } }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Ipanema Finance
            </Typography>
            <AccountDetails />
            <ThemeSwitcher
              sx={{ m: 1 }}
              onChange={(e) => setTheme(e.target.checked)}
              checked={themeContext}
            />
          </Toolbar>
        </AppBar>
      </Box>
    </>

    // <div>
    //     <nav class="Navigation">
    //         <ul>
    //             {/* --- --- --- --- --- Header + Space --- --- --- --- --- */}
    //             <li><div class="HeaderTitle">Ipanema</div></li>

    //             {/* --- --- --- --- --- Platform Select + Space --- --- --- --- --- */}
    //             <li><button class="PlatformButton">
    //                 <ul>
    //                     <li><img alt="ETH" src={require('./images/ethereumlogo.png')} width="25" height="25" class="PlatformButtonImage"/></li>
    //                     <li><div class="PlatformButtonText">Ethereum Mainnet</div></li>
    //                     <li><svg height="20" width="20"><polyline points="6 9 12 15 18 9"></polyline></svg></li>
    //                 </ul>
    //                 </button>
    //             </li>

    //             {/* --- --- --- --- --- Wallet Select + Space --- --- --- --- --- */}
    //             <li>{address ? (<button class="WalletButton">Connected to {address}</button>) :
    //             (<button onClick={connect} class="WalletButton">Connect wallet</button>)}</li>
    //         </ul>
    //     </nav>
    //     <hr class="HorizontalLine"/>
    // </div>
  );
}

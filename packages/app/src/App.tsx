import { CustomThemeProvider } from "./contexts/userTheme";
import { BrowserRouter as BrowserRouter, Route, Routes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { CeloProvider } from "@celo/react-celo";
import "@celo/react-celo/lib/styles.css";
import Header from "./components/Header";
import LoanBox from "./components/LoanBox";
import ConnectWallet from "./components/ConnectWallet";
import MaintenanceBox from "./components/MaintenanceBox";
import SignIn from "./components/SignIn";
// import Footer from "./components/Footer";

export default function App() {
  return (
    <CustomThemeProvider>
      <SnackbarProvider>
        <CeloProvider
          dapp={{
            name: "Ipanema DApp",
            description: "A demo DApp to showcase functionality",
            url: "",
            icon: "",
          }}
        >
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<SignIn />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/connect" element={<ConnectWallet />} />
              <Route path="/getloan" element={<LoanBox />} />
              <Route path="/maintenance" element={<MaintenanceBox />} />
            </Routes>
          </BrowserRouter>
        </CeloProvider>
      </SnackbarProvider>
    </CustomThemeProvider>
  );
}

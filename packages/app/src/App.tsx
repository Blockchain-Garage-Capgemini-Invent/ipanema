import { CustomThemeProvider } from "./contexts/userTheme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CeloProvider } from "@celo/react-celo";
import "@celo/react-celo/lib/styles.css";
import Header from "./components/Header";
// import LoanBox from "./components/LoanBox";
import MaintenanceBox from "./components/MaintenanceBox";
import Footer from "./components/Footer";

/*
function CheckAccount() {
    const { address, network, connect, destroy } = useCelo();

    return (
        <>address ? (<LoanBox />) : (<MaintenanceBox />)}</>
    );
}
 */

export default function App() {
  return (
    <CustomThemeProvider>
      <CeloProvider
        dapp={{
          name: "Ipanema DApp",
          description: "A demo DApp to showcase functionality",
          url: "",
          icon: "",
        }}
      >
        <Router>
          <Header />
          <Routes>
            {/*<Route path="/" element={<LoanBox />} />*/}
            <Route path="/" element={<MaintenanceBox />} />
          </Routes>
          <Footer />
        </Router>
      </CeloProvider>
    </CustomThemeProvider>
  );
}

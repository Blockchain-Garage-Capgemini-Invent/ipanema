import { CustomThemeProvider } from "./contexts/userTheme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { CeloProvider } from "@celo/react-celo";
import "@celo/react-celo/lib/styles.css";
import Header from "./components/Header";
import LoanBox from "./components/LoanBox";
import Footer from "./components/Footer";

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
            <Route path="/" element={<LoanBox />} />
          </Routes>
          <Footer />
        </Router>
      </CeloProvider>
    </CustomThemeProvider>
  );
}

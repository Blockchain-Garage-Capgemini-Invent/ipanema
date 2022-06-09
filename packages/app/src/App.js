import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';

import Header from './components/Header'
import LoanBox from './components/LoanBox'
import Footer from './components/Footer'

function App() {
    return(
        <Router>
            <Header />
            <Routes>
                <Route path='/' element={<LoanBox />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default App;

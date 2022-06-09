import './LoanBox.css'

function LoanBox() {
    return(
    <div class="LoanBoxBackground">
        {/* --- --- --- --- --- Header Element --- --- --- --- --- */}
        <div class="LoanBoxHeader">
            <h2 class="LoanBoxHeaderText">Get a loan from your bank</h2>
        </div>
        
        {/* --- --- --- --- --- Time Element --- --- --- --- --- */}
        <div class="LoanBoxElement">
            <div class="LoanBoxElementTitle">Time Range</div>
            <div class="LoanBoxElementTime"><tr>
                    <td class="LoanBoxElementTimeInfo">{30} Days</td>
                    <td><input type="range" id="slider" class="LoanBoxElementTimeInputRange" min="1" max="100" step="1"></input></td>
            </tr></div>
        </div>
        
        {/* --- --- --- --- --- Amount Element --- --- --- --- --- */}
        <div class="LoanBoxElement">
            <tr>
                <td><div class="LoanBoxElementTitle">Amount</div></td>
                <td><button class="LoanBoxElementAmountChooseButton">cEUR</button></td>
            </tr>
            <input inputmode="decimal" autocomplete="off" autocorrect="off" type="text" pattern="^[0-9]*[.,]?[0-9]*$" placeholder="0" min="0" minlength="1" maxlength="79" spellcheck="false" class="LoanBoxElementAmountEditText" />
            <div class="LoanBoxElementAmountInfoText">max. $100,000</div>
        </div>
        
        {/* --- --- --- --- --- Interest Rate Element --- --- --- --- --- */}
        <div class="LoanBoxElement">
            <div class="LoanBoxElementTitle">Interest Rate</div>
            <div class="LoanBoxElementTextField">{5}%</div>
        </div>
        
       {/* --- --- --- --- --- Button --- --- --- --- --- */}
        <button class="LoanBoxButtonElement">
            Get Loan!
        </button>
    </div>
    );
}

export default LoanBox


















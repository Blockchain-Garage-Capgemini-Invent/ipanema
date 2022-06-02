//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract BasicLoan{
    struct Terms {
        uint256 loanAmount;
        uint256 interestAmount;
        uint256 repayByTimestamp;
    }

    Terms public terms;

    enum LoanState {Created, Funded, Taken}
    LoanState public state;

    modifier onlyInState(LoanState expectedState) {
        require(state == expectedState, "Not allowed in this state");
        _;
    }

    constructor(uint256 _loanAmount, uint256 _interestAmount, uint256 _repayByTimestamp) {
        terms.loanAmount = _loanAmount;
        terms.interestAmount = _interestAmount;
        terms.repayByTimestamp = _repayByTimestamp;
        lender = payable(msg.sender);
        state = LoanState.Created;
    }

    address payable public lender;
    address payable public borrower;

    function fundLoan() public payable onlyInState(LoanState.Created) {
        state = LoanState.Funded;
        require(msg.value == terms.loanAmount, "fund the loan according to the loan Amount");
    }

    function takeLoanAndAcceptTerms()
        public
        onlyInState(LoanState.Funded)
    {
        borrower = payable(msg.sender);
        state = LoanState.Taken;
        payable(borrower).transfer(terms.loanAmount);
    }

    function repay() public payable onlyInState(LoanState.Taken) {
        require(msg.sender == borrower, "Only the borrower can repay the loan");
        require(msg.value == terms.loanAmount + terms.interestAmount, "repay loan and interest");
        payable(lender).transfer(terms.loanAmount + terms.interestAmount);
        selfdestruct(borrower);
    }

    function liquidate() public onlyInState(LoanState.Taken) {
        require(msg.sender == lender, "Only the lender can liquidate the loan");
        require(block.timestamp > terms.repayByTimestamp, "Cannot liquidate before the loan is due");
        selfdestruct(lender);
    }
}
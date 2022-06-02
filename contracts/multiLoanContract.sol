//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract BasicLoan{
    enum LoanState {Created, Funded, Taken}

    struct Terms {
        uint256 loanAmount;
        uint256 interestAmount;
        uint256 repayByTimestamp;
        enum loanState;
    }

    mapping(address => Terms) public loans;
    address[] public customers;

    modifier onlyInState(LoanState expectedState) {
        require(loans[msg.sender].loanState == expectedState, "Not allowed in this state");
        _;
    }

    constructor() {
        lender = payable(msg.sender);
    }

    address payable public lender;
    
    function offerLoan(uint256 _loanAmount, uint256 _interestAmount, uint256 _repayByTimestamp, address _borrower) 
    public
    payable
    onlyInState(LoanState.Created) 
    {
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
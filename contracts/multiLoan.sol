//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract BasicLoan{
    enum LoanState {Offered, Taken, Repayed, Defaulted}

    struct Loans {
        bool isCustomer;
        address borrower;
        uint256 loanAmount;
        uint256 interestAmount;
        uint256 repayByTimestamp;
        LoanState state;
    }

    mapping(address => Loans) public loans;
    address[] public customers;

    modifier onlyInState(LoanState expectedState) {
        require(loans[msg.sender].state == expectedState, "Not allowed in this state");
        _;
    }

    constructor() {
        lender = payable(msg.sender);
    }

    address payable public lender;
    
    function offerLoan(uint256 _loanAmount, uint256 _interestAmount, uint256 _repayByTimestamp, address _borrower) 
    public
    payable
    {
        require(!loans[_borrower].isCustomer, "You already have been offered a loan.");
        customers.push(_borrower);
        loans[_borrower].isCustomer = true;
        loans[_borrower].loanAmount = _loanAmount;
        loans[_borrower].interestAmount = _interestAmount;
        loans[_borrower].repayByTimestamp = _repayByTimestamp;
        loans[_borrower].state = LoanState.Offered;
        require(msg.value == _loanAmount, "fund the loan according to the loan Amount");
    }

    function takeLoanAndAcceptTerms()
    public
    onlyInState(LoanState.Offered)
    {
        require(loans[msg.sender].isCustomer, "No loan has been offered to you.");
        require(loans[msg.sender].state == LoanState.Offered, "You have already taken your loan.");
        loans[msg.sender].state = LoanState.Taken;
        payable(msg.sender).transfer(loans[msg.sender].loanAmount);
    }

    function repay() 
    public
    payable
    onlyInState(LoanState.Taken)
    {
        require(loans[msg.sender].isCustomer, "No loan has been offered to you.");
        require(loans[msg.sender].state == LoanState.Taken, "There is no loan open with your address.");
        require(msg.value == loans[msg.sender].loanAmount + loans[msg.sender].interestAmount, "Repay loan and interest");
        payable(lender).transfer(loans[msg.sender].loanAmount + loans[msg.sender].interestAmount);
        loans[msg.sender].state = LoanState.Repayed;
        loans[msg.sender].isCustomer = false;

    }

    function liquidate(address _borrower) public onlyInState(LoanState.Taken) {
        require(block.timestamp > loans[_borrower].repayByTimestamp, "Cannot liquidate before the loan is due");
        loans[msg.sender].state = LoanState.Defaulted;
    }
}
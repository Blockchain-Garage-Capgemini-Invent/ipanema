//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.6/contracts/token/ERC20/IERC20.sol";

contract BasicLoan{
    struct Terms {
        address ercAddress;
        uint256 loanAmount;
        uint256 interestAmount;
        uint256 repayByTimestamp;
    }

    Terms public terms;

    event Deposit(
        uint _value
    );

    event Allowance(
        uint _value
    );

    enum LoanState {Created, Funded, Taken, Defaulted}
    LoanState public state;

    modifier onlyInState(LoanState expectedState) {
        require(state == expectedState, "Not allowed in this state");
        _;
    }

    constructor(uint256 _loanAmount, uint256 _interestAmount, uint256 _repayByTimestamp, address _ercAddress) {
        terms.loanAmount = _loanAmount;
        terms.interestAmount = _interestAmount;
        terms.repayByTimestamp = _repayByTimestamp;
        terms.ercAddress = _ercAddress;
        lender = payable(msg.sender);
        state = LoanState.Created;
    }

    address payable public lender;
    address payable public borrower;


    function fundLoan() public payable onlyInState(LoanState.Created) {
        state = LoanState.Funded;
        require(
            IERC20(terms.ercAddress).allowance(msg.sender, address(this)) >= terms.loanAmount, 
            "Insuficient Allowance"
        );
        require(
            IERC20(terms.ercAddress).transferFrom(msg.sender,address(this), terms.loanAmount), 
            "transfer Failed"
        );
    }

    function takeLoanAndAcceptTerms()
        public
        onlyInState(LoanState.Funded)
    {
        borrower = payable(msg.sender);
        state = LoanState.Taken;
        //require borrower to recieve the funds
        require(
            // transfer the specified token from this contract to msg.sender
            IERC20(terms.ercAddress).transfer(borrower, terms.loanAmount),
            "Lending cUSD to borrower failed."
        );
    }

    function repay() public payable onlyInState(LoanState.Taken) {
        require(msg.sender == borrower, "Only the borrower can repay the loan");
        //require borrower to send the funds
        require(
            IERC20(terms.ercAddress).allowance(msg.sender, address(this)) >= terms.loanAmount + terms.interestAmount, 
            "Insuficient Allowance"
        );
        require(
            IERC20(terms.ercAddress).transferFrom(msg.sender, 
                address(this), 
                terms.loanAmount + terms.interestAmount),
            "Payment of borrower failed."
        );
        //require lender to recieve the funds
        require(
            // transfer the specified token from this contract to msg.sender
            IERC20(terms.ercAddress).transfer(lender, terms.loanAmount + terms.interestAmount),
            "Repay cUSD to lender failed."
        );
    }

    function liquidate() public onlyInState(LoanState.Taken) {
        require(msg.sender == lender, "Only the lender can liquidate the loan");
        require(block.timestamp > terms.repayByTimestamp, "Cannot liquidate before the loan is due");
        state = LoanState.Defaulted;
    }
}
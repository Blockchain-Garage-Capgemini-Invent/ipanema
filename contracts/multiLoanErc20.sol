//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.6/contracts/token/ERC20/IERC20.sol";

contract CentralizedLoan{
    enum LoanState {Offered, Taken, Repayed, Defaulted}

    struct Loans {
        bool isCustomer;
        address borrower;
        address ercAddress;
        uint256 loanAmount;
        uint256 interestAmount;
        uint256 repayByTimestamp;
        LoanState state;
    }

    mapping(address => Loans) public loans;
    address[] public customers;

    event LoanOffered(
        address _borrower,
        uint256 _loanAmount,
        uint256 _interestAmount,
        uint256 _repayByTimestamp,
        address _ercAddress
    );

    event LoanTaken(
        address _borrower,
        uint256 _loanAmount,
        uint256 _interestAmount,
        uint256 _repayByTimestamp,
        address _ercAddress
    );

    event LoanRepaid(
        address _borrower,
        uint256 _loanAmount,
        uint256 _interestAmount,
        uint256 _repayByTimestamp,
        address _ercAddress
    );

    event LoanDefaulted(
        address _borrower,
        uint256 _loanAmount,
        uint256 _interestAmount,
        uint256 _repayByTimestamp,
        address _ercAddress
    );

    modifier onlyInState(LoanState expectedState) {
        require(loans[msg.sender].state == expectedState, "Not allowed in this state");
        _;
    }

    constructor() {
        lender = payable(msg.sender);
    }

    address payable public lender;
    
    function offerLoan(
        uint256 _loanAmount, 
        uint256 _interestAmount, 
        uint256 _repayByTimestamp, 
        address _borrower, 
        address _ercAddress
    ) 
    public
    payable
    {
        require(!loans[_borrower].isCustomer, "You already have been offered a loan.");
        require(
            IERC20(loans[_borrower].ercAddress).allowance(msg.sender, address(this)) >= loans[_borrower].loanAmount, 
            "Insuficient Allowance"
        );
        require(
            IERC20(loans[_borrower].ercAddress).transferFrom(msg.sender,address(this), loans[_borrower].loanAmount), 
            "Loan Funding Failed"
        );
        customers.push(_borrower);
        loans[_borrower].isCustomer = true;
        loans[_borrower].loanAmount = _loanAmount;
        loans[_borrower].interestAmount = _interestAmount;
        loans[_borrower].repayByTimestamp = _repayByTimestamp;
        loans[_borrower].ercAddress = _ercAddress;
        loans[_borrower].state = LoanState.Offered;
    }

    function takeLoanAndAcceptTerms()
    public
    onlyInState(LoanState.Offered)
    {
        require(loans[msg.sender].isCustomer, "No loan has been offered to you.");
        require(loans[msg.sender].state == LoanState.Offered, "You have already taken your loan.");
        loans[msg.sender].state = LoanState.Taken;
        //require borrower to recieve the funds
        require(
            // transfer the specified token from this contract to msg.sender
            IERC20(loans[msg.sender].ercAddress).transfer(msg.sender, loans[msg.sender].loanAmount),
            "Lending ERC20 Token to borrower failed."
        );
    }

    function repay() 
    public
    payable
    onlyInState(LoanState.Taken)
    {
        require(loans[msg.sender].isCustomer, "No loan has been offered to you.");
        require(loans[msg.sender].state == LoanState.Taken, "There is no loan open with your address.");
        require(
            IERC20(loans[msg.sender].ercAddress).allowance(msg.sender, address(this)) >= loans[msg.sender].loanAmount + loans[msg.sender].interestAmount, 
            "Insuficient Allowance"
        );
        require(
            IERC20(loans[msg.sender].ercAddress).transferFrom(msg.sender, 
                address(lender), 
                loans[msg.sender].loanAmount + loans[msg.sender].interestAmount),
            "Payment of borrower to lender failed."
        );
        loans[msg.sender].state = LoanState.Repayed;
        loans[msg.sender].isCustomer = false;
    }

    function liquidate(address _borrower) public onlyInState(LoanState.Taken) {
        require(block.timestamp > loans[_borrower].repayByTimestamp, "Cannot liquidate before the loan is due");
        loans[_borrower].state = LoanState.Defaulted;
    }
}
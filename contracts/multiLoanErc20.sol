//SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.6/contracts/token/ERC20/IERC20.sol";

contract CentralizedLoan{
    enum LoanState {Offered, Recalled, Taken, Repayed, Defaulted}

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

    event LoanRecalled(
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
        require(msg.sender == lender, "Only the lender can offer a loan");
        require(!loans[_borrower].isCustomer, "This customer has already been offered a loan");
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
        emit LoanOffered(
            _borrower,
            _loanAmount,
            _interestAmount,
            _repayByTimestamp,
            _ercAddress
        );
    }

    function recallOffer(address _borrower) 
    public 
    onlyInstate(LoanState.Offered)
    {
        require(msg.sender == lender, "Only the lender can recall an offer");
        require(loans[_borrower].isCustomer, "No loan is currently offered to the borrower specified");
        require(
            IERC20(loans[_borrower].ercAddress).transfer(address(msg.sender), loans[_borrower].loanAmount), 
            "Loan Recall Failed"
        );
        loans[_borrower].state = LoanState.Recalled;
        loans[_borrower].isCustomer = false;
        emit LoanRecalled(
            _borrower,
            loans[_borrower].loanAmount,
            loans[_borrower].interestAmount,
            loans[_borrower].repayByTimestamp,
            loans[_borrower].ercAddress
        );
    }

    function takeLoanAndAcceptTerms()
    public
    onlyInState(LoanState.Offered)
    {
        require(loans[msg.sender].isCustomer, "No loan has been offered to you.");
        loans[msg.sender].state = LoanState.Taken;
        //require borrower to recieve the funds
        require(
            // transfer the specified token from this contract to msg.sender
            IERC20(loans[msg.sender].ercAddress).transfer(msg.sender, loans[msg.sender].loanAmount),
            "Lending ERC20 Token to borrower failed."
        );
        emit LoanTaken(
            msg.sender,
            loans[msg.sender].loanAmount,
            loans[msg.sender].interestAmount,
            loans[msg.sender].repayByTimestamp,
            loans[msg.sender].ercAddress
        );
    }

    function repay() 
    public
    payable
    onlyInState(LoanState.Taken)
    {
        require(loans[msg.sender].isCustomer, "No loan has been offered to you.");
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
        emit LoanRepaid(
            msg.sender,
            loans[msg.sender].loanAmount,
            loans[msg.sender].interestAmount,
            loans[msg.sender].repayByTimestamp,
            loans[msg.sender].ercAddress
        );
    }

    function liquidate(address _borrower) public onlyInState(LoanState.Taken) {
        require(msg.sender == borrower, "Only the lender can liquidate the loan");
        require(block.timestamp > loans[_borrower].repayByTimestamp, "Cannot liquidate before the loan is due");
        loans[_borrower].state = LoanState.Defaulted;
        emit LoanDefaulted(
            _borrower,
            loans[_borrower].loanAmount,
            loans[_borrower].interestAmount,
            loans[_borrower].repayByTimestamp,
            loans[_borrower].ercAddress
        );
    }
}
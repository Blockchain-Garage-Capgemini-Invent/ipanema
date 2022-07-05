//  SPDX-License-Identifier: MIT
/*   ____                                 _       _   ___                      _
 *  / ___|__ _ _ __   __ _  ___ _ __ ___ (_)_ __ (_) |_ _|_ ____   _____ _ __ | |_
 * | |   / _` | '_ \ / _` |/ _ \ '_ ` _ \| | '_ \| |  | || '_ \ \ / / _ \ '_ \| __|
 * | |__| (_| | |_) | (_| |  __/ | | | | | | | | | |  | || | | \ V /  __/ | | | |_
 *  \____\__,_| .__/ \__, |\___|_| |_| |_|_|_| |_|_| |___|_| |_|\_/ \___|_| |_|\__|
 *            |_|    |___/
 **********************************************************************************
 *      index.ts
 *      Created on: 08.06.22
 *      Author:     Jonas Engelhardt
 *      Copyright (c) 2022 Capgemini Invent. All rights reserved.
 **********************************************************************************
 */

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CentralizedLoan {
  enum LoanState {
    Offered,
    Recalled,
    Taken,
    Repaid,
    Defaulted
  }

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

  struct Statistics {
    uint256 totalLoansTaken;
    uint256 totalLoansRepaid;
    uint256 totalLoansLiquidated;
    mapping(address => uint256) totalAmountTaken;
    mapping(address => uint256) totalAmountRepaid;
    mapping(address => uint256) totalAmountLiquidated;
    address[] erc20Addresses;
  }

  Statistics public statistics;

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
  ) public payable {
    require(msg.sender == lender, "Only the lender can offer a loan");
    require(!loans[_borrower].isCustomer, "This customer has already been offered a loan");
    require(
      IERC20(_ercAddress).allowance(address(msg.sender), address(this)) >= _loanAmount,
      "Insuficient Allowance"
    );
    require(
      IERC20(_ercAddress).transferFrom(address(msg.sender), address(this), _loanAmount),
      "Loan Funding Failed"
    );
    customers.push(_borrower);
    loans[_borrower].isCustomer = true;
    loans[_borrower].loanAmount = _loanAmount;
    loans[_borrower].interestAmount = _interestAmount;
    loans[_borrower].repayByTimestamp = _repayByTimestamp;
    loans[_borrower].ercAddress = _ercAddress;
    loans[_borrower].state = LoanState.Offered;
    emit LoanOffered(_borrower, _loanAmount, _interestAmount, _repayByTimestamp, _ercAddress);
  }

  function recallOffer(address _borrower) public {
    require(msg.sender == lender, "Only the lender can recall an offer");
    require(loans[_borrower].isCustomer, "No loan is currently offered to the borrower specified");
    //check loan state manually since it seens to ahve to be unique
    require(loans[_borrower].state == LoanState.Offered, "The loan is not in the offered state");
    require(
      IERC20(loans[_borrower].ercAddress).transfer(
        address(msg.sender),
        loans[_borrower].loanAmount
      ),
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

  function getLoan(address _borrower)
    public
    view
    returns (
      uint256 _loanAmount,
      uint256 _interestAmount,
      uint256 _repayByTimestamp,
      address _ercAddress,
      LoanState _state
    )
  {
    require(msg.sender == lender, "Only the lender can call this function");
    require(loans[_borrower].isCustomer, "No loan is currently offered to the borrower specified");
    return (
      loans[_borrower].loanAmount,
      loans[_borrower].interestAmount,
      loans[_borrower].repayByTimestamp,
      loans[_borrower].ercAddress,
      loans[_borrower].state
    );
  }

  function getMyLoan()
    public
    view
    returns (
      uint256 _loanAmount,
      uint256 _interestAmount,
      uint256 _repayByTimestamp,
      address _ercAddress,
      LoanState _state
    )
  {
    require(loans[msg.sender].isCustomer, "No loan is currently offered to you");
    return (
      loans[msg.sender].loanAmount,
      loans[msg.sender].interestAmount,
      loans[msg.sender].repayByTimestamp,
      loans[msg.sender].ercAddress,
      loans[msg.sender].state
    );
  }

  function takeLoanAndAcceptTerms() public onlyInState(LoanState.Offered) {
    require(loans[msg.sender].isCustomer, "No loan has been offered to you.");
    loans[msg.sender].state = LoanState.Taken;
    //require borrower to receive the funds
    require(
      // transfer the specified token from this contract to msg.sender
      IERC20(loans[msg.sender].ercAddress).transfer(msg.sender, loans[msg.sender].loanAmount),
      "Lending ERC20 Token to borrower failed."
    );
    bool found = false;
    for (uint256 i = 0; i < statistics.erc20Addresses.length; i++) {
      if (statistics.erc20Addresses[i] == loans[msg.sender].ercAddress) {
        found = true;
        break;
      }
    }
    if (!found) {
      statistics.erc20Addresses.push(loans[msg.sender].ercAddress);
    }
    statistics.totalAmountTaken[loans[msg.sender].ercAddress] += loans[msg.sender].loanAmount;
    statistics.totalLoansTaken++;
    emit LoanTaken(
      msg.sender,
      loans[msg.sender].loanAmount,
      loans[msg.sender].interestAmount,
      loans[msg.sender].repayByTimestamp,
      loans[msg.sender].ercAddress
    );
  }

  function repay() public payable onlyInState(LoanState.Taken) {
    require(loans[msg.sender].isCustomer, "No loan has been offered to you.");
    require(
      IERC20(loans[msg.sender].ercAddress).allowance(msg.sender, address(this)) >=
        loans[msg.sender].loanAmount + loans[msg.sender].interestAmount,
      "Insuficient Allowance"
    );
    require(
      IERC20(loans[msg.sender].ercAddress).transferFrom(
        msg.sender,
        address(lender),
        loans[msg.sender].loanAmount + loans[msg.sender].interestAmount
      ),
      "Payment of borrower to lender failed."
    );
    loans[msg.sender].state = LoanState.Repaid;
    loans[msg.sender].isCustomer = false;
    statistics.totalAmountRepaid[loans[msg.sender].ercAddress] +=
      loans[msg.sender].loanAmount +
      loans[msg.sender].interestAmount;
    statistics.totalLoansRepaid++;
    emit LoanRepaid(
      msg.sender,
      loans[msg.sender].loanAmount,
      loans[msg.sender].interestAmount,
      loans[msg.sender].repayByTimestamp,
      loans[msg.sender].ercAddress
    );
  }

  function liquidate(address _borrower) public onlyInState(LoanState.Taken) {
    require(msg.sender == _borrower, "Only the lender can liquidate the loan");
    require(
      block.timestamp > loans[_borrower].repayByTimestamp,
      "Cannot liquidate before the loan is due"
    );
    loans[_borrower].state = LoanState.Defaulted;
    // TODO: liquidate the loan / add to statistics
    emit LoanDefaulted(
      _borrower,
      loans[_borrower].loanAmount,
      loans[_borrower].interestAmount,
      loans[_borrower].repayByTimestamp,
      loans[_borrower].ercAddress
    );
  }

  function getStatistics()
    public
    view
    returns (
      uint256 _totalLoansTaken,
      uint256 _totalLoansRepaid,
      address[] memory _erc20Addresses,
      uint256[] memory _totalLoanAmountTaken
    )
  {
    uint256[] memory totalLoanAmountTaken = new uint256[](statistics.erc20Addresses.length);
    for (uint256 i = 0; i < statistics.erc20Addresses.length; i++) {
      totalLoanAmountTaken[i] = statistics.totalAmountTaken[statistics.erc20Addresses[i]];
    }
    return (
      statistics.totalLoansTaken,
      statistics.totalLoansRepaid,
      statistics.erc20Addresses,
      totalLoanAmountTaken
    );
  }

  function getDetailedStatistics()
    public
    view
    returns (
      uint256 _totalLoansTaken,
      uint256 _totalLoansRepaid,
      uint256 _totalLoansLiquidated,
      address[] memory _erc20Addresses,
      uint256[] memory _totalLoanAmountTaken,
      uint256[] memory _totalLoanAmountRepaid,
      uint256[] memory _totalLoanAmountLiquidated
    )
  {
    uint256[] memory totalLoanAmountTaken = new uint256[](statistics.erc20Addresses.length);
    for (uint256 i = 0; i < statistics.erc20Addresses.length; i++) {
      totalLoanAmountTaken[i] = statistics.totalAmountTaken[statistics.erc20Addresses[i]];
    }
    uint256[] memory totalLoanAmountRepaid = new uint256[](statistics.erc20Addresses.length);
    for (uint256 i = 0; i < statistics.erc20Addresses.length; i++) {
      totalLoanAmountRepaid[i] = statistics.totalAmountRepaid[statistics.erc20Addresses[i]];
    }
    uint256[] memory totalLoanAmountLiquidated = new uint256[](
      statistics.erc20Addresses.length
    );
    for (uint256 i = 0; i < statistics.erc20Addresses.length; i++) {
      totalLoanAmountLiquidated[i] = statistics.totalAmountLiquidated[statistics.erc20Addresses[i]];
    }
    return (
      statistics.totalLoansTaken,
      statistics.totalLoansRepaid,
      statistics.totalLoansLiquidated,
      statistics.erc20Addresses,
      totalLoanAmountTaken,
      totalLoanAmountRepaid,
      totalLoanAmountLiquidated
    );
  }
}

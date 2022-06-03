// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

// deployed on CELO to address 0x76dD98D306C879D78bC3574c3BD4dd795958d4d2

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Yeanahok is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("yeanahok", "YNO") {
        _mint(msg.sender, 10100000000000000000000 * 10 ** decimals());
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

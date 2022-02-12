// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// yearn vaults act as an ERC20
interface yVault {

    function deposit(uint _amount) external;

    //returns # of tokens per share
    function getPricePerFullShare() external view returns (uint);

    function withdraw(uint _shares) external;

    function balanceOf(address who) external returns (uint);

}
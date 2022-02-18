pragma solidity ^0.8.4;

import "../interfaces/yearnVault.sol";

contract MockYearnVault is yVault {
    constructor(address strategy) {}

    function deposit(uint256 _amount) public override {}

    function withdraw(uint256 amount) public override {}

    function getPricePerFullShare() external pure override returns (uint) {
        return 1;
    }
    function balanceOf(address who) external pure override returns (uint){
        return 1;
    }
}


    // function deposit(uint _amount) external;

    // //returns # of tokens per share
    // function getPricePerFullShare() external view returns (uint);

    // function withdraw(uint _shares) external;

    // function balanceOf(address who) external view returns (uint);

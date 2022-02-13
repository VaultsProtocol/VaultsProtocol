// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../interfaces/yearnVault.sol";

contract YearnDai {

    // #########################
    // ##                     ##
    // ##       State         ##
    // ##                     ##
    // #########################

    yVault daiVault;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(yVault _daiVault) {
        daiVault = _daiVault;
    }

    function deposit(uint amount) external {
        
    }

    function withdrawl(uint amount) external {

    }
    
    function withdrawlableVaultToken() external returns (uint256) {
        
    }
}
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../interfaces/yearnVault.sol";
import "../tokens/ERC20.sol";

contract YearnStrategy {

    // #########################
    // ##                     ##
    // ##       State         ##
    // ##                     ##
    // #########################

    yVault yvault;
    ERC20 token;

    address immutable vault;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(yVault _yvault, ERC20 _token, address _vault) {

        yvault = _yvault;
        token = _token;

        vault = _vault;
    }

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    modifier onlyVault() {
        require (msg.sender == vault);
        _;
    }

    // #########################
    // ##                     ##
    // ##      Functions      ##
    // ##                     ##
    // #########################

    function deposit(uint amount) external onlyVault() {
        
        token.transferFrom(msg.sender, address(this), amount);

        yvault.deposit(amount);

    }

    function withdrawl(uint tokenAmount) external onlyVault() {

        uint256 pricePerShare = yvault.getPricePerFullShare();
        uint256 needed = tokenAmount / pricePerShare;

        yvault.withdraw(needed);
        uint256 withdrawn = token.balanceOf(address(this));

        token.transfer(msg.sender, withdrawn);

    }
    
    function withdrawlableVaultToken() external view returns (uint256) {
        
        uint256 price = yvault.getPricePerFullShare();
        return yvault.balanceOf(address(this)) * price;

    }
}
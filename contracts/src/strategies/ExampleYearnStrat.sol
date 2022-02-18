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

    address vault;
    
    address immutable deployer;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(yVault _yvault, ERC20 _token) {

        yvault = _yvault;
        token = _token;
        deployer = msg.sender;
        
    }

    // #########################
    // ##                     ##
    // ##      Modifier       ##
    // ##                     ##
    // #########################

    modifier onlyVault() {
        require (msg.sender == vault, "Unauthorized");
        _;
    }

    // #########################
    // ##                     ##
    // ##      Functions      ##
    // ##                     ##
    // #########################

    function deposit(uint amount) external onlyVault() {
        
        token.transferFrom(vault, address(this), amount);

        yvault.deposit(amount);

    }

    function withdrawl(uint tokenAmount) external onlyVault() {

        uint256 pricePerShare = yvault.getPricePerFullShare();
        uint256 needed = tokenAmount / pricePerShare;

        yvault.withdraw(needed);
        uint256 withdrawn = token.balanceOf(address(this));

        token.transfer(vault, withdrawn);

    }
    
    function withdrawlableVaultToken() external view returns (uint256) {
        
        uint256 price = yvault.getPricePerFullShare();
        return yvault.balanceOf(address(this)) * price;

    }

    function initVault(address _vault) external {

        require (
            msg.sender == deployer &&
            vault == address(0)
        );

        vault = _vault;
    }

}
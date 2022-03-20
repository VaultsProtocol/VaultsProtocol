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

	yVault public yvault;

	ERC20 public token;

	uint256 internal isInit;

	address public vault;

	address deployer;

	// #########################
	// ##                     ##
	// ##       Init          ##
	// ##                     ##
	// #########################

	function init(
		address _yVault,
		address _token,
		address _vault
	) public {
		require(isInit == 0);

		yvault = yVault(_yVault);

		token = ERC20(_token);

		yvault = yVault(_yVault);
		token = ERC20(_token);
		deployer = msg.sender;
	}

	// #########################
	// ##                     ##
	// ##      Modifier       ##
	// ##                     ##
	// #########################

	modifier onlyVault() {
		require(msg.sender == vault, "Unauthorized");
		_;
	}

	// #########################
	// ##                     ##
	// ##      Functions      ##
	// ##                     ##
	// #########################

	function deposit(uint256 amount) external onlyVault {
		token.transferFrom(vault, address(this), amount);

		yvault.deposit(amount);
	}

	function withdrawl(uint256 tokenAmount) external onlyVault {
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
}

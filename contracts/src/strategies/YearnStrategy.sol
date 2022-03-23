// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../interfaces/IYearnVault.sol";
import "../tokens/ERC20.sol";

contract YearnStrategy {
	// #########################
	// ##                     ##
	// ##       State         ##
	// ##                     ##
	// #########################

	IYearnVault public yvault;

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

		yvault = IYearnVault(_yVault);

		token = ERC20(_token);

		vault = _vault;

		isInit = 1;
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

	function withdraw(uint256 tokenAmount) external onlyVault {
		uint256 pricePerShare = yvault.getPricePerFullShare();
		uint256 needed = tokenAmount / pricePerShare;

		yvault.withdraw(needed);
		uint256 withdrawn = token.balanceOf(address(this));

		token.transfer(vault, withdrawn);
	}

	function withdrawableVaultToken() external view returns (uint256) {
		uint256 price = yvault.getPricePerFullShare();
		return yvault.balanceOf(address(this)) * price;
	}
}

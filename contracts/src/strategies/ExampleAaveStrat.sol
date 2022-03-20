// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../tokens/ERC20.sol";
import "../interfaces/IAavePool.sol";

contract AaveStrategy {
	// #########################
	// ##                     ##
	// ##       State         ##
	// ##                     ##
	// #########################

	IPool public pool;
	ERC20 public token;
	ERC20 public aToken;

	address vault;

	address immutable deployer;

	// #########################
	// ##                     ##
	// ##     Constructor     ##
	// ##                     ##
	// #########################

	constructor(address aaveStrategy, address _token) {
		pool = IPool(aaveStrategy);
		token = ERC20(_token);
		deployer = msg.sender;
	}

	// #########################
	// ##                     ##
	// ##      External       ##
	// ##                     ##
	// #########################

	function deposit(uint256 amount) external {
		token.approve(address(pool), amount);
		pool.supply(address(token), amount, address(this), 0);
	}

	function withdrawl(uint256 amount) external {
		require(msg.sender == vault);
		pool.withdraw(address(token), amount, vault);
	}

	function withdrawlableVaultToken() external view returns (uint256) {
		return aToken.balanceOf(address(this));
	}

	function initVault(address _vault) external {
		require(msg.sender == deployer && vault == address(0));

		vault = _vault;
	}

	// change this so the deloyer does it
	function setAToken(address _aToken) public virtual {
		require(address(aToken) == address(0));

		aToken = ERC20(_aToken);
	}
}

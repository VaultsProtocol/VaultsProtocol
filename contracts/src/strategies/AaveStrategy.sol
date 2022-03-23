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

	// #########################
	// ##                     ##
	// ##     Constructor     ##
	// ##                     ##
	// #########################

	constructor(
		address _pool,
		address _token,
		address _vault,
		address _aToken
	) {
		pool = IPool(_pool);
		token = ERC20(_token);
		vault = _vault;
		aToken = ERC20(_aToken);
	}

	// #########################
	// ##                     ##
	// ##      External       ##
	// ##                     ##
	// #########################

	// note anyone can call this function
	function deposit(uint256 amount) external {
		// transfer tokens from the vault
		token.transferFrom(msg.sender, address(this), amount);

		// approve aave to spend the tokenbs
		token.approve(address(pool), amount);

		// (asset, amount, onBehalfOf, refferalCode)
		pool.supply(address(token), amount, address(this), 0);
	}

	function withdraw(uint256 amount) external {
		require(msg.sender == vault);
		pool.withdraw(address(token), amount, vault);
	}

	function withdrawableVaultToken() external view returns (uint256) {
		// returns amount of underlying tokens we can withdraw
		return aToken.balanceOf(address(this));
	}
}

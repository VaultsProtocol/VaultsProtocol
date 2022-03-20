// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

// yearn vaults act as an ERC20
interface IYearnVault {
	function deposit(uint256 _amount) external;

	//returns # of tokens per share
	function getPricePerFullShare() external view returns (uint256);

	function withdraw(uint256 _shares) external;

	function balanceOf(address who) external view returns (uint256);
}

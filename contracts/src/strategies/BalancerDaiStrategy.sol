// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../tokens/ERC20.sol";
import "../interfaces/IAavePool.sol";

struct JoinPoolRequest {
	IAsset[] assets;
	uint256[] maxAmountsIn;
	bytes userData;
	bool fromInternalBalance;
}

interface IAsset {
	// solhint-disable-previous-line no-empty-blocks
}

interface bVault {
	function joinPool(
		bytes32 poolId,
		address sender,
		address recipient,
		JoinPoolRequest memory request
	) external payable;
}

contract BalancerDaiStrategy {
	IPool AavePool;

	bVault balancerVault;

	address public vault;

	// balancer poolId
	// cannot be set after initializer
	bytes32 public poolId;

	ERC20 public token;

	ERC20 public aToken;

	uint256 isInit;

	function init(
		address _AavePool,
		address _token,
		address _aToken,
		address _balancerVault,
		bytes32 _poolId,
		address _vault
	) external {
		require(isInit == 0);
		poolId = _poolId;
		token = ERC20(_token);
		aToken = ERC20(_aToken);
		AavePool = IPool(_AavePool);
		balancerVault = bVault(_balancerVault);
		vault = _vault;

		isInit = 1;
	}

	function deposit(uint256 amount) external {
		// transfer tokens from the vault
		token.transferFrom(msg.sender, address(this), amount);

		// approve aave to spend the tokenbs
		token.approve(address(AavePool), amount);

		// supply half (asset, amount, onBehalfOf, refferalCode)
		AavePool.supply(address(token), amount / 2, address(this), 0);

		JoinPoolRequest memory request = JoinPoolRequest();
		//
		//
		//
		//

		balancerVault.joinPool(poolId, vault, vault, request);
	}

	function withdraw(uint256 amount) external {}

	function withdrawableVaultToken() external view returns (uint256) {
		// aTokens + underlying
	}
}

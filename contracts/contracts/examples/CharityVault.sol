// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../BaseVault.sol";

// No Loss Charity Vaults are immutable and recipients cannot changed,
contract CharityVault is BaseVault {
	struct Context {
		uint16 percentOfYield;
		uint16 vaultType;
		address recipient;
	}

	///======================================================================================================================================
	/// State Variables
	///======================================================================================================================================

	Context ctx;
	uint256 public yieldForRecipient;

	///======================================================================================================================================
	/// Constructor
	///======================================================================================================================================

	function init(
		string memory _name,
		string memory _symbol,
		address _token,
		address strategy,
		uint16 _tokenPercent,
		address _recipient
	) public {
		require(isInitialized == 0);

		baseInit(_name, _symbol, _token, strategy);

		ctx = Context(_tokenPercent, 3, _recipient);
	}

	///======================================================================================================================================
	///  User Facing
	///======================================================================================================================================

	function withdrawToRecipient() external {
		vaultToken.transfer(ctx.recipient, yieldForRecipient);
	}

	///======================================================================================================================================
	/// Overrides
	///======================================================================================================================================

	function distributeYield() public override {
		uint256 unclaimedYield = vaultToken.balanceOf(address(this)) -
			lastKnownContractBalance;
		lastKnownContractBalance += unclaimedYield;

		uint256 strategyYield = address(strat) != address(0)
			? strat.withdrawableVaultToken() - lastKnownStrategyTotal
			: 0;
		lastKnownStrategyTotal += strategyYield;

		uint256 totalYield = unclaimedYield + strategyYield;
		uint256 toCharitable = (totalYield * ctx.percentOfYield) / 1e4;

		yieldForRecipient += toCharitable;
		yieldPerDeposit += ((totalYield - toCharitable) * 1e10) / totalDeposits;
	}
}

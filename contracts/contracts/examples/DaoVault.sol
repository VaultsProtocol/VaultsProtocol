// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../BaseVault.sol";

//ENSURE vault tokens revert on failed transfer
contract DaoVault is BaseVault {
	///======================================================================================================================================
	/// Consturctor
	///======================================================================================================================================

	uint256 managed;

	function init(
		string memory _name,
		string memory _symbol,
		address _token,
		address strategy
	) public {
		baseInit(_name, _symbol, _token, strategy);
	}

	///======================================================================================================================================
	///  Manage Logic
	///======================================================================================================================================

	// called by executeProposal
	function _manage(uint256 amount, address who) internal {
		//cannot manage funds earning yield
		require(amount < vaultToken.balanceOf(address(this)));

		managed += amount;
		lastKnownContractBalance -= amount;
		vaultToken.transfer(who, amount);
	}

	function returnManagedFunds(uint256 amount) external {
		// fails on underflow
		lastKnownContractBalance += amount;
		managed -= amount;

		//vault tokens revert on failed transfer
		vaultToken.transferFrom(msg.sender, address(this), amount);
	}

	function withdrawableById(uint256 id)
		public
		view
		override
		returns (uint256)
	{
		// random deposits are not inculded as they are treated as rewards on distro events
		//
		//               expected balance
		return
			((((totalDeposits + depositedToStrat) - managed) *
				deposits[id].amount) / totalDeposits) + yieldPerId(id);
	}
}

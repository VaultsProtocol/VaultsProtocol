// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./BaseVault.sol";

//ENSURE vault tokens revert on failed transfer

// Dao Vault - This contains the DAO treasury.
contract DaoVault is BaseVault {

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    uint256 managed;

    constructor( 
        address _vaultToken,
        string memory name,
        string memory symbol
    ) BaseVault( 
        _vaultToken,
        name,
        symbol
    ) {
        // Add NAme info
    }

    // #########################
    // ##                     ##
    // ##       Manage        ##
    // ##                     ##
    // #########################

    // called by executeProposal
    function _manage(uint256 amount, address who) internal {

        //cannot manage funds earning yeild
        require(amount < vaultToken.balanceOf(address(this)));

        managed += amount;
        lastKnownContractBalance -= amount;
        vaultToken.transfer(who, amount);

    }

    function returnManagedFunds(uint256 amount) external {

        // fails on underflow
        lastKnownContractBalance -= amount;

        //vault tokens revert on failed transfer
        vaultToken.transferFrom(msg.sender, address(this), amount);

    }

    function withdrawableById(uint256 id) 
        public view 
        override returns (uint256) {

            // random deposits are not inculded as they are treated as rewards on distro events

            //               expected balance
            return (((totalDeposits + depositedToStrat) - managed) * deposits[id].amount / totalDeposits) + yieldPerId(id);

    }
}

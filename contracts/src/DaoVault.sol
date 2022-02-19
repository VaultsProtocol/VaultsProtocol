// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./BaseVault.sol";

//ENSURE vault tokens revert on failed transfer

// Dao Vault - This contains the DAO treasury.
contract DaoVault is BaseVault {

    // number of tokens currently not claimable because of DAO vote
    uint256 tokensManaged;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor( 
        ERC20 _vaultToken,
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

        tokensManaged += amount;
        vaultToken.transfer(who, amount);

    }

    function returnManagedFunds(uint256 amount) external {

        // fails on underflow
        tokensManaged -= amount;

        //vault tokens revert on failed transfer
        vaultToken.transferFrom(msg.sender, address(this), amount);

    }

    // #########################
    // ##                     ##
    // ##     Overrides       ##
    // ##                     ##
    // #########################

    function withdrawableById(uint256 id)
        public 
        view
        override 
        returns (uint256 claimId, uint256 adjusted2)
    {

        uint256 _totalDeposits = totalDeposits;
        uint256 balance = vaultToken.balanceOf(address(this));

        // claimable may be larger than total deposits
        uint256 claimable = (balance + depositedToStrat) - tokensManaged;
        claimId = ((claimable * deposits[id].amount) / _totalDeposits) + yieldPerId(id);

        uint256 excess = claimable - totalDeposits;
        adjusted2 = excess * deposits[id].amount / _totalDeposits;

    }
}

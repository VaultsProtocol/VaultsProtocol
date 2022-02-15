// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./BaseVault.sol";


// No Loss Charity Vaults are immutable and recipients cannot changed, 
contract CharityVault is BaseVault {

    // #########################
    // ##                     ##
    // ##        State        ##
    // ##                     ##
    // #########################

    


    // #########################
    // ##                     ##
    // ##        State        ##
    // ##                     ##
    // #########################

    address immutable public recipient;

    uint16 immutable percentOfYield;

    uint256 yieldForRecipient;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor( 
        address _controller,
        ERC721 _NFT,
        ERC20 _vaultToken,
        address _recipient
    ) BaseVault( 
        _controller,
        _NFT,
        _vaultToken
    ) {

        recipient = _recipient;

    }

    // #########################
    // ##                     ##
    // ##     User Facing     ##
    // ##                     ##
    // #########################

    function withdrawlByRecipient() external {
        
        vaultToken.transfer(recipient, yieldForRecipient);

    }


    // #########################
    // ##                     ##
    // ##      Override       ##
    // ##                     ##
    // #########################

    function adjustYeild() public override {

        uint256 totalInStrat = strat.withdrawlableVaultToken();
        uint256 totalYield = totalInStrat - depositedToStrat;
        uint toDistribute = totalYield * percentOfYield / 10000;

        yieldForRecipient += toDistribute;

        yeildPerDeposit += (toDistribute * SCALAR) / totalDeposits;

    }
    

}
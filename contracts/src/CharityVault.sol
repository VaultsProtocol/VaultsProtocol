// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./BaseVault.sol";

// No Loss Charity Vaults are immutable and recipients cannot changed, 
contract CharityVault is BaseVault {
    
    struct Context {
        uint16 percentOfYield;
        address recipient;
    }

    // #########################
    // ##                     ##
    // ##        State        ##
    // ##                     ##
    // #########################

    Context ctx;

    uint256 yieldForRecipient;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor( 

        address _controller,
        ERC20 _vaultToken,
        address _recipient,
        uint16 _tokenPercent,

        string memory name,
        string memory symbol

    ) BaseVault( 

        _controller,
        _vaultToken,
        name,
        symbol

    ) {

        ctx = Context(_tokenPercent, _recipient);

    }

    // #########################
    // ##                     ##
    // ##     User Facing     ##
    // ##                     ##
    // #########################

    function withdrawlByRecipient() external {
        
        vaultToken.transfer(ctx.recipient, yieldForRecipient);

    }


    // #########################
    // ##                     ##
    // ##      Override       ##
    // ##                     ##
    // #########################

    function adjustYeild() public override {

        uint256 totalInStrat = strat.withdrawlableVaultToken();
        uint256 totalYield = totalInStrat - depositedToStrat;
        uint toDistribute = totalYield * ctx.percentOfYield / 10000;

        yieldForRecipient += toDistribute;

        yeildPerDeposit += (toDistribute * SCALAR) / totalDeposits;

    }
    

}
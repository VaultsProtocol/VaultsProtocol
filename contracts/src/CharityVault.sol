// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./BaseVault.sol";

// No Loss Charity Vaults are immutable and recipients cannot changed, 
contract CharityVault is BaseVault {
    
    struct Context {
        uint16 percentOfYield;
        uint16 vaultType;
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

        address _vaultToken,
        address _recipient,
        uint16 _tokenPercent,
        string memory name,
        string memory symbol

    ) BaseVault( 

        _vaultToken,
        name,
        symbol

    ) {

        ctx = Context(_tokenPercent, 3, _recipient);

    }

    // #########################
    // ##                     ##
    // ##     User Facing     ##
    // ##                     ##
    // #########################

    function withdrawlToRecipient() external {
        
        vaultToken.transfer(ctx.recipient, yieldForRecipient);

    }


    // #########################
    // ##                     ##
    // ##      Override       ##
    // ##                     ##
    // #########################

    function distributeYeild() public override {

        uint256 unclaimedYield = vaultToken.balanceOf(address(this)) - lastKnownContractBalance;
        lastKnownContractBalance += unclaimedYield;

        uint256 strategyYield = strat.withdrawlableVaultToken() - lastKnownStrategyTotal;
        lastKnownStrategyTotal += strategyYield;

        uint256 totalYield = unclaimedYield + strategyYield;

        uint256 toCharitable = totalYield * ctx.percentOfYield / 1e4;
        uint256 amountToDistrib = totalYield - toCharitable;

        yieldForRecipient += toCharitable;

        yeildPerDeposit += (amountToDistrib * SCALAR) / totalDeposits;

    }
    

}
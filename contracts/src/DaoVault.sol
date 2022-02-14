// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./BaseVault.sol";

//ENSURE vault tokens revert on failed transfer

// Dao Vault - This contains the DAO treasury.
contract DaoVault is BaseVault {

    // struct Manage {
    //     address to;
    //     uint256 amount;
    // }

    // struct Proposal {
    //     string SmallDescription;
    //     uint256 index;
    //     uint256 IdSnapShot; //prevent sybil attack
    //     Manage one;
    //     Manage two;
    //     Manage three;
    // }

    // struct Vote {
    //     address who;
    //     uint256 index;
        
    // }

    // // key is ID of delegater, result is ID of delgatee
    // mapping (uint256 => uint256) delgeatedToWho;

    // // key is NFT ID result is vote weight
    // mapping (uint256 => uint256) delegatedAmont;

    // // key 1 = NFT ID, key 2 = Propsal ID
    // mapping (uint256 => mapping (uint256 => bool)) voted;

    // number of tokens currently not claimable because of DAO vote
    uint256 tokensManaged;

    // Proposal[] propsals;

    constructor( 
        address _controller,
        ERC721 _NFT,
        ERC20 _vaultToken
    ) BaseVault( 
        _controller,
        _NFT,
        _vaultToken
    ) {
        // Add NAme info
    }

    // #########################
    // ##                     ##
    // ##       Manage        ##
    // ##                     ##
    // #########################

    // function createPropsal(string calldata descriptor, Manage calldata _one, Manage calldata _two, Manage calldata _three) external {

    //     uint256 index = propsals.length;
    //     uint256 snapshot = NFT.currentId();

    //     Proposal memory _proposal = Proposal(descriptor, index, snapshot, _one, _two, _three);
    //     propsals.push(_proposal);

    // }

    // function vote() external {

    // }

    // function delegateVotes(uint256 id, address who) external {

    // }

    function manage(uint256 amount, address who) external virtual {

        require(msg.sender == controller);

        //cannot manage funds earning yeild
        require(amount < vaultToken.balanceOf(address(this)));

        tokensManaged += amount;
        vaultToken.transfer(who, amount);

    }

    function returnManagedFunds(uint256 amount) external virtual {

        tokensManaged -= amount;

        //vault tokens revert on failed transfer
        vaultToken.transferFrom(msg.sender, address(this), amount);

    }

    // #########################
    // ##                     ##
    // ##     Overrides       ##
    // ##                     ##
    // #########################

    function withdrawableById(uint256 id) public view override returns (uint256) {

        uint256 yield = yeildPerId(id);

        // claimable may be larger than total deposits but never smaller
        uint256 claimable = vaultToken.balanceOf(address(this)) +
            depositedToStrat - tokensManaged;
            
        uint256 claimId = (claimable * deposits[id].amount) / totalDeposits;

        return claimId + yield;

    }

}

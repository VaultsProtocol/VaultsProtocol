// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./BaseVault.sol";

//ENSURE vault tokens revert on failed transfer

// Dao Vault - This contains the DAO treasury.
contract DaoVault is BaseVault {

    struct Manage {
        address to;
        uint256 amount;
    }

    struct Proposal {
        string descriptor;
        uint256 idSnapshot; //prevent sybil attack
        Manage[] reciepents;
        uint256 none; //No to all
    }

    struct Vote {
        uint256 id;
        uint256 recipientKey;
        bytes32 mappingKey;
    }

    struct Delegate {
        uint256 delegatee;
        uint256 weight;
    }

    // key 1 = propsoal index, key 2 = reciepent key, returns number of votes
    mapping (bytes32 => mapping(uint256 => uint256)) votes;

    // key is ID of delegater, result is ID of delgatee
    mapping (uint256 => Delegate) delegation;

    // key is NFT ID result is vote weight
    mapping (uint256 => uint256) delegatedAmount;

    // key 1 = NFT ID, key 2 = Propsal ID
    mapping (uint256 => mapping (bytes32 => bool)) voted;

    // number of tokens currently not claimable because of DAO vote
    uint256 tokensManaged;

    // key = bytes32(keccakk256(abi.encodePacked(Proposal.descriptor)))
    mapping (bytes32 => Proposal) proposals;

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

    function createProposal(string calldata descriptor, Manage[] calldata _recipients) external {

        uint256 snapshot = NFT.currentId();

        Proposal memory _proposal = Proposal(descriptor, snapshot, _recipients, 0);
        
        bytes32 key = keccak256(abi.encodePacked(descriptor));

        proposals[key] = _proposal;

    }

    function vote(uint256[] id, uint256[] key, bytes32 descriptor, uint256[] v, uint256[] r, uint256[] s) external {

        require(id < proposals[descriptor].idSnapshot);

        //eip712 here

        voted[id][descriptor] = true;

        if (key > proposals[descriptor].reciepents.length) {

            proposals[descriptor].none += delegatedAmount[id] + (deposits[id].amount - delegation[id].weight);

        } else {

            votes[descriptor][key] += delegatedAmount[id] + (deposits[id].amount - delegation[id].weight);

        }

    }

    function delegateVotes(uint256 fromId, uint256 toId) external {

        require(
            msg.sender == NFT.ownerOf(fromId) &&
            fromId != toId
        );

        uint256 weight = deposits[fromId].amount;
        uint256 currentDelegatee = delegation[fromId].delegatee;

        if (currentDelegatee != 0) {

            delegatedAmount[currentDelegatee] -= weight;

        } 

        delegatedAmount[toId] += weight;
        delegation[fromId].weight = weight;
        delegation[fromId].delegatee = fromId;

    }

    function removeAllDelegation(uint256 id) public {

        require(msg.sender == NFT.ownerOf(id));
        


    }

    function executeProposal(uint256 recipientKey, bytes32 descirptor) external returns (bool) {

        // QUOROM 20%

    }

    function manage(uint256 amount, address who) internal {

        //cannot manage funds earning yeild
        require(amount < vaultToken.balanceOf(address(this)));

        tokensManaged += amount;
        vaultToken.transfer(who, amount);

    }

    function returnManagedFunds(uint256 amount) external {

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

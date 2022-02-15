// // SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../DaoVault.sol";

// //ENSURE vault tokens revert on failed transfer

contract PDelegate is DaoVault {

    struct Manage {
        address to;
        uint256 amount;
    }

    struct Proposal {
        string descriptor;
        uint256 idSnapshot; //prevent sybil attack
        Manage[] reciepents;
        uint256 none; //No to all
        uint256 endTime;
        bool executed;
    }

    struct Delegate {
        uint256 delegatee;
        uint256 weight;
    }

    // #########################
    // ##                     ##
    // ##     Construcor      ##
    // ##                     ##
    // #########################

    constructor(
        ERC20 _vaultToken,
        address strategy,
        string memory name,
        string memory symbol
    ) DaoVault(
        _vaultToken,
        strategy,
        name,
        symbol
    ) {

    }

    // key 1 = propsoal index, key 2 = reciepent key, returns number of votes
    mapping (bytes32 => mapping(uint256 => uint256)) public votes;

    // key is ID of delegater, result is ID of delgatee
    mapping (uint256 => Delegate) public delegation;

    // key is NFT ID result is vote weight
    mapping (uint256 => uint256) public delegatedAmount;

    // key 1 = NFT ID, key 2 = Propsal ID
    mapping (uint256 => mapping (bytes32 => bool)) public voted;

    // key = bytes32(keccakk256(abi.encodePacked(Proposal.descriptor)))
    mapping (bytes32 => Proposal) public proposals;

    // #########################
    // ##                     ##
    // ##       Voting        ##
    // ##                     ##
    // #########################

    // function createProposal(string calldata descriptor, Manage[] calldata _recipients, uint256 time) external {

    //     require(time >= 86400, "Time to short");

    //     uint256 snapshot = currentId;

    //     Proposal memory _proposal = Proposal(
    //         descriptor,
    //         snapshot,
    //         _recipients,
    //         0,
    //         block.timestamp + time,
    //         false
    //     );
        
    //     bytes32 key = keccak256(abi.encodePacked(descriptor));

    //     proposals[key] = _proposal;

    // }

    // votes are urged to be delegated so very few people will ever call this function
    function vote(uint256 id, uint256 key, bytes32 descriptor) external {

        require(
            id < proposals[descriptor].idSnapshot &&
            msg.sender == ownerOf[id]
        );

        voted[id][descriptor] = true;

        if (key > proposals[descriptor].reciepents.length) {

            // no vote
            proposals[descriptor].none += delegatedAmount[id] + (deposits[id].amount - delegation[id].weight);

        } else {

            votes[descriptor][key] += delegatedAmount[id] + (deposits[id].amount - delegation[id].weight);

        }

    }

    

    // 15% Quorum
    function executeProposal(bytes32 descriptor) external returns (bool) {

        Proposal memory _mPro = proposals[descriptor];

        require(
            _mPro.endTime <= block.timestamp &&
            !_mPro.executed
        );

        proposals[descriptor].executed = true;

        uint256 length = _mPro.reciepents.length;
        uint256 mostVotedKey = 0;
        uint256 totalVotes = 0;

        // related to number of possbile management options
        for (uint256 i = 0; i < length; i++) {

            uint256 votesForKey = votes[descriptor][i];
            totalVotes += votesForKey;

            if (votesForKey > votes[descriptor][mostVotedKey]) {
                mostVotedKey = i;
            }

        }

        if (_mPro.none >= votes[descriptor][mostVotedKey]) {
            return false;
        }

        require(totalVotes >= totalDeposits * 1500 / 1e4, "Not Enough Votes");

        manage(
            _mPro.reciepents[mostVotedKey].amount, 
            _mPro.reciepents[mostVotedKey].to
        );

        return true;

    }

    // #########################
    // ##                     ##
    // ##     Delegation      ##
    // ##                     ##
    // #########################

    function delegateVotes(uint256 fromId, uint256 toId) public {

        require(
            msg.sender == ownerOf[fromId] &&
            fromId != toId
        );

        uint256 currentWeight = delegation[fromId].weight;
        uint256 weight = deposits[fromId].amount;
        uint256 currentDelegatee = delegation[fromId].delegatee;

        if (currentDelegatee != 0) {

            delegatedAmount[currentDelegatee] -= currentWeight;

        } 

        delegatedAmount[toId] += weight;
        delegation[fromId].weight = weight;
        delegation[fromId].delegatee = fromId;

    }

    function removeAllDelegation(uint256 id) public {

        require(msg.sender == ownerOf[id]);
        
        delegation[id].delegatee = 0;
        delegation[id].weight = 0;

    }

    // #########################
    // ##                     ##
    // ##      Overrides      ##
    // ##                     ##
    // #########################

    function depositToId(uint256 amount, uint256 id) external virtual override {

        // trusted contract
        require(msg.sender == ownerOf[id]);

        deposits[id].amount += amount;
        deposits[id].tracker += amount * yeildPerDeposit;
        totalDeposits += amount;

        // adjusts weight
        delegateVotes(id, delegation[id].delegatee);

        //ensure token reverts on failed
        vaultToken.transferFrom(msg.sender, address(this), amount);
        
    }

    function withdrawFromId(uint256 amount, uint256 id) public virtual override  {

        require(msg.sender == ownerOf[id]);
        require(amount <= withdrawableById(id));

        //trusted contract
        uint256 balanceCheck = vaultToken.balanceOf(address(this));

        // trusted contract
        if (amount > balanceCheck) {
            withdrawFromStrat(amount - balanceCheck, id);
        }

        deposits[id].amount -= amount;
        deposits[id].tracker -= amount * yeildPerDeposit;

        delegateVotes(id, delegation[id].delegatee);

        vaultToken.transfer(msg.sender, amount);

    }

}
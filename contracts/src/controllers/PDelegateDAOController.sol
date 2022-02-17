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
        bytes32 key;
        uint256 idSnapshot; //prevent sybil attack
        mapping (uint256 => Manage) recipients;
        uint256 recipientsLength;
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
        string memory name,
        string memory symbol,
        uint16 _quorom
    ) DaoVault(
        _vaultToken,
        name,
        symbol
    ) {

        require(_quorom >= 1500);
        quorom = _quorom;

    }

    // #########################
    // ##                     ##
    // ##       State         ##
    // ##                     ##
    // #########################

    uint16 immutable quorom;

    // key is ID of delegater, result is thier delegation info
    mapping (uint256 => Delegate) public delegation;

    // key is NFT ID result is delegated vote weight
    mapping (uint256 => uint256) public delegatedAmount;

    // key = bytes32(keccakk256(abi.encodePacked(Proposal.descriptor)))
    mapping (bytes32 => Proposal) public proposals;

    // key 1 = propsoal index, key 2 = reciepent key, returns number of votes
    mapping (bytes32 => mapping(uint256 => uint256)) public votes;

    // key 1 = NFT ID, key 2 = Propsal ID
    mapping (uint256 => mapping (bytes32 => bool)) public voted;

    // key is ID , result is tiemstamp till locked
    mapping (uint256 => uint256) public lockRedelgation;

    // #########################
    // ##                     ##
    // ##       Voting        ##
    // ##                     ##
    // #########################

    function createProposal(
        string calldata descriptor, 
        Manage[] memory _recipients, 
        uint256 time
    ) external returns (bytes32) {
        
        // 1 day < time < 3 days
        require(time >= 86400 && time <= 259200);

        bytes32 key = keccak256(abi.encodePacked(descriptor));
        uint256 length = _recipients.length;

        Proposal storage proposal = proposals[key];
        
        for (uint256 i = 0; i < length; i++) {
            
            proposal.recipients[i].to = _recipients[i].to;

        }

        return key;

    }

    // votes are urged to be delegated so very few people will ever call this function
    function vote(uint256 id, uint256 key, bytes32 descriptor) external {

        require(
            id < proposals[descriptor].idSnapshot &&
            msg.sender == ownerOf[id]
        );

        voted[id][descriptor] = true;

        if (key > proposals[descriptor].recipientsLength) {

            // no vote
            proposals[descriptor].none += delegatedAmount[id] + (deposits[id].amount - delegation[id].weight);

        } else {

            votes[descriptor][key] += delegatedAmount[id] + (deposits[id].amount - delegation[id].weight);

        }

    }

    

    // 15% Quorum
    function executeProposal(bytes32 descriptor) external returns (bool) {

        Proposal storage proposal = proposals[descriptor];

        require(
            proposal.endTime <= block.timestamp &&
            !proposal.executed
        );

        proposals[descriptor].executed = true;

        uint256 length = proposal.recipientsLength;
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

        if (proposal.none >= votes[descriptor][mostVotedKey]) {
            return false;
        }

        require(totalVotes >= totalDeposits * 1500 / 1e4, "Not Enough Votes");

        manage(
            proposal.recipients[mostVotedKey].amount, 
            proposal.recipients[mostVotedKey].to
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
            fromId != toId &&
            block.timestamp >= lockRedelgation[fromId]
        );

        // locks all redelgation for 3 days
        lockRedelgation[fromId] = block.timestamp + 259200;

        uint256 newWeight = deposits[fromId].amount;
        uint256 currentDelegatee = delegation[fromId].delegatee;

        if (currentDelegatee != 0) {

            delegatedAmount[currentDelegatee] -= delegation[fromId].weight;

        } 

        delegatedAmount[toId] += newWeight;
        delegation[fromId].weight = newWeight;
        delegation[fromId].delegatee = fromId;

    }

    function removeAllDelegation(uint256 id) public {

        require(
            msg.sender == ownerOf[id] &&
            block.timestamp >= lockRedelgation[id]
        );

        delegatedAmount[ delegation[id].delegatee ] -= delegation[id].weight;
        
        delegation[id].delegatee = 0;
        delegation[id].weight = 0;

    }
}
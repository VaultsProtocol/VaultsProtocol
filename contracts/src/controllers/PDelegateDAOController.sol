// // SPDX-License-Identifier: MIT
// pragma solidity >=0.8.0;

// //ENSURE vault tokens revert on failed transfer

// contract PDelegate {

//     struct Manage {
//         address to;
//         uint256 amount;
//     }

//     struct Proposal {
//         string descriptor;
//         uint256 idSnapshot; //prevent sybil attack
//         Manage[] reciepents;
//         uint256 none; //No to all
//         uint256 endTime;
//         bool executed;
//     }

//     struct Delegate {
//         uint256 delegatee;
//         uint256 weight;
//     }

//     // key 1 = propsoal index, key 2 = reciepent key, returns number of votes
//     mapping (bytes32 => mapping(uint256 => uint256)) public votes;

//     // key is ID of delegater, result is ID of delgatee
//     mapping (uint256 => Delegate) public delegation;

//     // key is NFT ID result is vote weight
//     mapping (uint256 => uint256) public delegatedAmount;

//     // key 1 = NFT ID, key 2 = Propsal ID
//     mapping (uint256 => mapping (bytes32 => bool)) public voted;

//     // key = bytes32(keccakk256(abi.encodePacked(Proposal.descriptor)))
//     mapping (bytes32 => Proposal) public proposals;

//     // #########################
//     // ##                     ##
//     // ##       Voting        ##
//     // ##                     ##
//     // #########################

//     function createProposal(string calldata descriptor, Manage[] calldata _recipients, uint256 time) external {

//         require(time >= 86400, "Time to short");

//         uint256 snapshot = NFT.currentId();

//         Proposal memory _proposal = Proposal(
//             descriptor,
//             snapshot,
//             _recipients,
//             0,
//             block.timestamp + time,
//             false
//         );
        
//         bytes32 key = keccak256(abi.encodePacked(descriptor));

//         proposals[key] = _proposal;

//     }

//     // votes are urged to be delegated so very few people will ever call this function
//     function vote(uint256 id, uint256 key, bytes32 descriptor) external {

//         require(
//             id < proposals[descriptor].idSnapshot &&
//             msg.sender == NFT.ownerOf(id)
//         );

//         voted[id][descriptor] = true;

//         if (key > proposals[descriptor].reciepents.length) {

//             // no vote
//             proposals[descriptor].none += delegatedAmount[id] + (deposits[id].amount - delegation[id].weight);

//         } else {

//             votes[descriptor][key] += delegatedAmount[id] + (deposits[id].amount - delegation[id].weight);

//         }

//     }

//     function delegateVotes(uint256 fromId, uint256 toId) public {

//         require(
//             msg.sender == NFT.ownerOf(fromId) &&
//             fromId != toId
//         );

//         uint256 currentWeight = delegation[fromId].weight;
//         uint256 weight = deposits[fromId].amount;
//         uint256 currentDelegatee = delegation[fromId].delegatee;

//         if (currentDelegatee != 0) {

//             delegatedAmount[currentDelegatee] -= currentWeight;

//         } 

//         delegatedAmount[toId] += weight;
//         delegation[fromId].weight = weight;
//         delegation[fromId].delegatee = fromId;

//     }

//     function removeAllDelegation(uint256 id) public {

//         require(msg.sender == NFT.ownerOf(id));
        
//         delegation[id].delegatee = 0;
//         delegation[id].weight = 0;

//     }

//     // 15% Quorum
//     function executeProposal(bytes32 descriptor) external returns (bool) {

//         Proposal memory _mPro = proposals[descriptor];

//         require(
//             _mPro.endTime <= block.timestamp &&
//             !_mPro.executed
//         );

//         proposals[descriptor].executed = true;

//         uint256 length = _mPro.reciepents.length;
//         uint256 mostVotedKey = 0;
//         uint256 totalVotes = 0;

//         // related to number of possbile management options
//         for (uint256 i = 0; i < length; i++) {

//             uint256 votesForKey = votes[descriptor][i];
//             totalVotes += votesForKey;

//             if (votesForKey > votes[descriptor][mostVotedKey]) {
//                 mostVotedKey = i;
//             }

//         }

//         if (_mPro.none >= votes[descriptor][mostVotedKey]) {
//             return false;
//         }

//         require(totalVotes >= totalDeposits * 1500 / 1e4, "Not Enough Votes");

//         manage(
//             _mPro.reciepents[mostVotedKey].amount, 
//             _mPro.reciepents[mostVotedKey].to
//         );

//         return true;

//     }

// }
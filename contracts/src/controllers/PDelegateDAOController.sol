// // // SPDX-License-Identifier: MIT
// pragma solidity >=0.8.0;

// import "../examples//DaoVault.sol";

// // //ENSURE vault tokens revert on failed transfer

// // new ids dont delegate for old proposals

// contract PDelegate is DaoVault {

// ///======================================================================================================================================
// ///  Data Structures
// ///======================================================================================================================================

//     struct Manage {
//         address to;
//         uint256 amount;
//     }

//     struct Proposal {
//         bytes32 key;
//         uint256 idSnapshot; //prevent sybil attack
//         mapping (uint256 => Manage) recipients;
//         uint256 recipientsLength;
//         uint256 none; //No to all
//         uint256 endTime;
//         bool executed;
//     }

//     struct Delegate {
//         uint256 delegatee;
//         uint256 weight;
//     }

//     struct Context {
//         uint16 quorom;
//         uint16 vaultType;
//     }

// ///======================================================================================================================================
// ///  Constructor
// ///======================================================================================================================================

//     constructor(
//         address _vaultToken,
//         string memory name,
//         string memory symbol,
//         uint16 _quorom
//     ) DaoVault(
//         _vaultToken,
//         name,
//         symbol
//     ) {

//         require(_quorom >= 1500);
//         ctx = Context(_quorom, 1);

//     }

// ///======================================================================================================================================
// ///  State Variables
// ///======================================================================================================================================

//     Context public ctx;

//     bytes32[] keys;

//     // key is ID of delegater, result is thier delegation info
//     mapping (uint256 => Delegate) public delegation;

//     // key is NFT ID result is delegated vote weight
//     mapping (uint256 => uint256) public delegatedAmount;

//     // key = bytes32(keccakk256(abi.encodePacked(Proposal.descriptor)))
//     mapping (bytes32 => Proposal) public proposals;

//     // key 1 = propsoal index, key 2 = reciepent key, returns number of votes
//     mapping (bytes32 => mapping(uint256 => uint256)) public votes;

//     // key 1 = NFT ID, key 2 = Propsal ID
//     mapping (uint256 => mapping (bytes32 => bool)) public voted;

//     // key is ID of address that delegation cannot be removed from , result is tiemstamp till unlocked
//     mapping (uint256 => uint256) public lockRedelgation;

// ///======================================================================================================================================
// ///  Proposal Logic
// ///======================================================================================================================================
//     function createProposal(
//         string calldata descriptor, 
//         Manage[] memory _recipients, 
//         uint256 time
//     ) external returns (bytes32) {

//         uint256 length = _recipients.length;
        
//         // 1 day < time < 3 days
//         require(
//             time >= 86400 && time <= 259200 &&
//             length <= 3
//         );

//         bytes32 key = keccak256(abi.encodePacked(descriptor));
//         keys.push(key);

//         Proposal storage proposal = proposals[key];
        
//         for (uint256 i = 0; i < length; i++) {
            
//             proposal.recipients[i].to = _recipients[i].to;

//         }

//         return key;

//     }

//     // votes are urged to be delegated so very few people will ever call this function
//     function vote(uint256 id, uint256 key, bytes32 descriptor) external {

//         require(
//             id < proposals[descriptor].idSnapshot &&
//             msg.sender == ownerOf[id]
//         );

//         voted[id][descriptor] = true;

//         if (key > proposals[descriptor].recipientsLength) {

//             // no vote
//             proposals[descriptor].none += delegatedAmount[id] + (deposits[id].amount - delegation[id].weight);

//         } else {

//             votes[descriptor][key] += delegatedAmount[id] + (deposits[id].amount - delegation[id].weight);

//         }

//         lockRedelgation[id] = block.timestamp + 259200;

//     }

    

//     // 15% Quorum // storage because of nested mapping :)
//     function executeProposal(bytes32 descriptor) external returns (bool) {

//         Proposal storage proposal = proposals[descriptor];

//         require(
//             proposal.endTime <= block.timestamp &&
//             !proposal.executed
//         );

//         // update storage
//         proposals[descriptor].executed = true;

//         uint256 length = proposal.recipientsLength;
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

//         if (proposal.none >= votes[descriptor][mostVotedKey]) {
//             return false;
//         }

//         require(totalVotes >= totalDeposits * ctx.quorom / 1e4, "Not Enough Votes");

//         _manage(
//             proposal.recipients[mostVotedKey].amount, 
//             proposal.recipients[mostVotedKey].to
//         );

//         return true;

//     }

// ///======================================================================================================================================
// ///  Voting
// ///======================================================================================================================================

//     function delegateVotes(uint256 fromId, uint256 toId) public {

//         uint256 currentDelegatee = delegation[fromId].delegatee;

//         require(
//             msg.sender == ownerOf[fromId] &&
//             fromId != toId
//         );

//         if (toId != currentDelegatee) {
//             require (block.timestamp >= lockRedelgation[currentDelegatee]);
//         }

//         uint256 newWeight = deposits[fromId].amount;

//         if (currentDelegatee != 0) {

//             delegatedAmount[currentDelegatee] -= delegation[fromId].weight;

//         }

//         delegatedAmount[toId] += newWeight;
//         delegation[fromId].weight = newWeight;
//         delegation[fromId].delegatee = fromId;

//     }

//     function removeAllDelegation(uint256 id) public {

//         uint256 currentDelegation = delegation[id].delegatee;

//         require(
//             msg.sender == ownerOf[id] &&
//             block.timestamp >= lockRedelgation[currentDelegation]
//         );

//         delegatedAmount[ currentDelegation ] -= delegation[id].weight;
        
//         delegation[id].delegatee = 0;
//         delegation[id].weight = 0;

//     }
// }
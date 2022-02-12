// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./tokens/erc721.sol";
import "./tokens/ERC20.sol";

contract Vault {

    // #########################
    // ##                     ##
    // ##      Structs        ##
    // ##                     ##
    // #########################

    struct Deposits {
        uint256 amount;
        uint256 tracker; //delta(deposit) * yeildPerDeposit
    }

    // #########################
    // ##                     ##
    // ##       State         ##
    // ##                     ##
    // #########################
    
    // tokenID => Deposits
    mapping (uint256 => Deposits) public deposits;

    //sum of yeild/totalDeposits
    uint256 yeildPerDeposit;
    uint256 totalDeposits;
    uint256 SCALAR = 1e10;

    //basis points
    uint256 dividend;
    uint256 jackpot;

    ERC721 NFT;
    ERC20 VaultToken;

    address public lastDepositer;
    //block-timestamp
    uint256 public deadline;
    // minimum deposit required
    uint256 public minimum; //wei

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(
        ERC721 _NFT,
        ERC20 _VaultToken,
        uint256 _dividend, //basis points IE 50% = 5000
        uint256 _jackpot, //basis points
        uint256 _minimum //wei
    ) {
        NFT = _NFT;
        VaultToken = _VaultToken;
        dividend = _dividend;
        jackpot = _jackpot;
        minimum = _minimum;

        //intialize NFT contract for metadata
    }

    // #########################
    // ##                     ##
    // ##       Public        ##
    // ##                     ##
    // #########################

    function depositToNFT(uint amount, uint id) public returns(uint) {
        
    }

    function mintNewNft(uint amount) public returns(uint) {

    }



}
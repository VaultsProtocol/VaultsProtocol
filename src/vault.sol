// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./tokens/erc721.sol";
import "./tokens/ERC20.sol";
import "./interfaces/IStrategy.sol";

//ENSURE vault tokens revert on failed transfer

contract Vault {

    // #########################
    // ##                     ##
    // ##      Structs        ##
    // ##                     ##
    // #########################

    struct Deposits {
        uint256 amount;
        uint256 tracker; //sum of delta(deposit) * yeildPerDeposit
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
    
    ERC721 NFT;
    ERC20 vaultToken; //ensure vault tokens revert on failed transfer
    address immutable controller; //strategy controller

    // strategy to earn yeild on vault reserves
    // strats are hardcoded at 50% of totalDeposits
    IStrategy strat;
    uint256 public tokensInStrat;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(
        address _controller,
        ERC721 _NFT,
        ERC20 _vaultToken
    ) {
        controller = _controller;
        NFT = _NFT;
        _vaultToken = vaultToken;

        //init NFT for getting metadata from this contract
    }

    // #########################
    // ##                     ##
    // ##     User Facing     ##
    // ##                     ##
    // #########################

    function mintNewNft(uint256 amount) external returns (uint256) {

        // contract execution never passed to 
        // untrusted contract so this pattern is safe
        uint id = NFT.mint(msg.sender);
        deposits[id].amount = amount;
        deposits[id].tracker += amount * yeildPerDeposit;
        totalDeposits += amount;

        //ensure token reverts on failed
        vaultToken.transferFrom(msg.sender, address(this), amount);
        return id;
    }

    function depositToId(uint256 amount, uint256 id) external {
        
        // trusted contract
        require(msg.sender == NFT.ownerOf(id));
        deposits[id].amount = amount;
        deposits[id].tracker += amount * yeildPerDeposit;
        totalDeposits += amount;

        //ensure token reverts on failed
        vaultToken.transferFrom(msg.sender, address(this), amount);
    }

    function burn(uint256 id) external {

        require(msg.sender == NFT.ownerOf(id));


    }

    function withdrawFromId(uint256 amount, uint256 id) external {

    }

    // #########################
    // ##                     ##
    // ##     Strategies      ##
    // ##                     ##
    // #########################

    function setStrategy(address addr) external {

        require(msg.sender == controller);

        strat = IStrategy(addr);

    }

    //total possibble deposited to strat is currently set at 50%
    function initStrat() public {
        
    }

    // tokensInStrat = total withdrawn - yeild of msg.sender
    function withdrawFromStrat(uint256 amountNeeded) internal {



    }

    // #########################
    // ##                     ##
    // ##       Yeild         ##
    // ##                     ##
    // #########################

    // gets yeild from strategy contract
    function adjustYeild() public {

    }

    function yeildById(uint256 id) external returns (uint) {

    }
    
}
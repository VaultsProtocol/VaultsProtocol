// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./tokens/erc721.sol";
import "./tokens/ERC20.sol";
import "./DaoVault.sol";

// Jackpot & Dividend Vault
// This is the vault that the Jackpot and Degen dividends go.
// Balances for jackpot vs dividends are tracked with internal vars
contract DegenVault is DaoVault {

    // #########################
    // ##                     ##
    // ##      Structs        ##
    // ##                     ##
    // #########################

    struct Context {
        uint16 jackpotBP;
        uint16 dividendsBP;
        uint16 devFee; //bp
    }
    
    // #########################
    // ##                     ##
    // ##       State         ##
    // ##                     ##
    // #########################

    Context public ctx;

    uint256 minimumPrice; //wei
    uint256 deadline; //seconds
    uint256 jackpot; //wei
    uint256 adminFeesAccumulated; //wei

    address lastDepositer;
    address admin;


    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(
        address _controller,
        ERC721 _NFT,
        ERC20 _vaultToken,
        uint16 _jackpotBP,
        uint16 _dividendsBP,
        uint16 devFee,
        uint256 _minimumPrice
    ) DaoVault(_controller, _NFT, _vaultToken) {

        require(_jackpotBP + _dividendsBP + devFee <= 10000);

        ctx = Context(_jackpotBP, _dividendsBP, devFee);
        minimumPrice = _minimumPrice;

        // 24 hrs
        deadline = block.timestamp + 86400;


    }

    // #########################
    // ##                     ##
    // ##     User Facing     ##
    // ##                     ##
    // #########################

    function mintNewNFT(uint256 amount) external override returns (uint256) {

        require(amount >= minimumPrice);
        require(block.timestamp <= deadline);

        Context memory ctxm = ctx;

        // contract execution never passed to 
        // untrusted contract so this pattern is safe
        uint id = NFT.mint(msg.sender);

        uint256 dividends = amount * ctxm.dividendsBP / 10000;
        adjustYeild(dividends);

        uint256 JP = amount * ctxm.jackpotBP / 10000;
        jackpot += JP;

        uint256 devFee = amount * ctxm.devFee / 10000;
        adminFeesAccumulated += devFee;

        uint256 totalBP = 10000 - (ctxm.devFee + ctxm.jackpotBP + ctxm.dividendsBP);
        uint256 newAmount = amount * totalBP / 10000;
        
        deposits[id].amount = newAmount;
        deposits[id].tracker += newAmount * yeildPerDeposit;
        totalDeposits += newAmount;

        lastDepositer = msg.sender;

        // deadline += 
        //minimum

        //ensure token reverts on failed
        vaultToken.transferFrom(msg.sender, address(this), amount);
        return id;

    }

     function depositToId(uint256 amount, uint256 id) external override {
        
        // trusted contract
        require(
            msg.sender == NFT.ownerOf(id) &&
            amount >= minimumPrice &&
            block.timestamp <= deadline
        );

        Context memory ctxm = ctx;
        
        uint256 dividends = amount * ctxm.dividendsBP / 10000;
        adjustYeild(dividends);

        uint256 JP = amount * ctxm.jackpotBP / 10000;
        jackpot += JP;

        uint256 devFee = amount * ctxm.devFee / 10000;
        adminFeesAccumulated += devFee;

        uint256 totalBP = 10000 - (ctxm.devFee + ctxm.jackpotBP + ctxm.dividendsBP);
        uint256 newAmount = amount * totalBP / 10000;
        
        deposits[id].amount = newAmount;
        deposits[id].tracker += newAmount * yeildPerDeposit;
        totalDeposits += newAmount;

        lastDepositer = msg.sender;

        // deadline += 
        // minimum

        //ensure token reverts on failed
        vaultToken.transferFrom(msg.sender, address(this), amount);

    }

    // #########################
    // ##                     ##
    // ##        Yeild        ##
    // ##                     ##
    // #########################

    // internal adjust yeild function that adjusts dividens from buy ins 
    // adjustYeild() manages startegy yeild
    function adjustYeild(uint256 amount) internal {

        yeildPerDeposit += amount * SCALAR / totalDeposits;

    }

    function withdrawableById(uint256 id) public override view returns (uint) {

        uint256 yield = yeildPerId(id);

        return deposits[id].amount + yield;
    }

    // #########################
    // ##                     ##
    // ##        Admin        ##
    // ##                     ##
    // #########################





    // #########################
    // ##                     ##
    // ##      Uneeded        ##
    // ##                     ##
    // #########################

    function manage(uint256 amount, address who) override external {

        require(1 == 2);

    }

    function returnManagedFunds(uint256 amount) override external {

        require(1 == 2);

    }

}
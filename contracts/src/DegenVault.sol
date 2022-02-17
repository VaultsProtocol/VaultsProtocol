// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./tokens/ERC20.sol";
import "./BaseVault.sol";
import "hardhat/console.sol";

// Jackpot & Dividend Vault
// This is the vault that the Jackpot and Degen dividends go.
// Balances for jackpot vs dividends are tracked with internal vars
contract DegenVault is BaseVault {

    // #########################
    // ##                     ##
    // ##      Structs        ##
    // ##                     ##
    // #########################

    struct Context {
        uint16 jackpotBP;
        uint16 dividendsBP;
        uint16 timeDecay;
        uint16 growthFactor;
    }
    
    // #########################
    // ##                     ##
    // ##       State         ##
    // ##                     ##
    // #########################

    Context public ctx;

    uint256 public minimumPrice; //wei
    uint256 public deadline; //seconds
    uint256 public jackpot; //wei

    uint256 timeTracker;

    address public lastDepositer;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(

        ERC20 _vaultToken,
        uint16 _jackpotBP,
        uint16 _dividendsBP,
        uint256 _minimumPrice,
        uint256 _intialTimeSeconds,
        uint16 _timeDecay,
        uint16 _growthFactor,
        string memory name,
        string memory symbol

    ) BaseVault(_vaultToken, name, symbol) {

        require(_jackpotBP + _dividendsBP <= 10000);

        ctx = Context(_jackpotBP, _dividendsBP, _timeDecay, _growthFactor);
        minimumPrice = _minimumPrice;
        timeTracker = _intialTimeSeconds;

        // 24 hrs
        deadline = block.timestamp + _intialTimeSeconds;

    }

    // #########################
    // ##                     ##
    // ##     User Facing     ##
    // ##                     ##
    // #########################

    // this could all be done better by making all BaseVault methods internal instead of overriding the logic
    // and extracting the logic to public functions

    function mintNewNft(uint256 amount) public override returns (uint256) {

        require(
            amount >= minimumPrice &&
            block.timestamp <= deadline,
            "Underpaid, or past deadline"
        );

        Context memory ctxm = ctx;

        uint256 id = _mint(msg.sender, currentId);
        uint256 totalBP = 10000 - (ctxm.jackpotBP + ctxm.dividendsBP);
        uint256 amountClaimable = amount * totalBP / 10000;

        if (id > 1) {

            // sorry :( , you dont get your own dividends?!
            adjustYeild(
                amount * ctxm.dividendsBP / 10000
            );

            jackpot += amount * ctxm.jackpotBP / 10000;

        } else {

            jackpot = amount * (ctxm.jackpotBP + ctxm.dividendsBP) / 10000;

        }

        lastDepositer = msg.sender;

        adjustFactors();
        return _mintNewNFT(amountClaimable);
        
    }

     function depositToId(uint256 amount, uint256 id) public override {

        
        // trusted contract
        require(
            msg.sender == ownerOf[id] &&
            amount >= minimumPrice &&
            block.timestamp <= deadline
        );

        Context memory ctxm = ctx;

        // sorry :( , you dont get your own dividends?!
        adjustYeild(
            amount * ctxm.dividendsBP / 10000
        );

        uint256 totalBP = 10000 - (ctxm.jackpotBP + ctxm.dividendsBP);
        uint256 newAmount = amount * totalBP / 10000;

        jackpot += amount * ctxm.jackpotBP / 10000;
        
        adjustFactors();
        _depositToId(newAmount, id);

    }

    function withdrawFromId(uint256 amount, uint256 id) public override {

        require(amount == withdrawableById(id), "Use burn");
        burnNFTAndWithdrawl(id);

    }

    function claimJackpot() external {

        require (block.timestamp > deadline);

        vaultToken.transfer(lastDepositer, jackpot);
        
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

    // override beacuse
    function withdrawableById(uint256 id) public override view returns (uint) {

        uint256 yield = yieldPerId(id);
        return deposits[id].amount + yield;

    }

    // #########################
    // ##                     ##
    // ##     Internal        ##
    // ##                     ##
    // #########################

    // every deposits shortens the time 33%
    // every deposit increases the minimum 33%
    function adjustFactors() internal {

        timeTracker -= (timeTracker * ctx.timeDecay / 10000);

        deadline += timeTracker;
        minimumPrice += (minimumPrice * ctx.growthFactor / 10000);

    }

}
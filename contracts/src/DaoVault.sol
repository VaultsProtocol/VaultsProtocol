// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./tokens/erc721.sol";
import "./tokens/ERC20.sol";
import "./interfaces/IStrategy.sol";

//ENSURE vault tokens revert on failed transfer

// Dao Vault - This contains the DAO treasury.
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

    // number of tokens currently not claimable (only take from deposits not yeild)
    uint256 tokensManaged;
    
    ERC721 immutable NFT;
    ERC20 immutable vaultToken; //ensure vault tokens revert on failed transfer
    address immutable controller; //strategy and fund manager

    // strategy to earn yeild on vault reserves
    // strats are hardcoded at 50% of totalDeposits
    IStrategy strat;
    uint256 public depositedToStrat;

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
        vaultToken = _vaultToken;

        NFT.initVault();
    }

    // #########################
    // ##                     ##
    // ##     User Facing     ##
    // ##                     ##
    // #########################

    function mintNewNFT(uint256 amount) external returns (uint256) {

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
        deposits[id].amount += amount;
        deposits[id].tracker += amount * yeildPerDeposit;
        totalDeposits += amount;

        //ensure token reverts on failed
        vaultToken.transferFrom(msg.sender, address(this), amount);

    }

    // Burns NFT and withdraws all claimable token + yeild
    function burn(uint256 id) external {

        NFT.burn(id);
        
        uint256 claimable = withdrawableById(id);
        withdrawFromId(claimable, id);
        
    }

    function withdrawFromId(uint256 amount, uint256 id) public {

        require(msg.sender == NFT.ownerOf(id));
        require(amount <= withdrawableById(id));

        //trusted contract
        uint256 balanceCheck = vaultToken.balanceOf(address(this));

        // trusted contract
        if (amount > balanceCheck) {
            uint256 needed = amount - balanceCheck;
            withdrawFromStrat(needed, id);
        }

        deposits[id].amount -= amount;
        deposits[id].tracker -= amount * yeildPerDeposit;

        vaultToken.transfer(msg.sender, amount);

    }

    // #########################
    // ##                     ##
    // ##   Strats/Manager    ##
    // ##                     ##
    // #########################

    function setStrategy(address addr) external {

        require(msg.sender == controller);

        strat = IStrategy(addr);

    }

    //total possibble deposited to strat is currently set at 50%
    function initStrat() public {

        // 50% of total deposits
        uint256 half = totalDeposits * 5000 / 10000;
        uint256 depositable = half - depositedToStrat;
        strat.deposit(depositable);

    }

    //internal, only called when balanceOf(address(this)) < withdraw requested
    // depositedToStrat = total withdrawn - yeild of msg.sender
    function withdrawFromStrat(uint256 amountNeeded, uint256 forID) internal {

        uint256 userYield = yeildPerId(forID);
        depositedToStrat -= amountNeeded - userYield;

        strat.withdrawl(amountNeeded);

    }

    // #########################
    // ##                     ##
    // ##       Manage        ##
    // ##                     ##
    // #########################


    function manage(uint256 amount, address who) external {

        require(msg.sender == controller);
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
    // ##       Yeild         ##
    // ##                     ##
    // #########################

    // gets yeild from strategy contract
    //possbily call this before new mints?
    function adjustYeild() public {

        uint256 totalInStrat = strat.withdrawlableVaultToken();
        uint256 totalYield = totalInStrat - depositedToStrat;

        yeildPerDeposit += totalYield * SCALAR / totalDeposits;

    }

    function yeildPerId(uint256 id) public view returns (uint) {

        uint256 pre = deposits[id].amount * yeildPerDeposit / SCALAR;
        return pre - deposits[id].tracker;

    }

    function withdrawableById(uint256 id) public view returns (uint) {

        uint256 yield = yeildPerId(id);
        uint256 claimable = totalDeposits - tokensManaged;
        uint256 claimId = claimable * deposits[id].amount / totalDeposits;

        return claimId + yield;
    }
    
}
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./tokens/ERC721.sol";
import "./tokens/ERC20.sol";
import "./interfaces/IStrategy.sol";
import "./BasicMetaTransaction.sol";


contract BaseVault is ERC721, BasicMetaTransaction {

    // #########################
    // ##                     ##
    // ##      Structs        ##
    // ##                     ##
    // #########################

    struct Deposits {
        uint256 amount;
        uint256 tracker; //sum of delta(deposit) * yeildPerDeposit || SCALED
    }

    struct MetaData {
        string name;
        address vaultAddress;
        uint256 withdrawable;
        uint256 id;
        uint256 vaultType;
    }

    // #########################
    // ##                     ##
    // ##       State         ##
    // ##                     ##
    // #########################

    // tokenID => Deposits
    mapping(uint256 => Deposits) public deposits;

    //sum of yeild/totalDeposits
    uint256 public yeildPerDeposit; //SCALED
    uint256 public totalDeposits;
    uint256 internal SCALAR = 1e10;

    // used internally when calculating 
    uint256 internal lastKnownContractBalance;
    uint256 internal lastKnownStrategyTotal;
    uint256 internal depositedToStrat;

    ERC20 immutable vaultToken;
    address immutable deployer; // can only set the strat ONCE
    IStrategy strat;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(
        address _vaultToken,
        string memory name,
        string memory symbol

    ) ERC721(name, symbol) {

        vaultToken = ERC20(_vaultToken);
        deployer = msg.sender;
    }

    // #########################
    // ##                     ##
    // ##     User Facing     ##
    // ##                     ##
    // #########################

    function mintNewNft(uint256 amount) public virtual returns (uint256) {
        return _mintNewNFT(amount);
    }

    function depositToId(uint256 amount, uint256 id) public virtual {
        _depositToId(amount, id);
    }

    function withdrawFromId(uint256 id, uint256 amount) public virtual {
        _withdrawFromId(amount, id);
    }

    function burnNFTAndWithdrawl(uint256 id) public virtual {
        uint256 claimable = withdrawableById(id);
        _withdrawFromId(claimable, id);

        // erc721
        _burn(id);
    }

    function withdrawableById(uint256 id)
        public 
        view
        virtual 
        returns (uint256 claimId)
    {

        return deposits[id].amount + yieldPerId(id);

    }

    // #########################
    // ##                     ##
    // ##  Internal Deposits  ##
    // ##       Logic         ##
    // ##                     ##
    // #########################

    function _mintNewNFT(uint256 amount) internal returns (uint256) {

        uint256 id = _mint(msgSender(), currentId); // Use Biconomy here;

        if (totalDeposits > 0) {
            distributeYeild();
        }

        deposits[id].amount = amount;
        deposits[id].tracker += amount * yeildPerDeposit;

        totalDeposits += amount;
        lastKnownContractBalance += amount;

        //ensure token reverts on failed
        vaultToken.transferFrom(msgSender(), address(this), amount);

        return id;

    }

    function _depositToId(uint256 amount, uint256 id) internal {

        // trusted contract
        require(msgSender() == ownerOf[id]); // Use Biconomy;

        distributeYeild();

        deposits[id].amount += amount;
        deposits[id].tracker += amount * yeildPerDeposit;

        totalDeposits += amount;
        lastKnownContractBalance += amount;

        //ensure token reverts on failed
        vaultToken.transferFrom(msgSender(), address(this), amount); // Use Biconomy;

    }

    function _withdrawFromId(uint256 amount, uint256 id) internal {

        require(
            msgSender() == ownerOf[id] && 
            amount <= withdrawableById(id)
        ); // Use Biconomy;
        
        uint256 balanceCheck = vaultToken.balanceOf(address(this));
        uint256 principalWithdrawn;

        distributeYeild();
        uint256 userYield = yieldPerId(id);

        if (amount > userYield) {

            principalWithdrawn = amount - userYield;
            deposits[id].amount -= principalWithdrawn;
            totalDeposits -= principalWithdrawn;
            
            // all user Yield is harvested therefore at the current
            // point in time the user is not entitled to any yield
            deposits[id].tracker = deposits[id].amount * yeildPerDeposit;

        } else {
            
            // user yield still remains therefore principal not affected
            // just add nonclaimable to current tracker
            deposits[id].tracker += amount * SCALAR;
    
        }
        
        uint256 short = amount > balanceCheck ? amount - balanceCheck : 0;
        if (short > 0) {

            withdrawFromStrat(short);
            depositedToStrat -= principalWithdrawn;

        }

        vaultToken.transfer(msgSender(), amount); // Use Biconomy;
    }

    // #########################
    // ##                     ##
    // ##      Strategy       ##
    // ##                     ##
    // #########################

    //total possible deposited to strat is currently set at 50%
    function initStrat() public {
        require(address(strat) != address(0), "No Strategy");

        // 50% of total deposits
        uint256 half = (totalDeposits * 5000) / 10000;
        uint256 depositable = half - depositedToStrat;

        depositedToStrat += depositable;
        lastKnownStrategyTotal += depositable;
        lastKnownContractBalance -= depositable;

        vaultToken.approve(address(strat), depositable);
        strat.deposit(depositable);
    }

    //internal, only called when balanceOf(address(this)) < withdraw requested
    // depositedToStrat and totalDeposits = total withdrawn - yeild of msg.sender
    function withdrawFromStrat(uint256 amountNeeded) internal {
        strat.withdrawl(amountNeeded);
        lastKnownStrategyTotal -= amountNeeded;
    }

    // #########################
    // ##                     ##
    // ##       Yeild         ##
    // ##                     ##
    // #########################

    // gets yeild from strategy contract
    // called before deposits and withdrawls
    function distributeYeild() public virtual {

        uint256 unclaimedYield = vaultToken.balanceOf(address(this)) - lastKnownContractBalance;
        lastKnownContractBalance += unclaimedYield;
        
        uint256 strategyYield = address(strat) != address(0) ? 
            strat.withdrawlableVaultToken() - lastKnownStrategyTotal : 0;

        lastKnownStrategyTotal += strategyYield;

        uint256 totalYield = unclaimedYield + strategyYield;

        yeildPerDeposit += (totalYield * SCALAR) / totalDeposits;
        
    }

    function yieldPerId(uint256 id) public view returns (uint256) {
        uint256 pre = (deposits[id].amount * yeildPerDeposit) / SCALAR;
        return pre - (deposits[id].tracker / SCALAR);
    }

    // #########################
    // ##                     ##
    // ##  MetaData Override  ##
    // ##                     ##
    // #########################

    function tokenURI(uint256 id) public view virtual returns (MetaData memory) {

        return MetaData(name, address(this), withdrawableById(id), id, 0);

    }

    // #########################
    // ##                     ##
    // ##       INIT          ##
    // ##                     ##
    // #########################

    function setStrat(address addr) external {

        require ( msg.sender == deployer && address(strat) == address(0) );

        strat = IStrategy(addr);
    }
}

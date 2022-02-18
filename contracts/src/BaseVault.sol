// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./tokens/ERC721.sol";
import "./tokens/ERC20.sol";
import "./interfaces/IStrategy.sol";

abstract contract BaseVault is ERC721 {
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
    mapping(uint256 => Deposits) public deposits;

    //sum of yeild/totalDeposits
    uint256 public yeildPerDeposit;
    uint256 public totalDeposits;
    uint256 SCALAR = 1e10;

    uint256 public depositedToStrat;

    ERC20 immutable vaultToken;
    address immutable deployer; // can only set the strat ONCE
    IStrategy strat;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(
        ERC20 _vaultToken,
        string memory name,
        string memory symbol

    ) ERC721(name, symbol) {

        vaultToken = _vaultToken;
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
        _withdrawFromId(id, amount);
    }

    // Burns NFT and withdraws all claimable token + yeild
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
        returns (uint256)
    {
        uint256 yield = yieldPerId(id);

        // claimable may be larger than total deposits but never smaller
        uint256 claimable = vaultToken.balanceOf(address(this)) +
            depositedToStrat;
        uint256 claimId = (claimable * deposits[id].amount) / totalDeposits;

        return claimId + yield;
    }

    // #########################
    // ##                     ##
    // ##  Internal Deposits  ##
    // ##       Logic         ##
    // ##                     ##
    // #########################

    function _mintNewNFT(uint256 amount) internal returns (uint256) {
        uint256 id = _mint(msg.sender, currentId);

        deposits[id].amount = amount;
        deposits[id].tracker += amount * yeildPerDeposit;
        totalDeposits += amount;

        //ensure token reverts on failed
        vaultToken.transferFrom(msg.sender, address(this), amount);

        return id;
    }

    function _depositToId(uint256 amount, uint256 id) internal {
        // trusted contract
        require(msg.sender == ownerOf[id]);

        deposits[id].amount += amount;
        deposits[id].tracker += amount * yeildPerDeposit;
        totalDeposits += amount;

        //ensure token reverts on failed
        vaultToken.transferFrom(msg.sender, address(this), amount);
    }

    function _withdrawFromId(uint256 amount, uint256 id) internal {
        require(msg.sender == ownerOf[id]);
        require(amount <= withdrawableById(id));

        //trusted contract
        uint256 balanceCheck = vaultToken.balanceOf(address(this));

        adjustYeild();

        uint256 userYield = yieldPerId(id);
        uint256 adjusted = amount - userYield;
        if (amount > userYield) {
            totalDeposits -= adjusted;
        }

        // trusted contract
        if (amount > balanceCheck) {
            withdrawFromStrat(amount - balanceCheck);

            depositedToStrat -= adjusted;
        }

        deposits[id].amount -= adjusted;
        deposits[id].tracker -= amount * yeildPerDeposit;

        vaultToken.transfer(msg.sender, amount);
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

        vaultToken.approve(address(strat), depositable);
        strat.deposit(depositable);
    }

    //internal, only called when balanceOf(address(this)) < withdraw requested
    // depositedToStrat and totalDeposits = total withdrawn - yeild of msg.sender
    function withdrawFromStrat(uint256 amountNeeded) internal {
        strat.withdrawl(amountNeeded);
    }

    // #########################
    // ##                     ##
    // ##       Yeild         ##
    // ##                     ##
    // #########################

    // gets yeild from strategy contract
    //possbily call this before new mints?
    function adjustYeild() public virtual {
        require(address(strat) != address(0), "No Strategy");

        uint256 totalInStrat = strat.withdrawlableVaultToken();
        uint256 totalYield = totalInStrat - depositedToStrat;

        yeildPerDeposit += (totalYield * SCALAR) / totalDeposits;
    }

    function yieldPerId(uint256 id) public view returns (uint256) {
        uint256 pre = (deposits[id].amount * yeildPerDeposit) / SCALAR;
        return pre - deposits[id].tracker / SCALAR;
    }

    // #########################
    // ##                     ##
    // ##  MetaData Override  ##
    // ##                     ##
    // #########################

    function tokenURI(uint256 id) public view override returns (string memory) {
        return INftDataGenerator(nftDataGenerator).generateTokenUri(this, id);
        return "string";
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

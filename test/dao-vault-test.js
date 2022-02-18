const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const { assert } = require("chai");
const ethUtil = require("ethereumjs-util");
const { revert } = require("./utils");
require("chai").use(require("chai-as-promised")).should();

const DaoVault = artifacts.require("DaoVault");
const ERC721 = artifacts.require("ERC721");
const MockERC20 = artifacts.require("MockERC20");
const YearnStrategy = artifacts.require("YearnStrategy");
const MockYearnVault = artifacts.require("MockYearnVault");

// User flow:
/**
 * If user does not hold NFT, User Mints NFT from DAO by paying into DAO Vault
 * If user holds NFT and inputs NFT Id to add to, DAO vault adds weighting to it.
 * Payment is split and sent from DAO vault into Degen Vault
 * Degen vault needs to keep track of jackpot and user share.
 * Future payments into the vault means previous users get paid
 */

contract("DaoVault", ([alice, bob, tom, strategy, deployer]) => {
  const bc = {};
  describe("NFT functions testing", function (accounts) {
    before(async () => {
      // TODO: we need to make our own standard NFT
      // bc.nft = await ERC721.new('NFT', "NFT");
      bc.vaultToken = await MockERC20.new(
        "ERC20",
        "ERC20",
        (100e18).toString(),
        {
          from: deployer,
        },
      );

      bc.yVault = await MockYearnVault.new(strategy, { from: deployer });

      bc.strategy = await YearnStrategy.new(
        bc.yVault.address,
        bc.vaultToken.address,
        { from: deployer },
      );

      await bc.vaultToken.transfer(alice, (10e18).toString(), {
        from: deployer,
      });

      await bc.vaultToken.transfer(bob, (10e18).toString(), {
        from: deployer,
      });

      bc.initialLiquidity = "10000000000000000000000"; // 10 ERC20 as initial liquidity
      bc.jackpotBps = 2500;
      bc.dividendBps = 3500;
      bc.initialDeadlineSeconds = 30;
      bc.minimumPrice = (10e18).toString();
      bc.devFee = 500;
      bc.daoVault = await DaoVault.new(
        bc.vaultToken.address, // ERC20 Vault Token
        bc.strategy.address,
        "DAOVault",
        "DAOV",
        { from: deployer },
      );
      bc.strategy.initVault(bc.daoVault.address, { from: deployer });
    });

    it("Test weighting works", async () => {
      // Test Mint 3 nfts of diff weights works
      // mintNewNFT of three weights with there diff people
      // 10/20/30
      // delegate each one to the first minter.
      // make sure first minter has the proper weight. Call delegated Amount

      // make sure the weights - assert deposit amount is equal to

      // deletgate votes to one or two people. works.
      // voting works with weighting.
      // executing proposal works

      // bc.price = await bc.degenVault.minimumPrice();

      // ensure price is correctly calculated
      // await expect(bc.price, bc.nft.totalSupply() / bc.initialLiquidity);
      // await expect(bc.minimumPrice, bc.price);

      //approve ERC20 spend
      await bc.vaultToken.approve(bc.daoVault.address, BigInt(1e30), {
        from: alice,
      });

      //approve ERC20 spend
      await bc.vaultToken.approve(bc.daoVault.address, BigInt(1e30), {
        from: bob,
      });

      // ID = 1
      await bc.daoVault.mintNewNFT(BigInt(1e18), {
        from: alice,
      });

      // should pass ID = 2
      await bc.daoVault.mintNewNFT(BigInt(2e18), {
        from: bob,
      });

      // ensure token transfer happened
      assert.equal(
        Number(await bc.vaultToken.balanceOf(bc.daoVault.address)),
        BigInt(3e18),
      );

      // Ensure mint happened
      assert.equal(Number(await bc.daoVault.balanceOf(alice)), 1);
      assert.equal(Number(await bc.daoVault.balanceOf(bob)), 1);

      // Ensure internal calculation for balances is good.
      assert.equal(
        Number((await bc.daoVault.deposits(1)).amount),
        BigInt(1e18),
      );

      assert.equal(
        Number((await bc.daoVault.deposits(2)).amount),
        BigInt(2e18),
      );

      // Test Strategy deposit
      await bc.daoVault.initStrat();

      assert.equal(
        Number(await bc.vaultToken.balanceOf(bc.strategy.address)),
        BigInt(1.5e18),
      );
      assert.equal(
        Number(await bc.vaultToken.balanceOf(bc.daoVault.address)),
        BigInt(1.5e18),
      );
    });
  });

  it("Pays out multiple depositors", async () => {});

  it("Allows someone to win", async () => {});

  it("Burns NFT to claim dividends", async () => {});
  it("Pays devs taxes", async () => {});
});

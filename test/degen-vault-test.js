const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const { assert } = require("chai");
const ethUtil = require("ethereumjs-util");
const { revert } = require("./utils");
require("chai").use(require("chai-as-promised")).should();

const DegenVault = artifacts.require("DegenVault");
const ERC721 = artifacts.require("ERC721");
const MockERC20 = artifacts.require("MockERC20");

// User flow:
/**
 * If user does not hold NFT, User Mints NFT from DAO by paying into DAO Vault
 * If user holds NFT and inputs NFT Id to add to, DAO vault adds weighting to it.
 * Payment is split and sent from DAO vault into Degen Vault
 * Degen vault needs to keep track of jackpot and user share.
 * Future payments into the vault means previous users get paid
 */

contract("degenVault", ([alice, bob, tom, deployer]) => {
  const bc = {};
  describe("NFT functions testing", function (accounts) {
    before(async () => {
      
      bc.nft = await ERC721.new('NFT', "NFT");
      bc.vaultToken = await MockERC20.new("ERC20", "ERC20", 100e18.toString(), {
        from: deployer
      });

      await bc.vaultToken.transfer(alice, 10e18.toString(), {
        from: deployer
      })

      await bc.vaultToken.transfer(bob, 10e18.toString(), {
        from: deployer
      })

      bc.initialLiquidity = '10000000000000000000000'; // 10 ERC20 as initial liquidity
      bc.jackpotBps = 2500;
      bc.dividendBps = 3500;
      bc.initialDeadlineSeconds = 30;
      bc.minimumPrice = 10e18.toString();
      bc.devFee = 500;
      bc.name = "name";
      bc.symbol = "symbol";
      bc.degenVault = await DegenVault.new(
        tom, // Controller
        bc.vaultToken.address, // ERC20 Vault Token
        bc.jackpotBps, 
        bc.dividendBps,
        bc.minimumPrice,
        bc.initialDeadlineSeconds,
        bc.name,
        bc.symbol,
        { from: deployer },
      );
    });
    it("Mints NFT if paid ", async () => {
      bc.price = await bc.degenVault.minimumPrice();

      // ensure price is correctly calculated
      // await expect(bc.price, bc.nft.totalSupply() / bc.initialLiquidity);
      await expect(bc.minimumPrice, bc.price);

      //approve ERC20 spend
      await bc.vaultToken.approve(bc.degenVault.address, bc.price, {
        from: alice
      })

      //approve ERC20 spend
      await bc.vaultToken.approve(bc.degenVault.address, bc.price, {
        from: bob
      })

      // expected to fail underpaid
      await expect(
        bc.degenVault.mintNewNFT(9e18.toString(), {
          from: alice,
        }),
      ).to.eventually.rejectedWith(revert`Underpaid, or past deadline`);

      // ID = 1
      await bc.degenVault.mintNewNFT(bc.price, {
        from: alice,
      });

      // should pass ID = 2
      await bc.degenVault.mintNewNFT(bc.price, {
        from: bob,
      });

      // first mint no dividends goes to jackpot
      assert.equal(
        Number(await bc.degenVault.jackpot()),
        (bc.price * (bc.jackpotBps + bc.dividendBps) / 1e4) + bc.price * bc.jackpotBps / 1e4,
      );

      // Ensure mint happened
      assert.equal(Number(await bc.degenVault.balanceOf(alice)), 1);
      
      // Balance of Alice 
      let aliceBalance = await bc.degenVault.deposits(1);

      //4000 = 10000 - sum(dividensBP, jackpotBp)
      // Ensure internal calculation for balances is good.
      assert.equal(
        Number(aliceBalance.amount),
        (bc.price * 4000) / 1e4,
      );

      // Alice Tracker is 0
      // first minter all dividens go to jackpot
      let yieldDistributedSoFar = bc.price * bc.dividendBps / 10000;

      // Ensure Previous holders have claimable.
      // ID = 1, OWNER = ALICE
      assert.equal(
        Number(await bc.degenVault.withdrawableById(1)),
        Number(yieldDistributedSoFar) + Number(aliceBalance.amount),
      );

    });
  });

  it("Pays out multiple depositors", async () => {

  });

  it("Allows someone to win", async () => {

  });

  it("Burns NFT to claim dividends", async () => {

  });
  it("Pays devs taxes", async () => {

  });
});

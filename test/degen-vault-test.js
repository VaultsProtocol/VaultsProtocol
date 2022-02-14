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
      bc.devFee = 500 ;
      bc.degenVault = await DegenVault.new(
        tom, // Controller
        bc.nft.address, // NFT collection
        bc.vaultToken.address, // ERC20 Vault Token
        bc.jackpotBps, 
        bc.dividendBps,
        bc.devFee,
        bc.minimumPrice,
        bc.initialLiquidity,
        bc.initialDeadlineSeconds,
        { from: deployer },
      );
    });
    it("Mints NFT if paid ", async () => {
      bc.price = await bc.degenVault.getMinPrice();

      // ensure price is correctly calculated
      // await expect(bc.price, bc.nft.totalSupply() / bc.initialLiquidity);
      await expect(bc.minimumPrice, bc.price);

      //approve ERC20 spend
      await bc.vaultToken.approve(bc.degenVault.address, 10e18.toString(), {
        from: alice
      })

      //approve ERC20 spend
      await bc.vaultToken.approve(bc.degenVault.address, 10e18.toString(), {
        from: bob
      })

      // expected to fail underpaid
      await expect(
        bc.degenVault.mintNewNFT(9e18.toString(), {
          from: alice,
        }),
      ).to.eventually.rejectedWith(revert`Underpaid, or past deadline`);

      // ID = 1
      await bc.degenVault.mintNewNFT(10e18.toString(), {
        from: alice,
      });

      // check correct distrobution of jackpot
      assert.equal(
        Number(await bc.degenVault.jackpot()),
        (bc.price * bc.jackpotBps) / 1e4,
      );

      // should pass ID = 2
      await bc.degenVault.mintNewNFT(10e18.toString(), {
        from: bob,
      });

      // Ensure mint happened
      assert.equal(Number(await bc.nft.balanceOf(alice)), 1);

      // Ensure internal calculation for balances is good.
      // assert.equal(
      //   Number(bc.degenVault.getTreasuryBalance()),
      //   (bc.price * bc.treasuryBps) / 1e4,
      // );

      let r = await bc.degenVault.deposits(1)

      // user deposits = user yield distributed
      // 35%
      let yield = 10e18 * bc.dividendBps / 10000;
      let firstDistro = yield * 1e10 / yield;
        // yeild * 2 == totalDeposits
      let secondDistro = yield * 1e10 / (yield * 2);

      // Ensure Previous holders have claimable.
      // ID = 1, OWNER = ALICE
      assert.equal(
        Number(await bc.degenVault.withdrawableById(1)),
        secondDistro * yield / 1e10 + Number(r.amount),
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

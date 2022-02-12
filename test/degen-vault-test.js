const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const { assert } = require("chai");
const ethUtil = require("ethereumjs-util");
const { revert } = require("./utils");
require("chai").use(require("chai-as-promised")).should();

const DegenVault = artifacts.require("DegenVault");

// User flow:
/**
 * If user does not hold NFT, User Mints NFT from DAO by paying into DAO Vault
 * If user holds NFT and inputs NFT Id to add to, DAO vault adds weighting to it.
 * Payment is split and sent from DAO vault into Degen Vault
 * Degen vault needs to keep track of jackpot and user share.
 * Future payments into the vault means previous users get paid
 */

contract("degenVault", ([alice, bob, tom, deployer]) => {
  describe("NFT functions testing", function (accounts) {
    before(async () => {
      nft = await nft.new();
      vaultToken = await vaultToken.new(); // Must be erc20 

      initialLiquidity = 10e18; // 10 ERC20 as initial liquidity
      jackpotBps = 2500;
      dividendBps = 3500;
      treasuryBps = 4000;

      degenVault = await DegenVault.new(
        tom,
        nft,
        vaultToken,
        initialLiquidity,
        jackpotBps,
        dividendBps,
        treasuryBps,
        { from: deployer },
      );
    });
    it("Mints NFT if paid ", async () => {
      price = await degenVault.getPrice();

      // ensure price is correctly calculated
      await expect(price, nft.totalSupply() / initialLiquidity);

      await expect(
        degenVault.mintNewNFT(9e18, {
          from: alice,
        }),
      ).to.eventually.rejectedWith(revert`Underpaid`);

      await degenVault.mintNewNFT(10e18, {
        from: alice,
      });

      // Ensure mint happened
      assert.equal(Number(await nft.balanceOf(alice)), 1);

      // Ensure internal calculation for balances is good.
      assert.equal(
        Number(degenVault.getTreasuryBalance()),
        (price * treasuryBps) / 1e4,
      );
      assert.equal(
        Number(degenVault.getJackpotBalance()),
        (price * jackpotBps) / 1e4,
      );
      assert.equal(
        Number(degenVault.getDividendBalance()),
        (price * dividendBps) / 1e4,
      );

      // Ensure Previous holders have claimable.
      assert.equal(
        Number(await degenVault.claimableBalance(deployer)),
        (price * dividendBps) / 1e4,
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

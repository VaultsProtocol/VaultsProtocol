const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const { assert } = require("chai");
const ethUtil = require("ethereumjs-util");
const { revert } = require("./utils");
require("chai").use(require("chai-as-promised")).should();

const DaoVault = artifacts.require("DaoVault");

// User flow:
/**
 * If user does not hold NFT, User Mints NFT from DAO by paying into DAO Vault
 * If user holds NFT and inputs NFT Id to add to, DAO vault adds weighting to it.
 * Payment is split and sent from DAO vault into Degen Vault
 * Degen vault needs to keep track of jackpot and user share.
 * Future payments into the vault means previous users get paid
 */

contract("DaoVault", ([alice, bob, tom, deployer]) => {
  describe("NFT functions testing", function (accounts) {
    before(async () => {
      nft = await nft.new();
      vaultToken = await vaultToken.new();

      initialLiquidity = 10e18; // 10 Ethere as initial liquidity
      jackpotBps = 2500;
      dividendBps = 3500;
      treasuryBps = 4000;

      degenVault = await DegenVault.new();

      daoVault = await DaoVault.new(
        tom,
        nft,
        vaultToken,
        initialLiquidity,
        degenVault,
        jackpotBps,
        dividendBps,
        treasuryBps,
        { from: deployer },
      );
    });
    it("Mints NFT if paid ", async () => {
      price = await DaoVault.getPrice();

      await expect(
        daoVault.mintNewNFT(price - 10, {
          value: 10e18,
          from: alice,
        }),
      ).to.eventually.rejectedWith(revert`Mismatched price`);

      await expect(
        daoVault.mintNewNFT(price, {
          value: 9e18,
          from: alice,
        }),
      ).to.eventually.rejectedWith(revert`Mismatched price`);

      await expect(
        daoVault.mintNewNFT(9e18, {
          value: 9e18,
          from: alice,
        }),
      ).to.eventually.rejectedWith(revert`Underpaid`);

      await daoVault.mintNewNFT(10e18, {
        value: 10e18,
        from: alice,
      });

      // Ensure mint happened
      assert.equal(Number(await nft.balanceOf(alice)), 1);

      // Ensure split between vaults is good
      assert.equal(
        Number(await web3.eth.getBalance(daoVault)),
        (price * treasuryBps) / 1e4,
      );
      assert.equal(
        Number(await web3.eth.getBalance(degenVault)),
        (price * (jackpotBps + dividendBps)) / 1e4,
      );

      // Ensure Previous holders have claimable.
      assert.equal(
        Number(await degenVault.claimableBalance(signer)),
        (price * dividendBps) / 1e4,
      );
    });
  });

  it("Pays out multiple depositors", async () => {
    // off chain generation of allowed address
    signer = deployer;
    warriorAllianceFreedomFighters = await WarriorAllianceFreedomFighters.new(
      "testnamenft",
      "TESTNFT",
      20,
      tom,
      { from: signer },
    );

    await warriorAllianceFreedomFighters.setMintPrices(
      (1.3e17).toString(),
      [1, 3, 5],
      [(1.3e17).toString(), (1.2e17).toString(), (1.1e17).toString()],
      {
        from: signer,
      },
    );
    assert.equal(Number(await warriorAllianceFreedomFighters.price(1)), 1.3e17);
    assert.equal(Number(await warriorAllianceFreedomFighters.price(2)), 2.6e17);
    assert.equal(Number(await warriorAllianceFreedomFighters.price(3)), 3.6e17);
    assert.equal(Number(await warriorAllianceFreedomFighters.price(4)), 5.2e17); // default pricing
    assert.equal(Number(await warriorAllianceFreedomFighters.price(5)), 5.5e17);
    assert.equal(Number(await warriorAllianceFreedomFighters.price(6)), 6.6e17);
    assert.equal(
      Number(await warriorAllianceFreedomFighters.price(10)),
      1.1e18,
    );
  });

  it("Allows someone to win", async () => {
    signer = deployer;
    warriorAllianceFreedomFighters = await WarriorAllianceFreedomFighters.new(
      "testnamenft",
      "TESTNFT",
      57,
      tom,
      { from: signer },
    );
    await warriorAllianceFreedomFighters.setMintPrices(
      (1.3e17).toString(),
      [1, 3, 5],
      [(1.3e17).toString(), (1.2e17).toString(), (1.1e17).toString()],
      {
        from: signer,
      },
    );

    let allowedAddress = alice;
    const message = web3.utils.soliditySha3(allowedAddress, 1);
    const signature = await web3.eth.sign(message, signer);
    const { v, r, s } = ethUtil.fromRpcSig(signature);

    // test time block
    const timeNow = Number(await time.latest());
    const delta = 50000000000;
    await warriorAllianceFreedomFighters.setStartTimes(
      `${timeNow + delta}`,
      `${timeNow + delta * 5}`,
      {
        from: signer,
      },
    );

    await expect(
      warriorAllianceFreedomFighters.whitelistMint(2, 1, message, v, r, s, {
        value: 3e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Whitelist mint not open yet`);

    // test isLive block.
    await time.increase(delta);
    await expect(
      warriorAllianceFreedomFighters.whitelistMint(2, 1, message, v, r, s, {
        value: 3e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Whitelist mint not open yet`);
    await warriorAllianceFreedomFighters.setIsLive(false, true, {
      from: signer,
    });

    // test maxtxBlock
    await warriorAllianceFreedomFighters.setMaxWhitelistMintPerTx(4, {
      from: signer,
    });
    await expect(
      warriorAllianceFreedomFighters.whitelistMint(5, 1, message, v, r, s, {
        value: 3e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Requested amount exceeds max per mint`);
    await warriorAllianceFreedomFighters.setMaxWhitelistMintPerTx(5, {
      from: signer,
    });

    // test sold out
    await warriorAllianceFreedomFighters.setMaxWhitelistMintPerTx(8888, {
      from: signer,
    });
    await expect(
      warriorAllianceFreedomFighters.whitelistMint(8888, 1, message, v, r, s, {
        value: 977.68e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Sold Out!`);

    // test pricing
    await expect(
      warriorAllianceFreedomFighters.whitelistMint(5, 1, message, v, r, s, {
        value: 3e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Value below price`);

    // test Nonce
    await warriorAllianceFreedomFighters.setWhitelistNonce(2, {
      from: signer,
    });
    await expect(
      warriorAllianceFreedomFighters.whitelistMint(5, 1, message, v, r, s, {
        value: 5.5e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Whitelist Nonce Invalid`);

    // test hash
    await expect(
      warriorAllianceFreedomFighters.whitelistMint(5, 2, message, v, r, s, {
        value: 5.5e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Invalid hash`);
    await warriorAllianceFreedomFighters.setWhitelistNonce(1, {
      from: signer,
    });

    // test bob taking alice's hash
    await expect(
      warriorAllianceFreedomFighters.whitelistMint(5, 1, message, v, r, s, {
        value: 5.5e17,
        from: bob,
      }),
    ).to.eventually.rejectedWith(revert`Invalid hash`);

    // test invalid signer
    const invSignature = await web3.eth.sign(message, bob);
    const rpcSigVars = ethUtil.fromRpcSig(invSignature);

    await expect(
      warriorAllianceFreedomFighters.whitelistMint(
        5,
        1,
        message,
        rpcSigVars.v,
        rpcSigVars.r,
        rpcSigVars.s,
        {
          value: 5.5e17,
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Access denied`);

    // test successful mint
    await warriorAllianceFreedomFighters.whitelistMint(5, 1, message, v, r, s, {
      value: 5.5e17,
      from: alice,
    });
    assert.equal(
      Number(await warriorAllianceFreedomFighters.balanceOf(alice)),
      5,
    );
    assert.equal(
      Number(await warriorAllianceFreedomFighters.balanceOf(tom)),
      57,
    );

    // test double claim
    await expect(
      warriorAllianceFreedomFighters.whitelistMint(5, 1, message, v, r, s, {
        value: 5.5e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Already claimed!`);
  });
});

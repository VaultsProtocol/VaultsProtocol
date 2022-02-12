const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const { assert } = require("chai");
const ethUtil = require("ethereumjs-util");
const { revert } = require("./utils");
require("chai").use(require("chai-as-promised")).should();

const WarriorAllianceFreedomFighters = artifacts.require("WarriorAllianceFreedomFighters");
// const EthCrypto = require("eth-crypto");

contract("WarriorAllianceFreedomFighters", ([alice, bob, tom, deployer]) => {
  var signer;

  it("Tests pricing calculations", async () => {
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
    assert.equal(Number(await warriorAllianceFreedomFighters.price(10)), 1.1e18);
  });

  it("Tests whitelist Mint", async () => {
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
    assert.equal(Number(await warriorAllianceFreedomFighters.balanceOf(alice)), 5);
    assert.equal(Number(await warriorAllianceFreedomFighters.balanceOf(tom)), 57);

    // test double claim
    await expect(
      warriorAllianceFreedomFighters.whitelistMint(5, 1, message, v, r, s, {
        value: 5.5e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Already claimed!`);
  });

  it("Tests public Mint", async () => {
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

    // test time block
    const timeNow = Number(await time.latest());
    const delta = 50000000000;

    await warriorAllianceFreedomFighters.setStartTimes(
      `${timeNow + delta * 5}`,
      `${timeNow + delta}`,
      {
        from: signer,
      },
    );

    await expect(
      warriorAllianceFreedomFighters.mint(5, {
        value: 5.5e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Public mint not open yet`);

    // test isLive block.
    await time.increase(delta);
    await expect(
      warriorAllianceFreedomFighters.mint(5, {
        value: 5.5e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Public mint not open yet`);
    await warriorAllianceFreedomFighters.setIsLive(true, false, {
      from: signer,
    });

    // test sold out
    await expect(
      warriorAllianceFreedomFighters.mint(8888, {
        value: 977.68e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Sold Out!`);

    // test pricing
    await expect(
      warriorAllianceFreedomFighters.mint(5, {
        value: 3e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Value below price`);

    // test successful mint
    await warriorAllianceFreedomFighters.mint(5, {
      value: 5.5e17,
      from: alice,
    });
    assert.equal(Number(await warriorAllianceFreedomFighters.balanceOf(alice)), 5);
    assert.equal(Number(await warriorAllianceFreedomFighters.balanceOf(tom)), 57);

    const price = Number(await warriorAllianceFreedomFighters.price(50));
    // test successful mint
    await warriorAllianceFreedomFighters.mint(50, {
      value: 55e17,
      from: alice,
    });
    assert.equal(Number(await warriorAllianceFreedomFighters.balanceOf(alice)), 55);
  });

  it("Tests reserve Mint", async () => {
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

    await warriorAllianceFreedomFighters.setMaxElements("70", { from: signer });
    assert.equal(Number(await warriorAllianceFreedomFighters.MAX_ELEMENTS()), 70);

    let allowedAddress = alice;
    const message = web3.utils.soliditySha3(allowedAddress, 50, 3);
    const signature = await web3.eth.sign(message, signer);
    const { v, r, s } = ethUtil.fromRpcSig(signature);

    // test sold out
    await expect(
      warriorAllianceFreedomFighters.reserveMint(50, 3, message, v, r, s, {
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Sold Out!`);
    await warriorAllianceFreedomFighters.setMaxElements("158", {
      from: signer,
    });

    // Whitelist Nonce test
    await expect(
      warriorAllianceFreedomFighters.reserveMint(50, 3, message, v, r, s, {
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Whitelist Nonce Invalid`);
    await warriorAllianceFreedomFighters.setWhitelistNonce(3, {
      from: signer,
    });

    // Alloc Security test
    await expect(
      warriorAllianceFreedomFighters.reserveMint(55, 3, message, v, r, s, {
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Invalid hash`);

    // Bob Uses Alices' Security test
    await expect(
      warriorAllianceFreedomFighters.reserveMint(50, 3, message, v, r, s, {
        from: bob,
      }),
    ).to.eventually.rejectedWith(revert`Invalid hash`);

    // Successful reserve mint
    await warriorAllianceFreedomFighters.reserveMint(50, 3, message, v, r, s, {
      from: alice,
    });

    assert.equal(Number(await warriorAllianceFreedomFighters.balanceOf(alice)), 50);

    // Double Claim Test
    await expect(
      warriorAllianceFreedomFighters.reserveMint(50, 3, message, v, r, s, {
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Already claimed!`);

    // Claim rest as bob.
    allowedAddress = bob;
    let msg = web3.utils.soliditySha3(allowedAddress, 50, 3);
    let sig = await web3.eth.sign(msg, signer);
    let sigHash = ethUtil.fromRpcSig(sig);

    // Successful reserve mint
    await warriorAllianceFreedomFighters.reserveMint(
      50,
      3,
      msg,
      sigHash.v,
      sigHash.r,
      sigHash.s,
      {
        from: bob,
      },
    );
    assert.equal(Number(await warriorAllianceFreedomFighters.balanceOf(bob)), 50);

    // test tom comes in and tries to reserve mint after bob causes error
    allowedAddress = tom;
    msg = web3.utils.soliditySha3(allowedAddress, 1, 3);
    sig = await web3.eth.sign(msg, signer);
    sigHash = ethUtil.fromRpcSig(sig);
    await expect(
      warriorAllianceFreedomFighters.reserveMint(1, 3, msg, sigHash.v, sigHash.r, sigHash.s, {
        from: tom,
      }),
    ).to.eventually.rejectedWith(revert`Sold Out!`);

    assert.equal(Number(await warriorAllianceFreedomFighters.totalSupply()), 158);
  });
});

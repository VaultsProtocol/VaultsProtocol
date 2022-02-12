const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const { assert } = require("chai");
const ethUtil = require("ethereumjs-util");
const { revert } = require("./utils");
require("chai").use(require("chai-as-promised")).should();

const SupplyBoxes = artifacts.require("SupplyBoxes");
// const EthCrypto = require("eth-crypto");

contract("SupplyBoxes", ([alice, bob, tom, deployer]) => {
  var signer;

  // beforeEach(async () => {

  // });

  it("Quick test to ensure whitelist ECDSA mint works", async () => {
    // off chain generation of allowed address
    await time.increaseTo(1741844800);
    await time.advanceBlock();
    signer = deployer;
    supplyBoxes = await SupplyBoxes.new({ from: signer });

    let allowedAddress = alice;
    let tokenId = 1;
    let amount = 20;
    let whitelistNonce = 1;

    const messageHash = web3.utils.soliditySha3(
      allowedAddress,
      tokenId,
      amount,
      whitelistNonce,
    );
    const signature = await web3.eth.sign(messageHash, signer);
    const { v, r, s } = ethUtil.fromRpcSig(signature);

    await supplyBoxes.setIsLive(1, false, true, { from: signer });

    await supplyBoxes.whitelistMint(
      tokenId,
      amount,
      whitelistNonce,
      messageHash,
      v,
      r,
      s,
      {
        value: 6e17,
        from: alice,
      },
    );

    assert.equal(Number(await supplyBoxes.balanceOf(alice, 1)), 20);
    assert.equal(Number(await supplyBoxes.balanceOf(alice, 2)), 0);
    await expect(
      supplyBoxes.whitelistMint(
        tokenId,
        amount,
        whitelistNonce,
        messageHash,
        v,
        r,
        s,
        {
          value: 6e17,
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Already claimed!`);
  });

  it("Tests whitelistMint requirements", async () => {
    signer = deployer;
    supplyBoxes = await SupplyBoxes.new({ from: signer });

    let allowedAddress = alice;
    let tokenId = 1;
    let amount = 20;
    let whitelistNonce = 1;

    const messageHash = web3.utils.soliditySha3(
      allowedAddress,
      tokenId,
      amount,
      whitelistNonce,
    );
    const signature = await web3.eth.sign(messageHash, signer);
    const { v, r, s } = ethUtil.fromRpcSig(signature);

    // Test price:
    await supplyBoxes.setPrice(1, (2e18).toString(), { from: signer });
    assert.equal(Number(await supplyBoxes.calcPrice(1, 2)), 4e18);
    await expect(
      supplyBoxes.whitelistMint(
        tokenId,
        amount,
        whitelistNonce,
        messageHash,
        v,
        r,
        s,
        {
          value: 1e18,
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Value below price`);
    await supplyBoxes.setPrice(1, 0, { from: signer });

    // Test Pause
    await expect(
      supplyBoxes.whitelistMint(
        tokenId,
        amount,
        whitelistNonce,
        messageHash,
        v,
        r,
        s,
        {
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Whitelist not open`);
    await supplyBoxes.setIsLive(1, false, true, { from: signer });

    // test start time
    await supplyBoxes.setStartTime(1, 1941844800, { from: signer });
    await expect(
      supplyBoxes.whitelistMint(
        tokenId,
        amount,
        whitelistNonce,
        messageHash,
        v,
        r,
        s,
        {
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Start time not reached`);
    await supplyBoxes.setStartTime(1, 100000, { from: signer });

    // test supply
    await supplyBoxes.setMaxSupply(1, 1, { from: signer });
    await expect(
      supplyBoxes.whitelistMint(
        tokenId,
        amount,
        whitelistNonce,
        messageHash,
        v,
        r,
        s,
        {
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Max supply exceeded`);
    await supplyBoxes.setMaxSupply(1, 500, { from: signer });

    // test fudged amount
    await expect(
      supplyBoxes.whitelistMint(
        tokenId,
        30,
        whitelistNonce,
        messageHash,
        v,
        r,
        s,
        {
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Invalid hash`);

    await supplyBoxes.whitelistMint(
      tokenId,
      amount,
      whitelistNonce,
      messageHash,
      v,
      r,
      s,
      {
        from: alice,
      },
    );

    assert.equal(Number(await supplyBoxes.balanceOf(alice, 1)), 20);
    assert.equal(Number(await supplyBoxes.balanceOf(alice, 2)), 0);

    await expect(
      supplyBoxes.whitelistMint(
        tokenId,
        amount,
        whitelistNonce,
        messageHash,
        v,
        r,
        s,
        {
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Already claimed!`);
  });

  it("Tests public mint requirements", async () => {
    signer = deployer;
    supplyBoxes = await SupplyBoxes.new({ from: signer });
    const tokenId = 1;
    const amount = 20;

    // Test price:
    await supplyBoxes.setPrice(1, (2e18).toString(), { from: signer });
    assert.equal(Number(await supplyBoxes.calcPrice(1, 2)), 4e18);
    await expect(
      supplyBoxes.mint(
        tokenId,
        amount,
        {
          value: 1e18,
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Value below price`);
    await supplyBoxes.setPrice(1, 0, { from: signer });

    // Test Pause
    await expect(
      supplyBoxes.mint(
        tokenId,
        amount,
        {
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Public sale not open`);
    await supplyBoxes.setIsLive(1, true, false, { from: signer });

    // test start time
    await supplyBoxes.setStartTime(1, 1941844800, { from: signer });
    await expect(
      supplyBoxes.mint(
        tokenId,
        amount,
        {
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Start time not reached`);
    await supplyBoxes.setStartTime(1, 100000, { from: signer });

    // test supply
    await supplyBoxes.setMaxSupply(1, 1, { from: signer });
    await expect(
      supplyBoxes.mint(
        tokenId,
        amount,
        {
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Max supply exceeded`);
    await supplyBoxes.setMaxSupply(1, 500, { from: signer });

    // test max limit amount
    await expect(
      supplyBoxes.mint(
        tokenId,
        30,
        {
          from: alice,
        },
      ),
    ).to.eventually.rejectedWith(revert`Max limit per mint`);
    await supplyBoxes.setMaxMint(1, 25, { from: signer });

    await supplyBoxes.mint(
      tokenId,
      amount,
      {
        from: alice,
      },
    );

    assert.equal(Number(await supplyBoxes.balanceOf(alice, 1)), 20);
    assert.equal(Number(await supplyBoxes.balanceOf(alice, 2)), 0);
  });
});

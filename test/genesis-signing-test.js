const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const { assert } = require("chai");
const ethUtil = require("ethereumjs-util");
const { revert } = require("./utils");
require("chai").use(require("chai-as-promised")).should();

const WarriorAllianceNFT = artifacts.require("WarriorAllianceNFT");
// const EthCrypto = require("eth-crypto");

contract("WarriorAllianceNFT", ([alice, bob, tom, deployer]) => {
  var signer;

  beforeEach(async () => {
    // await time.increaseTo(1641844800);
    // await time.advanceBlock();
  });

  it("Tests whitelist Mint", async () => {
    // off chain generation of allowed address
    await time.increaseTo(1741844800);
    await time.advanceBlock();
    signer = deployer;
    warriorAllianceNFT = await WarriorAllianceNFT.new(
      tom,
      "testnamenft",
      "TESTNFT",
      { from: signer },
    );
    let allowedAddress = alice;
    const message = web3.utils.sha3(allowedAddress);
    const signature = await web3.eth.sign(message, signer);
    const { v, r, s } = ethUtil.fromRpcSig(signature);

    // console.log("Address:", alice)
    // console.log("Message:", message)
    // console.log("signature:", signature)
    // console.log("r is", r, s, v);

    await warriorAllianceNFT.whitelistMint(2, v, r, s, {
      value: 6e17,
      from: alice,
    });
    assert.equal(Number(await warriorAllianceNFT.balanceOf(alice)), 2);
    assert.equal(Number(await warriorAllianceNFT.balanceOf(tom)), 20);
    await expect(
      warriorAllianceNFT.whitelistMint(2, v, r, s, { value: 6e17, from: bob }),
    ).to.eventually.rejectedWith(revert`Access Denied`);
  });

  it("Tests public mint", async () => {
    // Sales not open test
    // await time.increaseTo(1641844800);
    // await time.advanceBlock();
    signer = deployer;
    warriorAllianceNFT = await WarriorAllianceNFT.new(
      tom,
      "testnamenft",
      "TESTNFT",
      { from: signer },
    );
    await expect(
      warriorAllianceNFT.mint(2, { value: 6e17, from: bob }),
    ).to.eventually.rejectedWith(revert`Sales not open`);

    // Opens sales test
    await warriorAllianceNFT.setPause(false, { from: signer });
    await warriorAllianceNFT.mint(2, { value: 6e17, from: bob });
    assert.equal(Number(await warriorAllianceNFT.balanceOf(bob)), 2);
    assert.equal(Number(await warriorAllianceNFT.balanceOf(tom)), 20);

    // change price test
    await warriorAllianceNFT.setMintPrice(String(4e17), { from: signer });
    await expect(
      warriorAllianceNFT.mint(2, { value: 6e17, from: bob }),
    ).to.eventually.rejectedWith(revert`Value below price`);
    await warriorAllianceNFT.mint(2, { value: 8e17, from: bob });
    assert.equal(Number(await warriorAllianceNFT.balanceOf(bob)), 4);
    assert.equal(Number(await warriorAllianceNFT.balanceOf(tom)), 20);

    // change limit test
    await expect(
      warriorAllianceNFT.mint(6, { value: 6e17, from: bob }),
    ).to.eventually.rejectedWith(revert`Max limit`);
    await warriorAllianceNFT.setMaxMint(500, { from: signer });
    await warriorAllianceNFT.setMintPrice(0, { from: signer });
    // note there's a 256 limit due to uint8
    // we want 476 total so split into two for the purposes of the test.
    await warriorAllianceNFT.mint(222, { from: bob });
    await warriorAllianceNFT.mint(254, { from: bob });
    assert.equal(Number(await warriorAllianceNFT.balanceOf(bob)), 480);
    await expect(
      warriorAllianceNFT.mint(2, { value: 6e17, from: alice }),
    ).to.eventually.rejectedWith(revert`Max limit`);
  });

  it("Tests timing for private and public mint", async () => {
    // Sales not open test
    signer = deployer;
    warriorAllianceNFT = await WarriorAllianceNFT.new(
      tom,
      "testnamenft",
      "TESTNFT",
      { from: signer },
    );
    await warriorAllianceNFT.setPause(false, { from: signer });
    await warriorAllianceNFT.setStartTimes(1841672000, 1841844800, {
      from: signer,
    });

    await expect(
      warriorAllianceNFT.mint(2, { value: 6e17, from: alice }),
    ).to.eventually.rejectedWith(revert`Public not open yet.`);

    let allowedAddress = alice;
    const message = web3.utils.sha3(allowedAddress);
    const signature = await web3.eth.sign(message, signer);
    const { v, r, s } = ethUtil.fromRpcSig(signature);

    await expect(
      warriorAllianceNFT.whitelistMint(2, v, r, s, {
        value: 6e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Whitelist not open yet.`);

    await warriorAllianceNFT.setStartTimes(100, 100, { from: signer });
    await warriorAllianceNFT.whitelistMint(2, v, r, s, {
      value: 6e17,
      from: alice,
    });
    await warriorAllianceNFT.mint(2, { value: 6e17, from: bob });
    assert.equal(Number(await warriorAllianceNFT.balanceOf(bob)), 2);
    assert.equal(Number(await warriorAllianceNFT.balanceOf(alice)), 2);

    await warriorAllianceNFT.setStartTimes(1841672000, 1841844800, {
      from: signer,
    });

    await expect(
      warriorAllianceNFT.whitelistMint(1, v, r, s, {
        value: 6e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Whitelist not open yet.`);


    await warriorAllianceNFT.setStartTimes(1641672000, 1641844800, {
      from: signer,
    });

    await warriorAllianceNFT.mint(2, { value: 6e17, from: bob });
    assert.equal(Number(await warriorAllianceNFT.balanceOf(bob)), 4);
  });
  it("Blocks whitelist trying to mint too much", async () => {
    signer = deployer;
    warriorAllianceNFT = await WarriorAllianceNFT.new(
      tom,
      "testnamenft",
      "TESTNFT",
      { from: signer },
    );

    let allowedAddress = alice;
    const message = web3.utils.sha3(allowedAddress);
    const signature = await web3.eth.sign(message, signer);
    const { v, r, s } = ethUtil.fromRpcSig(signature);

    await expect(
      warriorAllianceNFT.whitelistMint(4, v, r, s, {
        value: 6e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Wallet limit reached`);

    await warriorAllianceNFT.whitelistMint(2, v, r, s, {
      value: 6e17,
      from: alice,
    });

    assert.equal(Number(await warriorAllianceNFT.balanceOf(alice)), 2);

    await expect(
      warriorAllianceNFT.whitelistMint(2, v, r, s, {
        value: 6e17,
        from: alice,
      }),
    ).to.eventually.rejectedWith(revert`Wallet limit reached`);
  });


  it("Tests whitelist Mint", async () => {
    // off chain generation of allowed address
    await time.increaseTo(1745844800);
    await time.advanceBlock();
    signer = alice;
    warriorAllianceNFT = await WarriorAllianceNFT.new(
      tom,
      "testnamenft",
      "TESTNFT",
      { from: signer },
    );
    let allowedAddress = alice;
    const message = web3.utils.sha3(allowedAddress);
    const signature = await web3.eth.sign(message, signer);
    const { v, r, s } = ethUtil.fromRpcSig(signature);


    await warriorAllianceNFT.whitelistMint(2, v, r, s, {
      value: 6e17,
      from: alice,
    });
    assert.equal(Number(await warriorAllianceNFT.balanceOf(alice)), 2);
    assert.equal(Number(await warriorAllianceNFT.balanceOf(tom)), 20);
    await expect(
      warriorAllianceNFT.whitelistMint(2, v, r, s, { value: 6e17, from: bob }),
    ).to.eventually.rejectedWith(revert`Access Denied`);
  });

});

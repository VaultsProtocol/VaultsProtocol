const { expectRevert, time } = require("@openzeppelin/test-helpers");
const { assertion } = require("@openzeppelin/test-helpers/src/expectRevert");
const { assert } = require("chai");
const ethUtil = require("ethereumjs-util");
const { revert } = require("./utils");
require("chai").use(require("chai-as-promised")).should();

const DaoVault = artifacts.require("DaoVault");
const ERC721 = artifacts.require("ERC721");
const MockERC20 = artifacts.require("MockERC20");
const VaultFactory = artifacts.require("VaultFactory");
const BaseVault = artifacts.require("BaseVault");
const YearnStrategy = artifacts.require("YearnStrategy");
// const MockYearnVault = artifacts.require("MockYearnVault");

// User flow:
/**
 * If user does not hold NFT, User Mints NFT from DAO by paying into DAO Vault
 * If user holds NFT and inputs NFT Id to add to, DAO vault adds weighting to it.
 * Payment is split and sent from DAO vault into Degen Vault
 * Degen vault needs to keep track of jackpot and user share.
 * Future payments into the vault means previous users get paid
 */

contract("Full Deploy", ([alice, bob, tom, strategy, deployer]) => {
  const bc = {};
  describe("Full Deploy", function (accounts) {
    before(async () => {
      // TODO: we need to make our own standard NFT
      // bc.nft = await ERC721.new('NFT', "NFT");
      bc.vaultFactory = await VaultFactory.new(alice);
      bc.vaultFactoryBc = VaultFactory.bytecode;
      bc.baseVaultBc = BaseVault.bytecode;
      bc.exampleYearnStratBc = YearnStrategy.bytecode;

      bc.vaultToken = await MockERC20.new(
        "ERC20",
        "ERC20",
        BigInt(100000e18),
      );

      const constructorParams = web3.eth.abi.encodeParameters(
        ["address", "string", "string"],
        [bc.vaultToken.address, "Sample Base Vault", "SBV"],
      );

      console.log(
        "bout to add sample vault"
      );

      const sampleVaultAdd = await bc.vaultFactory.createVault(
        bc.baseVaultBc,
        bc.exampleYearnStratBc,
        bc.vaultToken.address,
        "0xA21B900268c056fB5CBc698450b1aCF38862d4Dd",
        constructorParams,
      );
      const sampleVault = await bc.vaultFactory.vaults(0);
      console.log('sampleVault', sampleVault);
      
      // console.log(
      //   `To verify: npx hardhat verify ${sampleVaultAdd.address} "${vaultToken.address}" "Sample Base Vault" "SBV" --network {network}`,
      // );

    });

    it("Test weighting works", async () => {
      console.log("does stuff")
    });
  });

  it("Pays out multiple depositors", async () => {});

  it("Allows someone to win", async () => {});

  it("Burns NFT to claim dividends", async () => {});
  it("Pays devs taxes", async () => {});
});

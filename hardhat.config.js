require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-truffle5");
require("@nomiclabs/hardhat-web3");

require("dotenv").config();
const fs = require("fs-extra");

// const { ethers, web3, Web3 } = require("");

// LOAD ENV VARS
const privatekey = process.env.PRIVATE_KEY;
const mnemonic = process.env.MNEMONIC;
const infura_ropsten_url = process.env.ROPSTEN_ENDPOINT;
const infura_rinkeby_url = process.env.RINKEBY_ENDPOINT;
const bsc_testnet_url = process.env.BSCTEST_ENDPOINT;
const bsc_url = process.env.BSC_ENDPOINT;
const infura_eth_main_url = process.env.MAINNET_ENDPOINT;
const ethscan_api_key = process.env.ETHSCAN_API_KEY;
const bscscan_api_key = process.env.BSCSCAN_API_KEY;

// Deploy NFT Contract...
// npx hardhat full-deploy --network ethMain
task("full-deploy", "Deploy All Contracts")
  // .addParam("yearnAddress", "0x00...")
  // .addParam("aaveAddress", "0x00...")
  // .addParam("elementAddress", "0x00...")
  // .addParam("trueAddress", "0x00...")
  .setAction(async (args, hre) => {
    const { yearnAddress } = args;

    const [deployer] = await ethers.getSigners();
    console.log("Account: " + deployer.address);

    /*****************************/
    /*****************************/
    /** Deploy Vault Factory... **/
    /*****************************/
    /*****************************/
    console.log("Deploying VaultFactory...");
    const VaultFactory = await ethers.getContractFactory("VaultFactory");
    const vaultFactory = await VaultFactory.deploy(deployer.address);
    console.log("vault factory deployed at :", vaultFactory.address);
    console.log(
      `To verify: npx hardhat verify ${vaultFactory.address} "${deployer.address}" --network {network}`,
    );

    /**********************************/
    /**********************************/
    /** Configure Vaults Bytecode... **/
    /**********************************/
    /**********************************/
    console.log("Configuring vaults");
    const baseVaultByteCode = (await ethers.getContractFactory("BaseVault"))
      .bytecode;
    const charityVaultByteCode = (
      await ethers.getContractFactory("CharityVault")
    ).bytecode;
    const degenVaultByteCode = (await ethers.getContractFactory("DegenVault"))
      .bytecode;
    const daoVaultByteCode = (await ethers.getContractFactory("DaoVault"))
      .bytecode;
    const existingVaults = [
      baseVaultByteCode,
      charityVaultByteCode,
      degenVaultByteCode,
      daoVaultByteCode,
    ];

    /*****************************/
    /*****************************/
    /** Configure Strategies... **/
    /*****************************/
    /*****************************/
    console.log("Configurating strategies");
    const exampleYearnStratBc = (
      await ethers.getContractFactory("YearnStrategy")
    ).bytecode;

    /*************************/
    /*************************/
    /** Deploy sample vault **/
    /*************************/
    /*************************/
    console.log("Deploying sample vault token");
    const VaultToken = await ethers.getContractFactory("MockERC20");
    const vaultToken = await VaultToken.deploy(
      "MockERC20",
      "MOCK",
      BigInt(100000e18),
    );
    console.log(
      `To verify: npx hardhat verify ${
        vaultToken.address
      } "MockERC20" "MOCK" "${BigInt(
        100000e18,
      ).toString()}" --network {network}`,
    );

    console.log("Deploying sample vault");
    const constructorParams = web3.eth.abi.encodeParameters(
      ["address", "string", "string"],
      [vaultToken.address, "Sample Base Vault", "SBV"],
    );

    const sampleVaultAdd = await vaultFactory.createVault(
      baseVaultByteCode,
      exampleYearnStratBc,
      vaultToken.address,
      "0x0000000000000000000000000000000000000000",
      constructorParams,
    );
    console.log("sampleVault", sampleVaultAdd);
    console.log(
      `To verify: npx hardhat verify ${sampleVaultAdd.address} "${vaultToken.address}" "Sample Base Vault" "SBV" --network {network}`,
    );
  });

module.exports = {
  mocha: {
    timeout: 60000,
  },
  solidity: {
    compilers: [
      {
        version: "0.8.4",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.6.6",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.5.16",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
      {
        version: "0.5.0",
        settings: { optimizer: { enabled: true, runs: 200 } },
      },
    ],
  },

  etherscan: {
    apiKey: ethscan_api_key,
    // apiKey: bscscan_api_key,
  },

  networks: {
    bscTestnet: {
      url: bsc_testnet_url,
      chainId: 97,
      gasPrice: 20000000000,
      gas: 2100000,
      accounts: { mnemonic: mnemonic },
    },
    bsc: {
      url: bsc_url,
      chainId: 56,
      gasPrice: 20000000000,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    ropsten: {
      url: infura_ropsten_url,
      chainId: 3,
      gasPrice: 20000000000,
      gas: 2100000,
      accounts: { mnemonic: `${mnemonic}` },
    },
    rinkeby: {
      url: infura_rinkeby_url,
      chainId: 4,
      gasPrice: 10e9,
      gas: 2100000,
      accounts: [`${privatekey}`],
    },
    // BEFORE USING THIS, CHECK GAS PRICES

    // ethMain: {
    //   url: infura_eth_main_url,
    //   chainId: 1,
    //   gasPrice: 100e9,
    //   gas: 2100000,
    //   accounts: [`${privatekey}`],
    // },
  },
};

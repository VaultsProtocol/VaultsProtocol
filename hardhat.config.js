require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-truffle5");

require("dotenv").config();
const fs = require("fs-extra");

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
// yarn deploy-genesis-nft-eth-main OR
// npx hardhat deploy-genesis-nft --network ethMain
task("deploy-genesis-nft", "Deploy Genesis NFT").setAction(
  async (args, hre) => {
    const TEAM_WALLET = "0xAa09de8cF7869629357AE6484c4A7efE614ad5A7";

    const [deployer] = await ethers.getSigners();
    console.log("Account: " + deployer.address);

    // Deploy...
    const WarriorAllianceNFT = await ethers.getContractFactory(
      "WarriorAllianceNFT",
    );
    console.log("Deploying NFTs...");
    const warriorAllianceNFT = await WarriorAllianceNFT.deploy(
      TEAM_WALLET,
      "Warrior Alliance Genesis",
      "WAG",
    );

    // Print extra info...
    console.log(
      `To verify: npx hardhat verify ${warriorAllianceNFT.address} "0xAa09de8cF7869629357AE6484c4A7efE614ad5A7" "Warrior Alliance Genesis" "WAG"  --network {network}`,
    );
  },
);

// Deploy Supplybox Contract...
// npx hardhat deploy-supply-boxes-nft --network rinkeby
task("deploy-supply-boxes-nft", "Deploy Supply Boxes NFTs").setAction(
  async (args, hre) => {
    const TEAM_WALLET = "0xD0F1ea2C84182DD2858143B4003F115212B5401c";

    const [deployer] = await ethers.getSigners();
    console.log("Account: " + deployer.address);

    // Deploy...
    const SupplyBoxes = await ethers.getContractFactory("SupplyBoxes");
    console.log("Deploying Supply Boxes...");
    const supplyBoxes = await SupplyBoxes.deploy();

    await supplyBoxes
      .connect(deployer)
      .setBaseUri("ipfs://Qmf4uxNdm54iSzpwVNwR8TqCHniLBfetZTXGDpeuQSNtkV/");

    // Print extra info...
    console.log(
      `To verify: npx hardhat verify ${supplyBoxes.address} --network {network}`,
    );
  },
);

// Deploy MAIN collection Contract...
// npx hardhat deploy-main-nft --network ethMain
task("deploy-main-nft", "Deploy Main NFT").setAction(async (args, hre) => {
  const TEAM_WALLET = "0xAa09de8cF7869629357AE6484c4A7efE614ad5A7";

  const [deployer] = await ethers.getSigners();
  console.log("Account: " + deployer.address);

  // Deploy...
  const WarriorAllianceFreedomFighters = await ethers.getContractFactory(
    "WarriorAllianceFreedomFighters",
  );
  console.log("Deploying Main Collection...");
  const warriorAllianceFreedomFighters =
    await WarriorAllianceFreedomFighters.deploy(
      "Warrior Alliance Freedom Fighters",
      "WAFF",
      56,
      TEAM_WALLET,
    );

  // TODO After deploy:
  await warriorAllianceFreedomFighters.connect(deployer).setIsLive(true, true);

  // Set price
  await warriorAllianceFreedomFighters
    .connect(deployer)
    .setMintPrices(
      `${1.3e17}`,
      [1, 3, 5],
      [`${1.3e17}`, `${1.2e17}`, `${1.1e17}`],
    );

  // Set URLs
  await warriorAllianceFreedomFighters
    .connect(deployer)
    .setBaseURI(
      "ipfs://QmTByUohcSyj9aSgVFfczUSbpYi1tVseXLesFBwPENupn9/",
      0,
      8888,
    );

  // Print extra info...
  console.log(
    `To verify: npx hardhat verify ${warriorAllianceFreedomFighters.address} "Warrior Alliance Freedom Fighters" "WAFF" "56" "0xAa09de8cF7869629357AE6484c4A7efE614ad5A7"  --network {network}`,
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
      accounts: { mnemonic: `${mnemonic}` },
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
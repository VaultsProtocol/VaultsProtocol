const { ethers } = require("hardhat");
const fs = require("fs-extra");
const ethUtil = require("ethereumjs-util");
const web3 = require("web3");

const SUPPLY_WHITELIST_NONCE = 1;
const SUPPLY_UNSIGNED_JSON = "/signed_whitelists/supply_private_unsigned.json";
const SUPPLY_SIGNED_JSON = "/signed_whitelists/supply_private_signed.json";

const GENESIS_UNSIGNED_JSON = "/signed_whitelists/private_unsigned.json";
const GENESIS_SIGNED_JSON = "/signed_whitelists/private_signed.json";

const MAIN_PRIVATE_UNSIGNED_JSON =
  "/signed_whitelists/main_private_unsigned.json";
const MAIN_PRIVATE_SIGNED_JSON = "/signed_whitelists/main_private_signed.json";

const MAIN_PUBLIC_UNSIGNED_JSON =
  "/signed_whitelists/main_public_unsigned.json";
const MAIN_PUBLIC_SIGNED_JSON = "/signed_whitelists/main_public_signed.json";

const RESERVE_UNSIGNED_JSON = "/signed_whitelists/reserve_unsigned.json";
const RESERVE_SIGNED_JSON = "/signed_whitelists/reserve_signed.json";


async function signReserveList() {
  const args = require("minimist")(process.argv.slice(2));
  await require("dotenv");
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.RPC_ENDPOINT,
  );
  const wallet = new ethers.Wallet(`${process.env.PRIVATE_KEY}`, provider);

  // Reserve list signing
  const reserveUnsignedJson = JSON.parse(
    await fs.readFileSync(`${process.cwd()}${RESERVE_UNSIGNED_JSON}`),
  );
  const reserveSignedPath = `${process.cwd()}${RESERVE_SIGNED_JSON}`;
  let signedReserveJson = {};
  for (let address of reserveUnsignedJson) {
    let lowerCaseAddr = address.toLowerCase();
    const message = web3.utils.soliditySha3(lowerCaseAddr, 89, 3);
    const signature = await wallet.signMessage(ethers.utils.arrayify(message));
    const { v, r, s } = ethUtil.fromRpcSig(signature);
    signedReserveJson[lowerCaseAddr] = {
      whitelistNonce: 3,
      messageHash: message,
      allocation: 89,
      v,
      r,
      s,
    };
  }
  await fs.writeFile(
    reserveSignedPath,
    JSON.stringify(signedReserveJson, null, 2),
  );
  console.log("Signed Reserve lists. 📿");
}

signReserveList()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

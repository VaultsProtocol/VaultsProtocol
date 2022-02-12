# LottoDAO Pyramid Contracts
Contracts for LottoDAO

## Installation/Setup

### RPC Configuration
1. Rename `secrets.example.json` to `secrets.json`
2. Fill out the RPC endpoints for your account

### Private key & MNEMONIC Configuration
Do this in .env file.
See .env.example

### Installation
1. `npm install`

### Setup MetaMask
1. Open MetaMask and add a network called `BSC Testnet`
    - RPC URL: `https://data-seed-prebsc-1-s1.binance.org:8545/`
    - Chain ID: 97
    - Symbol: BNB
    - Block Explorer URL: `https://testnet.bscscan.com`

### Give yourself some BSC TestNet BNB

1. Navigate to the BSC Testnet Fountain: https://testnet.binance.org/faucet-smart
2. Give yourself BNB

### Give yourself some Rinkeby ETH

1. Navigate to the Rinkeby Fountain: https://faucet.rinkeby.io/
2. Give yourself ETH (you will have to post your account number on Twitter)

### Give yourself some Ropsten ETH (optional)

1. Navigate to the Ropsten Fountain: https://faucet.ropsten.be/
2. Give yourself some ETH

## Unit Tests
`yarn test` or `npx hardhat test`

## Local Testing
These instructions allow you to test completely on your local computer without deploying to any environments.

1. `CONSOLE 1`: `npx hardhat node`
    - This creates a network at localhost at `127.0.0.1:8545`
    - Update `addressConfig.js` and set `LOCAL.ETH.ADDR_BRIDGE_ADMIN` and `LOCAL.ETH.ADDR_BRIDGE_ADMIN_PRIVATE_KEY` to one of the available accounts
    - Update `addressConfig.js` and set `LOCAL.BSC.ADDR_BRIDGE_ADMIN` and `LOCAL.BSC.ADDR_BRIDGE_ADMIN_PRIVATE_KEY` to one of the available accounts
2. `CONSOLE 2`: `yarn deploy-local-eth`
    - This simulates deploying `SHIBOOST` and `SHIBOOSTBridge` onto Ethereum
    - Make a note of the addresses where those contracts are deployed (they will be printed to the console)
    - Update `addressConfig.js` to set `LOCAL.ETH.ADDR_SHIBOOST` and `LOCAL.ETH.ADDR_BRIDGE`
3. `CONSOLE 2`: `yarn deploy-local-bsc`
    - This simulates deploying `SHIBOOST` and `SHIBOOSTBridge` onto Binance Smart Chain
    - Make a note of the addresses where those contracts are deployed (they will be printed to the console)
    - Update `addressConfig.js` to set `LOCAL.BSC.ADDR_SHIBOOST` and `LOCAL.BSC.ADDR_BRIDGE`
4. `CONSOLE 2`: `yarn check-balance-local`
    - This will print out the SHIBOOST balance on both networks
6. `CONSOLE 2`: `yarn run-bridge-local`
    - This will launch the `SHIBOOSTBridge` for both networks and will begin listening for events on each network
        - Note: Locally, this is only 1 network, but in reality it will be ETH and BSC
7. `CONSOLE 3`: `yarn deposit-local --networktype BSC_LOCAL --amount 1000`
    - This will simulate the deployer (Account[0]) depositing 1 SHIBOOST into the BSC Bridge
        - Note: You can change `networktype` to be `ETH` or `BSC`
    - In `CONSOLE 2`, you should see information printed to the screen that a deposit was detected
8. `CONSOLE 3`: `yarn check-balance-local`
    - This will print out the SHIBOOST balance on both networks. It should have transferred SHIBOOST from one network to the other.

At this point, you can continue playing around by doing deposits on various networks and ensuring that the balance is transferred to the other network.

## Deployment (TestNet)

### Deploy SHIBOOST to BSC TestNet
1. `yarn deploy-shiboost-bsc-test`
    - Make a note of the address at which it was deployed (it will be printed to the console)
2. In MetaMask, click `Import Tokens` and type the address where this token was deployed to
    - You shold have tokens funded to your account

### Deploy SHIBOOST to ETH TestNet (Rinkeby)

1. `yarn deploy-shiboost-eth-test`
    - Make a note of the address at which it was deployed (it will be printed to the console)
2. In MetaMask, click `Import Tokens` and type the address where this token was deployed to
    - You shold have tokens funded to your account

### Deploy SHIBOOSTBridge to BSC TestNet

1. `yarn deploy-bridge-bsc-test`

### Deploy SHIBOOSTBridge to ETH TestNet (Rinkeby)

1. `yarn deploy-bridge-eth-test`

### Transfer SHIBOOST Balance Into ETH SHIBOOSTBridge (Rinkeby)

1. `yarn deploy-bridge-transfer-eth-test`

### Quick Testing Check:

1. Your testing account should now contain 1q SHIBOOST in both networks (Rinkeby and BSC Testnet)
2. Create another test account and send some SHIBOOST to that account on the BSCTestnet
3. Run the SHIBOOSTBridge from your admin account (the account that deployed it)
    - `yarn run-bridge-test`
    - Make sure `secrets.json` has `admin_private_key` set
4. With the account you created in Step 2: Make a deposit from BSC Testnet to Rinkeby
    - `yarn deposit-test --networktype BSC_TEST --amount 1 --fromaddress {ADDRESS FROM ACCOUNT IN STEP 2} --network bscTestnet`

## Deployment (MainNet)

### Deploy SHIBOOST to BSC MainNet
- Already deployed at `0x683fae4411249ca05243dfb919c20920f3f5bfe0`

### Hosting server on production
- This app is currently hosted here: `https://dashboard.heroku.com/apps/bridge-bsc-eth/settings` or `https://bridge-bsc-eth.herokuapp.com/`
- App is good to go for hosting on heroku. Simply `git push heroku main` and boom it's good to go.

## Other Notes

### SHIBOOST on Github
- https://github.com/sumner770/GalaxyHeroesCoin

### SHIBOOST Changes

I made some slight changes to `SHIBOOST.sol` for the Ethereum version.
The changes are intended to make the code easier to test with by not hard-coding addresses.
- Updated constructor to take in addresses

### SHIBOOST Deployment Addresses (for Eric Morgan's account):
- BSC Testnet: 
  - `SHIBOOST`: `0x7A40361dc778A290Ad9B644Ca7Dc677ED34679E7` (deployed on 11/10/21 @ 09:12PM CST)
    - [https://testnet.bscscan.com/address/0x7A40361dc778A290Ad9B644Ca7Dc677ED34679E7](https://testnet.bscscan.com/address/0x7A40361dc778A290Ad9B644Ca7Dc677ED34679E7)
  - `SHIBOOSTBridge`: `0xa3B7C3ED946EFc8040DDF53831892aFBB11A35c3` (deployed on 11/10/21 @09:22PM CST)
    - [https://testnet.bscscan.com/address/0xa3B7C3ED946EFc8040DDF53831892aFBB11A35c3](https://testnet.bscscan.com/address/0xa3B7C3ED946EFc8040DDF53831892aFBB11A35c3)
- ETH Rinkeby: 
  - `SHIBOOST`: `0x75ae5bbDbFD0F6fea85ac1c8AF591654B34498e4` (deployed on 11/10/21 @ 09:32PM CST)
    - [https://rinkeby.etherscan.io/address/0x75ae5bbDbFD0F6fea85ac1c8AF591654B34498e4](https://rinkeby.etherscan.io/address/0x75ae5bbDbFD0F6fea85ac1c8AF591654B34498e4)
  - `SHIBOOSTBridge`: `0x1b73Ec3af512fc0b7175bA08769a21C7854b5A01` (deployed on 11/10/21 @ 09:36PM CST)
    - [https://rinkeby.etherscan.io/address/0x1b73Ec3af512fc0b7175bA08769a21C7854b5A01](https://rinkeby.etherscan.io/address/0x1b73Ec3af512fc0b7175bA08769a21C7854b5A01)
- ETH Ropsten: 
  - `SHIBOOST`: `0x234f302201a64c6C9Db46a2a68B5029c612cb436`
  - `SHIBOOSTBridge`: 





____


### Get SHIBOOST Balance
1. Edit `scripts/getSHIBOOSTBalance.js` and set `NETWORK` to the network you want to get your balance for
2. `npx hardhat run --network bscTestnet scripts/getSHIBOOSTBalance.js`
    - Update network accordingly


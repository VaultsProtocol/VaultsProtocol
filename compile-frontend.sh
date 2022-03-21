rm -rf frontend/src/lib/contracts/
mkdir frontend/src/lib/contracts
find contracts/_hardhat-artifacts -name "*.json" ! -name "*.dbg.json" -exec cp -v {} frontend/src/lib/contracts \;
find contracts/typechain-types -type f -exec cp -v {} frontend/src/lib/contracts \;

# cp -r contracts/typechain-types/* contracts/artifacts/**/*.json frontend/src/lib/contracts
# rm -r frontend/src/lib/contracts/**/*.dbg.json

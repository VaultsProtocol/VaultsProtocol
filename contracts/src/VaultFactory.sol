// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./tokens/ERC721.sol";
import "./interfaces/IStrategy.sol";
import "hardhat/console.sol";

interface iVault {
    function setStrat(address addr) external;
}


// creates vaults and returns address of controller / vault nft and the vault
contract VaultFactory {

    constructor(address _creator) {
        creator = _creator;
    }

    address immutable creator;
    address[] public vaults;

    // construcors are appended to the end of creation code
    function createVault(
        bytes calldata vaultType,
        bytes calldata stratType,
        address vaultToken, 
        address yield,
        bytes calldata _constructor

    ) public returns(address vault) {
        console.log("here we are");

        bytes memory newVault = abi.encodePacked(vaultType, _constructor);
        bytes memory newStrat = abi.encodePacked(stratType, abi.encode(yield, vaultToken));
        address strat;

        // use create2
        assembly {
            strat := create(0, add(newStrat, 0x20), mload(newStrat))
            vault := create(0, add(newVault, 0x20), mload(newVault))
        }

        iVault(vault).setStrat(strat);
        IStrategy(strat).initVault(vault);
        vaults.push(vault);
    }

}

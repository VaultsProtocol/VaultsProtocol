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

    address[] public vaults;

    // construcors are appended to the end of creation code
    function createVault(

        bytes calldata vaultCreationCode,
        bytes calldata strategyCreationCode,
        address vaultToken,
        address yieldVault,
        bytes calldata _constructor

    ) public returns(address vault) {
        console.log("here we are");

        bytes memory newVault = abi.encodePacked(vaultCreationCode, _constructor);
        bytes memory newStrat = abi.encodePacked(strategyCreationCode, abi.encode(yieldVault, vaultToken));
        address strat;

        // use create2 and elimante arrays
        assembly {
            strat := create(0, add(newStrat, 0x20), mload(newStrat))
            vault := create(0, add(newVault, 0x20), mload(newVault))
        }

        vaults.push(vault);

        iVault(vault).setStrat(strat);
        IStrategy(strat).initVault(vault);
        vaults.push(vault);
    }

}

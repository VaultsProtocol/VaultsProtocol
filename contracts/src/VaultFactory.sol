// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./tokens/ERC721.sol";
import "./DegenVault.sol";
import "./interfaces/IStrategy.sol";


interface iVault {
    function setStrat(address addr) external;
}


// creates vaults and returns address of controller / vault nft and the vault
contract DAOFactory {

    constructor(yController _controller, address _creator) {
        controller = _controller;
        creator = _creator;
    }

    yController controller;
    address immutable creator;

    // creation code of vaults and strats
    mapping (uint256 => bytes) public vaultType;
    uint256 public vaultsLength;
    mapping (uint256 => bytes) public stratType;
    uint256 public stratsLength;

    address[] public vaults;

    // construcors are appended to the end of creation code
    function createVault(

        uint256 _vaultType, 
        uint256 _stratType,
        address stratVault,
        address vaultToken, 
        bytes calldata _constructor

    ) public returns(address vault) {

        bytes memory newVault = abi.encodePacked(vaultType[_vaultType], _constructor);
        bytes memory newStrat = abi.encodePacked(stratType[_stratType], abi.encode(vault, vaultToken));
        address strat;

        assembly {
            strat := create(0, add(newStrat, 0x20), mload(newStrat))
            vault := create(0, add(newVault, 0x20), mload(newVault))
        }

        iVault(vault).setStrat(strat);
        IStrategy(strat).initVault(vault);

    }

    function addVault(bytes calldata newVault) external returns (uint256) {
        require (msg.sender == creator);

        uint256 current = vaultsLength;
        vaultType[vaultsLength] = newVault;
        vaultsLength++;

        return current;
    }

    function addStrat(bytes calldata newStrat) external returns (uint256) {
        require (msg.sender == creator);

        uint256 current = stratsLength;
        stratType[stratsLength] = newStrat;
        stratsLength++;

        return current;

    }

}

pragma solidity ^0.8.4;

import './ERC20.sol';

contract MockERC20 is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 supply
    ) ERC20(name, symbol, 18) {
        _mint(msg.sender, supply);

    }
}
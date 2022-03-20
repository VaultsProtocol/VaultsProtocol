// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./CharityVault.sol";

contract SuperFluidVault is CharityVault {

    // #########################
    // ##                     ##
    // ##        State        ##
    // ##                     ##
    // #########################



    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(
        address _vaultToken,
        address _recipient,
        uint16 _tokenPercent,
        uint16 _stream,
        string memory name,
        string memory symbol
    ) CharityVault(_vaultToken, _recipient, _tokenPercent, name, symbol) {

    }   

} 
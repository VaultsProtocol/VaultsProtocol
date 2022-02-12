// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract Controller {

    // #########################
    // ##                     ##
    // ##       Structs       ##
    // ##                     ##
    // #########################

    struct Manage {
        address who;
        uint256 amount;
        uint256 signers;
    }

    struct Strategy {
        address who;
        uint256 signers;
    }

    // #########################
    // ##                     ##
    // ##       State         ##
    // ##                     ##
    // #########################

    mapping (address => bool) isSigner;
    uint256 sigsNeeded;

    Strategy[] strats;
    Manage[] managing;

    // #########################
    // ##                     ##
    // ##     Constructor     ##
    // ##                     ##
    // #########################

    constructor(address[] memory _signers, uint256 _sigsNeeded) {
        uint256 length = _signers.length;

        for (uint256 i = 0; i < length; i++) {
            isSigner[_signers[i]] = true;
        }

        sigsNeeded = _sigsNeeded;
    }

    // #########################
    // ##                     ##
    // ##      Functions      ##
    // ##                     ##
    // #########################
    
    function initManage(address who, uint256 amount) public returns (uint) {

    }

    function initStrat(address who) public returns (uint) {

    }

    function signManage(uint256 key) public returns (bool) {

    }

    function signStrat(uint256 key) public returns (bool) {

    }

    function exectuteManage(uint256 key) public returns (bool) {

    }

    function executeStrategy(uint256 key) public returns (bool) {
        
    }

}
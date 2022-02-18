// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./DaoVault.sol";

contract DAOMultsig is DaoVault {


    // #########################
    // ##                     ##
    // ##       Struct        ##
    // ##                     ##
    // #########################

    struct Manage {
        address to;
        uint256 amout;
        uint256 deadline;
        bool executed;
    }

    struct adjustSigner {
        address signer;
        uint256 deadline;
        uint16 sigsNeeded;
        bool add; // true = add , false = remove
        bool executed;
    }

    // #########################
    // ##                     ##
    // ##       State         ##
    // ##                     ##
    // #########################

    mapping (address => bool) isSigner;
    uint16 signersNeeded;

    Manage[] toManage;
    mapping (uint256 => uint16) toManageSigs;
    mapping (uint256 => mapping (address => bool)) signedManage;

    AdjustSigner[] toAdjust;
    mapping (uint256 => uint16) toAdjustSigs;
    mapping (uint256 => mapping (address => bool)) signedAdjust;


    // #########################
    // ##                     ##
    // ##     Construcor      ##
    // ##                     ##
    // #########################

    constructor(
        ERC20 _vaultToken,
        string memory name,
        string memory symbol,
        address[] _signer,
        uint16 _signersNeeded
    ) DaoVault(
        _vaultToken,
        name,
        symbol
    ) {
        signersNeeded = _signersNeeded;

        uint16 length = _signer.length;
        for (uint16 i = 0; i < length; i++) {
            isSigner[_signer[i]] = true;
        }

    }



    function internalCall(bool manage, uint256 key) external returns (bool) {
        if (manage) {

            require (
                !toManage[key].executed &&
                toManageSigs[key] >= signersNeeded &&
                toManage[key].deadline <= block.timestamp;
            );

            toManage[key].executed = true;
            _manage(toManage[key].amount, toManage[key].to);

        } else {

            require (
                !toAdjust[key].executed &&
                toAdjustSigs[key] >= signersNeeded &&
                toAdjust[key].deadline <= block.timestamp
            );

            toAdjust[key].executed = true;
            if (toAdjust[key].add) {

                isSigner[toAdjust[key].signer] = true;

            } else {

                isSigner[toAdjust[key].signer] = false;

            }

            signersNeeded = toAdjust[key].sigsNeeded;
        }

    }

    // true = manage, false = signer
    function vote(uint256 key, bool type) external returns (bool) {

        require(isSigner[msg.sender]);

        if (type) {

            require(!signedManage[key][msg.sender]);

            signedManage[key][msg.sender] = true;
            toManageSigs[key]++;

        } else {

            require(!signedAdjust[key][msg.sender]);

            signedAdjust[key][msg.sender] = true;
            toAdjustSigs[key]++;
        }

    }

    function proposeManage(
        address to,
        uint256 amout
    ) external returns (uint256) {
        require(isSigner[msg.sender]); 

        
        Manage memory mem = Manage(to, amount, block.timestamp + 259200, false); // -> 3 days 
        return toManage.push(mem);
    }

    function proposeSignerAdjustment(
        address signer,
        uint16 sigsNeeded,
        bool add, // true = add , false = remove
    ) external returns (uint256) {
        require(isSigner[msg.sender]); 

        AdjustSigner memory mem = AdjustSigner(signer, block.timestamp + 259200, sigsNeeded, add, false);
        return toAdjust.push(mem);
    }


}
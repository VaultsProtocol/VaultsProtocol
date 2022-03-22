// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

contract VaultFactory {
	modifier onlyAdmin() {
		require(msg.sender == admin);
		_;
	}

	event NewVault(uint256 _index, address _impl);

	event NewStrat(uint256 _index, address _impl);

	// internal function for impl address
	mapping(uint256 => address) public vImpl;

	// type index => strategy
	mapping(uint256 => address) public sImpl;

	// type index => token => underlying deposit address
	mapping(uint256 => mapping(address => address)) internal underlying;

	// array of all the keys ever used to create a vault
	bytes32[] public keys;

	// key => address
	mapping(bytes32 => address) public vaults;

	// can only add new implementations
	address public admin;

	constructor() {
		admin = msg.sender;
	}

	function createVault(uint256 vKey, bytes32 id) public returns (address vault) {
		// check to see if key has already been used
		require(vaults[id] == address(0));

		vault = deployProy(vImpl[vKey]);

		// push identifier to arry
		keys.push(id);

		// store address of new vault in mapping
		vaults[id] = vault;
	}

	// function deployStrategy() {}

	function setVImpl(uint256 _index, address _impl) external onlyAdmin {
		vImpl[_index] = _impl;

		emit NewVault(_index, _impl);
	}

	function setSImpl(uint256 _index, address _impl) external onlyAdmin {
		sImpl[_index] = _impl;

		emit NewStrat(_index, _impl);
	}

	function setUnderlying(
		uint256 _index,
		address _token,
		address _underlying
	) external onlyAdmin {
		underlying[_index][_token] = _underlying;
	}

	function deployProy(address _impl) internal returns (address instance) {
		assembly {
			// load free memory pointer
			let ptr := mload(0x40)

			// store construction code and first part of Minimal Proxy
			mstore(ptr, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)

			// left shift to pad the end instead of the front
			mstore(add(ptr, 0x14), shl(0x60, _impl))

			// append the rest of the minimal proxy at the end of the impl address
			mstore(add(ptr, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)

			instance := create(0, ptr, 0x37)
		}

		require(instance != address(0), "ERC1167: create failed");
	}
}

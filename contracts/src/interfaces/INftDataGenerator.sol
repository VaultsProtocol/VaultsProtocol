// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

/** Notes // Todos:

    Things we want to display:
        string Name
        string description;
        string website;
        string twitter;
        string discord;
        TVL in vault
        Stable coin Image (may come from frontend)
*/

interface INftDataGenerator {
    /// @notice Produces the URI describing a particular token ID for a vault nft
    /// @dev Note this URI may be a data: URI with the JSON contents directly inlined
    /// @param vault The vault for which to describe the token
    /// @param tokenId The ID of the token for which to produce a description, which may not be valid
    /// @return The URI of the ERC721-compliant metadata
    function generateTokenUri(INonfungiblePositionManager vault, uint256 tokenId)
        external
        view
        returns (string memory);
}
    
}
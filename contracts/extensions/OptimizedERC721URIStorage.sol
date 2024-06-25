// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {DecodeSegmentedURI} from "./DecodeSegmentedURI.sol";

/// @custom:security-contact aLANparty@protonmail.com
abstract contract OptimizedERC721URIStorage is ERC721, DecodeSegmentedURI {
    bytes4 internal _baseTokenURIPrefix;

    string internal _baseTokenURI;

    // Maps token ids to their URIs
    mapping(uint256 => bytes32) private _tokenURIs;

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        require(
            _ownerOf(tokenId) != address(0),
            "ERC721: URI query for nonexistent token"
        );

        bytes32 thisTokenURI = _tokenURIs[tokenId];
        string memory base = _baseTokenURI;

        if (thisTokenURI.length > 0) {
            string memory decodedTokenURI = _decodeTokenUri(thisTokenURI);

            // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
            if (bytes(base).length > 0) {
                return string(abi.encodePacked(base, decodedTokenURI));
            }

            // If there is no base URI, return the token URI.
            return string(abi.encodePacked(decodedTokenURI));
        }

        return super.tokenURI(tokenId);
    }

    function _setTokenURI(
        uint256 tokenId,
        bytes32 inputTokenURI
    ) internal virtual {
        require(
            _ownerOf(tokenId) != address(0),
            "ERC721: URI query for nonexistent token"
        );

        _tokenURIs[tokenId] = inputTokenURI;
    }

    function _decodeTokenUri(
        bytes32 inputTokenURI
    ) internal view returns (string memory decodedTokenURI) {
        return _combineURISegments(_baseTokenURIPrefix, inputTokenURI);
    }
}

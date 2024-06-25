// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

/// @custom:security-contact aLANparty@protonmail.com
abstract contract TokenAttributes is ERC721 {
    // Maps token ids to their attributes
    mapping(uint256 => bytes32) private _tokenAttributes;

    // Inverses the map of token ids to attributes
    mapping(bytes32 => uint256) private _tokenAttributesToTokenIds;

    function tokenAttribute(
        uint256 tokenId
    ) public view virtual returns (bytes32) {
        require(
            _ownerOf(tokenId) != address(0),
            "ERC721: URI query for nonexistent token"
        );

        return _tokenAttributes[tokenId];
    }

    function tokenAttributeTokenId(
        bytes32 inputTokenAttribute
    ) public view virtual returns (uint256) {
        require(
            tokenAttributeExists(inputTokenAttribute),
            "id query on nonexistent attr"
        );

        return _tokenAttributesToTokenIds[inputTokenAttribute];
    }

    function tokenAttributeExists(
        bytes32 inputTokenAttribute
    ) public view virtual returns (bool) {
        return
            _tokenAttributes[_tokenAttributesToTokenIds[inputTokenAttribute]] ==
            inputTokenAttribute;
    }

    function getTokenURIAndAttributeHash(
        address approvedAddress,
        bytes32 inputTokenURI,
        bytes32 inputTokenAttribute
    ) public pure virtual returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    approvedAddress,
                    inputTokenURI,
                    inputTokenAttribute
                )
            );
    }

    function _setTokenAttribute(
        uint256 tokenId,
        bytes32 inputTokenAttribute
    ) internal virtual {
        require(
            _ownerOf(tokenId) != address(0),
            "ERC721: URI query for nonexistent token"
        );

        require(inputTokenAttribute > 0, "attr can't be 0");
        require(
            !tokenAttributeExists(inputTokenAttribute),
            "attr already in use"
        );

        _tokenAttributes[tokenId] = inputTokenAttribute;
        _tokenAttributesToTokenIds[inputTokenAttribute] = tokenId;
    }
}

// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

error TokenDoesNotExist();

error TokenAttributeDoesNotExist();

error TokenIdCannotBeZero();

error TokenAttributeAlreadyExists();

/// @custom:security-contact aLANparty@protonmail.com
abstract contract TokenAttributes is ERC721 {
    // Maps token ids to their attributes
    mapping(uint256 => bytes32) private _tokenAttributes;

    // Inverses the map of token ids to attributes
    mapping(bytes32 => uint256) private _tokenAttributesToTokenIds;

    function tokenAttribute(
        uint256 tokenId
    ) public view virtual returns (bytes32) {
        if (_ownerOf(tokenId) == address(0)) {
            revert TokenDoesNotExist();
        }

        return _tokenAttributes[tokenId];
    }

    function tokenAttributeTokenId(
        bytes32 inputTokenAttribute
    ) public view virtual returns (uint256) {
        if (!tokenAttributeExists(inputTokenAttribute)) {
            revert TokenAttributeDoesNotExist();
        }

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
        if (_ownerOf(tokenId) == address(0)) {
            revert TokenDoesNotExist();
        }

        bool validTokenId = inputTokenAttribute > 0;
        if (!validTokenId) {
            revert TokenIdCannotBeZero();
        }

        if (tokenAttributeExists(inputTokenAttribute)) {
            revert TokenAttributeAlreadyExists();
        }

        _tokenAttributes[tokenId] = inputTokenAttribute;
        _tokenAttributesToTokenIds[inputTokenAttribute] = tokenId;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./DecodeSegmentedURI.sol";

import "hardhat/console.sol";

/// @custom:security-contact alanparty@protonmail.com
abstract contract CustomAttributeAndURI is ERC721, DecodeSegmentedURI {
    using ECDSA for bytes32;

    bytes4 internal _baseTokenURIPrefix;

    // Maps token ids to their URIs
    mapping(uint256 => bytes32) private _tokenURIs;

    // Maps token ids to their attributes
    mapping(uint256 => bytes32) private _tokenAttributes;

    // Inverses the map of token ids to attributes
    mapping(bytes32 => uint256) private _tokenAttributesToTokenIds;

    function _baseURIPrefix() internal view virtual returns (bytes4) {
        return _baseTokenURIPrefix;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "URI query on nonexistent token");

        bytes32 _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        if (_tokenURI.length > 0) {
            string memory decodedTokenURI = decodeTokenUri(_tokenURI);

            // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
            if (bytes(base).length > 0) {
                return string(abi.encodePacked(base, decodedTokenURI));
            }

            // If there is no base URI, return the token URI.
            return string(abi.encodePacked(decodedTokenURI));
        }

        return super.tokenURI(tokenId);
    }

    function tokenAttribute(uint256 tokenId)
        public
        view
        virtual
        returns (bytes32)
    {
        require(_exists(tokenId), "attr query on nonexistent token");

        return _tokenAttributes[tokenId];
    }

    function tokenAttributeTokenId(bytes32 _tokenAttribute)
        public
        view
        virtual
        returns (uint256)
    {
        require(
            tokenAttributeExists(_tokenAttribute),
            "id query on nonexistent attr"
        );

        return _tokenAttributesToTokenIds[_tokenAttribute];
    }

    function tokenAttributeExists(bytes32 _tokenAttribute)
        public
        view
        virtual
        returns (bool)
    {
        return
            _tokenAttributes[_tokenAttributesToTokenIds[_tokenAttribute]] ==
            _tokenAttribute;
    }

    function _setTokenURI(uint256 tokenId, bytes32 _tokenURI) internal virtual {
        require(_exists(tokenId), "URI set on nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    function _setTokenAttribute(uint256 tokenId, bytes32 _tokenAttribute)
        internal
        virtual
    {
        require(_exists(tokenId), "attr set for nonexistent token");
        require(_tokenAttribute > 0, "attr can't be 0");
        require(!tokenAttributeExists(_tokenAttribute), "attr already in use");

        _tokenAttributes[tokenId] = _tokenAttribute;
        _tokenAttributesToTokenIds[_tokenAttribute] = tokenId;
    }

    // function _burn(uint256 tokenId) internal virtual override {
    //     super._burn(tokenId);

    //     if (_tokenURIs[tokenId].length != 0) {
    //         delete _tokenURIs[tokenId];
    //     }

    //     if (_tokenAttributes[tokenId] != 0) {
    //         delete _tokenAttributesToTokenIds[_tokenAttributes[tokenId]];
    //         delete _tokenAttributes[tokenId];
    //     }
    // }

    function getTokenURIAndAttributeHash(
        bytes32 _tokenURI,
        bytes32 _tokenAttribute
    ) public pure virtual returns (bytes32) {
        return keccak256(abi.encodePacked(_tokenURI, _tokenAttribute));
    }

    function _getTokenURIAndAttributeHashSigner(
        bytes32 _tokenURI,
        bytes32 _tokenAttribute,
        bytes calldata signature
    ) internal pure virtual returns (address) {
        bytes32 message = getTokenURIAndAttributeHash(
            _tokenURI,
            _tokenAttribute
        );

        return message.toEthSignedMessageHash().recover(signature);
    }

    function decodeTokenUri(bytes32 _tokenURI)
        internal
        view
        returns (string memory decodedTokenURI)
    {
        return combineURISegments(_baseURIPrefix(), _tokenURI);
    }
}

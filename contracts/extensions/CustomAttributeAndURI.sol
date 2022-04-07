// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/// @custom:security-contact alanparty@protonmail.com
abstract contract CustomAttributeAndURI is ERC721 {
    using ECDSA for bytes32;

    // Maps token ids to their URIs
    mapping(uint256 => bytes32) private _tokenURIs;

    // Maps token ids to their attributes
    mapping(uint256 => bytes32) private _tokenAttributes;

    // Inverses the map of token ids to attributes
    mapping(bytes32 => uint256) private _tokenAttributesToTokenIds;

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
            // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
            if (bytes(base).length > 0) {
                return string(abi.encodePacked(base, toHex(_tokenURI)));
            }

            // If there is no base URI, return the token URI.
            return string(abi.encodePacked(toHex(_tokenURI)));
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

    function toHex16(bytes16 data) internal pure returns (bytes32 result) {
        result =
            (bytes32(data) &
                0xFFFFFFFFFFFFFFFF000000000000000000000000000000000000000000000000) |
            ((bytes32(data) &
                0x0000000000000000FFFFFFFFFFFFFFFF00000000000000000000000000000000) >>
                64);
        result =
            (result &
                0xFFFFFFFF000000000000000000000000FFFFFFFF000000000000000000000000) |
            ((result &
                0x00000000FFFFFFFF000000000000000000000000FFFFFFFF0000000000000000) >>
                32);
        result =
            (result &
                0xFFFF000000000000FFFF000000000000FFFF000000000000FFFF000000000000) |
            ((result &
                0x0000FFFF000000000000FFFF000000000000FFFF000000000000FFFF00000000) >>
                16);
        result =
            (result &
                0xFF000000FF000000FF000000FF000000FF000000FF000000FF000000FF000000) |
            ((result &
                0x00FF000000FF000000FF000000FF000000FF000000FF000000FF000000FF0000) >>
                8);
        result =
            ((result &
                0xF000F000F000F000F000F000F000F000F000F000F000F000F000F000F000F000) >>
                4) |
            ((result &
                0x0F000F000F000F000F000F000F000F000F000F000F000F000F000F000F000F00) >>
                8);
        result = bytes32(
            0x3030303030303030303030303030303030303030303030303030303030303030 +
                uint256(result) +
                (((uint256(result) +
                    0x0606060606060606060606060606060606060606060606060606060606060606) >>
                    4) &
                    0x0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F) *
                39
        );
    }

    function toHex(bytes32 data) internal pure returns (string memory) {
        return
            string(
                abi.encodePacked(
                    // "0x",
                    "",
                    toHex16(bytes16(data)),
                    toHex16(bytes16(data << 128))
                )
            );
    }
}

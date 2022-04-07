// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./extensions/CustomAttributeAndURI.sol";

/// @custom:security-contact alanparty@protonmail.com
contract SongADayPFPBuilder is
    ERC721,
    ERC721Enumerable,
    Pausable,
    AccessControl,
    ERC721Burnable,
    CustomAttributeAndURI
{
    using Counters for Counters.Counter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    Counters.Counter private _tokenIdCounter;

    string private _baseTokenURI;

    uint256 private _maxPerWallet = 2**256 - 1;

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) {
        _baseTokenURI = baseTokenURI;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function safeMint(
        address to,
        bytes32 _tokenURI,
        bytes32 _tokenAttribute,
        bytes calldata signature
    ) public virtual whenNotPaused {
        require(balanceOf(to) < _maxPerWallet, "has reached per wallet limit");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURIAndAttribute(
            tokenId,
            _tokenURI,
            _tokenAttribute,
            signature
        );
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721, ERC721Enumerable) whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // The following functions are overrides required by Solidity.

    // function _burn(uint256 tokenId)
    //     internal
    //     override(ERC721, CustomAttributeAndURI)
    // {
    //     super._burn(tokenId);
    // }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, CustomAttributeAndURI)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function setMaxPerWallet(uint256 maxPerWallet) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _maxPerWallet = maxPerWallet;
    }

    function changeTokenURIAndAttribute(
        uint256 tokenId,
        bytes32 _tokenURI,
        bytes32 _tokenAttribute,
        bytes calldata signature
    ) public virtual whenNotPaused {
        require(_exists(tokenId), "URI set of nonexistent token");
        require(ownerOf(tokenId) == _msgSender(), "URI set of unowned token");

        _setTokenURIAndAttribute(
            tokenId,
            _tokenURI,
            _tokenAttribute,
            signature
        );
    }

    function _setTokenURIAndAttribute(
        uint256 tokenId,
        bytes32 _tokenURI,
        bytes32 _tokenAttribute,
        bytes calldata signature
    ) internal virtual {
        address signer = _getTokenURIAndAttributeHashSigner(
            _tokenURI,
            _tokenAttribute,
            signature
        );

        require(
            hasRole(MINTER_ROLE, signer),
            "URI must be signed by mint role"
        );

        _setTokenURI(tokenId, _tokenURI);
        _setTokenAttribute(tokenId, _tokenAttribute);
    }
}

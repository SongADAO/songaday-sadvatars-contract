// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "./extensions/CustomAttributeAndURI.sol";

contract SongADayPFP is ERC721, ERC721Enumerable, ERC721Pausable, AccessControl, ERC721Burnable, CustomAttributeAndURI {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    uint256 private _nextTokenId;

    address public beneficiary;

    string private _baseTokenURI;

    constructor(
        string memory baseTokenURI,
        bytes4 baseTokenURIPrefix,
        address initialBeneficiary,
        address defaultAdmin,
        address pauser,
        address minter
    ) ERC721("SongADayPFP", "SONGADAYPFP") {
        _baseTokenURI = baseTokenURI;
        _baseTokenURIPrefix = baseTokenURIPrefix;
        beneficiary = initialBeneficiary;
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(PAUSER_ROLE, pauser);
        _grantRole(MINTER_ROLE, minter);
    }

    function setBaseTokenURI(string memory newBaseTokenURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = newBaseTokenURI;
    }

    function setBaseTokenURIPrefix(bytes4 newBaseTokenURIPrefix) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURIPrefix = newBaseTokenURIPrefix;
    }

    function setBeneficiary(address newBeneficiary) public onlyRole(DEFAULT_ADMIN_ROLE) {
        beneficiary = newBeneficiary;
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
        bytes32 inputTokenURI,
        bytes32 inputTokenAttribute,
        bytes calldata signature
    ) public virtual whenNotPaused {
        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        _setTokenURIAndAttribute(
            tokenId,
            to,
            inputTokenURI,
            inputTokenAttribute,
            signature
        );
    }

    function _setTokenURIAndAttribute(
        uint256 tokenId,
        address approvedAddress,
        bytes32 inputTokenURI,
        bytes32 inputTokenAttribute,
        bytes calldata signature
    ) internal virtual {
        address signer = _getTokenURIAndAttributeHashSigner(
            approvedAddress,
            inputTokenURI,
            inputTokenAttribute,
            signature
        );

        require(hasRole(MINTER_ROLE, signer), "URI must be signed by mint role");

        _setTokenURI(tokenId, inputTokenURI);
        _setTokenAttribute(tokenId, inputTokenAttribute);
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

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
}

// SPDX-License-Identifier: UNKNOWN

pragma solidity ^0.8.0;

/**
 * @dev Base 32 operations.
 */
contract BaseConversion {
    function cutBytesIntoBytes30(bytes memory input)
        internal
        pure
        returns (bytes memory digest1, bytes memory digest2)
    {
        uint256 i = 0;
        uint256 wordlength = input.length;
        uint256 midpoint = 30;

        digest1 = new bytes(midpoint);
        digest2 = new bytes(wordlength - midpoint);

        for (i = 0; i < midpoint; i++) {
            digest1[i] = input[i];
        }

        for (i = 0; i < wordlength - midpoint; i++) {
            digest2[i] = input[i + midpoint];
        }

        return (digest1, digest2);
    }

    // prettier-ignore
    function toHex16(bytes16 data) internal pure returns (bytes32 result) {
    result = (bytes32(data) & 0xFFFFFFFFFFFFFFFF000000000000000000000000000000000000000000000000) | ((bytes32(data) & 0x0000000000000000FFFFFFFFFFFFFFFF00000000000000000000000000000000) >> 64);
    result = (result & 0xFFFFFFFF000000000000000000000000FFFFFFFF000000000000000000000000) | ((result & 0x00000000FFFFFFFF000000000000000000000000FFFFFFFF0000000000000000) >> 32);
    result = (result & 0xFFFF000000000000FFFF000000000000FFFF000000000000FFFF000000000000) | ((result & 0x0000FFFF000000000000FFFF000000000000FFFF000000000000FFFF00000000) >> 16);
    result = (result & 0xFF000000FF000000FF000000FF000000FF000000FF000000FF000000FF000000) | ((result & 0x00FF000000FF000000FF000000FF000000FF000000FF000000FF000000FF0000) >> 8);
    result = ((result & 0xF000F000F000F000F000F000F000F000F000F000F000F000F000F000F000F000) >> 4) | ((result & 0x0F000F000F000F000F000F000F000F000F000F000F000F000F000F000F000F00) >> 8);
    result = bytes32(0x3030303030303030303030303030303030303030303030303030303030303030 + uint256(result) + (((uint256(result) + 0x0606060606060606060606060606060606060606060606060606060606060606) >> 4) & 0x0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F0F) * 39);
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

    // Convert an hexadecimal character to their value
    function fromHexChar(uint8 c) public pure returns (uint8) {
        if (bytes1(c) >= bytes1("0") && bytes1(c) <= bytes1("9")) {
            return c - uint8(bytes1("0"));
        }

        if (bytes1(c) >= bytes1("a") && bytes1(c) <= bytes1("f")) {
            return 10 + c - uint8(bytes1("a"));
        }

        if (bytes1(c) >= bytes1("A") && bytes1(c) <= bytes1("F")) {
            return 10 + c - uint8(bytes1("A"));
        }
    }

    // Convert an hexadecimal string to raw bytes
    function fromHex(string memory s) public pure returns (bytes memory) {
        bytes memory ss = bytes(s);
        require(ss.length % 2 == 0); // length must be even
        bytes memory r = new bytes(ss.length / 2);
        for (uint256 i = 0; i < ss.length / 2; ++i) {
            r[i] = bytes1(
                fromHexChar(uint8(ss[2 * i])) *
                    16 +
                    fromHexChar(uint8(ss[2 * i + 1]))
            );
        }
        return r;
    }

    function _get5BitsAsUint(bytes30 input, uint8 position)
        private
        pure
        returns (uint8)
    {
        bytes30 temp = input;
        temp = temp << (position * 5);
        bytes30 mask = 0xf80000000000000000000000000000000000000000000000000000000000;
        temp = temp & mask;
        temp = temp >> 235; // 32 * 8 - 5
        return uint8(uint240((temp)));
    }

    function _uintToChar(uint8 _conv, uint8 _addand)
        private
        pure
        returns (bytes1)
    {
        if (_conv < 26) {
            return bytes1(_conv + _addand);
        } else {
            return bytes1(_conv + 24);
        }
    }

    function _bytes30ToString(
        bytes30 input,
        uint8 length,
        bytes1 multibase
    ) private pure returns (bytes memory) {
        bytes memory bytesArray = new bytes(length);
        uint8 i = 0;
        uint8 addand = multibase == 0x42 ? 65 : 97;
        for (i = 0; i < length; i++) {
            uint8 bit = _get5BitsAsUint(input, i);
            bytesArray[i] = _uintToChar(bit, addand);
        }
        return bytesArray;
    }

    function byteArraysToBase32String(
        bytes30 digest1,
        bytes30 digest2,
        bytes1 multibase,
        uint16 length
    ) internal pure returns (string memory) {
        if (length > 240) {
            bytes memory string1 = _bytes30ToString(digest1, 48, multibase);
            bytes memory string2 = _bytes30ToString(
                digest2,
                uint8((length - 240) / 5),
                multibase
            );
            return string(bytes.concat(string1, string2));
        } else {
            return
                string(
                    bytes.concat(
                        _bytes30ToString(digest1, uint8(length / 5), multibase)
                    )
                );
        }
    }
}

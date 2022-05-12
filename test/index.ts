import { expect } from "chai";
import { ethers } from "hardhat";
// import * as base32 from "hi-base32";

describe("SongADayPFP", function () {
  // let token: Contract = null;
  let token: any = null;

  // let owner: Signer = null;
  let owner: any = null;

  // let bob: Signer = null;
  let bob: any = null;

  // let jane: Signer = null;
  let jane: any = null;

  // let sara: Signer = null;
  let sara: any = null;

  const ZeroAddress: string = "0x0000000000000000000000000000000000000000";

  let brightidVerifier: any = null;

  const brightidContext: string =
    "0x736f756c626f756e640000000000000000000000000000000000000000000000";

  const contractName: string = "SongADayPFPBuilder";

  const tokenName: string = "SongADayPFP";

  const tokenSymbol: string = "SONGADAYPFP";

  const baseTokenURI: string = "ipfs://b";

  const baseTokenURIPrefix: string = "0x01551220";
  // const baseTokenURIPrefix: string = "0x0155122000000000000000000000000000000000000000000000000000000000";

  const mints: any[] = [
    {
      ipfsHash: "bafkreidpboogtrcyyz62y2i2vgk2yjd3iianf77i3wdarcvxwyezuzapmu",
      ipfsHashBase16:
        "f015512206f0b9c69c458c67dac691aa995ac247b4200d2ffe8dd86088ab7b6099a640f65",
      tokenURI: "afkreidpboogtrcyyz62y2i2vgk2yjd3iianf77i3wdarcvxwyezuzapmu",
      tokenAttribute:
        "0x0000000000000000000000000000000000000000000000000001010101010101",
      tokenAttributeDecimal: 282578800148737,
      tokenURIAndAttributeHash:
        "0x16825a98bfa551929f99636d76a74ad73c6cc21d77db5be380bceb3febec116b",
      uuid: "this-is-a-test-uuid",
      uuidHash:
        "0xf773232c5d9bc1766462716540175b16f671670128904fa19a2fc7148fc45c68",
      nonce: "1",
      hashToBind:
        "0xe7b84d2b267da91a808104c53c158dbb6a305599c8618632efa6325e512d96ea",
    },
    {
      ipfsHash: "bafkreifzdy5gyz6pcmwoeg4hubvpzbrx3qkxpfjdzu3ujwxlbu2on4cmhe",
      ipfsHashBase16:
        "f01551220b91e3a6c67cf132ce21b87a06afc8637dc15779523cd3744daeb0d34e6f04c39",
      tokenURI: "afkreifzdy5gyz6pcmwoeg4hubvpzbrx3qkxpfjdzu3ujwxlbu2on4cmhe",
      tokenAttribute:
        "0x0000000000000000000000000000000000000000000000000001010101010f06",
      tokenAttributeDecimal: 282578800152326,
      tokenURIAndAttributeHash:
        "0xe6cff0a42fc451f6883def7b95de32cc198b7d6269cb01253fe2b3c1b5de5928",
      uuid: "this-is-a-test-uuid2",
      uuidHash:
        "0xfea4821353fdd0be7c67040afb2a9801dce110f5d5efa11942aaa3e18254f5a7",
      nonce: "2",
      hashToBind:
        "0x418e35b208685734a1da43ec2680894ef7da4acada7dcb756f667fd12c2968dc",
    },
    {
      ipfsHash: "bafkreifslg7b64ajrhfh763624bpsinhpb3q5comecrq5ggtkkcctzveqy",
      ipfsHashBase16:
        "f01551220b259be1f700989ca7ffb7ed702f921a778770e89cc20a30e98d3528429e6a486",
      tokenURI: "afkreifslg7b64ajrhfh763624bpsinhpb3q5comecrq5ggtkkcctzveqy",
      tokenAttribute:
        "0x0000000000000000000000000000000000000000000000000001010101010f02",
      tokenAttributeDecimal: 282578800152322,
      tokenURIAndAttributeHash:
        "0x2f7b8c092e2877ac58f84a242a3c6e79d9ab413a888c4753223fb1572e532fdc",
      uuid: "this-is-a-test-uuid3",
      uuidHash:
        "0x1199cccbed3ae9aa44135defe47a8ed29fc073e6567cf2c6b5e6f84c0bcb6cc9",
      nonce: "3",
      hashToBind:
        "0x0fb9704d20174a85a28d71e360488b0237783d0d1c610473729758f94d29092d",
    },
    // {
    //   ipfsHash: "bafkreih6vgjrirrhhk6trp7jgfspudz5ahkk5gkv6n77hhkrb3jg5anvri",
    //   ipfsHashBase16:
    //     "f01551220fea9931446273abd38bfe93164fa0f3d01d4ae9955f37ff39d510ed26e81b58a",
    //   tokenURI: "afkreih6vgjrirrhhk6trp7jgfspudz5ahkk5gkv6n77hhkrb3jg5anvri",
    //   tokenAttribute:
    //     "0x0000000000000000000000000000000000000000000000000001010101010f02",
    //   tokenAttributeDecimal: 282578800152322,
    //   tokenURIAndAttributeHash:
    //     "0x2f7b8c092e2877ac58f84a242a3c6e79d9ab413a888c4753223fb1572e532fdc",
    // },
  ];

  // it("base test", async function () {
  //   const b32 = "afkreih6vgjrirrhhk6trp7jgfspudz5ahkk5gkv6n77hhkrb3jg5anvri";

  //   const b16 =
  //     "01551220fea9931446273abd38bfe93164fa0f3d01d4ae9955f37ff39d510ed26e81b58a";
  //     // "fea9931446273abd38bfe93164fa0f3d01d4ae9955f37ff39d510ed26e81b58a";
  //   console.log(b16);

  //   const b16Bytes = hexToBytes(b16);
  //   console.log(b16Bytes);

  //   const b32Encoded = base32.encode(b16Bytes);
  //   console.log(b32Encoded.toLowerCase());
  // });

  // it("correctly assigns metadata URI to NFT", async function () {
  //   await mint(bob, mints[0]);

  //   expect(await token.tokenURI(0)).to.equal(
  //     `${baseTokenURI}${mints[0].tokenURI}`
  //   );
  // });

  // function hexToBytes(hex: string) {
  //   for (var bytes = [], c = 0; c < hex.length; c += 2) {
  //     bytes.push(parseInt(hex.substr(c, 2), 16));
  //   }

  //   return bytes;
  // }

  // function toHexString(byteArray: any) {
  //   return Array.from(byteArray, (byte: any) => {
  //     return ("0" + (byte & 0xff).toString(16)).slice(-2);
  //   }).join("");
  // }

  // function ipfsToBase16(ipfsHash: string): string {
  //   const ipfsHashUpper: string = ipfsHash.toUpperCase();

  //   if (!ipfsHashUpper.startsWith("B")) {
  //     throw new Error("Invalid IPFS Hash Prefix");
  //   }

  //   const ipfsHashUpperNoPrefix: string = ipfsHashUpper.substring(1);

  //   const ipfsHashUpperNoPrefixBytes = base32.decode.asBytes(
  //     ipfsHashUpperNoPrefix
  //   );

  //   const ipfsHashBase16: string =
  //     "f" + toHexString(ipfsHashUpperNoPrefixBytes).toLowerCase();

  //   return ipfsHashBase16;
  // }

  // function ipfsToBytes32(ipfsHash: string): string {
  //   return ipfsBase16ToBytes32(ipfsToBase16(ipfsHash));
  // }

  function ipfsBase16ToBytes32(ipfsHashBase16: string): string {
    const ipfsHashBase16Upper = ipfsHashBase16.toUpperCase();

    if (!ipfsHashBase16Upper.startsWith("F01551220")) {
      throw new Error("Invalid IPFS Hash Prefix");
    }

    const ipfsHashBase16Bytes32: string =
      "0x" + ipfsHashBase16Upper.slice(9).toLowerCase();

    return ipfsHashBase16Bytes32;
  }

  function strToByte32(str: string) {
    return "0x" + Buffer.from(str).toString("hex").padEnd(64, "0");
  }

  async function mint(minter: any, params: any) {
    const signature: string = await owner.signMessage(
      ethers.utils.arrayify(params.tokenURIAndAttributeHash)
    );

    // const hashToBind: string = await token.getUUIDHash(
    //   minter.address,
    //   params.uuidHash,
    //   params.nonce
    // );

    // const bid721Signature: string = await minter.signMessage(
    //   ethers.utils.arrayify(hashToBind)
    // );

    const contextIds = [params.uuid];
    const contextIdsByte32 = contextIds.map((contextId) => {
      return strToByte32(contextId);
    });

    const timestamp = Date.now();

    const validateMessage = ethers.utils.solidityKeccak256(
      ["bytes32", "bytes32[]", "uint256"],
      [brightidContext, contextIdsByte32, timestamp]
    );

    // const validateSignature: string = await brightidVerifier.signMessage(
    //   ethers.utils.arrayify(validateMessage)
    // );
    // const validateSplitSignature =
    //   ethers.utils.splitSignature(validateSignature);

    const signingKey = new ethers.utils.SigningKey(brightidVerifier.privateKey);
    const validateSplitSignature = await signingKey.signDigest(
      ethers.utils.arrayify(validateMessage)
    );

    await token
      .connect(minter)
      // .bind(minter.address, params.uuidHash, params.nonce, bid721Signature);
      .bind(minter.address, params.uuidHash);

    return await token
      .connect(minter)
      .safeMint(
        minter.address,
        contextIdsByte32,
        timestamp,
        validateSplitSignature.v,
        validateSplitSignature.r,
        validateSplitSignature.s,
        ipfsBase16ToBytes32(params.ipfsHashBase16),
        params.tokenAttribute,
        signature
      );
  }

  async function changeTokenURIAndAttribute(
    minter: any,
    tokenId: number,
    params: any
  ) {
    const signature: string = await owner.signMessage(
      ethers.utils.arrayify(params.tokenURIAndAttributeHash)
    );

    return await token
      .connect(minter)
      .changeTokenURIAndAttribute(
        tokenId,
        ipfsBase16ToBytes32(params.ipfsHashBase16),
        params.tokenAttribute,
        signature
      );
  }

  beforeEach(async () => {
    brightidVerifier = ethers.Wallet.createRandom();

    const contract = await ethers.getContractFactory(contractName);

    token = await contract.deploy(
      brightidVerifier.address,
      brightidContext,
      tokenName,
      tokenSymbol,
      baseTokenURI,
      baseTokenURIPrefix
    );

    [owner, bob, jane, sara] = await ethers.getSigners();

    await token.deployed();
  });

  // ERC721
  // ===========================================================================

  describe("ERC721", function () {
    it("returns correct balanceOf", async function () {
      await mint(bob, mints[0]);
      expect(await token.balanceOf(bob.address)).to.equal(1);

      // await mint(bob, mints[1]);
      // expect(await token.balanceOf(bob.address)).to.equal(2);

      // await mint(sara, mints[2]);
      // expect(await token.balanceOf(bob.address)).to.equal(2);
      // expect(await token.balanceOf(sara.address)).to.equal(1);

      await mint(sara, mints[2]);
      expect(await token.balanceOf(bob.address)).to.equal(1);
      expect(await token.balanceOf(sara.address)).to.equal(1);
    });

    it("finds the correct owner of NFT by id", async function () {
      await mint(bob, mints[0]);
      expect(await token.ownerOf(0)).to.equal(bob.address);

      await mint(jane, mints[1]);
      expect(await token.ownerOf(0)).to.equal(bob.address);
      expect(await token.ownerOf(1)).to.equal(jane.address);

      await mint(sara, mints[2]);
      expect(await token.ownerOf(0)).to.equal(bob.address);
      expect(await token.ownerOf(1)).to.equal(jane.address);
      expect(await token.ownerOf(2)).to.equal(sara.address);
    });
  });

  // ERC721::transferable
  // ===========================================================================

  describe("ERC721::transferable", function () {
    // it("correctly grants an approval", async function () {
    //   await mint(bob, mints[0]);
    //   expect(await token.connect(bob).approve(sara.address, 0)).to.emit(
    //     token,
    //     "Approval"
    //   );
    //   expect(await token.getApproved(0)).to.equal(sara.address);
    // });
    // it("correctly revokes an approval", async function () {
    //   await mint(bob, mints[0]);
    //   await token.connect(bob).approve(sara.address, 0);
    //   await token.connect(bob).approve(ZeroAddress, 0);
    //   expect(await token.getApproved(0)).to.equal(ZeroAddress);
    // });
    // it("correctly grants an approval for all", async function () {
    //   await mint(bob, mints[0]);
    //   expect(
    //     await token.connect(bob).setApprovalForAll(sara.address, true)
    //   ).to.emit(token, "ApproveForAll");
    //   expect(await token.isApprovedForAll(bob.address, sara.address)).to.equal(
    //     true
    //   );
    // });
    // it("correct revokes an approval for all", async function () {
    //   await mint(bob, mints[0]);
    //   await token.connect(bob).setApprovalForAll(sara.address, true);
    //   await token.connect(bob).setApprovalForAll(sara.address, false);
    //   expect(await token.isApprovedForAll(bob.address, sara.address)).to.equal(
    //     false
    //   );
    // });
    // it("correctly approves and transfers a specific NFT", async function () {
    //   await mint(bob, mints[0]);
    //   await token.connect(bob).approve(sara.address, 0);
    //   await token.connect(sara).transferFrom(bob.address, jane.address, 0);
    //   expect(await token.balanceOf(bob.address)).to.equal(0);
    //   expect(await token.balanceOf(jane.address)).to.equal(1);
    //   expect(await token.ownerOf(0)).to.equal(jane.address);
    // });
    // it("correctly approves and transfers multiple NFTs with an approval for all", async function () {
    //   await token.connect(bob).setApprovalForAll(sara.address, true);
    //   await mint(bob, mints[0]);
    //   await token.connect(sara).transferFrom(bob.address, jane.address, 0);
    //   await mint(bob, mints[1]);
    //   await token.connect(sara).transferFrom(bob.address, jane.address, 1);
    //   expect(await token.balanceOf(bob.address)).to.equal(0);
    //   expect(await token.balanceOf(jane.address)).to.equal(2);
    //   expect(await token.ownerOf(0)).to.equal(jane.address);
    //   expect(await token.ownerOf(1)).to.equal(jane.address);
    // });
    // it("correctly approves and safely transfers a specific NFT", async function () {
    //   await mint(bob, mints[0]);
    //   await token.connect(bob).approve(sara.address, 0);
    //   await token.connect(sara).safeTransferFrom(bob.address, jane.address, 0);
    //   expect(await token.balanceOf(bob.address)).to.equal(0);
    //   expect(await token.balanceOf(jane.address)).to.equal(1);
    //   expect(await token.ownerOf(0)).to.equal(jane.address);
    // });
    // it("correctly approves and safely transfers multiple NFTs with an approval for all", async function () {
    //   await token.connect(bob).setApprovalForAll(sara.address, true);
    //   await mint(bob, mints[0]);
    //   await token.connect(sara).safeTransferFrom(bob.address, jane.address, 0);
    //   await mint(bob, mints[1]);
    //   await token.connect(sara).safeTransferFrom(bob.address, jane.address, 1);
    //   expect(await token.balanceOf(bob.address)).to.equal(0);
    //   expect(await token.balanceOf(jane.address)).to.equal(2);
    //   expect(await token.ownerOf(0)).to.equal(jane.address);
    //   expect(await token.ownerOf(1)).to.equal(jane.address);
    // });
  });

  // ERC721Burnable
  // ===========================================================================

  describe("ERC721Burnable", function () {
    // it("correctly burns a NFT", async function () {
    //   await mint(bob, mints[0]);
    //   expect(await token.connect(bob).burn(0)).to.emit(token, "Transfer");
    //   expect(await token.balanceOf(bob.address)).to.equal(0);
    //   await expect(token.ownerOf(0)).to.be.revertedWith(
    //     "ERC721: owner query for nonexistent token"
    //   );
    // });
  });

  // ERC721Metadata
  // ===========================================================================

  describe("ERC721Metadata", function () {
    it("returns the correct contract name", async function () {
      expect(await token.name()).to.equal(tokenName);
    });

    it("returns the correct contract symbol", async function () {
      expect(await token.symbol()).to.equal(tokenSymbol);
    });

    it("correctly assigns metadata URI to NFT", async function () {
      await mint(bob, mints[0]);
      expect(await token.tokenURI(0)).to.equal(
        `${baseTokenURI}${mints[0].tokenURI}`
      );

      await mint(jane, mints[1]);
      expect(await token.tokenURI(0)).to.equal(
        `${baseTokenURI}${mints[0].tokenURI}`
      );
      expect(await token.tokenURI(1)).to.equal(
        `${baseTokenURI}${mints[1].tokenURI}`
      );

      await mint(sara, mints[2]);
      expect(await token.tokenURI(0)).to.equal(
        `${baseTokenURI}${mints[0].tokenURI}`
      );
      expect(await token.tokenURI(1)).to.equal(
        `${baseTokenURI}${mints[1].tokenURI}`
      );
      expect(await token.tokenURI(2)).to.equal(
        `${baseTokenURI}${mints[2].tokenURI}`
      );
    });
  });

  // ERC721Enumerable
  // ===========================================================================

  describe("ERC721Enumerable", function () {
    it("correctly returns total supply", async function () {
      await mint(bob, mints[0]);
      expect(await token.totalSupply()).to.equal(1);

      await mint(jane, mints[1]);
      expect(await token.totalSupply()).to.equal(2);

      await mint(sara, mints[2]);
      expect(await token.totalSupply()).to.equal(3);
    });

    it("correctly looks up token by owner and index", async function () {
      await mint(bob, mints[0]);
      expect(await token.tokenOfOwnerByIndex(bob.address, 0)).to.equal(0);

      await mint(jane, mints[1]);
      expect(await token.tokenOfOwnerByIndex(bob.address, 0)).to.equal(0);
      expect(await token.tokenOfOwnerByIndex(jane.address, 0)).to.equal(1);

      // await mint(bob, mints[2]);
      // expect(await token.tokenOfOwnerByIndex(bob.address, 0)).to.equal(0);
      // expect(await token.tokenOfOwnerByIndex(jane.address, 0)).to.equal(1);
      // expect(await token.tokenOfOwnerByIndex(bob.address, 1)).to.equal(2);
    });

    it("correctly looks up token by index", async function () {
      await mint(bob, mints[0]);
      expect(await token.tokenByIndex(0)).to.equal(0);

      await mint(jane, mints[1]);
      expect(await token.tokenByIndex(0)).to.equal(0);
      expect(await token.tokenByIndex(1)).to.equal(1);

      await mint(sara, mints[2]);
      expect(await token.tokenByIndex(0)).to.equal(0);
      expect(await token.tokenByIndex(1)).to.equal(1);
      expect(await token.tokenByIndex(2)).to.equal(2);
    });
  });

  // CustomAttributeAndURI
  // ===========================================================================

  describe("CustomAttributeAndURI", function () {
    it("correctly generates uri and attribute hash", async function () {
      expect(
        await token
          .connect(owner)
          .getTokenURIAndAttributeHash(
            ipfsBase16ToBytes32(mints[0].ipfsHashBase16),
            mints[0].tokenAttribute
          )
      ).to.equal(mints[0].tokenURIAndAttributeHash);

      expect(
        await token
          .connect(owner)
          .getTokenURIAndAttributeHash(
            ipfsBase16ToBytes32(mints[1].ipfsHashBase16),
            mints[1].tokenAttribute
          )
      ).to.equal(mints[1].tokenURIAndAttributeHash);
    });

    it("correctly assigns attribute string to NFT", async function () {
      await mint(bob, mints[0]);

      expect(await token.tokenAttribute(0)).to.equal(mints[0].tokenAttribute);
    });

    it("correctly looks up token id when searching by attribute", async function () {
      await mint(bob, mints[0]);
      await mint(sara, mints[1]);

      expect(
        await token.tokenAttributeTokenId(mints[0].tokenAttribute)
      ).to.equal(0);
      expect(
        await token.tokenAttributeTokenId(mints[1].tokenAttribute)
      ).to.equal(1);
    });

    it("correctly allows altering metadata URI and attributes after mint by owner", async function () {
      await mint(bob, mints[0]);

      expect(await token.tokenURI(0)).to.equal(
        `${baseTokenURI}${mints[0].tokenURI}`
      );

      expect(await token.tokenAttribute(0)).to.equal(mints[0].tokenAttribute);

      await changeTokenURIAndAttribute(bob, 0, mints[1]);

      expect(await token.tokenURI(0)).to.equal(
        `${baseTokenURI}${mints[1].tokenURI}`
      );

      expect(await token.tokenAttribute(0)).to.equal(mints[1].tokenAttribute);
    });

    it("correctly prevents altering metadata URI and attributes for non-existing tokens", async function () {
      await mint(bob, mints[0]);

      expect(await token.tokenURI(0)).to.equal(
        `${baseTokenURI}${mints[0].tokenURI}`
      );

      expect(await token.tokenAttribute(0)).to.equal(mints[0].tokenAttribute);

      await expect(
        changeTokenURIAndAttribute(bob, 1, mints[1])
      ).to.be.revertedWith("URI set of nonexistent token");
    });

    it("correctly prevents altering metadata URI and attributes for unowned tokens", async function () {
      await mint(bob, mints[0]);

      expect(await token.tokenURI(0)).to.equal(
        `${baseTokenURI}${mints[0].tokenURI}`
      );

      expect(await token.tokenAttribute(0)).to.equal(mints[0].tokenAttribute);

      await expect(
        changeTokenURIAndAttribute(sara, 0, mints[1])
      ).to.be.revertedWith("URI set of unowned token");
    });
  });

  // CustomAttributeAndURI::mintable
  // ===========================================================================

  describe("CustomAttributeAndURI::mintable", function () {
    it("correctly mints a NFT", async function () {
      expect(await mint(bob, mints[0])).emit(token, "Transfer");
      expect(await token.balanceOf(bob.address)).to.equal(1);
    });

    it("correctly prevents minting more than per wallet limit", async function () {
      await token.connect(owner).setMaxPerWallet(1);
      await mint(bob, mints[0]);
      await expect(mint(bob, mints[1])).to.be.revertedWith(
        "has reached max per wallet"
      );

      await token.connect(owner).setMaxPerWallet(2);
      await mint(bob, mints[1]);
      await expect(mint(bob, mints[2])).to.be.revertedWith(
        "has reached max per wallet"
      );

      await mint(sara, mints[2]);
      expect(await token.balanceOf(bob.address)).to.equal(2);
      expect(await token.balanceOf(sara.address)).to.equal(1);
    });

    it("correctly prevents minting NFTs with identical token attributes", async function () {
      await mint(bob, mints[0]);

      await expect(mint(sara, mints[0])).to.be.revertedWith(
        "attr already in use"
      );
    });

    it("correctly allows minting NFTs with different token attributes", async function () {
      await mint(bob, mints[0]);
      await mint(bob, mints[1]);

      expect(await token.balanceOf(bob.address)).to.equal(2);
    });
  });

  // CustomAttributeAndURI::pausable
  // ===========================================================================

  describe("CustomAttributeAndURI::pausable", function () {
    it("correctly prevents minting when contract is paused", async function () {
      await token.connect(owner).pause();

      await expect(mint(bob, mints[0])).to.be.revertedWith("Pausable: paused");
    });

    it("correctly prevents altering metadata URI and attributes when contract is paused", async function () {
      await mint(bob, mints[0]);

      await token.connect(owner).pause();

      await expect(
        changeTokenURIAndAttribute(bob, 0, mints[1])
      ).to.be.revertedWith("Pausable: paused");
    });
  });

  // BID721
  // ===========================================================================

  describe("BID721", function () {
    it("is correctly rescued", async function () {});
  });

  // BrightIDValidatorBase
  // ===========================================================================

  describe("BrightIDValidatorBase", function () {
    it("can set context", async function () {
      const testContext =
        "0x736f756c626f756e640000000000000000000000000f000000000000ab000000";
      await token.connect(owner).setContext(testContext);
      expect(await token.getContext()).to.equal(testContext);
    });

    it("can set verifier", async function () {
      const testVerifier = bob.address;
      await token.connect(owner).setVerifier(testVerifier);
      expect(await token.getVerifier()).to.equal(testVerifier);
    });
  });

  // BrightIDValidatorOwnership
  // ===========================================================================

  describe("BrightIDValidatorOwnership", function () {
    it("can hash uuid", async function () {
      expect(await token.hashUUID(strToByte32(mints[0].uuid))).to.equal(
        mints[0].uuidHash
      );
      expect(await token.hashUUID(strToByte32(mints[1].uuid))).to.equal(
        mints[1].uuidHash
      );
      expect(await token.hashUUID(strToByte32(mints[2].uuid))).to.equal(
        mints[2].uuidHash
      );
    });

    it("can get uuid hash", async function () {
      expect(
        await token.getUUIDHash(bob.address, mints[0].uuidHash, mints[0].nonce)
      ).to.equal(mints[0].hashToBind);

      expect(
        await token.getUUIDHash(jane.address, mints[1].uuidHash, mints[1].nonce)
      ).to.equal(mints[1].hashToBind);

      expect(
        await token.getUUIDHash(sara.address, mints[2].uuidHash, mints[2].nonce)
      ).to.equal(mints[2].hashToBind);
    });

    it("can bind", async function () {
      expect(
        await token.connect(bob).bind(bob.address, mints[0].uuidHash)
      ).to.emit(bob.address, "AddressBound");

      expect(await token.isBound(bob.address, mints[0].uuidHash)).to.equal(
        true
      );
    });

    it("can bind via relay", async function () {
      const signature: string = await bob.signMessage(
        ethers.utils.arrayify(mints[0].hashToBind)
      );

      expect(
        await token
          .connect(sara)
          .bindViaRelay(
            bob.address,
            mints[0].uuidHash,
            mints[0].nonce,
            signature
          )
      ).to.emit(bob.address, "AddressBound");

      expect(await token.isBound(bob.address, mints[0].uuidHash)).to.equal(
        true
      );
    });
  });
});

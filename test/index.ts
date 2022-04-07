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

  const contractName: string = "SongADayPFPBuilder";

  const tokenName: string = "SongADayPFP";

  const tokenSymbol: string = "SONGADAYPFP";

  const baseTokenURI: string = "ipfs://f01551220";

  const mints: any[] = [
    {
      ipfsHash: "bafkreidpboogtrcyyz62y2i2vgk2yjd3iianf77i3wdarcvxwyezuzapmu",
      ipfsHashBase16:
        "f015512206f0b9c69c458c67dac691aa995ac247b4200d2ffe8dd86088ab7b6099a640f65",
      tokenURI:
        "6f0b9c69c458c67dac691aa995ac247b4200d2ffe8dd86088ab7b6099a640f65",
      tokenAttribute:
        "0x0000000000000000000000000000000000000000000000000001010101010101",
      tokenAttributeDecimal: 282578800148737,
      tokenURIAndAttributeHash:
        "0x16825a98bfa551929f99636d76a74ad73c6cc21d77db5be380bceb3febec116b",
    },
    {
      ipfsHash: "bafkreifzdy5gyz6pcmwoeg4hubvpzbrx3qkxpfjdzu3ujwxlbu2on4cmhe",
      ipfsHashBase16:
        "f01551220b91e3a6c67cf132ce21b87a06afc8637dc15779523cd3744daeb0d34e6f04c39",
      tokenURI:
        "b91e3a6c67cf132ce21b87a06afc8637dc15779523cd3744daeb0d34e6f04c39",
      tokenAttribute:
        "0x0000000000000000000000000000000000000000000000000001010101010f06",
      tokenAttributeDecimal: 282578800152326,
      tokenURIAndAttributeHash:
        "0xe6cff0a42fc451f6883def7b95de32cc198b7d6269cb01253fe2b3c1b5de5928",
    },
    {
      ipfsHash: "bafkreifslg7b64ajrhfh763624bpsinhpb3q5comecrq5ggtkkcctzveqy",
      ipfsHashBase16:
        "f01551220b259be1f700989ca7ffb7ed702f921a778770e89cc20a30e98d3528429e6a486",
      tokenURI:
        "b259be1f700989ca7ffb7ed702f921a778770e89cc20a30e98d3528429e6a486",
      tokenAttribute:
        "0x0000000000000000000000000000000000000000000000000001010101010f02",
      tokenAttributeDecimal: 282578800152322,
      tokenURIAndAttributeHash:
        "0x2f7b8c092e2877ac58f84a242a3c6e79d9ab413a888c4753223fb1572e532fdc",
    },
  ];

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

  async function mint(minter: any, params: any) {
    const signature: string = await owner.signMessage(
      ethers.utils.arrayify(params.tokenURIAndAttributeHash)
    );

    return await token
      .connect(minter)
      .safeMint(
        minter.address,
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
    const contract = await ethers.getContractFactory(contractName);
    token = await contract.deploy(tokenName, tokenSymbol, baseTokenURI);

    [owner, bob, jane, sara] = await ethers.getSigners();

    await token.deployed();
  });

  it("returns the correct contract name", async function () {
    expect(await token.name()).to.equal(tokenName);
  });

  it("returns the correct contract symbol", async function () {
    expect(await token.symbol()).to.equal(tokenSymbol);
  });

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

  it("correctly mints a NFT", async function () {
    expect(await mint(bob, mints[0])).emit(token, "Transfer");
    expect(await token.balanceOf(bob.address)).to.equal(1);
  });

  it("returns correct balanceOf", async function () {
    await mint(bob, mints[0]);
    expect(await token.balanceOf(bob.address)).to.equal(1);
    await mint(bob, mints[1]);
    expect(await token.balanceOf(bob.address)).to.equal(2);
    await mint(sara, mints[2]);
    expect(await token.balanceOf(sara.address)).to.equal(1);
  });

  it("finds the correct owner of NFT by id", async function () {
    await mint(bob, mints[0]);

    expect(await token.ownerOf(0)).to.equal(bob.address);
  });

  it("correctly grants an approval", async function () {
    await mint(bob, mints[0]);

    expect(await token.connect(bob).approve(sara.address, 0)).to.emit(
      token,
      "Approval"
    );
    expect(await token.getApproved(0)).to.equal(sara.address);
  });

  it("correctly revokes an approval", async function () {
    await mint(bob, mints[0]);
    await token.connect(bob).approve(sara.address, 0);
    await token.connect(bob).approve(ZeroAddress, 0);

    expect(await token.getApproved(0)).to.equal(ZeroAddress);
  });

  it("correctly grants an approval for all", async function () {
    await mint(bob, mints[0]);

    expect(
      await token.connect(bob).setApprovalForAll(sara.address, true)
    ).to.emit(token, "ApproveForAll");
    expect(await token.isApprovedForAll(bob.address, sara.address)).to.equal(
      true
    );
  });

  it("correct revokes an approval for all", async function () {
    await mint(bob, mints[0]);
    await token.connect(bob).setApprovalForAll(sara.address, true);
    await token.connect(bob).setApprovalForAll(sara.address, false);

    expect(await token.isApprovedForAll(bob.address, sara.address)).to.equal(
      false
    );
  });

  it("correctly approves and transfers a specific NFT", async function () {
    await mint(bob, mints[0]);
    await token.connect(bob).approve(sara.address, 0);
    await token.connect(sara).transferFrom(bob.address, jane.address, 0);

    expect(await token.balanceOf(bob.address)).to.equal(0);
    expect(await token.balanceOf(jane.address)).to.equal(1);
    expect(await token.ownerOf(0)).to.equal(jane.address);
  });

  it("correctly approves and transfers multiple NFTs with an approval for all", async function () {
    await token.connect(bob).setApprovalForAll(sara.address, true);
    await mint(bob, mints[0]);
    await token.connect(sara).transferFrom(bob.address, jane.address, 0);
    await mint(bob, mints[1]);
    await token.connect(sara).transferFrom(bob.address, jane.address, 1);

    expect(await token.balanceOf(bob.address)).to.equal(0);
    expect(await token.balanceOf(jane.address)).to.equal(2);
    expect(await token.ownerOf(0)).to.equal(jane.address);
    expect(await token.ownerOf(1)).to.equal(jane.address);
  });

  it("correctly burns a NFT", async function () {
    await mint(bob, mints[0]);

    expect(await token.connect(bob).burn(0)).to.emit(token, "Transfer");
    expect(await token.balanceOf(bob.address)).to.equal(0);
    await expect(token.ownerOf(0)).to.be.revertedWith(
      "ERC721: owner query for nonexistent token"
    );
  });

  it("correctly assigns metadata URI to NFT", async function () {
    await mint(bob, mints[0]);

    expect(await token.tokenURI(0)).to.equal(
      `${baseTokenURI}${mints[0].tokenURI}`
    );
  });

  it("correctly assigns attribute string to NFT", async function () {
    await mint(bob, mints[0]);

    expect(await token.tokenAttribute(0)).to.equal(mints[0].tokenAttribute);
  });

  it("correctly looks up token id when searching by attribute", async function () {
    await mint(bob, mints[0]);
    await mint(sara, mints[1]);

    expect(await token.tokenAttributeTokenId(mints[0].tokenAttribute)).to.equal(
      0
    );
    expect(await token.tokenAttributeTokenId(mints[1].tokenAttribute)).to.equal(
      1
    );
  });

  it("correctly prevents minting more than per wallet limit", async function () {
    await token.connect(owner).setMaxPerWallet(2);

    await mint(bob, mints[0]);
    await mint(bob, mints[1]);

    await expect(mint(bob, mints[2])).to.be.revertedWith(
      "has reached per wallet limit"
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

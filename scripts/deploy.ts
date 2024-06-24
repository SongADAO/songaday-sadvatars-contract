// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  function strToByte32(str: string) {
    return "0x" + Buffer.from(str).toString("hex").padEnd(64, "0");
  }

  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const contract = await ethers.getContractFactory("SongADayPFP");
  const token = await contract.deploy(
    process.env.TOKEN_BASE_URI || "",
    process.env.TOKEN_BASE_URI_PREFIX || "",
    process.env.MINTER_ADDRESS || "",
    process.env.MINTER_ADDRESS || "",
    process.env.MINTER_ADDRESS || "",
  );

  await token.deployed();

  // await token.setMaxPerWallet(1);

  // const minterAddress = process.env.MINTER_ADDRESS || "";
  // if (minterAddress) {
  //   const minterRoleParam = ethers.utils.keccak256(
  //     ethers.utils.toUtf8Bytes("MINTER_ROLE")
  //   );

  //   await token.grantRole(minterRoleParam, minterAddress);
  // }

  console.log("Contract deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

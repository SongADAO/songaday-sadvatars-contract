import { ethers } from "hardhat";

async function main() {
  const tokenFactory = await ethers.getContractFactory("SADvatars");

  const token = await tokenFactory.deploy(
    process.env.DEV_TOKEN_BASE_URI || "",
    process.env.DEV_TOKEN_BASE_URI_PREFIX || "",
    process.env.DEV_BENEFICIARY_ADDRESS || "",
    process.env.DEV_ADMIN_ADDRESS || "",
    process.env.DEV_ADMIN_ADDRESS || "",
    process.env.DEV_MINTER_ADDRESS || "",
  );
  await token.waitForDeployment();

  console.log(`Wrapper contract deployed to ${await token.getAddress()}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
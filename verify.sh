#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

npx hardhat verify --network sepolia 0x20aa979fE1f6b28d77c608e5684D20958c732056 "ipfs://b" "0x01551220" "0xD0D801c1053555726bdCF188F4A55e690C440E74" "0xBCD17bC16d53D690Ba29d567E79d41d4a7049451" "0xBCD17bC16d53D690Ba29d567E79d41d4a7049451" "0xf1f6Ccaa7e8f2f78E26D25b44d80517951c20284"

#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

npx hardhat run --network goerli scripts/deploy.ts

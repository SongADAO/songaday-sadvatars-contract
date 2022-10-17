#!/usr/bin/env bash

set -o errexit
set -o pipefail
set -o nounset

npx hardhat verify --network goerli 0xf5B404471997A0c68327030CBeD766559bF4CD61 "0xb1d71F62bEe34E9Fc349234C201090c33BCdF6DB" "0x536f6e674144414f000000000000000000000000000000000000000000000000" "0x4f6e6c79207369676e20696620796f75277265206372656174696e67206120536f6e674144414f2050465020666f7220796f757273656c6621" "SongADayPFP" "SONGADAYPFP" "ipfs://b" "0x01551220"

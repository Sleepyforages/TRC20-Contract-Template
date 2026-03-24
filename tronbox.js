/**
 * TronBox Configuration – DepoFi
 *
 * Networks:
 *  development – Local TronBox Quickstart (Docker)
 *  nile        – Nile Testnet (https://nileex.io)
 *  mainnet     – Tron Mainnet
 *
 * Required environment variables (see .env.example):
 *  PRIVATE_KEY_NILE      – Deployer private key for Nile
 *  PRIVATE_KEY_MAINNET   – Deployer private key for mainnet
 */

require("dotenv").config();

const PRIVATE_KEY_DEV     = process.env.PRIVATE_KEY_DEV     || "da146374a75310b9666e834ee4ad0866d6f4035967bfc76217c5a495fff9f0d0";
const PRIVATE_KEY_NILE    = process.env.PRIVATE_KEY_NILE    || "";
const PRIVATE_KEY_MAINNET = process.env.PRIVATE_KEY_MAINNET || "";

module.exports = {
  networks: {
    // ─── Local Quickstart (tronbox/quickstart Docker image) ─────────────────
    development: {
      privateKey: PRIVATE_KEY_DEV,
      userFeePercentage: 100,
      feeLimit: 1_000_000_000,
      fullHost: "http://127.0.0.1:9090",
      network_id: "9",
    },

    // ─── Nile Testnet ────────────────────────────────────────────────────────
    nile: {
      privateKey: PRIVATE_KEY_NILE,
      userFeePercentage: 100,
      feeLimit: 1_000_000_000,
      fullHost: "https://nile.trongrid.io",
      network_id: "3",
    },

    // ─── Tron Mainnet ────────────────────────────────────────────────────────
    mainnet: {
      privateKey: PRIVATE_KEY_MAINNET,
      userFeePercentage: 30,            // protocol covers 70%
      feeLimit: 1_500_000_000,
      fullHost: "https://api.trongrid.io",
      network_id: "1",
    },
  },

  compilers: {
    solc: {
      version: "0.8.24",
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,                    // balanced for Tron Energy
        },
        evmVersion: "paris",            // Tron TVM compatible
        viaIR: false,                   // keep false for Tron compatibility
      },
    },
  },

  // Paths
  contracts_directory:  "./contracts",
  contracts_build_directory: "./build/contracts",
  migrations_directory: "./migrations",
  test_directory:       "./test",
};

/**
 * migrations/2_deploy_depofi.js
 *
 * Deployment order:
 *  1. MockUSDT          (development / nile only – mainnet uses real USDT)
 *  2. LoanPool          (implementation – cloned by factory)
 *  3. LoanFactory impl  (UUPS implementation)
 *  4. ERC1967Proxy      (proxy wrapping LoanFactory with initialize calldata)
 *  5. DepoFiRouter impl + proxy
 *
 * The deployer address becomes owner of both the factory and router proxies.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * After deployment, record the proxy addresses in your .env:
 *   NEXT_PUBLIC_LOAN_FACTORY_ADDRESS=<factory proxy>
 *   NEXT_PUBLIC_DEPOFI_ROUTER_ADDRESS=<router proxy>
 * ─────────────────────────────────────────────────────────────────────────────
 */

require("dotenv").config();

const LoanPool        = artifacts.require("LoanPool");
const LoanFactory     = artifacts.require("LoanFactory");
const DepoFiRouter    = artifacts.require("DepoFiRouter");
const MockUSDT        = artifacts.require("MockUSDT");

// ERC1967Proxy is OpenZeppelin's transparent proxy.
// We import its ABI from the build artefact after compilation.
const ERC1967Proxy    = artifacts.require("ERC1967Proxy");

// Mainnet USDT TRC20
const MAINNET_USDT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
// Nile testnet USDT (deploy MockUSDT for local/nile)
const NILE_USDT    = process.env.NILE_USDT_ADDRESS || "";

module.exports = async function (deployer, network, accounts) {
  const admin = accounts[0];
  console.log(`\n🚀 DepoFi deployment on [${network}] from admin: ${admin}\n`);

  // ─── 1. USDT address ────────────────────────────────────────────────────
  let usdtAddress;

  if (network === "mainnet") {
    usdtAddress = MAINNET_USDT;
    console.log(`✅ Using mainnet USDT: ${usdtAddress}`);
  } else if (network === "nile" && NILE_USDT) {
    usdtAddress = NILE_USDT;
    console.log(`✅ Using Nile USDT: ${usdtAddress}`);
  } else {
    await deployer.deploy(MockUSDT);
    const mockUsdt = await MockUSDT.deployed();
    usdtAddress = mockUsdt.address;
    console.log(`✅ MockUSDT deployed: ${usdtAddress}`);

    // Mint 10M USDT to admin for testing
    await mockUsdt.mint(admin, "10000000000000"); // 10,000,000 USDT
    console.log(`   Minted 10,000,000 test USDT to ${admin}`);
  }

  // ─── 2. LoanPool implementation ─────────────────────────────────────────
  await deployer.deploy(LoanPool);
  const poolImpl = await LoanPool.deployed();
  console.log(`✅ LoanPool implementation: ${poolImpl.address}`);

  // ─── 3. LoanFactory implementation ──────────────────────────────────────
  await deployer.deploy(LoanFactory);
  const factoryImpl = await LoanFactory.deployed();
  console.log(`✅ LoanFactory implementation: ${factoryImpl.address}`);

  // ─── 4. LoanFactory proxy ────────────────────────────────────────────────
  // Encode initialize(usdtAddress, poolImpl.address)
  const factoryInitData = factoryImpl.contract.methods
    .initialize(usdtAddress, poolImpl.address)
    .encodeABI();

  await deployer.deploy(ERC1967Proxy, factoryImpl.address, factoryInitData);
  const factoryProxy = await ERC1967Proxy.deployed();
  const factoryAddress = factoryProxy.address;
  console.log(`✅ LoanFactory proxy (USE THIS):  ${factoryAddress}`);

  // Wrap proxy in LoanFactory ABI for further calls
  const factory = await LoanFactory.at(factoryAddress);
  const factoryOwner = await factory.owner();
  console.log(`   Factory owner: ${factoryOwner}`);

  // ─── 5. DepoFiRouter implementation ──────────────────────────────────────
  await deployer.deploy(DepoFiRouter);
  const routerImpl = await DepoFiRouter.deployed();
  console.log(`✅ DepoFiRouter implementation: ${routerImpl.address}`);

  // ─── 6. DepoFiRouter proxy ───────────────────────────────────────────────
  const routerInitData = routerImpl.contract.methods
    .initialize(factoryAddress)
    .encodeABI();

  await deployer.deploy(ERC1967Proxy, routerImpl.address, routerInitData);
  const routerProxy = await ERC1967Proxy.deployed();
  const routerAddress = routerProxy.address;
  console.log(`✅ DepoFiRouter proxy (USE THIS): ${routerAddress}`);

  // ─── Summary ──────────────────────────────────────────────────────────────
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                   DepoFi Deployment Summary                  ║
╠══════════════════════════════════════════════════════════════╣
║  Network         : ${network.padEnd(41)}║
║  Admin           : ${admin.padEnd(41)}║
╠══════════════════════════════════════════════════════════════╣
║  USDT            : ${usdtAddress.padEnd(41)}║
║  LoanPool impl   : ${poolImpl.address.padEnd(41)}║
║  LoanFactory impl: ${factoryImpl.address.padEnd(41)}║
║  LoanFactory ★   : ${factoryAddress.padEnd(41)}║
║  DepoFiRouter ★  : ${routerAddress.padEnd(41)}║
╠══════════════════════════════════════════════════════════════╣
║  Add to frontend/.env:                                       ║
║  NEXT_PUBLIC_LOAN_FACTORY_ADDRESS=${factoryAddress.slice(0, 27).padEnd(27)}║
║  NEXT_PUBLIC_DEPOFI_ROUTER_ADDRESS=${routerAddress.slice(0, 26).padEnd(26)}║
╚══════════════════════════════════════════════════════════════╝
  `);
};

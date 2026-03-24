// migrations/1_initial_migration.js
// Standard TronBox initial migration – deploys Migrations contract.

const Migrations = artifacts.require("Migrations");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
};

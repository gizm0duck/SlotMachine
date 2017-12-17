var SlotMachine = artifacts.require("./SlotMachine.sol");
var PullOutcome = artifacts.require("./PullOutcome.sol");

module.exports = function(deployer) {
  deployer.deploy(PullOutcome);
  deployer.link(PullOutcome, SlotMachine);
  deployer.deploy(SlotMachine);
};

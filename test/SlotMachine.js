var SlotMachine = artifacts.require("../contracts/SlotMachine.sol");

contract('SlotMachine', function(accounts) {

  it("should get bankAddress", function() {
    return SlotMachine.deployed().then(function(instance) {
      return instance.getBankAddress.call();
    }).then(function(bankAddress) {
      assert.equal(bankAddress, accounts[0]);
    });
  });

  it("should get prizeAmount", function() {
    return SlotMachine.deployed().then(function(instance) {
      return instance.getPrizeAmount.call();
    }).then(function(balance) {
      assert.equal(balance.valueOf(), web3.eth.getBalance(web3.eth.accounts[0]).valueOf());
    });
  });

  

});

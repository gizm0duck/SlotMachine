var PullOutcome = artifacts.require("../contracts/PullOutcome.sol");

contract('PullOutcome', function(accounts) {

  it("should ", function() {
    return PullOutcome.deployed().then(function(instance) {
      return instance.isWinner.call(111);
    }).then(function(outcome) {
      assert.equal(outcome, false);
    });
  });

});

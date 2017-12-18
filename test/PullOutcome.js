"use strict";
const expect = require('chai').expect;
const chai = require("chai");
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
chai.use(sinonChai);

var PullOutcome = artifacts.require("../contracts/PullOutcome.sol");

contract('PullOutcome', function(accounts) {
  let contract;

  beforeEach(async () => {
    contract = await PullOutcome.deployed();
  })

  describe('isWinner', () => {
    it("returns false ", async function() {
      let outcome = await contract.isWinner.call(111, false);
      expect(outcome).to.be.false;
    });

    describe('isWinner', () => {
      it("returns true ", async function() {
        let outcome = await contract.isWinner.call(112, true);
        expect(outcome).to.be.true;
      });
    });
  });
});

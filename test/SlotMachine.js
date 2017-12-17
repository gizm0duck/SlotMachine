"use strict";
const expect = require('chai').expect;
const chai = require("chai");
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
chai.use(sinonChai);
// chai.should();

var SlotMachine = artifacts.require("../contracts/SlotMachine.sol");

contract('SlotMachine', function (accounts) {
  let contract;

  beforeEach(async () => {
    contract = await SlotMachine.deployed();
  })

  describe('prizeAmount', () => {
    it("returns 0 if the contract funds are 0", async function () {
      const prizeAmount = await contract.prizeAmount.call();
      let parsedPrizeAmount = parseInt(prizeAmount.valueOf());

      expect(parsedPrizeAmount).to.be.equal(0);
    });

    it("returns half of the contract funds", async function () {
      await contract.pullLever({from: accounts[1], value: 10000000000});
      contract.getLastResult().then(function(lastResult) {
        expect(lastResult).to.be.equal('Loss');
      })


      const prizeAmount = await contract.prizeAmount.call();
      let parsedPrizeAmount = parseInt(prizeAmount.valueOf());
      expect(parsedPrizeAmount).to.be.equal(5000000000);
    });
  });
});

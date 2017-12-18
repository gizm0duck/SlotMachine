"use strict";
const expect = require('chai').expect;
const chai = require("chai");
const sinonChai = require("sinon-chai");
const sinon = require("sinon");
chai.use(sinonChai);

var SlotMachine = artifacts.require("../contracts/SlotMachine.sol");

contract('SlotMachine', function (accounts) {
  let contract;
  let pullerAccount = accounts[1];

  beforeEach(async () => {
    contract = await SlotMachine.deployed();
  });

  describe('prizeAmount', () => {
    it("returns 0 if the contract funds are 0", async function () {
      const prizeAmount = await contract.prizeAmount.call();
      let parsedPrizeAmount = parseInt(prizeAmount.valueOf());

      expect(parsedPrizeAmount).to.be.equal(0);
    });

    it("returns half of the contract funds", async function () {
      let pullCost = await contract.getPullCost.call();
      await contract.pullLever({from: pullerAccount, value: parseInt(pullCost.valueOf())});
      contract.getLastResult().then(function(lastResult) {
        expect(lastResult).to.be.equal('Loss');
      });

      const prizeAmount = await contract.prizeAmount.call();
      let parsedPrizeAmount = parseInt(prizeAmount.valueOf());
      expect(parsedPrizeAmount).to.be.equal(5000000000000000);
    });
  });

  describe('pullLever', () => {
    let pullCost;

    beforeEach(async () => {
      contract = await SlotMachine.deployed();
      pullCost = await contract.getPullCost.call();
      pullCost = parseInt(pullCost.valueOf());
    });

    describe('when value sent is not enough to cover the pull cost', () => {
      it("returns the funds to the sender and doesn't pull the lever", async function () {
        let fundsBeforePull = web3.eth.getBalance(pullerAccount);
        await contract.pullLever({from: pullerAccount, value: pullCost-10});
        let fundsAfterPull = web3.eth.getBalance(pullerAccount);
        // This is a roundabout way to make sure that the balance before and after are the same (minus gas)
        let balanceDifference = parseInt(fundsBeforePull)-parseInt(fundsAfterPull);
        expect(balanceDifference).to.be.below(pullCost);
      });
    });

    describe('when the transaction is a win', () => {
      beforeEach(async () => {
        await contract.setForceWin();
      });

      it("marks lastResult as a win", async function () {
        await contract.pullLever({from: pullerAccount, value: pullCost});
        let lastResult = await contract.getLastResult();
        expect(lastResult).to.be.equal('Win');
      });

      it("transfers the prize amount to the winner", async function () {
        // Figure out mocking and spying here to make life easier
        // let previousBalance = await parseInt(web3.eth.getBalance(pullerAccount));
        // await contract.pullLever({from: pullerAccount, value: pullCost});
        // let newBalance = await parseInt(web3.eth.getBalance(pullerAccount));
        // expect(previousBalance).to.be.below(newBalance);
      });

      it("resets the values", async function () {
        await contract.pullLever({from: pullerAccount, value: pullCost});
        let newPullCost = await contract.getPullCost.call();
        expect(parseInt(newPullCost)).to.equal(10000000000000000)
      });
    });
    //
    describe('when the transaction is a loss', () => {
      it("marks lastResult as a loss", async function () {
        await contract.pullLever({from: pullerAccount, value: pullCost});
        let lastResult = await contract.getLastResult();
        expect(lastResult).to.be.equal('Loss');
      });

      it("transfers the pull cost to the contract", async function () {
        let previousBalance = parseInt(web3.eth.getBalance(contract.address));
        await contract.pullLever({from: pullerAccount, value: pullCost});
        let newBalance = parseInt(web3.eth.getBalance(contract.address));
        expect(previousBalance).to.be.below(newBalance);
      });

      it("increases the pull cost", async function () {
        await contract.pullLever({from: pullerAccount, value: pullCost});
        let newPullCost = await contract.getPullCost();
        expect(parseInt(newPullCost)).to.be.above(pullCost);
        // TODO: Figure out how to handle calculating what the balance should be
        // taking transaction fees into consideration
        // expect(parseInt(newPullCost.valueOf())).to.equal(10020010000000000);
      });
    });
  });
});

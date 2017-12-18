pragma solidity ^0.4.18;

import "./PullOutcome.sol";

contract SlotMachine {
  address owner;
  uint256 pullCost;
  string lastResult;
  bool forceWin;

  event LogFundsReceived(address sender, uint amount);
  event LogFundsDistributed(address receiver, uint amount);

  function SlotMachine() public payable {
    owner = msg.sender;
    // consider loading the pool with a distribution from the owner when this is executed
    resetGame();
  }

  // Still trying to fully understand this
  function() public payable {
    LogFundsReceived(msg.sender, msg.value);
  }

  function getPullCost() public view returns(uint256) {
    return pullCost;
  }

  function prizeAmount() public view returns (uint256) {
    return this.balance/2;
  }

  function getLastResult() public view returns (string) {
    return lastResult;
  }

  function pullLever() payable public {
    // Ensure the value sent is enough to cover the pull cost
    if (msg.value < pullCost) {
      // Return funds to sender
      msg.sender.transfer(msg.value);
      return;
    }

    if (PullOutcome.isWinner(pullCost, forceWin)) {
      distributeWinnings();
    } else {
      houseWins();
    }
  }

  // Money goes into the pot and next pull cost goes up
  function houseWins() payable public {
    lastResult = 'Loss';
    this.transfer(msg.value);
    increasePullCost();
    LogFundsReceived(msg.sender, msg.value);
  }

  // transfer funds to the winner and reset everything
  function distributeWinnings() payable public {
    lastResult = 'Win';
    // Award the prize money to the puller
    msg.sender.transfer(prizeAmount());
    resetGame();
    LogFundsDistributed(msg.sender, prizeAmount());
  }

  // Increase pull cost by .1% every time it is called
  function increasePullCost() private {
    pullCost += pullCost/1000;
  }

  // Put the game state back to the initial state
  function resetGame() private {
    pullCost = 10 finney;
    forceWin = false;
  }

  // WARNING: This is a terrible idea :)
  // This is just for demonstration purposes
  function setForceWin() public {
    forceWin = true;
  }
}

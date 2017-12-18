pragma solidity ^0.4.18;

library PullOutcome{
  // Randomish enough for this demonstration
  function isWinner(uint pullCost, bool forceWin) public view returns (bool) {
    if (forceWin == true)
      return true;

    bytes32 lastblockhashused = block.blockhash(block.number - 1);
    uint lastblockhashused_uint = uint128(lastblockhashused) + pullCost;
    return uint(keccak256(block.difficulty, block.coinbase, now, lastblockhashused, lastblockhashused_uint)) % 10000 == 0;
  }
}

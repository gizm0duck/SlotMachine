pragma solidity ^0.4.18;

library PullOutcome{
  // Randomish enough for this demonstration
  function isWinner(uint256 pullCost) public view returns (bool) {
    bytes32 lastblockhashused = block.blockhash(block.number - 1);
    uint256 lastblockhashused_uint = uint128(lastblockhashused) + pullCost;
    return uint256(keccak256(block.difficulty, block.coinbase, now, lastblockhashused, lastblockhashused_uint)) % 10000 == 0;
  }
}

# Basket

This proof of concept protocol represents a pick-em betting system implementation of a smart contract.

Players compete in gameweeks and are ranked by their betting record, and winners are decided accordingly.

## How does it work?

An admin deploys the contract, then adds matches to bet on and decides said matches. Users can then join the contract and bet on games. At the end of the gameweek, the admin then decides the winners. This whole flow can be seen through the tests.

## Testing

This project was developed using Hardhat.

To run tests, place your test files in the test directory and run the following.

```shell
npx hardhat test
```

The current test suite (test/player.js) tests all functionality of the project at the moment, with players betting on multiple games, then a winner being chosen.

## What's Next?

At the moment, this project has a functional proof of concept of a pick-em betting system built using Solidity. However, I would like to implement a no-loss betting system where players deposit funds, interest is accrued on everyone's funds, and the profit made is distributed across winners. It could also be a more aggressive low-loss system where the bottom X% loses all their money, and makes it more inticing for those willing to have more risk as the winners would make more. I would also like to interface this with a frontend but that would be done after adding the other mentioned features.

## Warning

This project was done as a hackathon project. It is not audited and NOT intended or ready for use in a production environment.

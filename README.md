# Basket

This proof of concept protocol represents a no-loss betting implementation of a smart contract using PoolTogether's Prize Pools.

Players compete in gameweeks and are ranked by their betting record. Winners split the interest gained on their funds, and the losers get their deposit back.

Defining winners and losers can be very aggressive or generous depending on the prize strategy for each gameweek.

## Testing

This project was developed using Hardhat.

To run tests, place your test files in the test directory and run the following.

```shell
npx hardhat test
```

## Warning

This project was done as a hackathon project. It is not audited and NOT intended or ready for use in a production environment.

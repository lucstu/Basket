const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Basket", function () {
  it("Check if player is properly added", async function () {
    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy();
    await basket.deployed();

    const player = await basket.addPlayer();

    // wait until the transaction is mined
    await player.wait();

    expect(await basket.getPlayer()).to.equal(true);
  });
});

describe("Basket", function () {
  it("Check if invalid player does not exist", async function () {
    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy();
    await basket.deployed();

    expect(await basket.getPlayer()).to.equal(false);
  });
});

describe("Basket", function () {
  it("Checks if match is successfully added.", async function () {
    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy();
    await basket.deployed();

    const match = await basket.addMatch(0, 2, 3, 3)

    await match.wait();

    expect(await basket.getMatch(0)).to.equal(true);
  });
});

describe("Basket", function () {
  it("Checks if match cannot be added by a player.", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy();
    await basket.deployed();

    await expect(basket.connect(addr1).addMatch(0, 2, 3, 3) ).to.be.revertedWith("Only the admin can add Matches.");
  });
});

describe("Basket", function () {
  it("Checks if bet is successfully added.", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy();
    await basket.deployed();

    const match = await basket.addMatch(0, 2, 3, 3);

    await match.wait();

    expect(await basket.getMatch(0)).to.equal(true);

    const player = await basket.connect(addr1).addPlayer();
    await player.wait();

    const bet = await basket.connect(addr1).placeBet(0, 1);
    await bet.wait();

    await expect(await basket.connect(addr1).getBet(0, 1)).to.equal(true);
  });
});

describe("Basket", function () {
  it("Checks if winner is properly assigned on a given match.", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy();
    await basket.deployed();

    const match = await basket.addMatch(0, 2, 3, 3);

    await match.wait();

    expect(await basket.getMatch(0)).to.equal(true);

    const player = await basket.connect(addr1).addPlayer();
    await player.wait();

    const bet = await basket.connect(addr1).placeBet(0, 1);
    await bet.wait();

    await expect(await basket.connect(addr1).getBet(0, 1)).to.equal(true);

    const result = await basket.connect(owner).decideMatch(0,1)
    await result.wait();

    const wins = await basket.connect(addr1).getWins();

    expect(wins).to.equal(1);
  });
});
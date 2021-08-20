const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Basket", function () {
  it("Check if player is properly added", async function () {
    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy(5);
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
    const basket = await Basket.deploy(5);
    await basket.deployed();

    expect(await basket.getPlayer()).to.equal(false);
  });
});

describe("Basket", function () {
  it("Checks if match is successfully added.", async function () {
    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy(5);
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
    const basket = await Basket.deploy(5);
    await basket.deployed();

    await expect(basket.connect(addr1).addMatch(0, 2, 3, 3) ).to.be.revertedWith("Only the admin can add Matches.");
  });
});

describe("Basket", function () {
  it("Checks if bet is successfully added.", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy(5);
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
    const basket = await Basket.deploy(5);
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

describe("Basket", function () {
  it("Checks if matches length is updated..", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy(5);
    await basket.deployed();

    const match = await basket.addMatch(0, 2, 3, 3);
    await match.wait();
    const match2 = await basket.addMatch(1, 2, 3, 3);
    await match2.wait();
    const match3 = await basket.addMatch(2, 2, 3, 3);
    await match3.wait();
    const match4 = await basket.addMatch(3, 2, 3, 3);
    await match4.wait();

    expect(await basket.getMatchLength()).to.equal(4);
  });
});

describe("Basket", function () {
  it("Tries to bet on same match twice", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy(5);
    await basket.deployed();

    const match = await basket.addMatch(0, 2, 3, 3);

    await match.wait();

    expect(await basket.getMatch(0)).to.equal(true);

    const player = await basket.connect(addr1).addPlayer();
    await player.wait();

    const bet = await basket.connect(addr1).placeBet(0, 1);
    await bet.wait();

    await expect(await basket.connect(addr1).getBet(0, 1)).to.equal(true);

    await expect(basket.connect(addr1).placeBet(0, 1)).to.be.revertedWith("Player has already bet on this match!");
  });
});

describe("Basket", function () {
  it("Tries to bet over the amount of given bets.", async function () {
    const [owner, addr1] = await ethers.getSigners();

    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy(5);
    await basket.deployed();

    const match = await basket.addMatch(0, 2, 3, 3);
    await match.wait();
    const match2 = await basket.addMatch(1, 2, 3, 3);
    await match2.wait();
    const match3 = await basket.addMatch(2, 2, 3, 3);
    await match3.wait();
    const match4 = await basket.addMatch(3, 2, 3, 3);
    await match4.wait();
    const match5 = await basket.addMatch(4, 2, 3, 3);
    await match5.wait();
    const match6 = await basket.addMatch(5, 2, 3, 3);
    await match6.wait();

    expect(await basket.getMatchLength()).to.equal(6);

    const player = await basket.connect(addr1).addPlayer();
    await player.wait();

    const bet = await basket.connect(addr1).placeBet(0, 1);
    await bet.wait();
    const bet2 = await basket.connect(addr1).placeBet(1, 1);
    await bet2.wait();
    const bet3 = await basket.connect(addr1).placeBet(2, 1);
    await bet3.wait();
    const bet4 = await basket.connect(addr1).placeBet(3, 1);
    await bet4.wait();
    const bet5 = await basket.connect(addr1).placeBet(4, 1);
    await bet5.wait();

    await expect(basket.connect(addr1).placeBet(5, 1)).to.be.revertedWith("You have no bets remaining");
  });
});

describe("Basket", function () {
  it("Checks that most wins is recognized as winner.", async function () {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const Basket = await ethers.getContractFactory("Basket");
    const basket = await Basket.deploy(5);
    await basket.deployed();

    const match = await basket.addMatch(0, 2, 3, 3);
    await match.wait();
    const match2 = await basket.addMatch(1, 2, 3, 3);
    await match2.wait();
    
    const player1 = await basket.connect(addr1).addPlayer();
    await player1.wait();
    const p1_bet1 = await basket.connect(addr1).placeBet(0,0);
    await p1_bet1.wait();
    const p1_bet2 = await basket.connect(addr1).placeBet(1,0);
    await p1_bet2.wait();

    const player2 = await basket.connect(addr2).addPlayer();
    await player2.wait();
    const p2_bet1 = await basket.connect(addr2).placeBet(0,0);
    await p2_bet1.wait();
    const p2_bet2 = await basket.connect(addr2).placeBet(1,1);
    await p2_bet2.wait();

    const player3 = await basket.connect(addr3).addPlayer();
    await player3.wait();
    const p3_bet1 = await basket.connect(addr3).placeBet(0,1);
    await p3_bet1.wait();
    const p3_bet2 = await basket.connect(addr3).placeBet(1,1);
    await p3_bet2.wait();

    await basket.connect(owner).decideMatch(0,0);
    await basket.connect(owner).decideMatch(1,0);

    expect(await basket.connect(addr1).getWins()).to.equal(2);

    expect(await basket.connect(owner).getWinner()).to.equal(2);

  });
});
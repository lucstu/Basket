//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Basket {
    struct Player {
        address addr;
        uint score;
        uint bets_remaining;
        uint wins;
        uint losses;
        bool exists;
        uint[] matches;
    }

    // Render data with given ID on frontend side (teams, logos, etc).
    // Team 1 is home, draw is draw, Team 2 is away
    struct Match {
        uint id;
        uint odds1; // Need to convert decimal to fixed point
        uint oddsDraw;
        uint odds2;
        address[] team1;
        address[] draw;
        address[] team2;
        bool exists;
    }

    uint[] matchIds;
    mapping (uint => Match) active_matches;

    mapping (address => Player) players;

    address admin;

    uint num_bets;

    constructor(uint _num_bets) {
        admin = msg.sender;

        num_bets = _num_bets;
    }

    // Integrate with a pooltogether pool later.
    function addPlayer() public {
        require(players[msg.sender].exists == false, "Address already exists in mapping.");

        uint[] memory matches;

        Player memory newPlayer = Player({addr:msg.sender, score:0, bets_remaining:num_bets, wins:0, losses:0, exists:true, matches:matches});

        players[msg.sender] = newPlayer;
    }

    // Need to have IDs on frontend show team names.
    function addMatch(uint id, uint odds1, uint oddsDraw, uint odds2) public {
        require(msg.sender == admin, "Only the admin can add Matches.");

        address[] memory addr1;
        address[] memory draw;
        address[] memory addr2;

        Match memory newMatch = Match({id:id, odds1: odds1, oddsDraw:oddsDraw, odds2:odds2, team1:addr1, draw:draw, team2:addr2, exists:true});

        matchIds.push(id);
        active_matches[id] = newMatch;
    }

    // 0: team1, 1: draw, 2: team2
    // User places a bet.
    function placeBet(uint id, uint pick) public {
        require(players[msg.sender].exists, "Player does not exist."); // Checks that they exist in the Basket
        require(players[msg.sender].bets_remaining > 0, "You have no bets remaining"); // Checks that they aren't out of bets.

        // Looks to see if player has already placed a bet on this match.
        for (uint i=0; i < players[msg.sender].matches.length; i++) {
            if (players[msg.sender].matches[i] == id) {
                revert("Player has already bet on this match!");
            }
        }

        // Places a bet for the appropriate team.
        if (pick == 0) {
            active_matches[id].team1.push(msg.sender);
            players[msg.sender].bets_remaining -= 1;
            players[msg.sender].matches.push(id);
        } else if (pick == 1) {
            active_matches[id].draw.push(msg.sender);
            players[msg.sender].bets_remaining -= 1;
            players[msg.sender].matches.push(id);
        } else if (pick == 2) {
            active_matches[id].team2.push(msg.sender);
            players[msg.sender].bets_remaining -= 1;
            players[msg.sender].matches.push(id);
        } else {
            revert("Invalid pick provided");
        }
    }

    // Going to change this function way too much for just checking that a player bet. Just works for testing for now.
    function getBet(uint id, uint pick) public view returns (bool) {
        require (players[msg.sender].exists, "Player does not exist.");

        bool betOnMatch = false;
        bool betOnPick = false;

        for (uint i=0; i < players[msg.sender].matches.length; i++) {
            if (players[msg.sender].matches[i] == id) {
                betOnMatch = true;
            }
        }

        if (pick == 0) {
            for (uint i=0; i<active_matches[id].team1.length; i++) {
                if (active_matches[id].team1[i] == msg.sender) {
                    betOnPick = true;
                }
            }
        } else if (pick == 1) {
            for (uint i=0; i<active_matches[id].draw.length; i++) {
                if (active_matches[id].draw[i] == msg.sender) {
                    betOnPick = true;
                }
            }
        } else if (pick == 2) {
            for (uint i=0; i<active_matches[id].team2.length; i++) {
                if (active_matches[id].team2[i] == msg.sender) {
                    betOnPick = true;
                }
            }
        } else {
            revert("Invalid pick provided");
        }

        return (betOnMatch && betOnPick);
    }

    // Admin function to decide the result of a match.
    function decideMatch(uint id, uint winner) public {
        require(msg.sender == admin, "Only admin can decide matches"); // Requires admin privileges.

        // Awards wins/losses + score appropriately.
        if (winner == 0) {
            for (uint i=0; i < active_matches[id].team1.length; i++) {
                players[active_matches[id].team1[i]].wins += 1;
                players[active_matches[id].team1[i]].score += 1;
            }

            for (uint i=0; i < active_matches[id].draw.length; i++) {
                players[active_matches[id].draw[i]].losses += 1;
                players[active_matches[id].draw[i]].score -= 1;
            }

            for (uint i=0; i < active_matches[id].team2.length; i++) {
                players[active_matches[id].team2[i]].losses += 1;
                players[active_matches[id].team2[i]].score -= 1;
            }

        } else if (winner == 1) {
            for (uint i=0; i < active_matches[id].team1.length; i++) {
                players[active_matches[id].team1[i]].losses += 1;
                players[active_matches[id].team1[i]].score -= 1;
            }

            for (uint i=0; i < active_matches[id].draw.length; i++) {
                players[active_matches[id].draw[i]].wins += 1;
                players[active_matches[id].draw[i]].score += 1;
            }

            for (uint i=0; i < active_matches[id].team2.length; i++) {
                players[active_matches[id].team2[i]].losses += 1;
                players[active_matches[id].team2[i]].score -= 1;
            }
        } else if (winner == 2) {
            for (uint i=0; i < active_matches[id].team1.length; i++) {
                players[active_matches[id].team1[i]].losses += 1;
                players[active_matches[id].team1[i]].score -= 1;
            }

            for (uint i=0; i < active_matches[id].draw.length; i++) {
                players[active_matches[id].draw[i]].losses += 1;
                players[active_matches[id].draw[i]].score -= 1;
            }

            for (uint i=0; i < active_matches[id].team2.length; i++) {
                players[active_matches[id].team2[i]].wins += 1;
                players[active_matches[id].team2[i]].score += 1;
            }
        } else {
            revert("Invalid id provided");
        }
    }

    function getPlayer() public view returns (bool) {
        if (players[msg.sender].exists) {
            return true;
        }
        return false;
    }

    function getMatch(uint id) public view returns (bool) {
        if (active_matches[id].exists) {
            return true;
        }

        return false;
    }

    function getWins() public view returns (uint) {
        require(players[msg.sender].exists, "Player does not exist.");

        return players[msg.sender].wins;
    }

    function getMatchLength() public view returns (uint) {
        return matchIds.length;
    }
}

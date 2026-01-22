const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("Voting", function () {
  let voting;
  let owner;
  let voter1;
  let voter2;

  const POLL_TITLE = "Best Programming Language";
  const POLL_DESCRIPTION = "Vote for your favorite programming language";
  const POLL_OPTIONS = ["JavaScript", "Python", "Rust", "Go"];
  const POLL_DURATION = 3600; // 1 hour

  beforeEach(async function () {
    [owner, voter1, voter2] = await ethers.getSigners();
    
    const Voting = await ethers.getContractFactory("Voting");
    voting = await Voting.deploy();
  });

  describe("Poll Creation", function () {
    it("Should create a poll successfully", async function () {
      await voting.createPoll(POLL_TITLE, POLL_DESCRIPTION, POLL_OPTIONS, POLL_DURATION);
      
      const poll = await voting.getPoll(1);
      expect(poll.title).to.equal(POLL_TITLE);
      expect(poll.description).to.equal(POLL_DESCRIPTION);
      expect(poll.creator).to.equal(owner.address);
      expect(poll.isActive).to.be.true;
    });

    it("Should emit PollCreated event", async function () {
      await expect(voting.createPoll(POLL_TITLE, POLL_DESCRIPTION, POLL_OPTIONS, POLL_DURATION))
        .to.emit(voting, "PollCreated");
    });

    it("Should fail if title is empty", async function () {
      await expect(voting.createPoll("", POLL_DESCRIPTION, POLL_OPTIONS, POLL_DURATION))
        .to.be.revertedWith("Title cannot be empty");
    });

    it("Should fail if less than 2 options", async function () {
      await expect(voting.createPoll(POLL_TITLE, POLL_DESCRIPTION, ["Only one"], POLL_DURATION))
        .to.be.revertedWith("At least 2 options required");
    });

    it("Should fail if duration is too short", async function () {
      await expect(voting.createPoll(POLL_TITLE, POLL_DESCRIPTION, POLL_OPTIONS, 30))
        .to.be.revertedWith("Duration must be at least 1 minute");
    });

    it("Should store options correctly", async function () {
      await voting.createPoll(POLL_TITLE, POLL_DESCRIPTION, POLL_OPTIONS, POLL_DURATION);
      
      const [names, voteCounts] = await voting.getPollOptions(1);
      expect(names.length).to.equal(POLL_OPTIONS.length);
      expect(names[0]).to.equal(POLL_OPTIONS[0]);
      expect(voteCounts[0]).to.equal(0);
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await voting.createPoll(POLL_TITLE, POLL_DESCRIPTION, POLL_OPTIONS, POLL_DURATION);
    });

    it("Should allow voting", async function () {
      await voting.connect(voter1).vote(1, 0);
      
      const [names, voteCounts] = await voting.getPollOptions(1);
      expect(voteCounts[0]).to.equal(1);
    });

    it("Should emit Voted event", async function () {
      await expect(voting.connect(voter1).vote(1, 0))
        .to.emit(voting, "Voted")
        .withArgs(1, voter1.address, 0);
    });

    it("Should not allow double voting", async function () {
      await voting.connect(voter1).vote(1, 0);
      
      await expect(voting.connect(voter1).vote(1, 1))
        .to.be.revertedWith("You have already voted");
    });

    it("Should track voter choice", async function () {
      await voting.connect(voter1).vote(1, 2);
      
      const [voted, optionIndex] = await voting.getVoterChoice(1, voter1.address);
      expect(voted).to.be.true;
      expect(optionIndex).to.equal(2);
    });

    it("Should fail for invalid option index", async function () {
      await expect(voting.connect(voter1).vote(1, 10))
        .to.be.revertedWith("Invalid option index");
    });

    it("Should fail for non-existent poll", async function () {
      await expect(voting.connect(voter1).vote(999, 0))
        .to.be.revertedWith("Poll does not exist");
    });

    it("Should update total votes", async function () {
      await voting.connect(voter1).vote(1, 0);
      await voting.connect(voter2).vote(1, 1);
      
      const poll = await voting.getPoll(1);
      expect(poll.totalVotes).to.equal(2);
    });
  });

  describe("Poll Results", function () {
    beforeEach(async function () {
      await voting.createPoll(POLL_TITLE, POLL_DESCRIPTION, POLL_OPTIONS, POLL_DURATION);
      await voting.connect(voter1).vote(1, 0);
      await voting.connect(voter2).vote(1, 0);
      await voting.connect(owner).vote(1, 1);
    });

    it("Should return correct winner", async function () {
      const [winnerName, winnerVoteCount, winnerIndex] = await voting.getWinner(1);
      
      expect(winnerName).to.equal("JavaScript");
      expect(winnerVoteCount).to.equal(2);
      expect(winnerIndex).to.equal(0);
    });

    it("Should return correct option vote counts", async function () {
      const [names, voteCounts] = await voting.getPollOptions(1);
      
      expect(voteCounts[0]).to.equal(2); // JavaScript
      expect(voteCounts[1]).to.equal(1); // Python
      expect(voteCounts[2]).to.equal(0); // Rust
      expect(voteCounts[3]).to.equal(0); // Go
    });
  });

  describe("Poll Management", function () {
    beforeEach(async function () {
      await voting.createPoll(POLL_TITLE, POLL_DESCRIPTION, POLL_OPTIONS, POLL_DURATION);
    });

    it("Should allow creator to end poll", async function () {
      await voting.endPoll(1);
      
      const poll = await voting.getPoll(1);
      expect(poll.isActive).to.be.false;
    });

    it("Should not allow non-creator to end poll", async function () {
      await expect(voting.connect(voter1).endPoll(1))
        .to.be.revertedWith("Only creator can end the poll");
    });

    it("Should not allow voting after poll ends", async function () {
      await voting.endPoll(1);
      
      await expect(voting.connect(voter1).vote(1, 0))
        .to.be.revertedWith("Poll is not active");
    });

    it("Should not allow voting after time expires", async function () {
      // Fast forward time
      await time.increase(POLL_DURATION + 1);
      
      await expect(voting.connect(voter1).vote(1, 0))
        .to.be.revertedWith("Poll has ended");
    });
  });

  describe("Active Polls", function () {
    it("Should return active polls", async function () {
      await voting.createPoll(POLL_TITLE, POLL_DESCRIPTION, POLL_OPTIONS, POLL_DURATION);
      await voting.createPoll("Poll 2", "Description 2", ["A", "B"], POLL_DURATION);
      await voting.createPoll("Poll 3", "Description 3", ["X", "Y"], POLL_DURATION);
      
      // End one poll
      await voting.endPoll(2);
      
      const activePolls = await voting.getActivePolls();
      expect(activePolls.length).to.equal(2);
      expect(activePolls[0]).to.equal(1);
      expect(activePolls[1]).to.equal(3);
    });
  });
});

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Voting
 * @dev A simple voting smart contract for creating polls and voting
 */
contract Voting {
    // Struct for a single option in a poll
    struct Option {
        string name;
        uint256 voteCount;
    }

    // Struct for a poll
    struct Poll {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        uint256 totalVotes;
    }

    // State variables
    uint256 public pollCount;
    
    // Mapping from poll ID to Poll
    mapping(uint256 => Poll) public polls;
    
    // Mapping from poll ID to array of options
    mapping(uint256 => Option[]) public pollOptions;
    
    // Mapping to track if an address has voted in a poll: pollId => voter => hasVoted
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    
    // Mapping to track which option a voter chose: pollId => voter => optionIndex
    mapping(uint256 => mapping(address => uint256)) public voterChoice;

    // Events
    event PollCreated(
        uint256 indexed pollId,
        string title,
        address indexed creator,
        uint256 startTime,
        uint256 endTime
    );
    
    event Voted(
        uint256 indexed pollId,
        address indexed voter,
        uint256 optionIndex
    );
    
    event PollEnded(uint256 indexed pollId);

    // Modifiers
    modifier pollExists(uint256 _pollId) {
        require(_pollId > 0 && _pollId <= pollCount, "Poll does not exist");
        _;
    }

    modifier pollIsActive(uint256 _pollId) {
        require(polls[_pollId].isActive, "Poll is not active");
        require(block.timestamp >= polls[_pollId].startTime, "Poll has not started yet");
        require(block.timestamp <= polls[_pollId].endTime, "Poll has ended");
        _;
    }

    modifier hasNotVoted(uint256 _pollId) {
        require(!hasVoted[_pollId][msg.sender], "You have already voted");
        _;
    }

    /**
     * @dev Create a new poll
     * @param _title Title of the poll
     * @param _description Description of the poll
     * @param _options Array of option names
     * @param _duration Duration of the poll in seconds
     */
    function createPoll(
        string memory _title,
        string memory _description,
        string[] memory _options,
        uint256 _duration
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_options.length >= 2, "At least 2 options required");
        require(_options.length <= 10, "Maximum 10 options allowed");
        require(_duration >= 60, "Duration must be at least 1 minute");
        require(_duration <= 30 days, "Duration cannot exceed 30 days");

        pollCount++;
        uint256 pollId = pollCount;

        polls[pollId] = Poll({
            id: pollId,
            title: _title,
            description: _description,
            creator: msg.sender,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            isActive: true,
            totalVotes: 0
        });

        // Add options
        for (uint256 i = 0; i < _options.length; i++) {
            require(bytes(_options[i]).length > 0, "Option name cannot be empty");
            pollOptions[pollId].push(Option({
                name: _options[i],
                voteCount: 0
            }));
        }

        emit PollCreated(pollId, _title, msg.sender, block.timestamp, block.timestamp + _duration);
    }

    /**
     * @dev Vote for an option in a poll
     * @param _pollId ID of the poll
     * @param _optionIndex Index of the option to vote for
     */
    function vote(uint256 _pollId, uint256 _optionIndex) 
        external 
        pollExists(_pollId) 
        pollIsActive(_pollId) 
        hasNotVoted(_pollId) 
    {
        require(_optionIndex < pollOptions[_pollId].length, "Invalid option index");

        hasVoted[_pollId][msg.sender] = true;
        voterChoice[_pollId][msg.sender] = _optionIndex;
        pollOptions[_pollId][_optionIndex].voteCount++;
        polls[_pollId].totalVotes++;

        emit Voted(_pollId, msg.sender, _optionIndex);
    }

    /**
     * @dev End a poll (only creator can end)
     * @param _pollId ID of the poll
     */
    function endPoll(uint256 _pollId) external pollExists(_pollId) {
        require(polls[_pollId].creator == msg.sender, "Only creator can end the poll");
        require(polls[_pollId].isActive, "Poll is already ended");
        
        polls[_pollId].isActive = false;
        emit PollEnded(_pollId);
    }

    /**
     * @dev Get poll details
     * @param _pollId ID of the poll
     */
    function getPoll(uint256 _pollId) 
        external 
        view 
        pollExists(_pollId) 
        returns (
            uint256 id,
            string memory title,
            string memory description,
            address creator,
            uint256 startTime,
            uint256 endTime,
            bool isActive,
            uint256 totalVotes
        ) 
    {
        Poll storage poll = polls[_pollId];
        return (
            poll.id,
            poll.title,
            poll.description,
            poll.creator,
            poll.startTime,
            poll.endTime,
            poll.isActive && block.timestamp <= poll.endTime,
            poll.totalVotes
        );
    }

    /**
     * @dev Get all options for a poll
     * @param _pollId ID of the poll
     */
    function getPollOptions(uint256 _pollId) 
        external 
        view 
        pollExists(_pollId) 
        returns (string[] memory names, uint256[] memory voteCounts) 
    {
        uint256 optionCount = pollOptions[_pollId].length;
        names = new string[](optionCount);
        voteCounts = new uint256[](optionCount);

        for (uint256 i = 0; i < optionCount; i++) {
            names[i] = pollOptions[_pollId][i].name;
            voteCounts[i] = pollOptions[_pollId][i].voteCount;
        }

        return (names, voteCounts);
    }

    /**
     * @dev Get the number of options in a poll
     * @param _pollId ID of the poll
     */
    function getOptionCount(uint256 _pollId) 
        external 
        view 
        pollExists(_pollId) 
        returns (uint256) 
    {
        return pollOptions[_pollId].length;
    }

    /**
     * @dev Check if a poll is currently active (considering time)
     * @param _pollId ID of the poll
     */
    function isPollActive(uint256 _pollId) 
        external 
        view 
        pollExists(_pollId) 
        returns (bool) 
    {
        return polls[_pollId].isActive && 
               block.timestamp >= polls[_pollId].startTime && 
               block.timestamp <= polls[_pollId].endTime;
    }

    /**
     * @dev Get the winning option of a poll
     * @param _pollId ID of the poll
     */
    function getWinner(uint256 _pollId) 
        external 
        view 
        pollExists(_pollId) 
        returns (string memory winnerName, uint256 winnerVoteCount, uint256 winnerIndex) 
    {
        require(pollOptions[_pollId].length > 0, "No options in poll");

        uint256 highestVotes = 0;
        uint256 winningIndex = 0;

        for (uint256 i = 0; i < pollOptions[_pollId].length; i++) {
            if (pollOptions[_pollId][i].voteCount > highestVotes) {
                highestVotes = pollOptions[_pollId][i].voteCount;
                winningIndex = i;
            }
        }

        return (
            pollOptions[_pollId][winningIndex].name,
            highestVotes,
            winningIndex
        );
    }

    /**
     * @dev Get all active polls
     */
    function getActivePolls() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        // First, count active polls
        for (uint256 i = 1; i <= pollCount; i++) {
            if (polls[i].isActive && block.timestamp <= polls[i].endTime) {
                activeCount++;
            }
        }

        // Create array and populate
        uint256[] memory activePollIds = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= pollCount; i++) {
            if (polls[i].isActive && block.timestamp <= polls[i].endTime) {
                activePollIds[index] = i;
                index++;
            }
        }

        return activePollIds;
    }

    /**
     * @dev Get voter's choice for a poll
     * @param _pollId ID of the poll
     * @param _voter Address of the voter
     */
    function getVoterChoice(uint256 _pollId, address _voter) 
        external 
        view 
        pollExists(_pollId) 
        returns (bool voted, uint256 optionIndex) 
    {
        return (hasVoted[_pollId][_voter], voterChoice[_pollId][_voter]);
    }
}

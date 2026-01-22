<p align="center">
  <img src="https://img.icons8.com/3d-fluency/94/ballot-box.png" alt="Voting DApp Logo" width="100"/>
</p>

<h1 align="center">🗳️ Simple Voting DApp</h1>

<p align="center">
  <strong>A decentralized voting application built on Ethereum blockchain</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Solidity-0.8.19-363636?style=for-the-badge&logo=solidity" alt="Solidity"/>
  <img src="https://img.shields.io/badge/Hardhat-2.19-yellow?style=for-the-badge&logo=hardhat" alt="Hardhat"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" alt="React"/>
  <img src="https://img.shields.io/badge/Ethers.js-6.x-7B3FE4?style=for-the-badge" alt="Ethers.js"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Tests-20%20Passing-brightgreen?style=flat-square" alt="Tests"/>
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/Network-Sepolia-purple?style=flat-square" alt="Network"/>
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel" alt="Vercel"/>
</p>

<p align="center">
  <a href="https://simplevoting.vercel.app" target="_blank"><strong>🔗 Live Demo</strong></a> |
  <a href="https://sepolia.etherscan.io/address/0x1bA54fE6937d7CcfBc3A067f64D95a67197DfAf9#code" target="_blank"><strong>📜 Verified Contract</strong></a>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Local Development](#local-development)
  - [MetaMask Setup](#-metamask-setup)
- [Deployment](#-deployment)
- [Smart Contract](#-smart-contract)
- [Frontend](#-frontend)
- [Testing](#-testing)
- [Security](#-security)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**Simple Voting DApp** is a decentralized voting application that allows users to create polls, cast votes, and view results in real-time on the Ethereum blockchain. All data is stored permanently and transparently on the blockchain, ensuring the integrity and security of the voting process.

### Why Blockchain Voting?

| Traditional Voting | Blockchain Voting |
|-------------------|-------------------|
| ❌ Data can be manipulated | ✅ Immutable & transparent |
| ❌ Requires trust in third parties | ✅ Trustless & verifiable |
| ❌ Non-transparent process | ✅ Anyone can verify |
| ❌ Single point of failure | ✅ Decentralized & resilient |

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| 🗳️ **Create Poll** | Create polls with title, description, 2-10 options, and custom duration |
| ✅ **Vote** | Vote on active polls (1 address = 1 vote per poll) |
| 📊 **Real-time Results** | View voting results with percentages in real-time |
| ⏱️ **Time-based** | Polls automatically end after the specified duration |
| 🏆 **Winner Detection** | System automatically determines the winner based on most votes |
| 🔐 **Access Control** | Only the creator can end a poll early |

### User Experience

- 🌙 **Dark Mode UI** - Modern interface with an eye-friendly dark theme
- 📱 **Responsive Design** - Works well on desktop and mobile
- 🔔 **Toast Notifications** - Real-time notifications for every action
- ⚡ **Fast & Lightweight** - Optimized for best performance

### New Features (v2.0)

| Feature | Description |
|---------|-------------|
| 🔗 **Share Poll** | Share to Twitter, Facebook, or copy link with one click |
| 📊 **Voting Chart** | Visualize voting results with interactive bar chart |
| 👤 **Profile Page** | View voting history and personal statistics |
| 🔔 **Real-time Notifications** | Instant notifications when someone votes |

---

## 🛠️ Tech Stack

### Smart Contract
| Technology | Version | Purpose |
|------------|---------|---------|
| Solidity | 0.8.19 | Smart contract language |
| Hardhat | 2.19.x | Development framework |
| OpenZeppelin | - | Security best practices |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| Ethers.js | 6.x | Ethereum interaction |
| React Router | 6.x | Client-side routing |
| React Hot Toast | 2.x | Notifications |
| Chart.js | 4.x | Voting chart visualization |

### Blockchain
| Network | Chain ID | Purpose |
|---------|----------|---------|
| Hardhat Local | 31337 | Development & testing |
| Sepolia Testnet | 11155111 | Staging & demo |
| Ethereum Mainnet | 1 | Production (optional) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Home Page  │  │ Create Poll │  │     Poll Details        │ │
│  │  (List)     │  │   Page      │  │  (Vote & Results)       │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │ Ethers.js
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      METAMASK WALLET                            │
│              (Transaction Signing & Account Management)          │
└────────────────────────────┬────────────────────────────────────┘
                             │ JSON-RPC
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ETHEREUM BLOCKCHAIN                          │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                   Voting.sol Contract                      │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │ │
│  │  │   Polls     │  │   Options   │  │  Vote Tracking  │   │ │
│  │  │  Mapping    │  │   Mapping   │  │    Mappings     │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Project Structure

```
Simple voting DApp/
│
├── 📁 contracts/
│   └── 📄 Voting.sol           # Main smart contract
│
├── 📁 scripts/
│   └── 📄 deploy.js            # Deployment script
│
├── 📁 test/
│   └── 📄 Voting.test.js       # Unit tests (20 test cases)
│
├── 📁 frontend/
│   ├── 📁 public/
│   │   └── 📄 index.html
│   └── 📁 src/
│       ├── 📁 contracts/       # ABI & contract address
│       │   ├── 📄 Voting.json
│       │   └── 📄 contract-address.json
│       ├── 📄 App.js           # Main React component
│       ├── 📄 index.js         # Entry point
│       └── 📄 index.css        # Styles
│
├── 📄 hardhat.config.js        # Hardhat configuration
├── 📄 package.json             # Dependencies
├── 📄 .env.example             # Environment template
├── 📄 .gitignore
└── 📄 README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

| Requirement | Version | Check Command |
|-------------|---------|---------------|
| Node.js | v18+ | `node --version` |
| npm | v9+ | `npm --version` |
| Git | Any | `git --version` |
| MetaMask | Latest | Browser extension |

### Installation

1️⃣ **Clone Repository**
```bash
git clone <repository-url>
cd "Simple voting DApp"
```

2️⃣ **Install Smart Contract Dependencies**
```bash
npm install
```

3️⃣ **Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

4️⃣ **Setup Environment Variables**
```bash
copy .env.example .env
```

Edit `.env` file:
```env
# Get from https://www.alchemy.com/ or https://infura.io/
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Export from MetaMask (DO NOT SHARE!)
PRIVATE_KEY=your_wallet_private_key_here
```

### Local Development

Open **3 separate terminals**:

**Terminal 1** - Run Local Blockchain
```bash
npx hardhat node
```

**Terminal 2** - Deploy Contract
```bash
npx hardhat run scripts/deploy.js --network localhost
```

**Terminal 3** - Run Frontend
```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

---

## 🦊 MetaMask Setup

### 1. Add Localhost Network

| Field | Value |
|-------|-------|
| Network Name | `Localhost 8545` |
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Currency Symbol | `ETH` |

### 2. Import Test Account

Use one of the private keys from `npx hardhat node` output:

```
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

> ⚠️ **Warning**: This private key is for testing only! Do not use on mainnet.

### 3. Connect to DApp

1. Open `http://localhost:3000`
2. Click **"Connect Wallet"** button
3. Approve connection in MetaMask
4. Make sure network is **Localhost 8545**

---

## 🌐 Deployment

### Deploy to Sepolia Testnet

1️⃣ **Get Sepolia ETH (Faucet)**
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet/sepolia)
- [QuickNode Sepolia Faucet](https://faucet.quicknode.com/ethereum/sepolia)

2️⃣ **Configure `.env`**
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_metamask_private_key
```

3️⃣ **Deploy**
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

4️⃣ **Verify on Etherscan (Optional)**
```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

### Deploy to Mainnet

> ⚠️ **Warning**: Deploying to mainnet requires real ETH!

```bash
# Add mainnet network to hardhat.config.js first
npx hardhat run scripts/deploy.js --network mainnet
```

---

## 📜 Smart Contract

### Contract Address

| Network | Address | Verified |
|---------|---------|----------|
| Localhost | `0x5FbDB2315678afecb367f032d93F642f64180aa3` | - |
| Sepolia | [`0x1bA54fE6937d7CcfBc3A067f64D95a67197DfAf9`](https://sepolia.etherscan.io/address/0x1bA54fE6937d7CcfBc3A067f64D95a67197DfAf9#code) | ✅ |

### Functions Reference

#### Write Functions (Requires Gas)

```solidity
// Create a new poll
function createPoll(
    string memory _title,        // Poll title
    string memory _description,  // Poll description
    string[] memory _options,    // Array of options (min 2, max 10)
    uint256 _duration           // Duration in seconds
) external

// Vote on a poll
function vote(
    uint256 _pollId,            // Poll ID
    uint256 _optionIndex        // Option index (0-based)
) external

// End a poll (creator only)
function endPoll(
    uint256 _pollId             // Poll ID
) external
```

#### Read Functions (Free)

```solidity
// Get poll details
function getPoll(uint256 _pollId) external view returns (
    uint256 id,
    string memory title,
    string memory description,
    address creator,
    uint256 startTime,
    uint256 endTime,
    bool isActive,
    uint256 totalVotes
)

// Get poll options with vote counts
function getPollOptions(uint256 _pollId) external view returns (
    string[] memory names,
    uint256[] memory voteCounts
)

// Get all active polls
function getActivePolls() external view returns (uint256[] memory)

// Get poll winner
function getWinner(uint256 _pollId) external view returns (
    string memory winnerName,
    uint256 winnerVoteCount,
    uint256 winnerIndex
)

// Check if address has voted
function hasVoted(uint256 _pollId, address _voter) external view returns (bool)

// Get voter's choice
function getVoterChoice(uint256 _pollId, address _voter) external view returns (
    bool voted,
    uint256 optionIndex
)
```

### Events

```solidity
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
```

### Gas Estimates

| Function | Estimated Gas |
|----------|---------------|
| `createPoll` (4 options) | ~300,000 |
| `vote` | ~80,000 |
| `endPoll` | ~30,000 |

---

## 💻 Frontend

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `HomePage` | List all polls |
| `/create` | `CreatePollPage` | Form to create new poll |
| `/poll/:id` | `PollDetailsPage` | Poll details & voting |
| `/profile` | `ProfilePage` | User voting history |

### Key Components

```jsx
// Web3 Context - Manages wallet connection
<Web3Provider>
  <App />
</Web3Provider>

// Header - Navigation & wallet connection
<Header />

// Poll Card - Displays poll preview
<PollCard poll={poll} onClick={handleClick} />

// Share Buttons - Social sharing
<ShareButtons pollId={id} title={title} />

// Voting Chart - Results visualization
<VotingChart options={options} totalVotes={totalVotes} />
```

### Environment Variables (Frontend)

Contract address and ABI are auto-generated during deployment to `frontend/src/contracts/`.

---

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Test Coverage
```bash
npx hardhat coverage
```

### Test Cases (20 Tests)

```
Voting
  Poll Creation
    ✔ Should create a poll successfully
    ✔ Should emit PollCreated event
    ✔ Should fail if title is empty
    ✔ Should fail if less than 2 options
    ✔ Should fail if duration is too short
    ✔ Should store options correctly
  Voting
    ✔ Should allow voting
    ✔ Should emit Voted event
    ✔ Should not allow double voting
    ✔ Should track voter choice
    ✔ Should fail for invalid option index
    ✔ Should fail for non-existent poll
    ✔ Should update total votes
  Poll Results
    ✔ Should return correct winner
    ✔ Should return correct option vote counts
  Poll Management
    ✔ Should allow creator to end poll
    ✔ Should not allow non-creator to end poll
    ✔ Should not allow voting after poll ends
    ✔ Should not allow voting after time expires
  Active Polls
    ✔ Should return active polls

20 passing
```

---

## 🔐 Security

### Smart Contract Security

| Security Feature | Implementation |
|-----------------|----------------|
| **Reentrancy Protection** | No external calls before state changes |
| **Access Control** | Only creator can end poll |
| **Input Validation** | All inputs validated |
| **Integer Overflow** | Solidity 0.8+ built-in protection |
| **Double Voting Prevention** | Mapping tracks voted addresses |

### Validation Rules

```solidity
require(bytes(_title).length > 0, "Title cannot be empty");
require(_options.length >= 2, "At least 2 options required");
require(_options.length <= 10, "Maximum 10 options allowed");
require(_duration >= 60, "Duration must be at least 1 minute");
require(_duration <= 30 days, "Duration cannot exceed 30 days");
require(!hasVoted[_pollId][msg.sender], "You have already voted");
```

### Best Practices

- ✅ Checks-Effects-Interactions pattern
- ✅ Pull over Push pattern (for future withdrawals)
- ✅ Fail early and fail loud
- ✅ No floating pragma
- ✅ Events for all state changes

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow Solidity style guide
- Write tests for new features
- Update documentation
- Keep commits atomic and descriptive

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [OpenZeppelin](https://openzeppelin.com/) - Smart contract security
- [Ethers.js](https://docs.ethers.org/) - Ethereum library
- [React](https://reactjs.org/) - UI framework
- [MetaMask](https://metamask.io/) - Web3 wallet
- [Chart.js](https://www.chartjs.org/) - Chart visualization

---

<p align="center">
  Made with ❤️ for the Ethereum community
</p>

<p align="center">
  <a href="#-simple-voting-dapp">⬆️ Back to Top</a>
</p>

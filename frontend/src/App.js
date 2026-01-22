import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { Toaster, toast } from 'react-hot-toast';
import './index.css';

// Contract imports - will be generated after deployment
let contractAddress = null;
let contractABI = null;

try {
  const addressData = require('./contracts/contract-address.json');
  const abiData = require('./contracts/Voting.json');
  contractAddress = addressData.Voting;
  contractABI = abiData.abi;
  console.log('✅ Contract loaded - Address:', contractAddress);
} catch (e) {
  console.warn('❌ Contract not deployed yet or files missing:', e.message);
}

// Web3 Context
const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

// Web3 Provider Component
function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error('Please install MetaMask!', {
        icon: '🦊',
        style: {
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
        },
      });
      return;
    }

    try {
      setIsLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setProvider(provider);
      setSigner(signer);
      setAccount(accounts[0]);
      setChainId(Number(network.chainId));

      console.log('Wallet connected:', {
        account: accounts[0],
        chainId: Number(network.chainId),
        chainName: network.name,
      });

      if (contractAddress && contractABI) {
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);
        console.log('✅ Contract initialized successfully');
      } else {
        console.warn('⚠️ Contract address or ABI missing:', { contractAddress, hasABI: !!contractABI });
      }

      toast.success('Wallet Connected!', {
        icon: '🔗',
        style: {
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
        },
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast.error('Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setContract(null);
    toast.success('Wallet disconnected', {
      icon: '👋',
    });
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        }
      });

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          connectWallet();
        } else {
          disconnectWallet();
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        signer,
        contract,
        chainId,
        isLoading,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

// Welcome Overlay Component
function WelcomeOverlay({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'var(--background)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      animation: 'fadeOut 0.5s ease forwards',
      animationDelay: '2.8s',
    }}>
      {/* Animated Grid Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.3,
        backgroundImage:
          'linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Animated Orbs */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'var(--primary)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.4,
          top: '-50px',
          left: '-50px',
          animation: 'welcome-float-1 3s ease-in-out',
        }} />
        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'var(--secondary)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.3,
          bottom: '-100px',
          right: '-50px',
          animation: 'welcome-float-2 3s ease-in-out',
        }} />
      </div>

      {/* Welcome Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
      }}>
        {/* Logo with Glow */}
        <div style={{
          fontSize: '6rem',
          animation: 'welcome-bounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite',
          filter: 'drop-shadow(0 0 30px rgba(139, 92, 246, 0.6))',
          textShadow: '0 0 40px rgba(139, 92, 246, 0.5)',
        }}>
          🗳️
        </div>

        {/* Title with Gradient */}
        <div>
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '700',
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'welcome-slide-up 0.8s ease-out 0.2s backwards',
          }}>
            VoteChain
          </h1>
          <p style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            margin: 0,
            animation: 'welcome-slide-up 0.8s ease-out 0.4s backwards',
          }}>
            Decentralized Voting on Blockchain
          </p>
        </div>

        {/* Animated Dots */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          animation: 'welcome-slide-up 0.8s ease-out 0.6s backwards',
        }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--primary)',
              animation: `welcome-pulse ${0.6 + i * 0.1}s ease-in-out infinite`,
              boxShadow: '0 0 10px rgba(139, 92, 246, 0.6)',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Background Effects Component
function BackgroundEffects() {
  return (
    <>
      <div className="background-effects">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>
      <div className="grid-pattern"></div>
    </>
  );
}

// Header Component
function Header() {
  const { account, connectWallet, disconnectWallet, isLoading, chainId } = useWeb3();
  const location = useLocation();

  const getNetworkName = (chainId) => {
    const networks = {
      1: { name: 'Mainnet', color: '#627eea' },
      5: { name: 'Goerli', color: '#f6c343' },
      11155111: { name: 'Sepolia', color: '#9b59b6' },
      31337: { name: 'Localhost', color: '#10b981' },
      1337: { name: 'Localhost', color: '#10b981' },
    };
    return networks[chainId] || { name: `Chain ${chainId}`, color: '#6b7280' };
  };

  const formatAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const network = getNetworkName(chainId);

  return (
    <header className="header">
      <Link to="/" className="logo">
        <span className="logo-icon">🗳️</span>
        <span>VoteChain</span>
      </Link>

      <nav className="nav">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          <span>🏠</span> Polls
        </Link>
        <Link
          to="/create"
          className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
        >
          <span>✨</span> Create
        </Link>

        {account ? (
          <div className="wallet-btn">
            <div className="wallet-info">
              <span
                className="badge badge-network"
                style={{
                  background: `${network.color}20`,
                  borderColor: `${network.color}50`,
                  color: network.color
                }}
              >
                <span style={{
                  width: '6px',
                  height: '6px',
                  background: network.color,
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '6px',
                  boxShadow: `0 0 10px ${network.color}`
                }}></span>
                {network.name}
              </span>
              <span className="wallet-address">{formatAddress(account)}</span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={disconnectWallet}>
              Disconnect
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={connectWallet}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                Connecting...
              </>
            ) : (
              <>🔗 Connect Wallet</>
            )}
          </button>
        )}
      </nav>
    </header>
  );
}

// Animated Counter Component
function AnimatedNumber({ value, duration = 1000 }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = displayValue;
    const endValue = value;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);

      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(startValue + (endValue - startValue) * easeOutQuart));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue}</span>;
}

// Home Page - List of Polls
function HomePage() {
  const { contract, account } = useWeb3();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, ended
  const navigate = useNavigate();

  useEffect(() => {
    loadPolls();
  }, [contract]);

  const loadPolls = async () => {
    if (!contract) {
      console.log('Contract not available yet');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading polls from contract...');

      const pollCount = await contract.pollCount();
      console.log('Poll count:', pollCount.toString());

      const pollsData = [];

      for (let i = 1; i <= Number(pollCount); i++) {
        try {
          const poll = await contract.getPoll(i);
          const [names, votes] = await contract.getPollOptions(i);

          pollsData.push({
            id: Number(poll.id),
            title: poll.title,
            description: poll.description,
            creator: poll.creator,
            startTime: Number(poll.startTime),
            endTime: Number(poll.endTime),
            isActive: poll.isActive,
            totalVotes: Number(poll.totalVotes),
            options: names.map((name, idx) => ({
              name,
              votes: Number(votes[idx]),
            })),
          });
        } catch (pollError) {
          console.error(`Error loading poll ${i}:`, pollError.message);
          throw pollError;
        }
      }

      console.log('Successfully loaded polls:', pollsData.length);
      setPolls(pollsData.reverse());
    } catch (error) {
      console.error('Error loading polls:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        reason: error.reason,
      });
      toast.error(`Failed to load polls: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredPolls = polls.filter(poll => {
    const isActive = poll.isActive && Date.now() / 1000 < poll.endTime;
    if (filter === 'active') return isActive;
    if (filter === 'ended') return !isActive;
    return true;
  });

  const stats = {
    total: polls.length,
    active: polls.filter(p => p.isActive && Date.now() / 1000 < p.endTime).length,
    totalVotes: polls.reduce((acc, p) => acc + p.totalVotes, 0),
  };

  if (!contract) {
    return (
      <div className="connect-message fade-in">
        <div className="connect-message-icon">🔮</div>
        <h2 className="connect-message-title">Enter the Decentralized World</h2>
        <p className="connect-message-text">
          Connect your Web3 wallet to participate in transparent, immutable voting on the blockchain.
        </p>
        <div className="features-section">
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3 className="feature-title">Secure</h3>
            <p className="feature-description">Your vote is cryptographically secured on the blockchain</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">👁️</span>
            <h3 className="feature-title">Transparent</h3>
            <p className="feature-description">All votes are publicly verifiable by anyone</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⛓️</span>
            <h3 className="feature-title">Immutable</h3>
            <p className="feature-description">Once cast, votes cannot be altered or deleted</p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading fade-in">
        <div className="spinner"></div>
        <p className="loading-text">Loading polls from blockchain...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Decentralized Polls</h1>
          <p className="page-subtitle">Cast your vote on the blockchain - transparent, secure, immutable</p>
        </div>
        <Link to="/create" className="btn btn-primary">
          ✨ Create Poll
        </Link>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value"><AnimatedNumber value={stats.total} /></div>
          <div className="stat-label">Total Polls</div>
        </div>
        <div className="stat-card">
          <div className="stat-value"><AnimatedNumber value={stats.active} /></div>
          <div className="stat-label">Active Polls</div>
        </div>
        <div className="stat-card">
          <div className="stat-value"><AnimatedNumber value={stats.totalVotes} /></div>
          <div className="stat-label">Total Votes</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['all', 'active', 'ended'].map((f) => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'all' && ` (${polls.length})`}
            {f === 'active' && ` (${stats.active})`}
            {f === 'ended' && ` (${polls.length - stats.active})`}
          </button>
        ))}
      </div>

      {filteredPolls.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <h3 className="empty-state-title">
            {filter === 'all' ? 'No polls yet' : `No ${filter} polls`}
          </h3>
          <p>Be the first to create a poll on the blockchain!</p>
          <Link to="/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            ✨ Create Poll
          </Link>
        </div>
      ) : (
        <div className="polls-grid">
          {filteredPolls.map((poll, index) => (
            <div key={poll.id} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <PollCard poll={poll} onClick={() => navigate(`/poll/${poll.id}`)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Poll Card Component
function PollCard({ poll, onClick }) {
  const isActive = poll.isActive && Date.now() / 1000 < poll.endTime;
  const timeLeft = getTimeLeft(poll.endTime);
  const leadingOption = poll.options.reduce((prev, curr) =>
    (curr.votes > prev.votes ? curr : prev), poll.options[0]);

  return (
    <div className="card poll-card" onClick={onClick}>
      <div className="card-header">
        <h3 className="card-title">{poll.title}</h3>
        <span className={`badge ${isActive ? 'badge-active' : 'badge-ended'}`}>
          {isActive ? 'Active' : 'Ended'}
        </span>
      </div>
      <p className="card-description">
        {poll.description.length > 100
          ? `${poll.description.substring(0, 100)}...`
          : poll.description || 'No description provided'}
      </p>

      {/* Leading Option Preview */}
      {poll.totalVotes > 0 && (
        <div style={{
          padding: '0.75rem',
          background: 'var(--surface)',
          borderRadius: '10px',
          marginBottom: '0.75rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            {isActive ? 'Currently Leading' : 'Winner'}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600' }}>{leadingOption.name}</span>
            <span className="gradient-text" style={{ fontWeight: '700' }}>
              {((leadingOption.votes / poll.totalVotes) * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      )}

      <div className="poll-meta">
        <div className="poll-meta-item">
          <span>🗳️</span>
          <span>{poll.totalVotes} vote{poll.totalVotes !== 1 ? 's' : ''}</span>
        </div>
        <div className="poll-meta-item">
          <span>📊</span>
          <span>{poll.options.length} options</span>
        </div>
        <div className={`poll-meta-item ${!isActive ? 'timer-ended' : ''}`}>
          <span>⏱️</span>
          <span>{isActive ? timeLeft : 'Ended'}</span>
        </div>
      </div>
    </div>
  );
}

// Create Poll Page
function CreatePollPage() {
  const { contract, account } = useWeb3();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState(3600);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const durations = [
    { label: '1 Hour', value: 3600, icon: '⏰' },
    { label: '6 Hours', value: 21600, icon: '🕐' },
    { label: '1 Day', value: 86400, icon: '📅' },
    { label: '3 Days', value: 259200, icon: '📆' },
    { label: '1 Week', value: 604800, icon: '🗓️' },
  ];

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contract) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    const validOptions = options.filter((opt) => opt.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please add at least 2 options');
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading('Creating poll on blockchain...', { id: 'create' });

      const tx = await contract.createPoll(title, description, validOptions, duration);

      toast.loading('Waiting for confirmation...', { id: 'create' });
      await tx.wait();

      toast.success('Poll created successfully!', {
        id: 'create',
        icon: '🎉',
        duration: 5000,
      });
      navigate('/');
    } catch (error) {
      console.error('Error creating poll:', error);
      toast.error('Failed to create poll', { id: 'create' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return title.trim().length > 0;
    if (step === 2) return options.filter(o => o.trim()).length >= 2;
    return true;
  };

  if (!account) {
    return (
      <div className="connect-message fade-in">
        <div className="connect-message-icon">🔐</div>
        <h2 className="connect-message-title">Connect to Create</h2>
        <p className="connect-message-text">
          Connect your Web3 wallet to create a new poll on the blockchain.
        </p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <Link to="/" className="back-btn">
        ← Back to Polls
      </Link>

      <h1 className="page-title">Create New Poll</h1>
      <p className="page-subtitle">Deploy your poll to the blockchain</p>

      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        {[
          { num: 1, label: 'Details' },
          { num: 2, label: 'Options' },
          { num: 3, label: 'Duration' },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => setStep(s.num)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px',
              background: step === s.num ? 'var(--primary)' : 'var(--surface)',
              color: step === s.num ? 'white' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: step === s.num ? 'none' : '1px solid var(--border)',
            }}
          >
            <span style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: step === s.num ? 'white' : 'var(--surface-light)',
              color: step === s.num ? 'var(--primary)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.8rem',
              fontWeight: '700'
            }}>
              {step > s.num ? '✓' : s.num}
            </span>
            {s.label}
          </div>
        ))}
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="slide-up">
              <div className="form-group">
                <label className="form-label">Poll Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="What's your poll about?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  autoFocus
                />
                <p className="form-hint">{title.length}/100 characters</p>
              </div>

              <div className="form-group">
                <label className="form-label">Description (Optional)</label>
                <textarea
                  className="form-textarea"
                  placeholder="Add more context to help voters understand..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                />
                <p className="form-hint">{description.length}/500 characters</p>
              </div>
            </div>
          )}

          {/* Step 2: Options */}
          {step === 2 && (
            <div className="slide-up">
              <div className="form-group">
                <label className="form-label">Voting Options *</label>
                <p className="form-hint" style={{ marginBottom: '1rem' }}>
                  Add 2-10 options for voters to choose from
                </p>
                <div className="options-container">
                  {options.map((option, index) => (
                    <div key={index} className="option-row">
                      <span className="option-number">{index + 1}</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        maxLength={50}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          className="remove-option-btn"
                          onClick={() => removeOption(index)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {options.length < 10 && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm add-option-btn"
                    onClick={addOption}
                  >
                    + Add Option
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Duration */}
          {step === 3 && (
            <div className="slide-up">
              <div className="form-group">
                <label className="form-label">Poll Duration</label>
                <p className="form-hint" style={{ marginBottom: '1rem' }}>
                  How long should the poll remain open for voting?
                </p>
                <div className="duration-selector">
                  {durations.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      className={`duration-option ${duration === d.value ? 'selected' : ''}`}
                      onClick={() => setDuration(d.value)}
                    >
                      <span>{d.icon}</span> {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview Card */}
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                background: 'var(--background-secondary)',
                borderRadius: '16px',
                border: '1px solid var(--border)'
              }}>
                <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Preview</h4>
                <h3 style={{ marginBottom: '0.5rem' }}>{title || 'Your Poll Title'}</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  {description || 'Your poll description...'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    📊 {options.filter(o => o.trim()).length} options
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    ⏱️ {durations.find(d => d.value === duration)?.label}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '2rem',
            gap: '1rem'
          }}>
            {step > 1 ? (
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep(step - 1)}
              >
                ← Back
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid()}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting || !title.trim() || options.filter(o => o.trim()).length < 2}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                    Deploying...
                  </>
                ) : (
                  <>🚀 Deploy Poll</>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// Poll Details Page
function PollDetailsPage() {
  const { id } = useParams();
  const { contract, account } = useWeb3();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isVoting, setIsVoting] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    loadPollDetails();
  }, [contract, id, account]);

  // Real-time countdown
  useEffect(() => {
    if (!poll) return;

    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(poll.endTime));
    }, 1000);

    return () => clearInterval(timer);
  }, [poll]);

  const loadPollDetails = async () => {
    if (!contract) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const pollData = await contract.getPoll(id);
      const [names, votes] = await contract.getPollOptions(id);

      setPoll({
        id: Number(pollData.id),
        title: pollData.title,
        description: pollData.description,
        creator: pollData.creator,
        startTime: Number(pollData.startTime),
        endTime: Number(pollData.endTime),
        isActive: pollData.isActive,
        totalVotes: Number(pollData.totalVotes),
      });

      setOptions(
        names.map((name, idx) => ({
          index: idx,
          name,
          votes: Number(votes[idx]),
        }))
      );

      if (account) {
        const [voted, choice] = await contract.getVoterChoice(id, account);
        setHasVoted(voted);
        setUserVote(voted ? Number(choice) : null);
      }
    } catch (error) {
      console.error('Error loading poll:', error);
      toast.error('Failed to load poll details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (selectedOption === null) {
      toast.error('Please select an option');
      return;
    }

    try {
      setIsVoting(true);
      toast.loading('Submitting vote to blockchain...', { id: 'vote' });

      const tx = await contract.vote(id, selectedOption);

      toast.loading('Waiting for confirmation...', { id: 'vote' });
      await tx.wait();

      toast.success('Vote recorded on blockchain!', {
        id: 'vote',
        icon: '🎉',
        duration: 5000,
      });
      loadPollDetails();
    } catch (error) {
      console.error('Error voting:', error);
      if (error.message.includes('already voted')) {
        toast.error('You have already voted on this poll', { id: 'vote' });
      } else {
        toast.error('Failed to submit vote', { id: 'vote' });
      }
    } finally {
      setIsVoting(false);
    }
  };

  const handleEndPoll = async () => {
    try {
      toast.loading('Ending poll...', { id: 'end' });
      const tx = await contract.endPoll(id);
      await tx.wait();
      toast.success('Poll ended successfully!', { id: 'end' });
      loadPollDetails();
    } catch (error) {
      console.error('Error ending poll:', error);
      toast.error('Failed to end poll', { id: 'end' });
    }
  };

  if (!contract) {
    return (
      <div className="connect-message fade-in">
        <div className="connect-message-icon">🔌</div>
        <h2 className="connect-message-title">Connect Your Wallet</h2>
        <p className="connect-message-text">Connect your wallet to view poll details.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading fade-in">
        <div className="spinner"></div>
        <p className="loading-text">Loading poll from blockchain...</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="empty-state fade-in">
        <div className="empty-state-icon">❌</div>
        <h3 className="empty-state-title">Poll not found</h3>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Back to Polls
        </Link>
      </div>
    );
  }

  const isActive = poll.isActive && Date.now() / 1000 < poll.endTime;
  const isCreator = account?.toLowerCase() === poll.creator.toLowerCase();
  const canVote = isActive && !hasVoted && account;
  const maxVotes = Math.max(...options.map((o) => o.votes), 1);

  return (
    <div className="fade-in">
      <Link to="/" className="back-btn">
        ← Back to Polls
      </Link>

      <div className="card">
        <div className="poll-details-header">
          <div>
            <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>{poll.title}</h1>
            <p className="poll-creator">
              Created by <code>{poll.creator}</code>
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span className={`badge ${isActive ? 'badge-active' : 'badge-ended'}`}>
              {isActive ? 'Active' : 'Ended'}
            </span>
            {hasVoted && <span className="badge badge-voted">✓ Voted</span>}
          </div>
        </div>

        {poll.description && (
          <p className="card-description" style={{ fontSize: '1.05rem' }}>
            {poll.description}
          </p>
        )}

        {/* Timer & Stats */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className={`timer ${!isActive ? 'timer-ended' : ''}`}>
            <span>⏱️</span>
            <span>{isActive ? `Ends in ${timeLeft}` : 'Poll has ended'}</span>
          </div>
          <div className="chain-indicator">
            On-chain verified
          </div>
        </div>

        <div className="total-votes">
          <span>🗳️</span>
          <span><AnimatedNumber value={poll.totalVotes} /> Vote{poll.totalVotes !== 1 ? 's' : ''}</span>
        </div>

        {/* Voting Options */}
        <div className="voting-options">
          {options.map((option) => {
            const percentage = poll.totalVotes > 0
              ? ((option.votes / poll.totalVotes) * 100).toFixed(1)
              : 0;
            const isUserChoice = userVote === option.index;
            const isWinner = !isActive && option.votes === maxVotes && option.votes > 0;

            return (
              <div
                key={option.index}
                className={`voting-option ${
                  canVote ? (selectedOption === option.index ? 'selected' : '') : 'voted'
                } ${isUserChoice ? 'user-voted' : ''}`}
                onClick={() => canVote && setSelectedOption(option.index)}
              >
                <div className="option-content">
                  <span className="option-name">
                    {canVote && (
                      <span style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: selectedOption === option.index
                          ? '6px solid var(--primary)'
                          : '2px solid var(--border)',
                        marginRight: '0.75rem',
                        transition: 'all 0.2s ease',
                        flexShrink: 0,
                      }} />
                    )}
                    {option.name}
                    {isUserChoice && ' ✓'}
                    {isWinner && <span className="winner-badge">👑 Winner</span>}
                  </span>
                  <span className="option-votes">
                    <span className="option-percentage">{percentage}%</span>
                    <span style={{ marginLeft: '0.5rem' }}>
                      ({option.votes} vote{option.votes !== 1 ? 's' : ''})
                    </span>
                  </span>
                </div>
                <div
                  className="progress-bar"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          {canVote && (
            <button
              className="btn btn-success"
              onClick={handleVote}
              disabled={isVoting || selectedOption === null}
              style={{ flex: 1, minWidth: '200px' }}
            >
              {isVoting ? (
                <>
                  <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></span>
                  Confirming...
                </>
              ) : (
                <>🗳️ Cast Vote</>
              )}
            </button>
          )}

          {isCreator && isActive && (
            <button className="btn btn-danger" onClick={handleEndPoll}>
              🛑 End Poll
            </button>
          )}
        </div>

        {hasVoted && isActive && (
          <p style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            color: 'var(--text-secondary)',
            padding: '1rem',
            background: 'var(--surface)',
            borderRadius: '12px'
          }}>
            ✅ Your vote has been recorded on the blockchain
          </p>
        )}

        {/* Transaction Info */}
        <div style={{
          marginTop: '2rem',
          padding: '1rem',
          background: 'var(--background-secondary)',
          borderRadius: '12px',
          border: '1px solid var(--border)'
        }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            📋 Poll ID: #{poll.id}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            🕐 Created: {new Date(poll.startTime * 1000).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

// Helper function to format time left
function getTimeLeft(endTime) {
  const now = Date.now() / 1000;
  const diff = endTime - now;

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);
  const seconds = Math.floor(diff % 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

// Main App Component
function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
  };

  return (
    <Web3Provider>
      <Router>
        <div className="app">
          <BackgroundEffects />
          {showWelcome && <WelcomeOverlay onComplete={handleWelcomeComplete} />}
          <Header />
          <main className="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePollPage />} />
              <Route path="/poll/:id" element={<PollDetailsPage />} />
            </Routes>
          </main>
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'toast-custom',
              duration: 4000,
              style: {
                background: 'rgba(30, 30, 40, 0.9)',
                color: '#f4f4f5',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
              },
            }}
          />
        </div>
      </Router>
    </Web3Provider>
  );
}

export default App;

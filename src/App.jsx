import React, { useState } from 'react';
import './App.css';

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const App = () => {
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([
    '0xAlice.eth',
    '0xBob.eth',
    '0xCarol.eth',
    '0xDave.eth'
  ]);
  const [leafHashes, setLeafHashes] = useState([]);
  const [merkleRoot, setMerkleRoot] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [activeTab, setActiveTab] = useState('demo');
  const [showAnimation, setShowAnimation] = useState(false);

  const generateLeafHashes = async () => {
    setShowAnimation(true);
    const hashes = await Promise.all(addresses.map(addr => sha256(addr)));
    setLeafHashes(hashes);
    setStep(2);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const generateMerkleRoot = async () => {
    setShowAnimation(true);
    let currentLevel = [...leafHashes];
    
    while (currentLevel.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < currentLevel.length; i += 2) {
        const left = currentLevel[i];
        const right = currentLevel[i + 1] || left;
        const combinedHash = await sha256(left + right);
        nextLevel.push(combinedHash);
      }
      currentLevel = nextLevel;
    }
    
    setMerkleRoot(currentLevel[0]);
    setStep(3);
    setTimeout(() => setShowAnimation(false), 1000);
  };

  const addAddress = () => {
    if (newAddress) {
      setAddresses([...addresses, newAddress]);
      setNewAddress('');
    }
  };

  return (
    <div className="app-wrapper">
      <div className="animated-background"></div>
      <div className="app-container">
        <nav className="navbar">
          <div className="nav-content">
            <div className="logo">
              <div className="logo-icon">🌳</div>
              <span>Web3 Merkle Tree Explorer</span>
            </div>
            <div className="nav-tabs">
              <button 
                className={`nav-tab ${activeTab === 'demo' ? 'active' : ''}`}
                onClick={() => setActiveTab('demo')}
              >
                Interactive Demo
              </button>
              <button 
                className={`nav-tab ${activeTab === 'learn' ? 'active' : ''}`}
                onClick={() => setActiveTab('learn')}
              >
                Web3 Learning
              </button>
            </div>
          </div>
        </nav>

        <main className="main-content">
          {activeTab === 'demo' ? (
            <div className="demo-container">
              <div className="intro-card">
                <div className="card-glow"></div>
                <h1>Build a Merkle Tree</h1>
                <p className="intro-text">
                  Experience how blockchain technologies use Merkle trees to ensure data integrity 
                  and efficient verification. Perfect for Web3 developers and enthusiasts!
                </p>
              </div>

              <div className="steps-container">
                <div className={`step-card ${step >= 1 ? 'active' : ''}`}>
                  <div className="step-header">
                    <div className="step-number">1</div>
                    <h2>Add Wallet Addresses</h2>
                  </div>
                  <div className="step-content">
                    <div className="info-box">
                      <p>In blockchain, Merkle trees are often used to verify wallet addresses or transactions.</p>
                    </div>
                    <div className="address-input-container">
                      <input
                        type="text"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
                        placeholder="Enter wallet address or ENS name"
                        className="modern-input"
                      />
                      <button onClick={addAddress} className="modern-button">
                        Add
                      </button>
                    </div>
                    <div className="address-list">
                      {addresses.map((addr, i) => (
                        <div key={i} className="address-item">
                          <div className="address-badge">{i + 1}</div>
                          <span className="address-text">{addr}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`step-card ${step >= 2 ? 'active' : ''}`}>
                  <div className="step-header">
                    <div className="step-number">2</div>
                    <h2>Create Leaf Nodes</h2>
                  </div>
                  <div className="step-content">
                    <div className="info-box">
                      <p>Each address is hashed using SHA-256, creating the bottom layer of our Merkle tree.</p>
                    </div>
                    <button 
                      onClick={generateLeafHashes}
                      className={`modern-button full-width ${showAnimation ? 'processing' : ''}`}
                      disabled={step >= 2}
                    >
                      Generate Leaf Hashes
                    </button>
                    {leafHashes.length > 0 && (
                      <div className="hash-container">
                        {leafHashes.map((hash, i) => (
                          <div key={i} className="hash-box">
                            <div className="hash-header">
                              <span className="hash-number">Hash {i + 1}</span>
                              <span className="hash-address">{addresses[i]}</span>
                            </div>
                            <div className="hash-content">
                              {hash.substring(0, 20)}...
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className={`step-card ${step >= 3 ? 'active' : ''}`}>
                  <div className="step-header">
                    <div className="step-number">3</div>
                    <h2>Calculate Root Hash</h2>
                  </div>
                  <div className="step-content">
                    <div className="info-box">
                      <p>The final step combines all hashes into a single Merkle root, which represents the entire dataset.</p>
                    </div>
                    <button 
                      onClick={generateMerkleRoot}
                      className={`modern-button full-width ${showAnimation ? 'processing' : ''}`}
                      disabled={step < 2 || step >= 3}
                    >
                      Generate Root Hash
                    </button>
                    {merkleRoot && (
                      <div className="merkle-root-box">
                        <div className="merkle-root-header">
                          <span className="merkle-root-title">Merkle Root</span>
                          <span className="merkle-root-badge">Final Hash</span>
                        </div>
                        <div className="merkle-root-hash">
                          {merkleRoot}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="learn-container">
              <div className="learn-grid">
                <div className="learn-card concept-card">
                  <h2>Understanding Merkle Trees in Web3</h2>
                  <p>Merkle trees are fundamental to blockchain technology, enabling efficient and secure verification of large amounts of data.</p>
                  
                  <div className="concept-section">
                    <h3>Key Concepts</h3>
                    <div className="concept-grid">
                      <div className="concept-item">
                        <div className="concept-icon">🔐</div>
                        <h4>Cryptographic Hashing</h4>
                        <p>Converting data into fixed-size hash values using SHA-256</p>
                      </div>
                      <div className="concept-item">
                        <div className="concept-icon">🌲</div>
                        <h4>Tree Structure</h4>
                        <p>Organizing hashes in a binary tree format for efficient verification</p>
                      </div>
                      <div className="concept-item">
                        <div className="concept-icon">🔍</div>
                        <h4>Merkle Proofs</h4>
                        <p>Verifying data inclusion without downloading entire datasets</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="learn-card applications-card">
                  <h3>Web3 Applications</h3>
                  <div className="applications-grid">
                    <div className="application-item">
                      <h4>Bitcoin</h4>
                      <ul>
                        <li>Verifies transactions in blocks</li>
                        <li>Enables lightweight clients (SPV)</li>
                        <li>Reduces storage requirements</li>
                      </ul>
                    </div>
                    <div className="application-item">
                      <h4>Ethereum</h4>
                      <ul>
                        <li>State management</li>
                        <li>Transaction verification</li>
                        <li>Smart contract optimization</li>
                      </ul>
                    </div>
                    <div className="application-item">
                      <h4>NFTs</h4>
                      <ul>
                        <li>Whitelist verification</li>
                        <li>Airdrop distribution</li>
                        <li>Ownership proofs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="learn-card benefits-card">
                  <h3>Benefits for Web3</h3>
                  <div className="benefits-grid">
                    <div className="benefit-item">
                      <div className="benefit-icon">⚡</div>
                      <div className="benefit-content">
                        <h4>Scalability</h4>
                        <p>Enables quick verification of large datasets without processing all data</p>
                      </div>
                    </div>
                    <div className="benefit-item">
                      <div className="benefit-icon">🛡️</div>
                      <div className="benefit-content">
                        <h4>Security</h4>
                        <p>Tamper-proof verification of data integrity in blockchain networks</p>
                      </div>
                    </div>
                    <div className="benefit-item">
                      <div className="benefit-icon">💾</div>
                      <div className="benefit-content">
                        <h4>Efficiency</h4>
                        <p>Reduces storage and bandwidth requirements for blockchain nodes</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
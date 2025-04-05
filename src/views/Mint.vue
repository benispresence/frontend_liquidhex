<template>
  <div class="mint-container">
    <!-- Navigation bar matching the Home page -->
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-logo">
          <img src="/logo.png" alt="LiquidHEX Logo" class="nav-logo">
          <span class="nav-title">LiquidHEX</span>
        </div>
        <div class="navbar-menu-toggle" @click="toggleMenu">
          <div class="bar" :class="{ 'open': menuOpen }"></div>
          <div class="bar" :class="{ 'open': menuOpen }"></div>
          <div class="bar" :class="{ 'open': menuOpen }"></div>
        </div>
        <div class="navbar-links" :class="{ 'open': menuOpen }">
          <router-link to="/" @click="closeMenu">Home</router-link>
          <router-link to="/#benefits" @click="closeMenu">Benefits</router-link>
          <router-link to="/#how-it-works" @click="closeMenu">How it Works</router-link>
          <router-link to="/#faq" @click="closeMenu">FAQ</router-link>
          <router-link to="/mint" class="nav-cta-button" @click="closeMenu">Mint Now</router-link>
        </div>
      </div>
    </nav>

    <!-- Hero section for mint page -->
    <header class="mint-hero">
      <div class="hero-content">
        <h1 class="hero-title">Mint LiquidHEX</h1>
        <div class="wallet-connection">
          <button 
            class="connect-button" 
            @click="connectToMetaMask"
            :disabled="account"
          >
            {{ account ? 'Connected' : 'Connect MetaMask' }}
          </button>
          <div class="connection-status" :class="{ 'connected': account }">
            {{ account ? formatAddress(account) : 'Not Connected' }}
          </div>
        </div>
      </div>
    </header>

    <!-- Action buttons section -->
    <section class="action-section">
      <h2 class="section-title">Management Actions</h2>
      <div class="action-buttons">
        <button class="action-button" @click="showPopup('transfer')">
          <span class="icon">📤</span>
          Transfer
        </button>
        <button class="action-button" @click="showPopup('mint')">
          <span class="icon">🔨</span>
          Mint Manually
        </button>
        <button class="action-button" @click="showPopup('signature')">
          <span class="icon">✍️</span>
          Create Signature
        </button>
      </div>
    </section>

    <!-- Popup container for forms -->
    <div id="popupContainer" ref="popupContainer" class="popup-container">
      <div class="popup-content">
        <div class="popup-header">
          <h3>{{ getPopupTitle() }}</h3>
          <span class="close-btn" @click="closePopup">&times;</span>
        </div>
        <div class="popup-body">
          <!-- Transfer Form -->
          <div v-if="activePopup === 'transfer'" class="form-container">
            <div class="form-group">
              <label for="transferTo">Recipient Address:</label>
              <input type="text" id="transferTo" v-model="transferData.to" placeholder="0x...">
            </div>
            <div class="form-group">
              <label for="transferAmount">Amount:</label>
              <input type="text" id="transferAmount" v-model="transferData.amount" placeholder="Amount in LHEX">
            </div>
            <button class="submit-button" @click="handleTransfer">Transfer LHEX</button>
          </div>
          
          <!-- Mint Manually Form -->
          <div v-if="activePopup === 'mint'" class="form-container">
            <div class="form-group">
              <label for="mintId">Stake ID:</label>
              <input type="text" id="mintId" v-model="mintData.id" placeholder="Stake ID">
            </div>
            <div class="form-group">
              <label for="mintAmount">Amount:</label>
              <input type="text" id="mintAmount" v-model="mintData.amount" placeholder="Amount in LHEX">
            </div>
            <div class="form-group">
              <label for="mintStartDate">Minting Start Date (Unix):</label>
              <input type="text" id="mintStartDate" v-model="mintData.startDate" placeholder="Minting Start Date">
            </div>
            <div class="form-group">
              <label for="mintEndDate">Minting End Date (Unix):</label>
              <input type="text" id="mintEndDate" v-model="mintData.endDate" placeholder="Minting End Date">
            </div>
            <div class="form-group">
              <label for="mintProof">Merkle Proof (comma separated hex strings):</label>
              <textarea id="mintProof" v-model="mintData.proof" placeholder="Merkle Proof"></textarea>
            </div>
            <button class="submit-button" @click="handleMint">Mint LHEX</button>
          </div>
          
          <!-- Create Signature Form -->
          <div v-if="activePopup === 'signature'" class="form-container">
            <div class="form-group">
              <label for="sigBurnerAddress">Burner Address:</label>
              <input type="text" id="sigBurnerAddress" v-model="signatureData.burnerAddress" placeholder="0x...">
            </div>
            <div class="form-group">
              <label for="sigId">Stake ID:</label>
              <input type="text" id="sigId" v-model="signatureData.id" placeholder="Stake ID">
            </div>
            <div class="form-group">
              <label for="sigAmount">Amount:</label>
              <input type="text" id="sigAmount" v-model="signatureData.amount" placeholder="Amount in LHEX">
            </div>
            <div class="form-group">
              <label for="sigStartDate">Minting Start Date (Unix):</label>
              <input type="text" id="sigStartDate" v-model="signatureData.startDate" placeholder="Minting Start Date">
            </div>
            <div class="form-group">
              <label for="sigEndDate">Minting End Date (Unix):</label>
              <input type="text" id="sigEndDate" v-model="signatureData.endDate" placeholder="Minting End Date">
            </div>
            <div class="form-group">
              <label for="sigProof">Merkle Proof (comma separated hex strings):</label>
              <textarea id="sigProof" v-model="signatureData.proof" placeholder="Merkle Proof"></textarea>
            </div>
            <button class="submit-button" @click="handleCreateSignature">Create Signature</button>
            <div v-if="signatureOutput" class="signature-output">
              <h4>Generated Signature:</h4>
              <div class="output-code">{{ signatureOutput }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stakes table section -->
    <section class="stakes-section">
      <h2 class="section-title">Your Eligible Stakes</h2>
      <div class="stakes-container">
        <div class="stakes-table-wrapper">
          <table class="stakes-table">
            <thead>
              <tr>
                <th>Stake ID</th>
                <th>Address</th>
                <th>Amount</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(stake, index) in stakes" :key="index" :class="{ 'minted': stake.minted, 'connected-address': stake.address === account }">
                <td>{{ stake.id }}</td>
                <td>{{ formatAddress(stake.address) }}</td>
                <td>{{ formatAmount(stake.amount) }}</td>
                <td>{{ formatDate(stake.startDate) }}</td>
                <td>{{ formatDate(stake.endDate) }}</td>
                <td>
                  <button 
                    v-if="!stake.minted && stake.address === account" 
                    class="mint-button" 
                    @click="initiateMint(stake)"
                  >
                    Mint
                  </button>
                  <span v-else>{{ stake.minted ? 'Minted' : '-' }}</span>
                </td>
              </tr>
              <tr v-if="stakes.length === 0" v-for="n in 10" :key="`empty-${n}`" class="empty-row">
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-links">
        <a href="https://t.me/liquidhex" target="_blank">
          <span class="icon">💬</span>
          Group Chat
        </a>
        <a href="https://github.com/benispresence/liquidhex" target="_blank">
          <span class="icon">📄</span>
          Smart Contract Source
        </a>
        <a href="https://github.com/benispresence/frontend_liquidhex" target="_blank">
          <span class="icon">💻</span>
          Frontend Source
        </a>
      </div>
      <div class="copyright">
        &copy; {{ new Date().getFullYear() }} LiquidHEX
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ethers } from 'ethers'
import Papa from 'papaparse'

// Mobile menu state
const menuOpen = ref(false);

// Toggle mobile menu
function toggleMenu() {
  menuOpen.value = !menuOpen.value;
  
  // Prevent scrolling when menu is open
  if (menuOpen.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

// Close mobile menu
function closeMenu() {
  menuOpen.value = false;
  document.body.style.overflow = '';
}

// Store event listeners for cleanup
const eventListeners = ref([]);

// Clean up event listeners when component is unmounted
onBeforeUnmount(() => {
  eventListeners.value.forEach(({ element, type, handler }) => {
    element.removeEventListener(type, handler);
  });
});

// State variables
const account = ref(null)
const stakes = ref([])
const activePopup = ref(null)
const popupContainer = ref(null)
const signatureOutput = ref(null)

// Form data
const transferData = ref({ to: '', amount: '' })
const mintData = ref({ id: '', amount: '', startDate: '', endDate: '', proof: '' })
const signatureData = ref({ burnerAddress: '', id: '', amount: '', startDate: '', endDate: '', proof: '' })

// Get popup title based on active popup
function getPopupTitle() {
  switch(activePopup.value) {
    case 'transfer': return 'Transfer LHEX';
    case 'mint': return 'Mint LHEX Manually';
    case 'signature': return 'Create Signature';
    default: return '';
  }
}

// Smart contract configuration
const tokenAddress = '0xa73f450E3f17468A64BFdD222b099857Db76634d'
const tokenABI = [
  // ... abbreviated for brevity, would include full ABI in actual implementation
  // Main functions needed: balanceOf, claim, transfer, claimTo
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "mintingStartDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "mintingEndDate",
        "type": "uint256"
      },
      {
        "internalType": "bytes32[]",
        "name": "merkleProof",
        "type": "bytes32[]"
      }
    ],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

// Web3 providers and contract instances
let provider
let signer
let tokenContract

// Metamask connection
async function connectToMetaMask() {
  try {
    if (typeof window.ethereum !== 'undefined') {
      provider = new ethers.BrowserProvider(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      signer = await provider.getSigner()
      account.value = await signer.getAddress()
      tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer)
      
      // Once connected, fetch stakes data
      await fetchAndDisplayStakes(account.value)
    } else {
      alert("MetaMask is not installed. Please install MetaMask to use this application.")
    }
  } catch (error) {
    console.error("Error connecting to MetaMask:", error)
    alert(`Error connecting to MetaMask: ${error.message}`)
  }
}

// Fetch stakes for the connected account
async function fetchAndDisplayStakes(address) {
  try {
    // In a real implementation, this would fetch from your CSV files or API
    // For this example, we're generating sample data
    const sampleStakes = [
      {
        id: '12345',
        address: address,
        amount: ethers.parseEther('1000'),
        startDate: Math.floor(Date.now() / 1000) - 3600 * 24 * 30, // 30 days ago
        endDate: Math.floor(Date.now() / 1000) + 3600 * 24 * 30, // 30 days from now
        minted: false
      },
      {
        id: '67890',
        address: address,
        amount: ethers.parseEther('2500'),
        startDate: Math.floor(Date.now() / 1000) - 3600 * 24 * 60, // 60 days ago
        endDate: Math.floor(Date.now() / 1000) + 3600 * 24 * 15, // 15 days from now
        minted: true
      }
    ]
    
    stakes.value = sampleStakes
    
    // In a real implementation, check which stakes are already minted
    for (const stake of stakes.value) {
      if (!stake.minted) {
        try {
          // This would check the contract to see if the stake is already claimed
          // stake.minted = await tokenContract.isClaimed(stake.id)
        } catch (error) {
          console.error(`Error checking if stake ${stake.id} is claimed:`, error)
        }
      }
    }
  } catch (error) {
    console.error("Error fetching stakes:", error)
    alert(`Error fetching stakes: ${error.message}`)
  }
}

// Helper function to initialize table with placeholders
function initializeEmptyTable() {
  stakes.value = []
}

// Initiate the minting process for a stake
async function initiateMint(stake) {
  try {
    if (!account.value) {
      alert("Please connect your wallet first")
      return
    }
    
    // In a real implementation, this would fetch the merkle proof
    // For this example, we use a placeholder
    const merkleProof = []
    
    // Call the contract to mint tokens
    const tx = await tokenContract.claim(
      stake.id,
      stake.amount,
      stake.startDate,
      stake.endDate,
      merkleProof
    )
    
    await tx.wait()
    
    // Mark the stake as minted after successful transaction
    const updatedStakes = [...stakes.value]
    const stakeIndex = updatedStakes.findIndex(s => s.id === stake.id)
    if (stakeIndex !== -1) {
      updatedStakes[stakeIndex].minted = true
    }
    stakes.value = updatedStakes
    
    alert(`Successfully minted LiquidHEX for stake ID ${stake.id}`)
  } catch (error) {
    console.error("Error minting:", error)
    alert(`Error minting: ${error.message}`)
  }
}

// Handle transfer of tokens
async function handleTransfer() {
  try {
    if (!account.value) {
      alert("Please connect your wallet first")
      return
    }
    
    if (!ethers.isAddress(transferData.value.to)) {
      alert("Invalid recipient address")
      return
    }
    
    if (!transferData.value.amount || isNaN(Number(transferData.value.amount))) {
      alert("Invalid amount")
      return
    }
    
    const amount = ethers.parseEther(transferData.value.amount)
    
    const tx = await tokenContract.transfer(transferData.value.to, amount)
    await tx.wait()
    
    alert("Transfer successful!")
    closePopup()
  } catch (error) {
    console.error("Error transferring tokens:", error)
    alert(`Error transferring tokens: ${error.message}`)
  }
}

// Handle manual minting
async function handleMint() {
  try {
    if (!account.value) {
      alert("Please connect your wallet first")
      return
    }
    
    // Validate inputs
    if (!mintData.value.id || 
        !mintData.value.amount || 
        !mintData.value.startDate || 
        !mintData.value.endDate || 
        !mintData.value.proof) {
      alert("All fields are required")
      return
    }
    
    // Parse merkle proof string into array
    const merkleProofArray = mintData.value.proof
      .split(',')
      .map(p => p.trim())
      .filter(p => p !== '')
    
    const tx = await tokenContract.claim(
      mintData.value.id,
      ethers.parseEther(mintData.value.amount),
      mintData.value.startDate,
      mintData.value.endDate,
      merkleProofArray
    )
    
    await tx.wait()
    
    alert("Manual mint successful!")
    closePopup()
  } catch (error) {
    console.error("Error with manual mint:", error)
    alert(`Error with manual mint: ${error.message}`)
  }
}

// Handle signature creation
async function handleCreateSignature() {
  try {
    if (!account.value) {
      alert("Please connect your wallet first")
      return
    }
    
    // Validate inputs
    if (!signatureData.value.burnerAddress || 
        !ethers.isAddress(signatureData.value.burnerAddress) ||
        !signatureData.value.id || 
        !signatureData.value.amount || 
        !signatureData.value.startDate || 
        !signatureData.value.endDate || 
        !signatureData.value.proof) {
      alert("All fields are required and must be valid")
      return
    }
    
    // This is simplified. In a real implementation, you would:
    // 1. Create a hash of the parameters
    // 2. Sign the hash with the user's private key
    // 3. Format the signature for use in the contract's claimWithSignature function
    
    // Placeholder for demo purposes
    signatureOutput.value = "Signature created. This would be a real signature in production."
  } catch (error) {
    console.error("Error creating signature:", error)
    alert(`Error creating signature: ${error.message}`)
  }
}

// Popup management
function showPopup(type) {
  activePopup.value = type
  if (popupContainer.value) {
    popupContainer.value.style.display = 'block'
    
    // Prevent scrolling of background content
    document.body.style.overflow = 'hidden';
  }
}

function closePopup() {
  if (popupContainer.value) {
    popupContainer.value.style.display = 'none'
    
    // Allow scrolling again
    document.body.style.overflow = '';
  }
  activePopup.value = null
  signatureOutput.value = null
}

// Utility functions
function formatAddress(address) {
  if (!address) return '-'
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
}

function formatAmount(amount) {
  if (!amount) return '-'
  try {
    return parseFloat(ethers.formatEther(amount)).toFixed(2)
  } catch {
    return amount.toString()
  }
}

function formatDate(timestamp) {
  if (!timestamp) return '-'
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleDateString()
}

// Initialize empty table and setup on component mount
onMounted(() => {
  initializeEmptyTable()
  
  // Check if MetaMask is already connected
  if (window.ethereum && window.ethereum.isConnected()) {
    connectToMetaMask()
  }
})
</script>

<style scoped>
/* Navigation styles (matching Home page) */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 139, 0.9);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.8rem 1.5rem;
}

.navbar-logo {
  display: flex;
  align-items: center;
}

.nav-logo {
  width: 35px;
  height: 35px;
  margin-right: 0.5rem;
}

.nav-title {
  font-size: 1.3rem;
  font-weight: bold;
  color: #fff;
}

.navbar-links {
  display: flex;
  align-items: center;
}

.navbar-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  margin-left: 1.5rem;
  font-weight: 500;
  transition: color 0.3s ease;
  position: relative;
}

.navbar-links a:hover {
  color: #f39c12;
}

.navbar-links a::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: #f39c12;
  transition: width 0.3s ease;
}

.navbar-links a:hover::after {
  width: 100%;
}

.nav-cta-button {
  background: #f39c12;
  color: #fff !important;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.nav-cta-button:hover {
  background: #e67e22;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.nav-cta-button::after {
  display: none;
}

.navbar-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  cursor: pointer;
}

.bar {
  height: 3px;
  width: 100%;
  background-color: #fff;
  border-radius: 2px;
  transition: all 0.3s ease;
}

/* Main container styles */
.mint-container {
  padding-top: 70px; /* Adjust for navbar */
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

/* Hero section styles */
.mint-hero {
  background: radial-gradient(ellipse at center, rgba(0, 0, 139, 0.7) 0%, rgba(0, 0, 139, 0.3) 100%);
  padding: 4rem 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.hero-title {
  font-size: 3rem;
  margin-bottom: 2rem;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.wallet-connection {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
}

.connect-button {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: #fff;
  padding: 12px 28px;
  font-size: 1.2rem;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.5);
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  min-width: 200px;
}

.connect-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(243, 156, 18, 0.6);
}

.connect-button:disabled {
  background: linear-gradient(135deg, #7cb342, #388e3c);
  cursor: default;
}

.connection-status {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

.connection-status.connected {
  background-color: rgba(0, 128, 0, 0.2);
  color: #fff;
}

/* Section titles */
.section-title {
  font-size: 2.2rem;
  margin: 2.5rem 0 1.5rem;
  text-align: center;
  color: #fff;
  position: relative;
  display: inline-block;
  left: 50%;
  transform: translateX(-50%);
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, rgba(243, 156, 18, 0.8), rgba(255, 165, 0, 0.4));
  border-radius: 2px;
}

/* Action buttons section */
.action-section {
  text-align: center;
  margin-bottom: 3rem;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.action-button {
  background-color: rgba(57, 52, 36, 0.8);
  padding: 1.2rem 2rem;
  border-radius: 10px;
  border: none;
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.action-button:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.3);
  background-color: rgba(243, 156, 18, 0.8);
}

.action-button .icon {
  font-size: 2rem;
  margin-bottom: 0.8rem;
}

/* Popup styles */
.popup-container {
  display: none;
  position: fixed;
  z-index: 1001;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
}

.popup-content {
  background-color: rgba(0, 0, 139, 0.9);
  margin: 10% auto;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  animation: slideIn 0.3s ease-out;
  overflow: hidden;
}

@keyframes slideIn {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.popup-header {
  background-color: rgba(57, 52, 36, 1);
  padding: 1.2rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(243, 156, 18, 0.3);
}

.popup-header h3 {
  margin: 0;
  color: #f39c12;
  font-size: 1.3rem;
}

.close-btn {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.8rem;
  font-weight: bold;
  cursor: pointer;
  transition: color 0.3s ease;
  line-height: 1;
}

.close-btn:hover {
  color: #f39c12;
}

.popup-body {
  padding: 2rem;
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #fff;
  font-size: 1rem;
  font-weight: 500;
}

.form-group input, .form-group textarea {
  padding: 0.8rem 1rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: rgba(243, 156, 18, 0.6);
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.3);
}

.form-group textarea {
  min-height: 100px;
  resize: vertical;
}

.submit-button {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: #fff;
  padding: 1rem;
  border-radius: 5px;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-button:hover {
  background: linear-gradient(135deg, #e67e22, #f39c12);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(243, 156, 18, 0.5);
}

.signature-output {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  border-left: 4px solid #f39c12;
}

.signature-output h4 {
  margin-top: 0;
  color: #f39c12;
  margin-bottom: 1rem;
}

.output-code {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 5px;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
  color: #fff;
  font-size: 0.9rem;
}

/* Stakes table section */
.stakes-section {
  text-align: center;
  margin-bottom: 4rem;
}

.stakes-table-wrapper {
  overflow-x: auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  background-color: rgba(57, 52, 36, 0.5);
}

.stakes-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.stakes-table th {
  background-color: rgba(57, 52, 36, 1);
  color: #f39c12;
  padding: 1.2rem 1rem;
  text-align: center;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(243, 156, 18, 0.3);
}

.stakes-table td {
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.stakes-table tr:last-child td {
  border-bottom: none;
}

.stakes-table tr {
  transition: background-color 0.3s ease;
}

.stakes-table tr:hover:not(.empty-row) {
  background-color: rgba(243, 156, 18, 0.1);
}

.stakes-table tr.minted {
  background-color: rgba(76, 175, 80, 0.2);
}

.stakes-table tr.minted td {
  color: #a5d6a7;
}

.stakes-table tr.connected-address:not(.minted) {
  background-color: rgba(243, 156, 18, 0.2);
}

.empty-row td {
  color: rgba(255, 255, 255, 0.3);
}

.mint-button {
  background-color: #f39c12;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
}

.mint-button:hover {
  background-color: #e67e22;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Footer styles */
.footer {
  background: rgba(255, 165, 0, 0.9);
  padding: 2rem 0;
  text-align: center;
  margin-top: 4rem;
  border-radius: 10px 10px 0 0;
}

.footer-links {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.footer-links a {
  text-decoration: none;
  color: #fff;
  font-weight: bold;
  transition: transform 0.3s ease, color 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-links a:hover {
  transform: translateY(-3px);
  color: rgba(0, 0, 139, 0.8);
}

.icon {
  font-size: 1.2rem;
}

.copyright {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Mobile styles */
@media (max-width: 768px) {
  .navbar-menu-toggle {
    display: flex;
    z-index: 1001;
  }
  
  .navbar-links {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 100%;
    background-color: rgba(0, 0, 139, 0.95);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: all 0.5s ease;
    backdrop-filter: blur(10px);
  }
  
  .navbar-links.open {
    right: 0;
  }
  
  .navbar-links a {
    margin: 1.5rem 0;
    font-size: 1.2rem;
  }
  
  /* Animated hamburger menu */
  .bar:nth-child(1) {
    transform-origin: top left;
  }
  
  .bar:nth-child(3) {
    transform-origin: bottom left;
  }
  
  .bar.open:nth-child(1) {
    transform: rotate(45deg);
  }
  
  .bar.open:nth-child(2) {
    opacity: 0;
  }
  
  .bar.open:nth-child(3) {
    transform: rotate(-45deg);
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    max-width: 300px;
  }
  
  .popup-content {
    width: 95%;
    margin: 5% auto;
  }
  
  .hero-title {
    font-size: 2.2rem;
  }
  
  .stakes-table th, .stakes-table td {
    padding: 0.8rem 0.5rem;
    font-size: 0.9rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .popup-header h3 {
    font-size: 1.1rem;
  }
  
  .form-group label {
    font-size: 0.9rem;
  }
  
  .stakes-table th, .stakes-table td {
    font-size: 0.8rem;
    padding: 0.6rem 0.3rem;
  }
  
  .mint-button {
    padding: 0.4rem 0.7rem;
    font-size: 0.8rem;
  }
}
</style> 
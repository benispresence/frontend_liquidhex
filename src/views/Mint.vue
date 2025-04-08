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

    <!-- Address Search -->
    <section class="address-search-section" v-if="account">
      <div class="search-container">
        <input 
          type="text" 
          v-model="addressSearch" 
          placeholder="Search for an address (0x...)" 
          class="address-search-input"
        />
        <button 
          @click="searchAddress" 
          class="search-button"
          :disabled="!isValidAddress(addressSearch) && addressSearch !== ''"
        >
          <span class="icon">🔍</span> View
        </button>
        <button 
          v-if="viewedAddress && viewedAddress !== account" 
          @click="backToWallet" 
          class="back-button"
        >
          <span class="icon">↩️</span> Back to Wallet
        </button>
      </div>
      <div v-if="viewedAddress && viewedAddress !== account" class="viewing-notice">
        <span class="viewing-label">Currently viewing:</span>
        <span class="viewing-address">{{ formatAddress(viewedAddress) }}</span>
        <span class="read-only-badge">READ ONLY</span>
      </div>
    </section>

    <!-- Metrics Overview Section -->
    <section class="metrics-overview" v-if="account">
      <div class="metrics-container">
        <div class="address-display">
          <span class="address-label">Connected:</span>
          <span class="address-value">{{ formatAddress(account) }}</span>
        </div>
        <div class="metrics-grid">
          <div class="metric-item">
            <span class="metric-title">Currently Mintable:</span>
            <span class="metric-value">{{ formatAmountDisplay(currentlyMintableAmount) }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-title">Stakes Minted:</span>
            <span class="metric-value">{{ mintedStakeCount }}/{{ stakeCount }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-title">Minted Amount:</span>
            <span class="metric-value">{{ formatAmountDisplay(mintedAmount) }}</span>
          </div>
          <div class="metric-item">
            <span class="metric-title">Locked Mintable:</span>
            <span class="metric-value">{{ formatAmountDisplay(lockedMintableAmount) }}</span>
          </div>
        </div>
      </div>
    </section>

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
      
      <!-- Filter options -->
      <div class="filter-options">
        <select v-model="statusFilter" class="status-filter">
          <option value="all">All Stakes</option>
          <option value="mintable">Mintable</option>
          <option value="locked">Locked</option>
          <option value="minted">Minted</option>
          <option value="expired">Expired</option>
        </select>
      </div>
      
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
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr 
                v-for="(stake, index) in filteredStakes" 
                :key="index" 
                :class="{ 
                  'minted': stake.minted, 
                  'connected-address': stake.address === account,
                  'expired-stake': isExpired(stake),
                  'locked-stake': isLocked(stake)
                }"
              >
                <td>{{ stake.id }}</td>
                <td>{{ formatAddress(stake.address) }}</td>
                <td>{{ formatAmount(stake.amount) }}</td>
                <td>{{ formatDate(stake.startDate) }}</td>
                <td>{{ formatDate(stake.endDate) }}</td>
                <td class="stake-status">
                  <span v-if="stake.minted" class="status-icon minted-icon" title="Minted">✓</span>
                  <span v-else-if="isExpired(stake)" class="status-icon expired-icon" title="Expired">✗</span>
                  <span v-else-if="isLocked(stake)" class="status-icon locked-icon" title="Locked">🔒</span>
                  <span v-else class="status-icon mintable-icon" title="Mintable">✓</span>
                </td>
                <td>
                  <button 
                    v-if="!stake.minted && stake.address === account && !isExpired(stake) && !isLocked(stake) && isViewingOwnWallet" 
                    class="mint-button" 
                    @click="initiateMint(stake)"
                  >
                    Mint
                  </button>
                  <button 
                    v-else-if="!stake.minted && stake.address === account && isLocked(stake) && isViewingOwnWallet" 
                    class="locked-button" 
                    disabled
                    title="Locked until the start date"
                  >
                    Locked
                  </button>
                  <button 
                    v-else-if="!stake.minted && stake.address === account && isExpired(stake) && isViewingOwnWallet" 
                    class="expired-button" 
                    disabled
                    title="Stake has expired"
                  >
                    Expired
                  </button>
                  <span v-else>{{ stake.minted ? 'Minted' : '-' }}</span>
                </td>
              </tr>
              <tr v-if="filteredStakes.length === 0" v-for="n in 10" :key="`empty-${n}`" class="empty-row">
                <td>-</td>
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

    <!-- Stakes Visualization Section -->
    <section class="stakes-chart-section" v-if="stakes.length > 0">
      <h2 class="section-title">Stakes Visualization</h2>
      
      <div class="chart-controls">
        <div class="chart-view-toggle">
          <button 
            @click="chartView = 'daily'" 
            :class="{ active: chartView === 'daily' }"
          >
            Daily
          </button>
          <button 
            @click="chartView = 'monthly'" 
            :class="{ active: chartView === 'monthly' }"
          >
            Monthly
          </button>
          <button 
            @click="chartView = 'yearly'" 
            :class="{ active: chartView === 'yearly' }"
          >
            Yearly
          </button>
        </div>
      </div>
      
      <div class="chart-container" ref="chartContainer">
        <!-- Bar chart will be rendered here by D3.js -->
        <div class="chart-empty" v-if="stakes.length === 0">No stakes data available for visualization</div>
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
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { ethers } from 'ethers'
import Papa from 'papaparse'
import { liquidHexABI, liquidHexAddress } from '../contracts/liquidHexABI.js'

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
const viewedAddress = ref(null) // Track the address being viewed
const addressSearch = ref('') // For the search input
const stakes = ref([])
const activePopup = ref(null)
const popupContainer = ref(null)
const signatureOutput = ref(null)

// Add summary metrics
const totalAmount = ref(0)
const mintedAmount = ref(0)
const currentlyMintableAmount = ref(0)
const lockedMintableAmount = ref(0)
const stakeCount = ref(0)
const mintedStakeCount = ref(0)

// Form data
const transferData = ref({ to: '', amount: '' })
const mintData = ref({ id: '', amount: '', startDate: '', endDate: '', proof: '' })
const signatureData = ref({ burnerAddress: '', id: '', amount: '', startDate: '', endDate: '', proof: '' })

// Add filtering options
const hideExpired = ref(false)
const hideMinted = ref(false)
const statusFilter = ref('all') // 'all', 'mintable', 'locked', 'minted', 'expired'
const chartView = ref('monthly') // 'daily', 'monthly', 'yearly'
const chartContainer = ref(null)

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
const tokenAddress = liquidHexAddress
const tokenABI = liquidHexABI

// Web3 providers and contract instances
let provider
let signer
let tokenContract

// Supported chain IDs (PulseChain mainnet and testnet)
const SUPPORTED_CHAINS = [369, 943] // 369 is PulseChain mainnet, 943 is testnet

// Check if an address is valid
function isValidAddress(address) {
  return ethers.isAddress(address)
}

// Search for an address
function searchAddress() {
  if (addressSearch.value === '') {
    // If empty, go back to own wallet
    viewedAddress.value = account.value
    fetchAndDisplayStakes(account.value)
    return
  }
  
  if (isValidAddress(addressSearch.value)) {
    viewedAddress.value = addressSearch.value
    fetchAndDisplayStakes(addressSearch.value)
  } else {
    alert('Please enter a valid Ethereum address')
  }
}

// Go back to wallet
function backToWallet() {
  viewedAddress.value = account.value
  addressSearch.value = ''
  fetchAndDisplayStakes(account.value)
}

// Metamask connection
async function connectToMetaMask() {
  try {
    console.log("Attempting to connect to MetaMask...")
    
    if (typeof window.ethereum !== 'undefined') {
      console.log("MetaMask detected")
      
      try {
        // Request account access
        console.log("Requesting account access...")
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        
        // Initialize provider
        console.log("Initializing ethers provider...")
        provider = new ethers.BrowserProvider(window.ethereum)
        
        // Get network information
        const network = await provider.getNetwork()
        console.log("Connected to network:", network.name, "- Chain ID:", network.chainId)
        
        // Check if on the correct network
        if (!SUPPORTED_CHAINS.includes(Number(network.chainId))) {
          console.error(`Wrong network! Connected to chain ID ${network.chainId}, but this app requires PulseChain (Chain ID 369 or 943)`)
          alert(`Please switch to PulseChain in your MetaMask wallet. Current chain: ${network.name} (${network.chainId}). Required: PulseChain (369 or 943).`)
          return
        }
        
        // Get signer (wallet)
        console.log("Getting signer...")
        signer = await provider.getSigner()
        
        // Get account address
        console.log("Getting account address...")
        account.value = await signer.getAddress()
        viewedAddress.value = account.value // Initialize viewed address to own wallet
        console.log("Connected account:", account.value)
        
        // Initialize contract
        console.log("Initializing contract instance...")
        tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer)
        console.log("Contract instance created:", tokenAddress)
        
        // Verify contract connectivity
        try {
          const hasAnyId = await tokenContract.hasClaimedId(1)
          console.log("Successfully connected to contract, test query result:", hasAnyId)
        } catch (contractError) {
          console.error("Failed to query contract:", contractError)
          alert("Failed to connect to the LiquidHEX contract. Make sure you're on PulseChain network.")
          return
        }
      
        // Once connected, fetch stakes data
        console.log("Fetching stakes data...")
        await fetchAndDisplayStakes(account.value)
      } catch (ethersError) {
        console.error("Error during Ethers setup:", ethersError)
        alert(`Error setting up Ethers: ${ethersError.message || ethersError}`)
      }
    } else {
      console.error("MetaMask is not installed")
      alert("MetaMask is not installed. Please install MetaMask to use this application.")
    }
  } catch (error) {
    console.error("Error connecting to MetaMask:", error)
    alert(`Error connecting to MetaMask: ${error.message || error}`)
  }
}

// Add fetchCSVWithRetry function from the original code
async function fetchCSVWithRetry(url, maxRetries = 3, retryDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${url}: ${response.status}`)
      }
      const csvText = await response.text();
      return Papa.parse(csvText, { header: true }).data;
    } catch (error) {
      console.error(`Attempt ${i + 1} to fetch CSV failed:`, error);
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, retryDelay));
    }
  }
  throw new Error(`Failed to fetch CSV after ${maxRetries} attempts`);
}

// Updated fetchAndDisplayStakes to match the original implementation
async function fetchAndDisplayStakes(address) {
  try {
    // Clear any existing stakes
    stakes.value = []
    
    if (!account.value) {
      console.error("No address provided to fetch stakes")
      return
    }
    
    // Ensure account is lowercased for comparison
    const connectedAccount = String(address).trim().toLowerCase();
    console.log("Fetching and displaying stakes for account:", connectedAccount);

    // Fetch and parse the main CSV file with retries
    console.log("Fetching merkle_tree_base.csv...")
    const csvData = await fetchCSVWithRetry('/merkle_tree_base.csv', 3);
    console.log("CSV data loaded, found", csvData.length, "rows")
    
    // Filter stakes for the connected address
    const userStakes = csvData.filter(row => {
      const eligibleAddress = String(row['eligible_address'] || '').trim().toLowerCase();
      return eligibleAddress === connectedAccount;
    });
    
    console.log("Found", userStakes.length, "stakes for the connected address")
    
    // Sort stakes by start date (earliest first)
    userStakes.sort((a, b) => parseInt(a['minting_start_date']) - parseInt(b['minting_start_date']));
    
    let totalAmountSum = 0;
    let mintedAmountSum = 0;
    let currentlyMintableAmountSum = 0;
    let lockedMintableAmountSum = 0;
    let stakeCountSum = 0;
    let mintedStakeCountSum = 0;
    
    // Populate the stakes with data
    for (const stake of userStakes) {
      try {
        const stakeId = stake['id'];
        console.log("Processing stake ID:", stakeId);
        
        // Make sure stake has all required fields
        if (!stakeId || !stake['amount'] || !stake['minting_start_date'] || !stake['minting_end_date']) {
          console.error("Stake missing required fields:", stake);
          continue;
        }
        
        const amount = parseInt(stake['amount']);
        totalAmountSum += amount;
        stakeCountSum++;
        
        const isClaimed = await tokenContract.hasClaimedId(stakeId);
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        const startDate = parseInt(stake['minting_start_date']);
        const endDate = parseInt(stake['minting_end_date']);
        
        // Add stake to the display list
        stakes.value.push({
          id: stakeId,
          address: stake['eligible_address'],
          amount: BigInt(amount),
          startDate: startDate,
          endDate: endDate,
          minted: isClaimed
        });
        
        if (isClaimed) {
          mintedAmountSum += amount;
          mintedStakeCountSum++;
        } else {
          if (currentTime > endDate) {
            // Expired stakes are not counted in any mintable amount
          } else if (currentTime < startDate) {
            // Locked stakes
            lockedMintableAmountSum += amount;
          } else {
            // Currently mintable stakes
            currentlyMintableAmountSum += amount;
      }
    }
  } catch (error) {
        console.error(`Error processing stake:`, error, stake);
      }
    }
    
    // Update the reactive metrics
    totalAmount.value = totalAmountSum;
    mintedAmount.value = mintedAmountSum;
    currentlyMintableAmount.value = currentlyMintableAmountSum;
    lockedMintableAmount.value = lockedMintableAmountSum;
    stakeCount.value = stakeCountSum;
    mintedStakeCount.value = mintedStakeCountSum;
    
    console.log("Total stakes loaded:", stakes.value.length);
    console.log("Stats:", {
      totalAmount: totalAmountSum / 1e8,
      mintedAmount: mintedAmountSum / 1e8, 
      currentlyMintableAmount: currentlyMintableAmountSum / 1e8,
      lockedMintableAmount: lockedMintableAmountSum / 1e8,
      stakeCount: stakeCountSum,
      mintedStakeCount: mintedStakeCountSum
    });
    
  } catch (error) {
    console.error("Error fetching stakes:", error);
    alert(`Error fetching stakes: ${error.message}`);
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
    
    console.log("Initiating mint for stake:", stake)
    
    // Extract stake information
    const stakeId = stake.id
    const amount = stake.amount
    const startDate = stake.startDate
    const endDate = stake.endDate

    console.log("Looking for merkle proof for stake ID:", stakeId)
    
    // List of Merkle Proof CSV files
    const proofFiles = [
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_3_until_end_stake_id_174231.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_174242_until_end_stake_id_272449.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_272460_until_end_stake_id_338663.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_338667_until_end_stake_id_385896.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_385899_until_end_stake_id_433470.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_433472_until_end_stake_id_474864.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_474866_until_end_stake_id_513074.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_513075_until_end_stake_id_550468.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_550469_until_end_stake_id_584350.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_584351_until_end_stake_id_614067.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_614069_until_end_stake_id_650060.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_650062_until_end_stake_id_684853.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_684854_until_end_stake_id_722051.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_722054_until_end_stake_id_762413.csv',
      '/merkle_tree_proofs/merkle_tree_proofs_start_stake_id_762417_until_end_stake_id_55555516.csv'
    ]

    let proofRow = null

    // Search through the Merkle Proof CSV files
    for (const file of proofFiles) {
      try {
        const [startStakeId, endStakeId] = file.match(/_stake_id_(\d+)_until_end_stake_id_(\d+)\.csv$/).slice(1, 3).map(Number)
        if (Number(stakeId) >= startStakeId && Number(stakeId) <= endStakeId) {
          console.log(`Stake ID ${stakeId} is in range ${startStakeId}-${endStakeId}, fetching file...`)
          const response = await fetch(file)
          if (!response.ok) {
            console.error(`Failed to fetch ${file}: ${response.status}`)
            continue
          }
          
          const csvText = await response.text()
          console.log(`Proof file loaded, size: ${csvText.length} bytes`)
          
          const proofCSVData = Papa.parse(csvText, { header: true }).data
          
          proofRow = proofCSVData.find(row => row['stake_id'] == stakeId)
          if (proofRow) {
            console.log("Found merkle proof for stake ID:", stakeId)
            break
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error)
      }
    }

    if (!proofRow || !proofRow['proof']) {
      alert("Merkle Proof not found in any CSV file.")
      return
    }

    const merkleProof = proofRow['proof'].split(',')
    console.log("Merkle proof loaded:", merkleProof.length, "items")

    const signature = '0x' // Empty signature since we're not using signature-based minting

    // Get current gas prices
    const gasPrice = await provider.getFeeData()
    console.log("Current gas price:", gasPrice)
    
    const priorityFee = Math.round(Number(gasPrice.maxFeePerGas) * 0.2)
    const gasLimit = 350000
    
    try {
      console.log("Preparing transaction with params:", {
        stakeId,
        amount: amount.toString(),
        startDate,
        endDate,
        proofItems: merkleProof.length
      })
    
    // Call the contract to mint tokens
    const tx = await tokenContract.claim(
        stakeId,
        amount,
        startDate,
        endDate,
        merkleProof,
        signature,
        {
          gasLimit: gasLimit,
          maxPriorityFeePerGas: priorityFee,
          maxFeePerGas: gasPrice.maxFeePerGas
        }
      )
      
      console.log("Transaction sent:", tx.hash)
      console.log("Waiting for transaction confirmation...")
    
    await tx.wait()
      console.log("Transaction confirmed!")
    
    // Mark the stake as minted after successful transaction
    const updatedStakes = [...stakes.value]
      const stakeIndex = updatedStakes.findIndex(s => s.id === stakeId)
    if (stakeIndex !== -1) {
      updatedStakes[stakeIndex].minted = true
    }
    stakes.value = updatedStakes
    
      alert(`Successfully minted LiquidHEX for stake ID ${stakeId}`)
    } catch (txError) {
      console.error("Error in transaction:", txError)
      alert(`Error minting: ${txError.message}`)
    }
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
      merkleProofArray,
      '0x' // Empty signature since we're not using signature-based minting
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
    // Convert BigInt to string first, then format
    const amountString = amount.toString()
    
    // Format with commas for thousands separator
    // Assuming amount is in smallest unit (like wei), divide by 10^8 to get normal units
    const formattedAmount = (Number(amountString) / 1e8).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    return formattedAmount
  } catch (error) {
    console.error("Error formatting amount:", error)
    return amount.toString()
  }
}

// Add a new function to format large numbers with K, M, B for chart display
function formatLargeNumber(num) {
  num = Number(num) / 1e8; // Convert from smallest unit
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  } else {
    return num.toFixed(1);
  }
}

function formatDate(timestamp) {
  if (!timestamp) return '-'
  const date = new Date(Number(timestamp) * 1000)
  return date.toLocaleDateString()
}

// Helper functions for stake status
function isExpired(stake) {
  const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds
  return currentTime > stake.endDate
}

function isLocked(stake) {
  const currentTime = Math.floor(Date.now() / 1000) // Current time in seconds
  return currentTime < stake.startDate
}

// Computed property for filtered stakes
const filteredStakes = computed(() => {
  let result = [...stakes.value]
  
  // Always sort by start date (earliest first)
  result.sort((a, b) => a.startDate - b.startDate)
  
  // Apply status filter
  switch(statusFilter.value) {
    case 'mintable':
      result = result.filter(stake => !stake.minted && !isExpired(stake) && !isLocked(stake))
      break
    case 'locked':
      result = result.filter(stake => !stake.minted && isLocked(stake))
      break
    case 'minted':
      result = result.filter(stake => stake.minted)
      break
    case 'expired':
      result = result.filter(stake => !stake.minted && isExpired(stake))
      break
    default:
      // 'all' - no filtering
  }
  
  return result
})

// Add a computed property to determine if viewing own wallet
const isViewingOwnWallet = computed(() => {
  return viewedAddress.value && account.value && 
    viewedAddress.value.toLowerCase() === account.value.toLowerCase()
})

// Watch for changes to filtered stakes or chart view to update chart
watch(
  [filteredStakes, chartView],
  () => {
    if (stakes.value.length > 0) {
      renderChart()
    }
  },
  { deep: true }
)

// Function to render the chart (using D3.js)
function renderChart() {
  // We'll need to include D3.js for this
  if (!window.d3) {
    const script = document.createElement('script')
    script.src = 'https://d3js.org/d3.v7.min.js'
    script.onload = () => {
      createChart()
    }
    document.head.appendChild(script)
  } else {
    createChart()
  }
}

// Function to create the chart with D3.js
function createChart() {
  if (!chartContainer.value || !window.d3) return

  // Clear previous chart if any
  const d3 = window.d3
  const container = d3.select(chartContainer.value)
  container.selectAll('*').remove()

  // Calculate dimensions - adjusted for better spacing
  const margin = { top: 40, right: 60, bottom: 100, left: 80 }
  const width = chartContainer.value.clientWidth - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  // Create SVG element
  const svg = container
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)

  // Process data based on the current view
  const stakesData = processStakesData()
  
  // Limit the number of bars to prevent overcrowding
  let displayData = stakesData
  if (chartView.value === 'daily' && stakesData.length > 20) {
    // Group by weeks or show recent data if too many days
    displayData = stakesData.slice(-20)
  }

  // Set up scales
  const x = d3.scaleBand()
    .domain(displayData.map(d => d.period))
    .range([0, width])
    .padding(0.2)

  const y = d3.scaleLinear()
    .domain([0, d3.max(displayData, d => d.totalAmount) * 1.1]) // Add 10% padding
    .range([height, 0])

  // Add X axis with improved styling and rotation
  const xAxis = svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    
  xAxis.selectAll('text')
    .attr('transform', 'translate(-10,10)rotate(-45)')
    .style('text-anchor', 'end')
    .style('fill', '#f39c12')
    .style('font-size', '11px')
    .style('font-weight', '500')
  
  xAxis.selectAll('line')
    .style('stroke', 'rgba(243, 156, 18, 0.3)')
  
  xAxis.selectAll('path')
    .style('stroke', 'rgba(243, 156, 18, 0.3)')

  // Add Y axis with improved styling and abbreviations
  const yAxis = svg.append('g')
    .call(d3.axisLeft(y)
      .ticks(6)
      .tickFormat(d => formatLargeNumber(d))
    )
    
  yAxis.selectAll('text')
    .style('fill', '#f39c12')
    .style('font-size', '12px')
    .style('font-weight', '500')
  
  yAxis.selectAll('line')
    .style('stroke', 'rgba(243, 156, 18, 0.3)')
  
  yAxis.selectAll('path')
    .style('stroke', 'rgba(243, 156, 18, 0.3)')

  // Add horizontal grid lines
  svg.append('g')
    .attr('class', 'grid-lines')
    .selectAll('line')
    .data(y.ticks(6))
    .enter()
    .append('line')
    .attr('x1', 0)
    .attr('x2', width)
    .attr('y1', d => y(d))
    .attr('y2', d => y(d))
    .style('stroke', 'rgba(255, 255, 255, 0.1)')
    .style('stroke-dasharray', '3,3')

  // Add Y axis label with better positioning
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left + 20)
    .attr('x', -height / 2)
    .attr('text-anchor', 'middle')
    .text('LHEX Amount')
    .style('fill', '#f39c12')
    .style('font-size', '14px')
    .style('font-weight', 'bold')

  // Add X axis label with better positioning
  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + margin.bottom - 20)
    .attr('text-anchor', 'middle')
    .text(getChartTitle())
    .style('fill', '#f39c12')
    .style('font-size', '14px')
    .style('font-weight', 'bold')

  // Create tooltip with improved styling
  const tooltip = d3.select(chartContainer.value)
    .append('div')
    .attr('class', 'chart-tooltip')
    .style('opacity', 0)
    .style('pointer-events', 'none')
    .style('position', 'absolute')
    .style('background-color', 'rgba(0, 0, 139, 0.95)')
    .style('color', 'white')
    .style('padding', '10px 15px')
    .style('border-radius', '5px')
    .style('font-size', '12px')
    .style('box-shadow', '0 4px 10px rgba(0, 0, 0, 0.3)')
    .style('z-index', '1000')
    .style('max-width', '250px')
    .style('pointer-events', 'none')

  // Add animated bars with improved styling
  svg.selectAll('rect')
    .data(displayData)
    .enter()
    .append('rect')
    .attr('x', d => x(d.period))
    .attr('width', x.bandwidth())
    .attr('y', height) // Start from bottom for animation
    .attr('height', 0) // Start with height 0 for animation
    .attr('rx', 2) // Rounded corners
    .attr('ry', 2) // Rounded corners
    .attr('fill', d => {
      // Gradient fill based on stake status with improved colors
      if (d.mintedAmount > 0 && d.totalAmount === d.mintedAmount) {
        return '#4CAF50' // All minted - green
      } else if (d.lockedAmount > 0 && d.totalAmount === d.lockedAmount) {
        return '#FF9800' // All locked - orange
      } else if (d.expiredAmount > 0 && d.totalAmount === d.expiredAmount) {
        return '#F44336' // All expired - red
      } else {
        // Create gradient for mixed status
        const gradient = svg.append('linearGradient')
          .attr('id', `gradient-${d.period.replace(/\s+/g, '-')}`)
          .attr('gradientUnits', 'userSpaceOnUse')
          .attr('x1', '0%')
          .attr('y1', '0%')
          .attr('x2', '0%')
          .attr('y2', '100%');
        
        gradient.append('stop')
          .attr('offset', '0%')
          .attr('stop-color', '#f39c12')
          .attr('stop-opacity', 0.9);
          
        gradient.append('stop')
          .attr('offset', '100%')
          .attr('stop-color', '#e67e22')
          .attr('stop-opacity', 0.7);
          
        return `url(#gradient-${d.period.replace(/\s+/g, '-')})`;
      }
    })
    .style('stroke', 'rgba(0, 0, 0, 0.1)')
    .style('stroke-width', 1)
    .transition() // Add animation
    .duration(800)
    .delay((d, i) => i * 50)
    .attr('y', d => y(d.totalAmount))
    .attr('height', d => height - y(d.totalAmount))
    .ease(d3.easeElastic.amplitude(0.5).period(0.7))
    
  // Add hover effects and tooltip
  svg.selectAll('rect')
    .data(displayData)
    .on('mouseover', function(event, d) {
      // Highlight bar on hover
      d3.select(this)
        .transition()
        .duration(200)
        .style('filter', 'brightness(1.2)')
        .style('cursor', 'pointer')
      
      // Show tooltip
      tooltip.transition()
        .duration(200)
        .style('opacity', 1)
      
      const mintedPercent = (d.mintedAmount / d.totalAmount * 100).toFixed(1)
      const lockedPercent = (d.lockedAmount / d.totalAmount * 100).toFixed(1)
      const expiredPercent = (d.expiredAmount / d.totalAmount * 100).toFixed(1)
      const mintablePercent = (d.mintableAmount / d.totalAmount * 100).toFixed(1)
      
      tooltip.html(
        `<strong style="font-size: 14px; color: #f39c12;">${d.period}</strong><br><br>` +
        `<div style="display: flex; justify-content: space-between;">
           <span>Total:</span> 
           <span><b>${formatLargeNumber(d.totalAmount)}</b></span>
         </div>` +
        `<div style="display: flex; justify-content: space-between; color: ${d.mintedAmount ? '#4CAF50' : '#ccc'}">
           <span>Minted:</span> 
           <span><b>${formatLargeNumber(d.mintedAmount)}</b> (${mintedPercent}%)</span>
         </div>` +
        `<div style="display: flex; justify-content: space-between; color: ${d.lockedAmount ? '#FF9800' : '#ccc'}">
           <span>Locked:</span> 
           <span><b>${formatLargeNumber(d.lockedAmount)}</b> (${lockedPercent}%)</span>
         </div>` +
        `<div style="display: flex; justify-content: space-between; color: ${d.expiredAmount ? '#F44336' : '#ccc'}">
           <span>Expired:</span> 
           <span><b>${formatLargeNumber(d.expiredAmount)}</b> (${expiredPercent}%)</span>
         </div>` +
        `<div style="display: flex; justify-content: space-between; color: ${d.mintableAmount ? '#2196F3' : '#ccc'}">
           <span>Mintable:</span> 
           <span><b>${formatLargeNumber(d.mintableAmount)}</b> (${mintablePercent}%)</span>
         </div>`
      )
      .style('left', `${event.pageX - chartContainer.value.getBoundingClientRect().left + 10}px`)
      .style('top', `${event.pageY - chartContainer.value.getBoundingClientRect().top - 120}px`)
    })
    .on('mouseout', function() {
      // Remove highlight on mouseout
      d3.select(this)
        .transition()
        .duration(200)
        .style('filter', 'brightness(1)')
      
      // Hide tooltip
      tooltip.transition()
        .duration(500)
        .style('opacity', 0)
    })
    
  // Add value labels on top of bars for significant values
  svg.selectAll('.bar-label')
    .data(displayData)
    .enter()
    .append('text')
    .filter(d => (d.totalAmount / d3.max(displayData, d => d.totalAmount)) > 0.3) // Only show for significant bars
    .attr('class', 'bar-label')
    .attr('x', d => x(d.period) + x.bandwidth() / 2)
    .attr('y', d => y(d.totalAmount) - 5)
    .attr('text-anchor', 'middle')
    .text(d => formatLargeNumber(d.totalAmount))
    .style('fill', '#ffffff')
    .style('font-size', '10px')
    .style('font-weight', 'bold')
    .style('text-shadow', '0 1px 2px rgba(0,0,0,0.5)')
    .style('opacity', 0)
    .transition()
    .delay((d, i) => i * 50 + 800)
    .duration(500)
    .style('opacity', 1)
    
  // Add a legend
  const legendData = [
    { color: '#4CAF50', label: 'Minted' },
    { color: '#2196F3', label: 'Mintable' },
    { color: '#FF9800', label: 'Locked' },
    { color: '#F44336', label: 'Expired' },
    { color: '#f39c12', label: 'Mixed' }
  ]
  
  const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width - 120}, -30)`)
    
  legend.selectAll('rect')
    .data(legendData)
    .enter()
    .append('rect')
    .attr('x', 0)
    .attr('y', (d, i) => i * 20)
    .attr('width', 12)
    .attr('height', 12)
    .attr('fill', d => d.color)
    .attr('rx', 2)
    .attr('ry', 2)
    
  legend.selectAll('text')
    .data(legendData)
    .enter()
    .append('text')
    .attr('x', 20)
    .attr('y', (d, i) => i * 20 + 10)
    .text(d => d.label)
    .style('fill', '#f39c12')
    .style('font-size', '11px')
    .style('alignment-baseline', 'middle')
}

// Helper function to get chart title based on view
function getChartTitle() {
  switch(chartView.value) {
    case 'daily': return 'Stakes by Day'
    case 'monthly': return 'Stakes by Month'
    case 'yearly': return 'Stakes by Year'
    default: return 'Stakes Distribution'
  }
}

// Process stakes data for chart visualization
function processStakesData() {
  const currentTime = Math.floor(Date.now() / 1000)
  const data = []
  const periods = new Map()

  // Group stakes by period and calculate amounts
  for (const stake of stakes.value) {
    // Skip stakes that should be filtered out
    if (hideExpired.value && isExpired(stake)) continue
    if (hideMinted.value && stake.minted) continue

    // Determine period based on start date
    const date = new Date(stake.startDate * 1000)
    let period
    
    switch(chartView.value) {
      case 'daily':
        period = new Date(date.getFullYear(), date.getMonth(), date.getDate())
          .toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
        break
      case 'monthly':
        period = new Date(date.getFullYear(), date.getMonth(), 1)
          .toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
        break
      case 'yearly':
        period = date.getFullYear().toString()
        break
      default:
        period = new Date(date.getFullYear(), date.getMonth(), 1)
          .toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    }

    // Initialize period if not exists
    if (!periods.has(period)) {
      periods.set(period, {
        period,
        totalAmount: 0,
        mintedAmount: 0,
        lockedAmount: 0,
        expiredAmount: 0,
        mintableAmount: 0,
        stakes: []
      })
    }

    // Get the period data
    const periodData = periods.get(period)
    const amount = Number(stake.amount)
    
    // Add stake to the period and update amounts
    periodData.stakes.push(stake)
    periodData.totalAmount += amount

    // Update amounts based on stake status
    if (stake.minted) {
      periodData.mintedAmount += amount
    } else if (currentTime < stake.startDate) {
      periodData.lockedAmount += amount
    } else if (currentTime > stake.endDate) {
      periodData.expiredAmount += amount
    } else {
      periodData.mintableAmount += amount
    }
  }

  // Convert Map to Array and sort by period
  for (const [_, periodData] of periods) {
    data.push(periodData)
  }

  // Sort data by period
  if (chartView.value === 'daily') {
    data.sort((a, b) => new Date(a.period) - new Date(b.period))
  } else if (chartView.value === 'monthly') {
    data.sort((a, b) => {
      const [aMonth, aYear] = a.period.split(' ')
      const [bMonth, bYear] = b.period.split(' ')
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return (Number(aYear) - Number(bYear)) || (months.indexOf(aMonth) - months.indexOf(bMonth))
    })
  } else {
    data.sort((a, b) => a.period.localeCompare(b.period))
  }

  return data
}

// Update onMounted to include chart initialization
onMounted(() => {
  initializeEmptyTable()
  
  // Set up event listeners for MetaMask account changes
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', async (accounts) => {
      console.log("MetaMask accounts changed:", accounts)
      
      if (accounts.length > 0) {
        // Clear previous state
        stakes.value = []
        
        // Connect with the new account
        await connectToMetaMask()
      } else {
        // User disconnected all accounts
        account.value = null
        stakes.value = []
        console.log("MetaMask disconnected")
      }
    })
    
    window.ethereum.on('chainChanged', () => {
      console.log("MetaMask chain changed, refreshing...")
      window.location.reload()
    })
    
    // Check if already connected
    if (window.ethereum.isConnected()) {
    connectToMetaMask()
  }
  }
  
  // Handle window resize for chart
  const handleResize = () => {
    if (stakes.value.length > 0) {
      renderChart()
    }
  }
  
  window.addEventListener('resize', handleResize)
  
  // Add to cleanup
  onBeforeUnmount(() => {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged')
      window.ethereum.removeAllListeners('chainChanged')
    }
    window.removeEventListener('resize', handleResize)
  })
})

// Add a function to format amounts for display with commas and abbreviations for large numbers
function formatAmountDisplay(amount) {
  if (amount === 0) return "0";
  
  const value = Number(amount) / 1e8;
  
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + 'B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + 'K';
  } else {
    return value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
}
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
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: linear-gradient(135deg, rgba(243, 156, 18, 1) 0%, rgba(255, 165, 0, 0.8) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 0 1rem;
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

.section-title::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 0;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  z-index: -1;
}

@media (max-width: 768px) {
  .section-title {
    font-size: 1.8rem;
    margin: 2rem 0 1.2rem;
  }
  
  .section-title::after {
    width: 60px;
    height: 3px;
  }
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

/* Filter options */
.filter-options {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.status-filter {
  background-color: rgba(57, 52, 36, 0.8);
  color: #fff;
  padding: 0.7rem 1.5rem;
  border-radius: 5px;
  border: 1px solid rgba(243, 156, 18, 0.5);
  cursor: pointer;
  font-size: 1rem;
  min-width: 200px;
  text-align: center;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23F39C12%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem top 50%;
  background-size: 0.65rem auto;
  transition: all 0.3s ease;
}

.status-filter:hover {
  background-color: rgba(243, 156, 18, 0.4);
}

.status-filter:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.5);
}

.status-filter option {
  background-color: rgba(0, 0, 139, 0.9);
  color: white;
}

@media (max-width: 768px) {
  .metrics-grid {
    flex-direction: column;
  }
  
  .metric-item {
    width: 100%;
    padding: 0.4rem 0;
  }
  
  .metric-title {
    font-size: 0.8rem;
  }
  
  .metric-value {
    font-size: 1.1rem;
  }
  
  .status-filter {
    width: 90%;
    max-width: 300px;
  }
}

/* Stake status styles */
.stake-status {
  text-align: center;
}

.status-icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  font-weight: bold;
}

.minted-icon {
  background-color: rgba(76, 175, 80, 0.3);
  color: #4CAF50;
}

.expired-icon {
  background-color: rgba(244, 67, 54, 0.3);
  color: #F44336;
}

.locked-icon {
  background-color: rgba(255, 152, 0, 0.3);
  color: #FF9800;
}

.mintable-icon {
  background-color: rgba(33, 150, 243, 0.3);
  color: #2196F3;
}

/* Stake row status styles */
.stakes-table tr.expired-stake {
  background-color: rgba(244, 67, 54, 0.1);
}

.stakes-table tr.locked-stake {
  background-color: rgba(255, 152, 0, 0.1);
}

/* Button styles */
.locked-button, .expired-button {
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: not-allowed;
  opacity: 0.7;
}

.locked-button {
  background-color: #FF9800;
  color: #fff;
}

.expired-button {
  background-color: #F44336;
  color: #fff;
}

/* Chart styles */
.stakes-chart-section {
  margin-top: 4rem;
  text-align: center;
}

.chart-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.chart-view-toggle {
  display: flex;
  background-color: rgba(57, 52, 36, 0.8);
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.chart-view-toggle button {
  background: none;
  border: none;
  padding: 0.7rem 1.5rem;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.chart-view-toggle button.active {
  background-color: #f39c12;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.chart-container {
  height: 460px;
  background-color: rgba(57, 52, 36, 0.5);
  border-radius: 10px;
  padding: 20px 10px 30px 10px;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: visible;
}

.chart-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.5);
  font-size: 1.2rem;
}

.chart-tooltip {
  position: absolute;
  padding: 10px;
  background-color: rgba(0, 0, 139, 0.9);
  color: white;
  border-radius: 5px;
  pointer-events: none;
  font-size: 0.9rem;
  z-index: 10;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

/* Metrics Overview Section */
.metrics-overview {
  margin-bottom: 1.5rem;
}

.metrics-container {
  background: rgba(135, 140, 189, 0.7);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  padding: 1rem 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
}

.address-display {
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.address-label {
  font-weight: 600;
  color: rgba(0, 0, 139, 0.9);
  margin-right: 0.5rem;
}

.address-value {
  font-weight: bold;
  color: #fff;
  background: rgba(0, 0, 139, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.metrics-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.metric-item {
  flex: 1;
  min-width: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0.5rem;
}

.metric-title {
  font-size: 0.85rem;
  color: rgba(0, 0, 139, 0.9);
  margin-bottom: 0.25rem;
  font-weight: 600;
}

.metric-value {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Address search styles */
.address-search-section {
  margin-bottom: 1.5rem;
}

.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.address-search-input {
  padding: 0.6rem 1rem;
  border-radius: 5px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: rgba(255, 255, 255, 0.05);
  color: #fff;
  width: 100%;
  max-width: 400px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.address-search-input:focus {
  outline: none;
  border-color: rgba(243, 156, 18, 0.6);
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.3);
}

.search-button, .back-button {
  padding: 0.6rem 1.2rem;
  border-radius: 5px;
  border: none;
  background-color: rgba(57, 52, 36, 0.8);
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s ease;
}

.search-button {
  background-color: rgba(243, 156, 18, 0.7);
}

.search-button:hover:not(:disabled) {
  background-color: rgba(243, 156, 18, 0.9);
  transform: translateY(-2px);
}

.back-button {
  background-color: rgba(57, 52, 36, 0.8);
}

.back-button:hover {
  background-color: rgba(57, 52, 36, 1);
  transform: translateY(-2px);
}

.search-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.viewing-notice {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  background-color: rgba(33, 150, 243, 0.2);
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin: 0 auto;
  max-width: 500px;
  border: 1px solid rgba(33, 150, 243, 0.4);
}

.viewing-label {
  color: rgba(255, 255, 255, 0.8);
}

.viewing-address {
  font-weight: bold;
  color: #fff;
}

.read-only-badge {
  background-color: rgba(33, 150, 243, 0.7);
  color: #fff;
  font-weight: bold;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .search-container {
    flex-direction: column;
    width: 100%;
  }
  
  .address-search-input {
    max-width: 90%;
  }
  
  .search-button, .back-button {
    width: 90%;
    justify-content: center;
  }
}
</style> 
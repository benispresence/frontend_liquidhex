<template>
  <div class="mint-container">
    <Navbar :account="account" @connect="connectToMetaMask" />
    
    <!-- Add Notification component -->
    <Notification
      v-if="showNotification"
      :type="notificationType"
      :title="notificationTitle"
      :message="notificationMessage"
      @close="showNotification = false"
    />

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
          <div class="metric-item">
            <span class="metric-title">LHEX Balance:</span>
            <span class="metric-value">{{ formatAmountDisplay(walletBalance) }}</span>
        </div>
      </div>
      </div>
    </section>

    <!-- Action buttons without title - compact version -->
    <div class="compact-actions" v-if="account">
      <div class="action-buttons">
        <button class="action-button" @click="showPopup('transfer')">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </span>
          Transfer
        </button>
        <button class="action-button" @click="showPopup('mint')">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
            </svg>
          </span>
          Mint Manually
        </button>
        <button class="action-button" @click="showPopup('signature')">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"></path>
              <path d="M14 3v5h5M18 21v-6M15 18h6"></path>
            </svg>
          </span>
          Create Signature
        </button>
      </div>
    </div>

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
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </span> 
          View
        </button>
        <button 
          v-if="viewedAddress && viewedAddress !== account" 
          @click="backToWallet" 
          class="back-button"
        >
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
          </span>
          Back to Wallet
        </button>
      </div>
      <div v-if="viewedAddress && viewedAddress !== account" class="viewing-notice">
        <span class="viewing-label">Currently viewing:</span>
        <span class="viewing-address">{{ formatAddress(viewedAddress) }}</span>
        <span class="read-only-badge">READ ONLY</span>
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
            <div class="form-group">
              <label for="mintSignature">Signature (optional):</label>
              <input type="text" id="mintSignature" v-model="mintData.signature" placeholder="Optional signature">
            </div>
            <div class="form-actions">
              <button class="action-button" @click="handleAutoPopulate">Auto Populate</button>
            <button class="submit-button" @click="handleMint">Mint LHEX</button>
            </div>
          </div>
          
          <!-- Create Signature Form -->
          <div v-if="activePopup === 'signature'" class="form-container">
            <div class="form-group">
              <label for="sigRecipientAddress">Recipient Address:</label>
              <input type="text" id="sigRecipientAddress" v-model="signatureData.recipientAddress" placeholder="0x...">
            </div>
            <div class="form-group">
              <label for="sigId">Stake ID:</label>
              <input type="text" id="sigId" v-model="signatureData.id" placeholder="Stake ID">
            </div>
            <div class="form-group">
              <label for="sigAmount">Amount:</label>
              <input type="text" id="sigAmount" v-model="signatureData.amount" placeholder="Amount in LHEX">
            </div>
            <button class="submit-button" @click="handleCreateSignature">Generate Signature</button>
            <div v-if="signatureOutput" class="signature-output">
              <h4>Generated Signature:</h4>
              <div class="output-code">{{ signatureOutput }}</div>
              <button class="copy-button" @click="copySignature">
                <span class="icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                </span>
                Copy to Clipboard
              </button>
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
                  <span v-if="stake.minted" class="status-icon minted-icon" title="Minted">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                  </span>
                  <span v-else-if="isExpired(stake)" class="status-icon expired-icon" title="Expired">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </span>
                  <span v-else-if="isLocked(stake)" class="status-icon locked-icon" title="Locked">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </span>
                  <span v-else class="status-icon mintable-icon" title="Mintable">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 6L9 17l-5-5"></path>
                    </svg>
                  </span>
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
        
        <!-- Date filter controls -->
        <div class="date-filter" v-if="chartView === 'daily' || chartView === 'monthly'">
          <div class="date-filter-inputs">
            <div class="date-filter-field">
              <label for="startDate">From:</label>
              <input 
                type="date" 
                id="startDate" 
                v-model="chartStartDate"
                @change="applyDateFilter" 
              />
            </div>
            <div class="date-filter-field">
              <label for="endDate">To:</label>
              <input 
                type="date" 
                id="endDate" 
                v-model="chartEndDate"
                @change="applyDateFilter"
              />
            </div>
          </div>
          <button class="reset-filter" @click="resetDateFilter">Reset</button>
          
          <!-- Info icon that appears when the 20-bar limit is hit -->
          <div class="info-icon-container" v-if="isLimitingBars">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div class="info-tooltip">
                Chart is limited to displaying 20 bars at a time to ensure readability.
                Use the date filter to view different time periods.
              </div>
            </div>
          </div>
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
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
          </span>
          Group Chat
        </a>
        <a href="https://github.com/benispresence/liquidhex" target="_blank">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-6l-2 3h-4l-2-3H2"></path>
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
            </svg>
          </span>
          Smart Contract Source
        </a>
        <a href="https://github.com/benispresence/frontend_liquidhex" target="_blank">
          <span class="icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </span>
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
import Navbar from '../components/Navbar.vue';
import Notification from '../components/Notification.vue';

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
const walletBalance = ref(0) // Add wallet balance

// Form data
const transferData = ref({ to: '', amount: '' })
const mintData = ref({ id: '', amount: '', startDate: '', endDate: '', proof: '', signature: '' })
const signatureData = ref({ burnerAddress: '', id: '', amount: '', startDate: '', endDate: '', proof: '', recipientAddress: '' })

// Add filtering options
const hideExpired = ref(false)
const hideMinted = ref(false)
const statusFilter = ref('all') // 'all', 'mintable', 'locked', 'minted', 'expired'
const chartView = ref('monthly') // 'daily', 'monthly', 'yearly'
const chartContainer = ref(null)

// Date filter for chart
const chartStartDate = ref('')
const chartEndDate = ref('')
const isDateFilterActive = ref(false)
const isLimitingBars = ref(false)

// Add notification state variables
const showNotification = ref(false);
const notificationType = ref('info');
const notificationTitle = ref('');
const notificationMessage = ref('');
const isMinting = ref(false);

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

// Function to fetch wallet balance
async function fetchWalletBalance() {
  try {
    if (!account.value || !tokenContract) return;
    
    console.log("Fetching wallet balance for:", account.value);
    const balance = await tokenContract.balanceOf(account.value);
    console.log("Raw balance:", balance.toString());
    walletBalance.value = Number(balance);
    console.log("Wallet balance set to:", walletBalance.value);
  } catch (error) {
    console.error("Error fetching wallet balance:", error);
  }
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
      
        // Fetch wallet balance
        await fetchWalletBalance()
      
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
      showNotificationMessage('error', 'Wallet Not Connected', 'Please connect your wallet first');
      return;
    }
    
    console.log("Initiating mint for stake:", stake);
    
    // Extract stake information
    const stakeId = stake.id;
    const amount = stake.amount;
    const startDate = stake.startDate;
    const endDate = stake.endDate;

    console.log("Looking for merkle proof for stake ID:", stakeId);
    
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
    ];

    let proofRow = null;

    // Search through the Merkle Proof CSV files
    for (const file of proofFiles) {
      try {
        const [startStakeId, endStakeId] = file.match(/_stake_id_(\d+)_until_end_stake_id_(\d+)\.csv$/).slice(1, 3).map(Number);
        if (Number(stakeId) >= startStakeId && Number(stakeId) <= endStakeId) {
          console.log(`Stake ID ${stakeId} is in range ${startStakeId}-${endStakeId}, fetching file...`);
          const response = await fetch(file);
          if (!response.ok) {
            console.error(`Failed to fetch ${file}: ${response.status}`);
            continue;
          }
          
          const csvText = await response.text();
          console.log(`Proof file loaded, size: ${csvText.length} bytes`);
          
          const proofCSVData = Papa.parse(csvText, { header: true }).data;
          
          proofRow = proofCSVData.find(row => row['stake_id'] == stakeId);
          if (proofRow) {
            console.log("Found merkle proof for stake ID:", stakeId);
            break;
          }
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }

    if (!proofRow || !proofRow['proof']) {
      showNotificationMessage('error', 'Proof Not Found', 'Merkle Proof not found in any CSV file.');
      return;
    }

    const merkleProof = proofRow['proof'].split(',');
    console.log("Merkle proof loaded:", merkleProof.length, "items");

    const signature = '0x'; // Empty signature since we're not using signature-based minting

    // Get current gas prices
    const gasPrice = await provider.getFeeData();
    console.log("Current gas price:", gasPrice);
    
    const priorityFee = Math.round(Number(gasPrice.maxFeePerGas) * 0.2);
    const gasLimit = 350000;
    
    try {
      console.log("Preparing transaction with params:", {
        stakeId,
        amount: amount.toString(),
        startDate,
        endDate,
        proofItems: merkleProof.length
      });
    
      // Set loading state
      isMinting.value = true;
      
      // Show transaction submitted notification
      showNotificationMessage(
        'info',
        'Transaction Submitted',
        'Your mint transaction has been submitted to the network'
      );

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
      );
      
      console.log("Transaction sent:", tx.hash);
      console.log("Waiting for transaction confirmation...");
    
      await tx.wait();
      console.log("Transaction confirmed!");
    
      // Mark the stake as minted after successful transaction
      const updatedStakes = [...stakes.value];
      const stakeIndex = updatedStakes.findIndex(s => s.id === stakeId);
      if (stakeIndex !== -1) {
        updatedStakes[stakeIndex].minted = true;
      }
      stakes.value = updatedStakes;
    
      // Update balance after minting
      await fetchWalletBalance();
    
      // Show success notification
      showNotificationMessage(
        'success',
        'Mint Successful!',
        `Congratulations! You have successfully minted ${formatAmountDisplay(amount)} LHEX`
      );

      // Reload the page after a short delay to update metrics
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (txError) {
      console.error("Error in transaction:", txError);
      showNotificationMessage(
        'error',
        'Transaction Failed',
        txError.message || 'Failed to mint LiquidHEX'
      );
    }
  } catch (error) {
    console.error("Error minting:", error);
    showNotificationMessage(
      'error',
      'Mint Failed',
      error.message || 'Failed to mint LiquidHEX'
    );
  } finally {
    isMinting.value = false;
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
    
    // Update balance after transfer
    await fetchWalletBalance()
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
      alert("All required fields must be filled")
      return
    }
    
    // Parse merkle proof string into array
    const merkleProofArray = mintData.value.proof
      .split(',')
      .map(p => p.trim())
      .filter(p => p !== '')
    
    // Use provided signature or default to empty
    const signature = mintData.value.signature || '0x'
    
    console.log("Minting with parameters:", {
      id: mintData.value.id,
      amount: mintData.value.amount,
      startDate: mintData.value.startDate,
      endDate: mintData.value.endDate,
      proofItems: merkleProofArray.length,
      signature: signature === '0x' ? 'None (using empty signature)' : 'Provided'
    })
    
    const tx = await tokenContract.claim(
      mintData.value.id,
      mintData.value.amount,
      mintData.value.startDate,
      mintData.value.endDate,
      merkleProofArray,
      signature
    )
    
    console.log("Transaction sent:", tx.hash)
    console.log("Waiting for transaction confirmation...")
    
    await tx.wait()
    
    console.log("Transaction confirmed!")
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
    if (!signatureData.value.recipientAddress || 
        !ethers.isAddress(signatureData.value.recipientAddress) ||
        !signatureData.value.id || 
        !signatureData.value.amount) {
      alert("All fields are required and must be valid")
      return
    }
    
    const data = {
      sender: signatureData.value.recipientAddress,
      id: signatureData.value.id,
      amount: signatureData.value.amount
    }
    
    // Create a hash of the parameters to sign
    const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
      ['address', 'uint256', 'uint256'],
      [data.sender, data.id, data.amount]
    )
    
    const messageHash = ethers.keccak256(encoded)
    
    // Sign the hash with the user's private key
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [messageHash, account.value]
    })
    
    // Set the signature output
    signatureOutput.value = signature
    
    console.log("Signature generated:", signature)
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
  
  // Reset the limiting bars flag
  isLimitingBars.value = false

  // Limit the number of bars to prevent overcrowding
  let displayData = stakesData
  if ((chartView.value === 'daily' || chartView.value === 'monthly') && stakesData.length > 20) {
    // Set flag that we're limiting bars
    isLimitingBars.value = true
    
    if (isDateFilterActive.value) {
      // If date filter is active but we still have too many bars, just take the first 20
      displayData = stakesData.slice(0, 20)
    } else {
      // Group by weeks or show recent data if too many days
      displayData = stakesData.slice(-20)
    }
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
      } else if (d.mintableAmount > 0 && d.totalAmount === d.mintableAmount) {
        return '#2196F3' // All mintable - blue
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
      
      // Get the position of the bar
      const barX = parseFloat(d3.select(this).attr('x'))
      const barWidth = parseFloat(d3.select(this).attr('width'))
      const barY = parseFloat(d3.select(this).attr('y'))
      
      // Get container dimensions
      const chartRect = chartContainer.value.getBoundingClientRect()
      
      // Calculate tooltip dimensions
      const tooltipNode = tooltip.node()
      const tooltipWidth = tooltipNode.offsetWidth
      const tooltipHeight = tooltipNode.offsetHeight
      
      // Position tooltip to the right of the bar if there's room, otherwise to the left
      let tooltipX = margin.left + barX + barWidth + 10  // Default: right of bar
      // If tooltip would go beyond right edge, position left of bar instead
      if (tooltipX + tooltipWidth > chartRect.width - 20) {
        tooltipX = margin.left + barX - tooltipWidth - 10  // Left of bar
      }
      
      // Position tooltip vertically centered with the bar
      let tooltipY = margin.top + barY - (tooltipHeight / 2)
      // Keep tooltip within the chart container vertically
      if (tooltipY < 10) tooltipY = 10
      if (tooltipY + tooltipHeight > chartRect.height - 10) {
        tooltipY = chartRect.height - tooltipHeight - 10
      }
      
      tooltip
        .style('left', `${tooltipX}px`)
        .style('top', `${tooltipY}px`)
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
    
    // Apply date filter for both daily and monthly views
    if ((chartView.value === 'daily' || chartView.value === 'monthly') && isDateFilterActive.value) {
      const startFilterDate = chartStartDate.value ? new Date(chartStartDate.value) : null
      const endFilterDate = chartEndDate.value ? new Date(chartEndDate.value) : null
      
      if (startFilterDate && date < startFilterDate) continue
      if (endFilterDate) {
        // Set end date to end of day
        endFilterDate.setHours(23, 59, 59, 999)
        if (date > endFilterDate) continue
      }
    }
    
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
        walletBalance.value = 0 // Reset balance
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

// Apply date filter
function applyDateFilter() {
  if (chartStartDate.value && chartEndDate.value) {
    if (new Date(chartStartDate.value) > new Date(chartEndDate.value)) {
      alert('Start date cannot be after end date')
      return
    }
    isDateFilterActive.value = true
    renderChart()
  }
}

// Reset date filter
function resetDateFilter() {
  chartStartDate.value = ''
  chartEndDate.value = ''
  isDateFilterActive.value = false
  renderChart()
}

// Handle auto-populate
async function handleAutoPopulate() {
  try {
    if (!mintData.value.id) {
      alert("Please enter a Stake ID first")
      return
    }
    
    console.log("Auto-populating mint data for Stake ID:", mintData.value.id)
    
    // Fetch and parse the base CSV file with retries
    const csvData = await fetchCSVWithRetry('/merkle_tree_base.csv', 3)
    
    // Find the stake with the matching ID
    const stake = csvData.find(row => row['id'] === mintData.value.id)
    
    if (!stake) {
      alert("Stake ID not found in the data")
      return
    }
    
    // Populate the form fields with the stake data
    mintData.value.amount = stake['amount']
    mintData.value.startDate = stake['minting_start_date']
    mintData.value.endDate = stake['minting_end_date']
    
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
    const stakeId = mintData.value.id
    
    // Search through the Merkle Proof CSV files
    for (const file of proofFiles) {
      try {
        const [startStakeId, endStakeId] = file.match(/_stake_id_(\d+)_until_end_stake_id_(\d+)\.csv$/).slice(1, 3).map(Number)
        if (Number(stakeId) >= startStakeId && Number(stakeId) <= endStakeId) {
          console.log(`Stake ID ${stakeId} is in range ${startStakeId}-${endStakeId}, fetching file...`)
          
          const proofCSVData = await fetchCSVWithRetry(file, 3)
          proofRow = proofCSVData.find(row => row['stake_id'] == stakeId)
          
          if (proofRow) {
            console.log("Found Merkle proof for stake ID:", stakeId)
            break
          }
        }
      } catch (error) {
        console.error(`Error searching in file ${file}:`, error)
      }
    }
    
    if (!proofRow || !proofRow['proof']) {
      alert("Merkle Proof not found in any CSV file")
      return
    }
    
    // Set the Merkle proof in the form
    mintData.value.proof = proofRow['proof']
    
    console.log("Auto-population complete!")
  } catch (error) {
    console.error("Error auto-populating mint data:", error)
    alert(`Error auto-populating mint data: ${error.message}`)
  }
}

// Copy signature to clipboard
function copySignature() {
  const textArea = document.createElement('textarea')
  textArea.value = signatureOutput.value
  document.body.appendChild(textArea)
  textArea.select()
  document.execCommand('copy')
  document.body.removeChild(textArea)
  alert('Signature copied to clipboard!')
}

// Add notification helper function
function showNotificationMessage(type, title, message) {
  notificationType.value = type;
  notificationTitle.value = title;
  notificationMessage.value = message;
  showNotification.value = true;
}

// Update mintLiquidHex function
async function mintLiquidHex() {
  if (!account.value) {
    showNotificationMessage('error', 'Wallet Not Connected', 'Please connect your wallet first');
    return;
  }

  if (!isValidMint.value) {
    showNotificationMessage('error', 'Invalid Mint', 'Please check your mint parameters');
    return;
  }

  try {
    isMinting.value = true;
    
    // Show transaction submitted notification
    showNotificationMessage(
      'info',
      'Transaction Submitted',
      'Your mint transaction has been submitted to the network'
    );

    // Execute mint transaction
    const tx = await tokenContract.mint(
      selectedStake.value.stakeId,
      selectedStake.value.amount,
      selectedStake.value.proof
    );

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    if (receipt.status === 1) {
      // Show success notification
      showNotificationMessage(
        'success',
        'Mint Successful!',
        `Congratulations! You have successfully minted ${selectedStake.value.amount} LHEX`
      );

      // Reload the page after a short delay to update metrics
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } else {
      showNotificationMessage('error', 'Transaction Failed', 'The mint transaction failed');
    }
  } catch (error) {
    console.error('Mint error:', error);
    showNotificationMessage(
      'error',
      'Mint Failed',
      error.message || 'Failed to mint LiquidHEX'
    );
  } finally {
    isMinting.value = false;
  }
}
</script>

<style scoped>
/* Add padding-top to account for the fixed navbar */
.mint-container {
  padding-top: 70px; /* Adjust to match navbar height */
}

/* Compact actions section (new) */
.compact-actions {
  padding: 0.5rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.compact-actions .action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.compact-actions .action-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(0, 0, 139, 0.7);
  border: none;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
}

.compact-actions .action-button:hover {
  transform: translateY(-2px);
  background-color: rgba(0, 0, 139, 0.9);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.compact-actions .action-button .icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f39c12;
}

/* Metrics Overview Section */
.metrics-overview {
  background-color: rgba(0, 0, 139, 0.8);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.metrics-container {
  max-width: 1200px;
  margin: 0 auto;
}

.address-display {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.address-label {
  font-weight: bold;
  margin-right: 0.5rem;
  color: #f39c12;
}

.address-value {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  font-family: monospace;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.metric-item {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 1rem;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metric-title {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

.metric-value {
  font-size: 1.4rem;
  font-weight: bold;
  color: #f39c12;
}

/* Address Search Section */
.address-search-section {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.search-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.address-search-input {
  flex: 1;
  min-width: 200px;
  padding: 0.8rem 1rem;
  border: 2px solid rgba(0, 0, 139, 0.5);
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
  border-radius: 5px;
  font-family: monospace;
}

.address-search-input:focus {
  outline: none;
  border-color: #f39c12;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.3);
}

.search-button, .back-button {
  padding: 0.8rem 1.5rem;
  border: none;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-weight: bold;
}

.search-button:hover, .back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.search-button:disabled {
  background: linear-gradient(135deg, #999, #777);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.back-button {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}

.back-button:hover {
  background: linear-gradient(135deg, #1976D2, #0D47A1);
}

.viewing-notice {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 139, 0.5);
  border-radius: 5px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.viewing-label {
  color: rgba(255, 255, 255, 0.7);
}

.viewing-address {
  font-family: monospace;
  font-weight: bold;
}

.read-only-badge {
  background-color: #F44336;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 0.5rem;
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
  backdrop-filter: blur(3px);
  padding: 0 1rem;
}

.popup-content {
  background-color: rgba(0, 0, 139, 0.95);
  margin: 10vh auto;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  max-width: 600px;
  width: 100%;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { transform: translateY(-50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.popup-header h3 {
  margin: 0;
  color: #f39c12;
  font-size: 1.5rem;
}

.close-btn {
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #f39c12;
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
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
}

.form-group input, .form-group textarea {
  padding: 0.8rem;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  color: white;
  font-family: monospace;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #f39c12;
  box-shadow: 0 0 0 2px rgba(243, 156, 18, 0.3);
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.submit-button {
  margin-top: 1rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.submit-button:hover {
  background: linear-gradient(135deg, #e67e22, #d35400);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.signature-output {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.signature-output h4 {
  margin-top: 0;
  color: #f39c12;
  margin-bottom: 0.5rem;
}

.output-code {
  font-family: monospace;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 5px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 150px;
  overflow-y: auto;
}

/* Stakes Section */
.stakes-section {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
}

.section-title {
  font-size: 1.8rem;
  color: #f39c12;
  margin-bottom: 1.5rem;
  text-align: center;
}

.filter-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.status-filter {
  padding: 0.5rem 1rem;
  background-color: rgba(0, 0, 139, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 5px;
  cursor: pointer;
}

.status-filter:focus {
  outline: none;
  border-color: #f39c12;
}

.stakes-container {
  background-color: rgba(0, 0, 139, 0.7);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.stakes-table-wrapper {
  overflow-x: auto;
  max-height: 500px;
  overflow-y: auto;
}

.stakes-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  min-width: 900px;
}

.stakes-table th {
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1;
  color: #f39c12;
  font-weight: bold;
  font-size: 1rem;
}

.stakes-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.2s;
}

.stakes-table tbody tr:hover td {
  background-color: rgba(255, 255, 255, 0.05);
}

.stakes-table tr.minted td {
  color: rgba(255, 255, 255, 0.6);
}

.stakes-table tr.connected-address td {
  background-color: rgba(243, 156, 18, 0.1);
}

.stakes-table tr.expired-stake td {
  color: rgba(255, 255, 255, 0.5);
  background-color: rgba(244, 67, 54, 0.1);
}

.stakes-table tr.locked-stake td {
  background-color: rgba(255, 152, 0, 0.1);
}

.stake-status {
  text-align: center;
}

.status-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  padding: 4px;
}

.minted-icon {
  background-color: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
}

.expired-icon {
  background-color: rgba(244, 67, 54, 0.2);
  color: #F44336;
}

.locked-icon {
  background-color: rgba(255, 152, 0, 0.2);
  color: #FF9800;
}

.mintable-icon {
  background-color: rgba(33, 150, 243, 0.2);
  color: #2196F3;
}

.mint-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mint-button:hover {
  background-color: #388E3C;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.locked-button {
  background-color: #FF9800;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  opacity: 0.7;
}

.expired-button {
  background-color: #F44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  opacity: 0.7;
}

.stakes-table .empty-row td {
  color: rgba(255, 255, 255, 0.2);
  text-align: center;
}

/* Stakes Chart Section */
.stakes-chart-section {
  padding: 1rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
}

.chart-controls {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  gap: 1rem;
}

.chart-view-toggle {
  display: flex;
  background-color: rgba(0, 0, 139, 0.7);
  border-radius: 30px;
  overflow: hidden;
  padding: 5px;
}

.chart-view-toggle button {
  padding: 0.5rem 1.5rem;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.chart-view-toggle button.active {
  background-color: #f39c12;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Date filter styles */
.date-filter {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 139, 0.7);
  padding: 0.5rem 1rem;
  border-radius: 30px;
  gap: 0.5rem;
  position: relative;
}

.date-filter-inputs {
  display: flex;
  gap: 0.5rem;
}

.date-filter-field {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.date-filter-field label {
  color: #f39c12;
  font-weight: bold;
  font-size: 0.9rem;
}

.date-filter-field input {
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.3rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.reset-filter {
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.reset-filter:hover {
  background-color: rgba(244, 67, 54, 0.7);
}

/* Info icon styles */
.info-icon-container {
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
}

.info-icon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: rgba(33, 150, 243, 0.3);
  border-radius: 50%;
  cursor: help;
  color: #fff;
}

.info-icon:hover {
  background-color: rgba(33, 150, 243, 0.7);
}

.info-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 0.8rem;
  border-radius: 4px;
  width: 220px;
  font-size: 0.8rem;
  line-height: 1.4;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;
  z-index: 1000;
  pointer-events: none;
}

.info-icon:hover .info-tooltip {
  opacity: 1;
  visibility: visible;
}

.info-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.9) transparent transparent transparent;
}

.chart-container {
  background-color: rgba(0, 0, 139, 0.7);
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.chart-empty {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

.chart-tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 10px;
  border-radius: 5px;
  pointer-events: none;
  z-index: 1000;
}

/* Footer */
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
  
  .action-button {
    width: 100%;
    max-width: 280px;
  }
  
  .search-container {
    flex-direction: column;
  }
  
  .address-search-input {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .popup-content {
    padding: 1rem;
  }
}

.form-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  }
  
  .action-button {
  padding: 0.8rem 1.5rem;
  background-color: rgba(0, 0, 139, 0.6);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  flex-grow: 1;
}

.action-button:hover {
  background-color: rgba(0, 0, 139, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.copy-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.7rem 1rem;
  background-color: rgba(33, 150, 243, 0.8);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  width: 100%;
}

.copy-button:hover {
  background-color: rgba(33, 150, 243, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* Add loading spinner styles */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.mint-button {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
}

.mint-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style> 
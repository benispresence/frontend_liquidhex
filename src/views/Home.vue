<template>
  <div class="home-container">
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
          <a href="#benefits" @click="(e) => scrollToSection(e, 'benefits')">Benefits</a>
          <a href="#how-it-works" @click="(e) => scrollToSection(e, 'how-it-works')">How it Works</a>
          <a href="#audit" @click="(e) => scrollToSection(e, 'audit')">Audit</a>
          <a href="#faq" @click="(e) => scrollToSection(e, 'faq')">FAQ</a>
          <router-link to="/mint" class="nav-cta-button" @click="closeMenu">Mint Now</router-link>
        </div>
      </div>
    </nav>

    <header class="hero">
      <div class="hero-content">
        <img src="/logo.png" alt="LiquidHEX Logo" class="logo">
        <h1 class="hero-title">LiquidHEX</h1>
        <h2 class="hero-subtitle">An eHEX Fork without Sellers</h2>
        <router-link to="/mint" class="cta-button">Mint LiquidHEX</router-link>
      </div>
    </header>

    <section class="contract-info">
      <div class="info-box">
        <p>Verify the contract address by comparing it here, GitHub, and Telegram to ensure you are interacting with the right contract.</p>
        <div class="contract-address">
          <span>Contract Address:</span> 
          <code>0xa73f450E3f17468A64BFdD222b099857Db76634d</code>
        </div>
      </div>
    </section>

    <section id="benefits" class="benefits-section">
      <h3 class="section-title">Benefits</h3>
      <div class="card-grid">
        <div class="card">
          <h4>What is LiquidHEX?</h4>
          <p>LiquidHEX is a fork of eHEX mintable by the strongest HEX stakers on Pulsechain.</p>
        </div>
        <div class="card">
          <h4>What is the Purpose of LiquidHEX?</h4>
          <p>LiquidHEX was designed to demonstrate the strength of HEX stakers through three use cases: Data Production, Education, and scarce Store of Value.</p>
        </div>
        <div class="card">
          <h4>Data production</h4>
          <p>It can predict if the strongest stakers will sell or hold their expiring stakes, as you can mint LHEX (LiquidHEX) one year before your original HEX stake matures.</p>
        </div>
        <div class="card">
          <h4>Education</h4>
          <p>It helps Hexicans learn about Merkle tree proofs and verify all aspects of the project, including how to run truly decentralized DEFI frontends. Successful users are rewarded with their LHEX tokens.</p>
        </div>
        <div class="card">
          <h4>Store of Value</h4>
          <p>It is capped at a total supply of 300 billion, released over 15 years as LHEX stakes expire. Due to its market value and scarcity, it is always sensible to mint LHEX.</p>
        </div>
      </div>
    </section>

    <section id="how-it-works" class="info-section">
      <h3 class="section-title">How it works</h3>
      <div class="collapsible-list">
        <div v-for="(item, index) in howItWorksList" :key="`how-${index}`" class="collapsible-item">
          <div class="collapsible-header" @click="toggleCollapse('how', index)">
            <h4>{{ item.title }}</h4>
            <span class="toggle-icon" :class="{ 'open': item.isOpen }">+</span>
          </div>
          <div class="collapsible-content" :class="{ 'open': item.isOpen }">
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="audit" class="info-section">
      <h3 class="section-title">Audit & Verification</h3>
      <div class="collapsible-list">
        <div v-for="(item, index) in auditList" :key="`audit-${index}`" class="collapsible-item">
          <div class="collapsible-header" @click="toggleCollapse('audit', index)">
            <h4>{{ item.title }}</h4>
            <span class="toggle-icon" :class="{ 'open': item.isOpen }">+</span>
          </div>
          <div class="collapsible-content" :class="{ 'open': item.isOpen }">
            <p>{{ item.content }}</p>
          </div>
        </div>
      </div>
    </section>

    <section id="faq" class="info-section">
      <h3 class="section-title">FAQ</h3>
      <div class="collapsible-list">
        <div v-for="(item, index) in faqList" :key="`faq-${index}`" class="collapsible-item">
          <div class="collapsible-header" @click="toggleCollapse('faq', index)">
            <h4>{{ item.title }}</h4>
            <span class="toggle-icon" :class="{ 'open': item.isOpen }">+</span>
          </div>
          <div class="collapsible-content" :class="{ 'open': item.isOpen }">
            <p v-html="item.content"></p>
          </div>
        </div>
      </div>
    </section>

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
        <router-link to="/mint">
          <span class="icon">🔨</span>
          Mint LiquidHEX
        </router-link>
      </div>
      <div class="copyright">
        &copy; {{ new Date().getFullYear() }} LiquidHEX
      </div>
    </footer>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from 'vue'

// Mobile menu state
const menuOpen = ref(false);

// Store event listeners for cleanup
const eventListeners = ref([]);

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

// Add smooth scroll functionality
function scrollToSection(event, sectionId) {
  event.preventDefault();
  const section = document.getElementById(sectionId);
  if (section) {
    const navbarHeight = 70; // Adjust based on your navbar height
    const topPosition = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
    
    window.scrollTo({
      top: topPosition,
      behavior: 'smooth'
    });
    
    closeMenu();
  }
}

// Initialize smooth scrolling for all section links
onMounted(() => {
  const navLinks = document.querySelectorAll('.navbar-links a[href^="#"]');
  
  navLinks.forEach(link => {
    const clickHandler = (e) => {
      const sectionId = link.getAttribute('href').substring(1);
      scrollToSection(e, sectionId);
    };
    
    link.addEventListener('click', clickHandler);
    
    // Store for cleanup
    eventListeners.value.push({
      element: link,
      type: 'click',
      handler: clickHandler
    });
  });
});

// Clean up event listeners when component is unmounted
onBeforeUnmount(() => {
  eventListeners.value.forEach(({ element, type, handler }) => {
    element.removeEventListener(type, handler);
  });
});

// Collapsible sections data
const howItWorksList = reactive([
  {
    title: "What stakes are eligible to mint?",
    content: "Only native active eHEX stakes that are staked longer than 720 days are eligible to mint that were staked before the fork. The Fork-Snapshot happened at Block Number 19947139 (Ethereum). Stakers who have emergency end-staked or net sold more than $50K worth of HEX in USDC pools are excluded from minting. Their stakes were not forked over.",
    isOpen: false
  },
  {
    title: "Merkle tree proofs",
    content: "A Merkle tree proof in a crypto mintable token scenario uses a hash-based tree structure to verify a participant's inclusion. Each participant's data is hashed into leaf nodes, which are combined to form a single root hash. A Merkle proof provides the necessary hashes to verify a specific participant's data ( in our case the specified mintable amounts) by recomputing the root hash. This method ensures efficient and secure verification of mintable LHEX eligibility.",
    isOpen: false
  },
  {
    title: "Minting Period",
    content: "Minting can only occur within the period starting one year before your original eHEX stake ends and one year after it ends. For bleeding stakes, you can mint until one year has passed since launch without any penalties.",
    isOpen: false
  }
]);

const auditList = reactive([
  {
    title: "Is the LiquidHEX Contract Address (0xa73…34d) verified?",
    content: "Yes, the contract was verified via Sourcify and it's viewable on the Pulsechain Blockexplorer.",
    isOpen: false
  },
  {
    title: "Is the LiquidHEX contract audited?",
    content: "Only 61 lines of code are not audited; the rest are audited as they are OpenZeppelin contracts. The 61 lines of code can be AI-audited with your preferred LLM because it is a simple contract. The complexity of LiquidHEX happened in calculating the eligibility and predicted payouts for each individual stake. This calculation was made outside of the Smart Contract keeping the Contract simple. The calculations can be verified by the root hash.",
    isOpen: false
  },
  {
    title: "What if I am Concerned About Interacting with the LiquidHEX Contract Using My Main Account?",
    content: "A method to mint LHEX to a burner address is available via a signature for those concerned about security.",
    isOpen: false
  }
]);

const faqList = reactive([
  {
    title: "Where is the Frontend?",
    content: "The frontend is available as a downloadable DEFI frontend via the official Github repository.",
    isOpen: false
  },
  {
    title: "Common Errors in Failed Mint LHEX Transactions",
    content: "\"Invalid Merkle proof\": You are either not the eligible address or the parameters are incorrect/formatted incorrectly. Refer to the example in the README file on GitHub.<br>\"ID already claimed\": LHEX was already minted for that stake ID.<br>\"Not within the minting window\": It is not yet time to mint your LHEX. Check the stake's minting start and end date.",
    isOpen: false
  },
  {
    title: "Why is There a Huge Sell Wall?",
    content: "The liquidity address received 30% of the total supply as announced, with 96% locked in a staking ladder for the next 15 years. This liquidity is not for selling but to provide efficient liquidity within the historical price ranges of HEX. The term \"sell wall\" is misleading as it does not suppress upward price movement. Concerns about the liquidity address pulling liquidity and causing a price fall are speculative and have not occurred. Early adopters take risks for great opportunities, and the majority of the liquidity addresses supply is locked, unlike other tokens. For example note that OA owns 95% of the circulating supply of eHEX and pHEX, and SA owns more than 50% of HDRN. The HEX and HDRN supply of those addresses are not even locked throughout a 15-year period.",
    isOpen: false
  },
  {
    title: "Why Would Anybody Buy?",
    content: "Users have already bought into LiquidHEX due to its potential of scooping up major supply at low prices. LiquidHEX is scarce!",
    isOpen: false
  }
]);

// Function to toggle collapse state
function toggleCollapse(listType, index) {
  let list;
  switch (listType) {
    case 'how':
      list = howItWorksList;
      break;
    case 'audit':
      list = auditList;
      break;
    case 'faq':
      list = faqList;
      break;
    default:
      return;
  }
  
  list[index].isOpen = !list[index].isOpen;
}
</script>

<style scoped>
/* Add navigation styles */
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

/* Mobile menu styles */
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
}

.home-container {
  padding-top: 70px; /* Adjust to match navbar height */
}

.hero {
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(0, 0, 139, 0.7) 0%, rgba(0, 0, 139, 0.3) 100%);
  z-index: -1;
}

.hero-content {
  padding: 2rem;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: fadeIn 1s ease-out;
  max-width: 600px;
  width: 100%;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo {
  width: 120px;
  height: 120px;
  object-fit: contain;
  margin-bottom: 1rem;
  filter: drop-shadow(0 0 10px rgba(255, 165, 0, 0.5));
  animation: pulse 5s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.hero-title {
  font-size: 3.5rem;
  margin: 0;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.5rem;
  margin: 0 0 2rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 300;
}

.cta-button {
  background: linear-gradient(135deg, #f39c12, #e67e22);
  color: #fff;
  padding: 12px 28px;
  font-size: 1.2rem;
  text-decoration: none;
  border-radius: 30px;
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 15px rgba(243, 156, 18, 0.5);
  border: none;
  cursor: pointer;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cta-button:hover {
  background: linear-gradient(135deg, #e67e22, #f39c12);
  transform: translateY(-2px);
  box-shadow: 0 7px 20px rgba(243, 156, 18, 0.6);
}

.contract-info {
  margin: 2rem 0;
  text-align: center;
  padding: 1rem 0;
}

.info-box {
  background-color: rgba(57, 52, 36, 0.7);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 0 auto;
}

.contract-address {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
}

.contract-address code {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-family: monospace;
  font-size: 1rem;
  user-select: all;
  word-break: break-all;
}

.section-title {
  font-size: 2.2rem;
  margin: 2.5rem 0 1.5rem;
  text-align: center;
  color: #fff;
  position: relative;
  display: inline-block;
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

.benefits-section, .info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3rem;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
}

.card {
  background-color: rgba(57, 52, 36, 0.8);
  border-radius: 10px;
  padding: 1.5rem;
  height: 100%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.card h4 {
  color: #f39c12;
  margin-top: 0;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  border-bottom: 2px solid rgba(243, 156, 18, 0.3);
  padding-bottom: 0.5rem;
}

.card p {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

.collapsible-list {
  width: 100%;
}

.collapsible-item {
  margin-bottom: 1rem;
  background-color: rgba(57, 52, 36, 0.8);
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.collapsible-item:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.collapsible-header {
  background-color: rgba(57, 52, 36, 1);
  color: #f39c12;
  margin: 0;
  padding: 1rem 1.5rem;
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collapsible-header h4 {
  margin: 0;
  font-size: 1.1rem;
}

.toggle-icon {
  font-size: 1.5rem;
  font-weight: bold;
  transition: transform 0.3s ease;
}

.toggle-icon.open {
  transform: rotate(45deg);
}

.collapsible-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
}

.collapsible-content.open {
  max-height: 1000px; /* Arbitrary large value */
}

.collapsible-content p {
  padding: 1rem 1.5rem;
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

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

/* Responsive design */
@media (max-width: 768px) {
  .hero {
    height: auto;
    padding: 4rem 0;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
  
  .card-grid {
    grid-template-columns: 1fr;
  }
  
  .footer-links {
    flex-direction: column;
    gap: 1rem;
  }
  
  .contract-address {
    flex-direction: column;
  }
  
  .contract-address code {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .hero-content {
    padding: 1.5rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .logo {
    width: 100px;
    height: 100px;
  }
  
  .cta-button {
    padding: 10px 20px;
    font-size: 1rem;
  }
}

/* Add smooth scrolling behavior to the document */
html {
  scroll-behavior: smooth;
}

/* Add some padding to section targets to account for fixed navbar */
section[id] {
  scroll-margin-top: 80px;
}
</style> 
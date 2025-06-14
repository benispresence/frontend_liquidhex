<template>
  <nav class="navbar">
    <div class="navbar-container">
      <div class="navbar-logo">
        <router-link to="/">
          <img src="/logo.png" alt="LiquidHEX Logo" class="nav-logo">
          <span class="nav-title">LiquidHEX</span>
        </router-link>
      </div>
      <div class="navbar-menu-toggle" @click="toggleMenu">
        <div class="bar" :class="{ 'open': menuOpen }"></div>
        <div class="bar" :class="{ 'open': menuOpen }"></div>
        <div class="bar" :class="{ 'open': menuOpen }"></div>
      </div>
      <div class="navbar-links" :class="{ 'open': menuOpen }">
        <router-link to="/" @click="closeMenu">Home</router-link>
        <a href="/#benefits" @click="scrollToSection('benefits')">Benefits</a>
        <a href="/#how-it-works" @click="scrollToSection('how-it-works')">How it Works</a>
        <a href="/#faq" @click="scrollToSection('faq')">FAQ</a>
        <router-link to="/mint" class="nav-cta-button" @click="closeMenu">Mint Now</router-link>
        <div class="wallet-connection" v-if="!isHomePage">
          <button 
            class="connect-button" 
            @click="connectWallet"
            :disabled="account"
          >
            {{ account ? 'Connected' : 'Connect Wallet' }}
          </button>
          <div v-if="account" class="connection-status">
            {{ formatAddress(account) }}
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

// Props to receive from parent components
const props = defineProps({
  account: {
    type: String,
    default: null
  }
});

// Emits to communicate with parent components
const emit = defineEmits(['connect']);

// Mobile menu state
const menuOpen = ref(false);

// Router and route instances
const router = useRouter();
const route = useRoute();

// Determine if we're on the home page
const isHomePage = computed(() => {
  return route.path === '/';
});

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

// Format address for display
function formatAddress(address) {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Connect wallet handler
function connectWallet() {
  closeMenu();
  emit('connect');
}

// Add smooth scroll functionality
function scrollToSection(sectionId) {
  if (route.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          const navbarHeight = 70;
          const topPosition = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          window.scrollTo({
            top: topPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    });
  } else {
    const section = document.getElementById(sectionId);
    if (section) {
      const navbarHeight = 70;
      const topPosition = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
      window.scrollTo({
        top: topPosition,
        behavior: 'smooth'
      });
    }
  }
  closeMenu();
}

// Clean up event listeners when component is unmounted
onBeforeUnmount(() => {
  eventListeners.value.forEach(({ element, type, handler }) => {
    element.removeEventListener(type, handler);
  });
});
</script>

<style scoped>
/* Navbar styling */
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

.navbar-logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
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

/* Wallet connection styling */
.wallet-connection {
  display: flex;
  align-items: center;
  margin-left: 1.5rem;
}

.connect-button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.connect-button:hover:not(:disabled) {
  background-color: #388E3C;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.connect-button:disabled {
  background-color: #388E3C;
  cursor: default;
}

.connection-status {
  background-color: rgba(0, 0, 139, 0.5);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  margin-left: 0.5rem;
  font-size: 0.9rem;
  white-space: nowrap;
}

/* Mobile menu styles */
@media (max-width: 992px) {
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
    margin: 1rem 0;
    font-size: 1.2rem;
  }
  
  .wallet-connection {
    margin-top: 1.5rem;
    margin-left: 0;
    flex-direction: column;
  }
  
  .connection-status {
    margin-top: 0.5rem;
    margin-left: 0;
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
</style> 
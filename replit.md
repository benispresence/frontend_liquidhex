# LiquidHEX Frontend - Replit Project

## Overview
LiquidHEX is a Vue.js 3 blockchain DApp that allows eligible HEX stakers on Pulsechain to mint LiquidHEX tokens. This is a fork of eHEX mintable by the strongest HEX stakers.

**Contract Address:** 0xa73f450E3f17468A64BFdD222b099857Db76634d (Pulsechain Mainnet)

## Project Status
- **Language:** Node.js 20
- **Framework:** Vue.js 3 + Vite
- **Port:** 5000
- **Type:** Frontend-only application (no backend)

## Recent Changes
- 2025-10-02: Imported from GitHub and configured for Replit environment
- Configured Vite to run on 0.0.0.0:5000 for Replit proxy compatibility
- Set up deployment configuration for production builds

## Project Architecture

### Technology Stack
- **Vue 3:** Progressive JavaScript framework
- **Vue Router:** Client-side routing
- **Vite:** Fast development build tool
- **Ethers.js:** Ethereum/Pulsechain blockchain interaction
- **PapaParse:** CSV parsing for Merkle tree proofs

### Key Features
1. MetaMask wallet connection
2. Merkle tree proof verification
3. LiquidHEX token minting interface
4. Eligible stakes viewing
5. Token transfer capabilities

### Directory Structure
```
/
├── src/
│   ├── components/     # Vue components (Navbar, Notification)
│   ├── views/          # Main views (Home, Mint)
│   ├── router/         # Vue Router configuration
│   ├── contracts/      # Smart contract ABIs
│   ├── assets/         # CSS and static assets
│   ├── App.vue         # Root component
│   └── main.js         # Application entry point
├── public/             # Static assets
├── merkle_tree_proofs/ # CSV files with Merkle proofs
├── index.html          # Main HTML file
├── vite.config.js      # Vite configuration
└── package.json        # Dependencies

```

### Configuration Details
- **Development Server:** Runs on 0.0.0.0:5000 via `npm run dev`
- **Host Configuration:** Configured to accept all hosts for Replit proxy
- **Cache Control:** Disabled for development to ensure updates are visible
- **HMR:** Hot Module Replacement enabled for fast development

### Deployment
- **Build Command:** `npm run build`
- **Production Server:** Vite preview server on port 5000
- **Deployment Type:** Autoscale (stateless frontend)

## User Preferences
None documented yet.

## Development Notes
- This is a Web3 DApp that requires MetaMask or compatible wallet
- CSV files contain pre-computed Merkle tree proofs for eligible stakers
- The app validates stakes against on-chain data before allowing minting

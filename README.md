# LiquidHEX Vue.js Frontend

A Vue.js implementation of the LiquidHEX frontend with minimal dependencies.

## Contract Address

PULSECHAIN MAINNET CONTRACT ADDRESS: 0xa73f450E3f17468A64BFdD222b099857Db76634d

## Overview

LiquidHEX is a fork of eHEX mintable by the strongest HEX stakers on Pulsechain. This frontend allows eligible stakers to mint their LiquidHEX tokens.

## Features

- Connect to MetaMask wallet
- View eligible stakes
- Mint LiquidHEX tokens
- Transfer tokens
- Create signatures for secure minting

## Minimal Dependencies

This project uses a minimal set of dependencies:

- Vue 3: Progressive JavaScript framework
- Vue Router: Official router for Vue.js
- Ethers.js: Library for interacting with Ethereum
- PapaParse: CSV parser for handling stake data
- Vite: Next-generation frontend tooling

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Directory Structure

```
liquidhex-vue/
├── public/
│   └── logo.png
├── src/
│   ├── assets/
│   │   └── style.css
│   ├── components/
│   │   └── ... (component files)
│   ├── router/
│   │   └── index.js
│   ├── views/
│   │   ├── Home.vue
│   │   └── Mint.vue
│   ├── App.vue
│   └── main.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Deployment

After building the project with `npm run build`, you can deploy the contents of the `dist` directory to any static hosting service.

## License

ISC

## About LiquidHEX

LiquidHEX was designed to demonstrate the strength of HEX stakers through three use cases:

1. **Data Production**: It can predict if the strongest stakers will sell or hold their expiring stakes, as you can mint LHEX (LiquidHEX) one year before your original HEX stake matures.

2. **Education**: It helps Hexicans learn about Merkle tree proofs and verify all aspects of the project, including how to run truly decentralized DEFI frontends. Successful users are rewarded with their LHEX tokens.

3. **Store of Value**: It is capped at a total supply of 300 billion, released over 15 years as LHEX stakes expire. Due to its market value and scarcity, it is always sensible to mint LHEX.


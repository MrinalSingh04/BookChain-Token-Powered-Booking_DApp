# BookChain — Token-Powered Booking DApp

A production-grade Next.js frontend for the Token-Based Booking System smart contracts deployed on Sepolia testnet.

## Stack

- **Next.js 15** (App Router)
- **TypeScript** — fully typed
- **ethers.js v6** — wallet + contract interactions
- **Tailwind CSS** — utility-first styling
- **Custom design system** — dark, acid-green aesthetic with Syne + JetBrains Mono fonts

## Features

- 🔗 MetaMask wallet connection with Sepolia auto-switch
- 📊 Dashboard with live on-chain stats (token balance, service count, booking count)
- 🛍 Browse & book services (ERC-20 approve + book in one flow)
- ❌ Cancel bookings with automatic token refund
- 🛡 Admin panel for owners: add/update services, pause/unpause the system
- 🔔 Real-time transaction status toasts
- 📋 Etherscan links for both deployed contracts

## Setup

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contract Addresses (Sepolia)

| Contract | Address |
|---|---|
| BookingToken | `0xc98E63aFB782C96eb24af410c3c63091Db663a73` |
| BookingSystem | `0xeAaDD7C8200FcC208eA126FF945F6D03a59378A0` |

## Usage Flow

1. Connect MetaMask wallet (switch to Sepolia if prompted)
2. Ensure you have BKT tokens (owner can mint via contract)
3. Browse available services on the **Services** tab
4. Click **Book Now** → approve tokens → confirm booking tx
5. View and manage your bookings on the **My Bookings** tab
6. Cancel any active booking to receive a full refund

## Admin Flow (Contract Owner Only)

The **Admin** tab appears automatically for the contract owner:
- Add new services with name + price
- Update existing service prices or toggle active/inactive
- Pause or unpause the entire booking system

## Project Structure

```
booking-dapp/
├── app/
│   ├── globals.css          # Custom design tokens + animations
│   ├── layout.tsx           # Root layout with Web3Provider
│   └── page.tsx             # Main page with tab routing
├── components/
│   ├── Navbar.tsx           # Wallet connect / balance header
│   ├── ConnectScreen.tsx    # Landing screen for unauthenticated
│   ├── DashboardStats.tsx   # On-chain stats grid
│   ├── TabNav.tsx           # Tab switcher component
│   ├── ServicesSection.tsx  # Browse + book services
│   ├── MyBookingsSection.tsx # View + cancel bookings
│   ├── AdminPanel.tsx       # Owner-only admin controls
│   └── TxToast.tsx          # Transaction status toasts
├── contexts/
│   └── Web3Context.tsx      # Global Web3 state + contract calls
├── lib/
│   └── contracts.ts         # ABIs + contract addresses
└── types/
    └── ethereum.d.ts        # window.ethereum type declarations
```

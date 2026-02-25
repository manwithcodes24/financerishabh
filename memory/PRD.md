# NovaX - Crypto Investment Platform PRD

## Original Problem Statement
Create a single page website to promote crypto investment, use nice graphics, animations and all, good color scheme. Dark futuristic with animation, live crypto data on another page, purple glowing theme.

## User Personas
- **Crypto Investors**: Looking for new investment opportunities
- **Traders**: Interested in real-time market data
- **Newcomers**: Learning about crypto investment

## Core Requirements
- Dark futuristic theme with purple glow aesthetic
- Animated landing page with promotional content
- Live crypto market data page
- CoinGecko API integration for real-time prices
- Newsletter subscription system

## What's Been Implemented (Dec 2025)
### Landing Page (/)
- Hero section with animated entrance, background image, CTAs, stats
- Crypto ticker with live price scrolling animation
- Features bento grid (6 cards: Security, Speed, Global, Multi-chain, Non-custodial, Analytics)
- Tokenomics section with SVG pie chart and legend
- Roadmap timeline (Q1 2025 - Q1 2026)
- FAQ section using shadcn Accordion
- Footer with newsletter subscription (MongoDB storage)

### Live Market Page (/market)
- Global stats cards (Market Cap, Volume, BTC Dominance, Active Cryptos)
- Trending coins row
- Top 20 coins table with sparkline charts (Recharts)
- Auto-refresh every 2 minutes
- Manual refresh button

### Backend APIs
- `/api/crypto/top-coins` - Top coins by market cap
- `/api/crypto/trending` - Trending cryptocurrencies
- `/api/crypto/global` - Global market statistics
- `/api/newsletter/subscribe` - Newsletter email subscription

### Tech Stack
- Frontend: React, framer-motion, Recharts, shadcn/ui, Tailwind CSS
- Backend: FastAPI, httpx (CoinGecko proxy), MongoDB (Motor)
- Fonts: Unbounded (headings), JetBrains Mono (data), Inter (body)
- CoinGecko free API with fallback data for rate limits

## Prioritized Backlog
- P0: None (MVP complete)
- P1: Add individual coin detail page, wallet connect integration
- P2: User authentication, portfolio tracking, price alerts
- P3: Dark/light theme toggle, social sharing, blog section

## Next Tasks
- Individual coin pages with historical charts
- Wallet integration (MetaMask, WalletConnect)
- User portfolio tracking with MongoDB persistence

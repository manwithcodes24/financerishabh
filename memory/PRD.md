# WealthX - Crypto Investment Consulting Platform PRD

## Original Problem Statement
Create a single page website to promote crypto investment consulting. User is a crypto investment consultant providing up to 40% monthly returns. Show investment examples in INR, investment schemes (admin managed), trust indicators, Indian testimonials, WhatsApp contact (7080682448), admin panel with password Newral@123, and live crypto market page.

## User Personas
- **Potential Investors**: Indians looking to invest in crypto through a consultant
- **Admin (Consultant)**: Manages investment schemes via admin panel at /admin

## Core Requirements
- Dark futuristic theme, purple glow
- Hero: "Your Crypto, My Expertise. Up to 40% Returns."
- Investment examples: 5K→7K, 20K→28K, 5L→7L INR
- Schemes from DB (CRUD via admin panel)
- Indian testimonials, trust indicators
- Contact via WhatsApp +91 7080682448
- Live crypto market data page
- Admin panel: password Newral@123

## What's Been Implemented (Dec 2025)
### Landing Page (/)
- Hero with consulting pitch, CTAs, trust stats
- Crypto ticker with live prices
- Investment examples (6 cards with profit calculations)
- Schemes section (4 plans from DB: Starter, Growth, Premium, Elite)
- Why Trust Us (6 trust indicators)
- Testimonials (6 Indian testimonials with investment/return amounts)
- FAQ (6 questions, shadcn accordion)
- Contact section with WhatsApp + phone
- Footer with newsletter subscription

### Admin Panel (/admin)
- Password-protected login (Newral@123)
- Full CRUD for investment schemes
- Create, edit, delete, toggle active/popular

### Market Page (/market)
- Global stats, trending coins, top 20 table with sparklines
- CoinGecko API with fallback data

### Tech Stack
- Frontend: React, framer-motion, Recharts, shadcn/ui, Tailwind
- Backend: FastAPI, httpx, MongoDB (Motor)
- Fonts: Unbounded, JetBrains Mono, Inter

## Prioritized Backlog
- P1: Add WhatsApp floating button, investor inquiry form
- P2: Investment calculator widget, referral system
- P3: Blog/news section, multi-language support (Hindi)

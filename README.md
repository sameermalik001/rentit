# RentIt - Peer-to-Peer Rental Marketplace

![CI](https://github.com/sameermalik001/rentit/actions/workflows/ci.yml/badge.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.3-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss)
![Vercel Ready](https://img.shields.io/badge/Vercel-Deployment%20Ready-black?logo=vercel)

RentIt is a full-featured peer-to-peer equipment and item rental marketplace built with Next.js (App Router), Tailwind CSS, Supabase, and real-time Fast2SMS OTP verification.

---

## 🌟 Key Features

- **📱 Mobile OTP Authentication**: Fast2SMS integration for 6-digit SMS OTP delivery to mobile devices.
- **🔐 Hybrid Auth**: Supports both Mobile OTP sign-in and Supabase Email & Password authentication.
- **🛍️ Item Marketplace**: Browse, filter, search, and list products across multiple categories.
- **📅 Rental Booking Engine**: Date selection, total price calculation with platform commission, and status lifecycle management.
- **👤 User Dashboard**: Manage your rental listings, incoming rental requests, active rentals, and notifications.
- **⚡ Vercel & CI Ready**: GitHub Actions CI workflow with zero build or prerender warnings.

---

## 🚀 One-Click Deploy to Vercel

1. Go to [Vercel](https://vercel.com/new).
2. Import the GitHub repository: **`sameermalik001/rentit`**.
3. In **Environment Variables**, configure the following keys:

| Variable | Description |
|---|---|
| `FAST2SMS_API_KEY` | Your Fast2SMS Authorization Key for live SMS delivery |
| `NEXT_PUBLIC_APP_URL` | Your production Vercel deployment URL (e.g. `https://your-app.vercel.app`) |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL *(Optional if using mock mode)* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase project anon key *(Optional if using mock mode)* |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key *(Optional)* |
| `NEXT_PUBLIC_DEFAULT_COMMISSION_PERCENT` | Platform commission rate (Default: `10`) |

4. Click **Deploy**.

---

## 🛠️ Local Development

### 1. Clone the Repository
```bash
git clone https://github.com/sameermalik001/rentit.git
cd rentit
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Fast2SMS API key and Supabase credentials.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build Verification
```bash
npm run build
```

---

## 📁 Project Structure

```
RENT_IT/
├── .github/workflows/ci.yml   # GitHub Actions CI workflow
├── src/
│   ├── app/                   # Next.js App Router (24 routes)
│   │   ├── api/auth/          # Send & verify OTP API routes
│   │   ├── browse/            # Marketplace item catalog
│   │   ├── dashboard/         # User dashboard (rentals, listings)
│   │   ├── list-product/      # List an item for rent
│   │   ├── login/             # Mobile OTP & password sign-in
│   │   └── signup/            # User registration
│   ├── components/            # Reusable UI components
│   ├── context/               # Auth & Cart Context providers
│   └── lib/                   # Supabase client & utilities
├── supabase/
│   └── schema.sql             # SQL schema for users, products, rentals
├── public/                    # Static assets
└── package.json
```

---

## 📄 License
MIT License.

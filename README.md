# 🌾 FarmOptima

> **Empowering farmers with real-time mandi intelligence, profit realization calculations, and route-mesh logistics optimization.**

---

## 📌 Overview

**FarmOptima** is an end-to-end agri-tech decision support platform designed to maximize farmer profits. Instead of relying solely on the nearest local market, FarmOptima calculates **true net realization** across all surrounding mandis by factoring in transportation costs, vehicle expenses, road tolls, and transit distances.

---

## ✨ Key Features

- 📊 **Real-Time Mandi Leaderboard**: Live price discovery and trend analysis across multiple agricultural markets using government/Agmarknet data integration.
- 💡 **Net Profit Realization Engine**: Compares gross revenue against transport expenses, fuel, tolls, and distance to show actual take-home profit.
- 🗺️ **Interactive Geospatial Map**: Visualizes nearby mandis, harvest origins, and optimized transport routes powered by Leaflet.
- 🚚 **RouteMesh Logistics**: Smart vehicle sharing and route aggregation to reduce logistics expenses for smallholder farmers.
- 🤖 **AI Agro-Assistant / Chatbot**: Conversational guidance on crop timing, market trends, and storage recommendations.
- 🌐 **Multilingual Support**: Built-in localization support for regional languages to ensure accessibility for all farmers.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Mapping & Geospatial**: [Leaflet](https://leafletjs.com/) & `react-leaflet`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Data APIs**: Agmarknet / Data.gov.in API Integration

---

## 📁 Project Structure

```
├── app/
│   ├── actions/          # Server actions for mandi data & calculation
│   ├── dashboard/        # Dashboard views & analytics
│   ├── layout.tsx        # Root application layout
│   └── page.tsx          # Landing page
├── components/
│   ├── dashboard/        # Dashboard widgets (InteractiveMap, MandiLeaderboard, Chatbot)
│   ├── views/            # Dashboard subviews (Markets, Recommendations, RouteMesh)
│   └── ...               # Shared UI components (Navbar, Footer, AuthModal)
├── context/              # Global state & Language context
├── lib/
│   ├── api/              # Data.gov.in clients & Mandi data providers
│   ├── geo.ts            # Geospatial calculations & distance metrics
│   ├── recommendation.ts # Profit & mandi recommendation algorithms
│   └── routeMesh.ts      # Logistics aggregation logic
└── public/               # Static assets & icons
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v18.x or higher)
- npm, yarn, or pnpm

### 2. Clone the Repository

```bash
git clone https://github.com/guptadiksha2025-cmd/morrow-farmoptima.git
cd farmoptima
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Environment Variables (Optional)

Create a `.env.local` file in the root directory if configuring external API keys:

```env
DATA_GOV_IN_API_KEY=your_api_key_here
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

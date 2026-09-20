# 🌾 FarmOptima

**AI-Powered Crop Selling & Market Optimization**

FarmOptima is an agricultural decision-support platform designed to help farmers decide **where and when to sell their crops** by comparing expected selling prices with transportation costs, market charges, spoilage risk, and other market factors.

Instead of focusing only on the highest mandi price, FarmOptima calculates **Expected Net Realization** to help identify a more practical selling option.

---

## 1. 📌 Project Name & Brief Description

### FarmOptima

FarmOptima is an AI-powered crop selling and market optimization platform that helps farmers make data-driven decisions about **where to sell and when to sell** their harvested crops.

The platform combines mandi market information, transportation considerations, spoilage risk, and market analysis to provide recommendations based on expected net realization.

**Core Formula:**

> **Expected Net Realization = (Expected Price × Quantity) − Transport Cost − Market Charges − Expected Spoilage Loss**

---

## 2. ❗ Problem Statement

Farmers often choose markets based mainly on the **highest available selling price**. However, the market offering the highest price may not always provide the highest actual return.

Factors such as:

* Transportation costs
* Market charges
* Distance to the mandi
* Expected spoilage or quality loss
* Market price uncertainty
* The decision of whether to sell now or wait

can significantly affect the farmer's final realization.

Therefore, farmers need a decision-support system that evaluates the **overall expected return**, rather than considering mandi price alone.

---

## 3. 🚀 Key Features

### 📊 Mandi Price & Market Intelligence

* Compare crop prices across different mandis.
* View market information through an interactive interface.
* Support multiple crop categories.

### 💰 Profit / Net Realization Calculation

* Calculates expected net realization.
* Considers crop quantity, expected price, transportation cost, market charges, and spoilage loss.
* Helps compare the practical profitability of different markets.

### 🗺️ Interactive Mandi Map

* Visualizes mandi locations.
* Displays market price information.
* Helps farmers compare markets based on location and distance.

### 🚚 RouteMesh Logistics

* Provides logistics and route-related information.
* Considers transportation while evaluating market options.
* Helps reduce unnecessary transportation costs.

### 🤖 AI Agent

* Provides an AI-powered conversational interface.
* Helps users understand market information and recommendations.
* Allows users to interact with the platform using natural-language questions.

### 🌐 Multilingual Support

* Provides language options to make the platform more accessible to farmers from different regions.

### 🔐 User Authentication

* Provides user login and profile functionality.
* Allows users to access their personalized platform experience.

### 📈 Market Recommendation

* Compares available market options.
* Supports the decision of **where to sell** and **when to sell**.
* Presents recommendations using market and cost-related factors.

---

## 4. 🛠️ Tech Stack

| Category        | Technology                                         |
| --------------- | -------------------------------------------------- |
| Frontend        | Next.js, React 19, TypeScript                      |
| Styling         | Tailwind CSS                                       |
| Backend / API   | Next.js API / Server Actions                       |
| Maps            | Leaflet, React Leaflet                             |
| Icons           | Lucide React                                       |
| Market Data     | AGMARKNET / Data.gov.in API                        |
| AI / Analytics  | AI-powered recommendation and forecasting pipeline |
| Package Manager | npm                                                |
| Deployment      | Vercel                                             |

---

## 5. ▶️ How to Run / Use the Project

### Prerequisites

Make sure the following are installed:

* Node.js 18 or later
* npm

### Clone the Repository

```bash
git clone https://github.com/MakersNeedMore-MnM/Round2-guptadiksha2025.git
cd Round2-guptadiksha2025
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the root directory and add the required market-data API key:

```env
DATA_GOV_IN_API_KEY=your_api_key_here
```

### Start the Development Server

```bash
npm run dev
```

Open the local development URL shown in the terminal, typically:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

### How to Use

1. Open FarmOptima.
2. Log in to the platform.
3. Select the required crop.
4. Enter the harvest quantity and relevant location details.
5. Explore available mandi prices.
6. Compare different market options using the interactive map.
7. Review transportation and RouteMesh information.
8. Check the expected net realization.
9. View the recommendation for where/when to sell.
10. Use the AI Agent to ask questions about the available market information.

---

## 6. 👥 Team Members

**Team Name:** Hidden Horizons
**Category:** Open Innovation
**Domain:** Agriculture
**Type:** Pure Software
**Team Size:** 2 Members

| Team Member         | Role                         |
| ------------------- | ---------------------------- |
| **Diksha Gupta**    | Development & Implementation |
| **Shruti Gujrathi** | Development & Implementation |

---

## 7. 📸 Screenshots / Demo

### 🌾 Landing Page

The FarmOptima landing page introduces the platform and highlights its core purpose of helping farmers determine what they actually earn after considering selling-related costs.

### 📊 Farmer Dashboard

The dashboard provides access to:

* Dashboard
* My Harvest
* Markets
* RouteMesh
* Recommendations
* AI Agent
* Profile
* Settings

### 🗺️ Interactive Mandi Map

The map displays mandi locations, crop prices, distances, and market-related information to help farmers compare selling destinations.

### 📈 Market Comparison

Farmers can select crops such as tomatoes, onions, potatoes, soybeans, wheat, cotton, mangoes, and other supported crops to explore market information.

### 🤖 AI Agent

The integrated AI Agent allows users to interact with the platform through natural-language questions and understand the available market and recommendation information.

### 🚚 RouteMesh

RouteMesh provides logistics-related information so that transportation considerations can be included when comparing selling options.

---

## 🔗 Project Links

**Live Demo:**
https://morrow-farmoptima.vercel.app/

**GitHub Repository:**
https://github.com/MakersNeedMore-MnM/Round2-guptadiksha2025.git

---

## 🔮 Future Scope

* Integration with additional live agricultural market sources
* Expansion to more crops and regions
* Weather and satellite-data integration
* Voice-based farmer assistance
* More regional languages
* Personalized market recommendations
* Improved price forecasting with additional historical data

---

## 💡 Project Impact

FarmOptima aims to help farmers make more informed selling decisions by shifting the focus from **highest market price** to **expected net realization**.

The platform can help users:

* Compare multiple markets
* Understand transportation implications
* Reduce unnecessary logistics costs
* Consider spoilage-related losses
* Make data-driven selling decisions

---

## 📄 Project Summary

FarmOptima combines **market intelligence, net realization analysis, interactive maps, logistics information, recommendations, multilingual support, and an AI Agent** into a single farmer-focused platform.

The goal is simple:

> **Help farmers understand not just where they can sell for more, but where they can actually earn more.**

---
 2026 **FarmOptima — Hidden Horizons**

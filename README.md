# 🌍 YENLU Field Shift

> **Bridging 20 Years of NASA Earth Observation Telemetry with Indigenous Agro-Climatology on the Slopes of Mount Cameroon.**  
> *Developed for the NASA Space Apps Challenge 2026 · Buea, Fako Division, Cameroon*

---

## 📌 Overview

**YENLU Field Shift** is a climate-smart precision agriculture and crop rotation advisory platform designed specifically for smallholder farming communities across the high-rainfall volcanic slopes of Mount Cameroon (Buea, Muea, Bokwango, Lysoka, and surrounding corridors).

Smallholder farmers in tropical volcanic microclimates face increasingly erratic rainfall onsets, intense monsoon deluges, slope-induced nutrient leaching, and root-rot waterlogging. YENLU bridges **20 years of NASA satellite telemetry (2006–2025)** with **indigenous multi-cropping traditions**, delivering actionable, dual-language field guidance in both **English** and **Cameroon Pidgin**.

---

## ✨ Key Features

- **🛰️ 20-Year NASA Climate Back-Test Engine**
  - Evaluates rotation viability against daily satellite records from 2006 to 2025 using NASA IMERG precipitation, MERRA-2 solar radiation & temperatures, and SMAP soil moisture data.
  - Automatically flags historical stress seasons, consecutive deluge periods, and waterlogging risks.

- **🎛️ Interactive "What-If" Climate Stress Simulator**
  - Allows farmers and extension workers to simulate rainfall volume shifts (-50% to +50%) and seasonal onset delays (-30 to +45 days) to stress-test rotation resilience before planting.

- **🌱 3-Slot Adaptive Rotation & "Add-a-Crop" Sandbox**
  - Side-by-side comparison of baseline indigenous rotations, optimized climate-resilient sequences, and custom farmer-curated crop combinations.
  - Real-time yield potential, economic gross margin (FCFA), soil nitrogen balance, and terrain slope safety scores.

- **🗣️ Dual-Language Grounded Advisory**
  - Field advice rendered in Standard English and Cameroon Pidgin ("Tok Tru" advisory) with scientific NASA parameter citations for maximum community trust and adoption.

- **🌋 Volcanic Slope & Topography Modeling**
  - Elevation-based adiabatic lapse rate adjustments and slope-tier classifications (Gentle, Moderate, Steep Volcanic Escarpment) to recommend appropriate contour ridging and vetiver grass barriers.

- **🤖 AI Agritech Copilot (Gemini API)**
  - Context-aware chatbot providing hyper-localized diagnostic agronomy advice calibrated to Fako Division soil conditions and market commodity trends.

- **📄 Printable Field Plan & Extension Export**
  - Generates clear, printable summary sheets for offline field access, cooperative meetings, and farm logbooks.

---

## 🛰️ NASA Earth Observation Datasets Used

- **GPM IMERG (Precipitation)**
  - Parameter: `IMERG_PRECTOT` (0.1° × 0.1° Daily)
  - Purpose: Historical precipitation, deluge tracking, and rainfall onset detection.

- **NASA POWER / MERRA-2 (Meteorology & Solar)**
  - Parameters: `T2M`, `T2M_MAX`, `ALLSKY_SFC_SW_DWN` (Daily)
  - Purpose: Temperature lapse rates, heat units, and surface solar radiation.

- **NASA SMAP (Soil Hydrology)**
  - Parameters: Surface & Root-Zone Soil Wetness (9 km / Daily)
  - Purpose: Soil saturation levels, field capacity tracking, and root asphyxiation risk alerts.

- **MODIS MOD13A2 (Vegetation Health)**
  - Parameters: 16-Day NDVI & EVI Vegetation Indices (1 km)
  - Purpose: Regional vegetation vitality baselines and historical biomass monitoring.

- **WFP & Local Buea Markets (Economic Telemetry)**
  - Parameters: Commodity Price Indices (FCFA/kg)
  - Purpose: Crop financial risk assessment and gross margin optimization.

---

## 🏗️ Architecture & Project Structure

```plaintext
YENLU/
├── engine/
│   └── advisoryEngine.js          # Core 20-year back-test & rotation calculation engine
├── frontend/
│   ├── public/                    # Emblems, motifs, branding assets
│   ├── src/
│   │   ├── components/            # Reusable UI (WhatIfSliders, RotationComparison, AIChatbot, etc.)
│   │   ├── context/               # Global application state (AppContext)
│   │   ├── data/                  # Bundled NASA telemetry, terrain grids, crop library & market prices
│   │   ├── engine/                # Client-side mirror of the advisory algorithm
│   │   ├── pages/                 # Dashboard, About & Methodology, Insights, Alerts
│   │   ├── services/              # Gemini AI & NASA weather integration services
│   │   └── utils/                 # Formatting helpers & map layer utilities
│   ├── index.html                 # Entry point
│   ├── package.json               # Dependencies & scripts
│   ├── tailwind.config.js         # Custom earthy African agricultural theme palette
│   └── vite.config.js             # Vite configuration
├── scripts/
│   ├── pull_smap_telemetry.js     # NASA SMAP soil moisture ingestion pipeline
│   └── fetch_and_embed_smap.js    # Data prep utilities
├── buea_crop_library.json         # Crop growth cycles, water thresholds, soil requirements
├── buea_market_prices.json        # Fako division commodity pricing benchmarks
├── buea_terrain.json              # Gridded elevation and slope parameters for Buea
└── README.md
```

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/your-username/yenlu.git
cd YENLU
```

### 2. Install dependencies
```bash
cd frontend
npm install
```

### 3. Configure Environment Variables (Optional for AI Copilot)
Create a `.env` file in the `frontend/` directory if you wish to use the Google Gemini Agritech Copilot:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 5. Build for Production
```bash
npm run build
npm run preview
```

---

## 👥 Meet Team YENLU

Rooted in Buea, Southwest Region, Cameroon:

- **Project Lead & Agritech Architect:** System architecture, NASA data engineering, agro-climatology algorithms.
- **Co-Founder & Field Operations:** Ground truthing, micro-climate field mapping, and slope validation across Muea, Bokwango, and Lysoka.
- **Senior Farm Advisor & Indigenous Agronomy:** Generational farming expertise, intercropping wisdom, and community partnership across local women farming cooperatives in Fako Division.

---

## 📜 License & Acknowledgments

- **Challenge:** Developed for the NASA International Space Apps Challenge.
- **Earth Data:** Gratefully acknowledging the NASA Earth Science Data and Information System (ESDIS), NASA POWER, and the GPM/SMAP science teams.
- **License:** Open Source under the MIT License.

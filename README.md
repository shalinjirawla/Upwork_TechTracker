# 🚀 TechTracker — Frontend

> **Upwork & Tech Talent Market Intelligence Platform**  
> Built with React, Vite, Tailwind CSS, Lucide Icons, and Recharts.

---

## ⚡ Tech Stack
- **Framework**: React 18 + Vite
- **Styling**: Vanilla CSS & Tailwind Utility Classes (NCoreSoft Brand Palette)
- **Charts & Visualizations**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

---

## 🛠️ Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set your backend API URL in `.env`:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## ☁️ Deployment on Vercel
- **Framework Preset**: Vite
- **Root Directory**: `./`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_BASE_URL` (set to your deployed backend URL)


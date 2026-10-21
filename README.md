# 🫀 CardioVeda Pro
### Medical-Grade 12-Lead ECG Simulator, AI Interpreter & Bilingual Clinical Learning Platform

[![React](https://img.shields.io/badge/React-18%2F19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)
[![Bilingual](https://img.shields.io/badge/Language-English_%26_%E0%A6%AC%E0%A6%BE%E0%A6%82%E0%A6%B2%E0%A6%BE-crimson?style=for-the-badge)](#-bilingual-pedagogy-english--বাংলা)

---

## 🌟 Executive Summary & Vision

**CardioVeda Pro** is an open-source, clinical-grade 12-lead Electrocardiogram (ECG) simulation and diagnostic learning web platform. Designed specifically for medical students, interns, resident physicians, cardiologists, emergency nurses, and paramedics, the platform bridges the gap between static textbook diagrams and chaotic real-world bedside ECG strips.

Unlike conventional ECG apps that replay pre-recorded static SVGs, **CardioVeda Pro** synthesizes electrophysiological dipole vectors $\vec{P}(t)$ in real time using the **extended McSharry dynamical ordinary differential equations (ODEs)** and projects them onto the 12 standard leads through the **Inverse Dower Transformation Matrix** and **Einthoven's/Goldberger's laws**.

---

## ✨ Key Feature Highlights

### 1. 🎛️ Mathematical Biophysical 12-Lead Synthesis Engine
* **True 3D Vectorcardiogram (VCG) Dipole:** Computes instantaneous spatial voltage loops along the orthogonal Frank axes ($X, Y, Z$).
* **Inverse Dower Transformation:** Derives 8 independent leads ($\text{I}, \text{II}, V_1\text{–}V_6$) directly from spatial vectors and completes the remaining 4 leads via **Einthoven's Law** ($\text{III} = \text{II} - \text{I}$) and **Goldberger's Equations** ($\text{aVR}, \text{aVL}, \text{aVF}$).
* **Strict International Calibration:**
  * Sweep Speeds: $25\text{ mm/s}$ ($1\text{ small box} = 40\text{ ms}$, $1\text{ large box} = 200\text{ ms}$) and $50\text{ mm/s}$.
  * Voltage Gains: $5\text{ mm/mV}$, $10\text{ mm/mV}$ ($1\text{ mm} = 0.1\text{ mV}$), and $20\text{ mm/mV}$.
  * Real $1\text{ mV}$ rectangular calibration pulse ($200\text{ ms}$ duration) at the beginning of each sweep.
  * Real-time $QT_c$ calculations using both **Bazett's** ($QT / \sqrt{RR}$) and **Fridericia's** ($QT / \sqrt[3]{RR}$) formulas.

### 2. 🎨 6 Authentic Medical Themes
Designed for dark ICU night-shifts, bright lecture projections, and bedside print examination:
1. **Classic Thermal Paper (Default Ward):** Warm off-white paper texture (`#FFFDF9`) with authentic millimeter pink/red grid and thermal black ink.
2. **ICU Patient Monitor (OLED Dark):** Deep pitch black (`#07090E`) with slate grid, neon phosphor green trace (`#00FF66`), and SpO2/vitals overlay.
3. **Clinical Daylight (EHR Digital):** Crisp white background with cool clinical blue millimeter grid and high-contrast navy ink.
4. **Vector Lab Blueprint (Electrophysiology):** Prussian blue background with cyan engineering grid and white vector trace.
5. **Retro Cath-Lab CRT (Vintage Oscilloscope):** Charcoal glass with glowing amber phosphor trace (`#FFB000`) and persistence decay trail.
6. **High-Contrast Print & Colorblind Safe:** Grayscale dotted grid and jet black ink compliant with Deuteranopia/Protanopia accessibility standards.

### 3. 📐 Interactive Draggable Brass Calipers & Marching Function
* Draggable caliper needles on the ECG screen measure exact time intervals ($\Delta t$ in milliseconds) and voltage differences ($\Delta V$ in millivolts).
* Automatically displays the small boxes, large boxes, and equivalent Heart Rate ($BPM = 60,000 / \Delta t$).
* **Marching Function:** Walk the calipers across the strip step-by-step to expose hidden, buried P-waves during Complete Heart Block or 2:1 Atrial Flutter!

### 4. 🫀 Live 3D Cardiac Conduction & Cabrera Hexaxial Wheel
* Synchronized cardiac anatomy diagram highlighting action potential propagation ($SA\text{ Node} \rightarrow AV\text{ Node} \rightarrow \text{Bundle of His} \rightarrow \text{Purkinje fibers}$) in real-time sync with each wave component ($P \rightarrow PR \rightarrow QRS \rightarrow T$).
* Real-time **Cabrera Hexaxial Wheel** visualization showing frontal electrical axis rotation and classification (Normal, LAD, RAD, Extreme Axis).

### 5. 📸 Camera-to-Diagnosis AI Paper Digitizer Pipeline
* Photograph paper ECG strips or upload scans/PDFs.
* OpenCV/HSV grid isolation separates millimeter paper from ink lines.
* Automated optical caliper placement ($P\text{-onset}, R\text{-peak}, T\text{-offset}$) with highlighted colored bounding boxes.
* **"Clone into Live Simulator"**: Converts any static paper photograph into an active, beating 12-lead trace where learners can test virtual interventions.

### 6. 💊 "Treat the Strip" Emergency Pharmacology & Shock Sandbox
Administer virtual emergency interventions and observe the dynamic electrophysiological response:
* **IV Adenosine (6mg / 12mg rapid flush):** Induces a transient 4-second asystolic pause, terminating AVNRT/SVT re-entry or unmasking atrial flutter.
* **IV Calcium Gluconate + Insulin-Dextrose:** Rapidly stabilizes myocyte membranes in severe hyperkalemia, narrowing wide QRS and resolving peaked T-waves.
* **IV Atropine (1mg bolus):** Vagolytic acceleration resolving acute symptomatic bradycardia.
* **Synchronized Cardioversion (100J):** Fires precisely on the R-wave to safely convert unstable VT or Atrial Fibrillation.
* **Unsynchronized Defibrillation (200J Biphasic):** Immediate electrical shock for pulseless Ventricular Fibrillation (VF) during Code Blue.

### 7. 🎯 Gamified OSCE Exam & "Code Blue" Drills
* Ward clinical vignettes presenting real patient history, age, sex, and bedside vital signs.
* Interactive 12-lead evaluation with instant bilingual scoring, pathophysiological rationale, and high-yield bedside pearls.

---

## 🌐 Bilingual Pedagogy (English & বাংলা)

Many medical students, interns, and nurses in South Asia study medical science in English but process complex pathophysiological logic in **বাংলা (Bengali)**. **CardioVeda Pro** features a 3-mode pedagogical language switch:

* **English Only:** Standard international cardiological nomenclature.
* **বাংলা + Clinical Terms (Hybrid):** Fluent, natural Bengali explanations preserving universal clinical terms (*SA Node, AV Block, STEMI, Reciprocal Change*) in brackets.
* **Side-by-Side Split View:** English on the left, Bengali on the right—ideal for ward rounds, seminar presentations, and exam prep.

### Standardized 9-Step Clinical Checklist

| Step | Parameter | English Diagnostic Analysis | বাংলা বিশ্লেষণ (Bengali Analysis) |
| :---: | :--- | :--- | :--- |
| **1** | **Calibration & Quality** | Speed $25\text{ mm/s}$, Gain $10\text{ mm/mV}$. Lead aVR negative. | পেপার স্পিড ২৫ মিমি/সে এবং গেইন ১০ মিমি/এমভি সঠিক আছে। Lead aVR নেগেটিভ। |
| **2** | **Heart Rate** | Computed via $300 \div \text{large squares}$ or 6-second strip. | পরপর দুটি R-wave এর মধ্যবর্তী বড় ঘর মেপে সঠিক হার্ট রেট নির্ণয়। |
| **3** | **Rhythm** | Sinus regularity, P-wave concordance in II/III/aVF. | R-R ব্যবধান সমান কিনা এবং প্রতিটি QRS-এর পূর্বে স্বাভাবিক P-wave আছে কিনা। |
| **4** | **Cardiac Axis** | Hexaxial quadrant analysis via Leads I, II, and aVF. | Lead I ও aVF এর ভোল্টেজ সাপেক্ষে ফ্রন্টাল কার্ডিয়াক অ্যাক্সিস নির্ধারণ। |
| **5** | **P-Wave** | Duration $< 120\text{ ms}$, amplitude $< 2.5\text{ mm}$. | অ্যাট্রিয়াম সংকোচন ও P-pulmonale / P-mitrale উপস্থিতি যাচাই। |
| **6** | **PR Interval** | Standard range $120\text{–}200\text{ ms}$ (3–5 small boxes). | AV নোডাল কন্ডাকশন বিলম্ব বা প্রি-এক্সাইটেশন (WPW) শনাক্তকরণ। |
| **7** | **QRS Complex** | Duration $< 120\text{ ms}$; R-wave progression $V_1 \rightarrow V_6$. | বান্ডল ব্রাঞ্চ ব্লক (RBBB/LBBB) এবং প্যাথলজিক্যাল Q-wave যাচাই। |
| **8** | **ST-Segment** | Isoelectric evaluation vs J-point elevation/depression. | মায়োকার্ডিয়াল ইনফার্কশন (STEMI) এবং রেসিপ্রোকাল পরিবর্তন শনাক্তকরণ। |
| **9** | **T-Wave & $QT_c$** | Morphology (peaked, inverted, biphasic) & Bazett $QT_c$. | হাইপারক্যালেমিয়া, লং-QT সিন্ড্রোম ও ইসকেমিয়া নিশ্চিতকরণ। |

---

## 🏗️ Architecture & Directory Layout

Built on modern, modular, single-responsibility architecture without cumbersome monolithic files:

```
cardioveda-pro/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD
├── public/
│   └── favicon.svg             # Medical ECG pulse brand icon
├── src/
│   ├── audio/
│   │   └── audioEngine.ts      # Web Audio API ICU beeps & S1/S2 heart sounds
│   ├── components/
│   │   ├── CameraUploadDigitizer.tsx  # Paper strip camera/upload AI pipeline
│   │   ├── ControlPanel.tsx           # Biophysical & artifact sliders
│   │   ├── DiagnosticPanel.tsx        # 9-step checklist & bilingual pearls
│   │   ├── DigitalCaliper.tsx         # Virtual marching calipers tool
│   │   ├── DiseaseAtlas.tsx           # Searchable 100+ disease library
│   │   ├── ECGMonitor.tsx             # 60 FPS Retina Canvas multi-lead renderer
│   │   ├── Header.tsx                 # Navigation, theme, lang, playback bar
│   │   ├── HeartVisualizer.tsx        # 3D conduction sync & Cabrera wheel
│   │   ├── OSCEQuizModal.tsx          # Code Blue & OSCE clinical vignettes
│   │   └── PharmacologySandbox.tsx    # "Treat the Strip" drug & shock lab
│   ├── core/
│   │   ├── mathEngine.ts       # McSharry ODE + Inverse Dower Matrix
│   │   └── noiseGenerator.ts   # Baseline wander, 50Hz hum, muscle tremor
│   ├── data/
│   │   ├── ecgDatabase.ts      # 100+ structured cardiac conditions
│   │   └── quizDatabase.ts     # Clinical vignettes and exam scenarios
│   ├── styles/
│   │   └── globals.css         # 6 authentic medical themes & CSS vars
│   ├── types/
│   │   └── ecg.ts              # Strict TypeScript physiological schemas
│   ├── App.tsx                 # Primary orchestration application shell
│   └── main.tsx                # React DOM entry point
├── index.html                  # HTML5 shell with medical fonts
├── netlify.toml                # Netlify 1-click deployment config
├── vercel.json                 # Vercel 1-click deployment config
├── tailwind.config.js          # Tailwind CSS styling framework
├── tsconfig.json               # Strict TypeScript configuration
├── vite.config.ts              # High-performance Vite build config
└── package.json                # Project dependencies and build scripts
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
* `npm`, `yarn`, or `pnpm`

### Local Installation
```bash
# Clone the repository
git clone https://github.com/eabkju/cardioveda-pro.git

# Enter project directory
cd cardioveda-pro

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build
```bash
npm run build
```
Optimized assets are compiled into `dist/`.

---

## 🌐 Instant Web Deployment

### 1. Deploy to Vercel (Recommended)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/eabkju/cardioveda-pro)
```bash
npm install -g vercel
vercel
```

### 2. Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### 3. Deploy to GitHub Pages
The included GitHub Action (`.github/workflows/deploy.yml`) deploys automatically on every push to `main`! Just ensure GitHub Pages is enabled under **Settings → Pages → Source: GitHub Actions**.

---

## ⚖️ Clinical & Legal Disclaimer

> [!CAUTION]
> **CardioVeda Pro** is strictly intended for **educational, pedagogical, and simulation training purposes** for medical students, healthcare trainees, and clinical professionals. It is not an FDA/CE-cleared diagnostic medical device and must never be used as a substitute for professional clinical judgment, emergency medical protocols, or real-life patient care.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

Made with ❤️ for medical education worldwide.

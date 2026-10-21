# CardioVeda Pro: Medical-Grade 12-Lead ECG Simulator, AI Interpreter & Bilingual Learning Platform

## 1. Executive Summary & Vision
**CardioVeda Pro** is a clinical-grade, interactive 12-lead Electrocardiogram (ECG) simulation and diagnostic learning web application. Designed for medical students, interns, residents, cardiologists, nurses, and paramedics, the platform bridges the gap between theoretical textbook waveforms and messy real-world clinical ECG strips. 

### Core Value Propositions
* **Mathematical Precision:** True biophysical 12-lead waveform synthesis calibrated to exact international medical standards ($25\text{ mm/s}$ and $50\text{ mm/s}$ sweep speeds; $5\text{ mm/mV}$, $10\text{ mm/mV}$, and $20\text{ mm/mV}$ gains).
* **Camera-to-Diagnosis AI Pipeline:** Optical digitization of physical paper ECG strips via smartphone camera or file upload, offering automated caliper measurements and step-by-step pedagogical breakdowns.
* **Bilingual Medical Pedagogy (English & বাংলা):** Side-by-side and toggleable explanations in standard medical English and natural clinical Bengali (বাংলা) to make complex electrophysiology accessible to South Asian medical learners and practitioners.
* **Real-Life Clinical Correlation:** Simulation of real-world artifacts (baseline wander, tremor, AC interference, lead reversals) alongside bedside clinical scenarios.

---

## 2. System Architecture & Modern Tech Stack

### 2.1 Frontend Architecture (Client-Side)
* **Framework:** Next.js 15 (App Router) with React 19 and TypeScript for strict type safety across physiological parameters.
* **Waveform Rendering Engine:** HTML5 `<canvas>` coupled with **WebGL (via PixiJS / Regl)** for $60\text{ FPS}$ real-time sweeping monitor rendering and high-DPI vector SVG export for static 12-lead printouts ($3 \times 4 + 1$ or $3 \times 4 + 3$ rhythm strip layouts).
* **3D Cardiac Conduction Sync:** **Three.js / React Three Fiber** for a real-time 3D anatomical heart model illustrating live action potential propagation ($SA\text{ Node} \rightarrow AV\text{ Node} \rightarrow \text{His-Purkinje}$) synchronized millisecond-by-millisecond with the ECG trace.
* **Audio Engine:** **Web Audio API** for realistic ICU monitor QRS beeps, alarms, and synchronized heart sounds ($S_1, S_2, S_3, S_4$, and murmurs).
* **Styling & Theme Engine:** Tailwind CSS + CSS Custom Variables for instant switching across 6 medical themes.
* **State Management:** Zustand for high-frequency waveform parameter state + TanStack Query for database and AI API states.

### 2.2 Backend, AI & Computer Vision Pipeline
* **API Gateway:** Python **FastAPI** (asynchronous microservices architecture).
* **Computer Vision (ECG Paper Digitization):** OpenCV + PyTorch (U-Net for grid removal & waveform segmentation) + Perspective Homography correction.
* **Time-Series Diagnostic AI:** 1D-ResNet / Transformer trained on PTB-XL and Chapman-Shaoxing 12-lead ECG datasets for arrhythmia and conduction classification.
* **Multimodal Pedagogical Engine:** Vision-Language Model integration (Gemini 2.5 Pro API) prompted with extracted 1D voltage arrays, precise interval measurements, and clinical rubrics to generate structured English and Bengali explanations.
* **Database & Storage:** PostgreSQL (with `pgvector` for similar-case retrieval), Prisma ORM, and AWS S3 / Cloudflare R2 for uploaded ECG strip storage.
* **Deployment & PWA:** Dockerized backend on Cloud Run/AWS ECS; Frontend on Vercel with Progressive Web App (PWA) offline support for simulation and core disease library access in low-connectivity hospital wards.

---

## 3. Medical-Grade 12-Lead Simulator Engine

To qualify as a **medical-grade simulator**, the engine avoids static pre-drawn SVG loops and instead computes a 3D cardiac dipole vector $\vec{P}(t) = [P_x(t), P_y(t), P_z(t)]^T$ in real time and projects it onto the 12 standard lead axes.

### 3.1 Biophysical & Mathematical Foundation
1. **3D Vectorcardiogram (VCG) Dipole Generation:**
   Based on the extended dynamical model by McSharry et al., the cardiac cycle is modeled in Cylindrical/Cartesian coordinates using coupled ordinary differential equations:
   $$\frac{dx}{dt} = \alpha x - \omega y$$
   $$\frac{dy}{dt} = \alpha y + \omega x$$
   $$\frac{dz}{dt} = -\sum_{i \in \{P, Q, R, S, T, U\}} a_i \Delta \theta_i \exp\left(-\frac{\Delta \theta_i^2}{2b_i^2}\right) - (z - z_0)$$
   Where $\alpha = 1 - \sqrt{x^2 + y^2}$, $\omega$ is the angular velocity derived from the instantaneous RR interval (incorporating respiratory sinus arrhythmia), and $a_i, b_i, \theta_i$ define the amplitude, width, and phase angle of each wave component ($P, Q, R, S, T, U$) along the $X, Y, Z$ orthogonal Frank leads.

2. **12-Lead Projection via Inverse Dower Transformation Matrix:**
   The 8 independent leads ($\text{I}, \text{II}, V_1, V_2, V_3, V_4, V_5, V_6$) are synthesized by multiplying the 3D cardiac vector $\vec{P}(t)$ by a lead-field transformation matrix $D$:
   $$\vec{V}_{8}(t) = D \cdot \vec{P}(t)$$
   The remaining 4 limb leads are computed dynamically using **Einthoven's Law** and **Goldberger's Equations**:
   $$\text{Lead III} = \text{Lead II} - \text{Lead I}$$
   $$\text{aVR} = -\frac{\text{Lead I} + \text{Lead II}}{2}$$
   $$\text{aVL} = \text{Lead I} - \frac{\text{Lead II}}{2}$$
   $$\text{aVF} = \text{Lead II} - \frac{\text{Lead I}}{2}$$

3. **Independent Multi-Oscillator Architecture (For AV Dissociation & Blocks):**
   To accurately simulate 3rd-Degree AV Block, Ventricular Tachycardia with capture/fusion beats, and Pacemaker rhythms, the engine runs **two independent pacemakers**:
   * **Atrial Oscillator ($SA$ / Ectopic Atrial):** Drives the $P$-wave vector loop.
   * **AV Node Conduction Delay & Refractory Filter:** Applies decremental conduction (for Wenckebach) or fixed block ratios ($2:1, 3:1$).
   * **Ventricular Oscillator ($His\text{-}Purkinje$ / Idioventricular):** Drives the $QRS\text{-}T$ vector loop.

### 3.2 Strict Medical Grid & Calibration Standards
* **Standard Grid Geometry:**
  * Small square: $1\text{ mm} \times 1\text{ mm}$
  * Large square: $5\text{ mm} \times 5\text{ mm}$ (bolded grid lines)
* **Time Axis (Horizontal) Calibration:**
  * At standard $25\text{ mm/s}$: $1\text{ mm} = 0.04\text{ s}$ ($40\text{ ms}$); $5\text{ mm} = 0.20\text{ s}$ ($200\text{ ms}$).
  * At $50\text{ mm/s}$: $1\text{ mm} = 0.02\text{ s}$ ($20\text{ ms}$).
* **Voltage Axis (Vertical) Calibration:**
  * At standard $10\text{ mm/mV}$: $1\text{ mm} = 0.1\text{ mV}$; $10\text{ mm} = 1.0\text{ mV}$.
  * Dynamic calibration pulse ($1\text{ mV}$ rectangular step wave of $200\text{ ms}$ width) rendered at the start of every line.
* **Corrected QT ($QT_c$) Live Calculation:**
  * Bazett's Formula: $$QT_c = \frac{QT}{\sqrt{RR}}$$
  * Fridericia's Formula (for extreme heart rates): $$QT_c = \frac{QT}{\sqrt[3]{RR}}$$

### 3.3 Real-Time Interactive Parameter Sliders
Users can Either select a preset disease OR manually tweak parameters on the fly:
* **Heart Rate:** $20\text{ BPM}$ to $300\text{ BPM}$
* **QRS Electrical Axis:** $-90^\circ$ to $+180^\circ$ (with live Hexaxial/Cabrera wheel visualization)
* **Intervals:** $PR$ ($80\text{ ms}$ to $500\text{ ms}$), $QRS$ ($60\text{ ms}$ to $240\text{ ms}$), $QT$ ($200\text{ ms}$ to $700\text{ ms}$)
* **Segment & Wave Modifiers (Per Regional Territory):**
  * ST-Segment Elevation / Depression ($-5\text{ mm}$ to $+10\text{ mm}$) with selectable morphology (concave, convex/"tombstone", horizontal, downsloping).
  * Pathological $Q$-wave depth and width.
  * $T$-wave amplitude (hyperacute to deep symmetric inversion).
  * $\delta$-wave (pre-excitation) and $\varepsilon$-wave (ARVC) toggles.
* **Real-World Artifact & Error Injectors:**
  * **Baseline Wander:** $0.15\text{ Hz}$ to $0.3\text{ Hz}$ sinusoidal respiratory drift.
  * **Powerline Interference:** $50\text{ Hz}$ (South Asia/Europe) or $60\text{ Hz}$ (North America) hum with adjustable Notch Filter toggle.
  * **EMG Muscle Tremor:** High-frequency Gaussian noise simulating shivering or Parkinsonism.
  * **Lead Misplacement Simulator:** Swap $LA \leftrightarrow RA$, $RA \leftrightarrow LL$, or place $V_1, V_2$ one intercostal space too high.

---

## 4. Comprehensive ECG Disease Database

The platform will ship with a structured, searchable database covering **100+ cardiac and systemic conditions**, organized into 8 core clinical modules:

### 4.1 Database Taxonomy
| Module | Included Pathologies & Variants |
| :--- | :--- |
| **1. Normal & Variants** | Normal Sinus Rhythm (NSR), Sinus Arrhythmia, Benign Early Repolarization, Athlete's Heart (Sinus Bradycardia + Incomplete RBBB), Persistent Juvenile T-wave Pattern, Dextrocardia. |
| **2. Atrial & Supraventricular Arrhythmias** | Sinus Tachycardia, Sinus Bradycardia, Premature Atrial Contractions (PACs), Atrial Fibrillation (Slow, Controlled, RVR), Atrial Flutter (Typical Counterclockwise & Atypical with variable block), AVNRT (Slow-Fast & Fast-Slow), AVRT, Multifocal Atrial Tachycardia (MAT), Wandering Atrial Pacemaker. |
| **3. Ventricular Arrhythmias** | Premature Ventricular Contractions (Unifocal, Multifocal, Bigeminy, Trigeminy, Couplets, R-on-T), Accelerated Idioventricular Rhythm (AIVR), Monomorphic VT, Polymorphic VT, Torsades de Pointes (TdP), Ventricular Flutter, Ventricular Fibrillation (Coarse & Fine), Asystole. |
| **4. Conduction Blocks & Pre-Excitation** | Sinoatrial Exit Block, 1st-Degree AV Block, 2nd-Degree Mobitz Type I (Wenckebach), 2nd-Degree Mobitz Type II, High-Grade AV Block, 3rd-Degree (Complete) Heart Block, Complete & Incomplete RBBB, Complete & Incomplete LBBB, Left Anterior Fascicular Block (LAFB), Left Posterior Fascicular Block (LPFB), Bifascicular & Trifascicular Blocks, Wolff-Parkinson-White (WPW Type A & B), Lown-Ganong-Levine (LGL). |
| **5. Myocardial Ischemia & Infarction** | Anterior STEMI, Septal STEMI, Lateral STEMI, Inferior STEMI (with RV infarction $V_4R$ view), Posterior STEMI (with $V_7\text{-}V_9$ view), Left Main Coronary Occlusion (aVR elevation), De Winter T-Waves, Wellens' Syndrome (Type A & B), Sgarbossa & Smith-Modified Sgarbossa Criteria (STEMI in LBBB/Paced rhythm), NSTEMI, Old Infarction (Pathological Q-waves). |
| **6. Chamber Enlargement & Hypertrophy** | Left Atrial Enlargement (P-mitrale), Right Atrial Enlargement (P-pulmonale), Biatrial Enlargement, Left Ventricular Hypertrophy (LVH with Sokolow-Lyon & Cornell criteria + strain pattern), Right Ventricular Hypertrophy (RVH), Biventricular Hypertrophy. |
| **7. Channelopathies, Pericardial & Pulmonary** | Brugada Syndrome (Type 1 Coved & Type 2 Saddleback), Congenital & Acquired Long QT Syndrome (LQTS 1, 2, 3), Short QT Syndrome, Arrhythmogenic Right Ventricular Cardiomyopathy (ARVC with $\varepsilon$-wave), Acute Pericarditis (Stages 1 to 4 + Spodick's Sign), Pericardial Effusion / Tamponade (Low voltage + Electrical Alternans), Acute Pulmonary Embolism (Sinus Tach, $S_1Q_3T_3$, Right Ventricular Strain). |
| **8. Electrolyte, Drug & Pacemaker** | Hyperkalemia (Mild peaked T $\rightarrow$ Loss of P $\rightarrow$ Sine Wave), Hypokalemia (Flattened T + Prominent U-waves), Hypercalcemia (Short $QT$), Hypocalcemia (Prolonged $QT$), Digoxin Effect ("Salvador Dali mustache" sagging ST) vs. Digoxin Toxicity (Bidirectional VT), Tricyclic Antidepressant (TCA) Toxicity (Terminal $R$ in aVR $> 3\text{ mm}$), Atrial Pacing (AAI), Ventricular Pacing (VVI), Dual-Chamber Pacing (DDD), Failure to Capture, Failure to Sense. |

### 4.2 Database Schema (JSON Structure Example)
```json
{
  "id": "stemi-inferior-rv",
  "category": "ischemia_infarction",
  "difficulty": "Intermediate",
  "urgency": "Cath Lab Activation (Code STEMI)",
  "title": {
    "en": "Acute Inferior Wall STEMI with Right Ventricular Involvement",
    "bn": "ডান ভেন্ট্রিকুলার ইনফার্কশনসহ একিউট ইনফেরিয়র ওয়াল STEMI (Acute Inferior Wall STEMI)"
  },
  "simulatorParams": {
    "heartRate": 54,
    "rhythm": "sinus_bradycardia_with_1st_deg_av_block",
    "prIntervalMs": 220,
    "qrsDurationMs": 92,
    "qrsAxisDeg": 75,
    "leadModifiers": {
      "II": { "stElevationMm": 2.5, "tWave": "hyperacute", "qWaveMm": -1.5 },
      "III": { "stElevationMm": 4.0, "tWave": "hyperacute", "qWaveMm": -2.5 },
      "aVF": { "stElevationMm": 3.0, "tWave": "hyperacute", "qWaveMm": -2.0 },
      "I": { "stElevationMm": -1.5, "tWave": "inverted" },
      "aVL": { "stElevationMm": -2.5, "tWave": "inverted" },
      "V1": { "stElevationMm": 1.5 },
      "V4R": { "stElevationMm": 2.0 }
    }
  },
  "diagnosticCriteria": {
    "en": [
      "ST-segment elevation > 1 mm in contiguous inferior leads (II, III, aVF).",
      "ST elevation in Lead III > Lead II (highly suggestive of Right Coronary Artery occlusion).",
      "Reciprocal ST-segment depression in high lateral leads (I and aVL).",
      "ST elevation in V1 and right-sided lead V4R > 1 mm confirms Right Ventricular infarction."
    ],
    "bn": [
      "ইনফেরিয়র লিডগুলোতে (Lead II, III, aVF) পরপর ২ বা ততোধিক লিডে ১ মি.মি. এর বেশি ST-elevation দেখা যাচ্ছে।",
      "Lead II এর তুলনায় Lead III-তে ST-elevation বেশি, যা Right Coronary Artery (RCA) ব্লকের সুনির্দিষ্ট লক্ষণ।",
      "ল্যাটারাল লিডে (Lead I এবং aVL) রেসিপ্রোকাল (Reciprocal) ST-depression রয়েছে।",
      "V1 এবং ডান পাশের V4R লিডে ST-elevation থাকায় এটি Right Ventricular Infarction নিশ্চিত করে।"
    ]
  },
  "realWorldClinicalPearl": {
    "en": "CRITICAL BEDSIDE WARNING: Because the right ventricle is infarcted, the heart is strictly preload-dependent. Avoid Nitrates (GTN) and Morphine, as they cause venodilation and life-threatening hypotension. Treat hypotension with IV Normal Saline boluses.",
    "bn": "জরুরি ক্লিনিক্যাল সতর্কতা: ডান ভেন্ট্রিকল আক্রান্ত হওয়ায় হৃদপিণ্ডের রক্ত পাম্প করার ক্ষমতা সম্পূর্ণ প্রিলোড (Preload)-নির্ভর হয়ে পড়ে। এই রোগীকে ভুলেও নাইট্রেট (GTN spray/tablet) দেওয়া যাবে না, দিলে রক্তচাপ হঠাৎ কমে গিয়ে কার্ডিওজেনিক শক হতে পারে। রক্তচাপ কম থাকলে শিরাপথে নরমাল স্যালাইন (IV Fluid bolus) দিতে হবে।"
  }
}
```

---

## 5. AI-Powered Camera Capture & ECG Upload Pipeline

Users can photograph a physical paper ECG strip in a clinic/ward or upload an image/PDF to receive an interactive, digitized breakdown.

```
[Camera Capture / Image Upload]
       │
       ▼
[Stage 1: Pre-Processing & Homography]
  ├── Guided Camera Viewfinder (4-corner alignment + glare detector)
  ├── Perspective De-warping & Curl Flattening (OpenCV Homography)
  └── Illumination Normalization & Shadow Removal (CLAHE)
       │
       ▼
[Stage 2: Grid Calibration & Color Separation]
  ├── HSV Color Space Masking (Isolating Pink/Red/Green Grid vs. Black/Blue Ink)
  ├── Hough Transform / FFT Grid Spacing Detection
  └── Pixel-to-Millimeter Calibration (Establishing exact 1 mm = X pixels)
       │
       ▼
[Stage 3: Lead Layout Segmentation & 1D Vectorization]
  ├── OCR Lead Label Detection (I, II, III, aVR, aVL, aVF, V1-V6, Rhythm Strip)
  ├── Skeletonization of Waveform Ink (1-pixel centerline)
  └── Conversion from 2D Pixels to 1D Voltage-Time Series (mV vs. ms)
       │
       ▼
[Stage 4: Hybrid Clinical Interpretation Engine]
  ├── Algorithmic Signal Processing: Exact R-R, PR, QRS, QTc & Axis Calculation
  ├── Deep Learning Ensemble: 1D-ResNet + Vision LLM Cross-Verification
  └── Interactive Output: Highlighted Bounding Boxes + Bilingual Step-by-Step Report
```

### Key Features of the Upload/Camera Module
1. **Interactive Visual Overlay on Uploaded Photo:**
   Instead of just spitting out text, the app draws colored transparent bounding boxes directly over the user's uploaded ECG photo:
   * **Red Highlight:** Pathological ST-elevation/depression or abnormal T-waves.
   * **Blue Caliper Marks:** Automatically placed on $P$-onset, $Q$-onset, $R$-peak, and $T$-offset so the student can *see* how the intervals were measured.
2. **"Load into Simulator" Button:**
   Once an uploaded real-life ECG is digitized, the user can click **"Clone to Live Simulator"** to convert the static paper photo into a live, beating 12-lead trace where they can test virtual treatments or adjust heart rates.
3. **Quality & Artifact Warning:**
   If the uploaded ECG has a $25\text{ mm/s}$ vs. $50\text{ mm/s}$ discrepancy, missing calibration pulse, or severe baseline wander, the AI explicitly flags it before interpreting.

---

## 6. Bilingual Educational Framework (English & বাংলা) & Real-Life ECG Explanation

Many Bengali-speaking medical students, interns, and nurses learn clinical medicine in English but think and process complex pathophysiological concepts best when reinforced in **বাংলা (Bengali)**.

### 6.1 Pedagogical Philosophy for Bilingual Medical Content
* **Natural Clinical Bengali (Not Robotic Translation):** Pure literal translations of medical terms (e.g., translating "Atrioventricular Node" into obscure Sanskritized Bengali) confuse medical students. Instead, the platform uses **Standard Clinical Bengali**—retaining universal English clinical terms (*SA Node, AV Block, STEMI, Lead V1, Reciprocal Change*) alongside clear Bengali script and phonetic clarity.
* **3-Mode Language Switcher:**
  1. **English Only:** Standard international medical terminology.
  2. **বাংলা + Clinical Terms (Bilingual Hybrid):** Explanations in fluent Bengali with standard English medical terms preserved in brackets.
  3. **Side-by-Side Split View:** English on the left, Bengali on the right—ideal for exam preparation and ward rounds.

### 6.2 Systematic 9-Step ECG Reading Framework (Built into Every Explanation)
Every simulated or uploaded ECG is broken down using a standardized, repeatable clinical checklist in both languages:

| Step | Parameter | English Explanation Example | বাংলা ব্যাখ্যা (Bengali Explanation Example) |
| :--- | :--- | :--- | :--- |
| **1** | **Calibration & Quality** | Speed: $25\text{ mm/s}$, Gain: $10\text{ mm/mV}$. Lead aVR is negative (no limb lead reversal). | পেপার স্পিড $25\text{ mm/s}$ এবং ভোল্টেজ ক্যালিব্রেশন $10\text{ mm/mV}$ সঠিক আছে। Lead aVR নেগেটিভ, অর্থাৎ লিম্ব লিড উল্টাপাল্টা লাগানো হয়নি। |
| **2** | **Heart Rate** | $300 \div 4\text{ large boxes} = 75\text{ BPM}$. | পরপর দুটি R-wave এর মাঝে ৪টি বড় ঘর রয়েছে, তাই হার্ট রেট $300 \div 4 = 75\text{ BPM}$ (স্বাভাবিক)। |
| **3** | **Rhythm** | Regular R-R intervals. Every QRS is preceded by a normal P-wave. | R-R ব্যবধান সমান (Regular) এবং প্রতিটি QRS কমপ্লেক্সের আগে একটি স্বাভাবিক P-wave আছে (Sinus Rhythm)। |
| **4** | **Cardiac Axis** | Lead I is positive ($+$), Lead aVF is negative ($-$), Lead II is negative ($-$) $\rightarrow$ Left Axis Deviation ($-45^\circ$). | Lead I পজিটিভ ($+$) কিন্তু Lead aVF ও Lead II নেগেটিভ ($-$), যা Left Axis Deviation ($-45^\circ$) নির্দেশ করে। |
| **5** | **P-Wave** | Duration $0.08\text{ s}$ ($2\text{ small boxes}$), amplitude $< 2.5\text{ mm}$. Normal atrial depolarization. | P-wave এর প্রশস্ততা ২ ছোট ঘর ($0.08\text{ s}$) এবং উচ্চতা $2.5\text{ mm}$ এর কম—অ্যাট্রিয়ামের সংকোচন স্বাভাবিক। |
| **6** | **PR Interval** | Constant at $0.16\text{ s}$ ($4\text{ small boxes}$). No AV block or pre-excitation. | PR ব্যবধান ৪ ছোট ঘর ($0.16\text{ s}$), যা স্বাভাবিক ($0.12\text{–}0.20\text{ s}$)। কোনো AV Block নেই। |
| **7** | **QRS Complex** | Narrow ($0.08\text{ s}$), normal R-wave progression from $V_1$ to $V_6$. No pathological Q-waves. | QRS কমপ্লেক্স সরু ($0.08\text{ s}$) এবং $V_1$ থেকে $V_6$ পর্যন্ত R-wave ক্রমান্বয়ে বড় হয়েছে (Normal R-wave progression)। |
| **8** | **ST-Segment** | Isoelectric in all leads except $3\text{ mm}$ convex elevation in $V_1\text{–}V_4$. | $V_1$ থেকে $V_4$ লিডে ST-segment ৩ মি.মি. উপরে উঠে গেছে (ST-Elevation), যা অ্যান্টেরিয়র ওয়াল হার্ট অ্যাটাকের লক্ষণ। |
| **9** | **T-Wave & $QT_c$** | Hyperacute T-waves in $V_2\text{–}V_3$. $QT_c = 410\text{ ms}$ (Normal). | $V_2\text{–}V_3$ লিডে উঁচু Hyperacute T-wave দেখা যাচ্ছে। $QT_c$ ব্যবধান স্বাভাবিক ($410\text{ ms}$)। |

### 6.3 "Real-Life vs. Textbook" Clinical Nuances Module
Real hospital ECGs rarely look like clean computer diagrams. A dedicated **"Real-World Ward Scenarios"** toggle teaches learners:
* **Why does the baseline jump?** Differentiating coarse Ventricular Fibrillation from a loose electrode or a patient brushing their teeth.
* **Serial ECG Evolution:** A timeline slider ($0\text{ mins} \rightarrow 30\text{ mins} \rightarrow 6\text{ hours} \rightarrow 24\text{ hours} \rightarrow 2\text{ weeks}$) showing how hyperacute T-waves evolve into ST-elevation, Q-waves, T-wave inversion, and persistent ST elevation (Ventricular Aneurysm).
* **Look-Alike Differential Comparisons:** Split-screen interactive comparison between **Acute Pericarditis vs. STEMI vs. Benign Early Repolarization**, or **VT vs. SVT with Aberrancy**.

---

## 7. Multi-Theme Visual Engine (6 Workable Medical Themes)

To support bedside use, dark ICU environments, lecture projections, and print study, the application implements 6 complete visual themes affecting both the UI chrome and the Canvas/WebGL ECG rendering engine:

| # | Theme Name | Grid & Background Palette | Waveform Ink & Glow | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **1** | **Classic Thermal Paper** *(Default Ward)* | Warm off-white paper texture (`#FFFDF9`) with authentic millimeter pink/red grid (`#F4A2A2` fine, `#E05A5A` bold). | Crisp thermal black trace (`#1A1A1A`) with subtle pressure-sensitive anti-aliasing. | Simulating standard hospital ECG printouts (Fukuda Denshi / Schiller / GE MAC style). |
| **2** | **ICU Patient Monitor** *(Bedside Dark)* | Deep pitch OLED black (`#07090E`) with muted dark slate grid (`#161F30`). | Neon Phosphor Green (`#00FF66`) for ECG, Cyan (`#00E5FF`) for $SpO_2$ pleth, Yellow (`#FFD600`) for respiration. | Live sweeping monitor mode, ICU/CCU training, and night-shift studying. |
| **3** | **Clinical Daylight** *(EHR Digital)* | Pure crisp white (`#FFFFFF`) with cool clinical blue millimeter grid (`#BFDBFE` fine, `#60A5FA` bold). | High-contrast Navy/Indigo vector ink (`#0F172A`). | Electronic Health Record (EHR) review, desktop reading, and projection in bright lecture halls. |
| **4** | **Vector Lab Blueprint** *(Electrophysiology)* | Deep Prussian blueprint background (`#0A192F`) with cyan engineering grid (`#1E3A5F`). | Crisp white waveform (`#F8FAFC`) with golden caliper overlays (`#F59E0B`). | Precision interval measurement, QRS axis vector math, and biophysical analysis. |
| **5** | **Retro Cath-Lab CRT** *(Vintage Oscilloscope)* | Warm charcoal phosphor glass (`#14110F`) with subtle CRT scanline shader and amber grid (`#3D2B1F`). | Glowing Amber phosphor trace (`#FFB000`) with realistic persistence decay trail behind the sweeping cursor. | Engaging visual aesthetic for continuous rhythm strip monitoring. |
| **6** | **High-Contrast Print & Colorblind Safe** | Pure white (`#FFFFFF`) with dotted grayscale grid (`#D4D4D4` fine, `#737373` bold). | Ultra-thick jet black trace (`#000000`) + distinct dashed/pattern overlays for annotations. | Accessibility (Deuteranopia/Protanopia safe) and direct PDF worksheet printing. |

---

## 8. Modernizations & Improvised Value-Add Features

To elevate **CardioVeda Pro** beyond standard ECG apps, the following modern interactive features are integrated:

### 8.1 Virtual Brass Calipers & Magnifying Loupe
* **Interactive Marching Calipers:** Two draggable needle points on screen. Once set to an $R\text{-}R$ or $P\text{-}P$ interval, users can "march" (flip) the caliper across the strip to immediately expose subtle regularities (e.g., hidden P-waves buried in T-waves during 2:1 Atrial Flutter or Complete Heart Block).
* **10x Millimeter Loupe:** Hovering or long-pressing opens a circular magnifying glass displaying exact $\text{ms}$ and $\text{mV}$ readouts at the cursor tip.

### 8.2 Synchronized 3D Heart & Cabrera Hexaxial Wheel
* **Live 3D Depolarization Map:** As the sweeping bar crosses the $P$-wave, the atria glow yellow on a 3D heart model; during the $PR$-segment, the $AV$ node illuminates; during the $QRS$, the ventricles depolarize along the exact vector path dictated by the active pathology (e.g., delayed left ventricular activation in LBBB).
* **Contiguous Lead Territory Overlay:** Clicking "Show Coronary Territories" color-codes the 12 leads by anatomical wall and culprit artery:
  * **Septal ($V_1, V_2$):** Proximal LAD
  * **Anterior ($V_3, V_4$):** LAD
  * **Lateral ($\text{I}, \text{aVL}, V_5, V_6$):** Left Circumflex (LCx)
  * **Inferior ($\text{II}, \text{III}, \text{aVF}$):** Right Coronary Artery (RCA)

### 8.3 Pharmacology & Defibrillation Sandbox ("Treat the Strip")
Users can administer virtual interventions and watch the 12-lead ECG respond dynamically in real time:
* **IV Adenosine ($6\text{ mg} / 12\text{ mg}$):** Induces a transient $4\text{-second}$ sinus pause/asystole followed by either termination of AVNRT into Normal Sinus Rhythm or unmasking of underlying Atrial Flutter waves.
* **IV Calcium Gluconate $\rightarrow$ Insulin + Dextrose:** Watch a sine-wave Hyperkalemia strip progressively narrow its QRS and flatten its peaked T-waves back to normal.
* **Synchronized Cardioversion vs. Defibrillation:** Teaches the critical importance of pressing the **"SYNC"** button (marking R-waves) before shocking unstable VT/SVT to avoid inducing Ventricular Fibrillation via an R-on-T shock.

### 8.4 Gamified "Code Blue" & OSCE Exam Mode
* **Spot Diagnosis Blitz:** 60-second timed ECG recognition drills with instant bilingual feedback.
* **Interactive Clinical Vignettes:** Presents a patient history (e.g., *"58-year-old diabetic male from Dhaka presents with epigastric pain and sweating..."*), displays the live ECG, and tests the user on:
  1. Primary ECG Findings
  2. Culprit Coronary Artery or Conduction Defect
  3. Immediate Next Step in Management (or Contraindicated Drugs)

---

## 9. UI/UX Layout Architecture

```
+-----------------------------------------------------------------------------------+
| [Logo: CardioVeda Pro]  [Mode: Simulator | AI Upload | Disease Atlas | OSCE Quiz] |
|                         [Lang: EN | বাংলা | Split]  [Theme: Thermal Paper ▼]       |
+-----------------------+-----------------------------------+-----------------------+
|                       |  [25 mm/s] [10 mm/mV] [Filter ON] |                       |
|  DISEASE & PARAMETER  |  [Caliper] [Territory Color] [3D] |   BILINGUAL CLINICAL  |
|  CONTROL PANEL        |-----------------------------------|   EXPLANATION PANEL   |
|                       |  I      aVR     V1      V4        |                       |
|  Search 100+ ECGs...  |  /\     \/      /\      /\        |  [EN] [বাংলা] [Both]  |
|  > Ischemia / STEMI   |                                   |                       |
|  > Arrhythmias        |  II     aVL     V2      V5        |  Diagnosis:           |
|  > Conduction Blocks  |  /\     /\      /\      /\        |  Anterior Wall STEMI  |
|  > Electrolytes       |                                   |  (অ্যান্টেরিয়র STEMI)    |
|                       |  III    aVF     V3      V6        |                       |
|  --- Live Sliders --- |  /\     /\      /\      /\        |  9-Step Breakdown:    |
|  HR:   [===O===] 78   |                                   |  1. Rate: 78 BPM      |
|  Axis: [==O====] +30° |  RHYTHM STRIP (Lead II - 10 sec)  |  2. Rhythm: Sinus     |
|  PR:   [===O===] 160  |  /\____/\____/\____/\____/\____   |  3. ST: >4mm in V1-V4 |
|  QRS:  [==O====] 88   |-----------------------------------|                       |
|  ST:   [=====O=] +3mm |  [Play/Pause] [Sweep/Static Print]|  Real-Life Pearl:     |
|  Noise:[O======] 0%   |  [Give Drug ▼] [Shock / Pacer]    |  Check V7-V9 & V4R... |
+-----------------------+-----------------------------------+-----------------------+
```

---

## 10. Phased Implementation Roadmap

### Phase 1: Core Biophysical Engine & Multi-Theme UI (Weeks 1–3)
* Build the TypeScript McSharry + Dower 12-lead mathematical synthesis engine.
* Implement the high-DPI Canvas/WebGL renderer supporting both **Live Sweeping Monitor Mode** and **Static 12-Lead Paper Printout Mode** ($3 \times 4 + 1$ rhythm strip).
* Implement the 6 visual themes and interactive Digital Calipers.

### Phase 2: Bilingual Disease Database & 9-Step Pedagogical Engine (Weeks 4–5)
* Populate the structured JSON database with 100+ cardiac diseases, parameter presets, and English + বাংলা (Bengali) clinical explanations.
* Add the Coronary Territory overlay, Hexaxial Axis Wheel, and "Real-Life vs. Textbook" clinical pearls.

### Phase 3: Camera Capture, Image Digitization & AI Interpretation (Weeks 6–8)
* Develop the Guided Camera Viewfinder and file upload dropzone.
* Build the OpenCV grid-calibration pipeline and integrate multimodal AI for automated interval measurement, bounding-box highlighting, and bilingual report generation.
* Add the "Clone Uploaded ECG to Live Simulator" feature.

### Phase 4: 3D Heart Sync, Pharmacology Sandbox & PWA Deployment (Weeks 9–10)
* Integrate the synchronized Three.js 3D cardiac conduction model and Web Audio API monitor sounds.
* Build the Pharmacology/Defibrillation sandbox and OSCE Quiz mode.
* Configure Service Workers for offline PWA functionality and deploy to production.
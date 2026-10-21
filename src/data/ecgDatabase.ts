import { ECGCase } from '../types/ecg';

export const ECG_DATABASE: ECGCase[] = [
  {
    id: 'normal-sinus-rhythm',
    category: 'normal',
    difficulty: 'Beginner',
    urgency: 'Routine',
    title: {
      en: 'Normal Sinus Rhythm (NSR)',
      bn: 'স্বাভাবিক সাইনাস রিদম (Normal Sinus Rhythm)'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 75,
      rhythm: 'normal_sinus',
      prIntervalMs: 160,
      qrsDurationMs: 84,
      qtIntervalMs: 390,
      qrsAxisDeg: 45,
      leadModifiers: {},
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Speed 25 mm/s, Gain 10 mm/mV. Lead aVR predominantly negative. No lead reversal.', bn: 'স্পিড ২৫ মিমি/সে, গেইন ১০ মিমি/এমভি। লিড aVR স্বাভাবিকভাবে নেগেটিভ।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '75 BPM (Normal resting rate: 60 - 100 BPM). Regular RR interval (4 large squares).', bn: 'হার্ট রেট ৭৫ বিপিএম (স্বাভাবিক ৬০-১০০ বিপিএম)। RR ইন্টারভ্যাল সমান (৪টি বড় ঘর)।', status: 'normal' },
      { step: 3, param: 'Rhythm', en: 'Sinus rhythm. Upright P waves in II, III, aVF; inverted in aVR. Every P wave followed by QRS.', bn: 'নরমাল সাইনাস রিদম। লিড II, III, aVF-এ P ওয়েভ সোজা এবং aVR-এ উল্টো।', status: 'normal' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal axis (+45°). QRS positive in both Lead I and Lead aVF.', bn: 'স্বাভাবিক অক্ষ (+৪৫°)। লিড I ও aVF উভয়টিতেই QRS পজিটিভ।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Duration < 120 ms (3 small boxes), amplitude < 2.5 mm in lead II. Normal atrial depolarization.', bn: 'P-ওয়েভ ডিউরেশন ৩ ছোট ঘরের কম (<১২০ ms), অ্যাম্প্লিচুড ২.৫ মিমি এর নিচে।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: '160 ms (4 small boxes, normal 120-200 ms). Constant and reproducible.', bn: 'PR ইন্টারভ্যাল ১৬০ মিলি-সেকেন্ড (৪টি ছোট ঘর, স্বাভাবিক ১২০-২০০ ms)।', status: 'normal' },
      { step: 7, param: 'QRS Complex', en: 'Duration 84 ms (<120 ms). Normal R-wave progression from V1 (rS) to V6 (qR). No pathological Q-waves.', bn: 'QRS ডিউরেশন ৮৪ ms। V1 থেকে V6 পর্যন্ত স্বাভাবিক R-ওয়েভ প্রগ্রেশন রয়েছে।', status: 'normal' },
      { step: 8, param: 'ST-Segment', en: 'Isoelectric baseline across all 12 leads. No pathological elevation or depression.', bn: 'সব লিডে ST সেগমেন্ট আইসো-ইলেকট্রিক বেইজলাইনে রয়েছে।', status: 'normal' },
      { step: 9, param: 'T-Wave & QTc', en: 'Concordant upright T waves in I, II, V3-V6. QTc = 415 ms (Normal < 440 ms in males, < 460 ms in females).', bn: 'স্বাভাবিক T ওয়েভ। QTc ব্যবধান ৪১৫ মিলি-সেকেন্ড যা সম্পূর্ণ স্বাভাবিক।', status: 'normal' }
    ],
    realWorldClinicalPearl: {
      en: 'Always inspect lead aVR first: if P and QRS are upright in aVR, suspect limb lead misplacement (RA/LA cable reversal) or dextrocardia before diagnosing pathology!',
      bn: 'ওয়ার্ডে যেকোনো ইসিজি হাতে নিয়ে সবার আগে Lead aVR খেয়াল করুন: aVR-এ P এবং QRS সোজা থাকলে প্যাথলজি ভাবার আগেই লিড রিভার্সাল (ডান ও বাম হাতের তার উল্টাপাল্টা) হয়েছে কিনা যাচাই করুন।'
    }
  },
  {
    id: 'acute-inferior-stemi-rv',
    category: 'ischemia_infarction',
    difficulty: 'Intermediate',
    urgency: 'Cath Lab Activation (Code STEMI)',
    title: {
      en: 'Acute Inferior Wall STEMI with Right Ventricular Involvement',
      bn: 'ডান ভেন্ট্রিকুলার ইনফার্কশনসহ একিউট ইনফেরিয়র ওয়াল STEMI'
    },
    territory: 'Inferior (II, III, aVF)',
    culpritArtery: 'RCA',
    simulatorParams: {
      heartRate: 54,
      rhythm: 'sinus_bradycardia_with_1st_deg_av_block',
      prIntervalMs: 220,
      qrsDurationMs: 94,
      qtIntervalMs: 440,
      qrsAxisDeg: 80,
      leadModifiers: {
        'II': { stElevationMm: 2.8, tWave: 'hyperacute', qWaveMm: -1.5 },
        'III': { stElevationMm: 4.5, tWave: 'hyperacute', qWaveMm: -2.8 },
        'aVF': { stElevationMm: 3.2, tWave: 'hyperacute', qWaveMm: -2.0 },
        'I': { stElevationMm: -1.8, tWave: 'inverted' },
        'aVL': { stElevationMm: -2.8, tWave: 'inverted' },
        'V1': { stElevationMm: 1.8 },
        'V2': { stElevationMm: -1.2 }
      },
      baselineWander: 0.08,
      acInterference50Hz: 0.05,
      muscleTremor: 0.05,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Calibrated at 25 mm/s, 10 mm/mV. Diagnostic quality confirmed.', bn: 'ক্যালিব্রেশন ২৫ মিমি/সে এবং ১০ মিমি/এমভি সঠিক আছে।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '54 BPM (Sinus Bradycardia). Inferior STEMI frequently affects SA/AV nodal artery branch.', bn: '৫৪ বিপিএম (সাইনাস ব্রাডিকার্ডিয়া)। RCA ব্লকের কারণে নোডাল রক্তপ্রবাহ কমে ব্রাডিকার্ডিয়া হতে পারে।', status: 'abnormal' },
      { step: 3, param: 'Rhythm', en: 'Sinus rhythm with PR prolongation (1st Degree AV Block).', bn: '১ম ডিগ্রি AV ব্লক সহ সাইনাস রিদম।', status: 'abnormal' },
      { step: 4, param: 'Cardiac Axis', en: 'Rightward axis shift (+80°).', bn: 'কার্ডিয়াক অ্যাক্সিস ডানদিকে শিফট করেছে (+৮০°)।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Normal amplitude and morphology.', bn: 'P ওয়েভের আকৃতি স্বাভাবিক।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: 'Prolonged at 220 ms (> 200 ms) indicating 1st Degree AV nodal conduction delay.', bn: 'PR ইন্টারভ্যাল ২২০ মিলি-সেকেন্ড যা ২০০ ms-এর বেশি (1st degree AV block)।', status: 'abnormal' },
      { step: 7, param: 'QRS Complex', en: 'Developing pathological Q waves in Lead III (> 2 mm depth) and aVF.', bn: 'লিড III ও aVF-এ প্যাথলজিক্যাল Q ওয়েভ তৈরি হচ্ছে।', status: 'abnormal' },
      { step: 8, param: 'ST-Segment', en: 'CRITICAL: Marked convex ST-elevation in II (2.8 mm), III (4.5 mm), and aVF (3.2 mm). Note: ST-elevation in Lead III > Lead II indicates RCA culprit. Reciprocal ST-depression in I and aVL.', bn: 'মারাত্মক: II, III এবং aVF লিডে উল্লেখযোগ্য ST-elevation। লক্ষ্য করুন Lead III-এর ST-elevation Lead II-এর চেয়ে বেশি, যা RCA ব্লকের প্রমাণ। লিড I ও aVL-এ রেসিপ্রোকাল ডিপ্রেশন বিদ্যমান।', status: 'critical' },
      { step: 9, param: 'T-Wave & QTc', en: 'Hyperacute T waves in inferior leads; symmetric T-wave inversion in high lateral leads (I, aVL).', bn: 'ইনফেরিয়র লিডগুলোতে হাইপারএকিউট T ওয়েভ এবং হাই ল্যাটারাল লিডে (I, aVL) T ওয়েভ ইনভার্সন।', status: 'critical' }
    ],
    realWorldClinicalPearl: {
      en: 'CRITICAL BEDSIDE WARNING: Never administer Nitroglycerin (GTN) or Morphine in suspected Inferior STEMI before checking a right-sided ECG (V4R). RV infarction is strictly preload dependent; nitrates cause catastrophic precipitous hypotension! Resuscitate with IV normal saline boluses.',
      bn: 'চেম্বারে/ওয়ার্ডে লাইফ-সেভিং সতর্কতা: ইনফেরিয়র STEMI দেখা মাত্র ডান পাশের লিড (Lead V4R) না নিয়ে ভুলেও নাইট্রেট (GTN spray/tablet) বা মরফিন দেবেন না! ডান ভেন্ট্রিকল রক্ত পাম্প করতে প্রিলোডের ওপর নির্ভরশীল—নাইট্রেট দিলে রক্তচাপ শূন্যের কোঠায় নেমে কার্ডিওজেনিক শক হতে পারে। রক্তচাপ কমে গেলে দ্রুত শিরাপথে নরমাল স্যালাইন ফ্লুইড বোলাস দিন।'
    }
  },
  {
    id: 'extensive-anterior-stemi',
    category: 'ischemia_infarction',
    difficulty: 'Intermediate',
    urgency: 'Cath Lab Activation (Code STEMI)',
    title: {
      en: 'Extensive Anterior STEMI ("Tombstoning" Proximal LAD Occlusion)',
      bn: 'অ্যান্টেরিয়র ওয়াল STEMI (প্রক্সিমাল LAD অক্লুশন - "টুম্বস্টোন" প্যাটার্ন)'
    },
    territory: 'Anterior (V3-V4)',
    culpritArtery: 'Proximal LAD',
    simulatorParams: {
      heartRate: 98,
      rhythm: 'sinus_tachycardia',
      prIntervalMs: 155,
      qrsDurationMs: 98,
      qtIntervalMs: 420,
      qrsAxisDeg: 15,
      leadModifiers: {
        'V1': { stElevationMm: 3.5, tWave: 'hyperacute' },
        'V2': { stElevationMm: 6.5, tWave: 'hyperacute' },
        'V3': { stElevationMm: 7.0, tWave: 'hyperacute' },
        'V4': { stElevationMm: 5.5, tWave: 'hyperacute' },
        'V5': { stElevationMm: 3.0, tWave: 'hyperacute' },
        'I': { stElevationMm: 2.0 },
        'aVL': { stElevationMm: 2.5 },
        'III': { stElevationMm: -2.5, tWave: 'inverted' },
        'aVF': { stElevationMm: -2.0, tWave: 'inverted' }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard 25 mm/s, 10 mm/mV verified.', bn: 'স্ট্যান্ডার্ড ২৫ মিমি/সে এবং ১০ মিমি/এমভি ভেরিফাইড।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '98 BPM (Borderline Sinus Tachycardia driven by sympathetic surge).', bn: '৯৮ বিপিএম (অতিরিক্ত অ্যাড্রেনালিন ক্ষরণের কারণে সাইনাস ট্যাকিকার্ডিয়া)।', status: 'abnormal' },
      { step: 3, param: 'Rhythm', en: 'Sinus rhythm.', bn: 'সাইনাস রিদম।', status: 'normal' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal frontal axis (+15°).', bn: 'স্বাভাবিক ফ্রন্টাল অ্যাক্সিস (+১৫°)।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Normal sinus morphology.', bn: 'স্বাভাবিক P ওয়েভ।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: '155 ms (Normal).', bn: '১৫৫ মিলি-সেকেন্ড (স্বাভাবিক)।', status: 'normal' },
      { step: 7, param: 'QRS Complex', en: 'Loss of anterior R waves (poor R-wave progression in V1-V4).', bn: 'V1 থেকে V4 এ R-ওয়েভ হারিয়ে যাচ্ছে (Poor R progression)।', status: 'critical' },
      { step: 8, param: 'ST-Segment', en: 'MASSIVE: Marked convex "tombstone" ST-elevation in V1-V5 (peaking up to 7 mm in V3) with reciprocal ST-depression in III and aVF.', bn: 'মারাত্মক: V1 থেকে V5 লিডে বিশালাকার উত্তল (Convex Tombstone) ST-elevation (V3 তে ৭ মিমি পর্যন্ত), সাথে III ও aVF এ রেসিপ্রোকাল ডিপ্রেশন।', status: 'critical' },
      { step: 9, param: 'T-Wave & QTc', en: 'Hyperacute giant positive T waves merging directly with the elevated ST segment.', bn: 'বিশাল হাইপারএকিউট T ওয়েভ যা ST সেগমেন্টের সাথে সরাসরি মিশে গেছে।', status: 'critical' }
    ],
    realWorldClinicalPearl: {
      en: 'Tombstoning ST elevation indicates massive transmural myocardial necrosis from acute proximal LAD occlusion ("the widowmaker"). High risk of sudden cardiogenic shock, acute pulmonary edema, and malignant ventricular arrhythmias (VT/VF). Activate primary PCI immediately!',
      bn: 'কবরফলকের মতো (Tombstone) ST-elevation দেখা মানে হৃদপিণ্ডের মূল রক্তনালী Proximal LAD ("The Widowmaker") সম্পূর্ণ বন্ধ হয়ে গেছে। যেকোনো মুহূর্তে কার্ডিওজেনিক শক বা ভেন্ট্রিকুলার ফিব্রিলেশন (VF) হতে পারে। রোগীকে কালবিলম্ব না করে ক্যাথ ল্যাবে (Primary PCI) স্থানান্তর করতে হবে।'
    }
  },
  {
    id: 'atrial-fibrillation-rvr',
    category: 'arrhythmia',
    difficulty: 'Intermediate',
    urgency: 'Urgent Review',
    title: {
      en: 'Atrial Fibrillation with Rapid Ventricular Response (AF with RVR)',
      bn: 'অ্যাট্রিয়াল ফিব্রিলেশন উইথ র‍্যাপিড ভেন্ট্রিকুলার রেসপন্স (AF with RVR)'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 148,
      rhythm: 'atrial_fibrillation',
      prIntervalMs: 0,
      qrsDurationMs: 82,
      qtIntervalMs: 310,
      qrsAxisDeg: 30,
      leadModifiers: {
        'V1': { tWave: 'flattened' }
      },
      baselineWander: 0.1,
      acInterference50Hz: 0.05,
      muscleTremor: 0.15,
      filterActive: false,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'স্বাভাবিক ক্যালিব্রেশন।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '148 BPM (Tachycardic, > 100 BPM qualifies as Rapid Ventricular Response).', bn: '১৪৮ বিপিএম (হার্ট রেট ১০০-এর উপরে থাকায় এটি Rapid Ventricular Response)।', status: 'critical' },
      { step: 3, param: 'Rhythm', en: 'IRREGULARLY IRREGULAR: Completely chaotic R-R intervals with no predictable pattern.', bn: 'সম্পূর্ণ অনিয়মিত (Irregularly Irregular): দুটি বিটের মাঝের দূরত্ব কখনোই সমান নয়।', status: 'critical' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal (+30°).', bn: 'স্বাভাবিক অ্যাক্সিস (+৩০°)।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'ABSENT: Distinct P waves are entirely replaced by chaotic baseline fibrillatory (f) waves (350-600/min).', bn: 'অনুপস্থিত: কোনো স্পষ্ট P-wave নেই; এর বদলে বেইজলাইনে এলোমেলো ফিব্রিলেটরি (f) ওয়েভ দেখা যাচ্ছে।', status: 'critical' },
      { step: 6, param: 'PR Interval', en: 'Unmeasurable due to absence of P waves.', bn: 'P-wave না থাকায় PR ব্যবধান পরিমাপযোগ্য নয়।', status: 'critical' },
      { step: 7, param: 'QRS Complex', en: 'Narrow complex (82 ms) indicating normal His-Purkinje conduction.', bn: 'QRS কমপ্লেক্স স্বাভাবিক ও সরু (৮২ ms)।', status: 'normal' },
      { step: 8, param: 'ST-Segment', en: 'Rate-related non-specific repolarization changes.', bn: 'উচ্চ গতির কারণে সাধারণ রিপোলারাইজেশন পরিবর্তন।', status: 'normal' },
      { step: 9, param: 'T-Wave & QTc', en: 'Variable due to changing cycle lengths.', bn: 'সাইকেল দৈর্ঘ্য পরিবর্তনের কারণে পরিবর্তনশীল।', status: 'normal' },
    ],
    realWorldClinicalPearl: {
      en: 'In unstable AF with RVR (hypotension, altered mental status, acute chest pain, acute heart failure), perform urgent synchronized cardioversion. In stable patients, control rate first (Beta-blockers or Diltiazem) and calculate CHA₂DS₂-VASc score for stroke anticoagulation prevention.',
      bn: 'জরুরি ক্লিনিক্যাল গাইডলাইন: রোগী আনস্টেবল হলে (রক্তচাপ কম, শ্বাসকষ্ট বা বুকে ব্যথা) অবিলম্বে সিনক্রোনাইজড কার্ডিওভার্সন (Synchronized Cardioversion) দিন। রোগী স্টেবল থাকলে রেট কন্ট্রোল ওষুধ (Beta-blocker/Diltiazem) দিতে হবে এবং ব্রেন স্ট্রোক প্রতিরোধের জন্য CHA₂DS₂-VASc স্কোর দেখে রক্ত পাতলা করার অ্যান্টিকোয়াগুল্যান্ট শুরু করতে হবে।'
    }
  },
  {
    id: 'monomorphic-vt',
    category: 'ventricular',
    difficulty: 'Advanced',
    urgency: 'Immediate Defibrillation/Resuscitation',
    title: {
      en: 'Sustained Monomorphic Ventricular Tachycardia (VT)',
      bn: 'মনোমর্ফিক ভেন্ট্রিকুলার ট্যাকিকার্ডিয়া (Monomorphic VT)'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 185,
      rhythm: 'monomorphic_vt',
      prIntervalMs: 0,
      qrsDurationMs: 180,
      qtIntervalMs: 380,
      qrsAxisDeg: -120,
      leadModifiers: {
        'V1': { bizarreMorphology: true },
        'V6': { bizarreMorphology: true }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'ক্যালিব্রেশন ঠিক আছে।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '185 BPM (Severe ventricular tachycardia).', bn: '১৮৫ বিপিএম (তীব্র ভেন্ট্রিকুলার ট্যাকিকার্ডিয়া)।', status: 'critical' },
      { step: 3, param: 'Rhythm', en: 'Regular, wide-complex tachycardia originating below the bundle of His.', bn: 'নিয়মিত, ওয়াইড কমপ্লেক্স ট্যাকিকার্ডিয়া।', status: 'critical' },
      { step: 4, param: 'Cardiac Axis', en: 'Extreme axis deviation / "Northwest" axis (-120°). Strongly diagnostic of VT over SVT.', bn: 'এক্সট্রিম অ্যাক্সিস ("নর্থ-ওয়েস্ট" অ্যাক্সিস -১২০°), যা VT-র নিশ্চিত প্রমাণ।', status: 'critical' },
      { step: 5, param: 'P-Wave', en: 'AV Dissociation: Independent atrial capture occurs at slower rate, intermittently hidden within QRS.', bn: 'AV ডিসোসিয়েশন: অ্যাট্রিয়াম ও ভেন্ট্রিকল আলাদাভাবে স্পন্দিত হচ্ছে।', status: 'critical' },
      { step: 6, param: 'PR Interval', en: 'Not applicable due to AV dissociation.', bn: 'প্রযোজ্য নয়।', status: 'abnormal' },
      { step: 7, param: 'QRS Complex', en: 'MARKEDLY WIDE (180 ms > 140 ms). Concordance across precordial leads (all positive or all negative).', bn: 'মারাত্মক চওড়া QRS (১৮০ ms > ১৪০ ms)। প্রিকর্ডিয়াল লিডগুলোতে ইউনিফর্ম কনকর্ডেন্স রয়েছে।', status: 'critical' },
      { step: 8, param: 'ST-Segment', en: 'Secondary repolarization abnormalities discordant with QRS vector.', bn: 'QRS এর বিপরীতমুখী সেকেন্ডারি ST সেগমেন্ট পরিবর্তন।', status: 'abnormal' },
      { step: 9, param: 'T-Wave & QTc', en: 'Inverted secondary T-waves.', bn: 'ইনভার্টেড সেকেন্ডারি T ওয়েভ।', status: 'abnormal' },
    ],
    realWorldClinicalPearl: {
      en: 'RULE OF THUMB: Any regular wide-complex tachycardia (QRS > 120 ms) in an adult is Ventricular Tachycardia until proven otherwise (accounts for 80% of cases). Never give Verapamil or Adenosine blindly if VT is suspected, as calcium channel blockers will precipitate fatal hemodynamic collapse.',
      bn: 'গোল্ডেন ক্লিনিক্যাল রুল: যেকোনো বড় মানুষের ক্ষেত্রে ওয়াইড-কমপ্লেক্স ট্যাকিকার্ডিয়া (QRS > ১২০ ms) দেখা গেলে নিশ্চিত হওয়ার আগ পর্যন্ত তাকে ভেন্ট্রিকুলার ট্যাকিকার্ডিয়া (VT) হিসেবে গণ্য করতে হবে। কখনোই ভুল করে ভেরাপামিল (Verapamil) ইনজেকশন দেবেন না, দিলে রোগী তৎক্ষণাৎ মৃত্যুর মুখে পড়বে।'
    }
  },
  {
    id: 'complete-heart-block-3rd-deg',
    category: 'blocks',
    difficulty: 'Advanced',
    urgency: 'Urgent Review',
    title: {
      en: '3rd-Degree (Complete) AV Block with Ventricular Escape Rhythm',
      bn: 'থার্ড ডিগ্রি (কমপ্লিট) হার্ট ব্লক উইথ এস্কেপ রিদম'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'RCA / Septal LAD',
    simulatorParams: {
      heartRate: 36,
      rhythm: 'av_block_3rd_degree',
      prIntervalMs: 340,
      qrsDurationMs: 140,
      qtIntervalMs: 520,
      qrsAxisDeg: 10,
      leadModifiers: {
        'V1': { qrsVoltageMult: 1.2 }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard 25 mm/s, 10 mm/mV verified.', bn: 'স্ট্যান্ডার্ড ক্যালিব্রেশন সঠিক।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: 'Ventricular rate = 36 BPM (Severe Bradycardia); independent Atrial rate = 78 BPM.', bn: 'ভেন্ট্রিকুলার রেট ৩৬ বিপিএম (মারাত্মক ব্রাডিকার্ডিয়া); অ্যাট্রিয়াল রেট ৭৮ বিপিএম।', status: 'critical' },
      { step: 3, param: 'Rhythm', en: 'COMPLETE AV DISSOCIATION: P-P intervals are strictly constant and regular; R-R intervals are strictly constant and regular, but there is zero correlation between P waves and QRS complexes.', bn: 'সম্পূর্ণ AV বিচ্ছিন্নতা: P-P ইন্টারভ্যাল নিয়মিত এবং R-R ইন্টারভ্যালও নিয়মিত, কিন্তু P এবং QRS-এর মধ্যে কোনো সম্পর্ক নেই।', status: 'critical' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal frontal axis (+10°).', bn: 'স্বাভাবিক ফ্রন্টাল অ্যাক্সিস।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Regular sinus P waves marching independently across the strip, frequently superimposed on QRS complexes or burying inside T-waves.', bn: 'স্বাভাবিক P-ওয়েভ পুরো স্ট্রিপে স্বাধীনভাবে মার্চ করছে, মাঝে মাঝে QRS বা T ওয়েভের ভেতরে লুকিয়ে থাকে।', status: 'critical' },
      { step: 6, param: 'PR Interval', en: 'Totally variable and random on every beat.', bn: 'সম্পূর্ণ অনির্ধারিত ও পরিবর্তনশীল।', status: 'critical' },
      { step: 7, param: 'QRS Complex', en: 'Broad (140 ms) consistent with an idioventricular escape pacemaker focus below the AV node.', bn: 'প্রশস্ত QRS (১৪০ ms), যা ভেন্ট্রিকুলার এস্কেপ ফোকাস নির্দেশ করে।', status: 'abnormal' },
      { step: 8, param: 'ST-Segment', en: 'Secondary repolarization ST-T discordance.', bn: 'সেকেন্ডারি রিপোলারাইজেশন পরিবর্তন।', status: 'normal' },
      { step: 9, param: 'T-Wave & QTc', en: 'Prolonged QTc due to bradycardia (520 ms). Risk of secondary Torsades de Pointes.', bn: 'মারাত্মক ব্রাডিকার্ডিয়ার কারণে QTc লম্বা (৫২০ ms)।', status: 'abnormal' }
    ],
    realWorldClinicalPearl: {
      en: 'Use digital marching calipers! In 3rd-degree heart block, students often miss P-waves because they land on top of the T-wave. Measure one clean P-P interval and march across: you will spot the buried P-waves distorting the T-wave contour. Immediate temporary transcutaneous pacing indicated.',
      bn: 'ডিজিটাল ক্যালিপার ব্যবহারের সেরা উদাহরণ: কমপ্লিট হার্ট ব্লকে অনেক ছাত্র P-ওয়েভ খুঁজে পায় না কারণ তা T-ওয়েভের ঘাড়ে চেপে থাকে। ক্যালিপার দিয়ে একটি P-P ব্যবধান মেপে সামনে এগোলে দেখা যাবে লুকানো P-ওয়েভগুলো T-ওয়েভের ওপর খাঁজ তৈরি করেছে। রোগীকে অবিলম্বে পেসমেকার (Temporary/Permanent Pacemaker) দিতে হবে।'
    }
  },
  {
    id: 'hyperkalemia-severe',
    category: 'electrolytes_drugs_pacer',
    difficulty: 'Intermediate',
    urgency: 'Cath Lab Activation (Code STEMI)',
    title: {
      en: 'Severe Hyperkalemia (K+ > 7.5 mEq/L) - Peaked T Waves to Sine Wave Risk',
      bn: 'সিভিয়ার হাইপারক্যালেমিয়া (পটাশিয়াম K+ > ৭.৫ mEq/L) - সুচালো T ওয়েভ'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 50,
      rhythm: 'hyperkalemia',
      prIntervalMs: 260,
      qrsDurationMs: 155,
      qtIntervalMs: 360,
      qrsAxisDeg: -30,
      leadModifiers: {
        'II': { tWave: 'peaked' },
        'III': { tWave: 'peaked' },
        'aVF': { tWave: 'peaked' },
        'V2': { tWave: 'peaked', qrsVoltageMult: 1.1 },
        'V3': { tWave: 'peaked', qrsVoltageMult: 1.2 },
        'V4': { tWave: 'peaked', qrsVoltageMult: 1.2 },
        'V5': { tWave: 'peaked' }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'স্ট্যান্ডার্ড ক্যালিব্রেশন।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '50 BPM (Sinus Bradycardia / nodal slowing from severe hyperkalemia).', bn: '৫০ বিপিএম (পটাশিয়াম বৃদ্ধির কারণে হার্ট স্লো হয়ে গেছে)।', status: 'abnormal' },
      { step: 3, param: 'Rhythm', en: 'Progressive junctional/sinoventricular rhythm as atrial myocytes become inexcitable.', bn: 'সাইনাস নোড ও অ্যাট্রিয়াম অবশ হয়ে সাইনোভেন্ট্রিকুলার রিদম তৈরি হচ্ছে।', status: 'critical' },
      { step: 4, param: 'Cardiac Axis', en: 'Left axis shift (-30°).', bn: 'বামমুখী অ্যাক্সিস শিফট।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Flattened, low amplitude or nearly vanished (atrial paralysis characteristic of severe hyperkalemia).', bn: 'P-ওয়েভ প্রায় বিলুপ্ত বা চ্যাপ্টা হয়ে গেছে (অ্যাট্রিয়াল প্যারালাইসিস)।', status: 'critical' },
      { step: 6, param: 'PR Interval', en: 'Prolonged (260 ms) before disappearing entirely.', bn: 'PR ইন্টারভ্যাল ২৬০ ms পর্যন্ত লম্বা হয়ে গেছে।', status: 'critical' },
      { step: 7, param: 'QRS Complex', en: 'Markedly widened (155 ms), slurred, merging directly with the T wave toward a lethal sine-wave pattern.', bn: 'QRS অত্যন্ত চওড়া (১৫৫ ms), যা T ওয়েভের সাথে মিশে সাইন ওয়েভ (Sine wave) হওয়ার পথে।', status: 'critical' },
      { step: 8, param: 'ST-Segment', en: 'Effaced into the giant steep T-wave slope.', bn: 'ST সেগমেন্ট সরাসরি T ওয়েভের খাঁজের সাথে মিশে গেছে।', status: 'abnormal' },
      { step: 9, param: 'T-Wave & QTc', en: 'CLASSIC TALL, TENT-LIKE, SYMMETRICAL PEAKED T-WAVES with narrow base ("Eiffel Tower" sign) in precordial leads V2-V5.', bn: 'চিরায়ত লক্ষণ: আইফেল টাওয়ারের মতো সুচালো, খাড়া ও প্রতিসম T ওয়েভ (Tent-like Peaked T wave)।', status: 'critical' }
    ],
    realWorldClinicalPearl: {
      en: 'MEDICAL EMERGENCY: When you see peaked T-waves with widened QRS, administer IV Calcium Gluconate (10 ml of 10% over 2-3 mins) IMMEDIATELY to stabilize the cardiac myocyte membrane. Calcium does NOT lower potassium; follow immediately with 10 units Regular Insulin + 50ml 50% Dextrose, and Salbutamol nebulization.',
      bn: 'জরুরি জীবনরক্ষাকারী চিকিৎসা: ইসিজিতে ওয়াইড QRS সহ Peaked T-wave দেখলে এক সেকেন্ডও দেরি না করে সবার আগে শিরাপথে ক্যালসিয়াম গ্লুকোনেট (IV Calcium Gluconate 10% 10ml) দিন, যা হার্টের পেশির সেল মেমব্রেন স্ট্যাবিলাইজ করে কার্ডিয়াক অ্যারেস্ট ঠেকায়। এরপর পটাশিয়াম কমাতে ইনসুলিন + গ্লুকোজ (Insulin-Dextrose infusion) এবং সালবুটামল নেবুলাইজেশন দিন।'
    }
  },
  {
    id: 'acute-pulmonary-embolism',
    category: 'channelopathy_pulmonary',
    difficulty: 'Intermediate',
    urgency: 'Urgent Review',
    title: {
      en: 'Acute Massive Pulmonary Embolism (S1Q3T3 & RV Strain Pattern)',
      bn: 'একিউট পালমোনারি এমবোলিজম (S1Q3T3 এবং রাইট ভেন্ট্রিকুলার স্ট্রেন)'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 118,
      rhythm: 'sinus_tachycardia',
      prIntervalMs: 140,
      qrsDurationMs: 96,
      qtIntervalMs: 340,
      qrsAxisDeg: 105,
      leadModifiers: {
        'I': { qWaveMm: 0, stElevationMm: 0 },
        'III': { qWaveMm: -2.2, tWave: 'inverted' },
        'V1': { tWave: 'inverted', stElevationMm: 0.5 },
        'V2': { tWave: 'inverted' },
        'V3': { tWave: 'inverted' }
      },
      baselineWander: 0.08,
      acInterference50Hz: 0.0,
      muscleTremor: 0.05,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'ক্যালিব্রেশন স্বাভাবিক।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '118 BPM: Sinus Tachycardia is the SINGLE MOST COMMON ECG finding in pulmonary embolism (> 40% of cases).', bn: '১১৮ বিপিএম: পালমোনারি এমবোলিজমের সবচেয়ে কমন ইসিজি লক্ষণ হলো সাইনাস ট্যাকিকার্ডিয়া।', status: 'abnormal' },
      { step: 3, param: 'Rhythm', en: 'Sinus Tachycardia.', bn: 'সাইনাস ট্যাকিকার্ডিয়া।', status: 'abnormal' },
      { step: 4, param: 'Cardiac Axis', en: 'Right Axis Deviation (+105°) reflecting acute right ventricular pressure overload.', bn: 'রাইট অ্যাক্সিস ডেভিয়েশন (+১০৫°), যা ডান ভেন্ট্রিকলের তীব্র চাপ নির্দেশ করে।', status: 'abnormal' },
      { step: 5, param: 'P-Wave', en: 'Prominent P waves in lead II (P-pulmonale from acute RA strain).', bn: 'লিড II-এ উঁচু P-pulmonale ওয়েভ।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: '140 ms (Normal).', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 7, param: 'QRS Complex', en: 'McGinn-White S1Q3T3 Pattern: Deep S wave in Lead I (> 1.5 mm), pathological Q wave in Lead III, with T-wave inversion in Lead III.', bn: 'ঐতিহাসিক S1Q3T3 প্যাটার্ন: Lead I-এ গভীর S-wave, Lead III-তে প্যাথলজিক্যাল Q-wave এবং Lead III-তে উল্টো T-wave।', status: 'critical' },
      { step: 8, param: 'ST-Segment', en: 'T-wave inversion with ST depression in anterior precordial leads V1-V3 (Right Ventricular Strain Pattern).', bn: 'V1 থেকে V3 লিডে T-wave ইনভার্সন (Right Ventricular Strain প্যাটার্ন)।', status: 'critical' },
      { step: 9, param: 'T-Wave & QTc', en: 'Symmetric T inversion in V1-V3 and III.', bn: 'V1-V3 এবং Lead III-তে উল্টো T ওয়েভ।', status: 'critical' }
    ],
    realWorldClinicalPearl: {
      en: 'While textbooks fixate on the "S1Q3T3" sign, remember that S1Q3T3 is present in only 15-20% of PE cases (high specificity, poor sensitivity). The most sensitive sign is Sinus Tachycardia! T-wave inversion simultaneously in both Inferior (III, aVF) and Anterior (V1-V4) leads is virtually pathognomonic for massive PE over anterior STEMI.',
      bn: 'পরীক্ষার জন্য গুরুত্বপূর্ণ টিপস: বইয়ের পাতায় S1Q3T3 খুব বিখ্যাত হলেও বাস্তবে মাত্র ১৫-২০% ক্ষেত্রে এটি পাওয়া যায়। পালমোনারি এমবোলিজমে সবচেয়ে বেশি দেখা যায় ব্যাখ্যাতীত সাইনাস ট্যাকিকার্ডিয়া। একসাথে ইনফেরিয়র লিড (III, aVF) এবং প্রিকর্ডিয়াল লিডে (V1-V4) উল্টো T ওয়েভ থাকা ম্যাসিভ পালমোনারি এমবোলিজমের শক্তিশালী লক্ষণ।'
    }
  },
  {
    id: 'wolff-parkinson-white-wpw',
    category: 'blocks',
    difficulty: 'Intermediate',
    urgency: 'Urgent Review',
    title: {
      en: 'Wolff-Parkinson-White (WPW) Syndrome - Delta Wave Pre-excitation',
      bn: 'উলফ-পারকিনসন-হোয়াইট (WPW) সিন্ড্রোম - ডেল্টা ওয়েভ'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 72,
      rhythm: 'wpw_preexcitation',
      prIntervalMs: 95,
      qrsDurationMs: 135,
      qtIntervalMs: 400,
      qrsAxisDeg: 60,
      leadModifiers: {
        'I': { deltaWave: true },
        'II': { deltaWave: true },
        'V4': { deltaWave: true },
        'V5': { deltaWave: true },
        'V6': { deltaWave: true }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'স্ট্যান্ডার্ড ক্যালিব্রেশন।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '72 BPM.', bn: '৭২ বিপিএম।', status: 'normal' },
      { step: 3, param: 'Rhythm', en: 'Sinus rhythm with ventricular pre-excitation via accessory pathway (Bundle of Kent).', bn: 'অ্যাক্সেসরি পাথওয়ে (Bundle of Kent) দিয়ে দ্রুত ভেন্ট্রিকল উত্তেজিত হচ্ছে।', status: 'abnormal' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal (+60°).', bn: 'স্বাভাবিক অ্যাক্সিস।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Normal sinus morphology.', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: 'SHORT PR INTERVAL: 95 ms (< 120 ms). The electrical impulse bypasses the physiological delay of the AV node.', bn: 'খাটো PR ইন্টারভ্যাল: ৯৫ ms (১২০ ms এর নিচে), কারণ কারেন্ট AV নোডের স্বাভাবিক বিলম্ব ছাড়াই বাইপাস করছে।', status: 'critical' },
      { step: 7, param: 'QRS Complex', en: 'WIDENED QRS (135 ms > 120 ms) with characteristic DELTA WAVE: a slurred, sluggish initial upstroke of the QRS complex.', bn: 'চওড়া QRS (১৩৫ ms) এবং সুস্পষ্ট DELTA WAVE: QRS এর গোড়ায় একটি ঢালু উপবৃত্তাকার দাগ।', status: 'critical' },
      { step: 8, param: 'ST-Segment', en: 'Secondary ST-T discordant changes due to abnormal ventricular depolarization.', bn: 'অস্বাভাবিক ভেন্ট্রিকুলার সঞ্চালনের কারণে সেকেন্ডারি ST পরিবর্তন।', status: 'normal' },
      { step: 9, param: 'T-Wave & QTc', en: 'Discordant to delta wave polarity.', bn: 'ডেল্টা ওয়েভের বিপরীতমুখী।', status: 'normal' }
    ],
    realWorldClinicalPearl: {
      en: 'FATAL PHARMACOLOGY TRAP: In patients with WPW who develop Atrial Fibrillation, AV-nodal blocking agents (Adenosine, Digoxin, Beta-blockers, Calcium channel blockers) are ABSOLUTELY CONTRAINDICATED! Blocking the AV node shunts all rapid atrial fibrillation impulses down the accessory pathway at 300+ bpm, degenerating into fatal Ventricular Fibrillation. Treat with IV Procainamide or emergent cardioversion.',
      bn: 'মারাত্মক ড্রাগ সতর্কতা: কোনো WPW রোগীর যদি অ্যাট্রিয়াল ফিব্রিলেশন (AF with WPW) হয়, তবে ভুলেও AV নোড ব্লক করার ওষুধ (Adenosine, Digoxin, Beta-blocker, Diltiazem) দেওয়া যাবে না! AV নোড বন্ধ করে দিলে সব ৩৫০+ কারেন্ট অ্যাক্সেসরি পাথওয়ে দিয়ে সরাসরি ভেন্ট্রিকলে গিয়ে সাথে সাথে ভেন্ট্রিকুলার ফিব্রিলেশন ও মৃত্যু ঘটাবে। এ ক্ষেত্রে প্রোকেনামাইড (Procainamide) দিতে হয় বা শক (Cardioversion) দিতে হয়।'
    }
  },
  {
    id: 'brugada-syndrome-type-1',
    category: 'channelopathy_pulmonary',
    difficulty: 'Advanced',
    urgency: 'Cath Lab Activation (Code STEMI)',
    title: {
      en: 'Brugada Syndrome (Type 1 "Coved" ST-Elevation Pattern)',
      bn: 'ব্রুগাডা সিন্ড্রোম (টাইপ ১ "কভড" ST-এলিমেশন প্যাটার্ন)'
    },
    territory: 'Septal (V1-V2)',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 68,
      rhythm: 'brugada_type1',
      prIntervalMs: 170,
      qrsDurationMs: 110,
      qtIntervalMs: 410,
      qrsAxisDeg: 40,
      leadModifiers: {
        'V1': { stElevationMm: 3.5, tWave: 'inverted' },
        'V2': { stElevationMm: 2.8, tWave: 'inverted' }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'স্বাভাবিক ক্যালিব্রেশন।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '68 BPM.', bn: '৬৮ বিপিএম।', status: 'normal' },
      { step: 3, param: 'Rhythm', en: 'Sinus rhythm.', bn: 'সাইনাস রিদম।', status: 'normal' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal (+40°).', bn: 'স্বাভাবিক অ্যাক্সিস।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Normal.', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: '170 ms (Normal).', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 7, param: 'QRS Complex', en: 'Pseudo-RBBB appearance with wide Terminal wave in V1.', bn: 'V1 লিডে সিউডো-RBBB প্যাটার্ন।', status: 'abnormal' },
      { step: 8, param: 'ST-Segment', en: 'PATHOGNOMONIC: Marked "coved" ST-elevation >= 2 mm followed by a negative T-wave in right precordial leads V1-V2. Concave downsloping appearance.', bn: 'বিশেষ লক্ষণ: ডান পাশের লিড V1 ও V2-তে ২ মিমি-র বেশি উত্তল খিলানযুক্ত (Coved) ST-elevation এবং সাথে সাথে নেগেটিভ T-wave।', status: 'critical' },
      { step: 9, param: 'T-Wave & QTc', en: 'Symmetrically inverted T waves in V1-V2.', bn: 'V1 ও V2-তে উল্টো T ওয়েভ।', status: 'critical' }
    ],
    realWorldClinicalPearl: {
      en: 'Brugada syndrome is an inherited sodium-channelopathy (SCN5A mutation) that causes sudden cardiac death in young, healthy individuals during rest or sleep (SUNDS). The pattern is often unmasked by high fevers or sodium-channel blockers. Definitive therapy for high-risk patients is an Implantable Cardioverter-Defibrillator (ICD).',
      bn: 'ব্রুগাডা সিন্ড্রোম একটি জেনেটিক চ্যানেল প্যাথলজি (SCN5A মিউটেশন), যা আপাতদৃষ্টিতে তরুণ ও সুস্থ মানুষের ঘুমে বা বিশ্রামের সময় হঠাৎ মৃত্যু (Sudden Cardiac Death) ঘটায়। উচ্চ জ্বর বা নির্দিষ্ট কিছু ওষুধ এই রোগটিকে উন্মোচিত করে। উচ্চ ঝুঁকিপূর্ণ রোগীর একমাত্র কার্যকর জীবনরক্ষাকারী চিকিৎসা হলো পেটে আইসিডি (ICD - Implantable Cardioverter-Defibrillator) স্থাপন করা।'
    }
  },
  {
    id: 'acute-pericarditis-stage-1',
    category: 'channelopathy_pulmonary',
    difficulty: 'Intermediate',
    urgency: 'Urgent Review',
    title: {
      en: 'Acute Pericarditis (Stage 1 Diffuse Saddleback ST Elevation & PR Depression)',
      bn: 'একিউট পেরিকার্ডাইটিস (স্টেজ ১ ডিফিউজ ST-এলিমেশন এবং PR ডিপ্রেশন)'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 88,
      rhythm: 'normal_sinus',
      prIntervalMs: 150,
      qrsDurationMs: 82,
      qtIntervalMs: 380,
      qrsAxisDeg: 45,
      leadModifiers: {
        'I': { stElevationMm: 1.8 },
        'II': { stElevationMm: 2.2 },
        'III': { stElevationMm: 1.2 },
        'aVL': { stElevationMm: 1.5 },
        'aVF': { stElevationMm: 2.0 },
        'V2': { stElevationMm: 2.5 },
        'V3': { stElevationMm: 3.0 },
        'V4': { stElevationMm: 2.8 },
        'V5': { stElevationMm: 2.2 },
        'V6': { stElevationMm: 1.8 },
        'aVR': { stElevationMm: -1.5 }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'ক্যালিব্রেশন স্বাভাবিক।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '88 BPM.', bn: '৮৮ বিপিএম।', status: 'normal' },
      { step: 3, param: 'Rhythm', en: 'Sinus rhythm.', bn: 'সাইনাস রিদম।', status: 'normal' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal (+45°).', bn: 'স্বাভাবিক অ্যাক্সিস।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Normal.', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: 'PR DEPRESSION: Widespread downsloping PR-segment depression in limb and precordial leads, with reciprocal PR-segment elevation in lead aVR.', bn: 'PR ডিপ্রেশন: প্রায় সব লিডে PR-সেগমেন্ট নিচে নেমে গেছে এবং একমাত্র lead aVR-এ PR সেগমেন্ট উপরে উঠেছে।', status: 'critical' },
      { step: 7, param: 'QRS Complex', en: 'Normal narrow QRS. No pathological Q-waves.', bn: 'স্বাভাবিক QRS। কোনো প্যাথলজিক্যাল Q-wave নেই।', status: 'normal' },
      { step: 8, param: 'ST-Segment', en: 'DIFFUSE CONCAVE "SADDLEBACK" ST-ELEVATION: Present across both limb (I, II, aVL, aVF) and precordial (V2-V6) leads without anatomical coronary territory restriction and NO reciprocal ST-depression (except aVR).', bn: 'বিস্তৃত অবতল (Concave Saddleback) ST-elevation: নির্দিষ্ট কোনো রক্তনালীর সীমানা না মেনে প্রায় সব লিডে ছড়িয়ে আছে, এবং aVR ছাড়া কোথাও কোনো রেসিপ্রোকাল ডিপ্রেশন নেই।', status: 'critical' },
      { step: 9, param: 'T-Wave & QTc', en: 'Upright T-waves concordant with ST elevation.', bn: 'ST সেগমেন্টের সাথে সোজা T-wave।', status: 'normal' }
    ],
    realWorldClinicalPearl: {
      en: 'PERICARDITIS VS STEMI: How to tell them apart at 3 AM? Pericarditis causes diffuse concave ST elevation in almost ALL leads, whereas STEMI is strictly localized to a vascular territory (e.g., II, III, aVF) and almost always shows reciprocal ST depression (e.g., in aVL). Furthermore, PR depression in lead II with PR elevation in aVR is highly specific for pericarditis!',
      bn: 'রাত ৩টায় কীভাবে পেরিকার্ডাইটিস ও হার্ট অ্যাটাক (STEMI) আলাদা করবেন? পেরিকার্ডাইটিসে প্রায় সব লিডে ছড়িয়ে অবতল (স্যাডলব্যাক) ST বাড়ে এবং aVR ছাড়া কোথাও রেসিপ্রোকাল ডিপ্রেশন থাকে না। অন্যদিকে STEMI তে রক্তনালী অনুযায়ী নির্দিষ্ট লিডে বাড়ে এবং বিপরীত লিডে রেসিপ্রোকাল ডিপ্রেশন আবশ্যক। সাথে Lead aVR-এ PR সেগমেন্ট উপরে ওঠা পেরিকার্ডাইটিসের ক্লাসিক প্রমাণ।'
    }
  },
  {
    id: 'ventricular-fibrillation-coarse',
    category: 'ventricular',
    difficulty: 'Advanced',
    urgency: 'Immediate Defibrillation/Resuscitation',
    title: {
      en: 'Ventricular Fibrillation (Coarse VF) - Cardiac Arrest',
      bn: 'ভেন্ট্রিকুলার ফিব্রিলেশন (VF) - কার্ডিয়াক অ্যারেস্ট'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 300,
      rhythm: 'ventricular_fibrillation',
      prIntervalMs: 0,
      qrsDurationMs: 220,
      qtIntervalMs: 0,
      qrsAxisDeg: 0,
      leadModifiers: {},
      baselineWander: 0.1,
      acInterference50Hz: 0.0,
      muscleTremor: 0.15,
      filterActive: false,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Chaotic waveform. Ensure leads are connected.', bn: 'এলোমেলো ওয়েভফর্ম। লিড সংযোগ নিশ্চিত করুন।', status: 'critical' },
      { step: 2, param: 'Heart Rate', en: 'Indeterminate / ~300-500 irregular fibrillatory deflections/min.', bn: 'পরিমাপযোগ্য নয় (৩০০-৫০০ এলোমেলো ডিফ্লেকশন)।', status: 'critical' },
      { step: 3, param: 'Rhythm', en: 'CHAOTIC & LETHAL: Complete absence of organized electrical depolarization.', bn: 'প্রাণঘাতী বিশৃঙ্খলা: সুশৃঙ্খল কোনো স্পন্দন নেই।', status: 'critical' },
      { step: 4, param: 'Cardiac Axis', en: 'Indeterminate.', bn: 'অনির্ধারিত।', status: 'critical' },
      { step: 5, param: 'P-Wave', en: 'Absent.', bn: 'অনুপস্থিত।', status: 'critical' },
      { step: 6, param: 'PR Interval', en: 'Absent.', bn: 'অনুপস্থিত।', status: 'critical' },
      { step: 7, param: 'QRS Complex', en: 'Completely unidentifiable; replaced by coarse, irregular undulating waves > 3 mm amplitude.', bn: 'চিহ্নিত করা অসম্ভব; মোটা এলোমেলো ঢেউ দিয়ে প্রতিস্থাপিত।', status: 'critical' },
      { step: 8, param: 'ST-Segment', en: 'Absent.', bn: 'অনুপস্থিত।', status: 'critical' },
      { step: 9, param: 'T-Wave & QTc', en: 'Absent.', bn: 'অনুপস্থিত।', status: 'critical' }
    ],
    realWorldClinicalPearl: {
      en: 'CODE BLUE PROTOCOL: The patient is pulseless and in full cardiac arrest! Start immediate high-quality CPR (100-120 compressions/min, 2 inches deep) and perform IMMEDIATE UNSYNCHRONIZED DEFIBRILLATION (200J Biphasic). Do NOT search for pulse before first shock. Every minute of delay decreases survival by 7-10%!',
      bn: 'কোড ব্লু প্রটোকল: রোগীর কোনো পালস নেই এবং তিনি ক্লিনিক্যালি মৃত! অবিলম্বে উচ্চমানের সি-পি-আর (CPR) শুরু করুন এবং অবিলম্বে শক দিন (Unsynchronized Defibrillation 200 Joules)। শকের আগে পালস খুঁজতে সময় নষ্ট করবেন না। প্রতি মিনিটে বেঁচে থাকার সম্ভাবনা ৭-১০% কমে যায়!'
    }
  },
  {
    id: 'wellens-syndrome-type-a',
    category: 'ischemia_infarction',
    difficulty: 'Advanced',
    urgency: 'Cath Lab Activation (Code STEMI)',
    title: {
      en: "Wellens' Syndrome (Type A Biphasic T-Waves in V2-V3)",
      bn: 'ওয়েলেন্স সিন্ড্রোম (টাইপ A বাইফ্যাসিক T ওয়েভ - ক্রিটিক্যাল LAD স্টেনোসিস)'
    },
    territory: 'Anterior (V3-V4)',
    culpritArtery: 'LAD',
    simulatorParams: {
      heartRate: 72,
      rhythm: 'normal_sinus',
      prIntervalMs: 155,
      qrsDurationMs: 86,
      qtIntervalMs: 410,
      qrsAxisDeg: 35,
      leadModifiers: {
        'V2': { tWave: 'biphasic', stElevationMm: 0.5 },
        'V3': { tWave: 'biphasic', stElevationMm: 0.5 },
        'V4': { tWave: 'biphasic' }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard 25 mm/s, 10 mm/mV verified.', bn: 'স্বাভাবিক ক্যালিব্রেশন।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '72 BPM.', bn: '৭২ বিপিএম।', status: 'normal' },
      { step: 3, param: 'Rhythm', en: 'Normal Sinus Rhythm.', bn: 'নরমাল সাইনাস রিদম।', status: 'normal' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal (+35°).', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Normal.', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: '155 ms.', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 7, param: 'QRS Complex', en: 'Normal R wave progression, preservation of precordial R waves. No pathological Q waves.', bn: 'স্বাভাবিক R ওয়েভ প্রগ্রেশন। কোনো প্যাথলজিক্যাল Q ওয়েভ নেই।', status: 'normal' },
      { step: 8, param: 'ST-Segment', en: 'Isoelectric or minimally elevated (< 1 mm) concave ST segment in V2-V3.', bn: 'আইসো-ইলেকট্রিক বা সামান্য (< ১ মিমি) ST সেগমেন্ট।', status: 'normal' },
      { step: 9, param: 'T-Wave & QTc', en: 'CLASSIC WELLENS BIPHASIC T-WAVES: Characteristic biphasic (initially positive, then deeply negative) T waves in V2 and V3 (Type A pattern, 25% of cases).', bn: 'ওয়েলেন্স ক্লাসিক বাইফ্যাসিক T-wave: V2 ও V3 লিডে প্রথমে উপরে উঠে পরে গভীরে নেমে যাওয়া T ওয়েভ।', status: 'critical' }
    ],
    realWorldClinicalPearl: {
      en: "LETHAL TRAP: Wellens' syndrome ECG appears when the patient is PAIN-FREE after an episode of unstable angina. Cardiac enzymes (Troponin) are usually NORMAL or only slightly elevated! DO NOT perform an Exercise Stress Test (ETT)—it will trigger a massive anterior wall fatal myocardial infarction. Send straight to cath lab!",
      bn: 'মারাত্মক ফাঁদ: ওয়েলেন্স সিন্ড্রোমের এই ইসিজিটি তখনই পাওয়া যায় যখন বুকে ব্যথা কমে রোগী আরাম অনুভব করে! এমনকি রক্তে ট্রপোনিন টেস্টও অনেক সময় নরমাল থাকে। ভুলেও এই রোগীকে এক্সারসাইজ স্ট্রেস টেস্ট (ETT) দেবেন না—দিলে টেবিল ওপরই বিশাল হার্ট অ্যাটাক হয়ে রোগী মারা যেতে পারে। সরাসরি এনজিওগ্রাম ও রিং পরানোর জন্য পাঠান।'
    }
  },
  {
    id: 'complete-lbbb',
    category: 'blocks',
    difficulty: 'Intermediate',
    urgency: 'Urgent Review',
    title: {
      en: 'Complete Left Bundle Branch Block (LBBB)',
      bn: 'কমপ্লিট লেফট বান্ডল ব্রাঞ্চ ব্লক (LBBB)'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'LAD / Circumflex',
    simulatorParams: {
      heartRate: 70,
      rhythm: 'normal_sinus',
      prIntervalMs: 170,
      qrsDurationMs: 150,
      qtIntervalMs: 440,
      qrsAxisDeg: -20,
      leadModifiers: {
        'I': { qrsVoltageMult: 1.3 },
        'aVL': { qrsVoltageMult: 1.3 },
        'V5': { qrsVoltageMult: 1.4 },
        'V6': { qrsVoltageMult: 1.4 },
        'V1': { stElevationMm: 1.5, qWaveMm: -2.0 },
        'V2': { stElevationMm: 1.5, qWaveMm: -2.5 }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'ক্যালিব্রেশন ঠিক আছে।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '70 BPM.', bn: '৭০ বিপিএম।', status: 'normal' },
      { step: 3, param: 'Rhythm', en: 'Sinus rhythm.', bn: 'সাইনাস রিদম।', status: 'normal' },
      { step: 4, param: 'Cardiac Axis', en: 'Left axis deviation (-20°).', bn: 'লেফট অ্যাক্সিস ডেভিয়েশন।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Normal.', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: '170 ms (Normal).', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 7, param: 'QRS Complex', en: 'WIDE QRS (150 ms >= 120 ms). Broad, notched or slurred "M-shaped" R waves in lateral leads (I, aVL, V5, V6) with absence of Q-waves. Deep, broad QS/rS complexes in V1-V3 ("William" mnemonic).', bn: 'প্রশস্ত QRS (১৫০ ms > ১২০ ms)। ল্যাটারাল লিডগুলোতে (I, aVL, V5, V6) চওড়া ও খাঁজকাটা "M" আকৃতির R-wave, এবং V1-V3 তে গভীর "W" আকৃতির QS কমপ্লেক্স ("WiLLiaM" নেমোনিক)।', status: 'critical' },
      { step: 8, param: 'ST-Segment', en: 'Appropriate T-wave discordance: ST-segment and T-wave are deflected in the opposite direction of the main QRS vector.', bn: 'স্বাভাবিক ডিসকর্ডেন্স: QRS যেদিকে যায় তার উল্টো দিকে ST ও T ওয়েভ ঘুরে থাকে।', status: 'abnormal' },
      { step: 9, param: 'T-Wave & QTc', en: 'Discordant secondary T-wave inversion in I, aVL, V5-V6.', bn: 'ল্যাটারাল লিডে সেকেন্ডারি T-wave ইনভার্সন।', status: 'abnormal' }
    ],
    realWorldClinicalPearl: {
      en: 'NEW LBBB = STEMI EQUIVALENT: A newly diagnosed or presumed-new LBBB in the setting of acute ischemic chest pain is considered a STEMI equivalent under ACC/AHA guidelines! To detect acute STEMI hidden behind an existing LBBB, use the Sgarbossa or Modified Sgarbossa Criteria (concordant ST elevation >= 1 mm is 98% specific for occlusion).',
      bn: 'নতুন LBBB মানেই হার্ট অ্যাটাক: কোনো রোগীর বুকে ব্যথার সাথে নতুন LBBB দেখা দিলে আন্তর্জাতিক নিয়মে একে STEMI সমতুল্য ধরে দ্রুত ক্যাথল্যাবে পাঠাতে হবে। পুরনো LBBB এর ভেতরে হার্ট অ্যাটাক লুকানো আছে কিনা তা বের করতে Sgarbossa ক্রাইটেরিয়া ব্যবহার করুন।'
    }
  },
  {
    id: 'atrial-flutter-2-1',
    category: 'arrhythmia',
    difficulty: 'Intermediate',
    urgency: 'Urgent Review',
    title: {
      en: 'Typical Atrial Flutter with 2:1 Conduction Block',
      bn: 'টিপিক্যাল অ্যাট্রিয়াল ফ্ল্যাটার (২:১ কন্ডাকশন ব্লক - করাত-দাঁত প্যাটার্ন)'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 150,
      rhythm: 'atrial_flutter',
      prIntervalMs: 0,
      qrsDurationMs: 84,
      qtIntervalMs: 290,
      qrsAxisDeg: 45,
      leadModifiers: {
        'II': { tWave: 'inverted' },
        'III': { tWave: 'inverted' },
        'aVF': { tWave: 'inverted' }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard 25 mm/s, 10 mm/mV verified.', bn: 'স্ট্যান্ডার্ড ক্যালিব্রেশন সঠিক।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '150 BPM Ventricular Rate (Atrial rate = 300 BPM). Note: A regular narrow-complex tachycardia at exactly 150 BPM is Atrial Flutter 2:1 until proven otherwise!', bn: '১৫০ বিপিএম ভেন্ট্রিকুলার রেট (অ্যাট্রিয়াল রেট ৩০০ বিপিএম)। মনে রাখবেন: ঠিক ১৫০ বিপিএম রেটের রেগুলার ট্যাকিকার্ডিয়া পেলে সবার আগে ২:১ অ্যাট্রিয়াল ফ্ল্যাটার সন্দেহ করবেন!', status: 'critical' },
      { step: 3, param: 'Rhythm', en: 'Regular 2:1 AV nodal block (every 2nd flutter wave conducts to the ventricles).', bn: 'নিয়মিত ২:১ AV ব্লক (প্রতি ২টি ফ্ল্যাটার তরঙ্গের ১টি ভেন্ট্রিকলে সঞ্চালিত হয়)।', status: 'abnormal' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal (+45°).', bn: 'স্বাভাবিক অ্যাক্সিস।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'CLASSIC SAWTOOTH "F" WAVES: Negative continuous sawtooth deflections in inferior leads (II, III, aVF) with no isoelectric baseline.', bn: 'করাত-দাঁতের মতো ফ্ল্যাটার (F) ওয়েভ: ইনফেরিয়র লিডগুলোতে (II, III, aVF) নিরবচ্ছিন্ন করাতের দাঁতের মতো খাঁজকাটা ঢেউ।', status: 'critical' },
      { step: 6, param: 'PR Interval', en: 'Unmeasurable due to continuous flutter waves.', bn: 'পরিমাপযোগ্য নয়।', status: 'abnormal' },
      { step: 7, param: 'QRS Complex', en: 'Narrow QRS (84 ms) indicating normal His-Purkinje ventricular activation.', bn: 'স্বাভাবিক ও সরু QRS (৮৪ ms)।', status: 'normal' },
      { step: 8, param: 'ST-Segment', en: 'Distorted by ongoing flutter waves.', bn: 'ফ্ল্যাটার ওয়েভ দ্বারা পরিবর্তিত।', status: 'normal' },
      { step: 9, param: 'T-Wave & QTc', en: 'Superimposed on flutter waves.', bn: 'ফ্ল্যাটার তরঙ্গের সাথে মিশ্রিত।', status: 'normal' }
    ],
    realWorldClinicalPearl: {
      en: 'CALIPER TRICK: In 2:1 flutter, one flutter wave is clearly visible midway between R-waves, while the second flutter wave is BURIED inside the QRS-T complex! March your digital calipers at 200 ms (300 bpm) across the strip to reveal the hidden flutter waves. Vagal maneuvers or IV Adenosine will transiently slow AV conduction and unmask the underlying sawtooth waves!',
      bn: 'ডিজিটাল ক্যালিপার কৌশল: ২:১ ফ্ল্যাটারে একটি ফ্ল্যাটার ঢেউ দুটি R-ওয়েভের ঠিক মাঝখানে দেখা যায় এবং দ্বিতীয় ঢেউটি QRS অথবা T-ওয়েভের নিচে লুকিয়ে থাকে! ক্যালিপার দিয়ে ২০০ ms ব্যবধানে মার্চ করলেই লুকানো ঢেউটি ধরা পড়বে। ক্যারোটিড ম্যাসাজ বা অ্যাডিনোসিন দিলে AV নোড সাময়িক ধীর হয়ে সম্পূর্ণ করাত-দাঁত প্যাটার্নটি স্পষ্ট হয়ে ওঠে।'
    }
  },
  {
    id: 'complete-rbbb',
    category: 'blocks',
    difficulty: 'Intermediate',
    urgency: 'Routine',
    title: {
      en: 'Complete Right Bundle Branch Block (RBBB)',
      bn: 'কমপ্লিট রাইট বান্ডল ব্রাঞ্চ ব্লক (RBBB - "খরগোশের কান" প্যাটার্ন)'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'LAD / Septal',
    simulatorParams: {
      heartRate: 74,
      rhythm: 'rbbb_complete',
      prIntervalMs: 165,
      qrsDurationMs: 145,
      qtIntervalMs: 420,
      qrsAxisDeg: 85,
      leadModifiers: {
        'V1': { bizarreMorphology: true, tWave: 'inverted' },
        'V2': { bizarreMorphology: true, tWave: 'inverted' },
        'I': { qWaveMm: 0, tWave: 'normal' },
        'V6': { qWaveMm: 0, tWave: 'normal' }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'ক্যালিব্রেশন ঠিক আছে।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '74 BPM.', bn: '৭৪ বিপিএম।', status: 'normal' },
      { step: 3, param: 'Rhythm', en: 'Normal Sinus Rhythm.', bn: 'নরমাল সাইনাস রিদম।', status: 'normal' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal to rightward axis (+85°).', bn: 'স্বাভাবিক থেকে ডানমুখী অ্যাক্সিস।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Normal.', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: '165 ms (Normal).', bn: '১৬৫ ms (স্বাভাবিক)।', status: 'normal' },
      { step: 7, param: 'QRS Complex', en: 'PROLONGED QRS (145 ms >= 120 ms). Classic rsR\' ("rabbit ears" / "M-pattern") in right precordial leads V1-V2. Wide, slurred, blunt S-wave in lateral leads (I, aVL, V5, V6) ("Marrow" mnemonic).', bn: 'চওড়া QRS (১৪৫ ms > ১২০ ms)। ডান পাশের লিড V1-V2-তে ক্লাসিক "খরগোশের কানের মতো" rsR\' প্যাটার্ন এবং ল্যাটারাল লিডে (I, aVL, V6) চওড়া ভোঁতা S-wave ("MaRRoW" নেমোনিক)।', status: 'critical' },
      { step: 8, param: 'ST-Segment', en: 'ST depression with T-wave inversion in V1-V2 (secondary repolarization changes).', bn: 'V1-V2 লিডে সেকেন্ডারি ST ডিপ্রেশন ও T ওয়েভ ইনভার্সন।', status: 'abnormal' },
      { step: 9, param: 'T-Wave & QTc', en: 'Discordant inverted T-waves in V1-V2.', bn: 'V1-V2 তে সেকেন্ডারি নেগেটিভ T-wave।', status: 'abnormal' }
    ],
    realWorldClinicalPearl: {
      en: 'RBBB VS LBBB ST-ELEVATION: Unlike LBBB (which obscures ST segments and mimics STEMI), RBBB does NOT obscure acute STEMI! If you see ST-elevation in an ECG with RBBB, it is a TRUE STEMI and you can activate the cath lab with full confidence. New RBBB with chest pain and tachycardia strongly suggests acute massive pulmonary embolism or proximal LAD occlusion.',
      bn: 'ক্লিনিক্যাল রুল: LBBB থাকলে হার্ট অ্যাটাকের দাগ ঢাকা পড়ে গেলেও RBBB-তে হার্ট অ্যাটাক কখনোই ঢাকা পড়ে না! RBBB থাকা অবস্থায় ST-elevation দেখলে ১০০% নিশ্চিত থাকুন এটি জেনুইন হার্ট অ্যাটাক (STEMI)। হঠাৎ বুকে ব্যথা ও শ্বাসকষ্টের সাথে নতুন RBBB দেখা দিলে পালমোনারি এমবোলিজম সন্দেহ করুন।'
    }
  },
  {
    id: 'left-main-coronary-occlusion',
    category: 'ischemia_infarction',
    difficulty: 'Fellowship',
    urgency: 'Cath Lab Activation (Code STEMI)',
    title: {
      en: 'Acute Left Main Coronary Artery (LMCA) Occlusion / Severe Triple-Vessel Disease',
      bn: 'একিউট লেফট মেইন করোনাই আর্টারি (LMCA) অক্লুশন (Lead aVR-এ মারাত্মক ST-এলিমেশন)'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'LMCA',
    simulatorParams: {
      heartRate: 110,
      rhythm: 'sinus_tachycardia',
      prIntervalMs: 160,
      qrsDurationMs: 96,
      qtIntervalMs: 380,
      qrsAxisDeg: -15,
      leadModifiers: {
        'aVR': { stElevationMm: 3.5, tWave: 'hyperacute' },
        'V1': { stElevationMm: 1.5 },
        'I': { stElevationMm: -2.5, tWave: 'inverted' },
        'II': { stElevationMm: -3.0, tWave: 'inverted' },
        'V3': { stElevationMm: -3.5, tWave: 'inverted' },
        'V4': { stElevationMm: -4.5, tWave: 'inverted' },
        'V5': { stElevationMm: -4.0, tWave: 'inverted' },
        'V6': { stElevationMm: -3.0, tWave: 'inverted' }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.05,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard 25 mm/s, 10 mm/mV verified.', bn: 'স্ট্যান্ডার্ড ক্যালিব্রেশন সঠিক।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '110 BPM (Sinus Tachycardia secondary to cardiogenic stress).', bn: '১১০ বিপিএম (তীব্র চাপের কারণে সাইনাস ট্যাকিকার্ডিয়া)।', status: 'abnormal' },
      { step: 3, param: 'Rhythm', en: 'Sinus Tachycardia.', bn: 'সাইনাস ট্যাকিকার্ডিয়া।', status: 'abnormal' },
      { step: 4, param: 'Cardiac Axis', en: 'Leftward (-15°).', bn: 'লেফটওয়ার্ড অ্যাক্সিস।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Normal.', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: '160 ms.', bn: '১৬০ ms (স্বাভাবিক)।', status: 'normal' },
      { step: 7, param: 'QRS Complex', en: 'Narrow with marked baseline depression shifts.', bn: 'সরু QRS কমপ্লেক্স।', status: 'normal' },
      { step: 8, param: 'ST-Segment', en: 'CRITICAL LMCA PATTERN: Marked ST-segment elevation in lead aVR >= 1.5 mm (often > V1) WITH widespread, profound horizontal/downsloping ST-depression across >= 6-8 leads (I, II, V3-V6).', bn: 'মারাত্মক LMCA প্যাটার্ন: Lead aVR-এ ১.৫ মিমি-র বেশি বিপজ্জনক ST-elevation এবং সাথে প্রায় ৬ থেকে ৮টি লিডে (I, II, V3-V6) গভীর ST-ডিপ্রেশন।', status: 'critical' },
      { step: 9, param: 'T-Wave & QTc', en: 'Hyperacute T in aVR; inverted T waves in precordials.', bn: 'aVR-এ খাড়া T ওয়েভ এবং অন্যান্য লিডে উল্টো T ওয়েভ।', status: 'critical' }
    ],
    realWorldClinicalPearl: {
      en: 'HIGHEST MORTALITY ECG IN MEDICINE: Lead aVR is typically ignored as the "garbage lead", but in acute coronary syndromes, ST elevation in aVR >= 1 mm with elevation in aVR > V1 predicts Acute Left Main Coronary Occlusion or severe 3-vessel disease with 70%+ hemodynamic collapse risk! Call the cath lab interventionalist IMMEDIATELY. Mortality without emergent PCI/CABG approaches 50%.',
      bn: 'চিকিৎসাবিজ্ঞানের সবচেয়ে প্রাণঘাতী ইসিজি: সাধারণত সবাই Lead aVR অবহেলা করে, কিন্তু তীব্র বুকে ব্যথায় aVR-এ ১ মিলিমিটারের বেশি ST-elevation এবং সাথে একাধিক লিডে ST-depression থাকা মানে হার্টের মূল রক্তনালী Left Main (LMCA) সম্পূর্ণ বন্ধ হয়ে গেছে! জরুরি এনজিওগ্রাম বা বাইপাস সার্জারি (CABG) ছাড়া মৃত্যুর ঝুঁকি ৫০% এর বেশি। সাথে সাথে ক্যাথ ল্যাব অ্যালার্ট দিন।'
    }
  },
  {
    id: 'left-ventricular-hypertrophy',
    category: 'hypertrophy',
    difficulty: 'Intermediate',
    urgency: 'Routine',
    title: {
      en: 'Left Ventricular Hypertrophy (LVH) with Lateral Repolarization Strain',
      bn: 'লেফট ভেন্ট্রিকুলার হাইপারট্রফি (LVH উইথ ল্যাটারাল স্ট্রেন প্যাটার্ন)'
    },
    territory: 'Lateral (I, aVL, V5-V6)',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 68,
      rhythm: 'normal_sinus',
      prIntervalMs: 175,
      qrsDurationMs: 104,
      qtIntervalMs: 430,
      qrsAxisDeg: -10,
      leadModifiers: {
        'V1': { qWaveMm: -2.4, qrsVoltageMult: 1.5, stElevationMm: 1.0 },
        'V2': { qWaveMm: -2.8, qrsVoltageMult: 1.6, stElevationMm: 1.0 },
        'V5': { qrsVoltageMult: 1.8, stElevationMm: -2.2, tWave: 'inverted' },
        'V6': { qrsVoltageMult: 1.7, stElevationMm: -2.0, tWave: 'inverted' },
        'I': { stElevationMm: -1.5, tWave: 'inverted', qrsVoltageMult: 1.3 },
        'aVL': { stElevationMm: -1.8, tWave: 'inverted', qrsVoltageMult: 1.4 }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed. Ensure voltage calibration is 10 mm/mV (not half standard).', bn: 'ক্যালিব্রেশন ১০ মিমি/এমভি নিশ্চিত করুন।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '68 BPM.', bn: '৬৮ বিপিএম।', status: 'normal' },
      { step: 3, param: 'Rhythm', en: 'Sinus rhythm.', bn: 'সাইনাস রিদম।', status: 'normal' },
      { step: 4, param: 'Cardiac Axis', en: 'Mild left axis deviation (-10°).', bn: 'সামান্য বামমুখী অ্যাক্সিস।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Prominent terminal negative component in V1 (Left Atrial Abnormality from chronic hypertension).', bn: 'V1 এ বাম অ্যাট্রিয়াম বড় হওয়ার লক্ষণ।', status: 'abnormal' },
      { step: 6, param: 'PR Interval', en: '175 ms.', bn: '১৭৫ ms।', status: 'normal' },
      { step: 7, param: 'QRS Complex', en: 'MASSIVE VOLTAGE: Sokolow-Lyon Criteria fulfilled: S-wave in V1 (24 mm) + R-wave in V5 (28 mm) = 52 mm (> 35 mm!). Cornell criteria also positive (R in aVL > 11 mm).', bn: 'বিশাল ভোল্টেজ: Sokolow-Lyon ক্রাইটেরিয়া পজিটিভ: V1 এর S-wave (২৪ মিমি) + V5 এর R-wave (২৮ মিমি) = ৫২ মিমি (যা ৩৫ মিমি এর অনেক বেশি!)।', status: 'critical' },
      { step: 8, param: 'ST-Segment', en: 'LV STRAIN PATTERN: Asymmetrical downsloping ST-segment depression in lateral leads (I, aVL, V5, V6). Concave upward ST elevation in V1-V2.', bn: 'LV স্ট্রেন প্যাটার্ন: ল্যাটারাল লিডে (I, aVL, V5, V6) অপ্রতিসম নিচের দিকে নামা ST-ডিপ্রেশন এবং V1-V2 তে সামান্য অবতল ST-elevation।', status: 'critical' },
      { step: 9, param: 'T-Wave & QTc', en: 'Asymmetric deep T-wave inversion with rapid return to baseline in lateral leads.', bn: 'ল্যাটারাল লিডগুলোতে অপ্রতিসম উল্টো T ওয়েভ।', status: 'critical' }
    ],
    realWorldClinicalPearl: {
      en: 'DO NOT CONFUSE WITH STEMI: In LVH, precordial leads V1-V2 frequently display 1-3 mm of ST-elevation with deep S-waves. Interns frequently misdiagnose this as an Anterior STEMI! Look at the lateral leads (V5, V6, aVL): in LVH you will see the classic asymmetrical "strain" depression. In true STEMI, ST elevation is convex ("tombstone") and accompanied by reciprocal changes.',
      bn: 'হার্ট অ্যাটাকের সাথে ভুল করবেন না: LVH থাকলে গভীর S-তরঙ্গের কারণে ডান পাশের V1-V2 লিডে স্বাভাবিকভাবেই ১-৩ মিমি ST-elevation থাকতে পারে। অনভিজ্ঞ ডাক্তাররা এটিকে প্রায়ই অ্যান্টেরিয়র STEMI ভেবে ভুল করেন! নিশ্চিত হতে V5 ও V6 খেয়াল করুন—LVH-এ সেখানে অপ্রতিসম ঢালু স্ট্রেন প্যাটার্ন থাকে। প্রকৃত হার্ট অ্যাটাকে ST উত্তল (কবরফলকের মতো) হয়।'
    }
  },
  {
    id: 'severe-hypokalemia',
    category: 'electrolytes_drugs_pacer',
    difficulty: 'Intermediate',
    urgency: 'Urgent Review',
    title: {
      en: 'Severe Hypokalemia (Serum K+ < 2.5 mEq/L) - Prominent U-Waves',
      bn: 'সিভিয়ার হাইপোক্যালেমিয়া (পটাশিয়াম K+ < ২.৫ mEq/L) - প্রমিনেন্ট U-ওয়েভ'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 78,
      rhythm: 'hypokalemia_u_wave',
      prIntervalMs: 195,
      qrsDurationMs: 92,
      qtIntervalMs: 510,
      qrsAxisDeg: 40,
      leadModifiers: {
        'V2': { tWave: 'flattened', stElevationMm: -1.0 },
        'V3': { tWave: 'flattened', stElevationMm: -1.2 },
        'V4': { tWave: 'flattened', stElevationMm: -1.0 },
        'II': { tWave: 'flattened', stElevationMm: -0.8 }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'ক্যালিব্রেশন ঠিক আছে।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '78 BPM.', bn: '৭৮ বিপিএম।', status: 'normal' },
      { step: 3, param: 'Rhythm', en: 'Sinus rhythm.', bn: 'সাইনাস রিদম।', status: 'normal' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal (+40°).', bn: 'স্বাভাবিক অ্যাক্সিস।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Prominent P-waves (P-wave amplitude often increases in hypokalemia).', bn: 'P-ওয়েভের উচ্চতা কিছুটা বেশি।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: '195 ms (upper limit of normal).', bn: '১৯৫ ms।', status: 'normal' },
      { step: 7, param: 'QRS Complex', en: 'Mild widening and terminal slurring.', bn: 'স্বাভাবিক QRS।', status: 'normal' },
      { step: 8, param: 'ST-Segment', en: 'Mild sagging ST-segment depression in precordial leads (V2-V5).', bn: 'প্রিকর্ডিয়াল লিডে হালকা ঝুলে পড়া ST-ডিপ্রেশন।', status: 'abnormal' },
      { step: 9, param: 'T-Wave & QTc', en: 'PROMINENT U-WAVES & FLATTENED T-WAVES: Progressive flattening of T-waves and development of prominent positive U-waves (often U > T amplitude) in V2-V4. Apparent QU prolongation (510 ms).', bn: 'প্রমিনেন্ট U-ওয়েভ এবং চ্যাপ্টা T-ওয়েভ: T-ওয়েভ প্রায় সোজা হয়ে গেছে এবং তার পেছনে বড় U-ওয়েভ তৈরি হয়েছে। আপাতদৃষ্টিতে লং-QT (QU ব্যবধান) মনে হয়।', status: 'critical' }
    ],
    realWorldClinicalPearl: {
      en: 'TORSADES DE POINTES TRIGGER: Hypokalemia causes apparent QT prolongation because the prominent U-wave fuses with the end of the flattened T-wave (creating a long QU interval). This delayed repolarization leaves the heart vulnerable to early afterdepolarizations (EADs) triggering fatal Torsades de Pointes! Replace potassium with IV KCl infusion in saline (NEVER push IV potassium bolus—it is lethal). Co-administer IV Magnesium.',
      bn: 'প্রাণঘাতী সতর্কবার্তা: হাইপোক্যালেমিয়ায় T-ওয়েভ চ্যাপ্টা হয়ে U-ওয়েভের সাথে মিশে যাওয়ায় মনে হয় QT অনেক বড় হয়ে গেছে। এই দীর্ঘ রিপোলারাইজেশন যেকোনো সময় Torsades de Pointes নামক প্রাণঘাতী অ্যারিথমিয়া ডেকে আনে! রোগীকে দ্রুত শিরাপথে পটাশিয়াম (IV KCl infusion) এবং ম্যাগনেসিয়াম দিতে হবে। মনে রাখবেন: ভুলেও পটাশিয়াম পুশ ইনজেকশন দেবেন না, দিলে রোগী সাথে সাথে মারা যাবে।'
    }
  },
  {
    id: 'digoxin-effect',
    category: 'electrolytes_drugs_pacer',
    difficulty: 'Intermediate',
    urgency: 'Urgent Review',
    title: {
      en: 'Digoxin Effect ("Salvador Dalí Mustache" Scooped ST Depression)',
      bn: 'ডিগক্সিন ইফেক্ট ("সালভাদর দালি গোঁফ" আকৃতির অবতল ST ডিপ্রেশন)'
    },
    territory: 'Global / Non-coronary',
    culpritArtery: 'N/A',
    simulatorParams: {
      heartRate: 58,
      rhythm: 'normal_sinus',
      prIntervalMs: 210,
      qrsDurationMs: 82,
      qtIntervalMs: 320,
      qrsAxisDeg: 35,
      leadModifiers: {
        'V4': { stElevationMm: -2.0, tWave: 'biphasic' },
        'V5': { stElevationMm: -2.2, tWave: 'biphasic' },
        'V6': { stElevationMm: -1.8, tWave: 'biphasic' },
        'II': { stElevationMm: -1.8, tWave: 'biphasic' },
        'aVF': { stElevationMm: -1.5, tWave: 'biphasic' }
      },
      baselineWander: 0.05,
      acInterference50Hz: 0.0,
      muscleTremor: 0.0,
      filterActive: true,
      leadReversal: 'none'
    },
    diagnosticSteps: [
      { step: 1, param: 'Calibration & Quality', en: 'Standard calibration confirmed.', bn: 'ক্যালিব্রেশন ঠিক আছে।', status: 'normal' },
      { step: 2, param: 'Heart Rate', en: '58 BPM (Mild sinus bradycardia due to increased vagal tone from digitalis).', bn: '৫৮ বিপিএম (ডিগক্সিনের ভেগাল প্রভাবের কারণে মৃদু ব্রাডিকার্ডিয়া)।', status: 'abnormal' },
      { step: 3, param: 'Rhythm', en: 'Sinus rhythm.', bn: 'সাইনাস রিদম।', status: 'normal' },
      { step: 4, param: 'Cardiac Axis', en: 'Normal (+35°).', bn: 'স্বাভাবিক অ্যাক্সিস।', status: 'normal' },
      { step: 5, param: 'P-Wave', en: 'Normal.', bn: 'স্বাভাবিক।', status: 'normal' },
      { step: 6, param: 'PR Interval', en: '210 ms (Mild 1st degree AV block characteristic of digoxin nodal slowing).', bn: '২১০ ms (ডিগক্সিনের নোডাল স্লোয়িংয়ের কারণে হালকা 1st-degree AV block)।', status: 'abnormal' },
      { step: 7, param: 'QRS Complex', en: 'Narrow normal complex.', bn: 'স্বাভাবিক QRS।', status: 'normal' },
      { step: 8, param: 'ST-Segment', en: 'CLASSIC SCOOPED "SALVADOR DALÍ" ST DEPRESSION: Sagging, concave downsloping ST-segment resembling a mustache or hockey-stick in leads with tall R-waves (V4-V6, II, aVF).', bn: 'সালভাদর দালির গোঁফের মতো ঝোলানো অবতল ST-ডিপ্রেশন: হকি স্টিক বা বাঁকানো চামচের মতো নিচের দিকে নেমে যাওয়া ST সেগমেন্ট (V4-V6, II, aVF)।', status: 'critical' },
      { step: 9, param: 'T-Wave & QTc', en: 'Shortened QTc interval (320 ms) with biphasic or flattened T-waves.', bn: 'খাটো QTc ইন্টারভ্যাল (৩২০ ms) এবং বাইফ্যাসিক T-ওয়েভ।', status: 'abnormal' }
    ],
    realWorldClinicalPearl: {
      en: 'DIGOXIN EFFECT VS DIGOXIN TOXICITY: Scooped ST depression indicates therapeutic digoxin presence (Digoxin EFFECT) and does NOT correlate with serum drug levels or toxicity! Digoxin TOXICITY is diagnosed when arrhythmias appear: PVCs/bigeminy (most common), Bidirectional VT (virtually pathognomonic), or Atrial Tachycardia with variable AV block. Treat severe toxicity with Digoxin Immune Fab (DigiFab).',
      bn: 'ডিগক্সিন ইফেক্ট বনাম ডিগক্সিন টক্সিসিটি: চামচের মতো ST ডিপ্রেশন থাকা মানে রোগী ডিগক্সিন ওষুধ খাচ্ছে (এটি সাধারণ ড্রাগ ইফেক্ট, বিষক্রিয়া নয়)। কিন্তু রোগীর যদি এক সাথে ব্রাডিকার্ডিয়া ও একটোপিক বিট (PVC bigeminy) অথবা Bidirectional VT তৈরি হয়, তখন বুঝতে হবে ডিগক্সিন টক্সিসিটি হয়েছে। মারাত্মক বিষক্রিয়ায় ডিগক্সিন অ্যান্টিবডি (DigiFab) দিতে হবে।'
    }
  }
];


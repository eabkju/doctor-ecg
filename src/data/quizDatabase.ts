import { QuizCase } from '../types/ecg';

export const OSCE_QUIZ_CASES: QuizCase[] = [
  {
    id: 'quiz-inferior-stemi',
    title: {
      en: 'Night Shift Code: 56M with Epigastric Burning',
      bn: 'নাইট শিফট কেস: ৫৬ বছর বয়সী পুরুষের বুক ও পেট জ্বালাপোড়া'
    },
    patientInfo: {
      age: 56,
      gender: 'Male',
      history: {
        en: 'A 56-year-old diabetic male presents at 2:00 AM with diaphoresis, nausea, and severe retrosternal aching radiating to the epigastrium. He thought it was "gastric acidity" and took antacids with no relief.',
        bn: 'রাত ২টায় ৫৬ বছর বয়সী একজন ডায়াবেটিক রোগী বুক ও পেটের ওপর অংশে প্রচণ্ড ব্যথা, বমি বমি ভাব এবং মাত্রাতিরিক্ত ঘাম নিয়ে জরুরি বিভাগে এলেন। তিনি ভেবেছিলেন গ্যাসের সমস্যা এবং অ্যান্টাসিড খেয়েছিলেন কিন্তু কোনো কাজ হয়নি।'
      },
      vitals: 'BP: 92/58 mmHg | HR: 52 bpm | SpO2: 95% on room air | Temp: 36.8°C'
    },
    ecgCaseId: 'acute-inferior-stemi-rv',
    question: {
      en: 'What is the immediate primary diagnosis and the most critical contraindicated intervention?',
      bn: 'রোগীর প্রধান ডায়াগনোসিস কী এবং কোন চিকিৎসাটি দেওয়া সম্পূর্ণ নিষিদ্ধ?'
    },
    options: [
      {
        en: 'Acute Anterior STEMI — Contraindicated: Aspirin',
        bn: 'একিউট অ্যান্টেরিয়র STEMI — নিষিদ্ধ: অ্যাসপিরিন'
      },
      {
        en: 'Acute Inferior STEMI with RV involvement — Contraindicated: Nitroglycerin (GTN) & Morphine',
        bn: 'ডান ভেন্ট্রিকল জড়িত একিউট ইনফেরিয়র STEMI — নিষিদ্ধ: নাইট্রোগ্লিসারিন (GTN) ও মরফিন'
      },
      {
        en: 'Acute Pericarditis — Contraindicated: Ibuprofen',
        bn: 'একিউট পেরিকার্ডাইটিস — নিষিদ্ধ: আইবুপ্রোফেন'
      },
      {
        en: 'Peptic Ulcer Perforation — Contraindicated: IV fluids',
        bn: 'পেপটিক আলসার পারফোরেশন — নিষিদ্ধ: শিরাপথে স্যালাইন'
      }
    ],
    correctIndex: 1,
    clinicalExplanation: {
      en: 'ST elevation in leads II, III, and aVF with elevation in III > II confirms Acute Inferior STEMI secondary to Right Coronary Artery (RCA) occlusion. Bradycardia (52 bpm) and borderline low BP (92/58) signify Right Ventricular (RV) involvement. The infarcted RV depends strictly on venous preload to fill; administering nitrates causes sudden venodilation, catastrophic hypotension, and cardiac arrest.',
      bn: 'লিড II, III এবং aVF-এ ST-elevation এবং Lead III > Lead II নির্দেশ করে RCA ব্লক হয়ে ইনফেরিয়র STEMI হয়েছে। সাথে কম প্রেশার ও ব্রাডিকার্ডিয়া ডান ভেন্ট্রিকল আক্রান্ত হওয়ার লক্ষণ। ডান ভেন্ট্রিকল প্রিলোড-নির্ভর—নাইট্রেট দিলে রক্তচাপ মারাত্মকভাবে নেমে গিয়ে হার্ট ফেইলিয়র হতে পারে।'
    },
    pearl: {
      en: 'Always record Lead V4R in inferior STEMI! If RV infarction is present, treat hypotension with rapid IV saline boluses.',
      bn: 'ইনফেরিয়র STEMI পেলেই ডান পাশের Lead V4R নিন। প্রেশার কম থাকলে নরমাল স্যালাইন দিয়ে ভলিউম বাড়াতে হবে।'
    }
  },
  {
    id: 'quiz-hyperkalemia',
    title: {
      en: 'Emergency Call: ESRD Patient with Extreme Weakness',
      bn: 'ইমার্জেন্সি কল: কিডনি ফেইলিয়রের রোগীর মারাত্মক দুর্বলতা'
    },
    patientInfo: {
      age: 62,
      gender: 'Female',
      history: {
        en: 'A 62-year-old female on chronic maintenance hemodialysis missed her last two dialysis sessions due to flooding. She presents with ascending flaccid paralysis, confusion, and palpitations.',
        bn: '৬২ বছর বয়সী এক নারী যিনি নিয়মিত ডায়ালাইসিস নেন, বন্যা ও বৃষ্টির কারণে গত ২টি সেশন মিস করেছেন। তিনি হাত-পা নাড়াতে না পারা এবং বুক ধড়ফড় নিয়ে এসেছেন।'
      },
      vitals: 'BP: 100/60 mmHg | HR: 48 bpm | RR: 22/min | SpO2: 96%'
    },
    ecgCaseId: 'hyperkalemia-severe',
    question: {
      en: 'Which ECG finding carries the highest immediate risk of cardiac arrest, and what is your first drug administered?',
      bn: 'ইসিজির কোন পরিবর্তনটি তাৎক্ষণিক মৃত্যুর ঝুঁকি নির্দেশ করে এবং সবার আগে কোন ওষুধটি দেবেন?'
    },
    options: [
      {
        en: 'Short PR interval — Administer IV Metoprolol',
        bn: 'খাটো PR ইন্টারভ্যাল — শিরাপথে মেটোপ্রোলল'
      },
      {
        en: 'Peaked symmetric T-waves with widened QRS — Administer IV Calcium Gluconate immediately',
        bn: 'সুচালো খাড়া T ওয়েভ এবং চওড়া QRS — অবিলম্বে শিরাপথে ক্যালসিয়াম গ্লুকোনেট দিতে হবে'
      },
      {
        en: 'ST-segment depression — Administer IV Furosemide',
        bn: 'ST ডিপ্রেশন — শিরাপথে ফ্রুসেমাইড'
      },
      {
        en: 'Prominent U waves — Administer IV Potassium Chloride',
        bn: 'প্রমিনেন্ট U ওয়েভ — শিরাপথে পটাশিয়াম ক্লোরাইড'
      }
    ],
    correctIndex: 1,
    clinicalExplanation: {
      en: 'The ECG shows severe hyperkalemia (> 7.5 mEq/L) evidenced by classic tall, tent-like, peaked T-waves, PR prolongation, and QRS widening towards a sine-wave pattern. IV Calcium Gluconate (10% 10 mL over 3 minutes) does not lower serum potassium, but immediately antagonizes potassium membrane excitability and protects against ventricular fibrillation or asystole.',
      bn: 'ইসিজিতে ক্লাসিক সুচালো Tent-like T ওয়েভ এবং ওয়াইড QRS দেখা যাচ্ছে যা মারাত্মক হাইপারক্যালেমিয়ার লক্ষণ। শিরাপথে ১০% ক্যালসিয়াম গ্লুকোনেট দিলে তা হার্টের সেল মেমব্রেন সুরক্ষিত করে কার্ডিয়াক অ্যারেস্ট ঠেকায়।'
    },
    pearl: {
      en: 'Calcium works in 1-3 minutes but its effect lasts only 30-60 minutes. Immediately follow with Insulin-Dextrose and Nebulized Salbutamol.',
      bn: 'ক্যালসিয়াম ১-৩ মিনিটের মধ্যে কাজ শুরু করলেও এর মেয়াদ মাত্র আধা থেকে এক ঘণ্টা। তাই সাথে সাথে ইনসুলিন-গ্লুকোজ দিয়ে পটাশিয়াম ভেতরে ঢোকানোর ব্যবস্থা করতে হবে।'
    }
  },
  {
    id: 'quiz-wpw-syndrome',
    title: {
      en: 'Syncope in a Young Athlete during Match',
      bn: 'খেলার মাঠে তরুণ ফুটবলারের হঠাৎ অজ্ঞান হওয়া'
    },
    patientInfo: {
      age: 21,
      gender: 'Male',
      history: {
        en: 'A 21-year-old collegiate football player collapsed on the pitch during extra time. He experienced a racing heart (heart rate > 200) followed by dizziness and transient syncope.',
        bn: '২১ বছর বয়সী এক কলেজ ফুটবলার ম্যাচের অতিরিক্ত সময়ে হঠাৎ মাথা ঘুরে মাঠে পড়ে যান। তার প্রচণ্ড বুক ধড়ফড় করছিল।'
      },
      vitals: 'BP: 112/74 mmHg | HR: 72 bpm (post-recovery) | RR: 16/min'
    },
    ecgCaseId: 'wolff-parkinson-white-wpw',
    question: {
      en: 'What triad of ECG findings characterizes this condition (WPW syndrome)?',
      bn: 'কোন ৩টি ইসিজি বৈশিষ্ট্যের ত্রয়ী এই রোগটিকে (WPW সিন্ড্রোম) চিহ্নিত করে?'
    },
    options: [
      {
        en: 'Short PR (< 120 ms), Delta wave, and widened QRS (> 120 ms)',
        bn: 'খাটো PR ইন্টারভ্যাল (< ১২০ ms), ডেল্টা ওয়েভ এবং চওড়া QRS (> ১২০ ms)'
      },
      {
        en: 'Long PR (> 200 ms), Q-wave in Lead III, and inverted T-wave',
        bn: 'লম্বা PR (> ২০০ ms), লিড III-তে Q-wave এবং উল্টো T-wave'
      },
      {
        en: 'Regular tachycardia, narrow QRS, and flutter waves',
        bn: 'রেগুলার ট্যাকিকার্ডিয়া, সরু QRS এবং ফ্ল্যাটার ওয়েভ'
      },
      {
        en: 'Coved ST elevation, high takeoff, and saddleback pattern',
        bn: 'কভড ST-elevation এবং স্যাডলব্যাক প্যাটার্ন'
      }
    ],
    correctIndex: 0,
    clinicalExplanation: {
      en: 'Wolff-Parkinson-White syndrome is defined by ventricular pre-excitation through an accessory pathway (Bundle of Kent) bypassing the AV node delay. This produces the classical triad: 1) Short PR interval (< 120 ms), 2) Delta wave (slurred upstroke of QRS), and 3) Prolonged QRS duration (> 120 ms).',
      bn: 'WPW সিন্ড্রোমে অ্যাক্সেসরি বান্ডল অব কেন্ট দিয়ে কারেন্ট দ্রুত চলে যায় বলে ৩টি ক্লাসিক বৈশিষ্ট্য দেখা যায়: খাটো PR ইন্টারভ্যাল (< ১২০ মিলি-সেকেন্ড), QRS-এর গোড়ায় ডেল্টা ওয়েভ এবং চওড়া QRS।'
    },
    pearl: {
      en: 'Definitive cure for symptomatic WPW with arrhythmias is catheter radiofrequency ablation of the accessory pathway (> 95% success rate).',
      bn: 'বারংবার বুক ধড়ফড়ের ইতিহাস থাকলে ক্যাথেটার রেডিওফ্রিকোয়েন্সি অ্যাবলেশন (Radiofrequency Ablation) এর মাধ্যমে স্থায়ীভাবে এই রোগের নিরাময় সম্ভব।'
    }
  }
];

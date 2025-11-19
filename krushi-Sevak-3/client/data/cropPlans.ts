import { addDays, formatISODate, startOfDay } from "../utils/date";

export type PlanTaskType = "fertilizer" | "pest" | "irrigation" | "activity";

export type PlanTask = {
  day: number; // offset from sowing in days
  title: string;
  type: PlanTaskType;
  description: string;
};

export type PlanStage = {
  name: string;
  startDay: number;
  endDay: number;
};

// Translation map for common stage names and task titles/descriptions
const TL: Record<string, { en: string; mr: string; hi: string }> = {
  // Stages
  "Land preparation": { en: "Land preparation", mr: "जमीन तयार", hi: "भूमि तैयारी" },
  "Sowing & germination": { en: "Sowing & germination", mr: "पेरणी व अंकुरण", hi: "बुवाई व अंकुरण" },
  "Tillering/Vegetative": { en: "Tillering/Vegetative", mr: "वाढ/टिलरिंग", hi: "वनस्पतिक/टिलरिंग" },
  "Flowering": { en: "Flowering", mr: "फुलोरा", hi: "फूल आना" },
  "Grain filling": { en: "Grain filling", mr: "दाणा भरणे", hi: "दाना भरना" },
  "Harvest": { en: "Harvest", mr: "कापणी", hi: "कटाई" },
  "Vegetative": { en: "Vegetative", mr: "वाढ", hi: "वनस्पतिक" },
  "Flowering & pod formation": { en: "Flowering & pod formation", mr: "फुलोरा व शेंगा", hi: "फूल व फली विकास" },
  "Pod filling": { en: "Pod filling", mr: "शेंगा भरणे", hi: "फली भरना" },
  "Pit preparation": { en: "Pit preparation", mr: "खड्डे तयार", hi: "गड्ढा तैयारी" },
  "Planting establishment": { en: "Planting establishment", mr: "लागवड स्थापन", hi: "रोपण स्थापन" },
  "Vegetative growth": { en: "Vegetative growth", mr: "वनस्पती वाढ", hi: "वनस्पतिक वृद्धि" },
  "Flowering/fruit set": { en: "Flowering/fruit set", mr: "फुलोरा/फलधारणा", hi: "फूल/फल सेट" },
  "Early harvest": { en: "Early harvest", mr: "लवकर कापणी", hi: "शीघ्र कटाई" },
  "Nursery/land prep": { en: "Nursery/land prep", mr: "रोपवाटिका/जमीन", hi: "नर्सरी/भूमि" },
  "Transplant/sowing & takeoff": { en: "Transplant/sowing & takeoff", mr: "लागवड/पेरणी", hi: "रोपाई/बुवाई" },
  "Flowering/fruiting": { en: "Flowering/fruiting", mr: "फुलोरा/फलधारणा", hi: "फूल/फलन" },
  // Task titles
  "Field prep": { en: "Field prep", mr: "शेतीची तयारी", hi: "खेत की तैयारी" },
  "Basal fertilizer": { en: "Basal fertilizer", mr: "तळ खत", hi: "आधार उर्वरक" },
  "Sowing": { en: "Sowing", mr: "पेरणी", hi: "बुवाई" },
  "1st urea top dress": { en: "1st urea top dress", mr: "पहिली यूरिया टॉप ड्रेस", hi: "पहला यूरिया टॉप ड्रेस" },
  "Weed control": { en: "Weed control", mr: "तण नियंत्रण", hi: "खरपतवार नियंत्रण" },
  "2nd urea top dress": { en: "2nd urea top dress", mr: "दुसरी यूरिया टॉप ड्रेस", hi: "दूसरा यूरिया टॉप ड्रेस" },
  "Pest & disease scout": { en: "Pest & disease scout", mr: "कीड व रोग पाहणी", hi: "कीट/रोग निगरानी" },
  "Pre-harvest check": { en: "Pre-harvest check", mr: "कापणीपूर्व तपास", hi: "कटाई पूर्व जांच" },
  "Harvest & drying": { en: "Harvest & drying", mr: "कापणी व वाळवणी", hi: "कटाई व सुखाना" },
  "Micronutrients": { en: "Micronutrients", mr: "सूक्ष्म पोषक", hi: "सूक्ष्म पोषक" },
  "Pest management": { en: "Pest management", mr: "किड नियंत्रण", hi: "कीट प्रबंधन" },
  "Irrigation stop": { en: "Irrigation stop", mr: "सिंचन थांबवा", hi: "सिंचाई बंद करें" },
  "Thinning & weeding": { en: "Thinning & weeding", mr: "間 अंतर/तण काढणी", hi: "छंटाई व निराई" },
  "Top dress N": { en: "Top dress N", mr: "वर खत N", hi: "टॉप ड्रेस N" },
  "Transplant": { en: "Transplant", mr: "लागवड", hi: "रोपाई" },
  "Training & pruning": { en: "Training & pruning", mr: "प्रशिक्षण व छाटणी", hi: "ट्रेनिंग व प्रूनिंग" },
  "Harvest": { en: "Harvest", mr: "कापणी", hi: "कटाई" },
  "Harvest window begins": { en: "Harvest window begins", mr: "कापणीची सुरुवात", hi: "कटाई शुरू" },
  "Irrigation (if dry)": { en: "Irrigation (if dry)", mr: "सिंचन (कोरडे असल्यास)", hi: "सिंचाई (यदि सूखा)" },
  "Irrigation": { en: "Irrigation", mr: "सिंचन", hi: "सिंचाई" },
  // Descriptions (subset)
  "Primary tillage, remove residues, level field": { en: "Primary tillage, remove residues, level field", mr: "प्राथमिक नांगरटी, अवशेष काढा, समतलीकरण करा", hi: "प्राथमिक जुताई, अवशेष हटाएँ, खेत समतल करें" },
  "Apply NPK 10:26:26 @ 50 kg/acre and FYM 1–2 tons/acre during final harrow": { en: "Apply NPK 10:26:26 @ 50 kg/acre and FYM 1–2 tons/acre during final harrow", mr: "अंतिम हर्रो दरम्यान NPK 10:26:26 @ 50 किग्रा/एकर व शेणखत 1–2 टन/एकर द्या", hi: "अंतिम हैरो में NPK 10:26:26 @ 50 किग्रा/एकड़ और FYM 1–2 टन/एकड़ दें" },
  "Sow with recommended spacing; treat seed with fungicide/insecticide as per label": { en: "Sow with recommended spacing; treat seed with fungicide/insecticide as per label", mr: "शिफारसीय अंतराने पेरणी; बिय���ण्यावर लेबलप्रमाणे औषध प्रक्रिया करा", hi: "सिफारिशित दूरी पर बुवाई; लेबल अनुसार बीज उपचार करें" },
  "Urea @ 30 kg/acre along rows after first irrigation or rain": { en: "Urea @ 30 kg/acre along rows after first irrigation or rain", mr: "पहिल्या सिंचन/पावसानंतर ओळीमध्ये युरिया @ 30 किलो/एकर द्या", hi: "पहली सिंचाई/बारिश के बाद कतारों में यूरिया @ 30 किग्रा/एकड़ दें" },
  "Interculture/hoe; apply pre/post-emergence herbicide if needed": { en: "Interculture/hoe; apply pre/post-emergence herbicide if needed", mr: "आंतरमशागत/खुरपणी; आवश्यक असल्यास तणनाशके वापरा", hi: "अंतरखेती/कुदाई; आवश्यकता पर प्री/पोस्ट हरबिसाइड दें" },
  "Urea @ 20 kg/acre at late vegetative stage": { en: "Urea @ 20 kg/acre at late vegetative stage", mr: "उशीरा वाढीच्या टप्प्यावर युरि���ा @ 20 किलो/एकर", hi: "देर वनस्पतिक चरण पर यूरिया @ 20 किग्रा/एकड़" },
  "Scout for stem borer/leaf blight; spray recommended pesticide only if ETL crossed": { en: "Scout for stem borer/leaf blight; spray recommended pesticide only if ETL crossed", mr: "काडी भेदक/पान करपा तपासा; ETL ओलांडल्यासच फवारणी", hi: "तना छेदक/लीफ ब्लाइट की निगरानी; ETL पार होने पर ही स्प्रे" },
  "Drain excess water, stop irrigation; check grain maturity": { en: "Drain excess water, stop irrigation; check grain maturity", mr: "जादा पाणी काढा, सिंचन थांबवा; दाण्याची परिपक्वता तपासा", hi: "अतिरिक्त पानी निकालें, सिंचाई रोकें; दाने की परिपक्वता जाँचे" },
  "Harvest at physiological maturity and dry grains to safe moisture": { en: "Harvest at physiological maturity and dry grains to safe moisture", mr: "शारीरिक परिपक्वतेला कापणी करा व धान्य ��ुरक्षित आर्द्रतेपर्यंत वाळवा", hi: "फिजियोलॉजिकल परिपक्वता पर कटाई करें और अनाज को सुरक्षित नमी तक सुखाएँ" },
  "DAP 18:46:0 @ 40 kg/acre; Rhizobium inoculation for seed": { en: "DAP 18:46:0 @ 40 kg/acre; Rhizobium inoculation for seed", mr: "DAP 18:46:0 @ 40 किग्रा/एकर; बियाण्यास रायझोबियम लसीकरण", hi: "DAP 18:46:0 @ 40 किग्रा/एकड़; बीज हेतु राइजोबियम टीकाकरण" },
  "Line sowing; seed treatment with Trichoderma/Thiram as per label": { en: "Line sowing; seed treatment with Trichoderma/Thiram as per label", mr: "ओळीत पेरणी; ट्रायकोडर्मा/थिरमने बीज प्रक्रिया", hi: "लाइन बुवाई; ट्राइकोडर्मा/थिरम से बीज उपचार" },
  "Interculture/hand weeding": { en: "Interculture/hand weeding", mr: "आंतरमशागत/हाताने तण काढणी", hi: "अंतरखेती/हाथ से निराई" },
  "Foliar spray 1% KNO3 or 0.5% ZnSO4 if deficiency observed": { en: "Foliar spray 1% KNO3 or 0.5% ZnSO4 if deficiency observed", mr: "कमतरता दिसल्यास 1% KNO3 किंवा 0.5% ZnSO4 फवारणी", hi: "कमी दिखे तो 1% KNO3 या 0.5% ZnSO4 फोलियर स्प्रे" },
  "Helicoverpa/scuttle pest monitoring; spray only if ETL": { en: "Helicoverpa/scuttle pest monitoring; spray only if ETL", mr: "हेलिकव्हर्पा/कीड निरीक्षण; ETL असल्यासच फवारणी", hi: "हेलिकोवर्पा/कीट निगरानी; ETL होने पर ही स्प्रे" },
  "Stop irrigation before harvest to ease drying": { en: "Stop irrigation before harvest to ease drying", mr: "कापणीपूर्वी सिंचन बंद करा", hi: "कटाई से पहले सिंचाई बंद करें" },
  "Harvest when pods turn brown and seeds harden": { en: "Harvest when pods turn brown and seeds harden", mr: "शेंगा तपकिरी झाल्यावर व दाणे कडक झाल्यावर कापा", hi: "फलियाँ भूरे होने व दाने सख्त होने पर कटाई करें" },
  "NPK 12:32:16 @ 50 kg/acre + FYM 1 ton/acre": { en: "NPK 12:32:16 @ 50 kg/acre + FYM 1 ton/acre", mr: "NPK 12:32:16 @ 50 किग्रा/एकर + शेणखत 1 टन/एकर", hi: "NPK 12:32:16 @ 50 किग्रा/एकड़ + FYM 1 ट��/एकड़" },
  "Line sowing, proper seed rate and spacing": { en: "Line sowing, proper seed rate and spacing", mr: "ओळीत पेरणी, शिफारस केलेले बीजदर व अंतर", hi: "लाइन बुवाई, बीज दर व दूरी अनुशंसित" },
  "Maintain plant stand, remove weeds": { en: "Maintain plant stand, remove weeds", mr: "वनस्पती घनता राखा, तण काढा", hi: "पौध संख्या रखें, खरपतवार हटाएँ" },
  "Urea @ 20 kg/acre before flowering": { en: "Urea @ 20 kg/acre before flowering", mr: "फुलोऱ्यापूर्वी युरिया @ 20 किलो/एकर", hi: "फूल से पहले यूरिया @ 20 किग्रा/एकड़" },
  "Aphids/leaf miner monitoring; spray if ETL": { en: "Aphids/leaf miner monitoring; spray if ETL", mr: "अॅफिड्स/लीफ माइनर निरीक्षण; ETL असल्यास फवारणी", hi: "एफिड/लीफ माइनर निगरानी; ETL पर स्प्रे" },
  "Stop irrigation before maturity": { en: "Stop irrigation before maturity", mr: "परिपक्वतेपूर��वी सिंचन थांबवा", hi: "परिपक्वता से पहले सिंचाई रोकें" },
  "Harvest when seeds are firm and pods dry": { en: "Harvest when seeds are firm and pods dry", mr: "बिया घट्ट व शेंगा सुकल्यावर कापा", hi: "बीज सख्त हों व फलियाँ सूखें तो कटाई करें" },
  "Apply 10–20 kg FYM/plant with SSP as per crop": { en: "Apply 10–20 kg FYM/plant with SSP as per crop", mr: "प्रति रोप 10–20 कि.ग्रा. शेणखत + SSP आवश्यकतेनुसार", hi: "प्रति पौधा 10–20 किग्रा FYM और SSP फसल अनुसार" },
  "Plant healthy saplings; stake if required": { en: "Plant healthy saplings; stake if required", mr: "तंदुरुस्त रोपे लावा; आवश्यक असल्यास आधार द्या", hi: "स्वस्थ पौधे लगाएँ; जरूरत हो तो सहारा दें" },
  "Regular irrigation to establish plants": { en: "Regular irrigation to establish plants", mr: "प्रस्थापनेसाठी नियमित सिंचन", hi: "���्थापना हेतु नियमित सिंचाई" },
  "Train/prune as per crop habit": { en: "Train/prune as per crop habit", mr: "पीक पद्धतीनुसार प्रशिक्षण/छाटणी", hi: "फसल के अनुरूप ट्रेनिंग/प्रूनिंग" },
  "Monitor fruit fly, sucking pests; spray if ETL": { en: "Monitor fruit fly, sucking pests; spray if ETL", mr: "फळमाशी/शोषक किड निरीक्षण; ETL असल्यास फवारणी", hi: "फ्रूट फ्लाई/सकिंग पेस्ट निगरानी; ETL पर स्प्रे" },
  "Remove infected fruits, maintain hygiene": { en: "Remove infected fruits, maintain hygiene", mr: "संक्रमित फळे काढा, स्वच्छता ठेवा", hi: "संक्रमित फल हटाएँ, स्वच्छता रखें" },
  "NPK 10:26:26 @ 40 kg/acre + FYM 1–2 tons/acre": { en: "NPK 10:26:26 @ 40 kg/acre + FYM 1–2 tons/acre", mr: "NPK 10:26:26 @ 40 किग्रा/एकर + शेणखत 1–2 टन/एकर", hi: "NPK 10:26:26 @ 40 किग्रा/एकड़ + FYM 1–2 टन/एकड़" },
  "Transplant/Sow": { en: "Transplant/Sow", mr: "लागवड/पेरणी", hi: "रोपाई/बुवाई" },
  "Weeding & staking": { en: "Weeding & staking", mr: "तण काढणी व आधार", hi: "निराई व सहारा" },
  "1% KNO3 foliar spray for fruiting": { en: "1% KNO3 foliar spray for fruiting", mr: "फळधारणेसाठी 1% KNO3 फवारणी", hi: "फलन हेतु 1% KNO3 स्प्रे" },
  "Harvest window begins": { en: "Harvest window begins", mr: "कापणीची सुरुवात", hi: "कटाई शुरू" },
};

function tr(s: string, locale: "en" | "mr" | "hi"): string {
  const item = TL[s];
  if (!item) return s;
  return item[locale] || s;
}

export type CropPlanTemplate = {
  key: string; // crop key or category key
  durationDays: number;
  stages: PlanStage[];
  baseTasks: PlanTask[];
};

export type IrrigationType = "Rainfed" | "Drip" | "Sprinkler" | "Flood";
export type CategoryKey = "Cereal" | "Pulses" | "Oilseed" | "Fruit" | "Vegetable";

// Generic per-category templates (override by crop when needed)
const categoryTemplates: Record<CategoryKey, CropPlanTemplate> = {
  Cereal: {
    key: "Cereal",
    durationDays: 120,
    stages: [
      { name: "Land preparation", startDay: -14, endDay: -1 },
      { name: "Sowing & germination", startDay: 0, endDay: 14 },
      { name: "Tillering/Vegetative", startDay: 15, endDay: 50 },
      { name: "Flowering", startDay: 51, endDay: 80 },
      { name: "Grain filling", startDay: 81, endDay: 110 },
      { name: "Harvest", startDay: 111, endDay: 120 },
    ],
    baseTasks: [
      { day: -10, title: "Field prep", type: "activity", description: "Primary tillage, remove residues, level field" },
      { day: -3, title: "Basal fertilizer", type: "fertilizer", description: "Apply NPK 10:26:26 @ 50 kg/acre and FYM 1–2 tons/acre during final harrow" },
      { day: 0, title: "Sowing", type: "activity", description: "Sow with recommended spacing; treat seed with fungicide/insecticide as per label" },
      { day: 15, title: "1st urea top dress", type: "fertilizer", description: "Urea @ 30 kg/acre along rows after first irrigation or rain" },
      { day: 30, title: "Weed control", type: "activity", description: "Interculture/hoe; apply pre/post-emergence herbicide if needed" },
      { day: 35, title: "2nd urea top dress", type: "fertilizer", description: "Urea @ 20 kg/acre at late vegetative stage" },
      { day: 45, title: "Pest & disease scout", type: "pest", description: "Scout for stem borer/leaf blight; spray recommended pesticide only if ETL crossed" },
      { day: 90, title: "Pre-harvest check", type: "activity", description: "Drain excess water, stop irrigation; check grain maturity" },
      { day: 115, title: "Harvest & drying", type: "activity", description: "Harvest at physiological maturity and dry grains to safe moisture" },
    ],
  },
  Pulses: {
    key: "Pulses",
    durationDays: 110,
    stages: [
      { name: "Land preparation", startDay: -10, endDay: -1 },
      { name: "Sowing & germination", startDay: 0, endDay: 12 },
      { name: "Vegetative", startDay: 13, endDay: 35 },
      { name: "Flowering & pod formation", startDay: 36, endDay: 80 },
      { name: "Pod filling", startDay: 81, endDay: 100 },
      { name: "Harvest", startDay: 101, endDay: 110 },
    ],
    baseTasks: [
      { day: -7, title: "Basal fertilizer", type: "fertilizer", description: "DAP 18:46:0 @ 40 kg/acre; Rhizobium inoculation for seed" },
      { day: 0, title: "Sowing", type: "activity", description: "Line sowing; seed treatment with Trichoderma/Thiram as per label" },
      { day: 20, title: "Weeding", type: "activity", description: "Interculture/hand weeding" },
      { day: 30, title: "Micronutrients", type: "fertilizer", description: "Foliar spray 1% KNO3 or 0.5% ZnSO4 if deficiency observed" },
      { day: 40, title: "Pest management", type: "pest", description: "Helicoverpa/scuttle pest monitoring; spray only if ETL" },
      { day: 90, title: "Irrigation stop", type: "irrigation", description: "Stop irrigation before harvest to ease drying" },
      { day: 105, title: "Harvest", type: "activity", description: "Harvest when pods turn brown and seeds harden" },
    ],
  },
  Oilseed: {
    key: "Oilseed",
    durationDays: 115,
    stages: [
      { name: "Land preparation", startDay: -10, endDay: -1 },
      { name: "Sowing & germination", startDay: 0, endDay: 10 },
      { name: "Vegetative", startDay: 11, endDay: 35 },
      { name: "Flowering", startDay: 36, endDay: 70 },
      { name: "Pod/seed filling", startDay: 71, endDay: 105 },
      { name: "Harvest", startDay: 106, endDay: 115 },
    ],
    baseTasks: [
      { day: -5, title: "Basal fertilizer", type: "fertilizer", description: "NPK 12:32:16 @ 50 kg/acre + FYM 1 ton/acre" },
      { day: 0, title: "Sowing", type: "activity", description: "Line sowing, proper seed rate and spacing" },
      { day: 20, title: "Thinning & weeding", type: "activity", description: "Maintain plant stand, remove weeds" },
      { day: 25, title: "Top dress N", type: "fertilizer", description: "Urea @ 20 kg/acre before flowering" },
      { day: 45, title: "Pest management", type: "pest", description: "Aphids/leaf miner monitoring; spray if ETL" },
      { day: 95, title: "Irrigation stop", type: "irrigation", description: "Stop irrigation before maturity" },
      { day: 110, title: "Harvest", type: "activity", description: "Harvest when seeds are firm and pods dry" },
    ],
  },
  Fruit: {
    key: "Fruit",
    durationDays: 180,
    stages: [
      { name: "Pit preparation", startDay: -20, endDay: -1 },
      { name: "Planting establishment", startDay: 0, endDay: 30 },
      { name: "Vegetative growth", startDay: 31, endDay: 120 },
      { name: "Flowering/fruit set", startDay: 121, endDay: 160 },
      { name: "Early harvest", startDay: 161, endDay: 180 },
    ],
    baseTasks: [
      { day: -10, title: "FYM & basal", type: "fertilizer", description: "Apply 10–20 kg FYM/plant with SSP as per crop" },
      { day: 0, title: "Transplant", type: "activity", description: "Plant healthy saplings; stake if required" },
      { day: 15, title: "Irrigation", type: "irrigation", description: "Regular irrigation to establish plants" },
      { day: 45, title: "Training & pruning", type: "activity", description: "Train/prune as per crop habit" },
      { day: 60, title: "Pest management", type: "pest", description: "Monitor fruit fly, sucking pests; spray if ETL" },
      { day: 150, title: "Pre-harvest sanitation", type: "activity", description: "Remove infected fruits, maintain hygiene" },
    ],
  },
  Vegetable: {
    key: "Vegetable",
    durationDays: 100,
    stages: [
      { name: "Nursery/land prep", startDay: -20, endDay: -1 },
      { name: "Transplant/sowing & takeoff", startDay: 0, endDay: 15 },
      { name: "Vegetative", startDay: 16, endDay: 45 },
      { name: "Flowering/fruiting", startDay: 46, endDay: 85 },
      { name: "Harvest", startDay: 86, endDay: 100 },
    ],
    baseTasks: [
      { day: -7, title: "Basal fertilizer", type: "fertilizer", description: "NPK 10:26:26 @ 40 kg/acre + FYM 1–2 tons/acre" },
      { day: 0, title: "Transplant/Sow", type: "activity", description: "Transplant healthy seedlings or sow seeds" },
      { day: 10, title: "Weeding & staking", type: "activity", description: "Weed control and provide staking for creepers" },
      { day: 20, title: "Top dress N", type: "fertilizer", description: "Urea @ 20 kg/acre" },
      { day: 35, title: "Pest & disease", type: "pest", description: "Scout for fruit borer/mildew; spray if ETL" },
      { day: 60, title: "Micronutrients", type: "fertilizer", description: "1% KNO3 foliar spray for fruiting" },
      { day: 90, title: "Harvest window begins", type: "activity", description: "Start periodic harvests" },
    ],
  },
};

// Crop-specific overrides where common durations and operations are known
const cropOverrides: Record<string, Partial<CropPlanTemplate>> = {
  "Rice": {
    durationDays: 120,
  },
  "Wheat": {
    durationDays: 135,
  },
  "Maize": {
    durationDays: 110,
  },
  "Soybean": {
    durationDays: 105,
  },
  "Groundnut": {
    durationDays: 115,
  },
  "Onion": {
    durationDays: 110,
  },
  "Tomato": {
    durationDays: 95,
  },
  "Tur (Pigeon Pea)": {
    durationDays: 150,
  },
  "Chana (Gram)": {
    durationDays: 120,
  },
  "Moong (Green Gram)": {
    durationDays: 70,
  },
  "Urad (Black Gram)": {
    durationDays: 80,
  },
};

export type PlanResult = {
  start: string; // ISO date
  end: string; // ISO date
  stages: { name: string; start: string; end: string }[];
  tasks: { date: string; title: string; type: PlanTaskType; description: string }[];
};

export function getTemplateFor(category: CategoryKey, crop: string): CropPlanTemplate {
  const base = categoryTemplates[category];
  const override = cropOverrides[crop] || {};
  return {
    key: crop,
    durationDays: override.durationDays ?? base.durationDays,
    stages: override.stages ?? base.stages,
    baseTasks: override.baseTasks ?? base.baseTasks,
  };
}

export function generatePlan(options: {
  category: CategoryKey;
  crop: string;
  irrigation: IrrigationType;
  areaAcre: number;
  sowingISO: string; // yyyy-mm-dd
  locale?: "en" | "mr" | "hi";
}): PlanResult {
  const tpl = getTemplateFor(options.category, options.crop);
  const sowing = startOfDay(new Date(options.sowingISO));
  const end = addDays(sowing, tpl.durationDays);
  const locale = options.locale ?? "en";

  // Adjust tasks for irrigation type (e.g., add recurring irrigation)
  const irrigationTasks: PlanTask[] = buildIrrigationTasks(options.irrigation, tpl.durationDays);

  // Adjust fertilizer quantities by area (simple text note)
  const scaledTasks: PlanTask[] = tpl.baseTasks.map((t) => {
    if (t.type !== "fertilizer") return t;
    // Append area scaling hint without changing agronomic rates (since per-acre given)
    return {
      ...t,
      description: `${t.description}. Quantity based on ${options.areaAcre} acre(s).`,
    };
  });

  const allTasks = [...scaledTasks, ...irrigationTasks]
    .sort((a, b) => a.day - b.day)
    .map((t) => ({
      date: formatISODate(addDays(sowing, t.day)),
      title: tr(t.title, locale),
      type: t.type,
      description: tr(t.description, locale),
    }));

  const stages = tpl.stages.map((s) => ({
    name: tr(s.name, locale),
    start: formatISODate(addDays(sowing, s.startDay)),
    end: formatISODate(addDays(sowing, s.endDay)),
  }));

  return {
    start: formatISODate(sowing),
    end: formatISODate(end),
    stages,
    tasks: allTasks,
  };
}

function buildIrrigationTasks(type: IrrigationType, duration: number): PlanTask[] {
  // Create irrigation reminders at different intervals based on system
  const tasks: PlanTask[] = [];
  const start = 3; // first irrigation after 3 days if needed
  let every = 7;
  switch (type) {
    case "Drip":
      every = 3;
      break;
    case "Sprinkler":
      every = 5;
      break;
    case "Flood":
      every = 10;
      break;
    case "Rainfed":
    default:
      // No fixed schedule; add only key reminders at vegetative/flowering
      tasks.push(
        { day: 20, title: "Irrigation (if dry)", type: "irrigation", description: "Ensure adequate moisture during vegetative stage" },
        { day: 55, title: "Irrigation (if dry)", type: "irrigation", description: "Provide life-saving irrigation at flowering if rainfall deficit" },
      );
      return tasks;
  }
  for (let d = start; d < duration - 10; d += every) {
    tasks.push({ day: d, title: "Irrigation", type: "irrigation", description: `Irrigate based on soil moisture (interval ~${every} days)` });
  }
  return tasks;
}

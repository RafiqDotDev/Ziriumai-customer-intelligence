export interface CostEstimatorInputs {
  outletsCount: number;
  smsCount: number;
  whatsAppCount: number;
  emailCount: number;
  includeBuffer: boolean;
}

export interface CostBreakdown {
  fixed: {
    cloudServer: number; // $24
    databaseSupabase: number; // $25
    backupsStorage: number; // $5
    aiDrafting: number; // $3 ($1-$5)
    smsRegulatoryNumberFee: number; // $8 ($3-$11 if sms > 0, else 0)
    totalFixed: number;
  };
  variable: {
    smsTotal: number;
    whatsAppTotal: number;
    emailTotal: number;
    totalVariable: number;
  };
  oneTime: {
    smsRegistrationA2P: number; // $20 if sms > 0, else 0
  };
  bufferAmount: number; // 10% of (fixed + variable) if toggle enabled
  estimatedMonthlyTotal: number;
  unitRates: {
    smsRate: number;
    whatsAppRate: number;
    emailRate: number;
  };
}

export const UNIT_RATES = {
  smsRate: 0.0125, // $0.0125 per SMS
  whatsAppRate: 0.0685, // $0.0685 per marketing WhatsApp message
  emailRate: 0.0001, // $0.0001 per transactional/marketing Email ($1 per 10,000)
};

export function calculateEstimatedCosts(inputs: CostEstimatorInputs): CostBreakdown {
  const { outletsCount, smsCount, whatsAppCount, emailCount, includeBuffer } = inputs;

  const cloudServer = 24 * Math.max(1, Math.ceil(outletsCount / 5));
  const databaseSupabase = 25;
  const backupsStorage = 5;
  const aiDrafting = 3;
  const smsRegulatoryNumberFee = smsCount > 0 ? 8 : 0;

  const totalFixed = cloudServer + databaseSupabase + backupsStorage + aiDrafting + smsRegulatoryNumberFee;

  const smsTotal = smsCount * UNIT_RATES.smsRate;
  const whatsAppTotal = whatsAppCount * UNIT_RATES.whatsAppRate;
  const emailTotal = emailCount * UNIT_RATES.emailRate;
  const totalVariable = smsTotal + whatsAppTotal + emailTotal;

  const smsRegistrationA2P = smsCount > 0 ? 20 : 0;

  const baseMonthly = totalFixed + totalVariable;
  const bufferAmount = includeBuffer ? baseMonthly * 0.1 : 0;
  const estimatedMonthlyTotal = Math.round((baseMonthly + bufferAmount) * 100) / 100;

  return {
    fixed: {
      cloudServer,
      databaseSupabase,
      backupsStorage,
      aiDrafting,
      smsRegulatoryNumberFee,
      totalFixed,
    },
    variable: {
      smsTotal: Math.round(smsTotal * 100) / 100,
      whatsAppTotal: Math.round(whatsAppTotal * 100) / 100,
      emailTotal: Math.round(emailTotal * 100) / 100,
      totalVariable: Math.round(totalVariable * 100) / 100,
    },
    oneTime: {
      smsRegistrationA2P,
    },
    bufferAmount: Math.round(bufferAmount * 100) / 100,
    estimatedMonthlyTotal,
    unitRates: UNIT_RATES,
  };
}

export const PRESETS = [
  {
    name: "Small",
    description: "1,000 SMS + 3,000 Email ($70 to $85/mo)",
    inputs: {
      outletsCount: 1,
      smsCount: 1000,
      whatsAppCount: 0,
      emailCount: 3000,
      includeBuffer: false,
    },
  },
  {
    name: "Medium",
    description: "4,000 SMS + 10,000 Email ($105 to $125/mo)",
    inputs: {
      outletsCount: 3,
      smsCount: 4000,
      whatsAppCount: 0,
      emailCount: 10000,
      includeBuffer: false,
    },
  },
  {
    name: "Medium + WhatsApp",
    description: "Adds 1,000 WhatsApp ($175 to $195/mo)",
    inputs: {
      outletsCount: 3,
      smsCount: 4000,
      whatsAppCount: 1000,
      emailCount: 10000,
      includeBuffer: false,
    },
  },
];

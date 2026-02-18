
import { CaseType, CourtCase, CaseStatus } from './types';

export const CASE_TYPES = [
  CaseType.CIVIL,
  CaseType.CRIMINAL,
  CaseType.FAMILY,
  CaseType.TRAFFIC,
  CaseType.CONSUMER
];

const NAMES = ["Rajesh Kumar", "Amit Shah", "Suresh Raina", "Priyanka Chopra", "Aditi Rao", "Vijay Mallya", "Narendra Modi", "Rahul Gandhi", "Arvind Kejriwal", "Mamata Banerjee"];

// Helper function to create a randomized mock court case
export const createMockCase = (index: number, status: CaseStatus = CaseStatus.FILED): CourtCase => {
  const type = CASE_TYPES[Math.floor(Math.random() * CASE_TYPES.length)];
  const ageDays = Math.floor(Math.random() * 1500) + 50;
  const claimAmount = Math.floor(Math.random() * 1000000) + 1000;
  const witnessRequired = Math.random() > 0.5;
  const reliability = 0.3 + Math.random() * 0.65;
  const adjournments = Math.floor(Math.random() * 12);
  
  const settlementProb = (type === CaseType.CIVIL || type === CaseType.CONSUMER) && claimAmount < 100000 ? 0.85 : 0.25;
  const delayProb = (reliability < 0.5 || witnessRequired || adjournments > 5) ? 0.75 : 0.25;
  const duration = (type === CaseType.CRIMINAL) ? 45 : 15 + Math.floor(Math.random() * 20);

  const descriptions: Record<CaseType, string> = {
    [CaseType.CIVIL]: "Property dispute regarding land ownership and boundary encroachment.",
    [CaseType.CRIMINAL]: "Alleged theft and criminal trespass involving unauthorized entry.",
    [CaseType.FAMILY]: "Matrimonial dispute involving maintenance claims and custody.",
    [CaseType.TRAFFIC]: "Traffic violation involving collision and public property damage.",
    [CaseType.CONSUMER]: "Complaint regarding defective electronic goods and service deficiency."
  };

  return {
    id: `NF/2025/DL/${5000 + index}`,
    type,
    description: descriptions[type] || "Standard legal proceeding following filed complaint.",
    filingYear: 2025 - Math.floor(ageDays / 365),
    ageDays,
    claimAmount,
    previousAdjournments: adjournments,
    lawyerExperienceYears: Math.floor(Math.random() * 30),
    lawyerReliability: reliability,
    opposingLawyerReliability: 0.3 + Math.random() * 0.65,
    witnessRequired,
    policeReportPending: type === CaseType.CRIMINAL && Math.random() > 0.7,
    documentCompleteness: 0.5 + Math.random() * 0.5,
    workloadToday: 50 + Math.floor(Math.random() * 50),
    status: status,
    petitioner: NAMES[Math.floor(Math.random() * NAMES.length)],
    respondent: NAMES[Math.floor(Math.random() * NAMES.length)],
    settlementProbability: settlementProb,
    delayProbability: delayProb,
    estimatedDurationMinutes: duration,
    priorityScore: 0
  };
};

export const generateInitialCases = (): CourtCase[] => {
  return Array.from({ length: 25 }, (_, i) => {
    const status = i < 5 ? CaseStatus.FILED : (i < 15 ? CaseStatus.SCHEDULED : CaseStatus.MEDIATION);
    return createMockCase(i, status);
  });
};

export const MOCK_CASES: CourtCase[] = generateInitialCases();

export const getStoredCases = (): CourtCase[] => {
  const stored = localStorage.getItem('nyayaFlowCases');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('nyayaFlowCases', JSON.stringify(MOCK_CASES));
  return MOCK_CASES;
};

// Add a single case to the persistent store
export const addStoredCase = (newCase: CourtCase) => {
  const cases = getStoredCases();
  cases.push(newCase);
  localStorage.setItem('nyayaFlowCases', JSON.stringify(cases));
};

export const updateStoredCase = (updatedCase: CourtCase) => {
  const cases = getStoredCases();
  const index = cases.findIndex(c => c.id === updatedCase.id);
  if (index !== -1) {
    cases[index] = updatedCase;
    localStorage.setItem('nyayaFlowCases', JSON.stringify(cases));
  }
};

// Reset the storage back to the original mock case set
export const resetStoredCases = () => {
  localStorage.setItem('nyayaFlowCases', JSON.stringify(MOCK_CASES));
};

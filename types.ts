
export enum CaseType {
  CIVIL = 'civil',
  CRIMINAL = 'criminal',
  FAMILY = 'family',
  TRAFFIC = 'traffic',
  CONSUMER = 'consumer'
}

export enum CaseStatus {
  FILED = 'Filed',
  SCREENING = 'Screening',
  MEDIATION = 'Mediation',
  ARBITRATION = 'Arbitration',
  SCHEDULED = 'Scheduled',
  CLOSED = 'Closed',
  // New statuses for workflow persistence
  AWAITING_RESPONSE = 'Awaiting Party Response',
  SETTLED = 'Disposed - Settled',
  LISTED = 'Listed for Hearing',
  ARB_PENDING = 'Arbitration Pending'
}

export enum UserRole {
  CITIZEN = 'Citizen',
  LAWYER = 'Lawyer',
  MEDIATOR = 'Mediator',
  ARBITRATOR = 'Arbitrator',
  JUDGE = 'Judge',
  NONE = 'None'
}

export interface CourtCase {
  id: string;
  type: CaseType;
  description: string;
  filingYear: number;
  ageDays: number;
  claimAmount: number;
  previousAdjournments: number;
  lawyerExperienceYears: number;
  lawyerReliability: number;
  opposingLawyerReliability: number;
  witnessRequired: boolean;
  policeReportPending: boolean;
  documentCompleteness: number;
  workloadToday: number;
  status: CaseStatus;
  
  // Simulated party data for prototype
  petitioner?: string;
  respondent?: string;
  
  // AI Predicted Fields
  settlementProbability: number;
  delayProbability: number;
  estimatedDurationMinutes: number;
  priorityScore: number;
}

export interface ScheduledHearing {
  id: string;
  caseId: string;
  caseTitle: string;
  startTime: string; // ISO String
  endTime: string;   // ISO String
  priorityScore: number;
  isBuffer: boolean;
  delayProbability: number;
}

export interface LawyerAvailability {
  id: string;
  name: string;
  isAvailable: boolean;
  unavailableSlots: string[]; // ISO Strings
}

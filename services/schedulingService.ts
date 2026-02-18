
import { CourtCase, ScheduledHearing, CaseType } from '../types';

export const computePriorityScore = (c: CourtCase): number => {
  // Logic from prompt:
  // priority_score = (case_age_days * 0.4) + ((1 - delay_probability) * 0.3) + 
  //                  (document_completeness * 0.2) + ((1 if criminal else 0.5) * 0.1)
  
  const ageFactor = c.ageDays * 0.4;
  const reliabilityFactor = (1 - c.delayProbability) * 0.3 * 1000; // scaling to match age
  const docFactor = c.documentCompleteness * 0.2 * 1000;
  const criminalBonus = (c.type === CaseType.CRIMINAL ? 1 : 0.5) * 0.1 * 1000;
  
  return ageFactor + reliabilityFactor + docFactor + criminalBonus;
};

export const generateDailySchedule = (cases: CourtCase[]): ScheduledHearing[] => {
  const startTime = new Date();
  startTime.setHours(9, 30, 0, 0);
  const endTime = new Date();
  endTime.setHours(16, 30, 0, 0);

  // Sort by priority score descending
  const sortedCases = cases
    .map(c => ({ ...c, priorityScore: computePriorityScore(c) }))
    .sort((a, b) => b.priorityScore - a.priorityScore);

  let currentCursor = new Date(startTime);
  const schedule: ScheduledHearing[] = [];

  for (const c of sortedCases) {
    if (currentCursor >= endTime) break;

    const hearingDuration = c.estimatedDurationMinutes;
    const hearingEnd = new Date(currentCursor.getTime() + hearingDuration * 60000);

    if (hearingEnd > endTime) break;

    schedule.push({
      id: `HEAR-${Math.random().toString(36).substr(2, 9)}`,
      caseId: c.id,
      caseTitle: `${c.type.toUpperCase()} - ${c.id}`,
      startTime: currentCursor.toISOString(),
      endTime: hearingEnd.toISOString(),
      priorityScore: c.priorityScore,
      isBuffer: false,
      delayProbability: c.delayProbability
    });

    currentCursor = new Date(hearingEnd);

    // Insert Buffer slot if high delay probability
    if (c.delayProbability > 0.6) {
      const bufferEnd = new Date(currentCursor.getTime() + 15 * 60000); // 15 min buffer
      if (bufferEnd <= endTime) {
        schedule.push({
          id: `BUFF-${Math.random().toString(36).substr(2, 9)}`,
          caseId: 'BUFFER',
          caseTitle: 'Contingency Buffer',
          startTime: currentCursor.toISOString(),
          endTime: bufferEnd.toISOString(),
          priorityScore: 0,
          isBuffer: true,
          delayProbability: 0
        });
        currentCursor = new Date(bufferEnd);
      }
    }
  }

  return schedule;
};

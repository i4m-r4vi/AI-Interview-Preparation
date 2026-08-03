import { calculateQuestionDistribution, normalizeQuestions } from './questionDistribution.js';

describe('Question Distribution Utils', () => {
  describe('calculateQuestionDistribution', () => {
    it('should correctly calculate the 50/30/10/10 mixed distribution for 10 questions', () => {
      const result = calculateQuestionDistribution(10);
      
      // 50% of 10 = 5 + 1 buffer = 6
      // 30% of 10 = 3 + 1 buffer = 4
      // 10% of 10 = 1
      // 10% of 10 = 1
      expect(result.mcq).toBe(6);
      expect(result.theory).toBe(4);
      expect(result.coding).toBe(1);
      expect(result.behavioral).toBe(1);
      expect(result.totalNeeded).toBe(10);
    });

    it('should correctly handle minimum boundaries for small question counts', () => {
      const result = calculateQuestionDistribution(5);
      
      // Math.round(5 * 0.5) = 3 + buffer = 4
      // Math.round(5 * 0.3) = 2 + buffer = 3
      // Math.max(1, Math.round(5 * 0.1)) = 1
      // 5 - 3 - 2 - 1 = -1 -> adjusted to 1 because total >= 3
      expect(result.coding).toBe(1);
      expect(result.behavioral).toBe(1);
      expect(result.totalNeeded).toBe(5);
    });
  });

  describe('normalizeQuestions', () => {
    it('should slice the exact number of questions needed and apply the correct order', () => {
      const mockAiOutput = [
        { type: 'mcq', question: 'Q1', options: [] },
        { type: 'mcq', question: 'Q2', options: [] },
        { type: 'mcq', question: 'Q3', options: [] },
        { type: 'mcq', question: 'Q4', options: [] },
        { type: 'mcq', question: 'Q5', options: [] },
        { type: 'mcq', question: 'Q6', options: [] }, // buffer
        { type: 'theory', question: 'T1' },
        { type: 'theory', question: 'T2' },
        { type: 'theory', question: 'T3' },
        { type: 'theory', question: 'T4' }, // buffer
        { type: 'coding', question: 'C1' },
        { type: 'behavioral', question: 'B1' },
      ];

      const distribution = {
        mcq: 5,
        theory: 3,
        coding: 1,
        behavioral: 1,
        totalNeeded: 10
      };

      const result = normalizeQuestions(mockAiOutput, distribution);
      
      expect(result).toHaveLength(10);
      
      const mcqs = result.filter(q => q.type === 'mcq');
      const theories = result.filter(q => q.type === 'theory');
      const codings = result.filter(q => q.type === 'coding');
      const behaviorals = result.filter(q => q.type === 'behavioral');

      expect(mcqs.length).toBeGreaterThanOrEqual(5);
      expect(theories.length).toBeGreaterThanOrEqual(3);
      expect(codings.length).toBe(1);
      expect(behaviorals.length).toBe(1);

      // Verify ordering injection
      result.forEach((q, idx) => {
        expect(q.order).toBe(idx + 1);
      });
    });
  });
});

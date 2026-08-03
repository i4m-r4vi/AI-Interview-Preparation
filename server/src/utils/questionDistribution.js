export function calculateQuestionDistribution(total) {
  // New mixed format distribution: 50% MCQ, 30% Theory, 10% Coding, 10% Behavioral
  const mcqCount = Math.round(total * 0.5);
  const theoryCount = Math.round(total * 0.3);
  const codingCount = Math.max(1, Math.round(total * 0.1));
  let behavioralCount = total - mcqCount - theoryCount - codingCount;

  if (behavioralCount < 1 && total >= 3) {
    behavioralCount = 1;
  }

  const adjusted = mcqCount + theoryCount + codingCount + behavioralCount;
  const diff = total - adjusted;

  return {
    mcq: mcqCount + (diff > 0 ? diff : 0) + 1, // buffer
    theory: theoryCount + 1, // buffer
    coding: codingCount,
    behavioral: behavioralCount,
    totalNeeded: total
  };
}

export function normalizeQuestions(questions, distribution) {
  const typed = {
    mcq: [],
    theory: [],
    coding: [],
    behavioral: [],
  };

  for (const q of questions) {
    if (typed[q.type]) {
      typed[q.type].push(q);
    }
  }

  const selected = [];
  let order = 1;

  const pick = (pool, count, fallbackPool) => {
    for (let i = 0; i < count; i++) {
      if (pool.length > 0) {
        selected.push({ ...pool.shift(), order: order++ });
      } else if (fallbackPool && fallbackPool.length > 0) {
        selected.push({ ...fallbackPool.shift(), order: order++ });
      }
    }
  };

  pick(typed.mcq, distribution.mcq, typed.theory);
  pick(typed.theory, distribution.theory, typed.mcq);
  pick(typed.coding, distribution.coding, typed.theory);
  pick(typed.behavioral, distribution.behavioral, typed.theory);

  const totalNeeded = distribution.totalNeeded;
  // If we still need more questions, just pick any remaining from theory or mcq pools
  while (selected.length < totalNeeded && (typed.theory.length || typed.mcq.length)) {
    const item = typed.theory.length ? typed.theory.shift() : typed.mcq.shift();
    selected.push({ ...item, order: order++ });
  }

  return selected.slice(0, totalNeeded);
}

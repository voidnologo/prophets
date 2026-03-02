// Flash card game business logic — pure functions, no Svelte state
// Exported for unit testing; imported by +page.svelte

export type Leader = {
  id: string;
  slug: string;
  name: { full: string; display: string; last: string };
  title: string;
  quorum: string;
  seniority: number;
  photo: { filename: string; alt: string };
};

/** Fisher-Yates shuffle — returns a new array, never mutates input */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build exactly 4 choices: the correct leader + 3 random distractors from pool.
 * All four are shuffled before returning.
 */
export function buildChoices(correct: Leader, pool: Leader[]): Leader[] {
  const others = pool.filter((l) => l.id !== correct.id);
  const distractors = shuffle(others).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

import { describe, it, expect } from 'vitest';
import { shuffle, buildChoices, type Leader } from './flashcard-logic';

// --- Minimal fixture data ---
const makeLeader = (id: string): Leader => ({
  id,
  slug: id,
  name: { full: `Full ${id}`, display: `Display ${id}`, last: id },
  title: 'Apostle',
  quorum: 'quorum-of-the-twelve',
  seniority: 1,
  photo: { filename: `${id}.jpg`, alt: `Photo of ${id}` }
});

const pool: Leader[] = Array.from({ length: 15 }, (_, i) => makeLeader(`leader-${i + 1}`));

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    expect(shuffle(pool).length).toBe(pool.length);
  });

  it('contains the same elements as the input', () => {
    const result = shuffle(pool);
    const inputIds = pool.map((l) => l.id).sort();
    const resultIds = result.map((l) => l.id).sort();
    expect(resultIds).toEqual(inputIds);
  });

  it('does not mutate the input array', () => {
    const original = [...pool];
    shuffle(pool);
    expect(pool.map((l) => l.id)).toEqual(original.map((l) => l.id));
  });

  it('returns a new array reference (not the same object)', () => {
    const result = shuffle(pool);
    expect(result).not.toBe(pool);
  });
});

describe('buildChoices', () => {
  const correct = pool[0];

  it('returns exactly 4 choices', () => {
    const choices = buildChoices(correct, pool);
    expect(choices.length).toBe(4);
  });

  it('always includes the correct leader', () => {
    const choices = buildChoices(correct, pool);
    expect(choices.some((c) => c.id === correct.id)).toBe(true);
  });

  it('never includes the correct leader as a distractor (no duplicates)', () => {
    const choices = buildChoices(correct, pool);
    const correctCount = choices.filter((c) => c.id === correct.id).length;
    expect(correctCount).toBe(1);
  });

  it('all 4 choices are from the pool', () => {
    const choices = buildChoices(correct, pool);
    const poolIds = new Set(pool.map((l) => l.id));
    choices.forEach((c) => {
      expect(poolIds.has(c.id)).toBe(true);
    });
  });

  it('all 4 choices have distinct ids', () => {
    const choices = buildChoices(correct, pool);
    const ids = choices.map((c) => c.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(4);
  });

  it('choosing from a 4-person pool still returns 4 unique choices', () => {
    const smallPool = pool.slice(0, 4);
    const choices = buildChoices(smallPool[0], smallPool);
    expect(choices.length).toBe(4);
    const uniqueIds = new Set(choices.map((c) => c.id));
    expect(uniqueIds.size).toBe(4);
  });
});

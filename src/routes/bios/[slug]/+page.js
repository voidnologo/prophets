import leaders from '$lib/data/leaders.json';

export const prerender = true;

export function entries() {
  return leaders.leaders.map(leader => ({ slug: leader.slug }));
}

export function load({ params }) {
  const leader = leaders.leaders.find(l => l.slug === params.slug);
  if (!leader) {
    throw new Error(`No leader found for slug: ${params.slug}`);
  }
  return { leader };
}

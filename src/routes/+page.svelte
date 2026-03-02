<!-- Photos: The Church of Jesus Christ of Latter-day Saints / Intellectual Reserve, Inc. -->
<!-- Source: https://www.churchofjesuschrist.org/media/collection/first-presidency-and-quorum-of-the-twelve-apostles-images?lang=eng -->
<!-- Used for educational, non-commercial purposes -->
<script>
  import leaders from '$lib/data/leaders.json';
  import LeaderCard from '$lib/components/LeaderCard.svelte';

  const firstPresidency = leaders.leaders
    .filter(l => l.quorum === 'first-presidency')
    .sort((a, b) => a.seniority - b.seniority);

  const quorumOfTwelve = leaders.leaders
    .filter(l => l.quorum === 'quorum-of-twelve')
    .sort((a, b) => a.seniority - b.seniority);
</script>

<svelte:head>
  <title>Know Your Prophets</title>
</svelte:head>

<main class="max-w-7xl mx-auto px-4 py-8">
  <section class="mb-10">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">First Presidency</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each firstPresidency as leader (leader.id)}
        <LeaderCard {leader} />
      {/each}
    </div>
  </section>

  <section>
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Quorum of the Twelve Apostles</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {#each quorumOfTwelve as leader (leader.id)}
        <LeaderCard {leader} />
      {/each}
    </div>
  </section>
</main>

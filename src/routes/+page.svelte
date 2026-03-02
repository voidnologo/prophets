<!-- Photos: The Church of Jesus Christ of Latter-day Saints / Intellectual Reserve, Inc. -->
<!-- Source: https://www.churchofjesuschrist.org/media/collection/first-presidency-and-quorum-of-the-twelve-apostles-images?lang=eng -->
<!-- Used for educational, non-commercial purposes -->
<script>
  import { base } from '$app/paths';
  import leaders from '$lib/data/leaders.json';

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

<main class="max-w-3xl mx-auto px-6 py-10">
  <h1 class="text-3xl font-bold text-gray-900 mb-8">Leaders</h1>

  <section class="mb-10">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">First Presidency</h2>
    <ul class="space-y-3">
      {#each firstPresidency as leader}
        <li class="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
          <img
            src="{base}/images/leaders/{leader.photo.filename}"
            alt={leader.photo.alt}
            width="48"
            height="60"
            class="rounded object-cover flex-shrink-0"
          />
          <div>
            <p class="font-semibold text-gray-900">{leader.name.display}</p>
            <p class="text-sm text-gray-500">{leader.title}</p>
          </div>
        </li>
      {/each}
    </ul>
  </section>

  <section>
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Quorum of the Twelve Apostles</h2>
    <ul class="space-y-3">
      {#each quorumOfTwelve as leader}
        <li class="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
          <img
            src="{base}/images/leaders/{leader.photo.filename}"
            alt={leader.photo.alt}
            width="48"
            height="60"
            class="rounded object-cover flex-shrink-0"
            loading="lazy"
          />
          <div>
            <p class="font-semibold text-gray-900">{leader.name.display}</p>
            <p class="text-sm text-gray-500">{leader.title}</p>
          </div>
        </li>
      {/each}
    </ul>
  </section>
</main>

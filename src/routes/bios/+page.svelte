<!-- Photos: The Church of Jesus Christ of Latter-day Saints / Intellectual Reserve, Inc. -->
<!-- Source: https://www.churchofjesuschrist.org/media/collection/first-presidency-and-quorum-of-the-twelve-apostles-images?lang=eng -->
<!-- Used for educational, non-commercial purposes -->
<script>
  import leaders from '$lib/data/leaders.json';
  import { base } from '$app/paths';

  const firstPresidency = leaders.leaders
    .filter(l => l.quorum === 'first-presidency')
    .sort((a, b) => a.seniority - b.seniority);

  const quorumOfTwelve = leaders.leaders
    .filter(l => l.quorum === 'quorum-of-twelve')
    .sort((a, b) => a.seniority - b.seniority);
</script>

<svelte:head>
  <title>Biographies — Know Your Prophets</title>
</svelte:head>

<main class="max-w-7xl mx-auto px-4 py-8">
  <section class="mb-10">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">First Presidency</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
      {#each firstPresidency as leader (leader.id)}
        <a
          href="{base}/bios/{leader.slug}"
          class="group rounded-lg shadow hover:shadow-md overflow-hidden bg-white transition-shadow"
        >
          <img
            src="{base}/images/leaders/{leader.photo.filename}"
            alt={leader.photo.alt}
            class="w-full aspect-[4/5] object-cover object-top"
            loading="lazy"
          />
          <div class="p-3">
            <p class="font-bold text-gray-900 text-sm leading-tight">{leader.name.display}</p>
            <p class="text-xs text-gray-500 mt-0.5">{leader.title}</p>
            <p class="text-xs text-gray-600 mt-1 line-clamp-2">{leader.bio.summary}</p>
          </div>
        </a>
      {/each}
    </div>
  </section>

  <section>
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Quorum of the Twelve Apostles</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {#each quorumOfTwelve as leader (leader.id)}
        <a
          href="{base}/bios/{leader.slug}"
          class="group rounded-lg shadow hover:shadow-md overflow-hidden bg-white transition-shadow"
        >
          <img
            src="{base}/images/leaders/{leader.photo.filename}"
            alt={leader.photo.alt}
            class="w-full aspect-[4/5] object-cover object-top"
            loading="lazy"
          />
          <div class="p-3">
            <p class="font-bold text-gray-900 text-sm leading-tight">{leader.name.display}</p>
            <p class="text-xs text-gray-500 mt-0.5">{leader.title}</p>
            <p class="text-xs text-gray-600 mt-1 line-clamp-2">{leader.bio.summary}</p>
          </div>
        </a>
      {/each}
    </div>
  </section>
</main>

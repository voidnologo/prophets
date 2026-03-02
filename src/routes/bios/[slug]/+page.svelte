<script>
  import { base } from '$app/paths';

  let { data } = $props();
  const leader = data.leader;

  const talksUrl = `https://www.churchofjesuschrist.org/study/general-conference/speakers/${leader.slug}?lang=eng`;

  function calculateAge(isoDate) {
    const [birthYear, birthMonth, birthDay] = isoDate.split('-').map(Number);
    const today = new Date();
    const y = today.getFullYear();
    const m = today.getMonth() + 1;
    const d = today.getDate();
    let age = y - birthYear;
    if (m < birthMonth || (m === birthMonth && d < birthDay)) age--;
    return age;
  }

  function formatDate(isoDate) {
    return new Date(isoDate + 'T12:00:00').toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }
</script>

<svelte:head>
  <title>{leader.name.display} — Know Your Prophets</title>
</svelte:head>

<main class="max-w-2xl mx-auto px-4 py-8">

  <!-- Breadcrumb -->
  <nav aria-label="Breadcrumb" class="text-sm text-gray-500 mb-6">
    <a href="{base}/bios" class="hover:text-gray-800 underline underline-offset-2">Biographies</a>
    <span class="mx-2 select-none" aria-hidden="true">›</span>
    <span aria-current="page" class="text-gray-800 font-medium">{leader.name.display}</span>
  </nav>

  <!-- Photo + Name header -->
  <div class="flex flex-col sm:flex-row gap-6 mb-8">
    <img
      src="{base}/images/leaders/{leader.photo.filename}"
      alt={leader.photo.alt}
      class="w-40 sm:w-48 rounded-lg shadow object-cover object-top self-start"
    />
    <div class="flex flex-col justify-center">
      <h1 class="text-2xl font-bold text-gray-900 leading-snug">{leader.name.full}</h1>
      <p class="text-gray-500 mt-1">{leader.title}</p>
    </div>
  </div>

  <!-- Quick-facts panel -->
  <section aria-label="Quick facts" class="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
    <h2 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">Quick Facts</h2>
    <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
      <div>
        <dt class="text-gray-500 font-medium">Born</dt>
        <dd class="text-gray-900">{formatDate(leader.birthDate)}</dd>
      </div>
      <div>
        <dt class="text-gray-500 font-medium">Age</dt>
        <dd class="text-gray-900">{calculateAge(leader.birthDate)}</dd>
      </div>
      <div>
        <dt class="text-gray-500 font-medium">Called</dt>
        <dd class="text-gray-900">{formatDate(leader.callingDate)}</dd>
      </div>
      {#if leader.family?.spouseName}
        <div>
          <dt class="text-gray-500 font-medium">Spouse</dt>
          <dd class="text-gray-900">{leader.family.spouseName}</dd>
        </div>
      {/if}
      {#if leader.family?.children != null}
        <div>
          <dt class="text-gray-500 font-medium">Children</dt>
          <dd class="text-gray-900">{leader.family.children}</dd>
        </div>
      {/if}
      {#if leader.preCallingCareer}
        <div class="sm:col-span-2">
          <dt class="text-gray-500 font-medium">Career Before Calling</dt>
          <dd class="text-gray-900">{leader.preCallingCareer}</dd>
        </div>
      {/if}
    </dl>
  </section>

  <!-- Learn More outbound links -->
  <section aria-label="Learn more" class="flex flex-col sm:flex-row gap-3">
    <a
      href={leader.sourceUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
    >
      Official Biography
      <span aria-hidden="true">↗</span>
      <span class="sr-only">(opens in new tab)</span>
    </a>
    <a
      href={talksUrl}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-800 font-medium hover:bg-gray-50 transition-colors"
    >
      Conference Talks
      <span aria-hidden="true">↗</span>
      <span class="sr-only">(opens in new tab)</span>
    </a>
  </section>

</main>

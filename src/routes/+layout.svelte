<script>
  import Nav from '$lib/components/Nav.svelte';
  import leaders from '$lib/data/leaders.json';
  import '../app.css';

  const lastVerified = new Date(leaders.lastVerified).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
  <Nav />

  <div class="flex-1">
    <slot />
  </div>

  <footer class="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
    Leader data last verified: {lastVerified}
    &nbsp;&middot;&nbsp;
    Photos courtesy of The Church of Jesus Christ of Latter-day Saints
  </footer>
</div>

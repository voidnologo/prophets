<script>
  import Nav from '$lib/components/Nav.svelte';
  import '../app.css';
</script>

<div class="min-h-screen flex flex-col bg-gray-50">
  <Nav />

  <div class="flex-1">
    <slot />
  </div>
</div>

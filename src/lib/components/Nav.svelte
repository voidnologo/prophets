<script>
  import { base } from '$app/paths';
  import { page } from '$app/stores';

  const links = [
    { href: `${base}/`, label: 'Leaders', active: true },
    { href: `${base}/games/flashcards`, label: 'Flash Cards', active: true },
    { href: `${base}/bios`, label: 'Biographies', active: true },
  ];
</script>

<nav class="flex gap-6 items-center px-6 py-4 border-b border-gray-200 bg-white">
  <span class="font-bold text-lg text-gray-900">Know Your Prophets</span>
  <div class="flex gap-4 ml-auto">
    {#each links as link}
      {#if link.active}
        <a href={link.href}
           class="text-blue-600 hover:text-blue-800 font-medium transition-colors"
           aria-current={$page.url.pathname === link.href ? 'page' : undefined}>
          {link.label}
        </a>
      {:else}
        <span class="text-gray-400 cursor-not-allowed select-none"
              aria-disabled="true"
              title="Coming soon">
          {link.label}
        </span>
      {/if}
    {/each}
  </div>
</nav>

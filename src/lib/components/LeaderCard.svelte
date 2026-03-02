<script>
  import { base } from '$app/paths';

  let { leader } = $props();
  let flipped = $state(false);

  function toggleFlip() {
    flipped = !flipped;
  }
</script>

<!-- Scene: sets perspective, defines card dimensions -->
<div
  class="scene perspective-midrange aspect-[4/5] w-full"
  onclick={toggleFlip}
  onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') ? toggleFlip() : null}
  role="button"
  tabindex="0"
  aria-label="Flip card for {leader.name.display}"
  aria-pressed={flipped}
>
  <!-- Inner card: rotates, preserves 3D space -->
  <div class="card transform-3d relative w-full h-full rounded-lg shadow-md"
       class:flipped>
    <!-- Front face: full-bleed portrait, no text -->
    <div class="face-front absolute inset-0 backface-hidden overflow-hidden rounded-lg">
      <img
        src="{base}/images/leaders/{leader.photo.filename}"
        alt={leader.photo.alt}
        class="w-full h-full object-cover object-top"
        loading="lazy"
      />
    </div>
    <!-- Back face: thumbnail + name + title. Pre-rotated 180° so it starts facing away. -->
    <div class="face-back absolute inset-0 backface-hidden rotate-y-180
                overflow-hidden rounded-lg bg-white flex flex-col
                items-center justify-center gap-3 p-4">
      <img
        src="{base}/images/leaders/{leader.photo.filename}"
        alt=""
        aria-hidden="true"
        class="w-16 h-20 object-cover object-top rounded"
      />
      <p class="text-center font-semibold text-gray-900 text-sm leading-tight">
        {leader.name.display}
      </p>
      <p class="text-center text-xs text-gray-500 leading-tight">
        {leader.title}
      </p>
    </div>
  </div>
</div>

<style>
  /* Transition and state-driven flip — cannot be expressed as Tailwind class bindings */
  .card {
    transition: transform 0.5s ease;
    /* Explicit webkit prefix — do not rely on autoprefixer for iOS Safari reliability */
    -webkit-backface-visibility: hidden;
  }

  /* Tap/touch flip: driven by Svelte $state */
  .card.flipped {
    transform: rotateY(180deg);
  }

  /* Desktop hover flip: CSS-only, no JS needed */
  @media (hover: hover) {
    .scene:hover .card {
      transform: rotateY(180deg);
    }
    /* IMPORTANT: suppress JS-driven .flipped state on hover-capable devices.
       Without this, clicking a card on desktop locks it open — .card.flipped
       persists after mouseout, overriding the hover reset.
       Per research: @media (hover: hover) { .card.flipped { transform: none; } }
       lets the hover-driven CSS remain the sole controller on desktop. */
    .card.flipped {
      transform: none;
    }
    .scene {
      cursor: default;
    }
  }

  /* Touch: no hover, so .card.flipped class drives the flip */
  @media (hover: none) {
    .scene {
      cursor: pointer;
    }
  }
</style>

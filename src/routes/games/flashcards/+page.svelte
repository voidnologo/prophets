<svelte:head>
  <title>Flash Cards — Know Your Prophets</title>
</svelte:head>

<script lang="ts">
  import leaders from '$lib/data/leaders.json';
  import { base } from '$app/paths';
  import { shuffle, buildChoices, type Leader } from '$lib/flashcard-logic';

  const allLeaders = leaders.leaders as Leader[];

  // --- View state ---
  let view = $state<'start' | 'playing' | 'summary'>('start');

  // --- Deck state ---
  let deck = $state<Leader[]>([]);
  let currentIndex = $state(0);
  let choices = $state<Leader[]>([]);

  // --- Per-card state (reset each card) ---
  let eliminated = $state(new Set<string>());
  let firstTryUsed = $state(false);
  let answered = $state(false);

  // --- Session mode ---
  let isReplay = $state(false);

  // --- Session scoring state ---
  let firstTryCorrect = $state(0);
  let missedCards = $state<Leader[]>([]);

  // Derived — only safe to read when view === 'playing'
  let currentCard = $derived(deck[currentIndex]);

  function startGame(subset?: Leader[]) {
    window.scrollTo(0, 0);
    const source = subset ?? allLeaders;
    isReplay = !!subset;
    deck = shuffle(source);
    currentIndex = 0;
    firstTryCorrect = 0;
    missedCards = [];
    eliminated = new Set();
    firstTryUsed = false;
    answered = false;
    choices = buildChoices(deck[0], allLeaders);
    view = 'playing';
  }

  function handleGuess(choice: Leader) {
    if (answered) return; // guard: correct answer already found

    if (choice.id === currentCard.id) {
      // Correct answer found
      if (!firstTryUsed) {
        firstTryCorrect++;
      }
      // missedCards already tracked on first wrong guess — do not add again here
      answered = true;
    } else {
      // Wrong guess — eliminate choice, track as missed on first wrong guess
      eliminated = new Set([...eliminated, choice.id]);
      if (!firstTryUsed) {
        firstTryUsed = true;
        missedCards = [...missedCards, currentCard];
      }
    }
  }

  function nextCard() {
    const next = currentIndex + 1;
    if (next >= deck.length) {
      view = 'summary';
      return;
    }
    currentIndex = next;
    eliminated = new Set();
    firstTryUsed = false;
    answered = false;
    choices = buildChoices(deck[currentIndex], allLeaders);
  }
</script>

{#if view === 'start'}
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4">
    <h1 class="text-4xl font-bold text-gray-900 text-center">Flash Cards</h1>
    <p class="text-lg text-gray-600 text-center max-w-sm">
      Can you identify all 15 prophets from their photos?
    </p>
    <button
      onclick={() => startGame()}
      class="px-8 py-4 bg-blue-600 text-white text-xl font-semibold rounded-xl hover:bg-blue-700 transition-colors"
    >
      Start
    </button>
  </div>
{/if}

{#if view === 'playing' && currentCard}
  <!--
    Layout: flex column filling the viewport below the nav (nav is ~3.75rem tall).
    Photo is flex-1 so it expands/shrinks to consume whatever space is left after
    the fixed-size elements — no fixed pixel heights, scales to any device.
    Feedback row is always present (invisible until answered) to prevent layout
    shift that would resize the photo when Next button appears.
  -->
  <main
    class="max-w-lg mx-auto px-4 flex flex-col"
    style="height: calc(100dvh - 3.75rem);"
  >
    <!-- Progress indicator -->
    <p class="flex-shrink-0 pt-3 pb-1 text-sm text-gray-500 text-center">
      Card {currentIndex + 1} of {deck.length}
    </p>

    <!-- Leader photo — fills all remaining vertical space -->
    <div class="flex-1 min-h-0 flex items-center justify-center py-1">
      <img
        src="{base}/images/leaders/{currentCard.photo.filename}"
        alt="Who is this leader?"
        class="h-full w-auto max-w-full object-cover object-top rounded-xl shadow-lg"
      />
    </div>

    <!-- Question -->
    <p class="flex-shrink-0 text-base font-semibold text-gray-800 text-center py-2">Who is this?</p>

    <!-- Answer choices -->
    <div class="flex-shrink-0 space-y-2">
      {#each choices as choice (choice.id)}
        {@const isEliminated = eliminated.has(choice.id)}
        {@const isCorrect = answered && choice.id === currentCard.id}
        <button
          onclick={() => handleGuess(choice)}
          disabled={isEliminated || answered}
          class="w-full px-4 py-2 rounded-xl border-2 text-left font-medium transition-colors flex items-center gap-2
            {isCorrect
              ? 'bg-green-600 text-white border-green-600'
              : isEliminated
                ? 'bg-gray-100 text-gray-400 border-gray-200 line-through opacity-50 cursor-not-allowed'
                : 'bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'}"
          aria-disabled={isEliminated}
        >
          {#if isCorrect}
            <!-- Inline SVG checkmark — aria-hidden because sibling text conveys correctness -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-5 h-5 flex-shrink-0"
              aria-hidden="true"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 13.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          {/if}
          {choice.name.display}
        </button>
      {/each}
    </div>

    <!-- Feedback + Next — always occupies space (invisible until answered) to prevent layout shift -->
    <div
      class="flex-shrink-0 flex items-center justify-between gap-4 py-3
             {answered ? 'visible' : 'invisible'}"
    >
      <p class="text-green-700 font-semibold text-base">
        {firstTryUsed ? "You found it!" : "Yes! That's right."}
      </p>
      <button
        onclick={nextCard}
        class="flex-shrink-0 px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        Next
      </button>
    </div>
  </main>
{/if}

{#if view === 'summary'}
  <div class="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-4 text-center">
    <h2 class="text-3xl font-bold text-gray-900">
      {#if isReplay}
        Replay complete!
      {:else if missedCards.length === 0}
        Perfect score!
      {:else}
        {firstTryCorrect} out of {allLeaders.length} on your first try!
      {/if}
    </h2>
    <div class="flex flex-wrap gap-4 justify-center">
      <button
        onclick={() => startGame()}
        class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
      >
        Play Again
      </button>
      {#if !isReplay && missedCards.length > 0}
        <button
          onclick={() => startGame(missedCards)}
          class="px-6 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-colors border border-gray-300"
        >
          Replay Missed ({missedCards.length})
        </button>
      {/if}
    </div>
  </div>
{/if}

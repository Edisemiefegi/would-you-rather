<template>
  <main class="p-4">
    <Button
      @click="router.push('/')"
      variant="clear"
      class="flex items-center gap-2"
    >
      <i class="pi pi-arrow-left" />
      Back
    </Button>

    <section class="flex flex-col items-center gap-6 py-10 px-4">
      <GameLayout
        icon="pi pi-trophy"
        heading="Game Rules"
        text="Let the fun begin!"
      >
        <div class="flex flex-col items-center gap-4">
          <i class="pi pi-info-circle text-purple-500 text-3xl" />

          <h2 class="text-2xl font-bold text-center">Simple & Addictive!</h2>
        </div>
        <Button> game starts in ⏳ {{ timeLeft }}s </Button>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            v-for="(rule, index) in rules"
            :key="index"
            class="border border-purple-200 p-4 flex flex-col items-center gap-2"
          >
            <i :class="rule.icon" class="text-xl text-purple-600" />
            <h3 class="text-lg font-bold">{{ rule.title }}</h3>
            <p class="text-sm text-gray-600">{{ rule.description }}</p>
          </Card>
        </div>
      </GameLayout>
    </section>
  </main>
</template>

<script setup lang="ts">
import Button from "../components/base/Button.vue";
import Card from "../components/base/Card.vue";
import GameLayout from "../layout/GameLayout.vue";
import { useRouter } from "vue-router";
import { useGamestore } from "../store/game";
import { onMounted, watch, ref, onBeforeUnmount } from "vue";

const router = useRouter();
const store = useGamestore();

const timeLeft = ref(10);
let countdownInterval: number | null = null; 

const rules = [
  {
    icon: "pi pi-users",
    title: "Impossible Choices",
    description: "Each round presents a mind-bending dilemma",
  },
  {
    icon: "pi pi-question",
    title: "Beat the Clock",
    description: "Pick your answer before time runs out",
  },
  {
    icon: "pi pi-comments",
    title: "See the Results",
    description: "Compare your choice with other players",
  },
  {
    icon: "pi pi-star",
    title: "No Wrong Answers",
    description: "Just fun discoveries about everyone!",
  },
];

const gameId = store.currentGameId;

onMounted(() => {
  timeLeft.value = 10;
  store.listenToGame(gameId);

  countdownInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    }

    if (timeLeft.value === 0) {
      clearInterval(countdownInterval!); // stop timer
      store.rulesTimer(gameId); // trigger next game state
    }
  }, 1000); // run every 1 second
});

// Clear interval if user leaves the page/component
onBeforeUnmount(() => {
  if (countdownInterval) clearInterval(countdownInterval);
});

watch(
  () => store.gameStatus,
  (newStatus) => {
    if (newStatus === "playing") {
      router.push(`/game?id=${gameId}`);
    }
  }
);
</script>

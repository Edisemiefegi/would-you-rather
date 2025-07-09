<template>
  <main class="p-4">
    <section class="flex flex-col items-center gap-6 py-10 px-4">
      <GameLayout
        icon="pi pi-check-circle"
        heading="Round Results"
        text="See how your choice compares!"
      >
        <div class="flex flex-col items-center gap-3">
          <i class="pi pi-chart-bar text-3xl text-purple-500" />
          <p class="text-sm text-gray-500 font-semibold">You chose:</p>
          <Button
            size="small"
            variant="outline"
            class="border-purple-400 text-purple-600"
          >
            {{ selectedOption }}
          </Button>
        </div>

        <!-- Results -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            v-for="option in options"
            :key="option.label"
            class="border-2 border-purple-200 p-4 space-y-2"
          >
            <p class="text-xs text-gray-400 font-semibold">
              Option {{ option.label }}
            </p>
            <h3 class="font-bold text-lg">{{ option.text }}</h3>

            <div class="flex items-center gap-2 text-sm font-semibold">
              <span class="text-purple-600">{{ option.percentage }}%</span>
              <Progress
                :value="option.percentage"
                class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden"
              >
                <div
                  class="bg-purple-500 h-full rounded-full"
                  :style="{ width: option.percentage + '%' }"
                ></div>
              </Progress>
            </div>

            <span
              v-if="option.text === selectedOption"
              class="inline-block text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full"
            >
              You chose this
            </span>
          </Card>
        </div>

        <Button
          :disabled="loading"
          v-if="isHost"
          @click="goToNextRound"
          block
          size="large"
        >
          <i class="pi pi-arrow-right" />
          Next
        </Button>
      </GameLayout>
    </section>
  </main>
</template>

<script setup lang="ts">
import Button from "../components/base/Button.vue";
import Card from "../components/base/Card.vue";
import Progress from "../components/base/Progress.vue";
import GameLayout from "../layout/GameLayout.vue";
import { useGamestore } from "../store/game";
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, watch } from "vue";

const route = useRoute();
const router = useRouter();
const store = useGamestore();

const gameData = ref<any>(null);
const selectedOption = ref("");
const options = ref<{ label: string; text: string; percentage: number }[]>([]);
const round = ref(1);
const isHost = ref(false);
const loading = ref(false);

// watch(
//   () => route.query.round,
//   (newVal) => {
//     round.value = parseInt(newVal as string || '1');
//     loadResult(); // <-- refetch result data
//   }
// );


function updateResultDisplay(result: any) {
  selectedOption.value = result.answers[store.currentUserId];

  options.value = [
    {
      label: "A",
      text: result.question.option1,
      percentage: result.percentages?.[result.question.option1] || 0,
    },
    {
      label: "B",
      text: result.question.option2,
      percentage: result.percentages?.[result.question.option2] || 0,
    },
  ];
}


async function loadResult() {
  try {
    gameData.value = await store.getCurrentGameById(store.currentGameId);
    isHost.value = gameData.value.createdBy === store.currentUserId;

    const result = gameData.value.results.find(
      (r: any) => r.round === round.value
    );

    console.log(result, 'checking load ');
    
    if (!result) return;

   if (result) {
  updateResultDisplay(result);
}


  } catch (error) {
    console.log(error);
  }
}


watch(
  () => route.query.round,
  (newRound) => {
    const parsed = parseInt(newRound as string || "1");
    round.value = parsed;

    loadResult();

    store.listenForResult(parsed, (updatedResult) => {
      updateResultDisplay(updatedResult);
    });
  },
  { immediate: true }
);


function goToNextRound() {
  try {
    loading.value = true;
    const nextRound = round.value + 1;

    const totalRounds = parseInt(gameData.value.rounds);
    if (round.value < totalRounds) {
      store.nextRound(nextRound, totalRounds);

      // Navigate to the question or result page for the next round
    } else {
      router.push(`/summary?id=${store.currentGameId}`);
    }
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
 await  loadResult();
  store.listenToGame(store.currentGameId);
store.listenForResult(round.value, (updatedResult: any) => {
  updateResultDisplay(updatedResult);
});
  
});


watch(
  () => store.gameStatus,
  (newStatus) => {
    //  console.log("Watcher triggered. New status:", newStatus);
    if (newStatus === "playing") {
      const nextRound = round.value + 1;
      console.log(
        store.gameStatus,
        "resulttesting ",
        
      );

      console.log("Navigating to /game with:", {
  id: store.currentGameId,
  round: nextRound
});

 router.replace({
      path: "/game",
      query: { id: store.currentGameId, round: nextRound },
    });    }

      if (newStatus === "completed") {
           router.push(`/summary?id=${store.currentGameId}`);

      console.log(
       newStatus,
        "completdtesting ",
        
      );

}
  },

   { immediate: true } 
);
</script>

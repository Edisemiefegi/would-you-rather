<template>
  <main class="p-4">
    <section class="flex flex-col items-center gap-6 py-10 px-4">
      <GameLayout
        icon="pi pi-sparkles"
        heading="Would You Rather?"
        text="Make your pick and let the fun begin!"
      >
        <!-- Timer + Question Section -->
        <div class="flex justify-between items-center">
          <div></div>
          <div
            class="text-sm text-white bg-purple-500 px-3 py-1 rounded-full font-semibold"
          >
            ⏳ {{ timeLeft }}s
          </div>
        </div>

        <p class="text-xl font-semibold text-center text-gray-800 mt-2">
          Would you rather...
        </p>

        <!-- Options -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4"
          v-if="currentQuestion"
        >
          <Card
            @click="handleSelect(currentQuestion.option1)"
            class="text-center cursor-pointer border-2 border-purple-200 hover:border-purple-500 transition rounded-xl"
          >
            <p class="text-lg font-bold text-purple-700">
              {{ currentQuestion.option1 }}
            </p>
          </Card>

          <Card
            @click="handleSelect(currentQuestion.option2)"
            class="text-center cursor-pointer border-2 border-purple-200 hover:border-purple-500 transition rounded-xl"
          >
            <p class="text-lg font-bold text-purple-700">
              {{ currentQuestion.option2 }}
            </p>
          </Card>
        </div>

        <div v-if="isWaiting" class="text-center text-sm text-gray-500 mt-4">
          Waiting for other players to submit...
        </div>
      </GameLayout>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import GameLayout from "../layout/GameLayout.vue";
import Card from "../components/base/Card.vue";
import { useRouter, useRoute } from "vue-router";
import { useGamestore } from "../store/game";

const router = useRouter();
const route = useRoute();
const store = useGamestore();

type QuestionData = {
  option1: string;
  questioncategory: string;
  option2: string;
  questionid: number;
};

const currentQuestion = ref<QuestionData | null>(null);
const isWaiting = ref(false);
const timeLeft = ref(30);
const game = ref<any>(null);
const round = ref(parseInt(route.query.round as string) || 1);
// const intervalId = ref<any>(null);

// Fetch questions and start game
onMounted(async () => {
  try {
    game.value = await store.getCurrentGameById(store.currentGameId);

    currentQuestion.value = game.value.questions[round.value - 1];
    store.currentQuestion = currentQuestion.value;

    store.listenToGame(store.currentGameId);

    console.log(   currentQuestion.value, round.value,  "current questions ");
  } catch (error) {
    console.log(error);
  }
  // startTimer();
});

watch(
  () => store.gameStatus,
  (newStatus) => {
    if (newStatus === "showingResult") {
      store.listenForResult(round.value, () => {
 router.replace({
      path: "/result",
      query: { id: store.currentGameId, round: round.value },
    });      });
    }
  }
);

onUnmounted(() => {
  // clearInterval(intervalId);
});

// Timer logic
// function startTimer() {
//   timeLeft.value = 30;
//   intervalId = setInterval(() => {
//     if (timeLeft.value > 0) {
//       timeLeft.value--;
//     } else {
//       // goToNext();
//     }
//   }, 1000);
// }

function handleSelect(option: string) {
  try {
    store.currentQuestion = currentQuestion.value;
    store.submitAnswer(round.value, option);
    isWaiting.value = true;
  } catch (error) {
    console.log(error);
  }
}

// function goToNext() {
//   clearInterval(intervalId);
//   if (currentQuestionIndex.value + 1 < selectedQuestions.value.length) {
//     currentQuestionIndex.value++;
//     currentQuestion.value = selectedQuestions.value[currentQuestionIndex.value];
//     startTimer();
//   } else {
//     router.push("/result");
//   }
// }
</script>

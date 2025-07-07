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

        <!-- Question Text -->
        <p class="text-xl font-semibold text-center text-gray-800 mt-2">
          Would you rather...
        </p>

        <!-- Options -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <Card
          @click="nextGame(item)"
          v-for="item in gameoption" :key="item"
            class=" text-center cursor-pointer border-2 border-purple-200 hover:border-purple-500 transition rounded-xl"
          >
            <p class="text-lg font-bold text-purple-700">{{ item }}</p>
          </Card>

        
        </div>
      </GameLayout>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import GameLayout from "../layout/GameLayout.vue"; 
import Card from "../components/base/Card.vue";
import { useRouter } from "vue-router";


const router = useRouter()


const timeLeft = ref(30);
let intervalId: ReturnType<typeof setInterval>;

  const gameoption = ref(["Be invincible" , "Read minds"])

const nextGame = (item) => {
  router.push('/result')
}

onMounted(() => {
  intervalId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(intervalId);
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>

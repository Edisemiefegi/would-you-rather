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
          <Button size="small" variant="outline" class="border-purple-400 text-purple-600">
            {{ selectedOption }}
          </Button>
        </div>

        <!-- Results -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            v-for="(option) in options"
            :key="option.label"
            class="border-2 border-purple-200 p-4 space-y-2"
          >
            <p class="text-xs text-gray-400 font-semibold">Option {{ option.label }}</p>
            <h3 class="font-bold text-lg">{{ option.text }}</h3>

            <div class="flex items-center gap-2 text-sm font-semibold">
              <span class="text-purple-600">{{ option.percentage }}%</span>
              <Progress :value="option.percentage" class="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
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

        <Button block size="large">
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

const selectedOption = "Being invisible";

const options = [
  {
    label: "A",
    text: "Being invisible",
    percentage: 64,
  },
  {
    label: "B",
    text: "Reading minds",
    percentage: 36,
  },
];
</script>

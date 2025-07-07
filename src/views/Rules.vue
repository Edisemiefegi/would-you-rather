<template>
  <main class="p-4">
    <Button @click="router.push('/')" variant="clear" class="flex items-center gap-2">
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

          <h2 class="text-2xl font-bold text-center">
           Simple & Addictive!
          </h2>
        </div>

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

        <Button block size="large" @click="startGame()">
          <i class="pi pi-play" />
          Start Playing
        </Button>
      </GameLayout>
    </section>
  </main>
</template>

<script setup lang="ts">
import Button from "../components/base/Button.vue";
import Card from "../components/base/Card.vue";
import GameLayout from "../layout/GameLayout.vue";
import { useRouter } from "vue-router";

const router = useRouter()


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


const startGame = () => {
  router.push('/game')
}
</script>

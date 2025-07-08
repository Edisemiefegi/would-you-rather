<template>
  <main class="h-full pt-20 w-full space-y-20 md:px-0 px-6 bg-[#F5F8FC]">
    <section class="gap-10  flex flex-col items-center w-full h-full">
      <div class="flex gap-6">
        <Button size="large" class="animate-bounce">
          <i class="pi pi-th-large"></i>
        </Button>
        <Button variant="outline" rounded>
          <i class="pi pi-sparkles"></i> The Ultimate Party Game
        </Button>
      </div>
      <h1
        class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text text-4xl md:text-7xl font-bold"
      >
        Would You Rather?
      </h1>
      <p class="md:text-lg md:w-lg text-gray-600 text-center">
        Dive into the world of impossible choices! Create epic game rooms,
        challenge your friends, and discover what makes everyone tick through
        mind-bending dilemmas that'll spark endless conversations.
      </p>

      <div class="flex flex-wrap gap-5">
        <Button
          variant="outline"
          rounded
          class="shadow-md"
          v-for="item in buttons"
          :key="item.icon"
        >
          <i :class="item.icon"></i> {{ item.text }}
        </Button>
      </div>

      <div class="flex flex-col gap-6">
        <Card
        @click="startGame(item.path)"
          v-for="item in gameCard"
          :key="item.icon"
          class="flex flex-col gap-6 md:w-lg"
        >
          <div class="flex justify-between items-center w-full">
            <div class="flex gap-4">
              <Button  class="!rounded-xl"> <i :class="item.icon"></i> </Button>
              <div>
                <h1 class="md:text-3xl text-xl font-bold">{{ item.heading }}</h1>
                <p class="text-gray-600">{{ item.text }}</p>
              </div>
            </div>
            <i
              class="pi pi-arrow-right bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
            ></i>
          </div>
          <Button block size="large">
            <i :class="item.btnIcon"></i>
            {{ item.button }}
          </Button>
        </Card>
      </div>
    </section>

    <section
      class="container mx-auto gap-10 flex flex-col items-center w-full h-full"
    >
      <div class="space-y-4 text-center">
        <Button variant="outline" rounded>
          <i class="pi pi-star"></i> Simple & Addictive
        </Button>
        <h1 class="text-4xl font-bold">How It Works</h1>
        <p class="md:text-lg text-gray-600">
          Three simple steps to endless entertainment
        </p>
      </div>

      <div class="grid md:grid-cols-3 gap-6 grid-cols-1">
        <Card
          v-for="item in stepCard"
          :key="item?.button"
          class="flex items-center flex-col gap-6"
        >
          <Button size="large" class="!rounded-xl !text-2xl font-bold">
            {{ item.button }}
          </Button>
          <div class="text-center space-y-2">
            <h1 class="text-xl font-bold">{{ item.heading }}</h1>
            <p class="text-gray-600">{{ item.text }}</p>
          </div>
        </Card>
      </div>
    </section>

    <section class="w-full flex items-center flex-col pb-20">
      <Card rounded="large" class="flex md:w-md items-center flex-col gap-6">
        <div class="text-center space-y-2">
          <h1 class="text-xl font-bold">Ready to Start?</h1>
          <p class="text-gray-600">
            Join thousands of players making impossible choices!
          </p>
        </div>
        <Button @click="router.push('/create')" size="large" class="!rounded-xl">
          <i class="pi pi-caret-right"></i>
          Create Your First Game
        </Button>
      </Card>
    </section>
  </main>
</template>

<script setup lang="ts">
import {  useRouter } from "vue-router";
import Button from "../components/base/Button.vue";
import Card from "../components/base/Card.vue";
import { onMounted, ref,  } from "vue";
import { useGamestore } from "../store/game";


const store = useGamestore()

// console.log(game, store.currentUserId, 'sjssj');


const buttons = ref([
  {
    icon: "pi pi-users text-[#B46FF8]",
    text: "Multiplayer Fun",
  },
  {
    icon: "pi pi-clock text-[#3E84F6]",
    text: "Real-time Gameplay",
  },
  {
    icon: "pi pi-trophy text-[#EAB308]",
    text: "Competitive Scoring",
  },
]);

const gameCard = ref([
  {
    path: "/create",
    icon: "pi pi-caret-right",
    heading: "Create New Game",
    text: "Start your own epic Would You Rather session",
    button: "Let's Create Magic",
    btnIcon: "pi pi-sparkles",
  },
  {
    path: `lobby?id=${store.currentGameId}`,
    icon: "pi pi-users",
    heading: "Join Game",
    text: "Experience the fun with our interactive game",
    button: "Join Now",
    btnIcon: "pi pi-heart",
  },
]);

const stepCard = ref([
  {
    heading: "Create or Join",
    text: "Start a new game room or join friends with a game code. It's that simple!",
    button: 1,
  },
  {
    heading: "Make Choices",
    text: "Pick between two impossible options in each round. Every choice reveals something new",
    button: 2,
  },
  {
    heading: "Compare & Compete",
    text: "See how your choices stack up against friends and climb the leaderboard!",
    button: 3,
  },
]);


onMounted(() => {
// store.uploadQuestions()
console.log('sgsg');

})


const router = useRouter()

const startGame = (item: string) => {
router.push(item)
}
</script>

<style scoped></style>

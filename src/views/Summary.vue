<template>
  <div class="container w-xl  py-10 mx-auto lg:px-0 px-4">
    <GameLayout
      :heading="' You have completed  this game 🥳☺ hope you had fun!! 💃'"
    >
      <div class="space-y-2">
        <div class="flex justify-between">
          <p>By clicking this you will be starting a new game</p>
          <Button>Play again</Button>
        </div>
        <div class="flex justify-between">
          <p>By clicking this you are deleting this game</p>
          <Button @click="handleExit">Exit game </Button>
        </div>
      </div>
    </GameLayout>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "../components/base/Button.vue";
import GameLayout from "../layout/GameLayout.vue";
import { useGamestore } from "../store/game";

const store = useGamestore()
const router = useRouter()

async function handleExit() {
  try {
    if (store.gameStatus === "completed") {
      await store.deleteGame(store.currentGameId);
    }

    router.push("/"); 
  } catch (error) {
    console.error("Error exiting game:", error);
  }
}

</script>

<style scoped></style>

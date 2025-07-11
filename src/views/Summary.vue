<template>
  <div class="container w-fit md:w-xl py-10 mx-auto lg:px-0 px-6">
    <GameLayout
      :heading="'You have completed this game 🥳☺ Hope you had fun!! 💃'"
    >
      <div class="space-y-4">
        <div v-if="isHost">
          <div class="flex justify-between items-center">
            <p>By clicking this you are deleting this game</p>
            <Button @click="handleExit">Exit Game</Button>
          </div>
        </div>

        <p v-else class="text-center text-gray-600 font-semibold">
          🎉 This game has ended. Thanks for playing!
        </p>
      </div>
    </GameLayout>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { useGamestore } from "../store/game";
import Button from "../components/base/Button.vue";
import GameLayout from "../layout/GameLayout.vue";

const store = useGamestore();
const router = useRouter();
const isHost = ref(false);

async function handleExit() {
  try {
    if (store.gameStatus === "completed") {
      await store.deleteGame(store.currentGameId);
      alert("The game was deleted.");
    }
    router.push("/");
  } catch (error) {
    console.error("Error exiting game:", error);
  }
}

onMounted(async () => {
  // Determine if current user is the host
  const game = await store.getCurrentGameById(store.currentGameId);
  isHost.value = game?.createdBy === store.currentUserId;
});
</script>

<style scoped></style>

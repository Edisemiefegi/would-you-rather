<template>
  <main class="p-4">
    <Button
      @click="router.push('/')"
      variant="clear"
      class="flex items-center gap-2"
    >
      <i class="pi pi-arrow-left" />
      Exit Game
    </Button>

    <section class="flex flex-col items-center gap-6 py-10 px-4">
      <GameLayout
        :heading="gameData?.topicCategory"
        icon="pi pi-sparkles"
        :tags="preview"
      >
        <div class="text-center space-y-3">
          <h2 class="text-2xl font-bold">Game Lobby</h2>
          <p>Share this code with friends!</p>
          <Button
            variant="outline"
            size="large"
            class="text-purple-500 border-purple-400"
          >
            game-{{ gameId }}
          </Button>
        </div>

        <div>
          <p class="text-xl font-bold mb-2">
            <i class="pi pi-users text-purple-600" />
            Players in Lobby
            {{ `(${store?.participants.length}/ ${gameData?.maxPlayers})` }}
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card
              v-for="item in cards"
              :key="item.name"
              class="border-2 flex gap-2 flex-col justify-center items-center border-purple-100"
            >
              <p class="font-bold">{{ item.icon }}</p>
              <p class="font-bold">{{ item.name }}</p>
              <Button
                variant="outline"
                size="small"
                rounded
                class="text-green-600 flex items-center gap-2 border-green-400 text-sm"
              >
                <span class="w-2 h-2 bg-green-600 rounded-full"></span>Ready
              </Button>
            </Card>
          </div>
        </div>

        <Button
          block
          size="large"
          @click="startGame()"
          v-if="gameData?.createdBy === store.currentUserId"
        >
          <i class="pi pi-trophy" />
          Start Epic Game Room
        </Button>
      </GameLayout>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Button from "../components/base/Button.vue";
import Card from "../components/base/Card.vue";
import GameLayout from "../layout/GameLayout.vue";
import { useRouter, useRoute } from "vue-router";
import { useGamestore } from "../store/game";
import type { GameData } from "../types";

const store = useGamestore();

const router = useRouter();
const route = useRoute();
// const cards = ref<any[]>([]);
const preview = ref<string[]>([]);
const gameData = ref<GameData | null>(null);
const gameId = route.query.id as string;

const cards = computed(() => store.participants);

onMounted(async () => {
  try {
    if (!gameId || !store.currentUserId) return;
    console.log(gameId, "gameid ");

    const game = await store.getLobbyGame(gameId);
    gameData.value = game;
        console.log(gameData.value, "data");


    if (!game) return;

    const alreadyJoined = gameData.value?.participants?.some(
      (p) => {
        console.log(p, 'ppp');
        
        p?.userId === store.currentUserId
        
      }
    );

    if (!alreadyJoined) {
      const name = prompt("Enter your name to join the game:");
      if (!name) return;

      // Set current user info
      store.setCurrentUser(store.currentUserId, name);

      if (game.participants.length >= parseInt(game.maxPlayers)) {
        alert("Game lobby is full!");
        router.push("/");
        return;
      }

      // Add to game
      await store.joinGame(gameId, store.currentUserId, name);
    }

    preview.value = [
      `${game.rounds} rounds`,
      `${game.time}s per round`,
      `Up to ${game.maxPlayers} players`,
    ];

    store.listenToGame(gameId);
  } catch (error) {
    console.log(error);
  }
});

const startGame = () => {
  router.push("/rules");
};
</script>

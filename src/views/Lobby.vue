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

    <section
      v-if="!showJoinForm"
      class="flex flex-col items-center gap-6 py-10 px-4"
    >
      <GameLayout
        :heading="gameData?.topicCategory"
        icon="pi pi-sparkles"
        :tags="preview"
      >
        <div class="text-center space-y-3">
          <h2 class="text-2xl font-bold">Game Lobby</h2>
          <p>Share this code with friends!</p>
          <Button
          @click="copyLinkToClipboard"
            variant="outline"
            size="large"
            class="text-purple-500 border-purple-400"
          >
            {{ shareableLink }}
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
              <!-- <p class="font-bold">{{ item?.icon }}</p> -->
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

    <div v-if="showJoinForm" class="px-4 lg:px-0 container mx-auto">
      <GameLayout
        heading="To Join game please enter a username"
        icon="pi pi-sparkles"
      >
        <div class="space-y-3">
          <Input type="text" v-model="name" placeholder="Enter your name.." />
          <Button @click="joinGame">Join Game</Button>
        </div>
      </GameLayout>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, } from "vue";
import Button from "../components/base/Button.vue";
import Card from "../components/base/Card.vue";
import GameLayout from "../layout/GameLayout.vue";
import { useRouter, useRoute } from "vue-router";
import { useGamestore } from "../store/game";
import type { GameData } from "../types";
import Input from "../components/base/Input.vue";

const store = useGamestore();

const router = useRouter();
const route = useRoute();
const preview = ref<string[]>([]);
const gameData = ref<GameData | null>(null);
const gameId = route.query.id as string;
const name = ref("");
const showJoinForm = ref(false);

const cards = computed(() => store.participants);

const shareableLink = `${window.location.origin}?#/lobby?id=${gameId}`;
const copyLinkToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareableLink);
    alert('Game link copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

type Participant = { userId: string; name: string };

import { } from 'vue';

// watchEffect(async () => {
//   if (!gameId) return;
//     if (!store.currentUserId) {
//     showJoinForm.value = true;
//     return;
//   }
//   try {
//     const game = await store.getLobbyGame(gameId);
//     gameData.value = game;

//     if (!game) return;

//     const isCreator = game.createdBy === store.currentUserId;

//    if (!isCreator) {
//         const alreadyJoined = (game.participants as Participant[]).some(
//           (p) => p.userId === store.currentUserId
//         );

//         if (!alreadyJoined) {
//           showJoinForm.value = true;
//           return;
//         }
//       } else {
//         const creatorData = (game.participants as Participant[]).find(
//           (p) => p.userId === store.currentUserId
//         );
//         if (creatorData) {
//           store.setCurrentUser(creatorData.userId, creatorData.name);
//         }
//       }

//     preview.value = [
//       `${game.rounds} rounds`,
//       `${game.time}s per round`,
//       `Up to ${game.maxPlayers} players`,
//     ];

//     store.listenToGame(gameId);
//   } catch (error) {
//     console.log(error);
//   }
// });



onMounted(async () => {
  try {
    if (!gameId || !store.currentUserId) return;

    console.log(gameId, store.currentUserId, 'ssjj');
    

    const game = await store.getLobbyGame(gameId);
    gameData.value = game;

    
    if (!game) return;

    const isCreator = game.createdBy === store.currentUserId;

    if (!isCreator) {
      const alreadyJoined = (game.participants as Participant[]).some((p) => {
        console.log(p, "already");

        p.userId === store.currentUserId;
      });

      if (!alreadyJoined) {
        showJoinForm.value = true;
        return;
      }
    } else {
      const creatorData = (game.participants as Participant[]).find(
        (p) => p.userId === store.currentUserId
      );

      if (creatorData) {
        store.setCurrentUser(creatorData.userId, creatorData.name);
      }
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

const joinGame = async () => {
  if (!name.value.trim()) return;

  await store.joinGame(gameId, store.currentUserId, name.value);
  store.setCurrentUser(store.currentUserId, name.value);

  showJoinForm.value = false;

  preview.value = [
    `${gameData.value?.rounds} rounds`,
    `${gameData.value?.time}s per round`,
    `Up to ${gameData.value?.maxPlayers} players`,
  ];

  store.listenToGame(gameId);
};

const startGame = () => {
  router.push("/rules");
};
</script>

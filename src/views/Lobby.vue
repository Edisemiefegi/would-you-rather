<template>
  <main class="p-4">
    <Button @click="handleExit" variant="clear" class="flex items-center gap-2">
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
                <span
                  class="w-1.5 h-1.5 bg-green-600 animate-ping rounded-full"
                ></span
                >Ready
              </Button>
            </Card>
          </div>
        </div>

        <Button
        :loading="isLoading" :disabled="isDisabled"
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
import { ref, onMounted, computed, watch } from "vue";
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
const isLoading = ref(false)
const isDisabled = ref(false)

type Participant = { userId: string; name: string };

const cards = computed(() => store.participants);

const shareableLink = `${window.location.origin}?#/lobby?id=${gameId}`;

const copyLinkToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(shareableLink);
    alert("Game link copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
  }
};

onMounted(async () => {
  try {
    if (!gameId || !store.currentUserId) return;

    const game = await store.getLobbyGame(gameId);
    gameData.value = game;

    if (!game) return;

    const isCreator = game.createdBy === store.currentUserId;
    const currentParticipants = game.participants as Participant[];
    const alreadyJoined = currentParticipants.some(
      (p) => p.userId === store.currentUserId
    );

    const currentCount = currentParticipants.length;
    const maxCount = parseInt(game.maxPlayers ?? "0");

    // If the user has NOT joined yet and lobby is FULL block them
    if (!alreadyJoined && currentCount >= maxCount) {
      alert(
        "This game is full. You can create your own game and share your link."
      );
      return router.push("/");
    }

    if (isCreator || alreadyJoined) {
      const user = currentParticipants.find(
        (p) => p.userId === store.currentUserId
      );
      if (user) {
        store.setCurrentUser(user.userId, user.name);
      }
    } else {
      showJoinForm.value = true;
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

// allow users to join game through the shared link
const joinGame = async () => {
  try {
    if (!name.value.trim()) return;

    const currentCount = store.participants.length;
    const maxCount = parseInt(gameData.value?.maxPlayers ?? "0");

    if (currentCount >= maxCount) {
      alert("This game has already reached the maximum number of players.");
      return router.push("/");
    }

    await store.joinGame(gameId, store.currentUserId, name.value);
    store.setCurrentUser(store.currentUserId, name.value);

    showJoinForm.value = false;

    preview.value = [
      `${gameData.value?.rounds} rounds`,
      `${gameData.value?.time}s per round`,
      `Up to ${gameData.value?.maxPlayers} players`,
    ];

    store.listenToGame(gameId);
  } catch (error) {
    console.log(error);
  }
};

const startGame = () => {
  try {
      isLoading.value = true
    isDisabled.value = true
      store.startGame(gameId);

  } catch (error) {
    
  }finally{
    isLoading.value = false
    isDisabled.value = false
  }
};

// run a callback func when ever gamestatus changes
watch(
  () => store.gameStatus,
  (newStatus) => {
    if (newStatus === "rules") {
      router.push(`/rules?id=${gameId}`);
    }
  }
);

function handleExit() {
  try {
    store.deleteGame(gameId);
    router.push("/");
  } catch (error) {
    console.error("Error exiting game:", error);
  }
}
</script>

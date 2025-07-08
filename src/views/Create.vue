<template>
  <main class="p-4">
    <Button
      @click="router.push('/')"
      variant="clear"
      class="flex items-center gap-2"
    >
      <i class="pi pi-arrow-left" />
      Back to Home
    </Button>

    <section class="flex flex-col items-center gap-6 py-10 px-4">
      <div
        class="w-40 h-40 animate-pulse bg-gray-100 rounded-full flex items-center justify-center"
      >
        <Button size="large" class="animate-bounce">
          <i class="pi pi-sparkles" />
        </Button>
      </div>

      <div class="text-center space-y-1">
        <h1
          class="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
        >
          Create Your Game
        </h1>
        <p class="text-gray-600">
          Set up your epic "Would You Rather" adventure!
        </p>
      </div>

      <!-- GameLayout  -->
      <GameLayout
        heading="Game Configuration"
        text="Customize your perfect game experience"
      >
        <!-- Form -->
        <form class="space-y-6">
          <div>
            <div class="flex items-center justify-center gap-4">
              <Select
                v-model="selectedTopic"
                :options="topic.option"
                :label="topic.label"
                :placeholder="'pick a topic to start'"
              />
              <Input
                class="mt-6"
                type="text"
                v-model="name"
                placeholder="Enter your name.."
              />
            </div>
          </div>

          <!--  Select Fields -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              v-for="(setting, key) in settings"
              :key="key"
              v-model="selected[key]"
              :options="setting.options"
              :label="setting.label"
              :placeholder="`Select ${setting.label.text}`"
            />
          </div>

          <!-- Preview -->
          <Card class="border-2 border-purple-100">
            <div>
              <p class="flex mb-2 gap-2 font-bold">
                <i class="pi pi-sparkles text-purple-500" />
                <span>Game Preview</span>
              </p>
              <div class="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="small"
                  rounded
                  v-for="item in preview"
                  :key="item"
                  class="text-violet-600 border-violet-400 text-sm"
                >
                  {{ item }}
                </Button>
              </div>
            </div>
          </Card>

          <Button block size="large" @click="CreatGame()">
            <i class="pi pi-trophy"></i>
            Create Epic Game Room
          </Button>
        </form>
      </GameLayout>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Button from "../components/base/Button.vue";
import Card from "../components/base/Card.vue";
import Select from "../components/base/Select.vue";
import GameLayout from "../layout/GameLayout.vue";
import Input from "../components/base/Input.vue";
import { useRouter } from "vue-router";
import { useGamestore } from "../store/game";
import { auth } from "../service/firebase";

const store = useGamestore();

const router = useRouter();

const name = ref("");
const selectedTopic = ref("");

type Option = { label: string; value: string };

interface SelectSetting {
  options: Option[];
  label: {
    text: string;
    icon: string;
  };
}
const topic = {
  option: [
    { label: "Funny", value: "funny" },
    { label: "Food", value: "food" },
    { label: "Travel", value: "travel" },
    { label: "Relationships", value: "relationships" },
    { label: "Superpowers", value: "superpowers" },
    { label: "Lifestyle", value: "lifestyle" },
    { label: "Tech", value: "tech" },
    { label: "Random", value: "random" },
    { label: "Deep", value: "deep" },
    { label: "School", value: "school" },
    { label: "Career", value: "career" },
    { label: "Gaming", value: "gaming" },
    { label: "Entertainment", value: "entertainment" },
    { label: "Sports", value: "sports" },
    { label: "Friendship", value: "friendship" },
    { label: "Family", value: "family" },
    { label: "Money", value: "money" },
    { label: "Health", value: "health" },
    { label: "Animals", value: "animals" },
    { label: "Fantasy", value: "fantasy" },
  ],
  label: { text: "Game Title", icon: "pi pi-trophy text-amber-500" },
};

const preview = computed(() => {
  const topicLabel =
    topic.option.find((t: any) => t.value === selectedTopic.value)?.label ||
    "No topic selected";

  const rounds = selected.value.rounds
    ? `${selected.value.rounds} rounds`
    : "Rounds not selected";
  const time = selected.value.time
    ? `${selected.value.time}s per round`
    : "Time not selected";
  const players = selected.value.players
    ? `Up to ${selected.value.players} players`
    : "Players not selected";

  return [topicLabel, rounds, time, players];
});

const settings: Record<string, SelectSetting> = {
  rounds: {
    label: { text: "Rounds", icon: "pi pi-refresh text-purple-500" },
    options: [
      { label: "5 rounds", value: "5" },
      { label: "7 rounds", value: "7" },
      { label: "10 rounds", value: "10" },
      { label: "15 rounds", value: "15" },
    ],
  },
  time: {
    label: { text: "Time Limit", icon: "pi pi-clock text-yellow-500" },
    options: [
      { label: "15 seconds", value: "15" },
      { label: "20 seconds", value: "20" },
      { label: "25 seconds", value: "25" },
      { label: "30 seconds", value: "30" },
    ],
  },
  players: {
    label: { text: "Number of Players", icon: "pi pi-users pi-blue-500" },
    options: [
      { label: "2 players", value: "2" },
      { label: "6 players", value: "6" },
      { label: "10 players", value: "10" },
      { label: "20 players", value: "20" },
    ],
  },
};

const selected = ref<Record<string, string>>({
  rounds: "",
  time: "",
  players: "",
});

const CreatGame = async () => {
  if (
    !name.value ||
    !selectedTopic.value ||
    !selected.value.rounds ||
    !selected.value.time ||
    !selected.value.players
  ) {
    alert("Please fill all fields!");
    return;
  }

  const userId = auth.currentUser?.uid;

  if (!userId) {
    console.error("userId not found");
    return;
  }

  const gameId = await store.createGame({
    title: selectedTopic.value,
    topicCategory: selectedTopic.value,
    rounds: selected.value.rounds,
    time: selected.value.time,
    maxPlayers: selected.value.players,
    createdBy: userId,
    userName: name.value,
  });

  console.log(gameId, store.currentGameId, "userinputs");

  router.push(`lobby?id=${store.currentGameId}`);
};
</script>

<template>
  <Card class="w-full max-w-2xl !p-0">
    <div class="flex flex-col">
      <!-- Header -->
      <div
        class="py-8 text-center flex flex-col items-center gap-3 text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
      >
        <Button v-if="icon">
          <i :class="icon" />
        </Button>

        <h2 class="text-2xl font-bold">{{ heading }}</h2>

        <p v-if="text" class=" text-white">{{ text }}</p>

        <div v-if="tags?.length" class="flex flex-wrap gap-3 items-center">
          <Button
            v-for="item in tags"
            :key="item"
            size="small"
            rounded
            variant="outline"
            class="bg-neutral-50 text-black"
          >
            {{ item }}
          </Button>
        </div>
      </div>

      <div class="p-8 space-y-6">
        <slot />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Button from "../components/base/Button.vue";
import Card from "../components/base/Card.vue";

defineProps<{
  heading: string;
  text?: string;
  icon?: string;
  tags?: string[];
}>();
</script>

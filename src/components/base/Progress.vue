<template>
  <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <div
      class="h-full bg-purple-500 transition-all duration-500 ease-in-out"
      :style="{ width: value + '%' }"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  value: number;
}>();
</script>

<template>
  <input
    v-bind="$attrs"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :class="Inputstyle"
  />
</template>

<script setup lang="ts">
defineProps(['modelValue']);
defineEmits(['update:modelValue']);

const Inputstyle =
  "w-full h-fit border-2 border-violet-400 rounded-md px-3 py-1.5 outline-none";
</script>

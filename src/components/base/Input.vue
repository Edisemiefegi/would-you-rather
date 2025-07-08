<template>
  <input
    v-bind="$attrs"
    :value="modelValue"
    @input="onInput"
    :class="Inputstyle"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | null;
  if (target) emit('update:modelValue', target.value);
};

const Inputstyle =
  "w-full h-fit border-2 border-violet-400 rounded-md px-3 py-1.5 outline-none";
</script>

<template>
  <div class="w-full">
    <label v-if="label" class=" mb-2 text-sm font-bold flex items-center gap-1">
      <i v-if="label.icon" :class="label.icon" class=""></i>
      {{ label.text }}
    </label>

    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="w-full px-2 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
    >
      <option value="" disabled hidden>{{ placeholder || 'Select an option' }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

interface Option {
  label?: string;
  value?: string | number;
}

interface Label {
  text: string;
  icon?: string;
}

defineProps<{
  modelValue: string | number;
  options?: Option[];
  placeholder?: string;
  label?: Label;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();
</script>

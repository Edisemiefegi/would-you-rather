<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

type Rounded = "default" | "large" | "small";

export interface CardProp {
  rounded?: Rounded;
}

const props = withDefaults(defineProps<CardProp>(), {
  rounded: "default",
});

const ROUNDED_CLASS: Record<Rounded, string> = {
  small: "rounded-sm",
  default: " rounded-md",
  large: "rounded-2xl",
};

const cardClass = computed(() => {
  const { rounded } = props;

  const style = "p-8 shadow-md bg-white w-full";

  const Roundedstyle = ROUNDED_CLASS[rounded];

  return style + `${Roundedstyle}`;
});
</script>

<style scoped></style>

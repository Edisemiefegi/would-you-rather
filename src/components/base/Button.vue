<template>

    <button  :disabled="props.disabled || props.loading" v-bind="$attrs" :class="btnClass">
       <span v-if="props.loading" class="loader mr-2">
        <i class="pi pi-spin pi-spinner"></i>
       </span>
    <slot />
  </button>

</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";


type SizeType = "default" | "small" | "large" | "icon";
type VariantType = "default" | "outline" | "clear" ;

export interface ButtonProps {
  size?: SizeType
  rounded?: boolean;
  block?: boolean;
  variant?: VariantType
   loading?: boolean;
  disabled?: boolean;
}

// defineProps<ButtonProps>() ==> prop

//withDefaults(prop, defaultvalues)

const props = withDefaults(defineProps<ButtonProps>(), {
  rounded: false,
  block: false,
  size: "default",
  variant: "default",
   loading: false,
  disabled: false,
});

const SIZE_CLASS: Record<SizeType, string> = {
  small: "px-2 py-0.5 text-sm",
  default: "px-4 py-1.5 text-md",
  large: "px-8 py-3 text-lg",
  icon: "size-10",
};

const VARIANT_CLASS: Record<VariantType, string> = {
  default: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white ',
  outline: 'border bg-white  border-gray-200',
  clear: '',
}

const btnClass = computed(() => {
  const { size, block, rounded, variant  } = props;
  const styles = 'cursor-pointer   hover:opacity-75 '; //default styles

  const sizeStyle = SIZE_CLASS[size];
  const blockStyle = block ? 'w-full' : 'w-fit'
  const roundedStyle = rounded ? 'rounded-full' : 'rounded-md'
  const variantStyle = VARIANT_CLASS[variant]

  return styles + ` ${sizeStyle} ${blockStyle} ${roundedStyle} ${variantStyle}`
});
</script>

<style scoped></style>

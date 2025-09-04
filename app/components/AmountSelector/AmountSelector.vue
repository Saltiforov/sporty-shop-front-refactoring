<template>
  <div :style="style" class="flex items-center gap-1.5 w-[108px]">
    <VButton
      :pt="{ root: { style: { ...btnStyle, background: 'transparent', border: 'none', padding: 0 } } }"
      class="flex items-center justify-center"
      :disabled="model <= min"
      aria-label="Decrease"
      @click="decrement"
    >
      <UiIcon name="minus" :size="iconSize" color="#7F7F7F" />
    </VButton>

    <input
      v-model.number="model"
      type="text"
      :style="inputStyles"
      :class="inputClass"
      class="w-[32px] h-[34px] bg-transparent border border-[#ADADAD] text-[#000000] text-center text-[16px] fw-400 rounded-[8px] focus:outline-none"
      :min="min"
      :max="max"
      @input="clamp"
    >

    <VButton
      :pt="{ root: { style: { ...btnStyle, background: 'transparent', border: 'none', padding: 0 } } }"
      class="flex items-center justify-center"
      :disabled="model >= max"
      aria-label="Increase"
      @click="increment"
    >
      <UiIcon name="plus" :size="iconSize" color="#7F7F7F" />
    </VButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  min?: number | string
  max?: number | string
  style?: Record<string, any>
  inputStyles?: Record<string, any>
  inputClass?: string
  amountSelectorButton?: { width?: string; height?: string; size?: number | string }
}>();

const model = defineModel<number>({ default: 1 });

const min = computed(() => Number(props.min ?? 1));
const max = computed(() => Number(props.max ?? 10));

const btnStyle = computed(() => ({
  width: props.amountSelectorButton?.width ?? '34px',
  height: props.amountSelectorButton?.height ?? '34px',
}));
const iconSize = computed(() => props.amountSelectorButton?.size ?? 20);

const clamp = () => {
  if (Number.isNaN(model.value)) model.value = min.value;
  if (model.value < min.value) model.value = min.value;
  if (model.value > max.value) model.value = max.value;
};

const increment = () => {
  if (model.value < max.value) model.value += 1;
};
const decrement = () => {
  if (model.value > min.value) model.value -= 1;
};
</script>

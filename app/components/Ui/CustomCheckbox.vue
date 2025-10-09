<template>
  <label
    class="custom-checkbox"
    :class="{ 'is-checked': isChecked, 'is-disabled': disabled }"
  >
    <input
      v-model="isChecked"
      type="checkbox"
      class="hidden-input"
      :checked="isChecked"
      :disabled="disabled"
    >
    <div
      class="checkbox-box"
      :style="{
        borderColor: isChecked
          ? props.checkedBorderColor
          : props.uncheckedBorderColor,
        borderRadius: props.borderRadius,
      }"
    >
      <svg v-if="isChecked" class="check-icon" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l6 5L19 6" :stroke="strokeColor" stroke-width="3" />
      </svg>
    </div>
    <span class="label">
      <slot />
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  disabled: Boolean,
  borderColor: {
    type: String,
    default: 'var(--color-primary-blue)',
  },
  strokeColor: {
    type: String,
    default: 'var(--color-primary-blue)',
  },
  checkedBorderColor: {
    type: String,
    default: 'var(--color-primary-blue)',
  },
  uncheckedBorderColor: {
    type: String,
    default: 'var(--color-primary-blue)',
  },
  borderRadius: {
    type: String,
    default: '0px',
  },
});

const emit = defineEmits(['update:modelValue']);


const isChecked = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value);
  },
});

</script>

<style scoped>
.custom-checkbox {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}
.hidden-input {
  display: none;
}
.checkbox-box {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-primary-blue);
  margin-right: 8px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
}
.custom-checkbox.is-checked .checkbox-box {
  background-color: transparent;
  border-color: var(--color-primary-blue, #3b82f6);
}
.check-icon {
  width: 14px;
  height: 14px;
}
.custom-checkbox.is-disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.label {
  font-size: 14px;
}
</style>

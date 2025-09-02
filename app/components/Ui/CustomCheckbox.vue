<template>
  <label
      class="custom-checkbox"
      :class="{ 'is-checked': isChecked, 'is-disabled': disabled }"
  >
    <input
        type="checkbox"
        class="hidden-input"
        :checked="isChecked"
        :disabled="disabled"
        @change="toggle"
    >
    <div
        class="checkbox-box"
        :style="{
        borderColor: isChecked ? props.checkedBorderColor : props.uncheckedBorderColor,
        borderRadius: props.borderRadius
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

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: [Boolean, String, Number],
  trueValue: {
    type: [Boolean, String, Number],
    default: true,
  },
  falseValue: {
    type: [Boolean, String, Number],
    default: false,
  },
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

const isChecked = computed(() => props.modelValue === props.trueValue);

const toggle = () => {
  if (props.disabled) return;
  emit('update:modelValue', isChecked.value ? props.falseValue : props.trueValue);
};
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

<template>
  <div :style="style" class="counter-container w-[108px] flex items-center gap-[4px]">
    <Button :pt="{
      root: {
        style: {
          backgroundColor: 'transparent',
          border: 'none',
          padding: '0',
        }
      }
    }" @click="decrement" class="w-[34px] h-[34px] flex items-center justify-center border rounded">
      <svg :width="amountSelectorButton.width" :height="amountSelectorButton.height" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6 10H14M10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19Z"
            stroke="#7F7F7F" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            style="mix-blend-mode:luminosity"/>
        <path
            d="M6 10H14M10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19Z"
            stroke="#3D3D3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            style="mix-blend-mode:overlay"/>
      </svg>

    </Button>

    <input
        type="text"
        :style="inputStyles"
        :class="inputClass"
        class="w-[32px] h-[34px] bg-transparent border border-[#ADADAD] text-[#000000] text-center text-[16px] fw-400 rounded-[8px] focus:outline-none"
        v-model="inputValue"
        :min="min"
        :max="max"
        @input="onInput"
    />

    <Button :pt="{
      root: {
       style: {
          backgroundColor: 'transparent',
          border: 'none',
          padding: '0',
        }
      }
    }" @click="increment" class="w-[34px] h-[34px] flex items-center justify-center border rounded">
      <svg :width="amountSelectorButton.width" :height="amountSelectorButton.height" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M6 10H10M10 10H14M10 10V14M10 10V6M10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19Z"
            stroke="#7F7F7F" stroke-opacity="0.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            style="mix-blend-mode:luminosity"/>
        <path
            d="M6 10H10M10 10H14M10 10V14M10 10V6M10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10C19 14.9706 14.9706 19 10 19Z"
            stroke="#3D3D3D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            style="mix-blend-mode:overlay"/>
      </svg>
    </Button>
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
  style: {type: Object},
  inputStyles: {type: Object},
  inputClass: {type: String},
  min: {type: Number, default: 1},
  max: {type: Number, default: 10},
  modelValue: {type: Number, required: true, default: 1},
  amountSelectorButton: {
    type: Object,
    required: false,
    default: () => ({
      width: '20px',
      height: '20px'
    })
  }

})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue.toString())

const onInput = () => {
  const num = Number(inputValue.value)

  if (isNaN(num)) return

  if (num > props.max) {
    inputValue.value = props.max.toString()
  } else if (num < props.min) {
    inputValue.value = props.min.toString()
  } else {
    emit('update:modelValue', num)
  }
}

const increment = () => {
  if (props.modelValue < props.max) emit('update:modelValue', props.modelValue + 1)
}

const decrement = () => {
  if (props.modelValue > props.min) emit('update:modelValue', props.modelValue - 1)
}

watch(() => props.modelValue, (newVal) => {
  inputValue.value = newVal.toString()
})
</script>

<style scoped>
.amount-selector-button {
  background: transparent;
  border: none;
  padding: 0;
}

.amount-selector-button:hover {
  background: transparent;
  border: none;
}
</style>

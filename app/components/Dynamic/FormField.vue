<template>
  <VFormField class="flex flex-col gap-2">
    <slot />
  </VFormField>
</template>

<script setup>
import { provide } from 'vue';

const props = defineProps({
  groupId: {
    type: String,
    default: undefined
  },
  name: {
    type: String,
    default: undefined
  }
});

provide('$fcDynamicFormField', {
  groupId: props.groupId,
  name: props.name
});
</script>

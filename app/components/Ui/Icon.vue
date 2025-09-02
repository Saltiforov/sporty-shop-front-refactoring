<!-- Icon.vue -->
<script setup lang="ts">
const props = withDefaults(defineProps<{
  name: string
  size?: number | string
  title?: string
  class?: string
}>(), {
  size: 24,
  class: 'icon',
});
const href = computed(() => `#icon-${props.name}`);
</script>

<template>
  <svg
    :class="class"
    :width="size"
    :height="size"
  >
  <title v-if="title">{{ title }}</title>
  <use :href="href" />
  </svg>
</template>

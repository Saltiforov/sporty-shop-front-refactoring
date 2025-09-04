<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    name: string
    size?: number | string
    title?: string
    className?: string
    color?: string
  }>(),
  {
    size: 24,
    className: 'icon',
    title: '',
  },
);

const href = computed(() => `#icon-${props.name}`);
</script>

<template>
  <svg
    :class="className"
    :width="size"
    :height="size"
    :style="{ color }"
    role="img"
    aria-hidden="false"
  >
    <title v-if="title">{{ title }}</title>
    <use :href="href" />
  </svg>
</template>

<style scoped>
.icon {
  display: inline-block;
  fill: currentColor; /* перекрашивает fill, если в символе не зафиксирован */
  stroke: currentColor; /* перекрашивает stroke, если в символе не зафиксирован */
}
</style>

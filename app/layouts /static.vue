<template>
  <div class="min-h-screen base-container flex flex-col">
    <LayoutBreadcrumb/>
    <main class="flex-1 p-4">
      <NuxtPage/>
    </main>

  </div>
</template>
<script setup lang="ts">
import LayoutBreadcrumb from "~/components/UI/LayoutBreadcrumb/LayoutBreadcrumb.vue";
</script>

<style scoped>
@media (max-width: 400px) {
  main {
    padding: 0;
  }
}
</style>
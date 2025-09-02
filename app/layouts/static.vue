<template>
  <div class="min-h-screen base-container flex flex-col">
    <Index/>
    <main class="flex-1 p-4">
      <NuxtPage/>
    </main>

  </div>
</template>
<script setup lang="ts">
</script>

<style scoped>
@media (max-width: 400px) {
  main {
    padding: 0;
  }
}
</style>

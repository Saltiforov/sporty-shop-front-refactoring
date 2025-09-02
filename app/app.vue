<template>
  <div class="app">
    <Header />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <ClientOnly>
      <span> modal host </span>
      <ModalHost />
    </ClientOnly>
    <Footer />
  </div>
</template>
<script setup lang="ts"></script>

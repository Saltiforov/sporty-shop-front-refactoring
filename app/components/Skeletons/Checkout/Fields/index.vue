<template>
  <div class="checkout-fields pt-[24px] pr-[45px] pb-[44px] pl-[42px] mb-[58px] rounded-lg bg-[var(--color-gray-lavender)] animate-pulse space-y-[24px]">

    <div class="h-[28px] w-[50%] bg-gray-200 rounded" />

    <div class="flex items-center space-x-2">
      <div class="h-[20px] w-[30%] bg-gray-200 rounded" />
      <div class="h-[20px] w-[60px] bg-gray-300 rounded" />
    </div>

    <div class="space-y-4">
      <div v-for="i in 8" :key="i" class="h-[48px] w-full bg-gray-200 rounded" />
    </div>

  </div>
</template>

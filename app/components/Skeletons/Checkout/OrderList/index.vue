<template>
  <div class="checkout-products-list bg-[var(--color-gray-lavender)] rounded-lg max-w-[643px] pt-[24px] pr-[46px] pl-[48px] pb-[30px] w-full animate-pulse">
    <div class="products-list__container max-w-[547px] w-full space-y-[32px]">

      <div class="h-[24px] w-[60%] bg-gray-200 rounded" />

      <div class="space-y-4">
        <div v-for="i in 4" :key="i" class="h-[60px] w-full bg-gray-300 rounded" />
      </div>

      <div class="flex justify-between items-center mb-[17px]">
        <div class="h-4 w-[40%] bg-gray-200 rounded" />
        <div class="h-6 w-6 bg-gray-300 rounded" />
      </div>

      <div class="h-[48px] w-full bg-white rounded-[var(--default-rounded)] border overflow-hidden flex">
        <div class="flex-1 bg-gray-200" />
        <div class="w-[48px] bg-gray-300" />
      </div>

      <div class="space-y-2">
        <div class="h-4 w-[30%] bg-gray-200 rounded" />
        <div class="h-[60px] bg-gray-200 rounded" />
      </div>

      <div class="h-[40px] w-full bg-gray-300 rounded-[8px]" />

    </div>
  </div>
</template>

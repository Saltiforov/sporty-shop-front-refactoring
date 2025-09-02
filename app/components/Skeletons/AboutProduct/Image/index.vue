<template>
  <div class="w-full max-w-[678px]">
    <div class="w-full h-[300px] sm:h-[500px] md:h-[600px] lg:h-[678px] bg-gray-200 rounded-lg shadow-md animate-pulse mb-[32px]" />

    <div class="flex gap-[40px] justify-center">
      <div
          v-for="i in 3"
          :key="i"
          class="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px] bg-gray-300 rounded-[4px] shadow-md animate-pulse"
      />
    </div>
  </div>
</template>
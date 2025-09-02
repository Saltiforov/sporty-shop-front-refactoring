<template>
  <div class="w-full p-2 rounded-[var(--default-rounded)] min-h-[675px] bg-white shadow animate-pulse space-y-4">

    <div class="space-y-3 border-b pb-3">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 bg-gray-200 rounded" />
        <div class="flex-1 h-4 bg-gray-200 rounded" />
      </div>
      <div v-for="i in 4" :key="'checkbox-' + i" class="flex items-center gap-2 pl-6">
        <div class="w-4 h-4 bg-gray-300 rounded" />
        <div class="flex-1 h-3 bg-gray-200 rounded" />
      </div>
    </div>

    <div v-for="i in 3" :key="'dropdown-' + i" class="border-b pb-3">
      <div class="flex items-center gap-2">
        <div class="w-5 h-5 bg-gray-200 rounded" />
        <div class="flex-1 h-4 bg-gray-200 rounded" />
        <div class="w-4 h-4 bg-gray-300 rounded ml-auto" />
      </div>
    </div>

    <div class="space-y-2 pt-2">
      <div class="h-4 w-1/3 bg-gray-200 rounded" />
      <div class="flex items-center gap-2">
        <div class="h-4 w-10 bg-gray-200 rounded" />
        <div class="flex-1 h-1.5 bg-gray-300 rounded" />
        <div class="h-4 w-10 bg-gray-200 rounded" />
      </div>
      <div class="w-16 h-6 bg-gray-200 rounded ml-auto" />
    </div>

  </div>
</template>
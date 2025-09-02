<template>
  <div class="fields-block-skeleton animate-pulse">
    <div class="grid grid-cols-2 gap-10">
      <div class="flex flex-col gap-10">
        <div
            v-for="index in 5"
            :key="'left-' + index"
            class="h-10 w-full bg-gray-200 rounded"
        />
      </div>

      <div class="flex flex-col gap-10">
        <div
            v-for="index in 5"
            :key="'right-' + index"
            class="h-10 w-full bg-gray-200 rounded"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fields-block-skeleton {
  padding: 24px 30px;
  border-radius: 12px;
}
</style>

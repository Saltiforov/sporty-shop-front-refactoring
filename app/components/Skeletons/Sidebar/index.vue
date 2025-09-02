<template>
  <aside class="sidebar-skeleton max-w-[277px] mr-[116px] w-full">
    <div class="flex items-center pb-[24px] border-b border-[var(--color-primary-lavender)]">
      <div class="w-[44px] h-[44px] rounded-full bg-[var(--color-primary-lavender)] mr-3"></div>
      <div class="h-[16px] w-[100px] bg-[var(--color-primary-lavender)] rounded"></div>
    </div>
    <div class="mt-6 mb-6">
      <div
          v-for="i in 5"
          :key="i"
          class="h-[46px] mb-1 bg-[var(--color-primary-lavender)] rounded-full w-full"
      ></div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar-skeleton {
  flex-shrink: 0;
}

.mt-6 {
  display: block;
  space-y: 1rem;
}

@media (max-width: 1199px) {
  .mt-6 {
    display: flex;
    flex-wrap: nowrap;
    gap: 16px;
    space-y: 0;
  }
  .sidebar-skeleton {
    max-width: 100%;
  }
  .mt-6 > div {
    flex: 1 1 0;
    width: auto;
    min-width: 0;
  }
}
</style>
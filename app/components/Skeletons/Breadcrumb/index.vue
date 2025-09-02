<template>
  <Breadcrumb class="breadcrumb max-h-[94px]" :model="breadcrumbItemsSkeleton">
    <template #item="{ item }">
      <span class="breadcrumb-text skeleton"></span>
    </template>
    <template #separator>
      <span class="separator skeleton">»</span>
    </template>
  </Breadcrumb>
</template>

<script setup>
const breadcrumbItemsSkeleton = Array(5).fill({ label: '', to: null })
</script>

<style scoped>
.breadcrumb {
  padding: 35px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb-text {
  width: 90px;
  height: 22px;
  border-radius: 4px;
  background-color: #ddd;
  display: inline-block;
}

.separator {
  width: 12px;
  height: 20px;
  background-color: #ccc;
  border-radius: 4px;
  display: inline-block;
  margin: 0 4px;
}

.skeleton {
  animation: pulse 1.5s infinite ease-in-out;
  color: transparent !important;
  user-select: none;
}

@keyframes pulse {
  0%, 100% {
    background-color: #ddd;
  }
  50% {
    background-color: #eee;
  }
}
</style>

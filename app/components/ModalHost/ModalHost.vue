<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="activeModal" class="fixed inset-0 z-[9999]">
        <div class="absolute inset-0 bg-black/40" @click="handleModalVisibility(activeModal)" />
        <Suspense>
          <component
            :is="currentModal"
            class="relative z-10"
            @close="handleModalVisibility(activeModal)"
          />
          <template #fallback>
            <LoadingOverlay :visible="true" />
          </template>
        </Suspense>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { modalRegistry } from '~/components/ModalHost/registry';
import { useAppShellState } from '~~/stores/useAppShellState.client';

const appShell = useAppShellState();
const { activeModal } = storeToRefs(appShell);
const { handleModalVisibility } = appShell;

const currentModal = computed(() => {
  console.log('activeModal', activeModal.value);
  if (!activeModal.value) return null;
  return modalRegistry[activeModal.value] ?? null;
});
</script>


<style scoped>
.fade-enter-active,.fade-leave-active{transition:opacity .2s ease}
.fade-enter-from,.fade-leave-to{opacity:0}
</style>

import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { ModalNames } from '#shared/types/modals';

export const useAppShellState = defineStore('appShellState', () => {
  const activeModal = ref<ModalNames | null>(null);

  const handleModalVisibility = (modal: ModalNames) => {
    // todo rewrite this methods (bad for reading)
    if (activeModal.value === modal) {
      activeModal.value = null;
    }
    activeModal.value = modal;
  };


  const isModalOpen = (modal: ModalNames) => {
    return activeModal.value === modal;
  };


  return {
    handleModalVisibility,
    isModalOpen,
    activeModal,
  };
});

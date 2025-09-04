import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ModalNames } from '#shared/types/modals';

export const useAppShellState = defineStore('appShellState', () => {
  const activeModal = ref<ModalNames | null>(null);

  const isOpen = computed(() => !!activeModal.value);

  const isModalOpen = (modal: ModalNames) => {
    return activeModal.value === modal;
  };

  const openModal = (modal: ModalNames) => {
    activeModal.value = modal;
  };

  const closeModal = () => {
    activeModal.value = null;
    console.log('closeModal');
  };


  return {
    openModal,
    isModalOpen,
    activeModal,
    closeModal,
    isOpen,
  };
});

import { defineAsyncComponent } from 'vue';


export const modalRegistry = {
  AuthModal: defineAsyncComponent({
    loader: () => import('~/components/Modals/Auth/AuthModal.vue'),
  }),
} as const;

// тип для имени модалки из реестра
export type ModalComponentName = keyof typeof modalRegistry

import { defineAsyncComponent } from 'vue';


export const modalRegistry = {
  [ModalNames.AUTH]: defineAsyncComponent({
    loader: () => import('~/components/Modals/AuthModal/AuthModal.vue'),
  }),
  [ModalNames.CART]: defineAsyncComponent({
    loader: () => import('~/components/Modals/ShoppingCartModal/ShoppingCartModal.vue'),
  }),
} as const;

// тип для имени модалки из реестра
export type ModalComponentName = keyof typeof modalRegistry

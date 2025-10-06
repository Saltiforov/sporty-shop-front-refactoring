<template>
  <div class="action-panel w-full flex justify-between items-center">
    <div v-if="responsive" class="menu">
      <VButton :pt="buttonPT" @click="handleMobileMenu">
        <UiIcon v-if="!isOpenMobileMenu" name="burger-menu"/>
        <UiIcon name="close" />
      </VButton>
    </div>
    <VButton
      :disabled="isFavoritesDisabled"
      :pt="buttonPT"
      @click="navigateTo('/profile/favorites')"
    >
      <UiIcon name="favorites" />
    </VButton>
    <VButton
      type="button"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      :pt="buttonPT"
      @click="profileAction"
    />
    <VMenu
      id="overlay_menu"
      ref="menu"
      :model="items"
      :popup="true"
      :class="{ top: '90px' }"
    />
    <VButton
      :disabled="isShoppingCartOpen"
      :pt="buttonPT"
      class="badge-button"
      @click="openModal(ModalNames.CART)"
    >
      <div class="badge-container">
        <UiIcon name="profile" />
        <VBadge :value="cartCount" severity="secondary" class="custom-badge" />
      </div>
    </VButton>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~~/stores/useAuth.js';
import { useAppShellState } from '~~/stores/useAppShellState.client.js';
import { ModalNames } from '#shared/types/modals';
import { useCartStore } from '~~/stores/useCart';

const props = defineProps({
  items: Array,
  responsive: {
    type: Boolean,
    default: false,
  },
  isOpenMobileMenu: {
    type: Boolean,
    default: false,
  },
});

const { isAuthorized } = storeToRefs(useAuthStore());
const { cartCount } = storeToRefs(useCartStore());
const { isModalOpen, openModal } = useAppShellState();
const emit = defineEmits([
  'toggle',
  'showShoppingCart',
  'handle-mobile-sidebar',
]);

const route = useRoute();
const router = useRouter();

const { locale } = useI18n();

const isFavoritesDisabled = computed(() => !isAuthorized.value);

const isShoppingCartOpen = computed(() => isModalOpen(ModalNames.CART));

const menu = ref();

const handleMobileMenu = () => {
  emit('handle-mobile-sidebar');
};

const profileAction = computed(() =>
  props.responsive ? redirectToProfile : toggle,
);

const toggle = (event) => {
  menu.value.toggle(event);
};

const redirectToProfile = () => {
  const targetPath = isAuthorized.value
    ? `/${locale.value}/profile/personal-information`
    : `/${locale.value}/auth/login`;

  if (route.path !== targetPath) {
    return router.replace(targetPath);
  }
};

const buttonPT = {
  root: {
    style: {
      background: 'transparent',
      border: 'none',
      padding: '5px',
    },
  },
};
</script>

<style scoped>
.badge-button {
  position: relative;
}

.custom-badge {
  position: absolute;
  top: 0;
  right: 0;
  transform: translate(-20%, 0%);
  z-index: 200;
}

@media (max-width: 670px) {
  button {
    width: 36px;
    height: 36px;
  }
}
</style>

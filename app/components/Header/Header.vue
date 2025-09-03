<template>
  <header
    :class="[
      'flex relative header flex-col items-end pt-[13px] pr-[24px] pb-[8px] pl-[71px]',
    ]"
  >
    <div class="header-content w-full items-end flex">
      <div class="logo">
        <NuxtLink :to="logoLink">
          <picture>
            <source
              srcset="/images/mobile-header-icon.svg"
              media="(max-width: 679px)"
              type="image/svg+xml"
            >
            <NuxtImg
              class="logo-image"
              src="/images/header-logo.svg"
              alt="header-logo"
              width="147"
              height="115"
              preload
              format="webp"
              :modifiers="{ quality: 100 }"
              fetchpriority="high"
            />
          </picture>
        </NuxtLink>
      </div>

      <nav
        class="pb-[16px] header-actions justify-between items-center flex w-full"
      >
        <LinksList
          class="links-list"
          :links="links"
          parent-classes="links-container"
          link-class="link-item text-[var(--color-gray-pale-lavender)] mr-[64px] text-[20px] last:mr-0"
        />

        <div class="product-search-wrapper max-w-[425px] w-full">
          <UiProductSearch />
        </div>

        <div class="locale-switch max-w-[200px] w-full justify-between flex">
          <UiLocaleSwitch />
          <UiCurrencySwitch />
        </div>

        <div class="action-panel max-w-[144px] w-full ml-[10px]">
            <ActionPanel
              :items="items"
              :cart-count="cartCount"
            />
        </div>
      </nav>
    </div>
<!--    <nav class="menu w-full text-[red] flex">-->
<!--      <VButton @click="handleMobileMenu">-->
<!--        <img-->
<!--          v-if="!isOpen"-->
<!--          src="~/assets/icons/menu-icon-open.svg"-->
<!--          alt="menu-icon-open.svg"-->
<!--        >-->
<!--        <img-->
<!--          v-else-->
<!--          src="~/assets/icons/menu-icon-close.svg"-->
<!--          alt="menu-icon-close.svg"-->
<!--        >-->
<!--      </VButton>-->
<!--    </nav>-->
  </header>
</template>

<script setup lang="ts">
// TODO refactore this component
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~~/stores/useAuth';
import { useAppShellState } from '~~/stores/useAppShellState.client';
import { ModalNames } from '#shared/types/modals';
import { useCartStore } from '~~/stores/useCart';

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const route = useRoute();

const { t } = useI18n();
const { logOut } = useAuthStore();
const { handleModalVisibility } = useAppShellState();
const { cartCount } = useCartStore();
const { isAuthorized } = storeToRefs(useAuthStore());

const localePath = useLocalePath();

const emit = defineEmits(['handle-mobile-sidebar']);

const handleMobileMenu = () => {
  emit('handle-mobile-sidebar');
};

const isHomePage = computed(() => {
  const normalizedPath = route.path.replace(/^\/(en|uk)/, '');
  return normalizedPath === '/' || normalizedPath === '';
});

const logoLink = computed(() => {
  if (isHomePage.value) {
    return localePath({ path: '/', query: route.query });
  }
  return localePath('/');
});

const items = computed(() => {
  if (isAuthorized.value) {
    return [
      {
        items: [
          {
            label: t('my_cabinet'),
            command: () => navigateTo('/profile/personal-information'),
          },
          {
            label: t('my_orders'),
            command: () => navigateTo('/profile/orders-history'),
          },
          { label: t('logout'), command: () => logOut() },
        ],
      },
    ];
  } else {
    return [
      {
        items: [
          {
            label: t('login'),
            command: () => handleModalVisibility(ModalNames.AUTH),
          },
          {
            label: t('register'),
            command: () => handleModalVisibility(ModalNames.AUTH),
          },
        ],
      },
    ];
  }
});

const links = ref([
  {
    label: computed(() => t('catalog')),
    icon: 'pi pi-filter',
    page: '/content/catalog',
  },
  {
    label: computed(() => t('promotions')),
    icon: 'pi pi-shopping-cart',
    page: '/content/promotions',
  },
  {
    label: computed(() => t('shipping_and_payment')),
    icon: 'pi pi-user',
    page: '/content/shipping-and-payment',
  },
  {
    label: computed(() => t('about_us')),
    icon: 'pi pi-user',
    page: '/content/about-us',
  },
  {
    label: computed(() => t('frequently_questions')),
    icon: 'pi pi-user',
    page: '/content/frequently-questions',
  },
]);
</script>

<style scoped>
.product-search-wrapper {
  display: block;
}

.menu {
  display: none;
}

.logo {
  margin-right: 67px;
}

.links-container {
  display: flex;
  flex-wrap: wrap;
  max-width: 780px;
  width: 100%;
}

.input-icon {
  color: var(--color-primary-black);
}

.link-item {
  margin-right: 64px !important;
  color: #f6f6f6;
  font-weight: 600;
  font-size: 20px;
}

@media (max-width: 1768px) {
  .product-search-wrapper {
    position: absolute !important;
    top: 100px !important;
    right: 20px !important;
    left: auto !important;
  }
  .input-icon {
    color: var(--color-primary-blue);
  }
}

@media (max-width: 1500px) {
  .logo {
    margin-right: 36px;
  }
}
@media (max-width: 1400px) {
  .menu {
    display: block;
  }
  .links-list {
    display: none;
  }
  .header-actions {
    justify-content: flex-end;
    padding-bottom: 0px;
  }
  .action-panel {
    max-width: 130px;
  }
  .product-search-wrapper {
    position: relative !important;
    top: 0 !important;
    right: 0 !important;
  }
}

@media (max-width: 950px) {
  .product-search-wrapper {
    position: absolute !important;
    top: 118px !important;
    right: 20px !important;
    left: auto !important;
  }
}

@media (max-width: 740px) {
  .header {
    padding-left: 20px;
    padding-right: 20px;
    margin-bottom: 0;
  }
  .logo {
    margin: 0;
    padding-left: 22px;
  }
}

@media (max-width: 680px) {
  .product-search-wrapper {
    position: absolute !important;
    top: 85px !important;
    right: 20px !important;
    left: auto !important;
    max-width: 340px !important;
  }
}

@media (max-width: 679px) {
  .logo {
    padding-left: 0;
    width: 100%;
  }
}

@media (max-width: 670px) {
  .action-panel {
    display: none;
  }
  .menu {
    display: none;
  }
  .header-actions {
    padding-bottom: 16px;
  }
  .product-search-wrapper {
    position: absolute !important;
    top: 60px !important;
    right: 20px !important;
    left: auto !important;
    max-width: 340px !important;
  }
}

@media (max-width: 530px) {
  .header-actions {
    padding-bottom: 0px;
  }
  .locale-switch {
    flex-direction: column;
    width: auto;
    align-items: flex-end;
  }
  .action-panel {
    display: none;
  }
  .header {
    padding-bottom: 17px;
  }
  .product-search-wrapper {
    top: 95px !important;
    right: 10px !important;
    left: auto !important;
    max-width: 259px !important;
  }
}
</style>

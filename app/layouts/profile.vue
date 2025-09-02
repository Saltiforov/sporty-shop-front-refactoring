<template>
  <div class="min-h-screen flex flex-col">
    <div class="flex flex-1">
      <div class="profile-container base-container justify-between flex-1">
        <LayoutBreadcrumb v-if="hydrated" />
        <Index v-else />
        <div class="pb-[100px] profile-layout h-full flex">
          <aside v-if="hydrated" class="sidebar max-w-[277px] mr-[116px] w-full">
            <div class="sidebar-header flex pb-[24px] items-center border-b border-[var(--color-gray-light-lavender)]">
              <div class="w-[44px] mr-3">
                <img class="rounded-full" src="/assets/icons/user-profile-icon.png" alt="user-profile-icon.png" >
              </div>
              <h2 class="text-light-16">{{ fullUserName }}</h2>
            </div>
            <nav class="sidebar-nav flex justify-center w-full">
              <ul class="transition-opacity duration-300 ease-in">
                <NuxtLink
                    v-for="item in localizedList"
                    :key="item.title"
                    :to="getRouteForLink(item.route)"
                    class="flex items-center gap-2 cursor-pointer"
                    :class="{ 'active': item.page === currentTab && minWidthForMobileVersion }"
                    @click="item.command && item.command()"
                >
                  <img class="list-icon mr-3" :src="item.icon" alt="" >
                  <span
                      class="py-[11px] list-title max-w-[185.5px] w-full rounded-tr-[100px] rounded-br-[100px] pr-[18.5px]"
                      :class="{ 'active': item.page === currentTab }"
                  >
          {{ item.title }}
        </span>
                </NuxtLink>
              </ul>
            </nav>
          </aside>

          <Index v-else />

          <main class="profile-main p-6 flex-grow">
            <NuxtPage />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth.js';

import PersonalInformationIcon from '~/assets/icons/user-profile-persn-inf-icon.svg';
import OrderHistoryIcon from '~/assets/icons/user-profile-order-history-icon.svg';
import FavoriteProductsIcon from '~/assets/icons/user-profile-favorite-products-icon.svg';
import ChangePasswordIcon from '~/assets/icons/user-profile-change-passwrd-icon.svg';
import LogoutIcon from '~/assets/icons/user-profile-logout-icon.svg';

import { onMounted, ref, computed } from 'vue';
import { getCurrentUser } from '~/services/api/user-service.js';
import { storeToRefs } from 'pinia';
import { capitalizeFirstLetter } from '~/utils/index.js';
import Index from '~/components/Skeletons/Breadcrumb/index.vue';
import LayoutBreadcrumb from '~/components/UI/LayoutBreadcrumb/LayoutBreadcrumb.vue';
import { useWindowWidthWatcher } from '~/composables/useWindowWidthWatcher.ts';
import Index from '~/components/Skeletons/Sidebar/index.vue';

definePageMeta({ layout: 'profile' });

const { t, locale } = useI18n();
const { logUserOut } = useAuthStore();

const hydrated = ref(false);
const { currentUser } = storeToRefs(useAuthStore());
const getWidth = useWindowWidthWatcher();

const userData = computed(() => currentUser.value || {});

const isLoading = ref(false);
const route = useRoute();

const currentTab = computed(() => route.path.split('/').pop() || 'personal-information');
const windowWidth = computed(() => getWidth());
const minWidthForMobileVersion = computed(() => windowWidth.value <= 850);

const getRouteForLink = (routePath) => {
  const localizedPath = `/${locale.value}${routePath}`;
  return localizedPath === route.path ? localizedPath : routePath;
};

const fullUserName = computed(() => {
  const first = capitalizeFirstLetter(userData.value?.firstName ?? '');
  const last = capitalizeFirstLetter(userData.value?.lastName ?? '');
  return `${first} ${last}`.trim();
});

const logout = () => {
  logUserOut();
  navigateTo('/');
};

const localizedList = computed(() => [
  { title: t('personal_information'), icon: PersonalInformationIcon, page: 'personal-information', route: '/profile/personal-information' },
  { title: t('orders_history'), icon: OrderHistoryIcon, page: 'orders-history', route: '/profile/orders-history' },
  { title: t('favorites'), icon: FavoriteProductsIcon, page: 'favorites', route: '/profile/favorites' },
  { title: t('change_password'), icon: ChangePasswordIcon, page: 'change-password', route: '/profile/change-password' },
  { title: t('logout'), icon: LogoutIcon, command: () => logout() },
]);

onMounted(() => {
  hydrated.value = true;
});
</script>

<style scoped>
.active {
  background: linear-gradient(to left, var(--color-gray-light-lavender), var(--color-primary-pure-white));
  transform: scale(1.05);
  border-radius: 100px !important;
  transition: transform 0.2s ease, background 0.3s ease;
}
.layout {
  display: flex;
  padding-bottom: 100px;
}
.sidebar-header {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
}
.profile-container {
  padding-bottom: 100px;
}
.sidebar-nav ul {
  list-style-type: none;
  padding: 0;
}
.content {
  flex-grow: 1;
  max-width: 1344px;
  padding: 0 15px;
}
.profile-main {
  background-color: var(--color-gray-lavender);
  padding: 20px;
  border-radius: 8px;
}
@media (max-width: 1200px) {
  .profile-layout {
    flex-direction: column;
  }
  .sidebar {
    max-width: 100%;
    margin-right: 0;
  }
  .sidebar-nav {
    padding-bottom: 24px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--color-gray-light-lavender);
  }
  .sidebar-nav ul {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }
}
@media (max-width: 1000px) {
  .list-title {
    font-size: 14px;
    padding-right: 14px;
    padding-top: 7px;
    padding-bottom: 7px;
  }
}
@media (max-width: 900px) {
  .list-icon {
    margin-right: 4px;
  }
}
@media (max-width: 850px) {
  .list-title {
    display: none;
  }
  .profile-layout {
    padding-bottom: 36px;
  }
  .sidebar-nav ul {
    justify-content: space-evenly;
  }
  .list-icon {
    margin-right: 0;
    padding: 9px;
  }
  .sidebar-nav ul {
    border-radius: 50%;
  }
  .active {
    border-radius: 100%;
  }
  .sidebar-header {
    margin-bottom: 0;
  }
  .sidebar-nav {
    padding-bottom: 0;
  }
  .sidebar-nav ul {
    padding: 22px;
  }
}
@media (max-width: 500px) {
  main {
    padding: 15px 5px 30px 5px;
  }
  .profile-main {
    padding: 16px 4px 36px;
  }
  .profile-container {
    padding: 8px 10px;
  }
}
</style>

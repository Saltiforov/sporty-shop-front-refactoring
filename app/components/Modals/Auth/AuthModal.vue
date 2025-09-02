<template>
  <div v-if="isVisible" class="overlay" @click="handleOverlayClick">
    <div ref="popupRef" class="popup murecho-font w-full" @click.stop>
      <div class="popup-header">
        <VTabs v-model:value="activeTab">
          <VTabList
            class="tab-list"
            :pt="{
              tabList: {
                style: tabListStyles,
              },
              activeBar: {
                style: {
                  height: '2px',
                  backgroundColor: 'var(--color-primary-dark)',
                },
              },
            }"
          >
            <VTab
              class="tablist-tab"
              value="login"
              @click="setActiveTab('login')"
            >
              {{ t('login_tab') }}
            </VTab>
            <VTab
              class="tablist-tab"
              value="register"
              @click="setActiveTab('register')"
            >
              {{ t('register_tab') }}
            </VTab>
          </VTabList>
        </VTabs>
      </div>

      <div class="popup-content">
        <VTabPanels
          :pt="{
            root: {
              style: 'background-color: transparent; padding: 0;',
            },
          }"
        >
          <VTabPanel>
            <div class="auth-component">
              <LoadingOverlay :visible="isLoading" />
              <DynamicForm
                :key="activeTab"
                class="mt-8"
                :config="fieldsConfig"
                @submit="handleAuth"
              />
              <div
                v-if="isAuthorized"
                class="reset-password justify-end mb-[27px] flex"
              >
                <NuxtLink
                  ><p class="text-[var(--color-muted-gray)] text-[14px]">
                    {{ t('forgot_password') }}
                  </p></NuxtLink
                >
              </div>

              <div :class="wrapperClass">
                <VButton
                  type="submit"
                  :pt="{ root: { class: rootClass } }"
                  form="dynamicForm"
                >
                  {{ buttonText }}
                </VButton>
              </div>

              <div
                v-if="(responsive && isAuthorized) || isAuthorized"
                :class="['h-[1px]']"
                :style="dividerStyle"
              />

              <div class="login-with-footer">
                <div
                  v-if="isAuthorized && !responsive"
                  class="flex text-[12px] justify-center"
                >
                  <div class="flex">
                    <p class="mr-[17px]">{{ t('new_client') }}</p>
                    <p>
                      <NuxtLink
                        class="text-[var(--color-primary-dark-red)] cursor-pointer"
                        @click="setActiveTab('register')"
                      >
                        {{ t('register_button') }}
                      </NuxtLink>
                      {{ t('for_good_offers') }}
                    </p>
                  </div>
                </div>
                <div
                  v-else-if="!isAuthorized"
                  class="flex text-[12px] justify-center"
                >
                  <p class="text-[var(--color-muted-gray)]">
                    {{ t('user_agreement') }}
                  </p>
                </div>
                <div v-if="responsive && isAuthorized" :class="wrapperClass">
                  <p class="title-lg-20 text-center mb-[26px]">
                    {{ t('new_client') }}
                  </p>
                  <VButton
                    :pt="{ root: { class: rootClass } }"
                    @click="() => navigateTo('/auth/register')"
                  >
                    {{ t('register_button') }}
                  </VButton>
                </div>
              </div>
            </div>
          </VTabPanel>
        </VTabPanels>
      </div>

      <VButton
        :pt="{
          root: {
            class: 'close-btn',
          },
        }"
        @click="handleModalVisibility(ModalNames.AUTH)"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.63597 1.63649L7.51465 7.51517M7.51465 7.51517L13.3933 13.3938M7.51465 7.51517L1.63597 13.3938M7.51465 7.51517L13.3933 1.63649"
            stroke="#9E2B24"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </VButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// todo refactore this code
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~~/stores/useAuth';
import { useAppShellState } from '~~/stores/useAppShellState.client';
import { ModalNames } from '#shared/types/modals';
import { FormFieldsGroup } from '~/types/form';
const props = defineProps({
  responsive: {
    type: Boolean,
    default: false,
  },
});
const { t } = useI18n();
const authStore = useAuthStore();
const { getFormConfig } = useFields(t);

const { login, signUp } = authStore;
const { isAuthorized } = storeToRefs(authStore);
const { handleModalVisibility, isModalOpen } = useAppShellState();


const isLoading = ref(false);
const activeTab = ref('login');
const popupRef = ref(null);


const isDefaultTabActive = computed(() => activeTab.value === 'login');

const fieldsConfig = computed(() =>
  isDefaultTabActive.value ? getFormConfig(FormFieldsGroup.LOGIN) : getFormConfig(FormFieldsGroup.REGISTER),
);

const buttonText = computed(() =>
  isDefaultTabActive.value ? t('login') : t('register_button'),
);

const isVisible = computed(() => isModalOpen(ModalNames.AUTH));
const setActiveTab = (activeTab) => {
  activeTab.value = activeTab;
};

const handleOverlayClick = (e) => {
  if (!popupRef.value?.contains(e.target)) {
    handleModalVisibility(ModalNames.AUTH);
  }
};

const handleAuth = async (formData) => {
  isLoading.value = true;

  const action = isDefaultTabActive.value ? login : signUp;

  try {
    await action(formData);

    if (isAuthorized.value) {
      handleModalVisibility(ModalNames.AUTH);
      navigateTo('/profile/personal-information');
    }
  } catch (error) {
    console.error('Ошибка при аутентификации:', error);
  } finally {
    isLoading.value = false;
  }
};

const wrapperClass = computed(() => [
  'auth-button-wrapper',
  'murecho-font',
  'mx-auto',
  'mb-[36px]',
  props.responsive && isAuthorized.value ? 'login-responsive-class' : '',
  props.responsive && !isAuthorized.value ? 'non-login-responsive-class' : '',
  isAuthorized.value && !props.responsive ? 'max-w-[320px]' : 'max-w-[386px]',
  !isAuthorized.value && props.responsive ? 'responsive-class' : '',
]);

const tabListStyles = computed(() => {
  return {
    fontSize: '20px',
    fontWeight: 400,
    backgroundColor: 'var(--color-primary-lavender)',
    borderTop: 'none',
  };
});

const rootClass = computed(() => [
  'auth-button btn-hover-default',
  props.responsive ? 'responsive-class-root' : '',
]);

const dividerStyle = computed(() => {
  const baseStyles = {
    marginBottom: '24px',
    height: '1px',
  };

  if (props.responsive) {
    return {
      ...baseStyles,
      backgroundColor: 'var(--color-primary-blue)',
    };
  }

  if (isAuthorized.value && !props.responsive) {
    return {
      ...baseStyles,
      backgroundColor: 'var(--color-primary-pure-white)',
    };
  }

  return {};
});
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.tablist-tab {
  padding-top: 0px;
  padding-bottom: 7px;
  color: var(--color-primary-black);
}
.tablist-tab:hover {
  color: var(--color-primary-black);
}

.popup {
  position: relative;
  background: #e6e7f8;
  border-radius: 12px;
  max-width: 480px;
  padding: 24px 24px 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.popup-header {
  margin-bottom: 1rem;
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

.close-btn:hover {
  background: transparent;
  border: none;
}

.auth-button {
  background: var(--color-primary-dark);
  width: 100%;
}

.auth-button:hover {
  width: 100%;
}

.login-with__img {
  background: transparent;
  border: none;
}

.login-with__img:hover {
  background: transparent;
  border: none;
}

.scrollable-fields-block {
  max-height: 480px;
  overflow-y: auto;
  padding-right: 5px;
}

.scrollable-fields-block::-webkit-scrollbar {
  width: 8px;
}

.scrollable-fields-block::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.scrollable-fields-block::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.scrollable-fields-block::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.login-responsive-class {
  width: 243px;
  font-size: 14px;
  margin-bottom: 24px;
}
.non-login-responsive-class {
  width: 285px;
}
.responsive-class-root {
  font-size: 14px;
  padding: 10px 10px;
}
</style>

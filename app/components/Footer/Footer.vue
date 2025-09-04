<template>
  <main>
    <div ref="footerMarker" class="h-[10px] footer-marker w-full" />

    <footer
      ref="stickyFooter"
      class="bottom-0 sticky-footer px-[16px] left-0 w-full z-1000 responsive-footer flex flex-col p-4 shadow transition-transform duration-300"
      :class="[footerPositionClass]"
    >
      <section class="responsive-footer-container w-full flex justify-between">
        <section
          class="actions-wrapper w-full flex justify-between items-center"
        >
          <Index
            :cart-count="cartCount || 0"
            :responsive="true"
            :is-open-mobile-menu="isMobileSidebarOpen"
            @show-shopping-cart="openModal(ModalNames.CART)"
            @handle-mobile-sidebar="$emit('handle-mobile-sidebar')"
          />
        </section>
      </section>
    </footer>

    <footer
      ref="mainFooter"
      class="pt-[21px] relative z-[1000] pr-3 pl-3 transition-all duration-300"
    >
      <section
        class="footer-container flex justify-between flex-wrap items-center max-w-[1190px] px-[15px] mx-auto"
      >
        <section
          class="left-side flex w-full max-w-[661px] justify-between gap-2"
        >
          <figure class="mb-auto">
            <NuxtImg
              src="/images/footer-logo.svg"
              :width="isResponsiveVersion ? 129 : 184"
              :height="isResponsiveVersion ? 95 : 140"
              alt="footer-logo"
              loading="lazy"
            />
          </figure>
          <nav
            class="links-list flex w-full max-w-[411px] justify-between sm:flex-nowrap gap-2"
          >
            <section v-for="(list, index) in links" :key="index">
              <header class="flex mb-2 items-center">
                <h2
                  class="mr-1 cursor-pointer small-title"
                  @click="isResponsiveVersion ? toggle(index) : null"
                >
                  {{ list.title }}
                </h2>
                <span v-if="isResponsiveVersion">
                  <img
                    v-if="list.expanded"
                    src="~/assets/icons/footer-icon-minus.svg"
                    alt="footer-icon-minus"
                  >
                  <img
                    v-else
                    src="~/assets/icons/footer-icon-plus.svg"
                    alt="footer-icon-plus"
                  >
                </span>
              </header>

              <LinksList
                v-if="list.expanded || !isResponsiveVersion"
                :links="list.links"
                :parent-classes="['']"
                :link-class="[
                  'text-[var(--color-primary-pure-white)]',
                  'last:mr-0',
                  'mb-[6px]',
                  'link-text',
                ]"
              />
            </section>
            <aside class="socials-responsive">
              <section class="our-social w-full">
                <header class="flex items-center mb-5 cursor-pointer">
                  <p
                    class="small-title mr-1"
                    @click="showSocialLinks = !showSocialLinks"
                  >
                    {{ t('footer_social_networks') }}
                  </p>
                  <span v-if="isResponsiveVersion">
                    <img
                      v-if="showSocialLinks"
                      src="~/assets/icons/footer-icon-minus.svg"
                      alt="footer-icon-minus"
                    >
                    <img
                      v-else
                      src="~/assets/icons/footer-icon-plus.svg"
                      alt="footer-icon-plus"
                    >
                  </span>
                </header>
                <div v-show="showSocialLinks">
                  <nav class="flex justify-between">
                    <NuxtLink
                      to="https://www.instagram.com/"
                      class="flex flex-col items-center text-center gap-1"
                    >
                      <NuxtImg
                        src="/images/instagram-black-icon.png"
                        width="36"
                        height="36"
                        alt="social instagram"
                        loading="lazy"
                      />
                    </NuxtLink>
                    <NuxtLink
                      to="https://web.telegram.org/a/"
                      class="flex flex-col items-center text-center gap-1"
                    >
                      <NuxtImg
                        src="/images/telegram-black-icon.png"
                        width="36"
                        height="36"
                        alt="social telegram"
                        loading="lazy"
                      />
                    </NuxtLink>
                  </nav>
                  <address class="contacts-wrapper">
                    <section class="contacts ml-4 mb-3">
                      <p class="small-title">
                        {{ t('footer_contacts_title') }}
                      </p>
                      <NuxtLink
                        class="text-[var(--color-primary-pure-white)] link-text"
                        to="/news"
                        >qwerty@gmail.com
                      </NuxtLink>
                    </section>
                    <nav
                      class="contacts-links flex justify-between items-center"
                    >
                      <NuxtLink
                        to="https://www.instagram.com/"
                        class="flex flex-col items-center text-center gap-1"
                      >
                        <NuxtImg
                          class="self-start"
                          src="/images/instagram-black-icon.png"
                          width="36"
                          height="36"
                          alt="social instagram"
                          loading="lazy"
                        />
                        <p class="link-text">Instagram</p>
                      </NuxtLink>
                      <NuxtLink
                        to="https://web.telegram.org/a/"
                        class="flex flex-col items-center text-center gap-1"
                      >
                        <NuxtImg
                          class="self-end"
                          src="/images/telegram-black-icon.png"
                          width="36"
                          height="36"
                          alt="social telegram"
                          loading="lazy"
                        />
                        <p class="link-text">Telegram</p>
                      </NuxtLink>
                    </nav>
                  </address>
                </div>
              </section>
            </aside>
          </nav>
        </section>
        <aside
          class="right-side w-full max-w-[393px] justify-between flex-wrap sm:flex-nowrap gap-2 flex"
        >
          <address class="contacts-wrapper w-[182px]">
            <section class="contacts ml-4 mb-3">
              <p class="small-title">{{ t('footer_contacts_title') }}</p>
              <NuxtLink
                class="text-[var(--color-primary-pure-white)] link-text"
                to="/news"
                >qwerty@gmail.com</NuxtLink
              >
            </section>
            <nav class="contacts-links flex justify-between items-center">
              <NuxtLink
                to="https://www.instagram.com/"
                class="flex flex-col items-center text-center gap-1"
              >
                <NuxtImg
                  src="/images/instagram-black-icon.png"
                  width="36"
                  height="36"
                  alt="social instagram"
                  loading="lazy"
                />
                <p class="link-text">Instagram</p>
              </NuxtLink>
              <NuxtLink
                to="https://web.telegram.org/a/"
                class="flex flex-col items-center text-center gap-1"
              >
                <NuxtImg
                  src="/images/telegram-black-icon.png"
                  width="36"
                  height="36"
                  alt="social telegram"
                  loading="lazy"
                />
                <p class="link-text">Telegram</p>
              </NuxtLink>
            </nav>
          </address>
          <section class="our-social max-w-[102px] w-full">
            <header>
              <p class="small-title mb-5">{{ t('footer_social_networks') }}</p>
            </header>
            <nav class="flex justify-between">
              <NuxtLink
                to="https://www.instagram.com/"
                class="flex flex-col items-center text-center gap-1"
              >
                <NuxtImg
                  src="/images/instagram-black-icon.png"
                  width="36"
                  height="36"
                  alt="social instagram"
                  loading="lazy"
                />
              </NuxtLink>
              <NuxtLink
                to="https://web.telegram.org/a/"
                class="flex flex-col items-center text-center gap-1"
              >
                <NuxtImg
                  src="/images/telegram-black-icon.png"
                  width="36"
                  height="36"
                  alt="social telegram"
                  loading="lazy"
                />
              </NuxtLink>
            </nav>
          </section>
        </aside>
      </section>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useWindowWidthWatcher } from '~/composables/useWindowWidthWatcher.js';
import { useAppShellState } from '~~/stores/useAppShellState.client.js';
import { ModalNames } from '#shared/types/modals';
import { useCartStore } from '~~/stores/useCart';
import { storeToRefs } from 'pinia';

const { t } = useI18n();

const getWidth = useWindowWidthWatcher();

const props = defineProps({
  isMobileSidebarOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const footerMarker = ref(null);
const { openModal } = useAppShellState();
const { cartCount } = storeToRefs(useCartStore());

const isResponsiveVersion = computed(() => getWidth() <= 670);

const footerPositionClass = computed(() => {
  return isIntersecting.value ? 'relative translate-y-0' : 'fixed translate-y-0';
});

const showSocialLinks = ref(true);
const stickyFooter = ref(null);
const mainFooter = ref(null);
const isIntersecting = ref(false);

const toggle = (index) => {
  links.value[index].expanded = !links.value[index].expanded;
};

const links = ref([
  {
    title: computed(() => t('footer_about_us')),
    expanded: false,
    links: [
      {
        label: computed(() => t('footer_about_us')),
        page: '/content/about-us',
      },
      {
        label: computed(() => t('footer_warranties')),
        page: '/content/guarantees',
      },
      {
        label: computed(() => t('footer_terms_of_use')),
        page: '/content/term-of-use',
      },
    ],
  },
  {
    title: computed(() => t('footer_payment_methods')),
    expanded: false,
    links: [
      {
        label: computed(() => t('footer_payment_methods')),
        page: '/content/shipping-and-payment',
      },
      {
        label: computed(() => t('footer_delivery')),
        page: '/content/delivery',
      },
      {
        label: computed(() => t('footer_faq')),
        page: '/content/frequently-questions',
      },
    ],
  },
]);

let observer;
let timeout = null;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        isIntersecting.value = entry.isIntersecting;
      }, 100);
    },
    {
      root: null,
      threshold: 0.05,
    },
  );

  if (footerMarker.value) {
    observer.observe(footerMarker.value);
  }
});

onBeforeUnmount(() => {
  if (observer && footerMarker.value) {
    observer.unobserve(footerMarker.value);
  }
  clearTimeout(timeout);
});
</script>

<style scoped>
.sticky-footer {
  z-index: 1000;
  transition: all 0.3s ease;
}

.socials-responsive {
  display: none;
}

.footer-marker {
  display: none;
}

.responsive-footer {
  display: none;
}

.translate-y-full {
  transform: translateY(100%);
}

@media (max-width: 1300px) {
  .links-list {
    justify-content: space-around;
  }
}

@media (max-width: 1130px) {
  .footer-container {
    flex-direction: column;
  }

  .left-side {
    margin-bottom: 10px;
  }

  footer {
    padding-top: 12px;
    padding-right: 8px;
    padding-left: 8px;
  }
}

@media (max-width: 670px) {
  .footer-container {
    flex-direction: column;
  }
  .footer-marker {
    display: block;
  }
  .responsive-footer {
    display: block;
  }

  .right-side {
    display: none;
  }

  .socials-responsive {
    display: block;
  }

  .link-text {
    font-size: 12px;
  }

  .contacts {
    margin-left: 0px;
  }

  .links-list {
    width: 230px;
    justify-content: space-around;
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 760px) {
  .sticky-footer {
    padding: 14px 16px 16px;
  }
}
@media (max-width: 530px) {
  .links-list {
    width: 150px;
  }
}

@media (max-width: 400px) {
  .links-list {
    width: 130px;
  }
}
</style>

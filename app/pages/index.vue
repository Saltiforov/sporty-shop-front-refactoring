<template>
  <div>
    <LoadingOverlay :visible="isLoading" />

    <div class="max-w-[1756px] mx-auto">
      <div class="main-content-container">
        <div class="select-filters mb-3 flex w-full px-3 justify-end">
          <div class="responsive-filters" @click="handleMobileFilters">
            <div class="responsive-filters-icon">
              <svg
                :class="isMobileFiltersOpen ? 'rotate-90' : 'rotate-0'"
                class="transition-transform duration-300"
                width="6"
                height="10"
                viewBox="0 0 6 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L5 5L1 9"
                  stroke="#212094"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="responsive-filters-title fw-500">
              <p>Фільтри</p>
            </div>
          </div>
          <div class="sort-select min-w-[320px] p-1 flex">
            <p class="mr-5 sort-title">{{ t('sort_title') }}</p>
            <UiSortSelect />
          </div>
        </div>

        <div
          class="main-content min-h-screen grid-cols-1 grid lg:grid-cols-[354px_1fr] gap-[89px]"
        >
          <aside class="rounded-md">
            <div
              class="filters mb-[91px] w-full max-w-[354px] min-h-[575px] border rounded-[var(--default-rounded)]"
            >
              <Filters v-if="hydrated" />
              <SkeletonsFilters v-else />
            </div>

            <transition name="fade-slide">
              <div v-show="isMobileFiltersOpen" class="filters--mobile">
                <Filters />
              </div>
            </transition>

            <div class="promotional-products text-center">
              <p
                class="text-[var(--color-primary-pink)] mb-[21px] fw-600 text-[20px]"
              >
                {{ t('promo_products_title') }}
              </p>
              <ClientOnly>
                <div
                  v-if="hydrated && promotionalProducts?.length"
                  class="promo-swiper"
                  :style="{ '--arrow-color': 'var(--color-muted-light-gray)' }"
                >
                  <Swiper
                    v-bind="promotionalProductsSwiperOptions"
                    :modules="modules"
                    :pagination="{ clickable: true }"
                    class="promo-slider"
                  >
                    <SwiperSlide
                      v-for="item in promotionalProducts"
                      :key="item.id ?? item._id ?? JSON.stringify(item)"
                    >
                      <ProductCard
                        class="mt-3 mb-3"
                        :product="item"
                        @click="addProductToViewed(item)"
                      />
                    </SwiperSlide>
                  </Swiper>
                </div>
                <div v-else class="flex gap-4 overflow-x-auto">
                  <SkeletonsProduct class="min-w-[180px]" />
                </div>
              </ClientOnly>
            </div>
          </aside>

          <div>
            <div class="product-grid">
              <ProductCard
                v-for="product in productList"
                :key="product.id"
                :product="product"
                @click="addProductToViewed(product)"
              />
            </div>
          </div>

          <div class="empty-block" />
          <div v-if="false">
            <div class="products-pagination-actions mb-[72px]">
              <div class="product-pagination-wrapper flex justify-center">
                <BasePagination
                  v-if="!isLoading"
                  v-model="page"
                  :total-items="totalItems"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getProducts, getProductsOnSale } from '~/services/api/products';
import { useFetchApi } from '~/composables/useApi';
import { useAppShellState } from '~~/stores/useAppShellState.client';
import { ModalNames } from '#shared/types/modals';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';

const modules = [Navigation, Pagination, Autoplay];

const route = useRoute();
const { t, locale } = useI18n();

const page = ref(Number(route.query.page) || 1);
const limit = ref(Number(route.query.limit) || 10);
const skip = computed(() => (page.value - 1) * limit.value);
const q = computed(() => route.query.q ?? '');

const { addProductToViewed } = useViewedProducts();
const { openModal } = useAppShellState();

const isMobileFiltersOpen = ref(false);
const promotionalProducts = ref([]);

const productsQueryParams = computed(() => {
  return {
    page: page.value,
    limit: limit.value,
    skip: skip.value,
    filters: route.query.filters,
    price: route.query.price,
    sort: route.query.sort,
    ...(q.value ? { q: q.value } : {}),
  };
});

const params = computed(() => {
  return {
    ...productsQueryParams.value,
    locale: locale.value,
  };
});

const handleMobileFilters = () => {
  openModal(ModalNames.AUTH);
};

const { data: products, pending } = await useFetchApi(
  'GeneralProductsList',
  getProducts,
  params,
);

const promotionalProductsSwiperOptions = {
  slidesPerView: 1,
  loop: true,
};

const productList = computed(() => products.value?.list ?? []);
const isLoading = computed(() => pending.value);

const hydrated = ref(false);

onMounted(async () => {
  hydrated.value = true;

  const { $basicApi } = useNuxtApp();
  const res = await getProductsOnSale($basicApi);
  promotionalProducts.value = res.list;
});

console.log('products', products.value);
</script>

<style scoped>
.product-grid {
  display: grid;
  max-width: 1264px;
  gap: 48px;
  margin-bottom: 45px;
  width: 100%;
  grid-template-columns: repeat(4, 1fr);
}

.product-pagination-wrapper {
  width: 274px;
  margin: 0 auto;
}

.promo-slider-btn:hover {
  background-color: transparent;
}

.responsive-filters {
  font-size: 12px;
  box-shadow: 0 0 2px #00000040;
  border-radius: 8px;
  cursor: pointer;
  min-width: 92px;
  height: auto;
  padding: 4.5px 6px;
  display: none;
  justify-content: space-between;
  align-items: center;
}

.responsive-filters-icon {
  margin-left: 10px;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
  will-change: transform, opacity;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.responsive-filters-title {
  font-size: 16px;
}

.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1670px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .sort-select {
    min-width: auto;
  }
}

@media (max-width: 1630px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1420px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .main-content {
    gap: 16px;
  }
}

@media (max-width: 1150px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content {
    gap: 8px;
  }
}

@media (max-width: 1024px) {
  .promotional-products {
    display: none;
  }

  .empty-block {
    display: none;
  }

  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .main-content-container {
    display: flex;
    flex-direction: column;
  }

  aside {
    display: block;
    border: none;
  }

  .filters {
    display: none;
  }

  .select-filters {
    justify-content: space-between;
  }

  .responsive-filters {
    display: flex;
  }

  .filters--mobile {
    height: auto !important;
    border: none !important;
    margin-bottom: 10px;
  }
}

@media (max-width: 800px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 750px) {
  .select-filters {
    margin-top: 30px;
    padding-top: 10px;
    justify-content: space-between;
  }

  .sort-title {
    font-size: 15px;
  }

  .product-grid {
    gap: 24px;
  }
}

@media (max-width: 700px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .sort-title {
    margin-right: 4px;
  }
}

@media (max-width: 650px) {
  .product-grid {
    gap: 16px;
  }
}

@media (max-width: 615px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 550px) {
  .products-pagination-actions {
    margin-bottom: 40px;
  }

  .product-grid {
    margin-bottom: 24px;
  }
}

@media (max-width: 510px) {
  .sort-title {
    font-size: 10px;
  }

  .responsive-filters-title {
    font-size: 12px;
  }

  .main-content {
    gap: 0;
    padding: 0 10px;
  }

  .responsive-filters {
    justify-content: space-between;
  }

  .sort-select {
    justify-content: center;
    align-items: center;
  }

  .select-filters {
    margin-top: 30px;
    padding-top: 25px;
    margin-bottom: 16px;
  }
}
</style>

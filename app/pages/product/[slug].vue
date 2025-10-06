<template>
  <div v-if="product" class="about-product-container px-4 py-6">
    <LayoutBreadcrumb
      v-if="!isLoading"
      :product="product"
    />
    <SkeletonsBreadcrumb v-else />
    <LoadingOverlay :visible="isLoading" />

    <div class="header flex flex-col items-center mb-2 px-5">
      <div class="article text-[var(--color-muted-light-gray)] self-end">
        <p>{{ `${t('product_sku')}: 9876678` }}</p>
      </div>
    </div>

    <div
      class="about-product-content mb-[46px] text-[var(--color-muted-light-gray)] flex flex-col lg:flex-row justify-between items-center gap-8"
    >
      <div class="image relative w-full max-w-[678px]">
        <div class="favorite-button-wrapper absolute z-[100] top-2 -right-4">
          <FavoriteButton
            v-if="isAuthorized"
            inactive-color="var(--color-primary-dark-red)"
            :is-favorite="product.isFavorite"
            :product="product"
            :icon-size="{ width: 36, height: 32 }"
          />
        </div>

        <div v-if="images.length">
          <div
            class="about-product__image-wrapper max-w-[678px] mx-auto h-[678px] w-full"
          >
            <Swiper
              v-bind="swiperOptions"
              :modules="[Navigation, Pagination]"
              class="rounded-lg"
              @slide-prev-transition-end="slideChange('left')"
              @slide-next-transition-end="slideChange('right')"
            >
              <SwiperSlide v-for="(img, idx) in images" :key="idx">
                <img
                  :src="getSelectedImage || img"
                  class="w-full about-product__image h-[660px] object-cover"
                  alt="product-image"
                >
              </SwiperSlide>
            </Swiper>
          </div>

          <div class="flex gallery-container gap-[40px] justify-center">
            <img
              v-for="(img, idx) in galleryImages"
              :key="idx"
              class="max-w-[100px] gallery-image border cursor-pointer rounded-[4px] shadow-md object-cover h-[100px]"
              :src="img"
              alt="image.png"
              @click="handleGalleryClick(idx)"
            >
          </div>
        </div>
        <SkeletonsAboutProductImage v-else class="max-w-[678px] mx-auto" />
      </div>

      <div
        v-if="product"
        class="about-product-info w-full min-h-[625px] flex flex-col self-start max-w-full lg:max-w-[870px]"
      >
        <div
          class="about-product-info__content bg-[var(--color-gray-lavender)] h-full min-h-[625px] rounded-[8px] p-[35px_55px_65px_31px] flex flex-col justify-between"
        >
          <div>
            <h1
              class="product-name text-[36px] text-[var(--color-primary-dark)] font-600 leading-[34px] mb-4"
            >
              {{ product.name }}
            </h1>

            <div class="availability-grade mb-[73px] flex justify-between">
              <div class="availability">
                <p
                  v-if="product.availability"
                  class="text-[var(--color-primary-green)]"
                >
                  {{ t('product_available') }}
                </p>
                <p v-else class="text-[var(--color-primary-red)]">
                  {{ t('product_out_of_stock') }}
                </p>
              </div>
              <div class="flex items-center">
                <svg
                  class="mr-2"
                  width="18"
                  height="18"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.75122 6.75258C1.51628 6.53531 1.6439 6.14254 1.96167 6.10487L6.46436 5.5708C6.59387 5.55544 6.70636 5.47411 6.76099 5.35569L8.66016 1.23835C8.79419 0.947769 9.20728 0.947714 9.34131 1.23829L11.2405 5.3556C11.2951 5.47403 11.4069 5.55558 11.5364 5.57093L16.0393 6.10487C16.3571 6.14254 16.4843 6.53543 16.2494 6.75269L12.9208 9.83143C12.8251 9.91998 12.7824 10.0518 12.8079 10.1797L13.6913 14.627C13.7536 14.9408 13.4196 15.184 13.1404 15.0277L9.18386 12.8125C9.07006 12.7488 8.9318 12.7491 8.818 12.8128L4.86108 15.0271C4.58185 15.1834 4.24721 14.9408 4.30957 14.627L5.19311 10.18C5.21852 10.0521 5.176 9.91995 5.08025 9.8314L1.75122 6.75258Z"
                    stroke="var(--color-primary-yellow)"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <p
                  class="product-grade text-[16px] text-[var(--color-muted-gray)] fw-500"
                >
                  {{ formatRating(product.reviews?.averageRating) }}
                  <span>({{ product.reviews?.reviewCount ?? '0' }})</span>
                </p>
              </div>
            </div>

            <ClientOnly>
              <div class="description">
                <p
                  v-if="product.description"
                  class="fw-500 leading-[34px] truncate-6-lines text-[var(--color-primary-dark)]"
                  v-html="product.description"
                />
                <p v-else class="no-data-text">
                  {{ t('description_no_data') }}
                </p>
                <div class="developer mb-[24px]">
                  <p class="text-[20px] fw-400 leading-[34px]">
                    {{ t('product_developer') }} {{ product.vendor }}
                  </p>
                </div>
              </div>
            </ClientOnly>
          </div>

          <div>
            <div class="price mb-10 flex items-center">
              <div class="mr-[57px] max-w-[170px] w-full price_and_discount">
                <div
                  :class="[
                    hasDiscount
                      ? 'text-[16px] line-through text-[#999]'
                      : 'text-[36px]',
                  ]"
                  class="fw-600 discount mr-[57px] text-[var(--color-primary-black)] leading-[34px]"
                >
                  {{ productPrice }}
                  <span>{{ t(currencyLabel) }}</span>
                </div>
                <p
                  v-if="hasDiscount"
                  class="text-[var(--color-primary-pink)] price-with-discount text-[36px] leading-[34px] fw-600"
                >
                  {{ productPriceAfterDiscount }} {{ t(currencyLabel) }}
                </p>
              </div>

              <AmountSelector
                v-model="product.quantity"
                :amount-selector-button="amountButtonSize"
              />
            </div>

            <div
              class="action-button h-[59px] text-[var(--color-gray-pale-lavender)]"
            >
              <VButton
                :pt="{ root: { class: 'product-buy-now__btn' } }"
                class="bg-[var(--color-primary-green)] hover:bg-[var(--color-primary-green)] max-w-[456px] w-full h-full flex justify-center items-center"
                @click="addToCart(product)"
              >
                <p class="buy-now__btn-text mr-1">{{ t('product_buy_now') }}</p>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1H1.26835C1.74213 1 1.97943 1 2.17267 1.08548C2.34304 1.16084 2.48871 1.28218 2.59375 1.43604C2.71269 1.61026 2.75564 1.8429 2.84137 2.30727L5.00004 14L15.4218 14C15.875 14 16.1023 14 16.29 13.9199C16.4559 13.8492 16.5989 13.7346 16.7051 13.5889C16.8252 13.4242 16.8761 13.2037 16.9777 12.7631L16.9785 12.76L18.5477 5.95996L18.5481 5.95854C18.7023 5.29016 18.7796 4.95515 18.6947 4.69238C18.6202 4.46182 18.4635 4.26634 18.2556 4.14192C18.0184 4 17.6758 4 16.9887 4H3.5M16 19C15.4477 19 15 18.5523 15 18C15 17.4477 15.4477 17 16 17C16.5523 17 17 17.4477 17 18C17 18.5523 16.5523 19 16 19ZM6 19C5.44772 19 5 18.5523 5 18C5 17.4477 5.44772 17 6 17C6.55228 17 7 17.4477 7 18C7 18.5523 6.55228 19 6 19Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </VButton>
            </div>
          </div>
        </div>
      </div>

      <SkeletonsAboutProductInfo v-else />
    </div>

    <div
      class="tabs-wrapper pt-[24px] pr-[55px] pb-[32px] pl-[55px] rounded-md bg-[var(--color-gray-lavender)]"
    >
      <AboutProductTabs v-if="!isLoading" :product :reviews />
      <SkeletonsAboutProductTabs v-else />
    </div>

    <div v-if="recommended.length" class="recommended-products">
      <div class="flex items-center justify-center mb-[70px] gap-6 my-8">
        <div class="h-px w-[56px] bg-[var(--color-primary-purple)]" />
        <h2 class="text-xl font-semibold text-center whitespace-nowrap">
          {{ t('recommended_products') }}
        </h2>
        <div class="h-px w-full bg-[var(--color-primary-purple)]" />
      </div>

      <div
        class="recommended-products__content mx-auto max-w-[1500px] pb-[70px] p-4"
      >
        <Swiper
          v-bind="recommendedProductsSwiperOptions"
          :modules="[Navigation, Pagination]"
          class="rounded-lg"
        >
          <SwiperSlide v-for="(item, idx) in recommended" :key="idx">
            <ProductCard class="mt-3 mb-3" :product="item" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

    <div
      v-if="viewed.length"
      class="viewed-products flex items-center justify-center gap-6 my-8"
    >
      <div class="h-px w-[56px] bg-[var(--color-primary-purple)]" />
      <h2 class="text-xl font-semibold text-center whitespace-nowrap">
        {{ t('viewed_products') }}
      </h2>
      <div class="h-px w-full bg-[var(--color-primary-purple)]" />
    </div>

    <div class="viewed-products__content mx-auto max-w-[1500px] pb-[70px] p-4">
      <Swiper
        v-bind="viewedSwiperOptions"
        :modules="[Navigation, Pagination]"
        class="rounded-lg"
      >
        <SwiperSlide v-for="(item, idx) in viewed" :key="idx">
          <ProductCard
            class="mt-3 mb-3"
            :product="item"
            :no-auto-margin="viewed.length === 1"
            @add-to-cart="showProductAddedToast"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import DefaultProductImage from '/assets/images/product-image.png';
import { fullImageUrls } from '#shared/utils/index.js';

import { useViewedProducts } from '~/composables/useViewedProducts.js';

import { storeToRefs } from 'pinia';
import { getProductBySlug } from '~/services/api/products';
import { useAuthStore } from '~~/stores/useAuth.js';
import { useCartStore } from '~~/stores/useCart.js';
import { useCurrencyStore } from '~~/stores/useCurrency.js';
import { useFetchApi } from '~/composables/useApi';

definePageMeta({
  layout: 'breadcrumb',
});

const { t } = useI18n();

const cartStore = useCartStore();

const { isAuthorized } = storeToRefs(useAuthStore());

const { params } = useRoute();
const slug = ref((params as { slug: string }).slug);

const { data: product, error } = useFetchApi<IProduct>('ProductBySlug', getProductBySlug, slug);

console.log('product', product);
console.log('error', error);

const isLoading = ref(!!product.value);

const images = ref([]);

const galleryImages = ref([]);

const getProductImages = (product, size) => {
  return product?.images?.length
    ? fullImageUrls(product.images, size)
    : [DefaultProductImage];
};

images.value = getProductImages(product.value, 'small');

galleryImages.value = getProductImages(product.value, 'thumb');

const { showProductAddedToast } = useToastManager();

const { viewed, removeProductFromViewedAndRedirect } = useViewedProducts();

const { currencyLabel } = storeToRefs(useCurrencyStore());

const { productPrice, productPriceAfterDiscount, hasDiscount } = usePricing(product);

const recommended = ref([]);

const selectedImage = ref(null);

const addToCart = (product) => {
  cartStore.addToCart(product);
};

const swiperOptions = {
  effect: 'creative',
  loop: true,
  autoplay: {
    delay: 1000,
  },
};

const viewedSwiperOptions = computed(() => {
  const count = viewed.value.length;
  return {
    slidesPerView: Math.min(count, 4),
    loop: count > 4,
    breakpoints: {
      320: { slidesPerView: Math.min(count, 2) },
      756: { slidesPerView: Math.min(count, 2) },
      910: { slidesPerView: Math.min(count, 3) },
      1024: { slidesPerView: Math.min(count, 3) },
      1410: { slidesPerView: Math.min(count, 4) },
    },
  };
});

const recommendedProductsSwiperOptions = {
  slidesPerView: 4,
  loop: true,
  breakpoints: {
    320: {
      slidesPerView: 2,
    },
    756: {
      slidesPerView: 2,
    },
    910: {
      slidesPerView: 3,
    },
    1024: {
      slidesPerView: 3,
    },
    1410: {
      slidesPerView: 4,
    },
  },
};

const slideChange = (direction) => {
  const imageIdx = images.value.findIndex((img) => img === selectedImage.value);

  const nextIndex = direction === 'right' ? imageIdx + 1 : imageIdx - 1;

  if (selectedImage.value) {
    selectedImage.value = images.value[nextIndex];
  }
};

const getSelectedImage = computed(() => selectedImage.value);

const handleGalleryClick = (index) => {
  selectedImage.value = images.value[index];
};

onMounted(async () => {
  try {
    isLoading.value = true;
  } catch (error) {
    if (import.meta.client && error?.status === 404) {
      await removeProductFromViewedAndRedirect(slug.value);
    } else {
      console.error('Error when loading goods:', error);
    }
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.send-review__btn {
  background: var(--color-primary-dark);
  width: 100%;
}

.send-review__btn:hover {
  background: var(--color-primary-dark);
}

.nav-panel:hover {
  color: darkred;
}

.product-buy-now__btn:hover {
  border-radius: 17px;
  background: var(--color-primary-green);
  border: none;
}

.product-buy-now__btn {
  border-radius: 17px;
  background: var(--color-primary-green);
  border: none;
}

.product-buy-now__btn {
  border: none;
}

.buy-now__btn-text {
  font-size: 24px;
  font-weight: 300;
}

.about-product-accordion {
  display: none;
}

.truncate-6-lines {
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.amount-selector {
  width: 53px;
  height: 61px;
}

@media (max-width: 1400px) {
  .about-product-content {
    flex-wrap: wrap;
    flex-direction: column;
  }

  .article {
    align-self: flex-start;
  }

  .discount {
    margin-right: 20px;
  }

  .price_and_discount {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
    max-width: 300px;
  }

  .about-product-info {
    max-width: 100%;
  }

  .favorite-button-wrapper {
    top: -12px;
    right: -16px;
  }
}

@media (max-width: 920px) {
  .about-product-container {
    padding: 0;
  }

  .description p {
    font-size: 16px;
  }

  .about-product-accordion {
    display: block;
  }

  .tabs-wrapper {
    display: none;
  }

  .product-name {
    font-size: 20px;
  }

  .price-with-discount {
    font-size: 30px;
    line-height: 32px;
  }

  .availability-grade {
    margin-bottom: 18px;
  }

  .price {
    margin-bottom: 20px;
  }

  .about-product-info {
    min-height: 500px;
  }

  .about-product-info__content {
    min-height: 500px;
    padding: 12px 10px 25px 10px;
  }
}

@media (max-width: 774px) {
  .about-product__image-wrapper {
    height: 390px;
    margin-bottom: 8px;
  }

  .description {
    max-width: 90%;
    margin: 0 auto;
  }

  .price {
    padding: 0 10px;
  }

  .price-with-discount {
    font-size: 24px;
    line-height: 22px;
  }

  .image {
    width: 390px;
  }

  .about-product-info {
    min-height: auto;
  }

  .about-product-content {
    margin-bottom: 31px;
  }

  .about-product__image {
    height: 390px;
  }

  .discount {
    margin-right: 0;
    font-size: 18px;
  }

  .action-button {
    display: flex;
    justify-content: center;
    max-height: 42px;
    max-width: 285px;
    margin: 0 auto;
  }

  .header {
    padding: 0;
  }

  .price_and_discount {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-size: 24px;
    flex-direction: column;
    width: auto;
  }

  .price {
    justify-content: space-between;
  }

  .about-product-info__content {
    min-height: auto;
  }

  .developer {
    margin-bottom: 14px;
  }

  .price_and_discount {
    max-width: 100%;
    margin-right: 0px;
  }

  .price_and_discount,
  discount {
    line-height: 24px;
  }

  .gallery-image {
    max-width: 81px;
    max-height: 83px;
  }
}

@media (max-width: 600px) {
  .about-product__image-wrapper {
    height: 290px;
  }

  .viewed-products__content {
    padding-bottom: 36px;
    padding-right: 0;
    padding-left: 0;
  }

  .image {
    width: 290px;
  }

  .about-product__image {
    height: 290px;
  }

  .gallery-image {
    max-width: 61px;
    max-height: 63px;
  }

  .developer p {
    font-size: 16px;
  }

  .discount {
    font-size: 18px;
  }
}

@media (max-width: 420px) {
  .gallery-container {
    gap: 15px;
  }

  .discount {
    font-size: 16px;
  }
}
</style>

<template>
  <div
    class="w-full product-card relative p-7 max-w-[280px] rounded-lg flex flex-col justify-start"
  >
    <div v-if="product.showAsNew" class="product-badge">
      <div
        :style="{ backgroundColor: product.backgroundStatus }"
        class="status-badge text-center rounded-tl-[8px] rounded-br-[8px] rounded-bl-[8px] max-w-[82px] w-full"
      >
        <p class="fw-600 text-[24px] leading-[var(--line-height-base)]">
          {{ product.status }}
        </p>
      </div>
    </div>
    <div class="product-card-content">
      <div
        class="product-card-header flex relative flex-col items-center justify-center"
      >
        <div
          v-if="isAuthorized"
          class="absolute flex items-center justify-center h-[31px] w-[31px] z-10"
        >
          <FavoriteButton
            :is-favorite="product.isFavorite"
            :product="product"
          />
        </div>
        <NuxtLink
          :to="redirectUrlToProduct"
          :style="{ marginBottom: '4px' }"
          class="block mb-6"
        >
          <img
            :class="[
              'rounded-lg w-full h-auto object-contain',
              'max-w-[128px] min-h-[114px] md:max-w-[135px] md:h-[135px] lg:max-w-[180px] lg:h-[180px]',
            ]"
            :src="productImage"
            alt="Product image"
          >
        </NuxtLink>
        <div class="product-name w-full min-h-[52px]">
          <p class="text-[20px] leading-[22px] fw-500 line-clamp-2">
            {{ product.name }}
          </p>
        </div>
      </div>

      <div class="product-reviews mb-[27px] flex items-center">
        <UiIcon class="mr-2" name="rating" />
        <p class="product-grade text-[16px] text-[#8E8E93] fw-500">
          {{ Number(product.reviews?.averageRating?.toFixed(1)) || '0' }}
          <span>({{ product.reviews?.reviewCount || '0' }})</span>
        </p>
      </div>
      <div class="flex relative items-center justify-between">
        <div class="product-pricing">
          <p
            v-if="hasDiscount"
            class="discount-price absolute -top-3 left-0 fw-500 text-[15px] line-through"
          >
            {{ productPrice }} {{ t(currencyLabel) }}
          </p>
          <p
            :class="{ 'text-[#EF4B4B]': hasDiscount }"
            :style="{ fontSize: !productDiscount ? '16px' : '' }"
            class="text-[24px] price-without-discount leading-[22px] fw-500"
          >
            {{ productDiscount || 0 }} {{ t(currencyLabel) }}
          </p>
        </div>

        <slot name="buy-button">
          <VButton
            :pt="{
              root: {
                style: {
                  border: 'none',
                  padding: '0px',
                  width: '47px',
                  background: 'var( --color-primary-green)',
                  borderRadius: '50%',
                },
              },
            }"
            class="add-product-button self-end flex items-center h-[47px] px-4 py-2 rounded-[50%] transition"
            @click="addToCart(product)"
          >
            <UiIcon name="cart" />
          </VButton>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultProductImage from '~/assets/images/product-image.png';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~~/stores/useAuth';
import { useCurrencyStore } from '~~/stores/useCurrency';
import { fullImageUrls } from '#shared/utils/index.js';
import { useCartStore } from '~~/stores/useCart';
import type { IProduct } from '#shared/types/products';

const props = defineProps<{ product: IProduct; variant: string }>();
const { product, variant } = toRefs(props);

const { isAuthorized } = storeToRefs(useAuthStore());
const { currency, currencyLabel } = storeToRefs(useCurrencyStore());

const cartStore = useCartStore();

const { t } = useI18n();

const addToCart = (product) => {
  cartStore.addToCart(product);
};
const productPrice = computed(() => {
  return product.value?.price?.[currency.value];
});

const productDiscount = computed(() => {
  return product.value?.priceAfterDiscount?.[currency.value];
});

const productImage = computed(() => {
  return product.value?.images?.length
    ? fullImageUrls(product.value.images, 'thumb')[0]
    : DefaultProductImage;
});

const hasDiscount = computed(() => {
  return (
    productDiscount.value !== null &&
    productDiscount.value !== undefined &&
    productDiscount.value < productPrice.value
  );
});

const redirectUrlToProduct = computed(() => {
  return `/product/${product.value.slug}`;
});
</script>

<style scoped>
.product-badge {
  position: absolute;
  max-width: 82px;
  width: 100%;
  top: -8px;
  left: -12px;
  z-index: 100;
}

.card-buy-button {
  border: none;
  background: #28a745;
}

.card-buy-button:hover {
  border: none;
  background: #28a745;
}

.product-card {
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.2);
  height: auto;
}

@media (max-width: 1669px) {
  .product-card {
    padding: 20px 16px 15px 16px;
  }
}

@media (max-width: 1610px) {
  .product-card {
    max-width: 310px;
  }
}

@media (max-width: 1350px) {
  .product-card {
    max-width: 270px;
  }
}

@media (max-width: 1275px) {
  .product-card {
    max-width: 250px;
  }
}

@media (max-width: 1210px) {
  .product-card {
    max-width: 230px;
  }

  .product-name p {
    font-size: 18px;
  }

  .product-reviews {
    margin-bottom: 10px;
  }

  .discount-price {
    top: -0.5rem;
    font-size: 13px;
  }

  .price-without-discount {
    font-size: 20px;
  }
}

@media (max-width: 1150px) {
  .product-card {
    max-width: 240px;
  }
}

@media (max-width: 1000px) {
  .product-card {
  }
}

@media (max-width: 905px) {
  .product-card {
    max-width: 230px;
  }
}

@media (max-width: 800px) {
  .product-card {
    max-width: 200px;
  }
}

@media (max-width: 700px) {
  .product-card {
    max-width: 180px;
    padding: 20px 10px 10px 10px;
  }

  .product-name p {
    font-size: 16px;
  }

  .discount-price {
    top: -0.25rem;
    font-size: 12px;
  }

  .price-without-discount {
    font-size: 18px;
  }
}

@media (max-width: 615px) {
  .product-card {
    max-width: 220px;
  }
}

@media (max-width: 500px) {
  .product-card {
    max-width: 200px;
    padding: 20px 16px 15px 16px;
  }

  .product-badge {
    top: -5px;
    left: -7px;
  }

  .product-grade {
    font-size: 10px;
  }

  .product-reviews {
    margin-bottom: 4px;
  }

  .price-without-discount {
    font-size: 12px !important;
  }

  .product-card-header img,
  a {
    width: 128px !important;
    height: 114px !important;
    margin: 0 auto;
  }

  .product-name p {
    font-size: 14px;
  }

  .discount-price {
    font-size: 10px;
  }

  .price-without-discount {
    font-size: 15px;
  }

  .block {
    margin-bottom: 4px;
  }

  .product-name {
    min-height: 28px;
  }

  .product-name p {
    font-size: 10px !important;
    line-height: 14px;
  }

  .product-card-content {
    max-width: 155px;
    margin: 0 auto;
  }

  .product-grade {
    font-size: 10px;
  }
}

@media (max-width: 470px) {
  .product-card {
    max-width: 160px;
    padding-top: 20px;
  }

  .product-name p {
    font-size: 10px;
  }

  .price-without-discount {
    font-size: 12px;
  }
}
</style>

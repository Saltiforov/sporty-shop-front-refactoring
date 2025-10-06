<template>
  <div v-if="variant === 'cart'" :class="cardRoot({ variant })">
    <img
      :src="productImage"
      :alt="product.name"
      :class="cardImg({ variant })"
    >

    <div class="flex-1 min-w-0">
      <h3 :class="cardName({ variant })">{{ product.name }}</h3>

      <div :class="ratingWrap({ variant })">
        <UiIcon class="mr-2" name="rating" />
        <span class="text-[16px]">
          {{ rating }} <span>({{ count }})</span>
        </span>
      </div>

      <div class="flex items-center gap-3">
        <div class="card-product-count">
          <AmountSelector v-model="product.quantity" min="1" max="100"/>
        </div>
      </div>
    </div>

    <div class="flex flex-col items-end justify-between ml-2">
      <button
        type="button"
        aria-label="remove"
        class="opacity-70 hover:opacity-100 transition"
        @click="$emit('remove', product)"
      >
        <UiIcon name="trash" />
      </button>

      <div class="pt-6 text-right">
        <p v-if="hasDiscount" :class="priceOld({ variant })">
          {{ productPrice }} {{ t(currencyLabel) }}
        </p>
        <p :class="priceCur({ variant, discount: hasDiscount })">
          {{ productPriceAfterDiscount || 0 }} {{ t(currencyLabel) }}
        </p>
      </div>
    </div>
  </div>

  <!-- DEFAULT -->
  <div v-else :class="cardRoot({ variant })">
    <div class="relative flex flex-col items-center">
      <div v-if="isAuthorized" class="absolute left-0 top-0">
        <FavoriteButton :is-favorite="product.isFavorite" :product="product" />
      </div>

      <NuxtLink :to="redirectUrlToProduct" class="block mb-6">
        <img
          :src="productImage"
          :alt="product.name"
          :class="cardImg({ variant })"
        >
      </NuxtLink>

      <div class="w-full">
        <p :class="cardName({ variant })">{{ product.name }}</p>
      </div>
    </div>

    <div :class="ratingWrap({ variant })">
      <UiIcon class="mr-2" name="rating" />
      <p class="text-[16px]">
        {{ rating }} <span>({{ count }})</span>
      </p>
    </div>

    <div class="flex items-center justify-between">
      <div class="relative">
        <p v-if="hasDiscount" :class="priceOld({ variant })">
          {{ productPrice }} {{ t(currencyLabel) }}
        </p>
        <p :class="priceCur({ variant, discount: hasDiscount })">
          {{ productPriceAfterDiscount || 0 }} {{ t(currencyLabel) }}
        </p>
      </div>

      <slot name="buy-button">
        <button
          type="button"
          class="grid place-items-center w-[47px] h-[47px] rounded-full bg-[var(--color-primary-green)] text-white"
          @click="addToCart(product)"
        >
          <UiIcon name="cart" />
        </button>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import DefaultProductImage from '~/assets/images/product-image.png';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '~~/stores/useAuth';
import { useCurrencyStore } from '~~/stores/useCurrency';
import { useCartStore } from '~~/stores/useCart';
import { fullImageUrls } from '#shared/utils/index.js';
import type { IProduct } from '#shared/types/products';
import {
  cardRoot,
  cardImg,
  cardName,
  ratingWrap,
  priceOld,
  priceCur,
} from '~/utils/styles';

const props = defineProps<{ product: IProduct; variant?: any }>();
const variant = computed<any>(() => props.variant ?? 'default');

const { isAuthorized } = storeToRefs(useAuthStore());
const { currencyLabel } = storeToRefs(useCurrencyStore());
const { productPrice, productPriceAfterDiscount, hasDiscount } = usePricing(props.product);
const { addToCart } = useCartStore();
const { t } = useI18n();

const rating = computed(
  () => Number(props.product.reviews?.averageRating?.toFixed(1)) || 0,
);

const count = computed(() => props.product.reviews?.reviewCount || 0);

const redirectUrlToProduct = computed(() => `/product/${props.product.slug}`);

const productImage = computed(() =>
  props.product?.images?.length
    ? fullImageUrls(props.product.images, 'thumb')[0]
    : DefaultProductImage,
);
</script>

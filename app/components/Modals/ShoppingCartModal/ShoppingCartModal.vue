<template>
  <div>
    <!-- Оверлей -->
    <div :class="drawerOverlay({ open: isOpen })" @click="emit('close')" />

    <!-- Панель -->
    <aside :class="drawerPanel({ open: isOpen })">
      <!-- header -->
      <div class="flex items-center justify-between pb-[49px]">
        <div class="flex">
          <h1 class="large-title mr-[25px]">{{ t('cart_title') }}</h1>
          <p class="large-title text-[var(--color-muted-light-gray)]">
            ({{ cartStore.cartCount || 0 }})
          </p>
        </div>

        <button
          type="button"
          class="p-0 bg-transparent border-0"
          @click="closeModal"
        >
          ✕
        </button>
      </div>

      <!-- пустая корзина -->
      <div
        v-if="!cartProducts.length"
        class="py-[50px] text-center text-[24px] text-[var(--color-gray-dark-charcoal)]"
      >
        {{ t('empty_cart_text') }}
      </div>

      <!-- товары -->
      <ProductCard
        v-for="p in cartProducts"
        :key="p.id"
        variant="cart"
        :product="p"
      >
        <template #buy-button>
          <button
            type="button"
            class="flex items-center justify-center rounded-full border-0"
            style="
              background: var(--color-primary-green);
              color: var(--color-primary-white);
              width: 29px;
              height: 29px;
            "
            @click="addToCart(p)"
          >
            +
          </button>
        </template>
      </ProductCard>

      <div class="final-price pr-[50px] mb-[42px]">
        <div class="flex justify-end items-center">
          <p
            class="fw-600 text-[16px] total-price-label text-[var(--color-muted-light-gray)] mr-[14px] leading-[34px]"
          >
            {{ t('total_price_label') }}:
          </p>
          <p>
            {{ totalPriceBeforeDiscount }}
            <span class="text-[15px] text-[var(--color-primary-dark)]">{{
              t(currencyLabel)
            }}</span>
          </p>
        </div>
        <div
          class="flex text-[var(--color-primary-pink)] justify-end items-center"
        >
          <p
            class="fw-600 text-[16px] total-discount-label mr-[14px] leading-[34px]"
          >
            {{ t('discount_label') }}:
          </p>
          <p>
            {{ totalDiscount }}
            <span class="text-[15px]">{{ t(currencyLabel) }}</span>
          </p>
        </div>
        <div class="flex justify-end items-center">
          <p
            class="fw-600 text-[16px] amount-to-pay-label text-[var(--color-muted-light-gray)] mr-[14px] leading-[34px]"
          >
            {{ t('amount_to_pay_label') }}:
          </p>
          <p>
            {{ totalPriceAfterDiscount }}
            <span class="text-[15px] text-[var(--color-primary-dark)]">{{
              t(currencyLabel)
            }}</span>
          </p>
        </div>
      </div>

      <!-- действия -->
      <div class="mb-[50px] flex flex-col items-center">
        <div class="mb-[10px] w-full max-w-[423px]">
          <NuxtLink to="/checkout">
            <button
              type="button"
              class="w-full rounded-[var(--default-rounded)] bg-[var(--color-primary-dark)] text-white py-3"
              @click="closeModal"
            >
              {{ t('make_order') }}
            </button>
          </NuxtLink>
        </div>

        <button
          type="button"
          class="text-[var(--small-title-color)] bg-transparent border-0"
          @click="handleContinueShopping"
        >
          {{ t('continue_shopping') }}
        </button>
      </div>

      <!-- рекомендованные -->
      <section class="recommended-products">
        <div class="flex items-center gap-4">
          <div class="h-px w-[152px] bg-white" />
          <h2 class="h2-title whitespace-nowrap text-center">
            {{ t('recommended_products') }}
          </h2>
          <div class="h-px w-[152px] bg-white" />
        </div>

        <div class="mt-[22px] grid grid-cols-2 gap-[30px]">
          <ProductCard
            v-for="p in products"
            :key="p.id"
            variant="small"
            :product="p"
          >
            <template #buy-button>
              <button
                type="button"
                class="flex items-center justify-center rounded-full border-0"
                style="
                  background: var(--color-primary-green);
                  color: var(--color-primary-white);
                  width: 29px;
                  height: 29px;
                "
                @click="addToCart(p)"
              >
                +
              </button>
            </template>
          </ProductCard>
        </div>
      </section>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useCartStore } from '~~/stores/useCart';
import { useAppShellState } from '~~/stores/useAppShellState.client';
import { useCurrencyStore } from '~~/stores/useCurrency';
import { drawerOverlay, drawerPanel } from '~/utils/styles';

const emit = defineEmits([
  'continue-shopping',
  'handle-recommended-product',
  'close',
]);

const cartStore = useCartStore();
const { currencyLabel } = storeToRefs(useCurrencyStore());
const { cartProducts } = storeToRefs(cartStore);

const { isOpen, closeModal } = useAppShellState();

const {
  totalPriceBeforeDiscount,
  totalPriceAfterDiscount,
  totalDiscount,
} = usePricing(cartProducts);

const { t } = useI18n();

const handleContinueShopping = () => emit('continue-shopping');
const addToCart = (p: any) => cartStore.addToCart(p);
</script>

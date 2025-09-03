<template>
  <div class="shopping-cart-content mb-5 grid grid-rows-auto gap-[33px]">
    <div
        :class="['cart-items-wrapper', { 'scrollable-items': isScrollable }]"
    >
      <CartItem
          v-for="item in productsOverview"
          :key="item.id"
          :cart-product="item"
          :is-history-view="isHistoryView"
          @remove-product="handleRemoveProduct"
          @handle-cart-item="emit('handle-cart-item')"
      />
    </div>

    <div class="final-price pr-[50px] mb-[42px]">
      <div class="flex justify-end items-center">
        <p class="fw-600 text-[16px] total-price-label text-[var(--color-muted-light-gray)] mr-[14px] leading-[34px]">
          {{ t('total_price_label') }}:</p>
        <p>
          {{ totalPriceBeforeDiscount }} <span
            class="text-[15px] text-[var(--color-primary-dark)]">{{ t(currencyStore.label) }}</span>
        </p>
      </div>
      <div class="flex text-[var(--color-primary-pink)] justify-end items-center">
        <p class="fw-600 text-[16px] total-discount-label mr-[14px] leading-[34px]">{{ t('discount_label') }}:</p>
        <p>
          {{ totalDiscount }} <span
            class="text-[15px]">{{ t(currencyStore.label) }}</span>
        </p>
      </div>
      <div class="flex justify-end items-center">
        <p class="fw-600 text-[16px] amount-to-pay-label text-[var(--color-muted-light-gray)] mr-[14px] leading-[34px]">
          {{ t('amount_to_pay_label') }}:</p>
        <p>
          {{ totalPriceAfterDiscount }} <span class="text-[15px] text-[var(--color-primary-dark)]">{{
            t(currencyStore.label)
          }}</span>
        </p>
      </div>

    </div>
  </div>
  <Toast/>
</template>

<script setup lang="ts">
import CartItem from '~/components/Cards/CartItem/CartItem.vue';
import {calculateTotal} from '~/utils/index.js';
import {useConfirmWithToast} from '~/composables/useConfirmWithToast.js';
import {useCartStore} from '~/stores/cart.js';
import {useCurrencyStore} from '~/stores/currency.js';

const {confirmAction} = useConfirmWithToast();

const emit = defineEmits(['handle-cart-item']);

const {t} = useI18n();

const cartStore = useCartStore();

const currencyStore = useCurrencyStore();

const {productsOverview, scrollAfter} = defineProps({
  productsOverview: {
    type: Array,
    required: false,
    default: () => [],
  },
  scrollAfter: {
    type: Number,
    default: 2,
  },
  isHistoryView: {
    type: Boolean,
    default: false,
  },
});

const deleteProduct = (id, name) => {
  cartStore.removeFromCart(id);
};

const handleRemoveProduct = (product) => {
  console.log('handleRemoveProduct', product);
  confirmDelete(product);
};

const confirmDelete = ({ _id, name }) => {
  confirmAction({
    message: t('confirm_delete_message', { product: name }),
    header: t('confirm_delete_header'),
    acceptLabel: t('confirm_delete_accept_label'),
    rejectLabel: t('confirm_delete_reject_label'),
    acceptAction: () => deleteProduct(_id, name),
    toastMessages: {
      accept: {
        severity: 'success',
        summary: t('confirm_delete_toast_accept_summary'),
        detail: t('confirm_delete_toast_accept_detail', { product: name }),
        life: 3000,
      },
      reject: {
        severity: 'error',
        summary: t('confirm_delete_toast_reject_summary'),
        detail: t('confirm_delete_toast_reject_detail'),
        life: 3000,
      },
    },
  });
};

const isScrollable = computed(() => {
  return productsOverview.length > scrollAfter;
});

const currency = computed(() => currencyStore.isUAHSelected ? 'uah' : 'eur');

const totalPriceBeforeDiscount = computed(() => calculateTotal(productsOverview, currency.value, false));

const totalPriceAfterDiscount = computed(() => calculateTotal(productsOverview, currency.value, true));

const totalDiscount = computed(() => totalPriceBeforeDiscount.value - totalPriceAfterDiscount.value);

</script>

<style scoped>
.cart-items-wrapper {
  display: flex;
  flex-direction: column;
  gap: 33px;
}

.scrollable-items {
  max-height: 345px;
  overflow-y: auto;
  padding-right: 10px;
}

.scrollable-items::-webkit-scrollbar {
  width: 8px;
}

.scrollable-items::-webkit-scrollbar-thumb {
  background: var(--color-primary-dark);
  border-radius: 8px;
}

@media (max-width: 600px) {
  .final-price {
    padding-right: 20px;
  }
  .cart-items-wrapper {
    gap: 22px;
  }
  .total-price-label,
  .total-discount-label,
  .amount-to-pay-label {
    font-size: 15px;
  }
}
</style>

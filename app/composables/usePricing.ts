import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';
import { storeToRefs } from 'pinia';
import { useCurrencyStore } from '~~/stores/useCurrency';

export function usePricing(input: MaybeRefOrGetter<IProduct | IProduct[]>) {
  const { currency } = storeToRefs(useCurrencyStore());
  const entity = computed(() => toValue(input));
  const isSingle = computed(() => !Array.isArray(entity.value));

  const productPrice = computed(() =>
    isSingle.value ? entity.value?.price?.[currency.value] ?? 0 : 0,
  );

  const productPriceAfterDiscount = computed(() =>
    isSingle.value ? entity.value?.priceAfterDiscount?.[currency.value] ?? 0 : 0,
  );

  const hasDiscount = computed(() =>
    isSingle.value ? !!entity.value?.priceAfterDiscount?.[currency.value] : false,
  );

  const totalPriceBeforeDiscount = computed(() => {
    if (isSingle.value) return 0;
    return (entity.value as IProduct[]).reduce((sum, it) => {
      const price = it.price?.[currency.value] ?? 0;
      return sum + price * (it.quantity ?? 1);
    }, 0);
  });

  const totalPriceAfterDiscount = computed(() => {
    if (isSingle.value) return 0;
    return (entity.value as IProduct[]).reduce((sum, it) => {
      const discounted = it.priceAfterDiscount?.[currency.value];
      const price = discounted ?? (it.price?.[currency.value] ?? 0);
      return sum + price * (it.quantity ?? 1);
    }, 0);
  });

  const totalDiscount = computed(
    () => totalPriceBeforeDiscount.value - totalPriceAfterDiscount.value,
  );

  return {
    productPrice,
    productPriceAfterDiscount,
    hasDiscount,
    totalPriceBeforeDiscount,
    totalPriceAfterDiscount,
    totalDiscount,
  };
}

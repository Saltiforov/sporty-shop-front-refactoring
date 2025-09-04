import { computed, toValue } from 'vue';
import { storeToRefs } from 'pinia';
import { useCurrencyStore } from '~~/stores/useCurrency';

export function usePricing(input: IProduct | IProduct[]) {
  const { currency } = storeToRefs(useCurrencyStore());

  const product = computed(() => toValue(input.value));
  const isSingle = computed(() => !Array.isArray(product.value));

  const productPrice = computed(() => item?.price?.[currency.value] ?? 0);

  const productPriceAfterDiscount = computed(
    () => item?.priceAfterDiscount?.[currency.value] ?? 0,
  );

  const hasDiscount = computed(() => !!productPriceAfterDiscount.value);


  const unitPrice = (item: any, cur: string, useDiscount: boolean) => {
    const hasDisc =
      useDiscount &&
      item.priceAfterDiscount &&
      typeof item.priceAfterDiscount[cur] === 'number';

    const discounted = hasDisc ? item.priceAfterDiscount[cur] : null;
    const regular =
      item.price && typeof item.price[cur] === 'number' ? item.price[cur] : 0;

    return discounted !== null ? discounted : regular;
  };

  const sumTotal = (list: any[], cur: string, useDiscount: boolean) => {
    return list.reduce((total, item) => {
      const qty = item.quantity || 1;
      return total + unitPrice(item, cur, useDiscount) * qty;
    }, 0);
  };

  const totalPriceBeforeDiscount = computed(() => {
    if (isSingle.value) return 0;
    return sumTotal(product.value, currency.value, /* useDiscount */ false);
  });

  const totalPriceAfterDiscount = computed(() => {
    if (isSingle.value) return 0;
    return sumTotal(product.value, currency.value, /* useDiscount */ true);
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

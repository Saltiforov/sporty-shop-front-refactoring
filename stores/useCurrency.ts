import { defineStore } from 'pinia';
import { computed } from 'vue';
import { useCookie } from '#app';
import { Currencies, CurrencyLabel } from '#shared/types/currencies';

export const useCurrencyStore = defineStore('currency', () => {
  const currency = useCookie('currency', {
    default: () => Currencies.UAH,
  });

  const isEurActiveCurrency = computed(() => currency.value === Currencies.EUR);
  const isUahActiveCurrency = computed(() => currency.value === Currencies.UAH);

  const currencyLabel = computed(() => {
    return isUahActiveCurrency.value ? CurrencyLabel.UAH : CurrencyLabel.EUR;
  });

  const setCurrency = (currency) => {
    currency.value = currency;
  };

  return {
    currency,
    setCurrency,
    isEurActiveCurrency,
    isUahActiveCurrency,
    currencyLabel,
  };
});

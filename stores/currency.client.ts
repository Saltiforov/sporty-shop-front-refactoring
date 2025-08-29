import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useCookie } from '#app'
import { Currency, CurrencyLabel } from '#shared/types/currency'

export const useCurrencyStore = defineStore('currency', () => {
  const currency = useCookie('currency', {
    default: () => Currency.UAH,
  })

  const isEurActiveCurrency = computed(() => currency.value === Currency.EUR)
  const isUahActiveCurrency = computed(() => currency.value === Currency.UAH)

  const currencyLabel = computed(() => {
    return isUahActiveCurrency.value ? CurrencyLabel.UAH : CurrencyLabel.EUR
  })

  const setCurrency = (currency: string) => {
    currency.value = currency
  }

  return {
    currency,
    setCurrency,
    isEurActiveCurrency,
    isUahActiveCurrency,
    currencyLabel,
  }
})

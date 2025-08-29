import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export const useToastManager = () => {
  const toast = useToast()
  const { t } = useI18n()

  const show = ({
    severity = 'info', // success | error | warn | info
    summary,
    detail,
    group = 'top-right', // по умолчанию top-right
    life = 3000,
  }) => {
    toast.add({
      severity,
      summary,
      detail,
      group,
      life,
    })
  }

  const showSuccess = (
    detail,
    summary = t('toast_success_title'),
    group = 'top-right'
  ) => {
    show({ severity: 'success', summary, detail, group })
  }

  const showError = (
    detail,
    summary = t('toast_error_title'),
    group = 'top-right'
  ) => {
    show({ severity: 'error', summary, detail, group })
  }

  const showProductAddedToast = (product) => {
    show({
      severity: 'success',
      summary: t('toast_success_title'),
      detail: t('toast_added_to_cart', { productName: product.name }),
      group: 'br',
      life: 3000,
    })
  }

  return {
    show,
    showSuccess,
    showError,
    showProductAddedToast,
  }
}

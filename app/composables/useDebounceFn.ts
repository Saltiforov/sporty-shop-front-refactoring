// composables/useDebounceFn.ts
import { ref, onUnmounted } from 'vue';

/**
 * Дебаунс-обёртка для любой функции.
 * - типобезопасна (сохраняет аргументы и this)
 * - есть cancel/flush
 * - есть флаг pending
 */
export function useDebounceFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
) {
  const timer = ref<number | undefined>(undefined);
  const pending = ref(false);

  // чтобы сохранить корректный this, берём его в рантайме
  function debounced(this: ThisParameterType<T>, ...args: Parameters<T>): void {
    pending.value = true;
    if (timer.value !== undefined) clearTimeout(timer.value);

    const ctx = this;
    timer.value = window.setTimeout(() => {
      pending.value = false;
      fn.apply(ctx, args);
    }, delay);
  }

  function cancel() {
    if (timer.value !== undefined) {
      clearTimeout(timer.value);
      timer.value = undefined;
      pending.value = false;
    }
  }

  // немедленно вызвать с последними аргументами нельзя — мы их не храним осознанно.
  // но можно принудительно выполнить свою функцию вручную:
  function flush(...args: Parameters<T>) {
    cancel();
    fn(...args);
  }

  onUnmounted(cancel);

  return {
    debounced: debounced as (...args: Parameters<T>) => void,
    cancel,
    flush,
    pending,
  };
}

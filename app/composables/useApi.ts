import { isRef, isReactive, toValue } from 'vue';
import { stableKey } from '#shared/utils';

type UseFetchOpts = {
  watch?: any[];     // зависит ли повторный вызов от внешних реактивных deps
  server?: boolean;  // делать запрос на сервере (SSR)? по умолчанию true
  cacheOnly?: boolean; // только прочитать кеш, без вызова service
};

export function useFetchApi<T>(
  keyBase: string,                                   // например 'GeneralProductsList'
  service: (api: any, params?: any) => Promise<T>,   // ваш API-метод, напр. getProducts
  params?: any,                                      // объект или ref/computed
  opts: UseFetchOpts = {},
): any {
  const { $basicApi } = useNuxtApp();

  // безопасно «прочитать» params (ref/computed/plain)
  const readParams = () => toValue(params) ?? null;

  // Ключ как ФУНКЦИЯ — чтобы был реактивным (оч важно!)
  const keyFn = () => stableKey(keyBase, readParams());

  // Что слушать для повторных вызовов
  const watchDeps =
    opts.watch ?? (isRef(params) || isReactive(params) ? [params] : undefined);

  // Режим: только чтение из кеша, без сетевых запросов
  if (opts.cacheOnly) {
    const id = keyFn();                 // уже стабильный id
    return useNuxtData<T>(id);          // { data, pending, error }
  }

  // Обычный режим: ходим в сеть (или берём кеш), ключ реактивен
  return useAsyncData<T>(
    keyFn,                              // <— функция!
    () => service($basicApi, readParams()),
    {
      watch: watchDeps,
      server: opts.server ?? true,
    },
  );
}

// Удобняшка для явного чтения кеша по (base, params)
export function useCachedApi<T>(keyBase: string, params?: any) {
  const id = stableKey(keyBase, toValue(params));
  return useNuxtData<T>(id);            // вернёт реактивные { data, pending, error }
}

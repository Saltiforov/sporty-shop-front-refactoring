import { isRef, isReactive, toValue } from 'vue';

const stable = (o: any) =>
  JSON.stringify(
    Object.keys(o ?? {}).sort()
      .reduce((a, k) => (a[k] = (o as any)[k], a), {} as any),
  );

export function useFetchApi<T>(
  keyBase: string,                                      // 'GeneralProductsList'
  service: (api: any, params?: any) => Promise<T>,      // например getProducts
  params?: any,                                         // объект или ref/computed
  opts: { watch?: any[]; server?: boolean } = {},
) {
  const { $basicApi } = useNuxtApp();
  const read = () => toValue(params) ?? {};
  const key = () => `${keyBase}:${stable(read())}`;
  const watchDeps = opts.watch ?? ((isRef(params) || isReactive(params)) ? [params] : undefined);
  console.log('watchDeps', watchDeps);
  return useAsyncData<T>(
    key,
    () => service($basicApi, read()),
    { watch: watchDeps, server: opts.server ?? true },
  );
}

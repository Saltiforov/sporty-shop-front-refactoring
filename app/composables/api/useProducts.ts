export function useProducts(params: MaybeRef<{ q?: string; page?: number }>) {
  const { $api } = useNuxtApp() as never;

  return useFetch(() => '/products', {
    $fetch: $api, // наш клиент
    query: () => toValue(params), // реактивные параметры
    key: () => `products:${JSON.stringify(toValue(params))}`, // ключ кэша/SSR
  });
}

export function useProduct(id: MaybeRef<string>) {
  const { $api } = useNuxtApp() as never;
  return useFetch(() => `/products/${toValue(id)}`, {
    $fetch: $api,
    key: () => `product:${toValue(id)}`,
  });
}

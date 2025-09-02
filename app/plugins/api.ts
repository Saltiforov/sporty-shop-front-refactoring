import { createBasicApi } from '~/utils/basicApi';
import type { IBasicApi } from '~/types/api';
import { useCookie } from '#app';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const token = useCookie<string | null>('token');

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }: any) {
      console.log('onRequest', options, token);
      if (token.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token.value}`,
        };
      }
    },
  });

  const basicApi: IBasicApi = createBasicApi(api);

  return {
    provide: {
      api,
      basicApi,
    },
  };
});

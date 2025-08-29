import type { IBasicApi } from '~/shared/types/basic-api'

declare module '#app' {
  interface NuxtApp {
    $basicApi: IBasicApi
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $basicApi: IBasicApi
  }
}

export {}

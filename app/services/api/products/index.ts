const routes = {
  products: '/api/client/products',
}

// services/products.ts
export async function getProducts(api: any, params: any) {
  // if (!api) {
  //
  //
  //   console.error('[getProducts] api is undefined!')
  //   throw new Error('API client is missing')
  // }


  try {
    console.log('[getProducts] params:', params)
    const res = await api.get('/api/client/products', { params })
    console.log('[getProducts] success, keys:', res && Object.keys(res))
    return res
  } catch (e: any) {
    // полезный лог о причине
    // console.error('[getProducts] failed:', {
    //   status: e?.status || e?.response?.status,
    //   message: e?.message,
    //   data: e?.data
    // })
    throw e // ВАЖНО: пробросить, чтобы useAsyncData получил error
  }
}


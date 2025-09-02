const routes = {
  products: '/client/products',
  productsSuggestion: '/client/products-suggestion',
  productsSale: '/client/products/on-sale',
  productBySlug: (slug) => `/client/products/${slug}`,
};

export async function getProducts(api: any, params: any) {
  return await api.get(routes.products, { params });
}

export async function getProductBySlug(api: any, slug: any) {
  return await api.get(routes.productBySlug(slug));
}

export async  function getSuggestionProductList (api, params) {
  return await api.get(routes.productsSuggestion, { params });
}

export async  function getProductsOnSale (api) {
  return await api.get(routes.productsSale);
}


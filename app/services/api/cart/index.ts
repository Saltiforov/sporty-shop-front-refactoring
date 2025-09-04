const routes = {
  cartProducts: '/client/products',
};

export async function getCartProducts(api: any, ids: string[]) {
  return await api.get(routes.cartProducts, {
    params: { ids: ids.join(',') },
  });
}

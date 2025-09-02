// todo sync about move this to store
export const useViewedProducts = () => {
  const viewed = useCookie<IProduct[]>('viewed-products', {
    default: () => [],
    watch: true,
    sameSite: 'lax',
  });

  const isCurrentProductViewed = (slug: string) => {
    return !!viewed.value.find(viewedProduct => viewedProduct.slug === slug);
  };

  const addProductToViewed = (product: IProduct) => {
    if (!product.slug) return;

    if (!isCurrentProductViewed(product.slug)) viewed.value.push(product);

    if (viewed.value.length > 10) viewed.value = viewed.value.slice(0, 10);
  };

  const removeProductFromViewedAndRedirect = async (slug: string) => {
    if (import.meta.client) {
      viewed.value = viewed.value.filter(() => isCurrentProductViewed(slug));
      navigateTo('/');
    }
  };

  const clearViewed = () => {
    viewed.value = [];
  };

  return {
    viewed,
    addProductToViewed,
    clearViewed,
    removeProductFromViewedAndRedirect,
  };
};

const router = {
  reviews: (slug) => `/api/client/products/${slug}/reviews`,
};

export const leaveReview = async (api, payload) => {
  return api.post(router.reviews(payload.slug), payload);
};

// export const getReviewByProduct = (slug) => {
//   const { $api } = useNuxtApp();
//   return $api.get(router.reviews(slug));
// };

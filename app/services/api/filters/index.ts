const router = {
  filters: '/client/filters',

};

export const getAllFilters = async (api, params) => {
  return api.get(router.filters, params);
};


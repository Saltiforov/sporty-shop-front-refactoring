const router = {
  filters: '/client/filters',

};

export const getAllFilters = async (api, params) => {
  console.log('getAllFilters');
  return api.get(router.filters, params);
};


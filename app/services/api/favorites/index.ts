const routes = {
  favorites: (id) => `/api/client/favorites/${id}`,
}

export const addProductToFavorites = (api, id) => {
  return api.post(routes.favorites(id))
}

export const deleteProductFromFavorites = (api, id) => {
  return api.delete(routes.favorites(id))
}

import { useAuthStore } from '~~/stores/auth.client'

export default defineNuxtRouteMiddleware(to => {
  const { isAuthorized } = useAuthStore();

  if (!isAuthorized) {
    return navigateTo('/login');
  }
})

import { useAuthStore } from '~~/stores/useAuth';

export default defineNuxtRouteMiddleware(to => {
  const { isAuthorized } = useAuthStore();

  // if (!isAuthorized) {
  //   return navigateTo('/auth/login');
  // }
});

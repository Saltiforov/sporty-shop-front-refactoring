import { useCanonical } from '#shared/comsopables/useCanonical';

export default defineNuxtRouteMiddleware(async (to) => {
  const { canonicalUrl, isCanonical } = await useCanonical(to);

  if (!canonicalUrl.value) return;
  if (isCanonical.value) return;

  return navigateTo(canonicalUrl.value, { redirectCode: 301 });
});

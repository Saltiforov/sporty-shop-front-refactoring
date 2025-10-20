
// /middleware/seo.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  console.log('SERVER SOP SDOPDADOSAPSD OBAL defineNuxtRouteMiddleware');
  // const { canonicalUrl } = await useCanonical(); // ВЫЗОВ!
  // console.log('defineNuxtRouteMiddleware canonicalUrl, ', canonicalUrl.value);
  // валидируем/нормализуем query и путь
  // if (!isCanonical.value) {
  //   // важно: на сервере редирект произойдёт до рендера
  //   return navigateTo(canonicalUrl.value, { redirectCode: 301 });
  // }
});

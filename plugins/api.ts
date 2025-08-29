export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    console.log('Plugin running on SERVER!');
  } else {
    console.log('Plugin running on CLIENT!');
  }
  return { provide: {} };
});

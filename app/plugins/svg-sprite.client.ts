export default defineNuxtPlugin(() => {
  // @ts-expect-error virtual module provided by vite plugin
  import('virtual:svg-icons-register');
});

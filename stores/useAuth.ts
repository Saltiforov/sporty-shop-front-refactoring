import { defineStore } from 'pinia';
import { computed } from 'vue';
import type { IUser } from '#shared/types/users';
import type { IError } from '#shared/types/errors';
import { useCookie } from '#app';

const routes = {
  login: '/admin/login',
  signup: '/admin/signup',
  fetchMe: '/client/users/me',
  updateUserInfo: '/client/users/',
};

// todo remove all logic with localStorage use useCookie instead
export const useAuthStore = defineStore('auth', () => {
  const authToken = useCookie<string | null>('token');
  const user = useCookie<string | null>('user');
  const { $basicApi } = useNuxtApp();

  const isAuthorized = computed(() => authToken.value);

  async function login({ username, password }) {
    const res = await $basicApi.post(routes.login, { username, password });

    if (res.token) {
      authToken.value = res.token;
      await fetchMe();
    }
  }

  function logOut() {
    authToken.value = null;
    user.value = null;
  }

  async function fetchMe() {
    try {
      user.value =  await $basicApi.get(routes.fetchMe);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  async function signUp(userInfo: IUser) {
    $basicApi
      .post(routes.signup, userInfo)
      .then(async ({ token }: { token: string }) => {
        // todo remove additional request
        if (token) {
          await login(userInfo);
        } else {
          throw new Error('Registration failed');
        }
      })
      .catch((error: IError) => {
        console.error('Registration error:', error);
        throw error;
      });
  }

  return {
    user,
    isAuthorized,
    login,
    logOut,
    fetchMe,
    signUp,
  };
});

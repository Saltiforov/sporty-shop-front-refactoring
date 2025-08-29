import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { IUser } from '#shared/types/user'
import type { IError } from '#shared/types/error'

const routes = {
  login: '/api/admin/login',
  signup: '/api/admin/signup',
  fetchMe: '/api/client/users/me',
  updateUserInfo: '/api/client/users/',
}

export const useAuthStore = defineStore('auth', () => {
  const authToken = ref(null)
  const user = ref(null)
  const { $basicApi } = useNuxtApp()

  const isAuthorized = computed(() => authToken.value)

  async function login(username: string, password: string) {
    const res = await $basicApi.post(routes.login, { username, password })

    if (res.token) {
      const cookie = useCookie<string | null>('token')
      cookie.value = res.token
      authToken.value = res.token
      localStorage.setItem('authToken', res.token)
      await fetchMe()
    }
  }

  function logOut() {
    const cookie = useCookie<string | null>('token')
    cookie.value = null
    authToken.value = null
    user.value = null

    localStorage.removeItem('authToken')
    localStorage.removeItem('currentUser')
  }

  async function fetchMe() {
    try {
      const me = await $basicApi.get(routes.fetchMe)
      localStorage.setItem('currentUser', JSON.stringify(me))
      user.value = me
    } catch (error: IError) {
      console.error('Error fetching user data:', error)
      localStorage.removeItem('currentUser')
    }
  }

  function restoreAuthDataFromLocalStorage() {
    const token = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('currentUser')

    if (token) {
      authToken.value = token
      const cookie = useCookie<string | null>('token')
      cookie.value = token
    }
    if (storedUser) {
      try {
        user.value = JSON.parse(storedUser)
      } catch {
        user.value = null
      }
    }
  }

  async function signUp(userInfo: IUser) {
    $basicApi
      .post(routes.signup, userInfo)
      .then(async ({ token }: { token: string }) => {
        if (token) {
          const { username, password } = userInfo
          await login(username, password)
        } else {
          throw new Error('Registration failed')
        }
      })
      .catch((error: IError) => {
        console.error('Registration error:', error)
        throw error
      })
  }

  return {
    user,
    authToken,
    isAuthorized,
    login,
    logOut,
    fetchMe,
    signUp,
    restoreAuthDataFromLocalStorage,
  }
})

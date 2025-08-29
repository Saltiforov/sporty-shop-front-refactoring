export function getAuthTokenFromLocalStorage() {
  return localStorage.getItem('authToken')
}

export function getCurrentUserFromLocalStorage(token: string) {}

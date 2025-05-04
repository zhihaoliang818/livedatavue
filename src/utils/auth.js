// import Cookies from 'js-cookie'

// const TokenKey = 'Admin-Token'

// export function getToken() {
//   return Cookies.get(TokenKey)
// }

// export function setToken(token) {
//   return Cookies.set(TokenKey, token)
// }

// export function removeToken() {
//   return Cookies.remove(TokenKey)
// }
const TokenKey = 'Admin-Token'

// if (process.env.NODE_ENV === 'production') {
//   store = new Store()
// }

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  // if (process.env.NODE_ENV === 'production') {
  //   return store.delete(TokenKey)
  // }
  return localStorage.removeItem(TokenKey)
}

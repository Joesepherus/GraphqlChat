import store from '../stores/store'
import { toast } from 'react-toastify'

// export let server_api = 'http://localhost:3001'
export let server_api = ''

export function showToast(msg, type) {
  toast[type](msg, {
    position: toast.POSITION.BOTTOM_LEFT
  })
}

export function setLoginStatus(status, id) {
  localStorage.setItem('logged', status)
  store.setLoggedIn(status)
  if (id) localStorage.setItem('id', id)
  else localStorage.setItem('id', '')
}

export function redirect(url, history) {
  history.push(url)
}

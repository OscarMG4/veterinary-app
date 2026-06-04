import axios from 'axios'
import { API_BASE_URL } from '../constants/api'
import { STORAGE_KEYS } from '../constants/storage'
import { ROUTES } from '../constants/routes'
import {
  getRedirectingToLogin,
  handleApiError,
  setRedirectingToLogin,
} from '../utils/errorHandler'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    if (status === 401 && !getRedirectingToLogin()) {
      setRedirectingToLogin(true)
      localStorage.removeItem(STORAGE_KEYS.TOKEN)
      localStorage.removeItem(STORAGE_KEYS.ROLE)
      localStorage.removeItem(STORAGE_KEYS.USERNAME)

      const isLoginPage = window.location.pathname === ROUTES.LOGIN
      if (!isLoginPage) {
        window.location.href = ROUTES.LOGIN
      } else {
        setRedirectingToLogin(false)
      }
      handleApiError(error)
      return Promise.reject(error)
    }

    if (status === 403) {
      handleApiError(error)
      return Promise.reject(error)
    }

    handleApiError(error)
    return Promise.reject(error)
  },
)

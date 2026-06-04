import { message, notification } from 'antd'
import type { AxiosError } from 'axios'
import type { ApiErrorResponse } from '../interfaces/api'

let isRedirectingToLogin = false

export function setRedirectingToLogin(value: boolean) {
  isRedirectingToLogin = value
}

export function getRedirectingToLogin() {
  return isRedirectingToLogin
}

export function parseApiError(error: unknown): ApiErrorResponse | null {
  if (!error || typeof error !== 'object' || !('isAxiosError' in error)) {
    return null
  }
  const axiosError = error as AxiosError<ApiErrorResponse>
  return axiosError.response?.data ?? null
}

export function handleApiError(error: unknown, silent = false): void {
  const apiError = parseApiError(error)

  if (!apiError) {
    if (!silent) {
      message.error('Error de conexión con el servidor')
    }
    return
  }

  if (silent || getRedirectingToLogin()) return

  if (apiError.errors && Object.keys(apiError.errors).length > 0) {
    const description = Object.entries(apiError.errors)
      .map(([field, msg]) => `${field}: ${msg}`)
      .join('\n')
    notification.error({
      message: apiError.message || 'Datos inválidos',
      description,
      duration: 5,
    })
    return
  }

  message.error(apiError.message || 'Ocurrió un error inesperado')
}

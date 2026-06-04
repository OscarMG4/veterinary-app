import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { STORAGE_KEYS } from '../constants/storage'
import type { LoginRequest, UserRole } from '../interfaces/auth'
import { authService } from '../services/authService'
import { setRedirectingToLogin } from '../utils/errorHandler'

interface AuthContextValue {
  token: string | null
  role: UserRole | null
  username: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  )
  const [role, setRole] = useState<UserRole | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.ROLE)
    return stored === 'ADMIN' || stored === 'STAFF' ? stored : null
  })
  const [username, setUsername] = useState<string | null>(
    () => localStorage.getItem(STORAGE_KEYS.USERNAME),
  )
  const [isLoading, setIsLoading] = useState(
    () => !!localStorage.getItem(STORAGE_KEYS.TOKEN),
  )

  const persistSession = useCallback(
    (newToken: string, newRole: UserRole, newUsername: string) => {
      localStorage.setItem(STORAGE_KEYS.TOKEN, newToken)
      localStorage.setItem(STORAGE_KEYS.ROLE, newRole)
      localStorage.setItem(STORAGE_KEYS.USERNAME, newUsername)
      setToken(newToken)
      setRole(newRole)
      setUsername(newUsername)
    },
    [],
  )

  const clearSession = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN)
    localStorage.removeItem(STORAGE_KEYS.ROLE)
    localStorage.removeItem(STORAGE_KEYS.USERNAME)
    setToken(null)
    setRole(null)
    setUsername(null)
  }, [])

  useEffect(() => {
    if (!token) {
      queueMicrotask(() => setIsLoading(false))
      return
    }

    let cancelled = false

    void authService
      .me()
      .then(({ data }) => {
        if (cancelled) return
        setRedirectingToLogin(false)
        setUsername(data)
        localStorage.setItem(STORAGE_KEYS.USERNAME, data)
      })
      .catch(() => {
        if (!cancelled) clearSession()
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [token, clearSession])

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const { data } = await authService.login(credentials)
      const userRole = data.role as UserRole
      persistSession(data.token, userRole, credentials.username)
      setRedirectingToLogin(false)
      try {
        const meResponse = await authService.me()
        const name = meResponse.data
        setUsername(name)
        localStorage.setItem(STORAGE_KEYS.USERNAME, name)
      } catch {
        /* username already set from credentials */
      }
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    clearSession()
    setRedirectingToLogin(false)
  }, [clearSession])

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      role,
      username,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      logout,
    }),
    [token, role, username, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// src/modules/auth/composables/useAuth.js
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const store = useAuthStore()

  return {
    ...store
  }
}

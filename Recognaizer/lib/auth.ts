export async function checkAuth(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('auth_token')
  if (!token) return false

  try {
    const response = await fetch('/api/auth/verify', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    return response.ok
  } catch {
    return false
  }
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('auth_token', token)
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('auth_token')
}


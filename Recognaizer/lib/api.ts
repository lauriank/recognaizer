import { getAuthToken, setAuthToken, clearAuth } from './auth'

const API_BASE = '/api'

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }))
    throw new Error(error.message || 'Request failed')
  }

  return response.json()
}

export async function signup(email: string, password: string, displayName: string) {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, displayName }),
  })
  if (data.token) {
    setAuthToken(data.token)
  }
  return data
}

export async function login(email: string, password: string) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (data.token) {
    setAuthToken(data.token)
  }
  return data
}

export async function logout() {
  clearAuth()
}

export async function getNextContent() {
  return apiRequest('/content/next')
}

export async function swipeContent(contentId: string, verdict: 'ai' | 'human') {
  return apiRequest('/content/swipe', {
    method: 'POST',
    body: JSON.stringify({ contentId, verdict }),
  })
}

export async function uploadAnalyze(file: File | string, type: 'image' | 'text' | 'video') {
  const formData = new FormData()
  if (typeof file === 'string') {
    formData.append('text', file)
  } else {
    formData.append('file', file)
  }
  formData.append('type', type)

  const token = getAuthToken()
  const headers: HeadersInit = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}/upload/analyze`, {
    method: 'POST',
    headers,
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }))
    throw new Error(error.message || 'Upload failed')
  }

  return response.json()
}

export async function getUserHistory() {
  return apiRequest('/user/history')
}

export async function getLeaderboard() {
  return apiRequest('/leaderboard')
}


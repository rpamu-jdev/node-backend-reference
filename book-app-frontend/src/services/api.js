import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8443/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (username, password) => {
    const response = await apiClient.post('/auth/login', { username, password })
    return response.data.token
  },
}

export const bookAPI = {
  getAll: async (author = null) => {
    const params = author ? { author } : {}
    const response = await apiClient.get('/books', { params })
    return response.data
  },

  getById: async (id) => {
    const response = await apiClient.get(`/books/${id}`)
    return response.data
  },

  create: async (bookData) => {
    const response = await apiClient.post('/books', bookData)
    return response.data
  },

  delete: async (id) => {
    await apiClient.delete(`/books/${id}`)
  },
}

export default apiClient

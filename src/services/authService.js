import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  async verifyToken() {
    const response = await api.get('/auth/verify')
    return response.data
  }
}
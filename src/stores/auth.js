// src/stores/auth.js
import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

function safeParseUser() {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (e) {
    console.error('Error parsing user from localStorage:', e);
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: safeParseUser(),
    token: localStorage.getItem('token') || null,
    roles: [],
    permissions: []
  }),

  getters: {
    isLoggedIn: (state) => !!state.user && !!state.token,
  },

  actions: {
    login(token) {
      this.token = token
      const decoded = jwtDecode(token)

      this.user = decoded.email
      this.roles = decoded.groups || []
      this.permissions = decoded.permissions || []

      localStorage.setItem('token', token)
    },
    setUser(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },
    hasRole(role) {
      return this.roles.includes(role)
    },
    hasPermission(permission) {
      return this.permissions.includes(permission)
    },
    logout() {
      this.user = null;
      this.token = null;
      this.roles = []
      this.permissions = []
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

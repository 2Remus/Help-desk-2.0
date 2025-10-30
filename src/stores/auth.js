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
    permissions: [],
    isReady: false, 

  }),

  getters: {
    isLoggedIn: (state) => !!state.user && !!state.token,
    hasRole: (state) => (role) => state.roles.includes(role),
    hasPermission: (state) => (perm) => state.permissions.includes(perm)
  },

  actions: {
   /* login(token) {
      this.token = token
      const decoded = jwtDecode(token)
      this.user = decoded.email
      this.roles = decoded.roles || []
      this.permissions = decoded.permissions || []

      localStorage.setItem('token', token)
    },
    setUser(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token)
      this.roles = decoded.groups || []
      this.permissions = decoded.permissions || []
    },
    hasRole(role) {
      return this.roles.includes(role)
    },
    hasPermission(permission) {
      return this.permissions.includes(permission)
    },

*/
setUser(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      const decoded = jwtDecode(token)
      this.roles = decoded.groups || decoded.roles || []
      this.permissions = decoded.permissions || []
    },
       setAuth(token) {
      this.token = token
      localStorage.setItem('token', token)
      this.decodeToken(token)
    },
    decodeToken(token) {
      try {
        const decoded = jwtDecode(token)
        this.user = { id: decoded.id, email: decoded.email }
        this.roles = decoded.roles || decoded.groups || []
        this.permissions = decoded.permissions || []
      } catch (err) {
        console.error('Invalid token', err)
      }
    },
    loadFromStorage() {
      const token = localStorage.getItem('token')
      if (token) {
        this.token = token
        this.decodeToken(token)
      }
       this.isReady = true
    },
    logout() {
      this.user = null;
      this.token = null;
      this.roles = []
      this.permissions = []
      //this.isReady = false
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

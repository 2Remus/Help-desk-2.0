// src/stores/auth.js
import { defineStore } from 'pinia';

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
  }),

  getters: {
    isLoggedIn: (state) => !!state.user && !!state.token,
  },

  actions: {
    setUser(user, token) {
      this.user = user;
      this.token = token;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
});

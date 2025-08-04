<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import {  computed } from 'vue';


const auth = useAuthStore();
const router = useRouter();
const isLoggedIn = computed(() => auth.isLoggedIn);
const isAdmin = computed(() => auth.user?.admin);
const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
const goToUsers = () => window.location.href = '/help-desk/user-management';
const goToInstitutions = () => window.location.href = '/help-desk/institution-management';
const goToTickets = () => window.location.href = '/help-desk/tickets';
const goToSubmitTicket = () => window.location.href = '/help-desk/';
</script>


<template>
  <div class="container" v-cloak>
    <div class="sidebar-header">
      <img src="../assets/cardtp.png" alt="cardtp logo" class="sidebar-logo cardtp-logo" />
      <img src="../assets/vswift.png" alt="vswift logo" class="sidebar-logo vswift-logo" />
    </div>
    <nav class="sidebar">
      <ul>
        <li v-if="isAdmin">
          <button class="sidebar-link" @click="goToUsers">
            <i class="fas fa-users"></i>
            <span>Users</span>
          </button>
        </li>
        <li>
          <button class="sidebar-link" @click="goToSubmitTicket">
            <i class="fas fa-users"></i>
            <span>Submit a ticket</span>
          </button>
        </li>
        <li v-if="isAdmin">
          <button class="sidebar-link" @click="goToInstitutions">
            <i class="fas fa-university"></i>
            <span>Institutions</span>
          </button>
        </li>
        <li v-if="isAdmin">
          <button class="sidebar-link" @click="goToTickets">
            <i class="fas fa-ticket-alt"></i>
            <span>Tickets</span>
          </button>
        </li>
        <li v-if="isLoggedIn">
          <button class="sidebar-link logout-button" @click="handleLogout">
            <i class="fas fa-ticket-alt"></i>
            <span>Logout</span>
          </button>
        </li>

      
      </ul>
    </nav>
  </div>
</template>

<style scoped>
.sidebar-header {
  width: 220px;
  position: fixed;
  top: 2rem;
  left: 0;
  z-index: 11;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  background: transparent;
  padding-left: 16px;
  margin-bottom: 8px;
}

.sidebar-logo {
  height: 60px;
  width: auto;
  /* Remove background color */
  background: transparent;
  border-radius: 6px;
  box-shadow: 0 1px 0px rgba(0,123,255,0.07);
  padding: 4px 8px;
  object-fit: contain;
  display: block;
}

.cardtp-logo {
  margin-right: 8px;
}

.vswift-logo {
  margin-left: auto;
}

.sidebar {
  width: 220px;
  position: fixed;
  top: 7rem; /* Adjust so it sits below the header */
  left: 0;
  height: 80%;
  background: #fff;
  padding: 32px 16px;
  border-right: 1px solid #eee;
  box-shadow: 2px 0 8px rgba(0,0,0,0.04);
  border-radius: 0 16px 16px 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.sidebar li {
  margin-bottom: 18px;
  width: 100%;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: #333;
  font-weight: 500;
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  text-align: left;
}

.sidebar-link i {
  font-size: 1.2rem;
  color: #007bff;
  min-width: 24px;
  text-align: center;
}

.sidebar-link:hover,
.sidebar-link.active {
  background: #f0f4ff;
  color: #007bff;
}

.sidebar-link.active i {
  color: #0056b3;
}


.logout-button {
  background-color: #e74c3c;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

/* ...existing styles... */
</style>
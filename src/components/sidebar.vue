<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();

const goToUsers = () => window.location.href = '/help-desk/user-management';
const goToInstitutions = () => window.location.href = '/help-desk/institution-management';
const goToTickets = () => window.location.href = '/help-desk/tickets';
const goToSubmitTicket = () => window.location.href = '/help-desk/';
</script>


<template>
    <div class="container" v-cloak>
    <nav class="sidebar">
      <ul>
        <li>
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
        <li>
          <button class="sidebar-link" @click="goToInstitutions">
            <i class="fas fa-university"></i>
            <span>Institutions</span>
          </button>
        </li>
        <li>
          <button class="sidebar-link" @click="goToTickets">
            <i class="fas fa-ticket-alt"></i>
            <span>Tickets</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
  </template>
  
  <style scoped>
  .sidebar {
    width: 220px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
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
  
  /* ...existing styles... */
  </style>
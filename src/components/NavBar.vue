<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { defineEmits } from 'vue';

const router = useRouter();
const emit = defineEmits(['logout']);

const user = ref(null);

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
});

const isLoggedIn = computed(() => {
  return user.value !== null;
});


const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  user.value = null;
  emit('logout'); // optionally notify parent
  router.push('/login');
};
</script>

<template>
  <nav class="nav-bar">
    <h1>Help Desk System</h1>

    <div class="nav-right" v-if="isLoggedIn">
      <span class="user-email">Logged in as: {{ user.email }}</span>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
  </nav>
</template>

<style scoped>
.nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2c3e50;
  color: white;
  padding: 1rem;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-button {
  background-color: #e74c3c;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
}

.logout-button:hover {
  background-color: #c0392b;
}

.user-email {
  font-size: 0.9rem;
  opacity: 0.9;
}
</style>

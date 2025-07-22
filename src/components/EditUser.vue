<template>
  <div class="user-management">
    <h2>User Management</h2>

    <!-- Add User Form -->
    <div class="add-user-form">
      <h3>Edit User</h3>
      <form @submit.prevent="handleEditUser">
                 
        <div class="form-group">
          <label for="email">Email:</label>
            <input type="hidden" id="id" v-model="user.id" required />        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="user.email" required />
        </div>
            <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="user.name" required />
        </div>
        
        <div class="form-group">
          <label for="role">Role:</label>
          <select id="role" v-model="user.admin">
            <option :value="false">User</option>
            <option :value="true">Admin</option>
          </select>
        </div>
        <div class="form-group" >
          <label for="issueType">Issue Type:</label>
          <select id="issueType" v-model="user.issueType">
            <option value="payment">Payment</option>
            <option value="service">Service</option>
            <option value="account">Account</option>
          </select>
        </div>
        <button type="submit">Save</button>
      </form>
    </div>

   
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default {
  name: 'UserManagement',
  setup() {
  
   const route = useRoute();
   const router = useRouter();
   const usId = route.params.id;
    const user = ref({
      name: '',
      email: '',
      password: '',
      admin: false,
      issueType: 'payment'
    });



      const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${usId}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        user.value = await response.json();
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };



   const handleEditUser = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/edit/${usId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user.value)
        });
        if (!response.ok) throw new Error('Failed to add user');
        router.push('/user-management');
       
      } catch (error) {
        console.error('Error adding user:', error);
      }
    };

  
   
    onMounted(fetchUser);

    return {
      user,
      fetchUser,
      handleEditUser
    };
  }
};
</script>

<style scoped>
.user-management {
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.add-user-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 4px;
}

button:hover {
  background: #0056b3;
}

.delete-btn {
  background: #dc3545;
}

.delete-btn:hover {
  background: #c82333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f8f9fa;
}

.button-group{
  display: flex;
}

</style>
<template>
  <MainTemplate>
  <div class="user-management">
    <h2>User Management</h2>

    <!-- Add User Form -->
    <div class="add-user-form">
      <h3>Add New User</h3>
      <form @submit.prevent="handleAddUser">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="newUser.email" required />
        </div>
            <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="newUser.name" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="newUser.password" required />
        </div>
        <div class="form-group">
          <label for="role">Role:</label>
          <select id="role" v-model="newUser.isAdmin">
            <option :value="false">User</option>
            <option :value="true">Admin</option>
          </select>
        </div>
        <div class="form-group" v-if="newUser.isAdmin">
          <label for="issueType">Issue Type:</label>
          <select id="issueType" v-model="newUser.issueType">
            <option value="payment">Payment</option>
            <option value="service">Service</option>
            <option value="account">Account</option>
          </select>
        </div>
        <button type="submit">Add User</button>
      </form>
    </div>

    <!-- User List -->
    <div class="user-list">
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
             <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Issue Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sysuser in users" :key="sysuser.id">
             <td>{{ sysuser.name }}</td>
            <td>{{ sysuser.email }}</td>
           <td v-if="isAdmin">
                <select @change="handleRoleChange(sysuser)" v-model="sysuser.admin">
                  <option :value="true">Admin</option>
                  <option :value="false">User</option>
                </select>
              </td>
              <td v-else>
                <span v-if="sysuser.admin">Admin</span>
                <span v-else>User</span>
          </td>
            <td v-if="isAdmin">
             <select              
                 @change="handleIssueTypeChange(sysuser)" v-model="sysuser.issueType">
                <option value="payment">Payment</option>
                <option value="service">Service</option>
                <option value="account">Account</option>
              </select>
            
            </td>
            <td v-else>{{ sysuser.issueType }}</td>
            <td>
             <div class="button-group">
                <button class="delete-btn" @click="handleDeleteUser(sysuser.id)">
                  Delete
                </button>
                <RouterLink :to="`/users/edit/${sysuser.id}`"> 
                  <button class="">
                    Edit
                  </button>
                </RouterLink>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </MainTemplate>
</template>

<script>
import { ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import MainTemplate from './MainTemplate.vue';
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth';

export default {
  name: 'UserManagement',
   components: {
    MainTemplate
  },
  setup() {
    const isAdmin = computed(() => {
      return currentUser.value?.admin === true;
    });
  const auth = useAuthStore();

    const toast = useToast()
    const router = useRouter();
    const currentUser = ref(null);
    const users = ref([]);
    const newUser = ref({
      name: '',
      email: '',
      password: '',
      isAdmin: false,
      issueType: 'payment'
    });

    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
         if (!token){
            handleLogout();
         } 
        currentUser.value = jwtDecode(token);
        if(!currentUser.value.admin){
          router.push('/')

        }
        const response = await fetch('http://localhost:8080/api/users',
                     {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch users');
        users.value = await response.json();
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error getting users.');
      }
    };



    const handleAddUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/users/create', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser.value)
        });
        if (!response.ok) throw new Error('Failed to add user');
        
        toast.success('User created successfully!')

        await fetchUsers();
        // Reset form
        newUser.value = {
          name:'',
          email: '',
          password: '',
          isAdmin: false,
          issueType: 'payment'
        };
      } catch (error) {
        console.error('Error adding user:', error);
        toast.error('Something went wrong!')

      }
    };



    const handleDeleteUser = async (userId) => {
      if (!confirm('Are you sure you want to delete this user?')) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) throw new Error('Failed to delete user');
        toast.success('User DELETED successfully!')
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Something went wrong! User not deleted!')

      }
    };



    /**Functional 28-July-2025 */
    const handleRoleChange = async (user) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/users/edit/role/${user.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            admin: user.admin,
            issueType: user.issueType
          })
        });
        if (!response.ok) throw new Error('Failed to update user role');
        toast.success('User role updated successfully!')
        await fetchUsers();
      } catch (error) {
        console.error('Error updating user role:', error);
        toast.error('Error updating user role')

      }
    };


    /*Functional 28-July-2025*/
    const handleIssueTypeChange = async (user) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/users/edit/role/${user.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            admin: user.admin,
            issueType: user.issueType
          })
        });
        if (!response.ok) throw new Error('Failed to update issue type');
        toast.success('User issue type updated successfully!')

        await fetchUsers();
      } catch (error) {
        console.error('Error updating issue type:', error);
        toast.error('Error updating issue type')

      }
    };
 
 
    const handleLogout = () => {
            auth.logout();
            router.push('/login');
        };

     onMounted(() => {
      const token = localStorage.getItem('token');
          if(!auth.user){
            handleLogout();
          }
            if(!token){
                handleLogout()
            }
            fetchUsers()
     });

    return {
      users,
      newUser,
      currentUser,
      isAdmin,
      handleAddUser,
      handleDeleteUser,
      handleRoleChange,
      handleIssueTypeChange,
      handleLogout
      
    };
  }
};
</script>

<style scoped>
.user-management {
  padding: 20px;
 /* max-width: 1000px;*/
 width: 100%;
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
<template>
<MainTemplate>
   <div class="">
    <h2>User Role Management</h2>
    <!-- Add insitution Form -->
    <div class="institution-form-container">
    
      <form class="add-institution-form" @submit.prevent="handleAddUserRole">
          <h3>Add New User Role</h3>
          <div class="form-group">
          <label for="name">Name:</label>
          <input type="name" id="name" v-model="newUserRole.name" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <input type="text" id="description" v-model="newUserRole.description" required />
        </div>
              
      
        <button type="submit"><i class="pi pi-check" style="font-size: 1rem"></i>Add</button>
      </form>
    </div>

    <!-- User List -->
    <div class="listings">
      <h3>User Roles</h3>
      <table>
        <thead>
          <tr>
             <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="userRole in userRoles" :key="userRole.id">
             <td>{{ userRole.name }}</td>
            <td>{{ userRole.description }}</td>
           
             
          
            <td>
              <div class="button-group">
                          
              
                <i class="pi pi-trash" style="font-size: 1rem"  @click="handleDeleteUserRole(userRole.id)" title="Delete"></i>
              
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
import { ref, onMounted,computed } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';
import MainTemplate from './MainTemplate.vue';
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth';

export default {
  name: 'UserRoleManagement',
  components: {
    MainTemplate
  },
  setup() {
    const toast = useToast();
    const router = useRouter();
    const currentUser = ref(null);
    const isAdmin = computed(() => {
      return currentUser.value?.admin === true;
    });
  
    

     const newUserRole = ref({
      name: '',
      description: ''
   
    });
    
    const auth = useAuthStore();
    const userRoles = ref([]);
   
   
 const fetchUserRoles = async () => {
      const token = auth.token;
      console.log("Roles "+token)
      try {
           if (!token) return;
            currentUser.value = jwtDecode(token);
          if(!currentUser.value.admin){
            router.push('/')

          }
          const response = await fetch('http://10.181.1.64:8080/api/user-roles',
        {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch roles');
        userRoles.value = await response.json();
      } catch (error) {
        console.error('Error fetching roles:', error);
       // toast.error('Error fetching issue types');
      }
    };



  


     const handleAddUserRole = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://10.181.1.64:8080/api/user-roles/create', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUserRole.value)
        });
        if (!response.ok) throw new Error('Failed to add User role');
        toast.success('User role added successfully.');
        await fetchUserRoles();

        // Reset form
        newUserRole.value = {
          name:'',
          description: ''
       
        };
      } catch (error) {
        console.error('Error adding user role:', error);
        toast.error('Error adding user role');
      }
    };

 


     const handleDeleteUserRole = async (usrid) => {
      if (!confirm('Are you sure you want to delete this Issue type?')) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://10.181.1.64:8080/api/user-roles/${usrid}`, {
          method: 'DELETE',
           headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) throw new Error('Failed to delete user role');
        toast.success('User role deleted successfully.');
        await fetchUserRoles();
      } catch (error) {
        console.error('Error deleting user role:', error);
        toast.error('Error deleting user role');

      }
    };

    onMounted(fetchUserRoles);

    return {
   
      isAdmin,
      newUserRole,
      userRoles,
      handleDeleteUserRole,
      fetchUserRoles,handleAddUserRole
      
    };
  }
};
</script>

<style scoped>

.main-content{
  display: flex;
  background-color: pink;
  padding:10px;
  width: 100%;
}

.add-institution-form {
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


.institution-form-container {
  width: 100%;
  max-width: 500px;
  padding: 10px;
  display: flex;
  margin: auto;
  box-sizing: border-box;
  
}

.add-institution-form {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 30px;
  border: #DDD solid thin;
/* box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);*/
  width: 100%;
}

.add-institution-form h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}

</style>
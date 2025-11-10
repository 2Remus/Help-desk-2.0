<template>
<MainTemplate>
   <div class="">
    <h2>User Permission Management</h2>
    <!-- Add insitution Form -->
    <div class="institution-form-container">
    
      <form class="add-institution-form" @submit.prevent="handleAddUserPermission">
          <h3>Add New Permission</h3>
        <!--   <div class="form-group">
          <label for="userRole">Role:</label>
          <select id="userRole" v-model="newUserPermission.userRole">
            <option v-for="ur in userRoles" :key="ur.id" :value="ur.name">
                        {{ ur.name }}
                    </option>
          </select>
        </div>--> 
          <div class="form-group">
          <label for="name">Name:</label>
          <input type="name" id="name" v-model="newUserPermission.permission" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <input type="text" id="description" v-model="newUserPermission.description" required />
        </div>
              
      
        <button type="submit"><i class="pi pi-check" style="font-size: 1rem"></i>Add</button>
      </form>
    </div>

    <!-- User List -->
    <div class="listings">
      <h3>Permissions</h3>
      <table>
        <thead>
          <tr>
           <!-- <th>Role</th>-->
             <th>Permission</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="userPermission in userPermissions" :key="userPermission.id">
          <!--  <td>{{ userPermission.userRole.name }}</td> -->
            <td>{{ userPermission.permission }}</td>
            <td>{{ userPermission.description }}</td>
           
             
          
            <td>
              <div class="button-group">
                          
              
                <i class="pi pi-trash" style="font-size: 1rem"  @click="handleDeleteUserPermission(userPermission.id)" title="Delete"></i>
              
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
  
    

     const newUserPermission = ref({
      permission: '',
      description: ''
   
    });
    
    const auth = useAuthStore();
    const userPermissions = ref([]);
   const userRoles = ref([]);
   
 const fetchUserPermissions = async () => {
      const token = auth.token;
      console.log("Roles "+token)
      try {
           if (!token) return;
            currentUser.value = jwtDecode(token);
          if(!currentUser.value.admin){
            router.push('/')

          }
          const response = await fetch('http://10.181.1.64:8080/api/user-permissions',
        {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch permissions');
        userPermissions.value = await response.json();
      } catch (error) {
        console.error('Error fetching permissions:', error);
       // toast.error('Error fetching issue types');
      }
    };



  


     const handleAddUserPermission = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://10.181.1.64:8080/api/user-permissions/create', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUserPermission.value)
        });
        if (!response.ok) throw new Error('Failed to add User permission');
        toast.success('User permission added successfully.');
        await fetchUserPermissions();

        // Reset form
        newUserPermission.value = {
          permission:'',
          description: ''
       
        };
      } catch (error) {
        console.error('Error adding user role:', error);
        toast.error('Error adding user role');
      }
    };

 


     const handleDeleteUserPermission = async (perid) => {
      if (!confirm('Are you sure you want to delete this user permission?')) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://10.181.1.64:8080/api/user-permissions/${perid}`, {
          method: 'DELETE',
           headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) throw new Error('Failed to delete user permission');
        toast.success('User permission deleted successfully.');
        await fetchUserPermissions();
      } catch (error) {
        console.error('Error deleting user permission:', error);
        toast.error('Error deleting user permission');

      }
    };


      
 const fetchUserRoles = async () => {
      const token = auth.token;
      console.log("Roles "+token)
      try {
           if (!token) return;
       
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



    onMounted(fetchUserPermissions(),fetchUserRoles());

    return {
   
      isAdmin,
      newUserPermission,
      userPermissions,
      userRoles,
      handleDeleteUserPermission,
      fetchUserPermissions,handleAddUserPermission,fetchUserRoles
      
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
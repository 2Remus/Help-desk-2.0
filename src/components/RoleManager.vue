<template>
    <MainTemplate>
      <div>
        <h2>Role Manager</h2>
  
        <div class="role-list">
          <h3>Existing Roles</h3>
  
          <table class="roles-table">
            <thead>
              <tr>
                <th>Role Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="role in roles" :key="role.id">
                <td>{{ role.name }}</td>
                <td>
                
                    <i class="pi pi-pencil" style="font-size: 1rem" @click="editRole(role.id)" title="Edit" v-if="$can('update role')"></i> 
                 

                <i class="pi pi-trash" style="font-size: 1rem"  @click="handleDeleteUserRole(role.id)" title="Delete" v-if="$can('delete role')"></i>

                </td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div class="button-group">
          <button @click="goToCreateRole" v-if="$can('create role')">
            <i class="pi pi-plus" style="font-size: 1rem"></i> Add New Role
          </button>
        </div>
      </div>
    </MainTemplate>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import MainTemplate from './MainTemplate.vue';
  
  export default {
    name: 'RoleManager',
    components: { MainTemplate },
    setup() {
      const roles = ref([]);
      const toast = useToast();
      const router = useRouter();
  
      const fetchRoles = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
  
          const response = await fetch('http://10.181.1.64:8080/api/user-roles', {
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) throw new Error('Failed to fetch roles');
          roles.value = await response.json();
        } catch (error) {
          console.error('Error fetching roles:', error);
          toast.error('Error fetching roles');
        }
      };
  
      const editRole = (id) => {
        router.push(`/update-role/${id}`);
      };
  
      const goToCreateRole = () => {
        router.push('/create-role');
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
        await fetchRoles();
      } catch (error) {
        console.error('Error deleting user role:', error);
        toast.error('Error deleting user role');

      }
    };
  
      onMounted(fetchRoles);
  
      return {
        roles,
        editRole,
        goToCreateRole,
        handleDeleteUserRole,
        fetchRoles
      };
    }
  };
  </script>
  
  <style scoped>
  .roles-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .roles-table th,
  .roles-table td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  .edit-btn {
    background: #007bff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .edit-btn:hover {
    background: #0056b3;
  }
  
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background: #0056b3;
  }
  </style>
  
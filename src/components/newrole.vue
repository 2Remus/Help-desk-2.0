<template>
    <MainTemplate>
      <div>
        <h2>Role Management</h2>
  
        <!-- Create Role Form -->
        <div class="form-container">
          <h3>Create Role</h3>
          <form class="add-form" @submit.prevent="handleAddRole">
  
            <div class="form-group">
              <label for="roleName">Role Name:</label>
              <input
                type="text"
                id="roleName"
                v-model="role.name"
                required
                placeholder="Enter role name"
              />
            </div>

              <div class="form-group">
              <label for="description">Description:</label>
              <input
                type="text"
                id="description"
                v-model="role.description"
                required
                placeholder="Enter role description"
              />
            </div>
  
            <div class="form-group">
              <label for="permissions">Assign Permissions:</label>
              <div class="checkbox-group">
                <div
                  v-for="permission in permissions"
                  :key="permission.id"
                  class="checkbox-item"
                >
                  <input
                    type="checkbox"
                    :id="'perm-' + permission.id"
                    :value="permission.permission"
                    v-model="role.permissions"
                  />
                  <label :for="'perm-' + permission.id">
                    {{ permission.permission }}
                  </label>
                </div>
              </div>
            </div>
  
            <div class="button-group">
              <button type="submit">
                <i class="pi pi-check" style="font-size: 1rem"></i> Save
              </button>
              <RouterLink to="/role-management">
                <button type="button">
                  <i class="pi pi-ban" style="font-size: 1rem"></i> Cancel
                </button>
              </RouterLink>
            </div>
          </form>
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
    name: 'RoleManagement',
    components: { MainTemplate },
    setup() {
      const toast = useToast();
      const router = useRouter();
  
      const role = ref({
        name: '',
        descriptions:'',
        permissions: []
      });
  
      const permissions = ref([]);
  
      const fetchPermissions = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
  
          const response = await fetch('http://localhost:8080/api/user-permissions', {
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json'
            }
          });
  
          if (!response.ok) throw new Error('Failed to fetch permissions');
          permissions.value = await response.json();
        } catch (error) {
          console.error('Error fetching permissions:', error);
          toast.error('Error fetching permissions');
        }
      };
  
      const handleAddRole = async () => {
        try {
          const token = localStorage.getItem('token');
          const payload = {
            name: role.value.name,
            permissions: role.value.permissions
          };
  
          const response = await fetch('http://localhost:8080/api/roles', {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
  
          if (!response.ok) throw new Error('Failed to create role');
          toast.success('Role created successfully!');
          router.push('/role-management');
        } catch (error) {
          console.error('Error creating role:', error);
          toast.error('Error creating role');
        }
      };
  
      onMounted(fetchPermissions);
  
      return {
        role,
        permissions,
        handleAddRole
      };
    }
  };
  </script>
  
  <style scoped>
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="text"],
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    box-sizing: border-box;
  }
  
  .checkbox-group {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 8px;
  }
  
  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 5px;
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
  
  @media (max-width: 768px) {
    .button-group {
      flex-direction: column;
    }
  }
  </style>
  
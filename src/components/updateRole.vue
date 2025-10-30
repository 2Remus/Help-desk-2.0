<template>
    <MainTemplate>
        <div class="form-container">
          <h3>Update Role: {{ role.name }}</h3>
  
          <form class="add-form" @submit.prevent="handleUpdateRole">
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
              <label for="permissions">Edit Permissions:</label>
              <div class="checkbox-group">
               

                 <div
                  v-for="permission in allpermissions"
                  :key="permission.id"
                  class="checkbox-item">
                  <input
                    type="checkbox"
                    :id="'perm-' + permission.id"
                    :value="permission.id"
                    v-model="role.permissions"
                  />
                  
                  <label :for="'perm-' + permission.id">{{ permission.permission }}</label>
                </div>
              </div>
            </div>
  
            <div class="button-group">
              <button type="submit">
                <i class="pi pi-check" style="font-size: 1rem"></i> Update
              </button>
              <RouterLink to="/role-management">
                <button type="button">
                  <i class="pi pi-ban" style="font-size: 1rem"></i> Cancel
                </button>
              </RouterLink>
            </div>
          </form>
        </div>
    </MainTemplate>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useToast } from 'vue-toastification';
  import MainTemplate from './MainTemplate.vue';
  import './RoleManager.vue';
  
  export default {
    name: 'UpdateRole',
    components: { MainTemplate },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const toast = useToast();
      const role = ref({
        name: '',
        description:'',
        permissions: []
      });
      const allpermissions = ref([]);
  
      const assignedRolePermissions = ref([]);

      const fetchRoleDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const id = route.params.id;
          const response = await fetch(`http://localhost:8080/api/user-roles/role/${id}`, {
            headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
          });
  
          if (!response.ok) throw new Error('Failed to fetch role');
          role.value = await response.json();
        } catch (error) {
          console.error('Error fetching role:', error);
          toast.error('Error fetching role data');
        }
      };
  

      const fetchPermissions = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch('http://localhost:8080/api/user-permissions', {
            headers: { Authorization: 'Bearer ' + token }
          });
          if (!response.ok) throw new Error('Failed to fetch permissions');
          allpermissions.value = await response.json();
        } catch (error) {
          console.error('Error fetching permissions:', error);
          toast.error('Error fetching permissions');
        }
      };


      const fetchRolePermissions = async () => {
        try {
          const token = localStorage.getItem('token');
          const id = route.params.id;
          const response = await fetch(`http://localhost:8080/api/user-permissions/role/${id}`, {
            headers: { Authorization: 'Bearer ' + token }
          });
  
          if (!response.ok) throw new Error('Failed to fetch permissions');
          assignedRolePermissions.value = await response.json();
         // rolePermissions.value.permissionIds = assignedRolePermissions.value.map(p => p.id)
       //  role.value.permissions = assignedRolePermissions.value.map(p => p.userPermission.id)
         role.value.permissions = assignedRolePermissions.value.map(p => Number(p.userPermission.id))
        } catch (error) {
          console.error('Error fetching permissions:', error);
          toast.error('Error fetching permissions');
        }
      };
  
      const handleUpdateRole = async () => {
        try {
          const token = localStorage.getItem('token');
          const id = route.params.id;
          const payload = {
            name: role.value.name,
            description: role.value.description,
            permissionIds: role.value.permissions
          };
  
          const response = await fetch(`http://localhost:8080/api/user-roles/update/${id}`, {
            method: 'PUT',
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });
  
          if (!response.ok) throw new Error('Failed to update role');
          toast.success('Role updated successfully!');
          router.push('/role-management');
        } catch (error) {
          console.error('Error updating role:', error);
          toast.error('Error updating role');
        }
      };
  
      onMounted(async () => {
         await fetchPermissions();
         await fetchRoleDetails();
         await fetchRolePermissions();
      });
  
      return {
        role,
        allpermissions,
        handleUpdateRole,
        fetchRoleDetails,
        fetchRolePermissions,
        assignedRolePermissions
      };
    }
  };
  </script>
  
  <style scoped>
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.6rem 1.2rem;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  background-color: #fafafa;
}

.checkbox-item {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  padding: 6px 10px;
  transition: background 0.2s ease, transform 0.1s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.checkbox-item:hover {
  background-color: #f0f8ff;
  transform: translateY(-1px);
}

.checkbox-item input[type="checkbox"] {
  accent-color: #007bff; /* modern browsers */
  width: 18px;
  height: 18px;
  cursor: pointer;
  margin-right: 10px;
}

.checkbox-item label {
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  user-select: none;
}

/* Optional: subtle animation on check */
.checkbox-item input[type="checkbox"]:checked + label {
  color: #007bff;
  font-weight: 600;
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



  </style>
  
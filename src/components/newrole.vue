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
                    :value="permission.id"
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
        description:'',
        permissions: []
      });
  
      const permissions = ref([]);
  
      const fetchPermissions = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;
  
          const response = await fetch('https://vswiftsupport.gov.vc/api/user-permissions', {
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
            description: role.value.description,
            permissionIds: role.value.permissions
          };
  
          const response = await fetch('https://vswiftsupport.gov.vc/api/user-roles/add', {
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
  <!--
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
  
  checkbox-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  transition: background 0.2s ease, transform 0.1s ease;
  padding-bottom: 10px;
}

.checkbox-item:hover {
  background-color: #f9fbff;
  transform: translateY(-2px);
}

.checkbox-item label {
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  user-select: none;
  font-weight: 500;
}

/* Hide the default checkbox */
.checkbox-item input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 44px;
  height: 24px;
  background: #ccc;
  border-radius: 24px;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

/* The circle (the "thumb") */
.checkbox-item input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

/* When checked */
.checkbox-item input[type="checkbox"]:checked {
  background: linear-gradient(135deg, #007bff, #00bfff);
}

/* Move the thumb to the right when checked */
.checkbox-item input[type="checkbox"]:checked::before {
  transform: translateX(20px);
}

/* Add subtle glow when active */
.checkbox-item input[type="checkbox"]:active::before {
  width: 20px;
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
  </style>-->
  <style scoped>
  .checkbox-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  transition: background 0.2s ease, transform 0.1s ease;
  margin-bottom: 10px;
}

.checkbox-item:hover {
  background-color: #f9fbff;
  transform: translateY(-2px);
}

.checkbox-item label {
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  user-select: none;
  font-weight: 500;
}

/* Hide the default checkbox */
.checkbox-item input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 44px;
  height: 24px;
  background: #ccc;
  border-radius: 24px;
  position: relative;
  outline: none;
  cursor: pointer;
  transition: background 0.3s ease;
}

/* The circle (the "thumb") */
.checkbox-item input[type="checkbox"]::before {
  content: "";
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
}

/* When checked */
.checkbox-item input[type="checkbox"]:checked {
  background: linear-gradient(135deg, #007bff, #00bfff);
}

/* Move the thumb to the right when checked */
.checkbox-item input[type="checkbox"]:checked::before {
  transform: translateX(20px);
}

/* Add subtle glow when active */
.checkbox-item input[type="checkbox"]:active::before {
  width: 20px;
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
  
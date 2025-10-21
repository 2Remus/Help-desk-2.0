<template>
    <MainTemplate>
        <h2>Update Role</h2>
  
        <div class="form-container">
          <h3>Edit Role: {{ role.name }}</h3>
  
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
              <label for="permissions">Edit Permissions:</label>
              <div class="checkbox-group">
                <div
                  v-for="permission in permissions"
                  :key="permission.id"
                  class="checkbox-item"
                >
                  <input
                    type="checkbox"
                    :id="'perm-' + permission.id"
                    :value="permission.name"
                    v-model="role.permissions"
                  />
                  <label :for="'perm-' + permission.id">{{ permission.name }}</label>
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
  
      const role = ref({ name: '', permissions: [] });
      const permissions = ref([]);
  
      const fetchRole = async () => {
        try {
          const token = localStorage.getItem('token');
          const id = route.params.id;
  
          const response = await fetch(`http://138.68.58.185:8080/api/roles/${id}`, {
            headers: { Authorization: 'Bearer ' + token }
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
          const response = await fetch('http://138.68.58.185:8080/api/permissions', {
            headers: { Authorization: 'Bearer ' + token }
          });
  
          if (!response.ok) throw new Error('Failed to fetch permissions');
          permissions.value = await response.json();
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
            permissions: role.value.permissions
          };
  
          const response = await fetch(`http://138.68.58.185:8080/api/roles/${id}`, {
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
  
      onMounted(() => {
        fetchRole();
        fetchPermissions();
      });
  
      return {
        role,
        permissions,
        handleUpdateRole
      };
    }
  };
  </script>
  
  <style scoped>

  </style>
  
<template>
  <MainTemplate>
  <div class="">
    <h2>User Management</h2>
    <!-- Add User Form -->
    <div class="form-container">
      <h3>Edit User</h3>
      <form class="add-form" @submit.prevent="handleEditUser">
        <div class="form-group">
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
 <div class="form-group">
  <label for="institution">Institution:</label>
  <select id="institution" v-model="user.institution">
    <option v-for="institution in institutions" 
            :key="institution.id" 
            :value="institution">
      {{ institution.name }}
    </option>
  </select>
</div>
        <div class="form-group" >
          <label for="issueType">Issue Type:</label>
           <select id="issueType" v-model="user.issueType">
            <option value=""></option>
            <option v-for="issue in issueTypes" :key="issue.id" :value="issue.name">
                        {{ issue.name }}
                    </option>
          </select>
        </div>
        <div class="button-group">
        <button type="submit"><i class="pi pi-check" style="font-size: 1rem"></i>Save</button>
       <RouterLink to="/user-management"><button><i class="pi pi-ban" style="font-size: 1rem"></i>  Cancel</button></RouterLink> 
       </div>
      </form>
    </div>

   
  </div>
  </MainTemplate>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import MainTemplate from './MainTemplate.vue';
import { useToast } from 'vue-toastification'

export default {
  name: 'UserManagement',
  components: {
    MainTemplate
  },
  setup() {
    const toast = useToast()
    const route = useRoute();
    const router = useRouter();
    const usId = route.params.id;
    const user = ref({
      name: '',
      email: '',
      password: '',
      admin: false,
      issueType: '',
      institution: ''

    });
    const institutions = ref([]);
    const issueTypes = ref([]);


      const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/users/${usId}`,  {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch user');
        user.value = await response.json();
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Error fetching user!')

      }
    };


    const fetchInstitutions = async () => {
      try {
        const token = localStorage.getItem('token');
           if (!token) return;
       
        const response = await fetch('http://localhost:8080/api/institutions',
        {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch Issues');
        institutions.value = await response.json();
      } catch (error) {
        console.error('Error fetching Institutions:', error);
        toast.error('Error fetching Institutions');
      }
    };


   const handleEditUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const payload = {
      ...user.value,
      institution: user.value.institution?.name || "" // ✅ only send name
    };
        const response = await fetch(`http://localhost:8080/api/users/edit/${usId}`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) throw new Error('Failed to add user');
        toast.success('User updated successfully!')
        router.push('/user-management');
       
      } catch (error) {
        console.error('Error editing user:', error);
        toast.error('Error editing user!')

      }
    };

    const fetchIssueTypes = async () => {
      try {
        const token = localStorage.getItem('token');
           if (!token) return;
       
        const response = await fetch('http://localhost:8080/api/issue-types',
        {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch Issues');
        issueTypes.value = await response.json();
      } catch (error) {
        console.error('Error fetching issue types:', error);
        toast.error('Error fetching issue types');
      }
    };
   
    onMounted(
      fetchUser(),
      fetchInstitutions());
      fetchIssueTypes();


    return {
      user,
      institutions,
      issueTypes,
      fetchUser,
      handleEditUser,fetchInstitutions,fetchIssueTypes
    };
  }
};
</script>

<style scoped>


label {
  display: block;
  margin-bottom: 5px;
}

input, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
   box-sizing: border-box;
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

@media (max-width: 768px) {
.button-group {
    flex-direction: column;
  }
}

</style>
<template>
<MainTemplate>
  <div class="user-management">
    <h2>Institution Management</h2>

    <!-- Add User Form -->
    <div class="add-institution-form">
      <h3>Add New Institution</h3>
      <form @submit.prevent="handleAddInstitution">
          <div class="form-group">
          <label for="name">Name:</label>
          <input type="name" id="name" v-model="newInstitution.name" required />
        </div>
        <div class="form-group">
          <label for="address">Address:</label>
          <input type="text" id="address" v-model="newInstitution.address" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="newInstitution.email" required />
        </div>
        <div class="form-group">
          <label for="phoneNumber">Telephone:</label>
          <input type="text" id="phoneNumber" v-model="newInstitution.phoneNumber" required />
        </div>
       
        
      
        <button type="submit">Add</button>
      </form>
    </div>

    <!-- User List -->
    <div class="institution-list">
      <h3>Institutions</h3>
      <table>
        <thead>
          <tr>
             <th>Name</th>
            <th>Address</th>
            <th>Email</th>
            <th>Telephone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="institution in institutions" :key="institution.id">
             <td>{{ institution.name }}</td>
            <td>{{ institution.address }}</td>
            <td>
             {{ institution.email }}
            </td>
            <td>
            {{ institution.phoneNumber }}
             
            </td>
            <td>
              <div class="button-group">
                <button class="delete-btn" @click="handleDeleteInstitution(institution.id)">
                  Delete
                </button>
                <RouterLink :to="`/institutions/edit/${institution.id}`"> 
                  <button class="" >
                    Edit
                  </button>
                </RouterLink>
                <!--
                <button class="" @click="handleDeleteUser(institution.id)">
                  Edit
                </button>
                -->
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

export default {
  name: 'InstitutionManagement',
  components: {
    MainTemplate
  },
  setup() {
    const toast = useToast();
    const users = ref([]);
    const institutions = ref([]);
    const router = useRouter();
    const currentUser = ref(null);
    const isAdmin = computed(() => {
      return currentUser.value?.admin === true;
    });
    const newUser = ref({
      name: '',
      email: '',
      password: '',
      isAdmin: false,
      issueType: 'payment'
    });

     const newInstitution = ref({
      name: '',
      address: '',
      email: '',
      telephone: ''
    });


   
    const fetchInstitutions = async () => {
      try {
        const token = localStorage.getItem('token');
           if (!token) return;
        currentUser.value = jwtDecode(token);
        if(!currentUser.value.admin){
          router.push('/')

        }
        const response = await fetch('http://localhost:8080/api/institutions',
        {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch institutions');
        institutions.value = await response.json();
      } catch (error) {
        console.error('Error fetching institutions:', error);
        toast.error('Error fetching institutions');
      }
    };

   

    
    const handleAddInstitution = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/institutions/create', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newInstitution.value)
        });
        if (!response.ok) throw new Error('Failed to add institution');
        toast.success('Institution added successfully.');
        await fetchInstitutions();

        // Reset form
        newInstitution.value = {
          name:'',
          address: '',
          email: '',
          phoneNumber: ''
        };
      } catch (error) {
        console.error('Error adding institution:', error);
        toast.error('Error adding institution');
      }
    };


       const handleDeleteInstitution = async (instID) => {
      if (!confirm('Are you sure you want to delete this Institution?')) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/institutions/${instID}`, {
          method: 'DELETE',
           headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) throw new Error('Failed to delete institution');
        toast.success('Institution deleted successfully.');
        await fetchInstitutions();
      } catch (error) {
        console.error('Error deleting institution:', error);
        toast.error('Error deleting institution');

      }
    };


    const handleLogout = () => {
            localStorage.removeItem('token');
            router.push('/login');
        };

    onMounted(fetchInstitutions);

    return {
      users,
      institutions,
      newUser,
      newInstitution,
      currentUser,
      isAdmin,
      handleAddInstitution ,
      handleDeleteInstitution 
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

</style>
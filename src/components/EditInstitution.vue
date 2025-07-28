<template>
  <div class="user-management">
    <h2>Institution Management</h2>

    <!-- Add User Form -->
    <div class="add-institution-form">
      <h3>Edit Institution</h3>
      <form @submit.prevent="handleEditInstitution">
          <div class="form-group">
          <input type="hidden" id="id" v-model="existingInstitution.id" required />
        </div>
          <div class="form-group">
          <label for="name">Name:</label>
          <input type="name" id="name" v-model="existingInstitution.name" required />
        </div>
        <div class="form-group">
          <label for="address">Address:</label>
          <input type="text" id="address" v-model="existingInstitution.address" required />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="existingInstitution.email" required />
        </div>
        <div class="form-group">
          <label for="phoneNumber">Telephone:</label>
          <input type="text" id="phoneNumber" v-model="existingInstitution.phoneNumber" required />
        </div>
       
        
      
        <button type="submit">Save</button>
      </form>
    </div>

  </div>
</template>

<script>
//import { router } from 'json-server';
import { ref, onMounted } from 'vue';
 import { useRoute, useRouter } from 'vue-router';
export default {
  name: 'InstitutionManagement',
  setup() {
    const route = useRoute();
    const router = useRouter();
  //   const existingInstitution = ref([]);
    const instId = route.params.id;
    const existingInstitution = ref({
      name: '',
      address: '',
      email: '',
      telephone: ''
    });
   


  

  const fetchInstitution = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/institutions/${instId}`, 
        {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch institution');
        existingInstitution.value = await response.json();
        
      } catch (error) {
        console.error('Error fetching institution:', error);
      }
    };
   

    
    
   const handleEditInstitution = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/institutions/edit/${instId}`, {
          method: 'PUT',
          headers: {
             'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(existingInstitution.value)
        });
        if (!response.ok) throw new Error('Failed to edit institution');
          router.push('/institution-management');
      } catch (error) {
        console.error('Error editing institution:', error);
      }
    };


    onMounted(fetchInstitution);

    return {
      instId,
      existingInstitution,
      fetchInstitution ,
      handleEditInstitution
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
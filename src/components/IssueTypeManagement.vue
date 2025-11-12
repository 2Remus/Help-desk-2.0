<template>
<MainTemplate>
   <div class="">
    <h2>Issue Type Management</h2>
    <!-- Add insitution Form -->
    <div class="institution-form-container"  v-if="$can('create issue type')">
    
      <form class="add-institution-form" @submit.prevent="handleAddIssueType">
          <h3>Add New Issue Type</h3>
          <div class="form-group">
          <label for="name">Name:</label>
          <input type="name" id="name" v-model="newIssueType.name" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <input type="text" id="description" v-model="newIssueType.description" required />
        </div>
              
      
        <button type="submit"><i class="pi pi-check" style="font-size: 1rem"></i>Add</button>
      </form>
    </div>

    <!-- User List -->
    <div class="listings">
      <h3>Issue Types</h3>
      <table>
        <thead>
          <tr>
             <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="issueType in issueTypes" :key="issueType.id">
             <td>{{ issueType.name }}</td>
            <td>{{ issueType.description }}</td>
           
             
          
            <td>
              <div class="button-group">
              <RouterLink :to="`/issue-types/edit-form/${issueType.id}`" v-if="$can('update issue type')" > 

              <i class="pi pi-pencil" style="font-size: 1rem" ></i></RouterLink>
                <i class="pi pi-trash" style="font-size: 1rem"  @click="handleDeleteIssueType(issueType.id)" title="Delete" v-if="$can('delete issue type')"></i>
              
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
  name: 'IssueTypeManagement',
  components: {
    MainTemplate
  },
  setup() {
    const toast = useToast();
    const issueTypes = ref([]);
    const router = useRouter();
    const currentUser = ref(null);
    const isAdmin = computed(() => {
      return currentUser.value?.admin === true;
    });
  
      const newIssueType = ref({
      name: '',
      description: ''
   
    });
    
    const auth = useAuthStore();

   
    const fetchIssueTypes = async () => {
      const token = auth.token;
      console.log("Issues "+token)
      try {
       // const token = localStorage.getItem('token');
           if (!token) return;
        currentUser.value = jwtDecode(token);
        if(!currentUser.value.admin){
          router.push('/')

        }
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
       // toast.error('Error fetching issue types');
      }
    };


     const handleAddIssueType = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/issue-types/create', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newIssueType.value)
        });
        if (!response.ok) throw new Error('Failed to add issue type');
        toast.success('Issue type added successfully.');
        await fetchIssueTypes();

        // Reset form
        newIssueType.value = {
          name:'',
          description: ''
       
        };
      } catch (error) {
        console.error('Error adding issue type:', error);
        toast.error('Error adding issue type');
      }
    };
   const handleDeleteIssueType = async (issueTypeId) => {
      if (!confirm('Are you sure you want to delete this Issue type?')) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/issue-types/${issueTypeId}`, {
          method: 'DELETE',
           headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) throw new Error('Failed to delete issue type');
        toast.success('Issue type deleted successfully.');
        await fetchIssueTypes();
      } catch (error) {
        console.error('Error deleting issue type:', error);
        toast.error('Error deleting issue type');

      }
    };


    onMounted(fetchIssueTypes);

    return {
   
      issueTypes,
      isAdmin,
      newIssueType,
      fetchIssueTypes,
      handleAddIssueType,
      handleDeleteIssueType
      
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
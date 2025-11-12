<template>
  <MainTemplate>
  


    <!-- Add User Form -->
    <div class="form-container">
     
      <form class="add-form" @submit.prevent="handleEditIssueType">
         <h3>Edit Issue Type</h3>
          <div class="form-group">
          <input type="hidden" id="id" v-model="existingIssueType.id" required />
        </div>
          <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="existingIssueType.name" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <input type="text" id="description" v-model="existingIssueType.description" required />
        </div>
     
       
        <div class="button-group">
        <button type="submit"><i class="pi pi-check" style="font-size: 1rem"></i>Save</button>
        <RouterLink to="/issue-types"><button><i class="pi pi-ban" style="font-size: 1rem"></i>Cancel</button></RouterLink>
      </div>
      </form>
    </div>

 
  </MainTemplate>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import MainTemplate from './../components/MainTemplate.vue';
  import { useToast } from 'vue-toastification'


    const toast = useToast();
    const route = useRoute();
    const router = useRouter();
    const issId = route.params.id;
    const existingIssueType = ref({
      name: '',
      description: ''
    
    });
   


  

  const fetchIssueType = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/issue-types/issue-type/${issId}`, 
        {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch issue type');
        existingIssueType.value = await response.json();
        
      } catch (error) {
        console.error('Error fetching institution:', error);
        toast.error('Error fetching institution')
      }
    };
   

    
    
   const handleEditIssueType= async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/issue-types/edit/${issId}`, {
          method: 'PUT',
          headers: {
             'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(existingIssueType.value)
        });
        if (!response.ok) throw new Error('Failed to edit issue type');
        toast.success('Issue type edited successfully');
          router.push('/issue-types');
      } catch (error) {
        console.error('Error editing issue type:', error);
        toast.error('Error editing issue type');
      }
    };


    onMounted( () => {
       fetchIssueType()});



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
@media (max-width: 768px) {
.button-group {
    flex-direction: column;
  }
}

</style>
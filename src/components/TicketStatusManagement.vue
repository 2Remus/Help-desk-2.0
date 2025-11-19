<template>
<MainTemplate>
   <div class="">
    <h2>Ticket Status Management</h2>
    <!-- Add insitution Form -->
    <div class="institution-form-container"   v-if="$can('create ticket status')">
    
      <form class="add-institution-form" @submit.prevent="handleAddTicketStatus">
          <h3>Add New Ticket Status</h3>
          <div class="form-group">
          <label for="name">Name:</label>
          <input type="name" id="name" v-model="newTicketStatus.name" required />
        </div>
        <div class="form-group">
          <label for="description">Description:</label>
          <input type="text" id="description" v-model="newTicketStatus.description" required />
        </div>
              
      
        <button type="submit"><i class="pi pi-check" style="font-size: 1rem"></i>Add</button>
      </form>
    </div>

    <!-- User List -->
    <div class="listings">
      <h3>Ticket Statuses</h3>
      <table>
        <thead>
          <tr>
             <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticketStatus in ticketStatuses" :key="ticketStatus.id">
             <td>{{ ticketStatus.name }}</td>
            <td>{{ ticketStatus.description }}</td>
           
             
          
            <td>
              <div class="button-group">
                          
              
                <i class="pi pi-trash" style="font-size: 1rem"  @click="handleDeleteTicketStatus(ticketStatus.id)" title="Delete"   v-if="$can('delete ticket status')"></i>
              
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  </MainTemplate>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';
import MainTemplate from './MainTemplate.vue';
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth';

  
    const toast = useToast();
    const ticketStatuses = ref([]);
    const router = useRouter();
    const currentUser = ref(null);
    const isAdmin = computed(() => {
      return currentUser.value?.admin === true;
    });
  
      const newTicketStatus = ref({
      name: '',
      description: ''
   
    });
    
    const auth = useAuthStore();

   
    const fetchTicketStatuses = async () => {
      const token = auth.token;
      try {
           if (!token) return;
        currentUser.value = jwtDecode(token);
        if(!currentUser.value.admin){
          router.push('/')

        }
        const response = await fetch('https://vswiftsupport.gov.vc/api/ticket-statuses',
        {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to ticket status');
        ticketStatuses.value = await response.json();
      } catch (error) {
        console.error('Error fetching ticket status:', error);
      }
    };


     const handleAddTicketStatus = async () => {
      try {
        const token = auth.token; // localStorage.getItem('token');
        const response = await fetch('https://vswiftsupport.gov.vc/api/ticket-status/create', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newTicketStatus.value)
        });
        if (!response.ok) throw new Error('Failed to add ticket status');
        toast.success('Ticket Status added successfully.');
        await fetchTicketStatuses();

        // Reset form
        newTicketStatus.value = {
          name:'',
          description: ''
       
        };
      } catch (error) {
        console.error('Error adding ticket status:', error);
        toast.error('Error adding ticket status');
      }
    };


   const handleDeleteTicketStatus = async (ticketStatusId) => {
      if (!confirm('Are you sure you want to delete this Ticket status?')) return;
      try {
        const token = auth.token;//localStorage.getItem('token');
        const response = await fetch(`https://vswiftsupport.gov.vc/api/ticket-status/${ticketStatusId}`, {
          method: 'DELETE',
           headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) throw new Error('Failed to delete ticket status');
        toast.success('Ticket status deleted successfully.');
        await fetchTicketStatuses();
      } catch (error) {
        console.error('Error deleting ticket status:', error);
        toast.error('Error deleting ticket status');

      }
    };


    onMounted(fetchTicketStatuses);


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
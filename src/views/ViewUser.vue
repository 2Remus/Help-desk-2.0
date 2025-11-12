<template>
    <MainTemplate>
        <div >
            <h3>View User</h3>
            <div>
            
              <label>Name: </label> {{ user.name }}<br/>
             <label>Email: </label>  {{ user.email }} <br/>
              <label>Institution: </label> <span v-if="user.institution"> {{ user.institution.name }}</span>
            </div>

        </div>
        <h3 class="text-lg font-semibold mb-4">Roles</h3>
       <input  v-model="userRolesAssignment.userId"   type="hidden"/>
        <div v-for="role in roles" :key="role.id" class="checkbox-item">

                   <input 
            type="checkbox"
            :id="'role-' + role.id"
            :value="role.id"
            v-model="userRolesAssignment.roleIds"
            class="mr-2"
          />
            
          <label :for="'role-' + role.id">{{ role.name }}</label>
     
        </div>

           <button  @click="handleAssignUserRoles()" >Save</button>

    </MainTemplate>
</template>
<script setup>
import { ref, onMounted,computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'
import MainTemplate from '../components/MainTemplate.vue';
import { useAuthStore } from '../stores/auth';
import { jwtDecode } from 'jwt-decode';


const currentUser = computed(() => auth.user?.email);
const toast = useToast()
const route = useRoute();
const router = useRouter();
const usId = route.params.id;
const user = ref('');
const roles = ref([]);
const assignedRoles = ref([]);
const auth = useAuthStore();
const selectedRoles = ref([]);
const userRolesAssignment = ref({
      userId: '',
      roleIds: []
   
    });


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


      
 const fetchUserRoles = async () => {
      const token = auth.token;
      try {
           if (!token) return;
            currentUser.value = jwtDecode(token);
         
          const response = await fetch('http://localhost:8080/api/user-roles',
        {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch roles');
        roles.value = await response.json();
      } catch (error) {
        console.error('Error fetching roles:', error);
       // toast.error('Error fetching issue types');
      }
    };


     const fetchAssignedUserRoles = async () => {
      const token = auth.token;
      try {
           if (!token) return;
            currentUser.value = jwtDecode(token);
         
          const response = await fetch(`http://localhost:8080/api/user/${usId}/roles`,
        {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch assigned roles');
        assignedRoles.value = await response.json();
        userRolesAssignment.value.roleIds = assignedRoles.value.map(r => r.roleId)

      } catch (error) {
        console.error('Error fetching assigned roles:', error);
       // toast.error('Error fetching issue types');
      }
    };



    
     const handleAssignUserRoles = async () => {
      try {
        const token = localStorage.getItem('token');
        userRolesAssignment.value.userId = usId;
        const response = await fetch(`http://localhost:8080/api/user-roles-assigned/create`, {
          
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userRolesAssignment.value)
        });
        if (!response.ok) throw new Error('Failed to add User role');
        toast.success('User role added successfully.');
        await fetchUserRoles();
        await fetchAssignedUserRoles();
     
      } catch (error) {
        console.error('Error adding user role:', error);
        toast.error('Error adding user role');
      }
    };



onMounted(
  async () => {
  fetchUser();
  fetchUserRoles();
  fetchAssignedUserRoles();
  
})
</script>
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

label{
  font-weight:bolder;
}
</style>
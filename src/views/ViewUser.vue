<template>
    <MainTemplate>
        <div>
            <b>View</b>
            <div>
            
              {{ user.name }}<br/>
              {{ user.email }}
            </div>

        </div>
        <h3 class="text-lg font-semibold mb-4">Roles</h3>
       <input  v-model="userRolesAssignment.userId"   type="hidden"/>
        <div v-for="role in roles" :key="role.id" class="flex items-center mb-2">

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

</style>
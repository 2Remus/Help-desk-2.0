<template>
  <MainTemplate>
  <div class="">
    <h2>User Management</h2>

    <!-- Add User Form -->
    <div class="user-form-container"  v-if="$can('create user')">
      <form class="add-user-form" @submit.prevent="handleAddUser"  >
        <h3>Add New User</h3>
       
            <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="newUser.name" required />
        </div>
         <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="newUser.email" required />
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="newUser.password" required />
        </div>
        <div class="form-group">
          <label for="role">Role:</label>
          <select id="role" v-model="newUser.isAdmin">
            <option :value="false">User</option>
            <option :value="true">Admin</option>
          </select>
        </div>
        
        <div class="form-group" v-if="newUser.isAdmin">
          <label for="issueType">Issue Type:</label>
          <select id="issueType" v-model="newUser.issueType">
            <option v-for="issue in issueTypes" :key="issue.id" :value="issue.name">
                        {{ issue.name }}
                    </option>
          </select>
          
          
        </div>

        <div class="form-group">
          <label for="userInstitution">Institution:</label>
         <select id="userInstitution" v-model="newUser.institution">
            <option v-for="institution in institutions" :key="institution.id" :value="institution.name">
                        {{ institution.name }}
                    </option>
          </select>
        </div>
    
        <button type="submit"><i class="pi pi-check" style="font-size: 1rem"></i>Add User</button>
      </form>
    </div>

    <!-- User List -->
    <div class="user-list" v-if="$can('admin')">
      <h3>Users</h3>
      <table>
        <thead>
          <tr>
             <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Issue Type</th>
       
             <th>Institution</th>
                  <th>Status</th>
            <th>Actions</th>
           
          </tr>
        </thead>
        <tbody>   
          <tr v-for="sysuser in users" :key="sysuser.id">
             <td>{{ sysuser.name }}</td>
            <td>{{ sysuser.email }}</td>
           <td v-if="$can('update user')">
                <select @change="handleRoleChange(sysuser)" v-model="sysuser.admin">
                  <option :value="true">Admin</option>
                  <option :value="false">User</option>
                </select>
              </td>
              <td v-else>
                <span v-if="sysuser.admin">Admin</span>
                <span v-else>User</span>
          </td>
            <td >
              <span v-if="$can('update user')">
                <select              
                 @change="handleIssueTypeChange(sysuser)" v-model="sysuser.issueType">
                <option v-for="issue in issueTypes" :key="issue.id" :value="issue.name">
                        {{ issue.name }}
                    </option>
              </select>
              </span>
              <span v-else>{{ sysuser.issueType }} </span>
            
            
            </td>   
            
            <td ><span v-if="sysuser.institution">{{ sysuser.institution.name }}</span></td>
            <td v-if="$can('update user')">
             <select              
                 @change="handleActiveStatusChange(sysuser)" v-model="sysuser.active">
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            
            </td>
            <td>
             <div class="button-group">
               

               <RouterLink :to="`/users/view/${sysuser.id}`" > 
                  <i class="pi pi-eye" style="font-size: 1rem" title="View"></i>
                </RouterLink>


                <RouterLink :to="`/users/edit/${sysuser.id}`" v-if="$can('update user')"> 
                  <i class="pi pi-pencil" style="font-size: 1rem" title="Edit"></i>
                </RouterLink>

                 <i class="pi pi-trash" style="font-size: 1rem" @click="handleDeleteUser(sysuser.id)" title="Delete" v-if="$can('delete user')"></i>
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
import { ref, onMounted } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import MainTemplate from './MainTemplate.vue';
import { useToast } from 'vue-toastification'
import { useAuthStore } from '../stores/auth';

export default {
  name: 'UserManagement',
   components: {
    MainTemplate
  },
  setup() {
    const isAdmin = computed(() => {
      return currentUser.value?.admin === true;
    });
  const auth = useAuthStore();

    const toast = useToast()
    const router = useRouter();
    const currentUser = ref(null);
    const users = ref([]);
    const newUser = ref({
      name: '',
      email: '',
      password: '',
      isAdmin: false,
      issueType: '',
      institution: ''
    });
    const issueTypes = ref([]);
    const institutions = ref([]);
    const roles  = ref([]);
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
         if (!token){
            handleLogout();
         } 
        currentUser.value = jwtDecode(token);
        if(!currentUser.value.admin){
          router.push('/')

        }
        const response = await fetch('http://10.181.1.64:8080/api/users',
                     {
                    headers: {
                        "Authorization": "Bearer "+ token,
                         "Content-Type": "application/json"
                    }
                });
        if (!response.ok) throw new Error('Failed to fetch users');
        users.value = await response.json();
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Error getting users.');
      }
    };



    const handleAddUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://10.181.1.64:8080/api/users/create', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser.value)
        });
        if (!response.ok) throw new Error('Failed to add user');
        
        toast.success('User created successfully!')

        await fetchUsers();
        // Reset form
        newUser.value = {
          name:'',
          email: '',
          password: '',
          isAdmin: false,
          issueType: 'payment',
          userInstitution: ''
        };
      } catch (error) {
        console.error('Error adding user:', error);
        toast.error('Something went wrong!')

      }
    };



    const handleDeleteUser = async (userId) => {
      if (!confirm('Are you sure you want to delete this user?')) return;
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://10.181.1.64:8080/api/users/change/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': 'Bearer '+ token,
            'Content-Type': 'application/json'
          },
        });
        if (!response.ok) throw new Error('Failed to delete user');
        toast.success('User DELETED successfully!')
        await fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Something went wrong! User not deleted!')

      }
    };



    /**Functional 28-July-2025 */
    const handleRoleChange = async (user) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://10.181.1.64:8080/api/users/edit/role/${user.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            admin: user.admin,
            issueType: user.issueType
          })
        });
        if (!response.ok) throw new Error('Failed to update user role');
        toast.success('User role updated successfully!')
        await fetchUsers();
      } catch (error) {
        console.error('Error updating user role:', error);
        toast.error('Error updating user role')

      }
    };


    /*Functional 28-July-2025*/
    const handleIssueTypeChange = async (user) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://10.181.1.64:8080/api/users/edit/role/${user.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            admin: user.admin,
            issueType: user.issueType
          })
        });
        if (!response.ok) throw new Error('Failed to update issue type');
        toast.success('User issue type updated successfully!')

        await fetchUsers();
      } catch (error) {
        console.error('Error updating issue type:', error);
        toast.error('Error updating issue type')

      }
    };
 

     const handleActiveStatusChange = async (user) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://10.181.1.64:8080/api/users/edit/activeStatus/${user.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': 'Bearer '+token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            active: user.active
          })
        });
        if (!response.ok) throw new Error('Failed to update issue type');
        toast.success('User status updated successfully!')

        await fetchUsers();
      } catch (error) {
        console.error('Error updating status:', error);
        toast.error('Error updating status')

      }
    };
 

       const fetchIssueTypes = async () => {
      try {
        const token = localStorage.getItem('token');
           if (!token) return;
       
        const response = await fetch('http://10.181.1.64:8080/api/issue-types',
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


 const fetchInstitutions = async () => {
      try {
        const token = localStorage.getItem('token');
           if (!token) return;
       
        const response = await fetch('http://10.181.1.64:8080/api/institutions',
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

    const handleLogout = () => {
            auth.logout();
            router.push('/login');
        };

        
     onMounted(() => {
      const token = localStorage.getItem('token');
          if(!auth.user){
            handleLogout();
          }
            if(!token){
                handleLogout()
            }
            fetchUsers()
            fetchIssueTypes()
            fetchInstitutions()

     });

     const fetchUserRoles = async () => {
      const token = auth.token;
      console.log("Roles "+token)
      try {
           if (!token) return;
            currentUser.value = jwtDecode(token);
          if(!currentUser.value.admin){
            router.push('/')

          }
          const response = await fetch('http://10.181.1.64:8080/api/user-roles',
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
      }
    };


    return {
      users,
      newUser,
      currentUser,
      isAdmin,
      handleAddUser,
      handleDeleteUser,
      handleRoleChange,
      handleIssueTypeChange,
      handleLogout,
      handleActiveStatusChange,
      issueTypes,
      fetchIssueTypes,
      fetchInstitutions,
      institutions

      
    };
  }
};
</script>

<style scoped>
.user-list1{
  background-color: orange;
  display: flex;

}
.user-management {
  padding: 20px;
 /* max-width: 1000px;*/
 width: 100%;
  margin: 0 auto;
}

.add-user-form {
  background-color: #f9f9f9;
  border-radius: 10px;
  padding: 30px;
  border: #DDD solid thin;
/* box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);*/
  width: 100%;
}

.add-user-form h2 {
  margin-bottom: 20px;
  text-align: center;
  color: #333;
}


.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: bold;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}



.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
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
i{
  margin-right: 10px;
}
i:hover{
  cursor: pointer;
}
a{
  text-decoration: none;
  text-emphasis-color: none;
}
li a {
    text-decoration: none;
    text-emphasis-color: none;
}


.user-form-container {
  width: 100%;
  max-width: 500px;
  padding: 10px;
  display: flex;
  margin: auto;
  box-sizing: border-box;
  
}
/* Table styling */
.user-list ,table {
  /* width: 980px;*/
  width: 980px;
  border-collapse: collapse;
  box-sizing: border-box;
 }

.user-list th,
.user-list td {
  /*border: 1px solid #ddd;*/
   border-collapse: collapse;
  padding: 8px;
}

/* Responsive table for mobile */
@media (max-width: 768px) {
  .user-list table,
  .user-list thead,
  .user-list tbody,
  .user-list th,
  .user-list td,
  .user-list tr {
    display: block;
  }
  .user-list thead tr {
    display: none;
  }
  .user-list tr {
    margin-bottom: 20px;
    border-bottom: 2px solid #ddd;
  }
  .user-list td {
  /*  padding-left: 50%;*/
    position: relative;
    text-align: left;
  }
  .user-list td::before {
    content: attr(data-label);
    position: absolute;
    left: 15px;
    font-weight: bold;
  }
}
</style>
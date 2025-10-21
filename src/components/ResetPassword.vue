<template>  
    <div align="center">        
        <img src="../assets/vswift.png" alt="cardtp logo" class="logo"  />
        <h2>Support</h2>
    </div>
    <div class="login-form">
        
   
      
        <form @submit="handleReset">
            <div class="form-group">
                <label for="password">New Password:</label>
                <input type="password" id="password" v-model="password" required />
            </div> 
          
            <button type="submit">Submit</button>
        </form>
        <br/>
       
        <div v-if="error" class="error">{{ error }}</div>
    </div>
</template>

<script setup>
import { ref ,nextTick} from 'vue';
import { useRouter,useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';


        const email = ref('');
        const password = ref('');
        const error = ref('');
        const router = useRouter();
        const auth = useAuthStore();
        const message = ref('');
        const route = useRoute()
        const token = route.query.token

        const handleReset = async (event) => {
            event.preventDefault(); 
            try {
                const response = await fetch(`http://localhost:8080/api/reset-password/${token}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: password.value
                    }),
                });

            
                message.value = 'Password reset successfully.'
                error.value = ''
               router.push('/login');
           
            } catch (err) {
                error.value = err.response?.data?.message || 'Failed to reset password.'
                message.value = ''
            }
        };

      
 
</script>

<style scoped>
.logo {
  height: 80px;
}
.login-form {
    max-width: 400px;
    margin: 40px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
}
h2 {
    text-align: center;
}
.form-group {
    margin-bottom: 15px;
}
label {
    display: block;
    margin-bottom: 5px;
}
input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
}
button {
    width: 100%;
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
button:hover {
    background-color: #0056b3;
}
.error {
    color: red;
    text-align: center;
    margin-top: 10px;
}
</style>
<template>  
    <div align="center">        
        <img src="../assets/vswift.png" alt="cardtp logo" class="logo"  />
        <h2>Support</h2>
        <h4>Forgot Password</h4>
    </div>
    <div class="login-form">
        
   
      
        <form @submit="handleLogin">
            <div class="form-group">
                <label for="email">Email:</label>
                <input type="email" id="email" v-model="email" required />
            </div> 
          
            <button type="submit">Submit</button>
        </form>
        <br/>
  <div class="options-group">
        <div class="option-item">
        <RouterLink to="/login"><i class="pi pi-user"></i>Login</RouterLink>
        </div>
   
     </div>
       <div v-if="message" class="message">{{ message }}</div>
        <div v-if="error" class="error">{{ error }}</div>
    </div>
</template>

<script setup>
import { ref ,nextTick} from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';


        const email = ref('');
        const password = ref('');
        const error = ref('');
        const router = useRouter();
        const auth = useAuthStore();
        const message = ref('');

        const handleLogin = async (event) => {
            event.preventDefault(); 
            try {
                const response = await fetch('https://vswiftsupport.gov.vc/api/forgot-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email.value
                    }),
                });
                if(response.ok){
                message.value = 'A reset link has been sent to your email.'
                }else{
                    const resData = await response.json().catch(() => ({})) // safe parse
                    error.value = resData.message || 'Reset Password Failed.'
                    setTimeout(() => {
                        router.push('/login')
                        }, 5000)
    
                
                }
               
           
            } catch (err) {
                error.value = 'Reset Password Failed.';
                console.log("Error encountered ",err)
            }
        };

      
 
</script>

<style scoped>
.options-group{
     display: flex;
    margin: auto;
   
    padding:10px;
}
.option-item{
    margin-right: 20px;
}
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
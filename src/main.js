import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import './style.css'

// Import Vue Router
import router from './router'

// Create and mount app
const app = createApp(App)
const pinia = createPinia();


app.use(pinia);
app.use(router)
app.mount('#app')

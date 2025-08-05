import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import './style.css'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
// Import Vue Router
import router from './router'


// Create and mount app
const app = createApp(App)
const pinia = createPinia();
app.use(Toast, {
  timeout: 3000,
  position: POSITION.TOP_RIGHT,
})

app.use(pinia);
app.use(router)
app.mount('#app')

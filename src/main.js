import { createApp } from 'vue'
import { createPinia } from 'pinia';
import App from './App.vue'
import './style.css'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import 'primeicons/primeicons.css'

// Import Vue Router
import router from './router'
import { useAuthStore } from './stores/auth'
import { can } from './utils/permissions'

// Create and mount app
const app = createApp(App)
const pinia = createPinia();
app.use(Toast, {
  timeout: 3000,
  position: POSITION.TOP_RIGHT,
})

app.use(pinia);
app.use(router);

// Load user data from token if available
const auth = useAuthStore()
auth.loadFromStorage()

// ✅ Make `can()` globally available
app.config.globalProperties.$can = can
app.mount('#app')

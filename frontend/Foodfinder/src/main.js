import '@/assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; // Correct import
import { createPinia } from 'pinia'
import axios from 'axios'

const app = createApp(App)
const pinia = createPinia()
// Navigation guard
router.beforeEach((to, from, next) => {
    // Check if the route requires authentication
    if (to.matched.some(record => record.meta.requiresAuth)) {
      // If the user is not logged in (i.e., no token in localStorage)
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to the login page if not authenticated
        next({ path: '/login' });
      } else {
        // Proceed to the route if authenticated
        next();
      }
    } else {
      // If no authentication required, proceed to the route
      next();
    }
  });
  
  app.use(router);

  
  app.mount('#app');
app.use(pinia)



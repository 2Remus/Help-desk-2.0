import { createRouter, createWebHistory } from 'vue-router'
import Client from '../components/client.vue'
import TicketList from '../components/ticket_list.vue'
import UserManagement from '../components/userManagement.vue'
import Login from '../components/Login.vue'
import InstitutionManagement from '../components/institutionManagement.vue'
import EditInstitution from '../components/EditInstitution.vue'
import EditUser from '../components/EditUser.vue'
import ViewTicket from '../components/ViewTicket.vue'
import RegisterForm from '../components/RegisterForm.vue'
import ActivateView from '../components/Activate.vue'
import FequentlyAskedQuestions from '../components/FequentlyAskedQuestions.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes: [
     {
      path: '/',
      name: 'Client',
      component: Client
    },
    {
      path: '/tickets',
      name: 'TicketList',
      component: TicketList
    },
    {
      path: '/user-management',
      name: 'UserManagement',
      component: UserManagement
    },
    {
      path: '/institution-management',
      name: 'InstitutionManagement',
      component: InstitutionManagement
    },
     {
      path: '/institutions/edit/:id',
      name: 'edit-institution',
      component: EditInstitution
    },
    {
      path: '/users/edit/:id',
      name: 'edit-user',
      component: EditUser
    },
     {
      path: '/tickets/view/:id',
      name: 'view-ticket',
      component: ViewTicket
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterForm
    },
    {
      path: '/activate',
      name: 'activate-account',
      component: ActivateView
    },
     {
      path: '/frequently-asked-questions',
      name: 'frequently-asked-questions',
      component: FequentlyAskedQuestions
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

/*
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token && to.path !== '/login') {
    // No token, redirect to login
    next('/login');
  } else if (to.path === '/login' && token) {
    // Already logged in, redirect based on role
    if (user?.admin) {
      next('/tickets');
    } else {
      next('/');
    }
  } else {
    next(); // Allow normal navigation
  }
});*/
/*
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Allow access to login page without token
  if (to.path === '/login') {
    next();
  } else if (!isLoggedIn) {
    // Redirect all other routes to /login if not logged in
    next('/login');
  } else {
    next(); // allow navigation
  }
});
*/


/*
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // Allow access to login page without token
  if (to.path === '/login') {
    next();
  } else if (!isLoggedIn) {
    // Redirect all other routes to /login if not logged in
    next('/login');
  } else {
    next(); // allow navigation
  }
});


router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (to.path === '/admin' && (!token || !user?.admin)) {
    next('/login');
  } else if (to.path === '/' && !token) {
    next('/login');
  } else {
    next();
  }
});


router.beforeEach((to, from, next) => {
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const token = localStorage.getItem('token');

  if (authRequired && !token) {
    return next('/login');
  }

  if (to.path === '/' && token) {
    return next('/'); // or your main page after login
  }

  next();
});*/

export default router
